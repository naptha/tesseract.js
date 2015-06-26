var Tesseract = {}

Tesseract.recognize = function(image, options, callback){
	var lang = options.lang
	if(typeof lang === "undefined"){
		lang = 'eng'
	}

	if (typeof options === 'string') {
		lang = options
		options = {}
	}

	if (typeof options === "function") {
		callback = options
		options = {}
	}


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

	var worker = new Worker('https://cdn.rawgit.com/naptha/tesseract.js/master/lib/worker.js')

	if(typeof callback === "function"){
		worker.onmessage = function(e){
			callback(e.data.err, e.data.result)
		}
		worker.postMessage({image: image, lang: lang})		
		console.log('callback')
	}
	else {
		return new Promise(function(resolve, reject){
			worker.onmessage = function(e){
				if(e.data.err){
					reject(e.data.err)
				}
				else {
					resolve(e.data.result)
				}
			}
			worker.postMessage({image: image, lang: lang, options: options})
			console.log('promise')			
		})
	}
}