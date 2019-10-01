#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const {
  Tesseract, createScheduler, createWorker,
} = require('../../');

const [,, imagePath] = process.argv;
const image = path.resolve(__dirname, (imagePath || '../../tests/assets/images/cosmic.png'));

console.log(`Recognizing ${image}`);

(async () => {
  const scheduler = createScheduler();
  const worker = createWorker();
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  scheduler.addWorker(worker);
  console.log((await scheduler.addJob('recognize', image)).text);
  const data = await worker.getPDF('ocr', 'Tesseract OCR');
  fs.writeFileSync('test.pdf', Buffer.from(data));
  await scheduler.terminate();
})();

//Tesseract.recognize(image, 'eng', { logger: m => console.log(m) })
//  .then(({ text }) => {
//    console.log(text);
//  });

//Tesseract.detect(image, { logger: m => console.log(m) })
//  .then((data) => {
//    console.log(data);
//  });
