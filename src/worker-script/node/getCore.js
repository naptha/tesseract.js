let TesseractCore = null;
/*
 * getCore is a sync function to load and return
 * TesseractCore.
 */
module.exports = (_, res) => {
  if (TesseractCore === null) {
    res.progress({ status: 'loading tesseract core', progress: 0 });
    TesseractCore = require('tesseract.js-core');
    res.progress({ status: 'loaded tesseract core', progress: 1 });
  }
  return TesseractCore;
};
