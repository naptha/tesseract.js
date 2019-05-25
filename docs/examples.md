# Tesseract.js Examples

You can also check [examples](../examples) folder.

Example repositories:

- Offline version: https://github.com/jeromewu/tesseract.js-offline
- With Vue (similar with React/Angular): https://github.com/jeromewu/tesseract-vue-app
- Chrome Extension: https://github.com/jeromewu/tesseract.js-chrome-extension

### basic

```javascript
import Tesseract from 'tesseract.js';

const { TesseractWorker } = Tesseract;
const worker = new TesseractWorker();

worker
  .recognize('https://tesseract.projectnaptha.com/img/eng_bw.png')
  .then((result) => {
    console.log(result);
  });
```

### with detailed progress 

```javascript
import Tesseract from 'tesseract.js';

const { TesseractWorker } = Tesseract;
const worker = new TesseractWorker();

worker
  .recognize('https://tesseract.projectnaptha.com/img/eng_bw.png')
  .progress((p) => {
    console.log('progress', p);
  })
  .then((result) => {
    console.log(result);
  });
```

### with multiple languages, separate by '+'

```javascript
import Tesseract from 'tesseract.js';

const { TesseractWorker } = Tesseract;
const worker = new TesseractWorker();

worker
  .recognize(
    'https://tesseract.projectnaptha.com/img/eng_bw.png',
    'eng+chi_tra'
  )
  .progress((p) => {
    console.log('progress', p);
  })
  .then((result) => {
    console.log(result);
  });
```

### with whitelist char (^2.0.0-alpha.5)

Sadly, whitelist chars is not supported in tesseract.js v4, so in tesseract.js we need to switch to tesseract v3 mode to make it work.

```javascript
import Tesseract from 'tesseract.js';

const { TesseractWorker, OEM } = Tesseract;
const worker = new TesseractWorker();

worker
  .recognize(
    'https://tesseract.projectnaptha.com/img/eng_bw.png',
    'eng',
    {
      'tessedit_ocr_engine_mode': OEM.TESSERACT_ONLY,
      'tessedit_char_whitelist': '0123456789-.',
    }
  )
  .progress((p) => {
    console.log('progress', p);
  })
  .then((result) => {
    console.log(result);
  });
```

### with different pageseg mode (^2.0.0-alpha.5)

Check here for more details of pageseg mode: https://github.com/tesseract-ocr/tesseract/blob/4.0.0/src/ccstruct/publictypes.h#L163

```javascript
import Tesseract from 'tesseract.js';

const { TesseractWorker, PSM } = Tesseract;
const worker = new TesseractWorker();

worker
  .recognize(
    'https://tesseract.projectnaptha.com/img/eng_bw.png',
    'eng',
    {
      'tessedit_pageseg_mode': PSM.SINGLE_BLOCK,
    }
  )
  .progress((p) => {
    console.log('progress', p);
  })
  .then((result) => {
    console.log(result);
  });
```

### with pdf output (^2.0.0-alpha.7)

In this example, pdf file will be downloaded in browser and write to file system in Node.js

```javascript
import Tesseract from 'tesseract.js';

const { TesseractWorker } = Tesseract;
const worker = new TesseractWorker();

worker
  .recognize(
    'https://tesseract.projectnaptha.com/img/eng_bw.png',
    'eng',
    {
      'tessedit_create_pdf': '1',
    }
  )
  .progress((p) => {
    console.log('progress', p);
  })
  .then((result) => {
    console.log(result);
  });
```

If you want to handle pdf file by yourself

```javascript
import Tesseract from 'tesseract.js';

const { TesseractWorker } = Tesseract;
const worker = new TesseractWorker();

worker
  .recognize(
    'https://tesseract.projectnaptha.com/img/eng_bw.png',
    'eng',
    {
      'tessedit_create_pdf': '1',
      'pdf_auto_download': false, // disable auto download
      'pdf_bin': true,            // add pdf file bin array in result
    }
  )
  .progress((p) => {
    console.log('progress', p);
  })
  .then((result) => {
    console.log(result.files.pdf); // You can access pdf binary array here.
  });
```
