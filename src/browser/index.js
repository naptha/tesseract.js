exports.defaultOptions = {
    langPath: 'https://cdn.rawgit.com/naptha/tessdata/gh-pages/3.02/',
    // workerPath: 'dist/worker.js',
    workerPath: 'https://cdn.rawgit.com/naptha/tesseract.js/0.1.0/dist/worker.js',
    tesseractPath: 'https://cdn.rawgit.com/naptha/tesseract.js-core/0.1.0/index.js',    
}

exports.spawnWorker = function spawnWorker(instance, workerOptions){
    var worker = new Worker(workerOptions.workerPath)
    worker.onmessage = function(e){
        var packet = e.data;
        instance._recv(packet)
    }
    return worker
}

exports.terminateWorker = function(instance){
    instance.worker.terminate()
}

exports.sendPacket = function sendPacket(instance, packet){
    loadImage(packet.payload.image, function(img){
        packet.payload.image = img
        instance.worker.postMessage(packet) 
    })
}


function loadImage(image, cb){
    if(typeof image === 'string'){
        if(/^\#/.test(image)){
            // element css selector
            return loadImage(document.querySelector(image), cb)
        }else{
            // url or path
            var im = new Image
            im.src = image;
            im.onload = e => loadImage(im, cb);
            return
        }
    }else if(image instanceof File){
        // files
        var fr = new FileReader()
        fr.onload = e => loadImage(fr.result, cb);
        fr.readAsDataURL(image)
        return
    }else if(image instanceof Blob){
        return loadImage(URL.createObjectURL(image), cb)
    }else if(image.getContext){
        // canvas element
        return loadImage(image.getContext('2d'), cb)
    }else if(image.tagName == "IMG" || image.tagName == "VIDEO"){
        // image element or video element
        var c = document.createElement('canvas');
        c.width  = image.naturalWidth  || image.videoWidth;
        c.height = image.naturalHeight || image.videoHeight;
        var ctx = c.getContext('2d');
        ctx.drawImage(image, 0, 0);
        return loadImage(ctx, cb)
    }else if(image.getImageData){
        // canvas context
        var data = image.getImageData(0, 0, image.canvas.width, image.canvas.height);
        return loadImage(data, cb)
    }
    cb(image)
}
