const { OEM, PSM } = require('./types');

module.exports = {
  defaultOptions: {
    /*
     * default path for downloading *.traineddata, this URL basically
     * points to a github page, not using jsDelivr as there is is limitation
     * of 20 MB.
     */
    langPath: 'https://tessdata.projectnaptha.com/4.0.0',
  },
  /*
   * default params for recognize()
   */
  defaultParams: {
    tessedit_ocr_engine_mode: OEM.TESSERACT_LSTM_COMBINED,
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
    tessedit_char_whiltelist: '',
    tessedit_create_pdf: '0',
    textonly_pdf: '0',
    pdf_name: 'tesseract.js-ocr-result',
    pdf_title: 'Tesseract.js OCR Result',
  },
};
