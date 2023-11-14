## Local Installation

Check here for examples: https://github.com/naptha/tesseract.js/blob/master/docs/examples.md 

In browser environment, `tesseract.js` simply provides the API layer. Internally, it opens a WebWorker to handle requests. That worker itself loads code from the Emscripten-built `tesseract.js-core` which itself is hosted on a CDN. Then it dynamically loads language files hosted on another CDN.

Because of this we recommend loading `tesseract.js` from a CDN. But if you really need to have all your files local, you can pass extra arguments to `TesseractWorker` to specify custom paths for workers, languages, and core.

In Node.js environment, the only path you may want to customize is languages/langPath.

```javascript
const worker = await createWorker('eng', 1, {
  workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@v5.0.0/dist/worker.min.js',
  langPath: 'https://tessdata.projectnaptha.com/4.0.0',
  corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.0.0',
});
```

### workerPath
A string specifying the location of the `worker.js` file.

### langPath
A string specifying the location of the tesseract language files. Language file URLs are calculated according to the formula `langPath + langCode + '.traineddata.gz'`.  If `langPath` is not specified by the user, then the correct language data will be automatically downloaded from the jsDelivr CDN. 

### corePath
A string specifying the location of the [tesseract.js-core](https://github.com/naptha/tesseract.js-core) files, with default value 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.0.0'.

If you set the `corePath` argument, be sure to set it to a directory that contains **all 4** of these files:

1. `tesseract-core.wasm.js`
2. `tesseract-core-simd.wasm.js`
3. `tesseract-core-lstm.wasm.js`
4. `tesseract-core-simd-lstm.wasm.js`

Tesseract.js will pick the correct file based on your users' device and the `createWorker` options. 

To avoid breaking old code, when `corePath` is set to a specific `.js` file (e.g. `https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.0.0/tesseract-core.wasm.js`), it will load that file regardless of whether the users' device supports SIMD or not.  This behavior only exists to preserve backwards compatibility—setting `corePath` to a specific `.js` file is strongly discouraged.  Doing so will either result in much slower performance (if `tesseract-core.wasm.js` is specified) or failure to run on certain devices (if `tesseract-core-simd.wasm.js` is specified).
