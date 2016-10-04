"use strict";

var workerUtils = require('../common/worker.js')

process.on('message', function(packet){
    workerUtils.dispatchHandlers(packet, obj => process.send(obj))
})

exports.getLanguageData = require('./lang.js')


var TesseractCore;
exports.getCore = function(req, res){
    if(!TesseractCore){
        res.progress({ status: 'loading tesseract core' })
        TesseractCore = require('tesseract.js-core')
        res.progress({ status: 'loaded tesseract core' })
    }
    return TesseractCore
}

workerUtils.setAdapter(module.exports);
