/**
 *
 * Tesseract Worker Script for Node
 *
 * @fileoverview Node worker implementation
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */

const worker = require('../');
const exportFile = require('./exportFile');

let TesseractCore = null;

/*
 * register message handler
 */
process.on('message', (packet) => {
  worker.dispatchHandlers(packet, obj => process.send(obj));
});

/*
 * getCore is a sync function to load and return
 * TesseractCore.
 */
const getCore = (_, res) => {
  if (TesseractCore === null) {
    res.progress({ status: 'loading tesseract core', progress: 0 });
    TesseractCore = require('tesseract.js-core');
    res.progress({ status: 'loaded tesseract core', progress: 1 });
  }
  return TesseractCore;
};

worker.setAdapter({
  getCore,
  exportFile,
});
