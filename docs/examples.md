# Tesseract.js Examples

You can also check [examples](../examples) folder.

Example repositories:

- Offline version: https://github.com/jeromewu/tesseract.js-offline
- With Vue: https://github.com/jeromewu/tesseract.js-vue-app
- With Angular: https://github.com/jeromewu/tesseract.js-angular-app
- Chrome Extension: https://github.com/jeromewu/tesseract.js-chrome-extension

### basic

```javascript
import Tesseract from 'tesseract.js';

const { TesseractWorker } = Tesseract;
const worker = new TesseractWorker();

worker
  .recognize('https://tesseract.projectnaptha.com/img/eng_bw.png')
  .progress((p) => {
    console.log('progress', p);
  })
  .then(({ text }) => {
    console.log(text);
    worker.terminate();
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
  .then(({ text }) => {
    console.log(text);
    worker.terminate();
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
  .then(({ text }) => {
    console.log(text);
    worker.terminate();
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
  .then(({ text }) => {
    console.log(text);
    worker.terminate();
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
  .then(({ text }) => {
    console.log(text);
    worker.terminate();
  });
```

### with pdf output (^2.0.0-alpha.12)

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
      'tessjs_create_pdf': '1',
    }
  )
  .progress((p) => {
    console.log('progress', p);
  })
  .then(({ text }) => {
    console.log(text);
    worker.terminate();
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
      'tessjs_create_pdf': '1',
      'tessjs_pdf_auto_download': false, // disable auto download
      'tessjs_pdf_bin': true,            // add pdf file bin array in result
    }
  )
  .progress((p) => {
    console.log('progress', p);
  })
  .then(({ files: { pdf } }) => {
    console.log(Object.values(pdf)); // As pdf is an array-like object, you need to do a little convertion first.
    worker.terminate();
  });
```

### with preload language data

```javascript
const Tesseract = require('tesseract.js');

const { TesseractWorker, utils: { loadLang } } = Tesseract;
const worker = new TesseractWorker();

loadLang({ langs: 'eng', langPath: worker.options.langPath })
  .then(() => {
    worker
      .recognize('https://tesseract.projectnaptha.com/img/eng_bw.png')
      .progress(p => console.log(p))
      .then(({ text }) => {
        console.log(text);
        worker.terminate();
      });
  });

```

### with only part of the image (^2.0.0-alpha.12)

```javascript
import Tesseract from 'tesseract.js';

const { TesseractWorker } = Tesseract;
const worker = new TesseractWorker();

worker
  .recognize(
    'https://tesseract.projectnaptha.com/img/eng_bw.png',
    'eng',
    {
      tessjs_image_rectangle_left: 0,
      tessjs_image_rectangle_top: 0,
      tessjs_image_rectangle_width: 500,
      tessjs_image_rectangle_height: 250,
    }
  )
  .progress((p) => {
    console.log('progress', p);
  })
  .then(({ text }) => {
    console.log(text);
    worker.terminate();
  });
```
