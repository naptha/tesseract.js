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
    this._currentJob = null;
    this._queue = [];
  }

  recognize(image, lang = 'eng', params = {}) {
    return this._delay((job) => {
      job._send(
        'recognize',
        {
          image,
          lang,
          params,
          options: this.options,
        },
      );
    });
  }

  detect(image, params = {}) {
    return this._delay((job) => {
      job._send(
        'detect',
        {
          image,
          lang: 'osd',
          params,
          options: this.options,
        },
      );
    });
  }

  terminate() {
    if (this.worker) {
      adapter.terminateWorker(this);
    }
    this.worker = null;
    this._currentJob = null;
    this._queue = [];
  }

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
      this._dequeue();
    }
    return job;
  }

  _dequeue() {
    this._currentJob = null;
    if (this._queue.length) {
      this._queue[0]();
    }
  }

  _recv(packet) {
    if (this._currentJob.id === packet.jobId) {
      this._currentJob._handle({
        ...packet,
        data: packet.status === 'resolve' && packet.action === 'recognize'
          ? circularize(packet.data)
          : packet.data,
      });
    } else {
      console.warn(`Job ID ${packet.jobId} not known.`);
    }
  }
}

module.exports = TesseractWorker;
