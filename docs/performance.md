# Overview
This guide contains tips and strategies for getting the fastest performance from Tesseract.js.  While some of the tips below involve avoiding pitfalls and should be universally implemented, other strategies (changing the language data or recognition model) may harm recognition quality.  Therefore, whether these strategies are appropriate depends on the application, and users should always benchmark performance and quality before changing important settings from their defaults. 

# Reducing Setup Time
Within certain applications, the majority of runtime may be attributable to setup steps (`createWorker`, `worker.initialize`, and `worker.loadLanguage`) rather than recognition (`worker.recognize`).  Implementing the strategies in this section should reduce the time spent on these steps. 

Notably, the time spent on setup for first-time users may not be apparent to developers, as Tesseract.js caches language data after it is downloaded for the first time. To experience Tesseract.js as a first-time user, set `cacheMethod: 'none'` in the [createWorker options](./api.md#createworkeroptions-worker).  Be sure to remove this setting before publishing your app.
### Reuse Workers
When recognizing multiple images, some users will create/load/destroy a new worker for each image.  This is never the correct option.  If the images are being recognized one after the other, all of the extra `createWorker`/`worker.initialize`/`worker.loadLanguage` steps are wasted runtime, as `worker.recognize` could be run with the same `worker`.  Workers do not break after one use. 

Alternatively, if images are being recognized in parallel, then creating a new worker for each recognition job is likely to cause crashes due to resource limitations.  As each Tesseract.js worker uses a high amount of memory, code should never be able to create an arbitrary number of `workers`.  Instead, schedulers should be used to create a specific pool for workers (say, 4 workers), and then jobs assigned through the scheduler.
### Set Up Workers Ahead of Time
Rather than waiting until the last minute to load code and data, you can set up a worker ahead of time.  Doing so greatly reduces runtime the first time a user run recognition.  This requires managing workers rather than using `Tesseract.recognize`, which is explained [here](./intro.md).  An example where a worker is prepared ahead of time can be found [here](../examples/browser/basic-efficient.html).

The appropriate time to load Tesseract.js workers and data is application-specific.  For example, if you have an web app where only 5% of users need OCR, it likely does not make sense to download ~15MB in code and data upon a page load.  You could consider instead loading Tesseract.js when a user indicates they want to perform OCR, but before they select a specific image.

### Do Not Disable Language Data Caching
Language data is, by far, the largest download required to run Tesseract.js.  The default `eng.traineddata` file is 10.4MB compressed.  The default `chi_sim.traineddata` file is 19.2MB compressed.

To avoid downloading language data multiple times, Tesseract.js caches `.traineddata` files.  In past versions of Tesseract.js, this caching behavior contained bugs, so some users disabled it (setting `cacheMethod: 'none'` or `cacheMethod: 'refresh'`).  As these bugs were fixed in [v4.0.6](https://github.com/naptha/tesseract.js/releases/tag/v4.0.6), it is now recommended that users use the default `cacheMethod` value (i.e. just ignore the `cacheMethod` argument). 

### Consider Using Smaller Language Data 
The default language data used by Tesseract.js includes data for both Tesseract engines (LSTM [the default model] and Legacy), and is optimized for quality rather than speed.  Both the inclusion of multiple models and the focus on quality increase the size of the language data.  Setting a non-default `langData` path may result in significantly smaller files being downloaded.  

For example, by changing `langPath` from the default (`https://tessdata.projectnaptha.com/4.0.0`) to `https://tessdata.projectnaptha.com/4.0.0_fast` the size of the compressed English language data is reduced from 10.9MB to 2.0MB.  Note that this language data (1) only supports the default LSTM model and (2) is optimized for size/speed rather than quality, so users should switch only after testing whether this data works for their application. 

# Reducing Recognition Runtime

### Use the Latest Version of Tesseract.js
Old versions of Tesseract.js are significantly slower.  Notably, v2 (now depreciated) takes 10x longer to recognize certain images compared to the latest version.

### Consider Using the Legacy Model
In general, the LSTM (default) recognition model provides the best quality.  However, the Legacy model generally runs faster, and depending on your application, may provide sufficient recognition quality.  If runtime is a significant concern, consider experimenting with the Legacy model (by setting `oem` to `”0”` within `worker.initialize`).  As a rule of thumb, the Legacy model is usually viable when the input data is high-quality (high-definition screenshots, document scans, etc.).  

### Consider Using "Fast" Language Data
By default, Tesseract.js uses language data that is optimized for quality rather than speed.  You can also experiment with using language data that is optimized for speed by setting `langPath` to `https://tessdata.projectnaptha.com/4.0.0_fast`.

### Do Not Set `corePath` to a Single `.js` file
If you set the `corePath` argument, be sure to set it to a directory that contains both `tesseract-core.wasm.js` or `tesseract-core-simd.wasm.js`.  Tesseract.js needs to be able to pick between both files—setting `corePath` to a specific `.js` file will significantly degrade performance or compatibility.  See [this comment](https://github.com/naptha/tesseract.js/issues/735#issuecomment-1519157646) for explanation.
