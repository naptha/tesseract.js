#!/usr/bin/env node
const path = require('path');
const { TesseractWorker } = require('../../');

const [,, imagePath] = process.argv;
const image = path.resolve(__dirname, (imagePath || '../../tests/assets/images/cosmic.png'));
const tessWorker = new TesseractWorker();

console.log(`Recognizing ${image}`);

tessWorker.recognize(image)
  .progress((info) => {
    console.log(info);
  })
  .then((data) => {
    console.log(data.text);
  })
  .catch((err) => {
    console.log('Error\n', err);
  })
  .finally(() => {
    process.exit();
  });
