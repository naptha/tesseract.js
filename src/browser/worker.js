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
const resolveURL = require('resolve-url');
const workerUtils = require('../common/workerUtils');

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
      global.importScripts(resolveURL(corePath));
      /*
       * Depending on whether the browser supports WebAssembly,
       * the version of the TesseractCore will be different.
       */
      global.TesseractCore = typeof WebAssembly === 'object' ? global.TesseractCoreWASM : global.TesseractCoreASM;
      res.progress({ status: 'loading tesseract core', progress: 1 });
    }
    return global.TesseractCore;
  },
});
