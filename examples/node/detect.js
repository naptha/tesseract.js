var Tesseract = require('../../') // replace this with require('tesseract.js')

Tesseract.detect('cosmic.png')
.progress(function(info){
	console.log(info)
})
.then(function(data){
	console.log('done', data)
})