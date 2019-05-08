const workerUtils = require('../common/worker.js')

if (process.env.TESS_ENV === "development") {
    console.debug('Using Development Worker')
}

global.addEventListener('message', function(e){
    var packet = e.data;
    workerUtils.dispatchHandlers(packet, obj => postMessage(obj))
})

exports.getCore = function(req, res){
    if(!global.TesseractCore){
        res.progress({ status: 'loading tesseract core', progress: 0 })
        importScripts(req.workerOptions.corePath)
        res.progress({ status: 'loading tesseract core', progress: 1 })
    }
    return TesseractCore
}

exports.getLanguageData = require('./lang.js')

workerUtils.setAdapter(module.exports);
