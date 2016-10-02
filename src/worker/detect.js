export default function detect(jobId, module, base, image, cb){
	var width = image.width, height = image.height;
	image = desaturate(image)

	var ptr = module.allocate(image, 'i8', module.ALLOC_NORMAL);
	console.log('allocated image')
	// base = new module.TessBaseAPI()

	loadLanguage('osd', jobId, function(err, result){
		if(err){
			module._free(ptr);
			cb(err)
		}
		else {
			base.Init(null, 'osd')
			base.SetPageSegMode(module.PSM_OSD_ONLY)
			console.log('loaded language')
			
			base.SetImage(module.wrapPointer(ptr), width, height, 1, width)
			base.SetRectangle(0, 0, width, height)

			var results = new module.OSResults();
			var success = base.DetectOS(results);
			if(!success){
				base.End();
				module._free(ptr);
				cb("failed to detect os")
			}
			else {
				var charset = results.get_unicharset()
				console.log(charset)
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

				base.End();
				module._free(ptr);
			}
		}
	})
}