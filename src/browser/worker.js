const resolveURL = require('resolve-url');
const workerUtils = require('../common/worker');

global.addEventListener('message', ({ data }) => {
  workerUtils.dispatchHandlers(data, obj => postMessage(obj));
});

workerUtils.setAdapter({
  getCore: (corePath, res) => {
    if (!global.TesseractCore) {
      res.progress({ status: 'loading tesseract core', progress: 0 });
      global.importScripts(resolveURL(corePath));
      global.TesseractCore = typeof WebAssembly === 'object' ? global.TesseractCoreWASM : global.TesseractCoreASM;
      res.progress({ status: 'loading tesseract core', progress: 1 });
    }
    return global.TesseractCore;
  },
});
