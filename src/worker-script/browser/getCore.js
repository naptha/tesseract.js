const { simd } = require('wasm-feature-detect');
const { dependencies } = require('../../../package.json');

module.exports = async (corePath, res) => {
  if (typeof global.TesseractCore === 'undefined') {
    res.progress({ status: 'loading tesseract core', progress: 0 });

    // If the user specifies a core path, we use that
    // Otherwise, default to CDN
    const corePathImport = corePath || `https://cdn.jsdelivr.net/npm/tesseract.js-core@v${dependencies['tesseract.js-core'].substring(1)}`;

    // If a user specifies a specific JavaScript file, load that file.
    // Otherwise, assume a directory has been provided, and load either
    // tesseract-core.wasm.js or tesseract-core-simd.wasm.js depending
    // on whether this device has SIMD support.
    let corePathImportFile;
    if (corePathImport.slice(-2) === 'js') {
      corePathImportFile = corePathImport;
    } else {
      const simdSupport = await simd();
      if (simdSupport) {
        corePathImportFile = `${corePathImport.replace(/\/$/, '')}/tesseract-core-simd.wasm.js`;
      } else {
        corePathImportFile = `${corePathImport.replace(/\/$/, '')}/tesseract-core.wasm.js`;
      }
    }

    // Create a module named `global.TesseractCore`
    global.importScripts(corePathImportFile);

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
