/**
 *
 * Entry point for tesseract.js, should be the entry when bundling.
 *
 * @fileoverview entry point for tesseract.js
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
const utils = require('tesseract.js-utils');
const TesseractWorker = require('./common/TesseractWorker');
const types = require('./common/types');

module.exports = {
  /** Worker for OCR, @see common/TesseractWorker.js */
  TesseractWorker,
  /** Utilities for tesseract.js, @see {@link https://www.npmjs.com/package/tesseract.js-utils} */
  utils,
  /** Check ./common/types for more details */
  ...types,
};
