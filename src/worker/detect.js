import desaturate from '../shared/desaturate'
import loadLanguage from './loadLanguage'

export default function detect(jobId, image, cb){
	var width = image.width, height = image.height;
	image = desaturate(image)

	var ptr = self.module.allocate(image, 'i8', self.module.ALLOC_NORMAL);
	// console.log('allocated image')

	loadLanguage(jobId, 'osd', err => {
		self.module._free(ptr);
		cb(err)
	}, success => {
		self.base.Init(null, 'osd')
		self.base.SetPageSegMode(self.module.PSM_OSD_ONLY)
		// console.log('loaded language')
		
		self.base.SetImage(self.module.wrapPointer(ptr), width, height, 1, width)
		self.base.SetRectangle(0, 0, width, height)

		var results = new self.module.OSResults();
		var success = self.base.DetectOS(results);
		if(!success){
			self.base.End();
			self.module._free(ptr);
			cb("failed to detect os")
		}
		else {
			var charset = results.get_unicharset()
			// console.log(charset)
			// results.print_scores()

			var best = results.get_best_result()
			var oid = best.get_orientation_id(),
				sid = best.get_script_id();
			// console.log('orientation id', oid, [0, 270, 180, 90][oid], best.get_oconfidence())
			// console.log('script id', sid, charset.get_script_from_script_id(sid), best.get_sconfidence())
			// console.log(best)

			cb(null, {
				tesseract_script_id: sid,
				script: charset.get_script_from_script_id(sid),
				script_confidence: best.get_sconfidence(),
				orientation_degrees: [0, 270, 180, 90][oid],
				orientation_confidence: best.get_oconfidence()
			})

			self.base.End();
			self.module._free(ptr);
		}
	})
}