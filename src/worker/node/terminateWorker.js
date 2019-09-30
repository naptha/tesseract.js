/**
 * terminateWorker
 *
 * @name terminateWorker
 * @function kill worker
 * @access public
 * @param {object} instance TesseractWorker instance
 */
module.exports = (worker) => {
  worker.kill();
};
