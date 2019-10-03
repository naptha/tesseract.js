#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { createWorker } = require('../../');

const [,, imagePath] = process.argv;
const image = path.resolve(__dirname, (imagePath || '../../tests/assets/images/bill.png'));

console.log(`Recognizing ${image}`);

(async () => {
  const worker = createWorker();
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({
    preserve_interword_spaces: '1',
  });
  const { data: { text } } = await worker.recognize(image);
  console.log(JSON.stringify({ text }));
  await worker.terminate();
})();
