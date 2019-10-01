/*
 * default params for tesseract.js
 */
const PSM = require('../../constants/PSM');

module.exports = {
  tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
  tessedit_char_whiltelist: '',
  user_defined_dpi: '300',
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
};
