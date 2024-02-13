# Tesseract.js Examples

You can also check [examples](../examples) folder.

### basic

```javascript
const { createWorker } = require('tesseract.js');

const worker = await createWorker('eng');

(async () => {
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  console.log(text);
  await worker.terminate();
})();
```

### with detailed progress 

```javascript
const { createWorker } = require('tesseract.js');

const worker = await createWorker('eng', 1, {
  logger: m => console.log(m), // Add logger here
});

(async () => {
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  console.log(text);
  await worker.terminate();
})();
```

### with multiple languages, separate by '+'

```javascript
const { createWorker } = require('tesseract.js');

const worker = await createWorker(['eng', 'chi_tra']);

(async () => {
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  console.log(text);
  await worker.terminate();
})();
```
### with whitelist char

```javascript
const { createWorker } = require('tesseract.js');

const worker = await createWorker('eng');

(async () => {
  await worker.setParameters({
    tessedit_char_whitelist: '0123456789',
  });
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  console.log(text);
  await worker.terminate();
})();
```

### with different pageseg mode

Check here for more details of pageseg mode: https://github.com/tesseract-ocr/tesseract/blob/4.0.0/src/ccstruct/publictypes.h#L163

```javascript
const { createWorker, PSM } = require('tesseract.js');

const worker = await createWorker('eng');

(async () => {
  await worker.setParameters({
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
  });
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  console.log(text);
  await worker.terminate();
})();
```

### with pdf output

Please check **examples** folder for details.

Browser: [download-pdf.html](../examples/browser/download-pdf.html)
Node: [download-pdf.js](../examples/node/download-pdf.js)

### with only part of the image (^2.0.1)

**One rectangle**

```javascript
const { createWorker } = require('tesseract.js');

const worker = await createWorker('eng');
const rectangle = { left: 0, top: 0, width: 500, height: 250 };

(async () => {
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png', { rectangle });
  console.log(text);
  await worker.terminate();
})();
```

**Multiple Rectangles**

```javascript
const { createWorker } = require('tesseract.js');

const worker = await createWorker('eng');
const rectangles = [
  {
    left: 0,
    top: 0,
    width: 500,
    height: 250,
  },
  {
    left: 500,
    top: 0,
    width: 500,
    height: 250,
  },
];

(async () => {
  const values = [];
  for (let i = 0; i < rectangles.length; i++) {
    const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png', { rectangle: rectangles[i] });
    values.push(text);
  }
  console.log(values);
  await worker.terminate();
})();
```

**Multiple Rectangles (with scheduler to do recognition in parallel)**

```javascript
const { createWorker, createScheduler } = require('tesseract.js');

const scheduler = createScheduler();
const worker1 = await createWorker('eng');
const worker2 = await createWorker('eng');
const rectangles = [
  {
    left: 0,
    top: 0,
    width: 500,
    height: 250,
  },
  {
    left: 500,
    top: 0,
    width: 500,
    height: 250,
  },
];

(async () => {
  scheduler.addWorker(worker1);
  scheduler.addWorker(worker2);
  const results = await Promise.all(rectangles.map((rectangle) => (
    scheduler.addJob('recognize', 'https://tesseract.projectnaptha.com/img/eng_bw.png', { rectangle })
  )));
  console.log(results.map(r => r.data.text));
  await scheduler.terminate();
})();
```

### with multiple workers to speed up

```javascript
const { createWorker, createScheduler } = require('tesseract.js');

const scheduler = createScheduler();
const worker1 = await createWorker('eng');
const worker2 = await createWorker('eng');

(async () => {
  scheduler.addWorker(worker1);
  scheduler.addWorker(worker2);
  /** Add 10 recognition jobs */
  const results = await Promise.all(Array(10).fill(0).map(() => (
    scheduler.addJob('recognize', 'https://tesseract.projectnaptha.com/img/eng_bw.png')
  )))
  console.log(results);
  await scheduler.terminate(); // It also terminates all workers.
})();
```
