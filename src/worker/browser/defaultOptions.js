'use strict';

const version = require('../../../package.json').version;
const defaultOptions = require('../../constants/defaultOptions');

/*
 * Default options for browser worker
 */
module.exports = {
  ...defaultOptions,
  workerPath: `https://cdn.jsdelivr.net/npm/tesseract.js@v${version}/dist/worker.min.js`,
};
