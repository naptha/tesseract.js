module.exports = (corePath, res) => {
  if (typeof global.TesseractCore === 'undefined') {
    res.progress({ status: 'loading tesseract core', progress: 0 });
    global.importScripts(corePath);
    /*
     * Depending on whether the browser supports WebAssembly,
     * the version of the TesseractCore will be different.
     */
    if (typeof global.TesseractCoreWASM !== 'undefined' && typeof WebAssembly === 'object') {
      global.TesseractCore = global.TesseractCoreWASM;
    } else if (typeof global.TesseractCoreASM !== 'undefined') {
      global.TesseractCore = global.TesseractCoreASM;
    } else {
      throw Error('Failed to load TesseractCore');
    }
    res.progress({ status: 'loading tesseract core', progress: 1 });
  }
  return global.TesseractCore;
};
