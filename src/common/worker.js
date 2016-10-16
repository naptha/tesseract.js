var latestJob,
    Module,
    base,
    adapter = {},
    dump = require('./dump.js'),
    desaturate = require('./desaturate.js');

function dispatchHandlers(packet, send){
    function respond(status, data){
        send({
            jobId: packet.jobId,
            status,
            action: packet.action,
            data
        });
    }
    respond.resolve = respond.bind(this, 'resolve');
    respond.reject = respond.bind(this, 'reject');
    respond.progress = respond.bind(this, 'progress');
    
    latestJob = respond;

    try {
        if(packet.action === 'recognize'){
            handleRecognize(packet.payload, respond);
        } else if (packet.action === 'detect'){
            handleDetect(packet.payload, respond);
        }
    } catch (err) {
        respond.reject(err)
    }
}
exports.dispatchHandlers = dispatchHandlers;

exports.setAdapter = function setAdapter(impl){
    adapter = impl;
};


function handleInit(req, res){
    var MIN_MEMORY = 100663296;
    
    if(['chi_sim', 'chi_tra', 'jpn'].includes(req.options.lang)){
        MIN_MEMORY = 167772160;
    }

    if(!Module || Module.TOTAL_MEMORY < MIN_MEMORY){
        var Core = adapter.getCore(req, res);

        res.progress({ status: 'initializing tesseract', progress: 0 })

        Module = Core({
            TOTAL_MEMORY: MIN_MEMORY,
            TesseractProgress(percent){
                latestJob.progress({ status: 'recognizing text', progress: Math.max(0, (percent-30)/70) });
            },
            onRuntimeInitialized() {}
        });

        Module.FS_createPath("/", "tessdata", true, true);
        base = new Module.TessBaseAPI();
        res.progress({ status: 'initializing tesseract', progress: 1 });
    }
}

function setImage(Module, base, image){
    var imgbin = desaturate(image),
        width = image.width,
        height = image.height;

    var ptr = Module.allocate(imgbin, 'i8', Module.ALLOC_NORMAL);
    base.SetImage(Module.wrapPointer(ptr), width, height, 1, width);
    base.SetRectangle(0, 0, width, height);
    return ptr;
}

function loadLanguage(req, res, cb){
    var lang = req.options.lang,
        langFile = lang + '.traineddata';
    
    if(!Module._loadedLanguages) Module._loadedLanguages = {};
    if(lang in Module._loadedLanguages) return cb();

    adapter.getLanguageData(req, res, function(data){
        res.progress({ status: 'loading ' + langFile, progress: 0 });
        Module.FS_createDataFile('tessdata', langFile, data, true, false);
        Module._loadedLanguages[lang] = true;
        res.progress({ status: 'loading ' + langFile, progress: 1 });
        cb();
    })
}



function handleRecognize(req, res){
    handleInit(req, res);
    
    loadLanguage(req, res, () => {
        var options = req.options;

        function progressUpdate(progress){
            res.progress({ status: 'initializing api', progress: progress });
        }

        progressUpdate(0);
        base.Init(null, req.options.lang);
        progressUpdate(.3);

        for (var option in options) {
            if (options.hasOwnProperty(option)) {
                base.SetVariable(option, options[option]);
            }
        }

        progressUpdate(.6);
        var ptr = setImage(Module, base, req.image);
        progressUpdate(1);

        base.Recognize(null);
        
        var result = dump(Module, base);

        base.End();
        Module._free(ptr); 

        res.resolve(result);
    })
}


function handleDetect(req, res){
    handleInit(req, res);
    req.options.lang = 'osd';
    loadLanguage(req, res, () => {
        base.Init(null, 'osd');
        base.SetPageSegMode(Module.PSM_OSD_ONLY);

        var ptr = setImage(Module, base, req.image),
            results = new Module.OSResults();

        if(!base.DetectOS(results)){
            base.End();
            Module._free(ptr);
            res.reject("Failed to detect OS");
        } else {
            var best = results.get_best_result(),
                oid = best.get_orientation_id(),
                sid = best.get_script_id();

            base.End();
            Module._free(ptr);

            res.resolve({
                tesseract_script_id: sid,
                script: results.get_unicharset().get_script_from_script_id(sid),
                script_confidence: best.get_sconfidence(),
                orientation_degrees: [0, 270, 180, 90][oid],
                orientation_confidence: best.get_oconfidence()
            });
        }
    });
}
