import desaturate from './desaturate'
import loadLanguage from './loadLanguage'
import circularize from './circularize'
import dump from './dump'

var loaded_langs = []

export default function recognize(jobId, module, base, image, options, cb){

	console.log('recognize id', jobId)
	var {lang} = options
	var width = image.width, height = image.height;

	image = desaturate(image)

	var ptr = module.allocate(image, 'i8', module.ALLOC_NORMAL);


	function run() {
		base.Init(null, lang)

		postMessage({
			jobId,			
			'progress': {
				'initialized_with_lang': lang
			}
		})

		for (var option in options) {
		    if (options.hasOwnProperty(option)) {
		        base.SetVariable(option, options[option]);
		        postMessage({
					jobId: jobId,			
					'progress': {
						'set_variable': {
							variable: option,
							value: options[option]
						}
					}
				})
		    }
		}


		base.SetImage(module.wrapPointer(ptr), width, height, 1, width)
		base.SetRectangle(0, 0, width, height)
		// base.GetUTF8Text()
		base.Recognize(null)
		var everything = circularize(dump(module, base))
		base.End();
		module._free(ptr); 
		cb(null, everything)
	}



	if(loaded_langs.indexOf(lang) == -1) loadLanguage(lang, jobId, function(err, result){

		if(err){
			console.error("error loading", lang);
			module._free(ptr);
			return cb(err, null);
		}

		loaded_langs.push(lang)
		module.FS_createDataFile('tessdata', lang +".traineddata", result, true, false);
		run()

	})
	else run();
}