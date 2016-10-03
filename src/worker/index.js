import recognize from './recognize'
import detect from './detect'

var module, base, jobId

onmessage = function(e) {
	var {action, args} = e.data;
	jobId = e.data.jobId

	console.log('worker got action', action)

	if(action == 'init'){

		self.langUrl = args.langUrl
		self.module = TesseractCore({
			TOTAL_MEMORY: args.mem, //must be a multiple of 10 megabytes
			TesseractProgress(percent){
				postMessage({ jobId,
					'progress': {
						'recognized': Math.max(0,(percent-30)/70)
					}
				})
			},
			onRuntimeInitialized() {}
		})
		self.module.FS_createPath("/","tessdata",true,true)
		self.base = new self.module.TessBaseAPI()

	} else if(action === 'recognize'){
		var {image, options} = args
		recognize(jobId, image, options,
			(error, result) => postMessage({jobId, error: error.message, result}))
	} else if(action === 'detect'){
		detect(jobId, args.image, 
			(error, result) => postMessage({jobId, error: error.message, result}))
	}
}