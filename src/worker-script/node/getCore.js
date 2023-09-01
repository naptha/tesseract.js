const { simd } = require('wasm-feature-detect');
const OEM = require('../../constants/OEM');

let TesseractCore = null;
/*
 * getCore is a sync function to load and return
 * TesseractCore.
 */
module.exports = async (oem, _, res) => {
  if (TesseractCore === null) {
    const simdSupport = await simd();
    res.progress({ status: 'loading tesseract core', progress: 0 });
    if (simdSupport) {
      if (oem === OEM.LSTM_ONLY) {
        TesseractCore = require('tesseract.js-core/tesseract-core-simd-lstm');
      } else {
        TesseractCore = require('tesseract.js-core/tesseract-core-simd');
      }
    } else {
      if (oem === OEM.LSTM_ONLY) {
        TesseractCore = require('tesseract.js-core/tesseract-core-lstm');
      } else {
        TesseractCore = require('tesseract.js-core/tesseract-core');
      }
    }
    res.progress({ status: 'loaded tesseract core', progress: 1 });
  }
  return TesseractCore;
};
