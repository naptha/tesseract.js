const workerUtils = require('../common/worker.js');

if (process.env.NODE_ENV === 'development') {
  console.debug('Using Development Worker');
}

global.addEventListener('message', ({ data }) => {
  workerUtils.dispatchHandlers(data, obj => postMessage(obj));
});

workerUtils.setAdapter({
  getCore: (req, res) => {
    if (!global.TesseractCore) {
      res.progress({ status: 'loading tesseract core', progress: 0 });
      global.importScripts(req.workerOptions.corePath);
      res.progress({ status: 'loading tesseract core', progress: 1 });
    }
    return global.TesseractCore;
  },
});
