const { fork } = require('child_process');

/**
 * spawnWorker
 *
 * @name spawnWorker
 * @function fork a new process in node
 * @access public
 * @param {object} instance - TesseractWorker instance
 * @param {object} options
 * @param {string} options.workerPath - worker script path
 */
module.exports = ({ workerPath }) => (
  fork(workerPath)
);
