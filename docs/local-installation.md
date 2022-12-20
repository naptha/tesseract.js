## Local Installation

Check here for examples: https://github.com/naptha/tesseract.js/blob/master/docs/examples.md 

In browser environment, `tesseract.js` simply provides the API layer. Internally, it opens a WebWorker to handle requests. That worker itself loads code from the Emscripten-built `tesseract.js-core` which itself is hosted on a CDN. Then it dynamically loads language files hosted on another CDN.

Because of this we recommend loading `tesseract.js` from a CDN. But if you really need to have all your files local, you can pass extra arguments to `TesseractWorker` to specify custom paths for workers, languages, and core.

In Node.js environment, the only path you may want to customize is languages/langPath.

```javascript
Tesseract.recognize(image, langs, {
  workerPath: 'https://unpkg.com/tesseract.js@v4.0.1/dist/worker.min.js',
  langPath: 'https://tessdata.projectnaptha.com/4.0.0',
  corePath: 'https://unpkg.com/tesseract.js-core@v4.0.1/tesseract-core.wasm.js',
})
```

Or

```javascript
const worker = await createWorker({
  workerPath: 'https://unpkg.com/tesseract.js@v4.0.1/dist/worker.min.js',
  langPath: 'https://tessdata.projectnaptha.com/4.0.0',
  corePath: 'https://unpkg.com/tesseract.js-core@v4.0.1/tesseract-core.wasm.js',
});
```

### workerPath
A string specifying the location of the [worker.js](./dist/worker.min.js) file.

### langPath
A string specifying the location of the tesseract language files, with default value 'https://tessdata.projectnaptha.com/4.0.0'. Language file URLs are calculated according to the formula `langPath + langCode + '.traineddata.gz'`.

### corePath
A string specifying the location of the [tesseract.js-core library](https://github.com/naptha/tesseract.js-core), with default value 'https://unpkg.com/tesseract.js-core@v4.0.1/tesseract-core.wasm.js'.

Another WASM option is 'https://unpkg.com/tesseract.js-core@v4.0.1/tesseract-core.js' which is a script that loads 'https://unpkg.com/tesseract.js-core@v4.0.1/tesseract-core.wasm'. But it fails to fetch at this moment.
