# Tesseract.js Examples

You can also check [examples](../examples) folder.

### basic

```javascript
import Tesseract from 'tesseract.js';

const { TesseractWorker } = Tesseract;
const worker = new TesseractWorker();

worker
  .recognize('http://jeroen.github.io/images/testocr.png')
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
  .recognize('http://jeroen.github.io/images/testocr.png')
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
    'http://jeroen.github.io/images/testocr.png',
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
    'http://jeroen.github.io/images/testocr.png',
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
    'http://jeroen.github.io/images/testocr.png',
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

### with pdf output (^2.0.0-alpha.5)

```javascript
import Tesseract from 'tesseract.js';

const { TesseractWorker } = Tesseract;
const worker = new TesseractWorker();

worker
  .recognize(
    'http://jeroen.github.io/images/testocr.png',
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
