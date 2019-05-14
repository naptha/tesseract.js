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

### with whitelist chars (^2.0.0-alpha.4)

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
      'init_oem': OEM.TESSERACT_ONLY,
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
