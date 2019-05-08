# Tesseract.js Examples

You can also check [examples](../examples) folder.

### basic

```javascript
import Tesseract from 'tesseract.js';

const { TesseractWorker } = Tesseract;
const worker = new TessearctWorker();

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
const worker = new TessearctWorker();

worker
  .recognize('http://jeroen.github.io/images/testocr.png')
  .progress((p) => {
    console.log('progress', p);
  })
  .then((result) => {
    console.log(result);
  });
```

### with multiple languages (separate by '+'')

```javascript
import Tesseract from 'tesseract.js';

const { TesseractWorker } = Tesseract;
const worker = new TessearctWorker();

worker
  .recognize(
    'http://jeroen.github.io/images/testocr.png',
    { lang: 'eng+chi_tra' }
  )
  .progress((p) => {
    console.log('progress', p);
  })
  .then((result) => {
    console.log(result);
  });
```
