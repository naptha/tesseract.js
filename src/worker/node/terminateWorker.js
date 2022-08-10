/**
 * terminateWorker
 *
 * @name terminateWorker
 * @function kill worker
 * @access public
 */
module.exports = (worker) => {
  worker.terminate();
};
