#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { createWorker } = require('../../');

const [,, imagePath] = process.argv;
const image = path.resolve(__dirname, (imagePath || '../../tests/assets/images/cosmic.png'));

console.log(`Recognizing ${image}`);

(async () => {
  const worker = createWorker();
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize(image);
  console.log(text);
  const { data } = await worker.getPDF('Tesseract OCR Result');
  fs.writeFileSync('tesseract-ocr-result.pdf', Buffer.from(data));
  console.log('Generate PDF: tesseract-ocr-result.pdf');
  await worker.terminate();
})();
