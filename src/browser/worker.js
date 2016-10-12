const workerUtils = require('../common/worker.js')

if (process.env.NODE_ENV === "development") {
    console.debug('Using Development Worker')
}

global.addEventListener('message', function(e){
    var packet = e.data;
    workerUtils.dispatchHandlers(packet, obj => postMessage(obj))
})

exports.getCore = function(req, res){
    if(!global.TesseractCore){
        res.progress({ status: 'loading tesseract core' })
        importScripts(req.workerOptions.tesseractPath)
        res.progress({ status: 'loaded tesseract core' })
    }
    return TesseractCore
}

exports.getLanguageData = require('./lang.js')

workerUtils.setAdapter(module.exports);
