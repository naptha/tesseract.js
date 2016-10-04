var Tesseract = require('../../') // replace this with require('tesseract.js')

Tesseract.recognize('cosmic.png')
.then(function(data){
	console.log(data.text)
})