const { simd } = require('wasm-feature-detect');
const { dependencies } = require('../../../package.json');

module.exports = async (corePath, res) => {
  if (typeof global.TesseractCore === 'undefined') {
    res.progress({ status: 'loading tesseract core', progress: 0 });

    // If the user specifies a core path, we use that
    // Otherwise, we detect the correct core based on SIMD support
    let corePathImport = corePath;
    if (!corePathImport) {
      const simdSupport = await simd();
      if (simdSupport) {
        corePathImport = `https://unpkg.com/tesseract.js-core@v${dependencies['tesseract.js-core'].substring(1)}/tesseract-core-simd.wasm.js`;
      } else {
        corePathImport = `https://unpkg.com/tesseract.js-core@v${dependencies['tesseract.js-core'].substring(1)}/tesseract-core.wasm.js`;
      }
    }

    // Create a module named `global.TesseractCore`
    global.importScripts(corePathImport);

    // Tesseract.js-core versions through 4.0.3 create a module named `global.TesseractCoreWASM`,
    // so we account for that here to preserve backwards compatibility.
    // This part can be removed when Tesseract.js-core v4.0.3 becomes incompatible for other reasons
    if (typeof global.TesseractCore === 'undefined' && typeof global.TesseractCoreWASM !== 'undefined' && typeof WebAssembly === 'object') {
      global.TesseractCore = global.TesseractCoreWASM;
    } else if (typeof global.TesseractCore === 'undefined') {
      throw Error('Failed to load TesseractCore');
    }
    res.progress({ status: 'loading tesseract core', progress: 1 });
  }
  return global.TesseractCore;
};
