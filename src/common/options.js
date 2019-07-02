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
    tessedit_ocr_engine_mode: OEM.LSTM_ONLY,
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
    tessedit_char_whiltelist: '',
    tessedit_create_pdf: '0',
    tessedit_create_hocr: '1',
    tessedit_create_tsv: '1',
    tessedit_create_box: '0',
    tessedit_create_unlv: '0',
    tessedit_create_osd: '0',
    textonly_pdf: '0',
    pdf_name: 'tesseract.js-ocr-result',
    pdf_title: 'Tesseract.js OCR Result',
    pdf_auto_download: true,
    pdf_bin: false,
  },
};
