# API

- [createWorker()](#create-worker)
  - [Worker.recognize](#worker-recognize)
  - [Worker.setParameters](#worker-set-parameters)
  - [Worker.reinitialize](#worker-reinitialize)
  - [Worker.detect](#worker-detect)
  - [Worker.terminate](#worker-terminate)
  - [Worker.writeText](#worker-writeText)
  - [Worker.readText](#worker-readText)
  - [Worker.removeFile](#worker-removeFile)
  - [Worker.FS](#worker-FS)
- [createScheduler()](#create-scheduler)
  - [Scheduler.addWorker](#scheduler-add-worker)
  - [Scheduler.addJob](#scheduler-add-job)
  - [Scheduler.getQueueLen](#scheduler-get-queue-len)
  - [Scheduler.getNumWorkers](#scheduler-get-num-workers)
- [setLogging()](#set-logging)
- [recognize()](#recognize)
- [detect()](#detect)
- [PSM](#psm)
- [OEM](#oem)

---

<a name="create-worker"></a>
## createWorker(options): Worker

`createWorker` is a function that creates a Tesseract.js worker.  A Tesseract.js worker is an object that creates and manages an instance of Tesseract running in a web worker (browser) or worker thread (Node.js).  Once created, OCR jobs are sent through the worker. 


**Arguments:**

- `langs` a string to indicate the languages traineddata to download, multiple languages are specified using an array (['eng', 'chi_sim'])
- `oem` a enum to indicate the OCR Engine Mode you use
- `options` an object of customized options
  - `corePath` path to a directory containing **both** `tesseract-core.wasm.js` and `tesseract-core-simd.wasm.js` from [Tesseract.js-core](https://www.npmjs.com/package/tesseract.js-core) package
     - Setting `corePath` to a specific `.js` file is **strongly discouraged.**  To provide the best performance on all devices, Tesseract.js needs to be able to pick between `tesseract-core.wasm.js` and `tesseract-core-simd.wasm.js`.  See [this issue](https://github.com/naptha/tesseract.js/issues/735) for more detail.
  - `langPath` path for downloading traineddata, do not include `/` at the end of the path
  - `workerPath` path for downloading worker script
  - `dataPath` path for saving traineddata in WebAssembly file system, not common to modify
  - `cachePath` path for the cached traineddata, more useful for Node, for browser it only changes the key in IndexDB
  - `cacheMethod` a string to indicate the method of cache management, should be one of the following options
    - write: read cache and write back (default method)
    - readOnly: read cache and not to write back
    - refresh: not to read cache and write back
    - none: not to read cache and not to write back
  - `legacyCore` set to `true` to ensure any code downloaded supports the Legacy model (in addition to LSTM model)
  - `legacyLang` set to `true` to ensure any language data downloaded supports the Legacy model (in addition to LSTM model)
  - `workerBlobURL` a boolean to define whether to use Blob URL for worker script, default: true
  - `gzip` a boolean to define whether the traineddata from the remote is gzipped, default: true
  - `logger` a function to log the progress, a quick example is `m => console.log(m)`
  - `errorHandler` a function to handle worker errors, a quick example is `err => console.error(err)`
- `config` an object of customized options which are set prior to initialization
  - This argument allows for setting "init only" Tesseract parameters
	  - Most Tesseract parameters can be set after a worker is initialized, using either `worker.setParameters` or the `options` argument of `worker.recognize`.  
	  - A handful of Tesseract parameters, referred to as "init only" parameters in Tesseract documentation, cannot be modified after Tesseract is initialized--these can only be set using this argument
		  - Examples include `load_system_dawg`, `load_number_dawg`, and `load_punc_dawg`

**Examples:**

```javascript
const { createWorker } = Tesseract;
const worker = await createWorker('eng', 1, {
  langPath: '...',
  logger: m => console.log(m),
});
```

<a name="worker-recognize"></a>
### worker.recognize(image, options, output, jobId): Promise

`worker.recognize` provides core function of Tesseract.js as it executes OCR

Figures out what words are in `image`, where the words are in `image`, etc.
> [!TIP]
> Note: `image` should be sufficiently high resolution.
> Often, the same image will get much better results if you upscale it before calling `recognize`.

**Arguments:**

- `image` see [Image Format](./image-format.md) for more details.
- `options` an object of customized options
  - `rectangle` an object to specify the regions you want to recognized in the image, should contain top, left, width and height, see example below.
- `output` an object specifying which output formats to return (by default only `text` is returned)
   - Other options include `blocks` (json), `hocr`, and `tsv`
- `jobId` Please see details above

**Output:**
`worker.recognize` returns a promise to an object containing `jobId` and `data` properties.  The `data` property contains output in all of the formats specified using the `output` argument.

> [!NOTE]  
> `worker.recognize` still returns an output object even if no text is detected (the outputs will simply contain no words). No exception is thrown as determining the page is empty is considered a valid result. 

**Examples:**

```javascript
const { createWorker } = Tesseract;
(async () => {
  const worker = await createWorker('eng');
  const { data: { text } } = await worker.recognize(image);
  console.log(text);
})();
```

With rectangle

```javascript
const { createWorker } = Tesseract;
(async () => {
  const worker = await createWorker('eng');
  const { data: { text } } = await worker.recognize(image, {
    rectangle: { top: 0, left: 0, width: 100, height: 100 },
  });
  console.log(text);
})();
```

<a name="worker-set-parameters"></a>
### worker.setParameters(params, jobId): Promise

`worker.setParameters()` set parameters for Tesseract API (using SetVariable()), it changes the behavior of Tesseract and some parameters like tessedit\_char\_whitelist is very useful.

**Arguments:**

- `params` an object with key and value of the parameters
- `jobId` Please see details above

Note:  `worker.setParameters` cannot be used to change the `oem`, as this value is set at initialization.  `oem` is initially set using an argument of `createWorker`.  After a worker already exists, changing `oem` requires running `worker.reinitialize`.

**Useful Parameters:**

| name                        | type   | default value     | description                                                                                                                     |
| --------------------------- | ------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| tessedit\_pageseg\_mode     | enum   | PSM.SINGLE\_BLOCK | Check [HERE](https://github.com/tesseract-ocr/tesseract/blob/4.0.0/src/ccstruct/publictypes.h#L163) for definition of each mode |
| tessedit\_char\_whitelist   | string | ''                | setting white list characters makes the result only contains these characters, useful if content in image is limited           |
| preserve\_interword\_spaces | string | '0'               | '0' or '1', keeps the space between words                                                                                       |
| user\_defined\_dpi          | string | ''                | Define custom dpi, use to fix **Warning: Invalid resolution 0 dpi. Using 70 instead.**                                          |

This list is incomplete.  As Tesseract.js passes parameters to the Tesseract engine, all parameters supported by the underlying version of Tesseract should also be supported by Tesseract.js.  (Note that parameters marked as “init only” in Tesseract documentation cannot be set by `setParameters` or `recognize`.) 

**Examples:**

```javascript
(async () => {
  await worker.setParameters({
    tessedit_char_whitelist: '0123456789',
  });
})
```

<a name="worker-reinitialize"></a>
### worker.reinitialize(langs, oem, jobId): Promise

`worker.reinitialize()` re-initializes an existing Tesseract.js worker with different `langs` and `oem` arguments.  

**Arguments:**

- `langs` a string to indicate the languages traineddata to download, multiple languages are specified using an array (['eng', 'chi_sim'])
- `oem` a enum to indicate the OCR Engine Mode you use
- `config` an object of customized options which are set prior to initialization (see details above)
- `jobId` Please see details above

Note: to switch from Tesseract LSTM (`oem` value `1`) to Tesseract Legacy (`oem` value `0`) using `worker.reinitialize()`, the worker must already contain the code required to run the Tesseract Legacy model.  Setting `legacyCore: true` and `legacyLang: true` in `createWorker` options ensures this is the case.

**Examples:**

```javascript
await worker.reinitialize('eng', 1);
```

<a name="worker-detect"></a>
### worker.detect(image, jobId): Promise

`worker.detect` does OSD (Orientation and Script Detection) to the image instead of OCR.

> [!NOTE]  
> Running `worker.detect` requires a worker with code and language data that supports Tesseract Legacy (this is not enabled by default).  If you want to run `worker.detect`, set `legacyCore` and `legacyLang` to `true` in the `createWorker` options. 

**Arguments:**

- `image` see [Image Format](./image-format.md) for more details.
- `jobId` Please see details above

**Examples:**

```javascript
const { createWorker } = Tesseract;
(async () => {
  const worker = await createWorker('eng', 1, {legacyCore: true, legacyLang: true});
  const { data } = await worker.detect(image);
  console.log(data);
})();
```

<a name="worker-terminate"></a>
### worker.terminate(jobId): Promise

`worker.terminate` terminates the worker and cleans up

```javascript
(async () => {
  await worker.terminate();
})();
```


<a name="worker-writeText"></a>
### Worker.writeText(path, text, jobId): Promise

`worker.writeText` writes a text file to the path specified in MEMFS, it is useful when you want to use some features that requires tesseract.js
to read file from file system.

**Arguments:**

- `path` text file path
- `text` content of the text file
- `jobId` Please see details above

**Examples:**

```javascript
(async () => {
  await worker.writeText('tmp.txt', 'Hi\nTesseract.js\n');
})();
```

<a name="worker-readText"></a>
### worker.readText(path, jobId): Promise

`worker.readText` reads a text file to the path specified in MEMFS, it is useful when you want to check the content.

**Arguments:**

- `path` text file path
- `jobId` Please see details above

**Examples:**

```javascript
(async () => {
  const { data } = await worker.readText('tmp.txt');
  console.log(data);
})();
```

<a name="worker-removeFile"></a>
### worker.removeFile(path, jobId): Promise

`worker.removeFile` removes a file in MEMFS, it is useful when you want to free the memory.

**Arguments:**

- `path` file path
- `jobId` Please see details above

**Examples:**

```javascript
(async () => {
  await worker.removeFile('tmp.txt');
})();
```

<a name="worker-FS"></a>
### worker.FS(method, args, jobId): Promise

`worker.FS` is a generic FS function to do anything you want, you can check [HERE](https://emscripten.org/docs/api_reference/Filesystem-API.html) for all functions.

**Arguments:**

- `method` method name
- `args` array of arguments to pass  
- `jobId` Please see details above

**Examples:**

```javascript
(async () => {
  await worker.FS('writeFile', ['tmp.txt', 'Hi\nTesseract.js\n']);
  // equal to:
  // await worker.writeText('tmp.txt', 'Hi\nTesseract.js\n');
})();
```

<a name="create-scheduler"></a>
## createScheduler(): Scheduler

`createScheduler` is a factory function to create a scheduler, a scheduler manages a job queue and workers to enable multiple workers to work together, it is useful when you want to speed up your performance.

**Examples:**

```javascript
const { createScheduler } = Tesseract;
const scheduler = createScheduler();
```

### Scheduler

<a name="scheduler-add-worker"></a>
### scheduler.addWorker(worker): string

`scheduler.addWorker` adds a worker into the worker pool inside scheduler, it is suggested to add one worker to only one scheduler.

**Arguments:**

- `worker` see Worker above

**Examples:**

```javascript
const { createWorker, createScheduler } = Tesseract;
const scheduler = createScheduler();
const worker = await createWorker();
scheduler.addWorker(worker);
```

<a name="scheduler-add-job"></a>
### scheduler.addJob(action, ...payload): Promise

`scheduler.addJob` adds a job to the job queue and scheduler waits and finds an idle worker to take the job.

**Arguments:**

- `action` a string to indicate the action you want to do, right now only **recognize** and **detect** are supported
- `payload` a arbitrary number of args depending on the action you called.

**Examples:**

```javascript
(async () => {
 const { data: { text } } = await scheduler.addJob('recognize', image, options);
 const { data } = await scheduler.addJob('detect', image);
})();
```

<a name="scheduler-get-queue-len"></a>
### scheduler.getQueueLen(): number

`scheduler.getQueueLen()` returns the length of job queue.

<a name="scheduler-get-num-workers"></a>
### Scheduler.getNumWorkers(): number

`Scheduler.getNumWorkers()` returns number of workers added into the scheduler

<a name="scheduler-terminate"></a>
### scheduler.terminate(): Promise

`scheduler.terminate()` terminates all workers added, useful to do quick clean up.

**Examples:**

```javascript
(async () => {
  await scheduler.terminate();
})();
```

<a name="set-logging"></a>
## setLogging(logging: boolean)

`setLogging` sets the logging flag, you can `setLogging(true)` to see detailed information, useful for debugging.

**Arguments:**

- `logging` boolean to define whether to see detailed logs, default: false

**Examples:**

```javascript
const { setLogging } = Tesseract;
setLogging(true);
```

<a name="recognize"></a>
## recognize(image, langs, options): Promise

> [!WARNING]  
> This function is depreciated and should be replaced with `worker.recognize` (see above). 

`recognize` works the same as `worker.recognize`, except that a new worker is created, loaded, and destroyed every time the function is called.

See [Tesseract.js](../src/Tesseract.js)

<a name="detect"></a>
## detect(image, options): Promise

> [!WARNING]  
> This function is depreciated and should be replaced with `worker.detect` (see above). 

`detect` works the same as `worker.detect`, except that a new worker is created, loaded, and destroyed every time the function is called.

See [Tesseract.js](../src/Tesseract.js)

<a name="psm"></a>
## PSM

See [PSM.js](../src/constants/PSM.js)

<a name="oem"></a>
## OEM

See [OEM.js](../src/constants/OEM.js)
