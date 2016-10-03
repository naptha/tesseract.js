var coreUrl = 'https://cdn.rawgit.com/naptha/tesseract.js-core/master/index.js',
	workerUrl = 'https://cdn.rawgit.com/naptha/tesseract.js/8b915dc/dist/tesseract.worker.js',
	langUrl = 'https://cdn.rawgit.com/naptha/tessdata/gh-pages/3.02/',
	worker;

function recognize(image, options){
	if(!worker) worker = createWorker( Tesseract.coreUrl, Tesseract.workerUrl, Tesseract.langUrl )
	return worker.recognize(image, options)
}

function detect(image){
	if(!worker) worker = createWorker( Tesseract.coreUrl, Tesseract.workerUrl, Tesseract.langUrl )
	return worker.detect(image)
}

function createWorker(coreUrl=Tesseract.coreUrl, workerUrl=Tesseract.workerUrl, langUrl=Tesseract.langUrl){

	var blob = new Blob([`importScripts('${coreUrl}');
		                  importScripts('${workerUrl}');`])

	var worker = new Worker(window.URL.createObjectURL(blob));

	var bigworker = false
	var jobCounter = 0
	var handlers = {}

	function runAsync(action, args){
		
		var jobId = jobCounter++
		handlers[jobId] = {}

		var waitingCount = 0
		Object.getOwnPropertyNames(args)
		.filter(name => typeof args[name] === 'function')
		.forEach(name => {
			waitingCount++
			args[name](value => {
				args[name] = value
				if(--waitingCount == 0) worker.postMessage({jobId, action, args})
			})
		})

		if(waitingCount == 0) worker.postMessage({jobId, action, args})
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
		if(image.match && image.match(/^https?:\/\//)) {
			return function thunk(cb){
				var img = new Image()
				img.src = image
				img.onload = () => cb(convertToImageData(img))
			}
		}

		if(typeof image === 'string') image = document.querySelector(image)
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

	runAsync('init', {mem: (1<<24) * 6, langUrl})

	return {
		detect(image){
			return runAsync('detect', {image: convertToImageData(image)})
		},

		recognize(image, options='eng'){

			if (typeof options === 'string') options = {lang: options};
			else options.lang = options.lang || 'eng';

			if (!bigworker && ['chi_sim', 'chi_tra', 'jpn'].indexOf(options.lang) != -1){
				runAsync('init', {mem: (1<<24) * 10, langUrl})
				bigworker = true
			}

			return runAsync('recognize', {options, image: convertToImageData(image)})
		}	
	}
}

var Tesseract = {coreUrl, workerUrl, langUrl, recognize, detect, createWorker}

module.exports = Tesseract