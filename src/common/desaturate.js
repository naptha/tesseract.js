// This converts an image to grayscale

module.exports = function desaturate(image){
    var width, height;
    if(image.data){
        var src       = image.data;
            width     = image.width, 
            height    = image.height;
        var dst       = new Uint8Array(width * height);
        var srcLength = src.length | 0, srcLength_16 = (srcLength - 16) | 0;
        
        for (var i = 0, j = 0; i <= srcLength_16; i += 16, j += 4) {
            // convert to grayscale 4 pixels at a time; eveything with alpha gets put in front of 50% gray
            dst[j]     = (((src[i] * 77 + src[i+1] * 151 + src[i+2] * 28) * src[i+3]) + ((255-src[i+3]) << 15) + 32768) >> 16
            dst[j+1]   = (((src[i+4] * 77 + src[i+5] * 151 + src[i+6] * 28) * src[i+7]) + ((255-src[i+7]) << 15) + 32768) >> 16
            dst[j+2]   = (((src[i+8] * 77 + src[i+9] * 151 + src[i+10] * 28) * src[i+11]) + ((255-src[i+11]) << 15) + 32768) >> 16
            dst[j+3]   = (((src[i+12] * 77 + src[i+13] * 151 + src[i+14] * 28) * src[i+15]) + ((255-src[i+15]) << 15) + 32768) >> 16
        }
        for (; i < srcLength; i += 4, ++j) //finish up
            dst[j]     = (((src[i] * 77 + src[i+1] * 151 + src[i+2] * 28) * src[i+3]) + ((255-src[i+3]) << 15) + 32768) >> 16
        image = dst;
    } else { throw 'Invalid ImageData' }
    return image
}