const check = require('check-types');
const workerUtils = require('../common/worker');

let TesseractCore = null;

process.on('message', (packet) => {
  workerUtils.dispatchHandlers(packet, obj => process.send(obj));
});

workerUtils.setAdapter({
  getCore: (req, res) => {
    if (check.null(TesseractCore)) {
      res.progress({ status: 'loading tesseract core' });
      TesseractCore = require('tesseract.js-core');
      res.progress({ status: 'loaded tesseract core' });
    }
    return TesseractCore;
  },
});
