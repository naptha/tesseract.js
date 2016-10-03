import desaturate from './desaturate'
import loadLanguage from './loadLanguage'
import circularize from './circularize'
import dump from './dump'

var loaded_langs = []

export default function recognize(jobId, image, options, cb){

	console.log('recognize id', jobId)
	var {lang} = options
	var width = image.width, height = image.height;

	image = desaturate(image)

	var ptr = self.module.allocate(image, 'i8', self.module.ALLOC_NORMAL);

	loadLanguage(jobId, lang, err => {
		self.module._free(ptr)
		cb(err)
	}, success => {
		self.base.Init(null, lang)

		postMessage({
			jobId,			
			'progress': {
				'initialized_with_lang': lang
			}
		})

		for (var option in options) {
		    if (options.hasOwnProperty(option)) {
		        self.base.SetVariable(option, options[option]);
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


		self.base.SetImage(self.module.wrapPointer(ptr), width, height, 1, width)
		self.base.SetRectangle(0, 0, width, height)
		// self.base.GetUTF8Text()
		self.base.Recognize(null)
		var everything = circularize(dump())
		self.base.End();
		self.module._free(ptr); 
		cb(null, everything)
	})	
}