FAQ
===

## How does tesseract.js download and keep \*.traineddata?

When you execute recognize() function (ex: `recognize(image, 'eng')`), the language model to download is determined by the 2nd argument of recognize(). (`eng` in the example)

Tesseract.js will first check if \*.traineddata already exists. (browser: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), Node.js: fs, in the folder you execute the command) If the \*.traineddata doesn't exist, it will fetch \*.traineddata.gz from [tessdata](https://github.com/naptha/tessdata), ungzip and store in IndexedDB or fs, you can delete it manually and it will download again for you.
