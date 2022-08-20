const { simd } = require('wasm-feature-detect');

let TesseractCore = null;
/*
 * getCore is a sync function to load and return
 * TesseractCore.
 */
module.exports = async (_, res) => {
  if (TesseractCore === null) {
    const simdSupport = await simd();
    res.progress({ status: 'loading tesseract core', progress: 0 });
    if (simdSupport) {
      TesseractCore = require('tesseract.js-core/tesseract-core-simd');
    } else {
      TesseractCore = require('tesseract.js-core/tesseract-core');
    }
    res.progress({ status: 'loaded tesseract core', progress: 1 });
  }
  return TesseractCore;
};
