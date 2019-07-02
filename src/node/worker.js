/**
 *
 * Node worker implementation
 *
 * @fileoverview Node worker implementation
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */

const check = require('check-types');
const workerUtils = require('../common/workerUtils');
const b64toU8Array = require('./b64toU8Array');

let TesseractCore = null;

/*
 * register message handler
 */
process.on('message', (packet) => {
  workerUtils.dispatchHandlers(packet, obj => process.send(obj));
});

/*
 * getCore is a sync function to load and return
 * TesseractCore.
 */
workerUtils.setAdapter({
  getCore: (corePath, res) => {
    if (check.null(TesseractCore)) {
      res.progress({ status: 'loading tesseract core', progress: 0 });
      TesseractCore = require('tesseract.js-core');
      res.progress({ status: 'loaded tesseract core', progress: 1 });
    }
    return TesseractCore;
  },
  b64toU8Array,
  writeFile: (path, data) => {
    const fs = require('fs');
    fs.writeFile(path, data, (err) => {
      if (err) throw err;
    });
  },
});
