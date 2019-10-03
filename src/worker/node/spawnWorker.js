const { fork } = require('child_process');

/**
 * spawnWorker
 *
 * @name spawnWorker
 * @function fork a new process in node
 * @access public
 */
module.exports = ({ workerPath }) => (
  fork(workerPath)
);
