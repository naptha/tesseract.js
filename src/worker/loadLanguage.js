import {ungzip} from 'pako'
import db from './db'
import fileSizes from './fileSizes'

function getLanguageData(lang, progress, cb){
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'arraybuffer';
	xhr.open('GET', self.LANG_URL + lang + '.traineddata.gz', true);
	xhr.onerror = e => {
		xhr.onprogress = xhr.onload = null
		cb(xhr, null)
	}
	xhr.onprogress = e => progress({
		'loaded_lang_model': e.loaded/fileSizes[lang], //this is kinda wrong on safari
		cached: false
	})
	xhr.onload = e => {
		if (!(xhr.status == 200 || (xhr.status == 0 && xhr.response))) return cb(xhr, null);

		progress({'unzipping_lang_model': true})

		var response = new Uint8Array(xhr.response)
		while(response[0] == 0x1f && response[1] == 0x8b) response = ungzip(response);

		progress({
			'unzipped_lang_model': true,
			'lang_model_size': response.length
		})

		cb(null, response)
	}
	
	progress({
		'loaded_lang_model': 0,
		cached: false,
		requesting: true
	})

	xhr.send()
}


function load(lang, jobId, cb){

	console.log('loadLanguage jobId', jobId)

	function progressMessage(progress){
		postMessage({ jobId, progress })
	}	

	function finish(err, data) {
		if(err) return cb(err);
		// loaded_langs.push(lang)
		cb(null, data)
	}

	function createDataFile(err, data){
		progressMessage({ created_virtual_datafile: true})
		finish(err, data)
	}

	function createDataFileCached(err, data) {
		if(err) return createDataFile(err);

		db.put(lang, data, err => console.log('cached', lang, err))
		progressMessage({cached_lang: lang}) 
		createDataFile(null, data)
	}


	db.open({compression: false}, err => {
		if (err) return getLanguageData(lang, progressMessage, createDataFile);

		db.get(lang, (err, data) => {

			if (err) return getLanguageData(lang, progressMessage, createDataFileCached)

			while(data[0] == 0x1f && data[1] == 0x8b) data = ungzip(data);

			progressMessage({ loaded_lang_model: lang, from_cache: true })

			cb(null, data)
		})
	})	
}

var loaded_langs = []

export default function loadLanguage(jobId, lang, error, success){
	if(loaded_langs.indexOf(lang) == -1) load(lang, jobId, function(err, result){
		if(err) return error(err)

		loaded_langs.push(lang)
		self.module.FS_createDataFile('tessdata', lang +".traineddata", result, true, false);

		success()
	})
	else success();
}
