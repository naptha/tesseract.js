const https = require("https"),
      http = require("http"),
      zlib = require("zlib"),
      fs   = require("fs"),
      path = require("path"),
      isURL = require("is-url");

var langdata = require('../common/langdata.json')

function getLanguageData(req, res, cb){
    var lang = req.options.lang,
        langfile = lang + '.traineddata.gz';
    
    // langPath defaults to a URL where languages can be downloaded. If a custom path is specified
    // and it is a local path, use that instead
    var localPath = isURL(req.workerOptions.langPath) ? 
        lang + '.traineddata' : 
        path.join(req.workerOptions.langPath, lang + '.traineddata');

    var fetchProtocol = req.workerOptions.langPath.startsWith('http://') ? http : https;

    fs.readFile(localPath, function (err, data) {
        if(!err) return cb(new Uint8Array(data));

        fetchProtocol.get(req.workerOptions.langPath + langfile, stream => {
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
            gunzip.on('end',() => {
                getLanguageData(req, stream, cb)
            });
        });
    });
}


module.exports = getLanguageData;
