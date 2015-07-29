var Tesseract = (function(){

	var Tesseract = {}

	//https://cdn.rawgit.com/naptha/tesseract.js/master/worker/worker.js
	//https://rawgit.com/naptha/tesseract.js/master/worker/worker.js   for testing
	//https://cdn.rawgit.com/naptha/tesseract.js/master/worker/worker.js

	var blob = new Blob(["importScripts('https://cdn.rawgit.com/naptha/tesseract.js/master/lib/worker.2015.07.26.js');"]); // changed on build
	// console.log('localhost')
	var worker = new Worker(window.URL.createObjectURL(blob));
	worker.postMessage({init: {mem: 16777216*6}})
	var bigworker = false

	var index = 0
	var handlers = []

	worker.onmessage = function(e){
		var handler = handlers[e.data.index]
		if(e.data.progress){
			handler.progress(e.data.progress)
		}
		else if(e.data.err){
			handler.reject(e.data.err)
			handler.callback(e.data.err)
		}
		else {
			handler.resolve(e.data.result)
			handler.callback(null,e.data.result)
		}
	}

	function convertToImageData(image){
		if(image.getContext){
			image = image.getContext('2d');
		}else if(image.tagName == "IMG" || image.tagName == "VIDEO"){
			var c = document.createElement('canvas');
			if(image.tagName == "IMG"){
				c.width  = image.naturalWidth;
				c.height = image.naturalHeight;
			}else if(image.tagName == "VIDEO"){
				c.width  = image.videoWidth;
				c.height = image.videoHeight;
			}
			var ctx = c.getContext('2d');
			ctx.drawImage(image, 0, 0);
			image = ctx;
		}
		if(image.getImageData) image = image.getImageData(0, 0, image.canvas.width, image.canvas.height);
		return image	
	}

	Tesseract.detect = function(image, progress, callback){
		image = convertToImageData(image)

		if(typeof progress === "undefined"){
			progress = callback = new Function()
		}

		if (typeof callback === "undefined"){
			callback = progress
			progress = new Function()
		}

		var i = index++

		handlers[i] = {
			resolve: new Function(),
			reject: new Function()
		}
		handlers[i].callback = callback
		handlers[i].progress = progress
		
		return new Promise(function(resolve, reject){
			handlers[i].resolve = resolve
			handlers[i].reject = reject
			worker.postMessage({index: i, fun: 'detect', image: image})
		})

	}

	Tesseract.recognize = function(image, options, callback){
		var lang = options.lang
		if (typeof lang === "undefined"){
			lang = 'eng'
		}

		if (!bigworker && ['chi_sim', 'chi_tra', 'jpn'].indexOf(lang) != -1){
			worker.postMessage({init: {mem: 16777216*10}})
			bigworker = true
			console.log('started big worker')
		}

		if (typeof options === 'string') {
			lang = options
			options = {}
		}

		if (typeof options === "function") {
			callback = options
			options = {}
		}

		image = convertToImageData(image)

		var i = index++

		handlers[i] = {
			resolve: new Function(),
			reject: new Function()
		}
		handlers[i].callback = callback || new Function()
		handlers[i].progress = (function(){
			if(typeof options.progress === 'function'){
				var p = options.progress
				delete options.progress
				return p
			}
			return function(){}
		})()

		return new Promise(function(resolve, reject){
			handlers[i].resolve = resolve
			handlers[i].reject = reject
			worker.postMessage({index: i, fun: 'recognize', image: image, lang: lang, options: options})
		})
	
	}
	return Tesseract
})()
