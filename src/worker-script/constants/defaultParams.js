/*
 * default params for tesseract.js
 */
const PSM = require('../../constants/PSM');

module.exports = {
  tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
  tessedit_char_whitelist: '',
  tessjs_create_hocr: '1',
  tessjs_create_tsv: '1',
  tessjs_create_box: '0',
  tessjs_create_unlv: '0',
  tessjs_create_osd: '0',
};
