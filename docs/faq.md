FAQ
===

## How does tesseract.js download and keep \*.traineddata?

The language model is downloaded by `worker.loadLanguage()` and you need to pass the langs to `worker.initialize()`.

During the downloading of language model, Tesseract.js will first check if \*.traineddata already exists. (browser: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), Node.js: fs, in the folder you execute the command) If the \*.traineddata doesn't exist, it will fetch \*.traineddata.gz from [tessdata](https://github.com/naptha/tessdata), ungzip and store in IndexedDB or fs, you can delete it manually and it will download again for you.

## How can I train my own \*.traineddata?

For tesseract.js v2, check [TrainingTesseract 4.00](https://tesseract-ocr.github.io/tessdoc/TrainingTesseract-4.00)

For tesseract.js v1, check [Training Tesseract 3.03–3.05](https://tesseract-ocr.github.io/tessdoc/Training-Tesseract-3.03%E2%80%933.05)

## How can I get HOCR, TSV, Box, UNLV, OSD?

Starting from 2.0.0-beta.1, you can get all these information in the final result.

```javascript
import { createWorker } from 'tesseract.js';
const worker = createWorker({
  logger: m => console.log(m)
});

(async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({
    tessedit_create_box: '1',
    tessedit_create_unlv: '1',
    tessedit_create_osd: '1',
  });
  const { data: { text, hocr, tsv, box, unlv } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  console.log(text);
  console.log(hocr);
  console.log(tsv);
  console.log(box);
  console.log(unlv);
})();
```
