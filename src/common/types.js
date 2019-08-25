module.exports = {
  /*
   * OEM = OCR Engine Mode, and there are 5 possible modes.
   *
   * By default tesseract.js uses TESSERACT_LSTM_COMBINED mode, which uses LSTM when possible.
   * If you need to use some tesseract v3 features (like tessedit_char_whitelist),
   * you need to use TESSERACT_ONLY mode.
   *
   */
  OEM: {
    TESSERACT_ONLY: 0,
    LSTM_ONLY: 1,
    TESSERACT_LSTM_COMBINED: 2,
    DEFAULT: 3,
  },
  /*
   * PSM = Page Segmentation Mode
   */
  PSM: {
    OSD_ONLY: '0',
    AUTO_OSD: '1',
    AUTO_ONLY: '2',
    AUTO: '3',
    SINGLE_COLUMN: '4',
    SINGLE_BLOCK_VERT_TEXT: '5',
    SINGLE_BLOCK: '6',
    SINGLE_LINE: '7',
    SINGLE_WORD: '8',
    SINGLE_CHAR: '9',
    SPARSE_TEXT: '10',
    SPARSE_TEXT_OSD: '11',
    RAW_LINE: '12',
  },
};
