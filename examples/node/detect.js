#!/usr/bin/env node
const path = require('path');
const Tesseract = require('../../');

const [,, imagePath] = process.argv;
const image = path.resolve(__dirname, (imagePath || '../../tests/assets/images/cosmic.png'));

console.log(`Recognizing ${image}`);

Tesseract.detect(image, { logger: m => console.log(m) })
  .then(({ data }) => {
    console.log(data);
  });
