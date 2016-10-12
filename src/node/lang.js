const http = require("http"),
      zlib = require("zlib"),
      fs   = require("fs"),
      path = require("path");

var langdata = require('../common/langdata.json')

function getLanguageData(req, res, cb){
    var lang = req.options.lang;
    var langfile = lang + '.traineddata.gz';
    var url = req.workerOptions.langPath + langfile;
    
    fs.readFile(lang + '.traineddata', function (err, data) {
        if(!err) return cb(new Uint8Array(data));

        http.get(url, function(stream){
            var received_bytes = 0;
            stream.on('data', function(chunk) {
                received_bytes += chunk.length;
                res.progress({ 
                    status: 'downloading ' + langfile, 
                    loaded: received_bytes,
                    progress: Math.min(1, received_bytes / langdata[lang]) 
                });

            });

            var gunzip = zlib.createGunzip();
            stream.pipe(gunzip).pipe(fs.createWriteStream(lang + '.traineddata'))
            gunzip.on('end', function(){ getLanguageData(req, stream, cb) })
        })
    });
}


module.exports = getLanguageData;