const workerUtils = require('../common/worker.js')

process.on('message', function(packet){
    workerUtils.dispatchHandlers(packet, obj => process.send(obj))
})

var TesseractCore;
exports.getCore = function(req, res){
    if(!TesseractCore){
        res.progress({ status: 'loading tesseract core' })
        TesseractCore = require('tesseract.js-core')
        res.progress({ status: 'loaded tesseract core' })
    }
    return TesseractCore
}

exports.getLanguageData = require('./lang.js')

workerUtils.setAdapter(module.exports);
