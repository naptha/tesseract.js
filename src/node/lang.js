const http = require('http'),
    zlib = require('zlib'),
    fs   = require('fs');

var langdata = require('../common/langdata.json');

function getLanguageData(req, res, cb){
    var lang = req.options.lang;
    var langFile = lang + '.traineddata.gz';
    var url = req.workerOptions.langPath + langfile;

    fs.readFile(langFile, function (err, data) {
        if (!err) {
            return cb(new Uint8Array(data));
        }

        http.get(url, function(stream){
            var receivedBytes = 0;
            stream.on('data', function(chunk) {
                receivedBytes += chunk.length;
                res.progress({
                    status: 'downloading ' + langFile,
                    loaded: receivedBytes,
                    progress: Math.min(1, receivedBytes / langdata[lang])
                });

            });

            var gunzip = zlib.createGunzip();
            stream.pipe(gunzip).pipe(fs.createWriteStream(langFile));
            gunzip.on('end', function(){
                getLanguageData(req, stream, cb);
            });
        });
    });
}


module.exports = getLanguageData;
