const check = require('check-types');
const workerUtils = require('../common/worker');

let TesseractCore = null;

process.on('message', (packet) => {
  workerUtils.dispatchHandlers(packet, obj => process.send(obj));
});

workerUtils.setAdapter({
  getCore: (corePath, res) => {
    if (check.null(TesseractCore)) {
      res.progress({ status: 'loading tesseract core', progress: 0 });
      TesseractCore = require('tesseract.js-core');
      res.progress({ status: 'loaded tesseract core', progress: 1 });
    }
    return TesseractCore;
  },
});
