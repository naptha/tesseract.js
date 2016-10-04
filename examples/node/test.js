var Tesseract = require('./src/index.js')
global.Tesseract = Tesseract;

// Tesseract.recognize('yolop.png', {
//     lang: 'eng'
// }).progress(function(info){
// 	console.log('--', info)
// })
// .then(function(data){
// 	console.log('--', data)
// })


// Tesseract.recognize('cosmic.jpg', {
//     lang: 'eng'
// })
Tesseract.detect('cosmic.jpg')
.progress(function(info){
	console.log(info)
})
.then(function(data){
	console.log('done', data)
})