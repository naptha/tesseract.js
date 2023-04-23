## Local Installation

Check here for examples: https://github.com/naptha/tesseract.js/blob/master/docs/examples.md 

In browser environment, `tesseract.js` simply provides the API layer. Internally, it opens a WebWorker to handle requests. That worker itself loads code from the Emscripten-built `tesseract.js-core` which itself is hosted on a CDN. Then it dynamically loads language files hosted on another CDN.

Because of this we recommend loading `tesseract.js` from a CDN. But if you really need to have all your files local, you can pass extra arguments to `TesseractWorker` to specify custom paths for workers, languages, and core.

In Node.js environment, the only path you may want to customize is languages/langPath.

```javascript
Tesseract.recognize(image, langs, {
  workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@v4.0.3/dist/worker.min.js',
  langPath: 'https://tessdata.projectnaptha.com/4.0.0',
  corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v4.0.3',
})
```

Or

```javascript
const worker = await createWorker({
  workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@v4.0.3/dist/worker.min.js',
  langPath: 'https://tessdata.projectnaptha.com/4.0.0',
  corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v4.0.3',
});
```

### workerPath
A string specifying the location of the `worker.js` file.

### langPath
A string specifying the location of the tesseract language files, with default value 'https://tessdata.projectnaptha.com/4.0.0'. Language file URLs are calculated according to the formula `langPath + langCode + '.traineddata.gz'`.

### corePath
A string specifying the location of the [tesseract.js-core library](https://github.com/naptha/tesseract.js-core), with default value 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v4.0.3'.

When `corePath` is a directory rather than specific `.js` file (e.g. `https://cdn.jsdelivr.net/npm/tesseract.js-core@v4.0.3`), Tesseract.js loads either `tesseract-core-simd.wasm.js` or `tesseract-core.wasm.js` depending on whether the users' device supports SIMD (see [https://webassembly.org/roadmap/](https://webassembly.org/roadmap/)).  Therefore, if self-hosting it is important that both these files are in the location you specify for `corePath`.  Having multiple files is necessary as the SIMD-enabled version is *significantly* faster (for the LSTM model [the default]), however is not yet supported on all devices. 

When `corePath` is set to a specific `.js` file (e.g. `https://cdn.jsdelivr.net/npm/tesseract.js-core@v4.0.3/tesseract-core.wasm.js`), it will load that file regardless of whether the users' device supports SIMD or not.  This behavior exists to preserve backwards compatibility--specifying a directory that contains both files is strongly recommended.  Specifying a single file will either result in much slower performance (if `tesseract-core.wasm.js` is specified) or failure to run on certain devices (if `tesseract-core-simd.wasm.js` is specified). 
