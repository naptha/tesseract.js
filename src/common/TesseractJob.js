/**
 *
 * The job exectued by worker, each job is basically a recognition of an image.
 *
 * @fileoverview Job excuted by Worker
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
const adapter = require('../node/');

/** A global job counter as part of job id */
let jobCounter = 0;

class TesseractJob {
  /**
   * constructor
   *
   * @name constructor
   * @function initial a TesseractJob
   * @access public
   * @param {object} worker - An instance of TesseractWorker
   */
  constructor(worker) {
    jobCounter += 1;
    this.id = `Job-${jobCounter}-${Math.random().toString(16).slice(3, 8)}`;

    this._worker = worker;

    /**
     * As all the callback functions are saved in an array.
     * Basically you can register more than callback function
     * for then, catch, progress and finally.
     */
    this._resolve = [];
    this._reject = [];
    this._progress = [];
    this._finally = [];
  }

  /**
   * then
   *
   * @name then
   * @function A function to chain like Promise
   * @access public
   * @param {function} resolve - called when the job succeeds
   * @param {function} reject - called when the job fails
   */
  then(resolve, reject) {
    return new Promise((res, rej) => {
      if (!this._resolve.push) {
        res(this._result);
      } else {
        this._resolve.push(res);
      }
      this.catch(rej);
    }).then(resolve, reject);
  }

  /**
   * catch
   *
   * @name catch
   * @function register a function to call when there is an error
   * @access public
   * @param {function} reject - callback function for error
   */
  catch(reject) {
    if (this._reject.push) {
      this._reject.push(reject);
    } else {
      reject(this._reject);
    }
    return this;
  }

  /**
   * progress
   *
   * @name progress
   * @function register a function to show progress of the recognition,
   *   use res.progress to print the message
   * @access public
   * @param {function} fn - callback function for progress information
   */
  progress(fn) {
    this._progress.push(fn);
    return this;
  }

  /**
   * finally
   *
   * @name finally
   * @function registry a callback function for final
   * @access public
   * @param {function} fn - callback function for final
   */
  finally(fn) {
    this._finally.push(fn);
    return this;
  }

  /**
   * send
   *
   * @name send
   * @function send specific action with payload a worker
   * @access public
   * @param {string} action - action to trigger, should be "recognize" or "detect"
   * @param {object} payload - data to be consumed
   */
  send(action, payload) {
    adapter.sendPacket(this._worker, {
      jobId: this.id,
      action,
      payload,
    });
  }

  /**
   * handle
   *
   * @name handle
   * @function execute packet action
   * @access public
   * @param {object} packet action and payload to handle
   */
  handle(packet) {
    const { data } = packet;
    let runFinallyCbs = false;

    if (packet.status === 'resolve') {
      if (this._resolve.length === 0) console.log(data);
      this._resolve.forEach((fn) => {
        const ret = fn(data);
        if (ret && typeof ret.then === 'function') {
          console.warn('TesseractJob instances do not chain like ES6 Promises. To convert it into a real promise, use Promise.resolve.');
        }
      });
      this._resolve = data;
      this._worker.dequeue();
      runFinallyCbs = true;
    } else if (packet.status === 'reject') {
      if (this._reject.length === 0) console.error(data);
      this._reject.forEach(fn => fn(data));
      this._reject = data;
      this._worker.dequeue();
      runFinallyCbs = true;
    } else if (packet.status === 'progress') {
      this._progress.forEach(fn => fn(data));
    } else {
      console.warn('Message type unknown', packet.status);
    }

    if (runFinallyCbs) {
      this._finally.forEach(fn => fn(data));
    }
  }
}

module.exports = TesseractJob;
