/**
 * handleOutput
 *
 * @name handleOutput
 * @function handle file output
 * @access private
 * @param {object} customParams - an object of params
 */
module.exports = (TessModule, api, adapter, params) => {
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
      adapter.exportFile(`${tessjs_pdf_name}.pdf`, data, 'application/pdf');
    }
  }

  return files;
};
