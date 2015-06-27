importScripts('madeline.js')
var leveljs = require('level-js')
// var levelup = require('levelup')
var db = leveljs('./tessdata', function(){

})
// // 2) put a key & value
// db.put('name2', 'LevelUP', function (err) {
//   if (err) return console.log('Ooops!', err) // some kind of I/O error

//   // 3) fetch by key
//   db.get('name', function (err, value) {
//     if (err) return console.log('Ooops!', err) // likely the key was not found
//     console.log('my name is' + value)
//   })
// })



var filesizes = {"afr": 1079573, "ara": 1701536, "aze": 1420865, "bel": 1276820, "ben": 6772012, "bul": 1605615, "cat": 1652368, "ces": 1035441, "chi_sim": 17710414, "chi_tra": 24717749, "chr": 320649, "dan-frak": 677656, "dan": 1972936, "deu-frak": 822644, "deu": 991656, "ell": 859719, "eng": 9453554, "enm": 619254, "epo": 1241212, "equ": 821130, "est": 1905040, "eus": 1641190, "fin": 979418, "fra": 1376221, "frk": 5912963, "frm": 5147082, "glg": 1674938, "grc": 3012615, "heb": 1051501, "hin": 6590065, "hrv": 1926995, "hun": 3074473, "ind": 1874776, "isl": 1634041, "ita": 948593, "ita_old": 3436571, "jpn": 13507168, "kan": 4390317, "kor": 5353098, "lav": 1843944, "lit": 1779240, "mal": 5966263, "meme": 88453, "mkd": 1163087, "mlt": 1463001, "msa": 1665427, "nld": 1134708, "nor": 2191610, "osd": 4274649, "pol": 7024662, "por": 909359, "ron": 915680, "rus": 5969957, "slk-frak": 289885, "slk": 2217342, "slv": 1611338, "spa": 883170, "spa_old": 5647453, "sqi": 1667041, "srp": 1770244, "swa": 757916, "swe": 2451917, "tam": 3498763, "tel": 5795246, "tgl": 1496256, "tha": 3811136, "tur": 3563264, "ukr": 937566, "vie": 2195922}

var pako = require('pako')

