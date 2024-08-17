FAQ
===

# Project
## What is the scope of this project? 
Tesseract.js is the JavaScript/Webassembly port of the Tesseract OCR engine.  We do not edit the underlying Tesseract recognition engine in any way.  Therefore, if you encounter bugs caused by the Tesseract engine you may open an issue here for the purposes of raising awareness to other users, but fixing is outside the scope of this repository. 

If you encounter a Tesseract bug you would like to see fixed you should confirm the behavior is the same in the [main (CLI) version](https://github.com/tesseract-ocr/tesseract) of Tesseract and then open a Git Issue in that repository.    

# Frameworks

## What JavaScript frameworks are supported?
Tesseract.js supports all frameworks that support JavaScript and WebAssembly.  The only common JavaScript framework known to not be supported is React Native, as it does not support WebAssembly.
## Why am I getting a `Cannot find module` error when running in my project/framework? 
If you are able to run the examples in the [examples directory](https://github.com/naptha/tesseract.js/tree/master/examples), however are getting a `cannot find module` error when run in your framework, this indicates the main Tesseract.js thread is unable to find the worker code.  

This can be resolved by manually setting the `workerPath` argument to point to the local copy of `worker-script/node/index.js` (Node.js) or `worker.min.js` (browser).  For example, the using the following arguments resolved for one Node.js user in [this issue](https://github.com/naptha/tesseract.js/issues/868#issuecomment-1879235802).  You may need to edit the file paths to work with your system/project.

```
const worker = await createWorker("eng", 1, {workerPath: "./node_modules/tesseract.js/src/worker-script/node/index.js"});
```

For context, Tesseract.js "workers" get their own web worker (browser) or worker thread (Node.js), which is independent code that uses a different entry point. When Tesseract.js is used on its own, this entrypoint should be identified automatically. However, this may not hold with build systems implemented by various frameworks, as these build systems copy around files in a way that violates Tesseract.js's assumptions for where files are located.

# Recognizing Text
## Are PDF files supported? 
Tesseract.js does not support PDF files.  If you need to run OCR on PDF files, possible options are below.

### Use Scribe.js
[Scribe.js](https://github.com/scribeocr/scribe.js) is a library that builds on Tesseract.js and includes additional features, including native PDF support.  Scribe.js supports running OCR on PDF files.  Additionally, Scribe.js supports extracting text directly from text-native PDF files, which is significantly faster and more accurate compared to running OCR. 

### Render PDFs to Images
The only way to recognize PDF files using Tesseract.js is to use a third-party library to render the `.pdf` file to a series of `.png` images, and then recognize those images using Tesseract.js.  Libraries to consider are listed below.
1. [PDF.js](https://github.com/mozilla/pdf.js/) (Apache-2.0 license)
2. [muPDF](https://github.com/ArtifexSoftware/mupdf) (AGPL-3.0 license)

## What configuration settings should I use? 
Default settings should provide optimal results for most users.  If you do want to experiment with configuration settings, Tesseract does include many settings to change—the vast majority are documented in the [main Tesseract project](https://github.com/tesseract-ocr/tesseract) and not here.  As noted above (“what is the scope of this project”), the core recognition engine is inherited from the main Tesseract project—all of the configuration settings in Tesseract work identically in Tesseract.js.  Therefore, for specific questions about configuring recognition settings (e.g. “how can I make noise removal more/less aggressive” or “what settings work best for license plates”) you are more likely to find an answer in the Tesseract documentation/discussion versus only looking in this repo.  

## Is handwritten text supported? 
No.  The Tesseract OCR model is built around assumptions that only hold for printed text.  No combination of options will significantly improve performance with handwritten text.  Unless your handwriting is so good that it closely resembles printed text, the results will be poor.

## Why am I getting different results vs. Tesseract CLI?
Tesseract.js should produce results identical to using the Tesseract CLI, as long as the settings, language data, and version are identical.  If you are observing differences between Tesseract.js and the Tesseract CLI/API, and this difference is problematic, perform the following troubleshooting steps.

1. Confirm parameters are identical.
	1. Manually set `oem` and `psm` in both to account for different defaults.
		1. Tesseract.js and the Tesseract CLI use different default `oem` and `psm` settings.
			1. Tesseract.js uses a default `oem` of `1` (`lstm` model only), while the Tesseract CLI uses a default `oem` of `2` (`lstm` with `legacy` fallback).
			2. Tesseract.js and the Tesseract API use a default `pms` of `6` (`PSM_SINGLE_BLOCK`), while the Tesseract CLI uses a default `psm` of `3` (`PSM_AUTO`).
	2. Confirm that all user-set parameters are identical.
2. Confirm language data is identical.
    1. By default, when run with `oem` value `0` or `2`, Tesseract.js uses [these](https://github.com/naptha/tessdata/tree/gh-pages/4.0.0) language files.
       1. These were taken from the [tessdata](https://github.com/tesseract-ocr/tessdata) repo in the main Tesseract project.
    3. By default, when run with `oem` value `1`, Tesseract.js uses [these](https://github.com/naptha/tessdata/tree/gh-pages/4.0.0_best_int) language files.
       1. These were created by integerizing the language files from the [tessdata_best](https://github.com/tesseract-ocr/tessdata_best) repo in the main Tesseract project.
          1. This should be equivalent to using the LSTM language files from the [tessdata](https://github.com/tesseract-ocr/tessdata) which are created by combining an integerized version of `tessdata_best` with data for the Legacy model.
3. Confirm version is identical.
	1. Using a different version of Tesseract may result in different recognition results.
	2. The exact version of Tesseract used for Tesseract.js can be found by clicking on the `tesseract` submodule in this directory:
		1. https://github.com/naptha/tesseract.js-core/tree/master/third_party

If you find that results differ between Tesseract.js and Tesseract CLI and the settings, language data, and version are identical, feel free to open a Git Issue with a reproducible example.  

Additionally, feel free to open a Git Issue (with reproducible example) if you find that a **newer** version of Tesseract produces significantly better results, and we can prioritize updating Tesseract to the latest version.  If an older version of Tesseract produces significantly better results, then that regression should be raised with the main Tesseract project, as Tesseract.js will not be downgraded to an earlier version.

# Trained Data
## How does tesseract.js download and keep \*.traineddata?

During the downloading of language model, Tesseract.js will first check if \*.traineddata already exists. (browser: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), Node.js: fs, in the folder you execute the command) If the \*.traineddata doesn't exist, it will fetch \*.traineddata.gz from [tessdata](https://github.com/naptha/tessdata), ungzip and store in IndexedDB or fs, you can delete it manually and it will download again for you.

## How can I train my own \*.traineddata?

See the documentation from the main [Tesseract project](https://tesseract-ocr.github.io/tessdoc/) for training instructions. 

