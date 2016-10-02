//TODO: replace with cdn url
module.exports = function Tesseract(url=location.href+'build/tesseract.worker.js'){
	var blob = new Blob(["importScripts('"+url+"');"])
	var worker = new Worker(window.URL.createObjectURL(blob));

	var bigworker = false
	var jobCounter = 0
	var handlers = {}

	function runAsync(action, args){
		var jobId = jobCounter++
		handlers[jobId] = {}
		var message = {jobId, action, args}
		console.log(message)
		worker.postMessage(message)
		return {
			then    (f){ handlers[jobId].result  = f; return this},
			error   (f){ handlers[jobId].error    = f; return this},
			progress(f){ handlers[jobId].progress = f; return this}
		}
	}

	worker.onmessage = function(e){
		var {jobId, progress, error, result} = e.data
		var handler = handlers[jobId]
		if(progress && handler.progress) handler.progress(progress);
		if(error && handler.error) handler.error(error);
		if(result && handler.result) handler.result(result);
	}

	function convertToImageData(image){
		if(image.getContext) image = image.getContext('2d');
		else if(image.tagName == "IMG" || image.tagName == "VIDEO"){
			var c = document.createElement('canvas');
			c.width  = image.naturalWidth  || image.videoWidth;
			c.height = image.naturalHeight || image.videoHeight;
			var ctx = c.getContext('2d');
			ctx.drawImage(image, 0, 0);
			image = ctx;
		}
		if(image.getImageData) image = image.getImageData(0, 0, image.canvas.width, image.canvas.height);
		return image
	}

	runAsync('init', {mem: (1<<24) * 6})

	return {
		detect(image){
			return runAsync('detect', {image: convertToImageData(image)})
		},

		recognize(image, options='eng'){

			if (typeof options === 'string') options = {lang: options};
			else options.lang = options.lang || 'eng';

			if (!bigworker && ['chi_sim', 'chi_tra', 'jpn'].indexOf(options.lang) != -1){
				runAsync('init', {mem: (1<<24) * 10})
				bigworker = true
			}

			return runAsync('recognize', {options, image: convertToImageData(image)})
		}	
	}
}