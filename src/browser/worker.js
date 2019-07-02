/**
 *
 * Browser worker implementation
 *
 * @fileoverview Browser worker implementation
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */

const check = require('check-types');
const workerUtils = require('../common/workerUtils');
const b64toU8Array = require('./b64toU8Array');

/*
 * register message handler
 */
global.addEventListener('message', ({ data }) => {
  workerUtils.dispatchHandlers(data, obj => postMessage(obj));
});

/*
 * getCore is a sync function to load and return
 * TesseractCore.
 */
workerUtils.setAdapter({
  getCore: (corePath, res) => {
    if (check.undefined(global.TesseractCore)) {
      res.progress({ status: 'loading tesseract core', progress: 0 });
      global.importScripts(corePath);
      /*
       * Depending on whether the browser supports WebAssembly,
       * the version of the TesseractCore will be different.
       */
      if (check.not.undefined(global.TesseractCoreWASM) && typeof WebAssembly === 'object') {
        global.TesseractCore = global.TesseractCoreWASM;
      } else if (check.not.undefined(global.TesseractCoreASM)) {
        global.TesseractCore = global.TesseractCoreASM;
      } else {
        throw Error('Failed to load TesseractCore');
      }
      res.progress({ status: 'loading tesseract core', progress: 1 });
    }
    return global.TesseractCore;
  },
  b64toU8Array,
  writeFile: (path, data, type) => {
    postMessage({
      jobId: 'Download',
      path,
      data,
      type,
    });
  },
});
