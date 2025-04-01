#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
const { createWorker } = require('../..');

const [,, imagePath] = process.argv;
const image = path.resolve(__dirname, (imagePath || '../data/meditations.jpg'));

console.log(`Recognizing ${image}`);

// Tesseract.js returns images (imageColor, imageGrey, imageBinary) as strings
// to be used as source tags.
// This function converts to Uint8Array data for saving to disk.
const convertImage = (imageSrc) => {
  const data = atob(imageSrc.split(',')[1])
    .split('')
    .map((c) => c.charCodeAt(0));

  return new Uint8Array(data);
};

(async () => {
  const worker = await createWorker();
  const { data: { imageColor, imageGrey, imageBinary } } = await worker.recognize(image,
    { rotateAuto: true }, { imageColor: true, imageGrey: true, imageBinary: true });

  console.log('Saving intermediate images: imageColor.png, imageGrey.png, imageBinary.png');

  fs.writeFileSync('imageColor.png', convertImage(imageColor));
  fs.writeFileSync('imageGrey.png', convertImage(imageGrey));
  fs.writeFileSync('imageBinary.png', convertImage(imageBinary));

  await worker.terminate();
})();
