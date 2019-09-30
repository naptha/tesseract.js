const { readImage } = require('tesseract.js-utils');

/**
 * setImage
 *
 * @name setImage
 * @function set image in tesseract for recognition
 * @access public
 * @param {array} image - binary array in array format
 * @returns {number} - an emscripten pointer of the image
 */
exports.setImage = (TessModule, api, image, params) => {
  const {
    tessjs_image_rectangle_left: left,
    tessjs_image_rectangle_top: top,
    tessjs_image_rectangle_width: width,
    tessjs_image_rectangle_height: height,
  } = params;
  const {
    w, h, bytesPerPixel, data, pix,
  } = readImage(TessModule, Array.from(image));

  /*
   * As some image format (ex. bmp) is not supported natiely by tesseract,
   * sometimes it will not return pix directly, but data and bytesPerPixel
   * for another SetImage usage.
   *
   */
  if (data === null) {
    api.SetImage(pix);
  } else {
    api.SetImage(data, w, h, bytesPerPixel, w * bytesPerPixel);
  }
  api.SetRectangle(
    (left < 0) ? 0 : left,
    (top < 0) ? 0 : top,
    (width < 0) ? w : width,
    (height < 0) ? h : height,
  );
  return data === null ? pix : data;
};

exports.getLangsStr = langs => (
  typeof langs === 'string'
    ? langs
    : langs.map(lang => (typeof lang === 'string' ? lang : lang.data)).join('+')
);

/**
 * handleOutput
 *
 * @name handleOutput
 * @function handle file output
 * @access private
 * @param {object} customParams - an object of params
 */
exports.getFiles = (TessModule, api, adapter, params) => {
  let files = {};
  const {
    tessjs_create_pdf,
    tessjs_textonly_pdf,
    tessjs_pdf_name,
    tessjs_pdf_title,
    tessjs_pdf_auto_download,
    tessjs_pdf_bin,
  } = params;

  if (tessjs_create_pdf === '1') {
    const pdfRenderer = new TessModule.TessPDFRenderer(tessjs_pdf_name, '/', tessjs_textonly_pdf === '1');
    pdfRenderer.BeginDocument(tessjs_pdf_title);
    pdfRenderer.AddImage(api);
    pdfRenderer.EndDocument();
    TessModule._free(pdfRenderer);

    const data = TessModule.FS.readFile(`/${tessjs_pdf_name}.pdf`);

    if (tessjs_pdf_bin) {
      files = { pdf: data, ...files };
    }

    if (tessjs_pdf_auto_download) {
      adapter.writeFile(`${tessjs_pdf_name}.pdf`, data, 'application/pdf');
    }
  }

  return files;
};
