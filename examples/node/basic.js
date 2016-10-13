var path = require('path');
var Tesseract = require('../../') // replace this with require('tesseract.js')
var image = path.resolve(__dirname, 'cosmic.png');

Tesseract.recognize(image)
.then(function(data){
	console.log(data.text)
})