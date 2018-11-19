const check = require('check-types');
const adapter = require('./node');
const circularize = require('./common/circularize');
const TesseractJob = require('./common/job');

class TesseractWorker {
  constructor(workerOptions = {}) {
    this.worker = null;
    this.workerOptions = Object.assign({}, adapter.defaultOptions, workerOptions);
    this._currentJob = null;
    this._queue = [];
  }

  recognize(image, options = { lang: 'eng' }) {
    return this._delay((job) => {
      job._send(
        'recognize',
        {
          image,
          options: check.string(options)
            ? { lang: options || 'eng' }
            : options,
          workerOptions: this.workerOptions,
        },
      );
    });
  }

  detect(image, options = {}) {
    return this._delay((job) => {
      job._send(
        'detect',
        {
          image,
          options,
          workerOptions: this.workerOptions,
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
      this.worker = adapter.spawnWorker(this, this.workerOptions);
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

module.exports = {
  TesseractWorker,
};
