const path = require('node:path');
const defaultOptions = require('../../constants/defaultOptions');

/*
 * Default options for node worker
 */
module.exports = {
  ...defaultOptions,
  workerPath: path.join(__dirname, '..', '..', 'worker-script', 'node', 'index.js'),
};
