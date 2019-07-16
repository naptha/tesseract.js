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
    tessjs_create_pdf: '0',
    tessjs_create_hocr: '1',
    tessjs_create_tsv: '1',
    tessjs_create_box: '0',
    tessjs_create_unlv: '0',
    tessjs_create_osd: '0',
    tessjs_textonly_pdf: '0',
    tessjs_pdf_name: 'tesseract.js-ocr-result',
    tessjs_pdf_title: 'Tesseract.js OCR Result',
    tessjs_pdf_auto_download: true,
    tessjs_pdf_bin: false,
    tessjs_image_rectangle_left: 0,
    tessjs_image_rectangle_top: 0,
    tessjs_image_rectangle_width: -1,
    tessjs_image_rectangle_height: -1,
  },
};
