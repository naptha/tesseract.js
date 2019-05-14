module.exports = {
  /*
   * OEM = OCR Engine Mode, and there are 5 possible modes.
   *
   * By default tesseract.js uses DEFAULT mode, which uses LSTM when possible.
   * If you need to use some tesseract v3 features (like tessedit_chars_whitelist),
   * you need to use TESSERACT_ONLY mode.
   *
   */
  OEM: {
    TESSERACT_ONLY: 0,
    LSTM_ONLY: 1,
    TESSERACT_LSTM_COMBINED: 2,
    DEFAULT: 3,
    COUNT: 4,
  },
};
