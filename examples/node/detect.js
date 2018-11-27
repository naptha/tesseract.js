// replace this with require('tesseract.js')
const path = require('path');
const { TesseractWorker } = require('../../');

const image = path.resolve(__dirname, '../../tests/assets/images/cosmic.png');
const tessWorker = new TesseractWorker();

tessWorker.detect(image)
  .progress((info) => {
    console.log(info);
  })
  .then((data) => {
    console.log('done', data);
    process.exit();
  });
