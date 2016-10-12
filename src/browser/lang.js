const leveljs = require('level-js')
var db = typeof indexedDB === 'undefined' ? { open: (_, cb) =>  cb(true) } : leveljs('./tessdata2')

var langdata = require('../common/langdata.json')

module.exports = function getLanguageData(req, res, cb){
    var lang = req.options.lang;
    
    function saveDataFile(data){
        db.put(lang, data, err => console.log('cached', lang, err))
        cb(data)
    }

    db.open({ compression: false }, err => {
        if (err) return fetchLanguageData(req, res, cb);
        db.get(lang, (err, data) => {
            if (err) return fetchLanguageData(req, res, saveDataFile);
            res.progress({ status: 'found in cache ' + lang + '.traineddata' })
            cb(data)
        })
    })
}


const ungzip = require('pako').ungzip;

function fetchLanguageData(req, res, cb){
    var lang = req.options.lang;
    var langfile = lang + '.traineddata.gz';
    var url = req.workerOptions.langPath + langfile;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onerror = e => {
        xhr.onprogress = xhr.onload = null
        cb(xhr, null)
    }
    xhr.onprogress = e => 
        res.progress({
            status: 'downloading ' + langfile,
            loaded: e.loaded,
            progress: Math.min(1, e.loaded / langdata[lang])
        });

    xhr.onload = e => {
        if (!(xhr.status == 200 || (xhr.status == 0 && xhr.response))) return res.reject('Error downloading language ' + url);
        res.progress({ status: 'unzipping ' + langfile })

        // in case the gzips are already ungzipped or extra gzipped
        var response = new Uint8Array(xhr.response)
        try {
            while(response[0] == 0x1f && response[1] == 0x8b) response = ungzip(response);
        } catch (err) {
            return res.reject('Error unzipping language file ' + langfile + '\n' + err.message)
        }
        
        cb(response)
    }
    xhr.send()
}
