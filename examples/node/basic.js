// replace this with require('tesseract.js')
const path = require('path');
const { TesseractWorker } = require('../../');

const image = path.resolve(__dirname, 'cosmic.png');
const tessWorker = new TesseractWorker();

tessWorker.recognize(image)
  .then((data) => {
    console.log('then\n', data.text);
  })
  .catch((err) => {
    console.log('catch\n', err);
  })
  .finally(() => {
    console.log('finally\n');
    process.exit();
  });