var recognize = (function createTesseractInstance(){

	var Module = Tesseract304({
		TOTAL_MEMORY: 90e6,
		TesseractProgress: function(percent){
			postMessage({
				'progress': {
					'recognized': percent/100
				}
			})
		}
	})

	var base = new Module.TessBaseAPI()
	var loaded_langs = []
	var loadLanguage = function(lang, cb){ // NodeJS style callback
		if(loaded_langs.indexOf(lang) != -1){
			cb(null, lang)		
		}
		else{
			Module.FS_createPath("/","tessdata",true,true)

			var downloadlang = function(shouldcache){
				postMessage({
					'progress': lang+' not found in cache, downloading'
				})
				var xhr = new XMLHttpRequest();
				xhr.open('GET', 'https://cdn.rawgit.com/naptha/tessdata/gh-pages/3.02/'+lang+'.traineddata.gz', true);
				xhr.responseType = 'arraybuffer';
				xhr.onerror = function(){ cb(xhr, null) }
				xhr.onprogress = function(e){
					postMessage({
						'progress': {
							'loaded_lang_model': e.loaded/filesizes[lang]
						}
					})
				}
				xhr.onload = function(){
					if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
						postMessage({
							'progress': 'unzipping_lang_model'
						})

						var response = new Uint8Array(xhr.response)

						var data = pako.inflate(response)
						postMessage({
							'progress': 'unzipped_lang_model'
						})

						Module.FS_createDataFile('tessdata', lang +".traineddata", data, true, false);

						if(shouldcache){
							db.put(lang, response, function(err){
								console.log('cached lang')
							})
						}

						loaded_langs.push(lang)

						cb(null, lang)
					} else cb(xhr, null);
				}
				xhr.send(null)
			}

			db.open({compression: false},function(err){
				if (err) {
					downloadlang(false)
				}
				else {
					db.get(lang, function (err, value) {

						// err = true

						if (err) {
							downloadlang(true)
						}
						else {
							value = pako.inflate(value)

							postMessage({
								'progress': lang+' found in cache, length '+ value.length
							})

							Module.FS_createDataFile('tessdata', lang +".traineddata", value, true, false);
							loaded_langs.push(lang)
							cb(null, lang)
						}
					})
				}
			})
		}
	}

	function DumpLiterallyEverything(){
			var ri = base.GetIterator();
			var blocks = [];
			var block, para, textline, word, symbol;

			function enumToString(value, prefix){
				return (Object.keys(Module)
					.filter(function(e){ return e.startsWith(prefix + '_') })
					.filter(function(e){ return Module[e] === value })
					.map(function(e){ return e.slice(prefix.length + 1) })[0])
			}

			do {
				if(ri.IsAtBeginningOf(Module.RIL_BLOCK)){
					var poly = ri.BlockPolygon();
					var polygon = null;
					// BlockPolygon() returns null when automatic page segmentation is off
					if(Module.getPointer(poly) > 0){
						var n = poly.get_n(),
							px = poly.get_x(),
							py = poly.get_y(),
							polygon = [];
						for(var i = 0; i < n; i++){
							polygon.push([px.getValue(i), py.getValue(i)]);
						}
						Module._ptaDestroy(Module.getPointer(poly));	
					}
					
					block = {
						paragraphs: [],

						text: ri.GetUTF8Text(Module.RIL_BLOCK),
						confidence: ri.Confidence(Module.RIL_BLOCK),
						baseline: ri.getBaseline(Module.RIL_BLOCK),
						bbox: ri.getBoundingBox(Module.RIL_BLOCK),

						blocktype: enumToString(ri.BlockType(), 'PT'),
						polygon: polygon
					}
					blocks.push(block)
				}
				if(ri.IsAtBeginningOf(Module.RIL_PARA)){
					para = {
						lines: [],

						text: ri.GetUTF8Text(Module.RIL_PARA),
						confidence: ri.Confidence(Module.RIL_PARA),
						baseline: ri.getBaseline(Module.RIL_PARA),
						bbox: ri.getBoundingBox(Module.RIL_PARA),

						is_ltr: !!ri.ParagraphIsLtr()
					}
					block.paragraphs.push(para)
				}
				if(ri.IsAtBeginningOf(Module.RIL_TEXTLINE)){
					textline = {
						words: [],

						text: ri.GetUTF8Text(Module.RIL_TEXTLINE),
						confidence: ri.Confidence(Module.RIL_TEXTLINE),
						baseline: ri.getBaseline(Module.RIL_TEXTLINE),
						bbox: ri.getBoundingBox(Module.RIL_TEXTLINE)
					}
					para.lines.push(textline)
				}
				if(ri.IsAtBeginningOf(Module.RIL_WORD)){
					var fontInfo = ri.getWordFontAttributes(),
						wordDir = ri.WordDirection();
					word = {
						symbols: [],
						choices: [],

						text: ri.GetUTF8Text(Module.RIL_WORD),
						confidence: ri.Confidence(Module.RIL_WORD),
						baseline: ri.getBaseline(Module.RIL_WORD),
						bbox: ri.getBoundingBox(Module.RIL_WORD),

						is_numeric: !!ri.WordIsNumeric(),
						in_dictionary: !!ri.WordIsFromDictionary(),
						direction: enumToString(wordDir, 'DIR'),
						language: ri.WordRecognitionLanguage(),

						is_bold: fontInfo.is_bold,
						is_italic: fontInfo.is_italic,
						is_underlined: fontInfo.is_underlined,
						is_monospace: fontInfo.is_monospace,
						is_serif: fontInfo.is_serif,
						is_smallcaps: fontInfo.is_smallcaps,
						font_size: fontInfo.pointsize,
						font_id: fontInfo.font_id,
						font_name: fontInfo.font_name,
					}
					var wc = new Module.WordChoiceIterator(ri);
					do {
						word.choices.push({
							text: wc.GetUTF8Text(),
							confidence: wc.Confidence()
						})
					} while (wc.Next());
					Module.destroy(wc)
					textline.words.push(word)
				}
				
				var image = null;
				// var pix = ri.GetBinaryImage(Module.RIL_SYMBOL)
				// var image = pix2array(pix);
				// // for some reason it seems that things stop working if you destroy pics
				// Module._pixDestroy(Module.getPointer(pix));

				symbol = {
					choices: [],
					image: image,

					text: ri.GetUTF8Text(Module.RIL_SYMBOL),
					confidence: ri.Confidence(Module.RIL_SYMBOL),
					baseline: ri.getBaseline(Module.RIL_SYMBOL),
					bbox: ri.getBoundingBox(Module.RIL_SYMBOL),

					is_superscript: !!ri.SymbolIsSuperscript(),
					is_subscript: !!ri.SymbolIsSubscript(),
					is_dropcap: !!ri.SymbolIsDropcap(),
				}
				word.symbols.push(symbol)
				var ci = new Module.ChoiceIterator(ri);
				do {
					symbol.choices.push({
						text: ci.GetUTF8Text(),
						confidence: ci.Confidence()
					})
				} while (ci.Next());
				Module.destroy(ci)
			} while (ri.Next(Module.RIL_SYMBOL));
			Module.destroy(ri)

			return {
				text: base.GetUTF8Text(),
				html: base.GetHOCRText(),

				confidence: base.MeanTextConf(),

				blocks: blocks,

				psm: enumToString(base.GetPageSegMode(), 'PSM'),
				oem: enumToString(base.oem(), 'OEM'),
				version: base.Version(),
			}
	}

	function recognize(image, lang, options,cb){
		var width, height;
		if(image.data){
			var src       = image.data;
			width     	  = image.width, height = image.height;
			var dst       = new Uint8Array(width * height);
			var srcLength = src.length | 0, srcLength_16 = (srcLength - 16) | 0;

			var coeff_r = 4899, coeff_g = 9617, coeff_b = 1868;

			for (var i = 0, j = 0; i <= srcLength_16; i += 16, j += 4) {
				// convert to grayscale 4 pixels at a time;
				// add 8192 = 1<<13 so for int n, float k >= .5,  ((n + k)*(1<<14) >> 14) = 1 + ((n)*(1<<14) >> 14)
				dst[j]     = src[i+3] //(((src[i] * coeff_r + src[i+1] * coeff_g + src[i+2] * coeff_b + 8192) >> 14) * src[i+3]) >> 8 + 255 - src[i+3];
				dst[j + 1] = src[i+4+3]//(((src[i+4] * coeff_r + src[i+5] * coeff_g + src[i+6] * coeff_b + 8192) >> 14) * src[i+3]) >> 8 + 255 - src[i+3];
				dst[j + 2] = src[i+8+3]//(((src[i+8] * coeff_r + src[i+9] * coeff_g + src[i+10] * coeff_b + 8192) >> 14) * src[i+3]) >> 8 + 255 - src[i+3];
				dst[j + 3] = src[i+12+3]//(((src[i+12] * coeff_r + src[i+13] * coeff_g + src[i+14] * coeff_b + 8192) >> 14) * src[i+3]) >> 8 + 255 - src[i+3];
			}
			for (; i < srcLength; i += 4, ++j) //finish up
				dst[j] = (src[i] * coeff_r + src[i+1] * coeff_g + src[i+2] * coeff_b + 8192) >> 14;
			
			image = dst;
			// for(var i = 0; i < image.length; i++) image[i] = image[i] > 128;
		}
		else {
			throw 'Expected ImageData'
		}
		var ptr = Module.allocate(image, 'i8', Module.ALLOC_NORMAL);
		
		loadLanguage(lang, function(err, result){

			if(err){
				console.error("error loading", lang);
				Module._free(ptr); 
				cb(err, null)
			}
			else {
				base.Init(null, lang)
				for (var option in options) {
				    if (options.hasOwnProperty(option)) {
				        base.SetVariable(option, options[option]);
				        postMessage({
							progress: {
								set_variable: {
									variable: option,
									value: options[option]
								}
							}
						})
				    }
				}


				base.SetImage(Module.wrapPointer(ptr), width, height, 1, width)
				base.SetRectangle(0, 0, width, height)
				base.GetUTF8Text()
				var everything = DumpLiterallyEverything()
				base.End();
				Module._free(ptr); 
				cb(null, everything)

			}
		})
	}

	return recognize
})()

onmessage = function(e) {
	recognize(e.data.image, e.data.lang, e.data.options, function(err, result){
		postMessage({err:err, result: result})	
	})
}