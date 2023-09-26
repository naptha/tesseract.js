FAQ
===

# Project
## What is the scope of this project? 
Tesseract.js is the JavaScript/Webassembly port of the Tesseract OCR engine.  We do not edit the underlying Tesseract recognition engine in any way.  Therefore, if you encounter bugs caused by the Tesseract engine you may open an issue here for the purposes of raising awareness to other users, but fixing is outside the scope of this repository. 

If you encounter a Tesseract bug you would like to see fixed you should confirm the behavior is the same in the [main (CLI) version](https://github.com/tesseract-ocr/tesseract) of Tesseract and then open a Git Issue in that repository.    

# Recognizing Text
## Are PDF files supported? 
Tesseract.js does not support .pdf directly—a separate library must be used to convert the .pdf files to images before Tesseract can recognize them.  If you are an end user and want to use Tesseract.js to OCR a .pdf file, consider using [scribeocr.com](https://scribeocr.com/), a project that uses Tesseract.js and supports .pdf files.  If you are a developer who wants to use Tesseract.js with .pdf files, you can use either of the libraries below to convert from .pdf to images. 
1. [PDF.js](https://github.com/mozilla/pdf.js/) (Apache-2.0 license)
2. [muPDF](https://github.com/ArtifexSoftware/mupdf) (AGPL-3.0 license)

## What configuration settings should I use? 
Default settings should provide optimal results for most users.  If you do want to experiment with configuration settings, Tesseract does include many settings to change—the vast majority are documented in the [main Tesseract project](https://github.com/tesseract-ocr/tesseract) and not here.  As noted above (“what is the scope of this project”), the core recognition engine is inherited from the main Tesseract project—all of the configuration settings in Tesseract work identically in Tesseract.js.  Therefore, for specific questions about configuring recognition settings (e.g. “how can I make noise removal more/less aggressive” or “what settings work best for license plates”) you are more likely to find an answer in the Tesseract documentation/discussion versus only looking in this repo.  

# Trained Data
## How does tesseract.js download and keep \*.traineddata?

During the downloading of language model, Tesseract.js will first check if \*.traineddata already exists. (browser: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), Node.js: fs, in the folder you execute the command) If the \*.traineddata doesn't exist, it will fetch \*.traineddata.gz from [tessdata](https://github.com/naptha/tessdata), ungzip and store in IndexedDB or fs, you can delete it manually and it will download again for you.

## How can I train my own \*.traineddata?

See the documentation from the main [Tesseract project](https://tesseract-ocr.github.io/tessdoc/) for training instructions. 

