'use strict';

const { simd, relaxedSimd } = require('wasm-feature-detect');
const OEM = require('../../constants/OEM');

let TesseractCore = null;
/*
 * getCore is a sync function to load and return
 * TesseractCore.
 */
module.exports = async (oem, _, res) => {
  if (TesseractCore === null) {
    const statusText = 'loading tesseract core';

    const simdSupport = await simd();
    const relaxedSimdSupport = await relaxedSimd();
    res.progress({ status: statusText, progress: 0 });
    if (relaxedSimdSupport) {
      if ([OEM.DEFAULT, OEM.LSTM_ONLY].includes(oem)) {
        TesseractCore = require('tesseract.js-core/tesseract-core-relaxedsimd-lstm');
      } else {
        TesseractCore = require('tesseract.js-core/tesseract-core-relaxedsimd');
      }
    } else if (simdSupport) {
      if ([OEM.DEFAULT, OEM.LSTM_ONLY].includes(oem)) {
        TesseractCore = require('tesseract.js-core/tesseract-core-simd-lstm');
      } else {
        TesseractCore = require('tesseract.js-core/tesseract-core-simd');
      }
    } else if ([OEM.DEFAULT, OEM.LSTM_ONLY].includes(oem)) {
      TesseractCore = require('tesseract.js-core/tesseract-core-lstm');
    } else {
      TesseractCore = require('tesseract.js-core/tesseract-core');
    }
    res.progress({ status: statusText, progress: 1 });
  }
  return TesseractCore;
};
