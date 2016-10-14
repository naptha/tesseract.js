var latestJob;
var Module;
var base;
var adapter = {};

function dispatchHandlers(packet, send){
    function respond(status, data){
        send({
            jobId: packet.jobId,
            status: status,
            action: packet.action,
            data: data
        })
    }
    respond.resolve = respond.bind(this, 'resolve')
    respond.reject = respond.bind(this, 'reject')
    respond.progress = respond.bind(this, 'progress')
    
    latestJob = respond;

    try {
        if(packet.action === 'recognize'){
            handleRecognize(packet.payload, respond)
        }else if(packet.action === 'detect'){
            handleDetect(packet.payload, respond)
        }
    } catch (err) {
        respond.reject(err)
    }
}
exports.dispatchHandlers = dispatchHandlers;

exports.setAdapter = function setAdapter(impl){
    adapter = impl;
}


function handleInit(req, res){
    var MIN_MEMORY = 100663296;
    
    if(['chi_sim', 'chi_tra', 'jpn'].indexOf(req.options.lang) != -1){
        MIN_MEMORY = 167772160;
    }

    if(!Module || Module.TOTAL_MEMORY < MIN_MEMORY){
        var Core = adapter.getCore(req, res);

        res.progress({ status: 'initializing tesseract', progress: 0 })

        Module = Core({
            TOTAL_MEMORY: MIN_MEMORY,
            TesseractProgress(percent){
                latestJob.progress({ status: 'recognizing text', progress: Math.max(0, (percent-30)/70) })
            },
            onRuntimeInitialized() {}
        })

        Module.FS_createPath("/", "tessdata", true, true)
        base = new Module.TessBaseAPI()
        res.progress({ status: 'initializing tesseract', progress: 1 })
    }
}



var dump = require('./dump.js')
var desaturate = require('./desaturate.js')


function setImage(Module, base, image){
    var imgbin = desaturate(image),
        width = image.width,
        height = image.height;

    var ptr = Module.allocate(imgbin, 'i8', Module.ALLOC_NORMAL);
    base.SetImage(Module.wrapPointer(ptr), width, height, 1, width);
    base.SetRectangle(0, 0, width, height)
    return ptr;
}

function loadLanguage(req, res, cb){
    var lang = req.options.lang;
    
    if(!Module._loadedLanguages) Module._loadedLanguages = {};
    if(lang in Module._loadedLanguages) return cb();

    adapter.getLanguageData(req, res, function(data){
        res.progress({ status: 'loading ' + lang + '.traineddata', progress: 0 })
        Module.FS_createDataFile('tessdata', lang + ".traineddata", data, true, false);
        Module._loadedLanguages[lang] = true;
        res.progress({ status: 'loading ' + lang + '.traineddata', progress: 1 })
        cb()
    })
}



function handleRecognize(req, res){
    handleInit(req, res)
    
    loadLanguage(req, res, function(){  
        var lang = req.options.lang;

        res.progress({ status: 'initializing api', progress: 0 })
        base.Init(null, lang)
        res.progress({ status: 'initializing api', progress: 0.3 })        

        var options = req.options;
        for (var option in options) {
            if (options.hasOwnProperty(option)) {
                base.SetVariable(option, options[option]);
            }
        }

        res.progress({ status: 'initializing api', progress: 0.6 })
        var ptr = setImage(Module, base, req.image);
        res.progress({ status: 'initializing api', progress: 1 })

        base.Recognize(null)
        
        var result = dump(Module, base)

        base.End();
        Module._free(ptr); 

        res.resolve(result);
    })
}


function handleDetect(req, res){
    handleInit(req, res)
    req.options.lang = 'osd';
    loadLanguage(req, res, function(){

        base.Init(null, 'osd')
        base.SetPageSegMode(Module.PSM_OSD_ONLY)
        
        var ptr = setImage(Module, base, req.image);

        var results = new Module.OSResults();
        var success = base.DetectOS(results);
        if(!success){
            base.End();
            Module._free(ptr);
            res.reject("failed to detect os")
        } else {
            var charset = results.get_unicharset()
            
            var best = results.get_best_result()
            var oid = best.get_orientation_id(),
                sid = best.get_script_id();

            var result = {
                tesseract_script_id: sid,
                script: charset.get_script_from_script_id(sid),
                script_confidence: best.get_sconfidence(),
                orientation_degrees: [0, 270, 180, 90][oid],
                orientation_confidence: best.get_oconfidence()
            }

            base.End();
            Module._free(ptr);

            res.resolve(result)
        }
    })
}
