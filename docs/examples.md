# Tesseract.js Examples

You can also check [examples](../examples) folder.

Example repositories:

- Offline version: https://github.com/jeromewu/tesseract.js-offline
- With Vue: https://github.com/jeromewu/tesseract.js-vue-app
- With Angular: https://github.com/jeromewu/tesseract.js-angular-app
- Chrome Extension: https://github.com/jeromewu/tesseract.js-chrome-extension

### basic

```javascript
import { createWorker } from 'tesseract.js';

const worker = createWorker();

(async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  console.log(text);
  await worker.terminate();
})();
```

### with detailed progress 

```javascript
import { createWorker } from 'tesseract.js';

const worker = createWorker({
  logger: m => console.log(m), // Add logger here
});

(async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  console.log(text);
  await worker.terminate();
})();
```

### with multiple languages, separate by '+'

```javascript
import { createWorker } from 'tesseract.js';

const worker = createWorker();

(async () => {
  await worker.load();
  await worker.loadLanguage('eng+chi_tra');
  await worker.initialize('eng+chi_tra');
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  console.log(text);
  await worker.terminate();
})();
```
### with whitelist char (^2.0.0-beta.1)

```javascript
import { createWorker } from 'tesseract.js';

const worker = createWorker();

(async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({
    tessedit_char_whitelist: '0123456789',
  });
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  console.log(text);
  await worker.terminate();
})();
```

### with different pageseg mode (^2.0.0-beta.1)

Check here for more details of pageseg mode: https://github.com/tesseract-ocr/tesseract/blob/4.0.0/src/ccstruct/publictypes.h#L163

```javascript
import { createWorker, PSM } from 'tesseract.js';

const worker = createWorker();

(async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
  });
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  console.log(text);
  await worker.terminate();
})();
```

### with pdf output (^2.0.0-beta.1)

Please check **examples** folder for details.

Browser: [download-pdf.html](../examples/browser/download-pdf.html)
Node: [download-pdf.js](../examples/node/download-pdf.js)

### with only part of the image (^2.0.0-beta.1)

```javascript
import { createWorker } from 'tesseract.js';

const worker = createWorker();
const rectangles = [
  { left: 0, top: 0, width: 500, height: 250 },
];

(async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png', 'eng', { rectangles });
  console.log(text);
  await worker.terminate();
})();
```

### with multiple workers to speed up (^2.0.0-beta.1)

```javascript
import { createWorker, createScheduler } from 'tesseract.js';

const scheduler = createScheduler();
const worker1 = createWorker();
const worker2 = createWorker();

(async () => {
  await worker1.load();
  await worker2.load();
  await worker1.loadLanguage('eng');
  await worker2.loadLanguage('eng');
  await worker1.initialize('eng');
  await worker2.initialize('eng');
  scheduler.addWorker(worker1);
  scheduler.addWorker(worker2);
  /** Add 10 recognition jobs */
  const results = await Promise.all(Array(10).fill(0).map(() => (
    await scheduler.addJob('recognize', 'https://tesseract.projectnaptha.com/img/eng_bw.png')
  )))
  console.log(results);
  await scheduler.terminate(); // It also terminates all workers.
})();
```
