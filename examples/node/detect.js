var path = require('path');
var Tesseract = require('../../') // replace this with require('tesseract.js')
var image = path.resolve(__dirname, 'cosmic.png');

Tesseract.detect(image)
.progress(function(info){
	console.log(info)
})
.then(function(data){
	console.log('done', data)
})