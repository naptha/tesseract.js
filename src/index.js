/**
 *
 * Entry point for tesseract.js, should be the entry when bundling.
 *
 * @fileoverview entry point for tesseract.js
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
require('regenerator-runtime/runtime');
const createScheduler = require('./createScheduler');
const createWorker = require('./createWorker');
const createJob = require('./createJob');
const Tesseract = require('./Tesseract');
const OEM = require('./constants/OEM');
const PSM = require('./constants/PSM');

module.exports = {
  OEM,
  PSM,
  createScheduler,
  createWorker,
  createJob,
  ...Tesseract,
};
