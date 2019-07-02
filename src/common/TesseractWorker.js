/**
 *
 * The core part of tesseract.js to execute the OCR jobs.
 *
 * @fileoverview Worker for OCR jobs
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
const check = require('check-types');
const resolveURL = (typeof window !== 'undefined' && typeof window.document !== 'undefined') ? require('resolve-url') : s => s;
const adapter = require('../node');
const circularize = require('./circularize');
const TesseractJob = require('./TesseractJob');

/**
 * TesseractWorker
 * @name TesseractWorker
 * @function execute TesseractJob with a queue mechanism
 * @access public
 */
class TesseractWorker {
  /**
   * constructor
   *
   * @name constructor
   * @function initialize the worker
   * @access public
   * @param {object} options - worker configurations
   * @param {string} options.workerPath -
   *     A remote path to load worker script.
   *     In browser-like environment, it is downloaded from a CDN service.
   *     Please update this option if you self-host the worker script.
   *     In Node.js environment, this option is not used as the worker script is in local.
   * @param {string} options.corePath -
   *     A remote path to load tesseract.js-core script.
   *     In browser-like environment, it is downloaded from a CDN service.
   *     Please update this option if you self-host the core script.
   *     In Node.js environment, this option is not used as the core script is in local.
   * @param {string} options.langPath -
   *     A remote path to load *.traineddata.gz, it is download from a CDN service.
   *     Please update this option if you self-host the worker script.
   * @param {string} [options.cachePath=.] - @see {@link https://github.com/jeromewu/tesseract.js-utils/blob/master/src/loadLang.js}
   * @param {string} [options.cacheMethod=write] - @see {@link https://github.com/jeromewu/tesseract.js-utils/blob/master/src/loadLang.js}
   * @param {string} [options.dataPath=.] - @see {@link https://github.com/jeromewu/tesseract.js-utils/blob/master/src/loadLang.js}
   *
   */
  constructor(options = {}) {
    this.worker = null;
    this.options = {
      ...adapter.defaultOptions,
      ...options,
    };
    ['corePath', 'workerPath', 'langPath'].forEach((key) => {
      if (check.not.undefined(options[key])) {
        this.options = { ...this.options, [key]: resolveURL(options[key]) };
      }
    });
    this._currentJob = null;
    this._queue = [];
  }

  /**
   * recognize
   *
   * @name recognize
   * @function recognize text in given image
   * @access public
   * @param {Buffer, string} image - image to be recognized
   * @param {string, array} [langs=eng] - languages to recognize
   * @param {object} params - tesseract parameters
   *
   */
  recognize(image, langs = 'eng', params = {}) {
    return this._sendJob('recognize', image, langs, params);
  }

  /**
   * detect
   *
   * @name detect
   * @function detect language of the text in the image
   * @access public
   * @param {Buffer, string} image - image to be recognized
   * @param {object} params - tesseract parameters
   *
   */
  detect(image, params = {}) {
    return this._sendJob('detect', image, 'osd', params);
  }

  /**
   * recv
   *
   * @name recv
   * @function handle completed job
   * @access public
   * @param {object} packet job data
   */
  recv(packet) {
    if (this._currentJob.id === packet.jobId) {
      this._currentJob.handle({
        ...packet,
        data: packet.status === 'resolve' && packet.action === 'recognize'
          ? circularize(packet.data)
          : packet.data,
      });
    } else {
      console.warn(`Job ID ${packet.jobId} not known.`);
    }
  }

  /**
   * dequeue
   *
   * @name dequeue
   * @function dequeue and execute the rear job
   * @access public
   */
  dequeue() {
    this._currentJob = null;
    if (this._queue.length) {
      this._queue[0]();
    }
  }

  /**
   * terminate
   *
   * @name terminate
   * @function terminate the worker
   * @access public
   *
   */
  terminate() {
    if (this.worker) {
      adapter.terminateWorker(this);
    }
    this.worker = null;
    this._currentJob = null;
    this._queue = [];
  }

  /**
   * _sendJob
   *
   * @name _sendJob
   * @function append a new job to the job queue
   * @access private
   * @param {string} type job type, should be recognize or detect
   * @param {Buffer, string} image image to recognize
   * @param {string} lang language to recognize
   * @param {object} params tesseract parameters
   */
  _sendJob(type, image, langs, params) {
    return this._delay((job) => {
      job.send(
        type,
        {
          image,
          langs,
          params,
          options: this.options,
        },
      );
    });
  }

  /**
   * _delay
   *
   * @name _delay
   * @function delays the fn to execute until it is on the rear of the queue
   * @access private
   * @param {function} fn A handler function for the job
   */
  _delay(fn) {
    if (check.null(this.worker)) {
      this.worker = adapter.spawnWorker(this, this.options);
    }

    const job = new TesseractJob(this);
    this._queue.push(() => {
      this._queue.shift();
      this._currentJob = job;
      fn(job);
    });
    if (check.null(this._currentJob)) {
      this.dequeue();
    }
    return job;
  }
}

module.exports = TesseractWorker;
