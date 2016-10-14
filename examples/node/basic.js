var path = require('path');
var Tesseract = require('../../') // replace this with require('tesseract.js')
var image = path.resolve(__dirname, 'cosmic.png');

Tesseract.recognize(image)
.then(data => {
	console.log('then\n', data.text)
})
.catch(err => {
  console.log('catch\n', err);
})
.finally(e => {
  console.log('finally\n');
});