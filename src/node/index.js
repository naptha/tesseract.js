const path = require('path')
const fetch = require('node-fetch')
const isURL = require('is-url')

exports.defaultOptions = {
    workerPath: path.join(__dirname, 'worker.js'),
    langPath: 'http://cdn.rawgit.com/naptha/tessdata/gh-pages/3.02/',
}

const fork = require('child_process').fork;
const fs = require('fs')

exports.spawnWorker = function spawnWorker(instance, workerOptions){
    var cp = fork(workerOptions.workerPath);
    cp.on('message', function(packet){
        instance._recv(packet)
    })
    return cp;
}

exports.terminateWorker = function(instance){
    instance.worker.kill()
}

exports.sendPacket = function sendPacket(instance, packet){
    loadImage(packet.payload.image, function(img){
        packet.payload.image = img
        instance.worker.send(packet)
    })
}


function loadImage(image, cb){
    
    if(isURL(image)) {
        fetch(image).then(function (resp) {
            return resp.buffer();
        }).then(function (buffer) {
            return loadImage(buffer, cb);
        }).catch(function (err) {
            return console.error(err);
        });
    }

    if(typeof image === 'string'){
        fs.readFile(image, function(err, buffer){
            if (err) throw err;
            loadImage(buffer, cb)
        })
        return
    }else if(image instanceof Buffer){
        var fileType = require('file-type');
        var mime = fileType(image).mime

        if(mime === 'image/png'){
            var PNGReader = require('png.js');
            var reader = new PNGReader(image);
            reader.parse(function(err, png){
                if (err) throw err;

                var image = {
                    width: png.getWidth(),
                    height: png.getHeight()
                }
                image.data = new Uint8Array(image.width * image.height * 4)
                for(var j = 0; j < image.height; j++){
                    for(var i = 0; i < image.width; i++){
                        var offset = 4 * (i + j * image.width),
                            pix = png.getPixel(i, j);

                        image.data[offset] = pix[0]
                        image.data[offset + 1] = pix[1]
                        image.data[offset + 2] = pix[2]
                        image.data[offset + 3] = pix[3];
                    }
                }
                // console.log(image)
                loadImage(image, cb)
            });
            return
        }else if(mime === 'image/jpeg'){
            var jpeg = require('jpeg-js');
            loadImage(jpeg.decode(image), cb)
            return
        }

        // TODO: support for TIFF, NetPBM, BMP, etc.
    }

    // node uses json.stringify for ipc which means we need to turn
    // fancy arrays into raw arrays
    if(image && image.data && image.data.length && !Array.isArray(image.data)){
        image.data = Array.from(image.data)
        return loadImage(image, cb)
    }
    cb(image)
}