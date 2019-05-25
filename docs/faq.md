FAQ
===

## How does tesseract.js download and keep \*.traineddata?

When you execute recognize() function (ex: `recognize(image, 'eng')`), the language model to download is determined by the 2nd argument of recognize(). (`eng` in the example)

Tesseract.js will first check if \*.traineddata already exists. (browser: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), Node.js: fs, in the folder you execute the command) If the \*.traineddata doesn't exist, it will fetch \*.traineddata.gz from [tessdata](https://github.com/naptha/tessdata), ungzip and store in IndexedDB or fs, you can delete it manually and it will download again for you.

## How can I train my own \*.traineddata?

For tesseract.js v2, check [TrainingTesseract 4.00](https://github.com/tesseract-ocr/tesseract/wiki/TrainingTesseract-4.00)

For tesseract.js v1, check [Training Tesseract 3.03–3.05](https://github.com/tesseract-ocr/tesseract/wiki/Training-Tesseract-3.03%E2%80%933.05)

## How can I get HOCR, TSV, Box, UNLV, OSD?

Starting from 2.0.0-alpha.10, you can get all these information in the final result.

```javascript
import Tesseract from 'tesseract.js';

const { TesseractWorker } = Tesseract;
const worker = new TesseractWorker();

worker
  .recognize('https://tesseract.projectnaptha.com/img/eng_bw.png', 'eng', {
    tessedit_create_box: '1',
    tessedit_create_unlv: '1',
    tessedit_create_osd: '1',
  })
  .then((result) => {
    console.log(result.text);
    console.log(result.hocr);
    console.log(result.tsv);
    console.log(result.box);
    console.log(result.unlv);
    console.log(result.osd);
  });
```
