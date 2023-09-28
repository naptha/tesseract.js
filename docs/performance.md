# Overview
This guide contains tips and strategies for getting the fastest performance from Tesseract.js.  While some of the tips below involve avoiding pitfalls and should be universally implemented, other strategies (changing the language data or recognition model) may harm recognition quality.  Therefore, whether these strategies are appropriate depends on the application, and users should always benchmark performance and quality before changing important settings from their defaults. 

# Reducing Setup Time
Within certain applications, the majority of runtime may be attributable to setup steps (`createWorker`) rather than recognition (`worker.recognize`).  Implementing the strategies in this section should reduce the time spent on these steps. 

Notably, the time spent on setup for first-time users may not be apparent to developers, as Tesseract.js caches language data after it is downloaded for the first time. To experience Tesseract.js as a first-time user, set `cacheMethod: 'none'` in the [createWorker options](./api.md#createworkeroptions-worker).  Be sure to remove this setting before publishing your app.
### Reuse Workers
When recognizing multiple images, some users will create/load/destroy a new worker for each image.  This is never the correct option.  If the images are being recognized one after the other, all of the extra steps required to create/load/destroy a new worker are wasted runtime, as `worker.recognize` could be run with the same `worker`.  Workers do not break after one use. 

Alternatively, if images are being recognized in parallel, then creating a new worker for each recognition job is likely to cause crashes due to resource limitations.  As each Tesseract.js worker uses a high amount of memory, code should never be able to create an arbitrary number of `workers`.  Instead, schedulers should be used to create a specific pool for workers (say, 4 workers), and then jobs assigned through the scheduler.
### Set Up Workers Ahead of Time
Rather than waiting until the last minute to load code and data, you can set up a worker ahead of time.  Doing so greatly reduces runtime the first time a user run recognition.  An example where a worker is prepared ahead of time can be found [here](../examples/browser/basic-efficient.html).

The appropriate time to load Tesseract.js workers and data is application-specific.  For example, if you have an web app where only 5% of users need OCR, it likely does not make sense to download ~15MB in code and data upon a page load.  You could consider instead loading Tesseract.js when a user indicates they want to perform OCR, but before they select a specific image.

### Do Not Disable Language Data Caching
Language data is one of the largest downloads required to run Tesseract.js.  While most language data files (including the default English file) are ~2MB, in a worst-case scenario they can be much larger.  For example, setting the recognition model (`oem`) to Tesseract Legacy and language to Chinese (simplified) results in a ~20MB file being downloaded. 

To avoid downloading language data multiple times, Tesseract.js caches `.traineddata` files.  In past versions of Tesseract.js, this caching behavior contained bugs, so some users disabled it (setting `cacheMethod: 'none'` or `cacheMethod: 'refresh'`).  As these bugs were fixed in [v4.0.6](https://github.com/naptha/tesseract.js/releases/tag/v4.0.6), it is now recommended that users use the default `cacheMethod` value (i.e. just ignore the `cacheMethod` argument). 

# Reducing Recognition Runtime

### Use the Latest Version of Tesseract.js
Old versions of Tesseract.js are significantly slower.  Notably, v2 (now depreciated) takes 10x longer to recognize certain images compared to the latest version.

### Do Not Set `corePath` to a Single `.js` file
If you set the `corePath` argument, be sure to set it to a directory that contains **all 4** of these files:

1. `tesseract-core.wasm.js`
2. `tesseract-core-simd.wasm.js`
3. `tesseract-core-lstm.wasm.js`
4. `tesseract-core-simd-lstm.wasm.js`

Tesseract.js needs to be able to pick between these files—setting `corePath` to a specific `.js` file will significantly degrade performance or compatibility.  

### Consider Using "Fast" Language Data
By default, Tesseract.js uses language data that is optimized for quality rather than speed.  You can also experiment with using language data that is optimized for speed by setting `langPath` to `https://tessdata.projectnaptha.com/4.0.0_fast`.  We have not benchmarked the impact this has on performance or accuracy, so feel free to open a Git Issue if you do so and wish to share results. 