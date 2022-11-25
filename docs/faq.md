FAQ
===

# Project
## What is the scope of this project? 
Tesseract.js is the JavaScript/Webassembly port of the Tesseract OCR engine.  We do not edit the underlying Tesseract recognition engine in any way.  Therefore, if you encounter bugs caused by the Tesseract engine you may open an issue here for the purposes of raising awareness to other users, but fixing is outside the scope of this repository. 

If you encounter a Tesseract bug you would like to see fixed you should confirm the behavior is the same in the [main (CLI) version](https://github.com/tesseract-ocr/tesseract) of Tesseract and then open a Git Issue in that repository.    

# Trained Data
## How does tesseract.js download and keep \*.traineddata?

The language model is downloaded by `worker.loadLanguage()` and you need to pass the langs to `worker.initialize()`.

During the downloading of language model, Tesseract.js will first check if \*.traineddata already exists. (browser: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), Node.js: fs, in the folder you execute the command) If the \*.traineddata doesn't exist, it will fetch \*.traineddata.gz from [tessdata](https://github.com/naptha/tessdata), ungzip and store in IndexedDB or fs, you can delete it manually and it will download again for you.

## How can I train my own \*.traineddata?

See the documentation from the main [Tesseract project](https://tesseract-ocr.github.io/tessdoc/) for training instructions. 

