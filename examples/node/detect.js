#!/usr/bin/env node
const path = require('path');
const { TesseractWorker } = require('../../');

const [,, imagePath] = process.argv;
const image = path.resolve(__dirname, (imagePath || '../../tests/assets/images/cosmic.png'));
const tessWorker = new TesseractWorker();

console.log(`Detecting ${image}`);

tessWorker.detect(image)
  .progress((info) => {
    console.log(info);
  })
  .then((data) => {
    console.log('done', data);
    process.exit();
  });
