/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
} // Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications


revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;

function getLens(b64) {
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  } // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42


  var validLen = b64.indexOf('=');
  if (validLen === -1) validLen = len;
  var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
} // base64 is 4/3 + up to two characters of the original data


function byteLength(b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}

function _byteLength(b64, validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}

function toByteArray(b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
  var curByte = 0; // if there are placeholders, only get up to the last complete 4 chars

  var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
  var i;

  for (i = 0; i < len; i += 4) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = tmp >> 16 & 0xFF;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  return arr;
}

function tripletToBase64(num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}

function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];

  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
    output.push(tripletToBase64(tmp));
  }

  return output.join('');
}

function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes

  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3
  // go through the array every three bytes, we'll deal with trailing stuff later

  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  } // pad the end with zeros, but make sure to not forget the extra bytes


  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
  }

  return parts.join('');
}

/***/ }),

/***/ "./node_modules/bmp-js/index.js":
/*!**************************************!*\
  !*** ./node_modules/bmp-js/index.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author shaozilee
 *
 * support 1bit 4bit 8bit 24bit decode
 * encode with 24bit
 * 
 */
var encode = __webpack_require__(/*! ./lib/encoder */ "./node_modules/bmp-js/lib/encoder.js"),
    decode = __webpack_require__(/*! ./lib/decoder */ "./node_modules/bmp-js/lib/decoder.js");

module.exports = {
  encode: encode,
  decode: decode
};

/***/ }),

/***/ "./node_modules/bmp-js/lib/decoder.js":
/*!********************************************!*\
  !*** ./node_modules/bmp-js/lib/decoder.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
/**
 * @author shaozilee
 *
 * Bmp format decoder,support 1bit 4bit 8bit 24bit bmp
 *
 */
function BmpDecoder(buffer, is_with_alpha) {
  this.pos = 0;
  this.buffer = buffer;
  this.is_with_alpha = !!is_with_alpha;
  this.bottom_up = true;
  this.flag = this.buffer.toString("utf-8", 0, this.pos += 2);
  if (this.flag != "BM") throw new Error("Invalid BMP File");
  this.parseHeader();
  this.parseRGBA();
}

BmpDecoder.prototype.parseHeader = function () {
  this.fileSize = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.reserved = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.offset = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.headerSize = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.width = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.height = this.buffer.readInt32LE(this.pos);
  this.pos += 4;
  this.planes = this.buffer.readUInt16LE(this.pos);
  this.pos += 2;
  this.bitPP = this.buffer.readUInt16LE(this.pos);
  this.pos += 2;
  this.compress = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.rawSize = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.hr = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.vr = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.colors = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.importantColors = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;

  if (this.bitPP === 16 && this.is_with_alpha) {
    this.bitPP = 15;
  }

  if (this.bitPP < 15) {
    var len = this.colors === 0 ? 1 << this.bitPP : this.colors;
    this.palette = new Array(len);

    for (var i = 0; i < len; i++) {
      var blue = this.buffer.readUInt8(this.pos++);
      var green = this.buffer.readUInt8(this.pos++);
      var red = this.buffer.readUInt8(this.pos++);
      var quad = this.buffer.readUInt8(this.pos++);
      this.palette[i] = {
        red: red,
        green: green,
        blue: blue,
        quad: quad
      };
    }
  }

  if (this.height < 0) {
    this.height *= -1;
    this.bottom_up = false;
  }
};

BmpDecoder.prototype.parseRGBA = function () {
  var bitn = "bit" + this.bitPP;
  var len = this.width * this.height * 4;
  this.data = new Buffer(len);
  this[bitn]();
};

BmpDecoder.prototype.bit1 = function () {
  var xlen = Math.ceil(this.width / 8);
  var mode = xlen % 4;
  var y = this.height >= 0 ? this.height - 1 : -this.height;

  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;

    for (var x = 0; x < xlen; x++) {
      var b = this.buffer.readUInt8(this.pos++);
      var location = line * this.width * 4 + x * 8 * 4;

      for (var i = 0; i < 8; i++) {
        if (x * 8 + i < this.width) {
          var rgb = this.palette[b >> 7 - i & 0x1];
          this.data[location + i * 4] = 0;
          this.data[location + i * 4 + 1] = rgb.blue;
          this.data[location + i * 4 + 2] = rgb.green;
          this.data[location + i * 4 + 3] = rgb.red;
        } else {
          break;
        }
      }
    }

    if (mode != 0) {
      this.pos += 4 - mode;
    }
  }
};

BmpDecoder.prototype.bit4 = function () {
  //RLE-4
  if (this.compress == 2) {
    var setPixelData = function setPixelData(rgbIndex) {
      var rgb = this.palette[rgbIndex];
      this.data[location] = 0;
      this.data[location + 1] = rgb.blue;
      this.data[location + 2] = rgb.green;
      this.data[location + 3] = rgb.red;
      location += 4;
    };

    this.data.fill(0xff);
    var location = 0;
    var lines = this.bottom_up ? this.height - 1 : 0;
    var low_nibble = false; //for all count of pixel

    while (location < this.data.length) {
      var a = this.buffer.readUInt8(this.pos++);
      var b = this.buffer.readUInt8(this.pos++); //absolute mode

      if (a == 0) {
        if (b == 0) {
          //line end
          if (this.bottom_up) {
            lines--;
          } else {
            lines++;
          }

          location = lines * this.width * 4;
          low_nibble = false;
          continue;
        } else if (b == 1) {
          //image end
          break;
        } else if (b == 2) {
          //offset x,y
          var x = this.buffer.readUInt8(this.pos++);
          var y = this.buffer.readUInt8(this.pos++);

          if (this.bottom_up) {
            lines -= y;
          } else {
            lines += y;
          }

          location += y * this.width * 4 + x * 4;
        } else {
          var c = this.buffer.readUInt8(this.pos++);

          for (var i = 0; i < b; i++) {
            if (low_nibble) {
              setPixelData.call(this, c & 0x0f);
            } else {
              setPixelData.call(this, (c & 0xf0) >> 4);
            }

            if (i & 1 && i + 1 < b) {
              c = this.buffer.readUInt8(this.pos++);
            }

            low_nibble = !low_nibble;
          }

          if ((b + 1 >> 1 & 1) == 1) {
            this.pos++;
          }
        }
      } else {
        //encoded mode
        for (var i = 0; i < a; i++) {
          if (low_nibble) {
            setPixelData.call(this, b & 0x0f);
          } else {
            setPixelData.call(this, (b & 0xf0) >> 4);
          }

          low_nibble = !low_nibble;
        }
      }
    }
  } else {
    var xlen = Math.ceil(this.width / 2);
    var mode = xlen % 4;

    for (var y = this.height - 1; y >= 0; y--) {
      var line = this.bottom_up ? y : this.height - 1 - y;

      for (var x = 0; x < xlen; x++) {
        var b = this.buffer.readUInt8(this.pos++);
        var location = line * this.width * 4 + x * 2 * 4;
        var before = b >> 4;
        var after = b & 0x0F;
        var rgb = this.palette[before];
        this.data[location] = 0;
        this.data[location + 1] = rgb.blue;
        this.data[location + 2] = rgb.green;
        this.data[location + 3] = rgb.red;
        if (x * 2 + 1 >= this.width) break;
        rgb = this.palette[after];
        this.data[location + 4] = 0;
        this.data[location + 4 + 1] = rgb.blue;
        this.data[location + 4 + 2] = rgb.green;
        this.data[location + 4 + 3] = rgb.red;
      }

      if (mode != 0) {
        this.pos += 4 - mode;
      }
    }
  }
};

BmpDecoder.prototype.bit8 = function () {
  //RLE-8
  if (this.compress == 1) {
    var setPixelData = function setPixelData(rgbIndex) {
      var rgb = this.palette[rgbIndex];
      this.data[location] = 0;
      this.data[location + 1] = rgb.blue;
      this.data[location + 2] = rgb.green;
      this.data[location + 3] = rgb.red;
      location += 4;
    };

    this.data.fill(0xff);
    var location = 0;
    var lines = this.bottom_up ? this.height - 1 : 0;

    while (location < this.data.length) {
      var a = this.buffer.readUInt8(this.pos++);
      var b = this.buffer.readUInt8(this.pos++); //absolute mode

      if (a == 0) {
        if (b == 0) {
          //line end
          if (this.bottom_up) {
            lines--;
          } else {
            lines++;
          }

          location = lines * this.width * 4;
          continue;
        } else if (b == 1) {
          //image end
          break;
        } else if (b == 2) {
          //offset x,y
          var x = this.buffer.readUInt8(this.pos++);
          var y = this.buffer.readUInt8(this.pos++);

          if (this.bottom_up) {
            lines -= y;
          } else {
            lines += y;
          }

          location += y * this.width * 4 + x * 4;
        } else {
          for (var i = 0; i < b; i++) {
            var c = this.buffer.readUInt8(this.pos++);
            setPixelData.call(this, c);
          }

          if (b & 1 == 1) {
            this.pos++;
          }
        }
      } else {
        //encoded mode
        for (var i = 0; i < a; i++) {
          setPixelData.call(this, b);
        }
      }
    }
  } else {
    var mode = this.width % 4;

    for (var y = this.height - 1; y >= 0; y--) {
      var line = this.bottom_up ? y : this.height - 1 - y;

      for (var x = 0; x < this.width; x++) {
        var b = this.buffer.readUInt8(this.pos++);
        var location = line * this.width * 4 + x * 4;

        if (b < this.palette.length) {
          var rgb = this.palette[b];
          this.data[location] = 0;
          this.data[location + 1] = rgb.blue;
          this.data[location + 2] = rgb.green;
          this.data[location + 3] = rgb.red;
        } else {
          this.data[location] = 0;
          this.data[location + 1] = 0xFF;
          this.data[location + 2] = 0xFF;
          this.data[location + 3] = 0xFF;
        }
      }

      if (mode != 0) {
        this.pos += 4 - mode;
      }
    }
  }
};

BmpDecoder.prototype.bit15 = function () {
  var dif_w = this.width % 3;

  var _11111 = parseInt("11111", 2),
      _1_5 = _11111;

  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;

    for (var x = 0; x < this.width; x++) {
      var B = this.buffer.readUInt16LE(this.pos);
      this.pos += 2;
      var blue = (B & _1_5) / _1_5 * 255 | 0;
      var green = (B >> 5 & _1_5) / _1_5 * 255 | 0;
      var red = (B >> 10 & _1_5) / _1_5 * 255 | 0;
      var alpha = B >> 15 ? 0xFF : 0x00;
      var location = line * this.width * 4 + x * 4;
      this.data[location] = alpha;
      this.data[location + 1] = blue;
      this.data[location + 2] = green;
      this.data[location + 3] = red;
    } //skip extra bytes


    this.pos += dif_w;
  }
};

BmpDecoder.prototype.bit16 = function () {
  var dif_w = this.width % 2 * 2; //default xrgb555

  this.maskRed = 0x7C00;
  this.maskGreen = 0x3E0;
  this.maskBlue = 0x1F;
  this.mask0 = 0;

  if (this.compress == 3) {
    this.maskRed = this.buffer.readUInt32LE(this.pos);
    this.pos += 4;
    this.maskGreen = this.buffer.readUInt32LE(this.pos);
    this.pos += 4;
    this.maskBlue = this.buffer.readUInt32LE(this.pos);
    this.pos += 4;
    this.mask0 = this.buffer.readUInt32LE(this.pos);
    this.pos += 4;
  }

  var ns = [0, 0, 0];

  for (var i = 0; i < 16; i++) {
    if (this.maskRed >> i & 0x01) ns[0]++;
    if (this.maskGreen >> i & 0x01) ns[1]++;
    if (this.maskBlue >> i & 0x01) ns[2]++;
  }

  ns[1] += ns[0];
  ns[2] += ns[1];
  ns[0] = 8 - ns[0];
  ns[1] -= 8;
  ns[2] -= 8;

  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;

    for (var x = 0; x < this.width; x++) {
      var B = this.buffer.readUInt16LE(this.pos);
      this.pos += 2;
      var blue = (B & this.maskBlue) << ns[0];
      var green = (B & this.maskGreen) >> ns[1];
      var red = (B & this.maskRed) >> ns[2];
      var location = line * this.width * 4 + x * 4;
      this.data[location] = 0;
      this.data[location + 1] = blue;
      this.data[location + 2] = green;
      this.data[location + 3] = red;
    } //skip extra bytes


    this.pos += dif_w;
  }
};

BmpDecoder.prototype.bit24 = function () {
  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;

    for (var x = 0; x < this.width; x++) {
      //Little Endian rgb
      var blue = this.buffer.readUInt8(this.pos++);
      var green = this.buffer.readUInt8(this.pos++);
      var red = this.buffer.readUInt8(this.pos++);
      var location = line * this.width * 4 + x * 4;
      this.data[location] = 0;
      this.data[location + 1] = blue;
      this.data[location + 2] = green;
      this.data[location + 3] = red;
    } //skip extra bytes


    this.pos += this.width % 4;
  }
};
/**
 * add 32bit decode func
 * @author soubok
 */


BmpDecoder.prototype.bit32 = function () {
  //BI_BITFIELDS
  if (this.compress == 3) {
    this.maskRed = this.buffer.readUInt32LE(this.pos);
    this.pos += 4;
    this.maskGreen = this.buffer.readUInt32LE(this.pos);
    this.pos += 4;
    this.maskBlue = this.buffer.readUInt32LE(this.pos);
    this.pos += 4;
    this.mask0 = this.buffer.readUInt32LE(this.pos);
    this.pos += 4;

    for (var y = this.height - 1; y >= 0; y--) {
      var line = this.bottom_up ? y : this.height - 1 - y;

      for (var x = 0; x < this.width; x++) {
        //Little Endian rgba
        var alpha = this.buffer.readUInt8(this.pos++);
        var blue = this.buffer.readUInt8(this.pos++);
        var green = this.buffer.readUInt8(this.pos++);
        var red = this.buffer.readUInt8(this.pos++);
        var location = line * this.width * 4 + x * 4;
        this.data[location] = alpha;
        this.data[location + 1] = blue;
        this.data[location + 2] = green;
        this.data[location + 3] = red;
      }
    }
  } else {
    for (var y = this.height - 1; y >= 0; y--) {
      var line = this.bottom_up ? y : this.height - 1 - y;

      for (var x = 0; x < this.width; x++) {
        //Little Endian argb
        var blue = this.buffer.readUInt8(this.pos++);
        var green = this.buffer.readUInt8(this.pos++);
        var red = this.buffer.readUInt8(this.pos++);
        var alpha = this.buffer.readUInt8(this.pos++);
        var location = line * this.width * 4 + x * 4;
        this.data[location] = alpha;
        this.data[location + 1] = blue;
        this.data[location + 2] = green;
        this.data[location + 3] = red;
      }
    }
  }
};

BmpDecoder.prototype.getData = function () {
  return this.data;
};

module.exports = function (bmpData) {
  var decoder = new BmpDecoder(bmpData);
  return decoder;
};

/***/ }),

/***/ "./node_modules/bmp-js/lib/encoder.js":
/*!********************************************!*\
  !*** ./node_modules/bmp-js/lib/encoder.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
/**
 * @author shaozilee
 *
 * BMP format encoder,encode 24bit BMP
 * Not support quality compression
 *
 */
function BmpEncoder(imgData) {
  this.buffer = imgData.data;
  this.width = imgData.width;
  this.height = imgData.height;
  this.extraBytes = this.width % 4;
  this.rgbSize = this.height * (3 * this.width + this.extraBytes);
  this.headerInfoSize = 40;
  this.data = [];
  /******************header***********************/

  this.flag = "BM";
  this.reserved = 0;
  this.offset = 54;
  this.fileSize = this.rgbSize + this.offset;
  this.planes = 1;
  this.bitPP = 24;
  this.compress = 0;
  this.hr = 0;
  this.vr = 0;
  this.colors = 0;
  this.importantColors = 0;
}

BmpEncoder.prototype.encode = function () {
  var tempBuffer = new Buffer(this.offset + this.rgbSize);
  this.pos = 0;
  tempBuffer.write(this.flag, this.pos, 2);
  this.pos += 2;
  tempBuffer.writeUInt32LE(this.fileSize, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.reserved, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.offset, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.headerInfoSize, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.width, this.pos);
  this.pos += 4;
  tempBuffer.writeInt32LE(-this.height, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt16LE(this.planes, this.pos);
  this.pos += 2;
  tempBuffer.writeUInt16LE(this.bitPP, this.pos);
  this.pos += 2;
  tempBuffer.writeUInt32LE(this.compress, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.rgbSize, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.hr, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.vr, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.colors, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.importantColors, this.pos);
  this.pos += 4;
  var i = 0;
  var rowBytes = 3 * this.width + this.extraBytes;

  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var p = this.pos + y * rowBytes + x * 3;
      i++; //a

      tempBuffer[p] = this.buffer[i++]; //b

      tempBuffer[p + 1] = this.buffer[i++]; //g

      tempBuffer[p + 2] = this.buffer[i++]; //r
    }

    if (this.extraBytes > 0) {
      var fillOffset = this.pos + y * rowBytes + this.width * 3;
      tempBuffer.fill(0, fillOffset, fillOffset + this.extraBytes);
    }
  }

  return tempBuffer;
};

module.exports = function (imgData, quality) {
  if (typeof quality === 'undefined') quality = 100;
  var encoder = new BmpEncoder(imgData);
  var data = encoder.encode();
  return {
    data: data,
    width: imgData.width,
    height: imgData.height
  };
};

/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

/* eslint-disable no-proto */


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js");

var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js");

var customInspectSymbol = typeof Symbol === 'function' && typeof Symbol['for'] === 'function' // eslint-disable-line dot-notation
? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
: null;
exports.Buffer = Buffer;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;
var K_MAX_LENGTH = 0x7fffffff;
exports.kMaxLength = K_MAX_LENGTH;
/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */

Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' && typeof console.error === 'function') {
  console.error('This browser lacks typed array (Uint8Array) support which is required by ' + '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.');
}

function typedArraySupport() {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1);
    var proto = {
      foo: function foo() {
        return 42;
      }
    };
    Object.setPrototypeOf(proto, Uint8Array.prototype);
    Object.setPrototypeOf(arr, proto);
    return arr.foo() === 42;
  } catch (e) {
    return false;
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function get() {
    if (!Buffer.isBuffer(this)) return undefined;
    return this.buffer;
  }
});
Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function get() {
    if (!Buffer.isBuffer(this)) return undefined;
    return this.byteOffset;
  }
});

function createBuffer(length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"');
  } // Return an augmented `Uint8Array` instance


  var buf = new Uint8Array(length);
  Object.setPrototypeOf(buf, Buffer.prototype);
  return buf;
}
/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */


function Buffer(arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError('The "string" argument must be of type string. Received type number');
    }

    return allocUnsafe(arg);
  }

  return from(arg, encodingOrOffset, length);
}

Buffer.poolSize = 8192; // not used by this implementation

function from(value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset);
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value);
  }

  if (value == null) {
    throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + _typeof(value));
  }

  if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
    return fromArrayBuffer(value, encodingOrOffset, length);
  }

  if (typeof SharedArrayBuffer !== 'undefined' && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length);
  }

  if (typeof value === 'number') {
    throw new TypeError('The "value" argument must not be of type number. Received type number');
  }

  var valueOf = value.valueOf && value.valueOf();

  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length);
  }

  var b = fromObject(value);
  if (b) return b;

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length);
  }

  throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + _typeof(value));
}
/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/


Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length);
}; // Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148


Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
Object.setPrototypeOf(Buffer, Uint8Array);

function assertSize(size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number');
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"');
  }
}

function alloc(size, fill, encoding) {
  assertSize(size);

  if (size <= 0) {
    return createBuffer(size);
  }

  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string' ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
  }

  return createBuffer(size);
}
/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/


Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding);
};

function allocUnsafe(size) {
  assertSize(size);
  return createBuffer(size < 0 ? 0 : checked(size) | 0);
}
/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */


Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */


Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size);
};

function fromString(string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding);
  }

  var length = byteLength(string, encoding) | 0;
  var buf = createBuffer(length);
  var actual = buf.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual);
  }

  return buf;
}

function fromArrayLike(array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  var buf = createBuffer(length);

  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255;
  }

  return buf;
}

function fromArrayView(arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    var copy = new Uint8Array(arrayView);
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
  }

  return fromArrayLike(arrayView);
}

function fromArrayBuffer(array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds');
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds');
  }

  var buf;

  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array);
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset);
  } else {
    buf = new Uint8Array(array, byteOffset, length);
  } // Return an augmented `Uint8Array` instance


  Object.setPrototypeOf(buf, Buffer.prototype);
  return buf;
}

function fromObject(obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0;
    var buf = createBuffer(len);

    if (buf.length === 0) {
      return buf;
    }

    obj.copy(buf, 0, 0, len);
    return buf;
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0);
    }

    return fromArrayLike(obj);
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data);
  }
}

function checked(length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes');
  }

  return length | 0;
}

function SlowBuffer(length) {
  if (+length != length) {
    // eslint-disable-line eqeqeq
    length = 0;
  }

  return Buffer.alloc(+length);
}

Buffer.isBuffer = function isBuffer(b) {
  return b != null && b._isBuffer === true && b !== Buffer.prototype; // so Buffer.isBuffer(Buffer.prototype) will be false
};

Buffer.compare = function compare(a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);

  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
  }

  if (a === b) return 0;
  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

Buffer.isEncoding = function isEncoding(encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true;

    default:
      return false;
  }
};

Buffer.concat = function concat(list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }

  if (list.length === 0) {
    return Buffer.alloc(0);
  }

  var i;

  if (length === undefined) {
    length = 0;

    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;

  for (i = 0; i < list.length; ++i) {
    var buf = list[i];

    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
        buf.copy(buffer, pos);
      } else {
        Uint8Array.prototype.set.call(buffer, buf, pos);
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    } else {
      buf.copy(buffer, pos);
    }

    pos += buf.length;
  }

  return buffer;
};

function byteLength(string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length;
  }

  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength;
  }

  if (typeof string !== 'string') {
    throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + 'Received type ' + _typeof(string));
  }

  var len = string.length;
  var mustMatch = arguments.length > 2 && arguments[2] === true;
  if (!mustMatch && len === 0) return 0; // Use a for loop to avoid recursion

  var loweredCase = false;

  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len;

      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length;

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2;

      case 'hex':
        return len >>> 1;

      case 'base64':
        return base64ToBytes(string).length;

      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length; // assume utf8
        }

        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}

Buffer.byteLength = byteLength;

function slowToString(encoding, start, end) {
  var loweredCase = false; // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.
  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.

  if (start === undefined || start < 0) {
    start = 0;
  } // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.


  if (start > this.length) {
    return '';
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return '';
  } // Force coercion to uint32. This will also coerce falsey/NaN values to 0.


  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return '';
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end);

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end);

      case 'ascii':
        return asciiSlice(this, start, end);

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end);

      case 'base64':
        return base64Slice(this, start, end);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
} // This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154


Buffer.prototype._isBuffer = true;

function swap(b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16() {
  var len = this.length;

  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits');
  }

  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }

  return this;
};

Buffer.prototype.swap32 = function swap32() {
  var len = this.length;

  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits');
  }

  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }

  return this;
};

Buffer.prototype.swap64 = function swap64() {
  var len = this.length;

  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits');
  }

  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }

  return this;
};

Buffer.prototype.toString = function toString() {
  var length = this.length;
  if (length === 0) return '';
  if (arguments.length === 0) return utf8Slice(this, 0, length);
  return slowToString.apply(this, arguments);
};

Buffer.prototype.toLocaleString = Buffer.prototype.toString;

Buffer.prototype.equals = function equals(b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
  if (this === b) return true;
  return Buffer.compare(this, b) === 0;
};

Buffer.prototype.inspect = function inspect() {
  var str = '';
  var max = exports.INSPECT_MAX_BYTES;
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim();
  if (this.length > max) str += ' ... ';
  return '<Buffer ' + str + '>';
};

if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
}

Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength);
  }

  if (!Buffer.isBuffer(target)) {
    throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. ' + 'Received type ' + _typeof(target));
  }

  if (start === undefined) {
    start = 0;
  }

  if (end === undefined) {
    end = target ? target.length : 0;
  }

  if (thisStart === undefined) {
    thisStart = 0;
  }

  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index');
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0;
  }

  if (thisStart >= thisEnd) {
    return -1;
  }

  if (start >= end) {
    return 1;
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;
  if (this === target) return 0;
  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);
  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
}; // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf


function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1; // Normalize byteOffset

  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }

  byteOffset = +byteOffset; // Coerce to Number.

  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : buffer.length - 1;
  } // Normalize byteOffset: negative offsets start from the end of the buffer


  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;

  if (byteOffset >= buffer.length) {
    if (dir) return -1;else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;else return -1;
  } // Normalize val


  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  } // Finally, search either indexOf (if dir is true) or lastIndexOf


  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1;
    }

    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]

    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
      }
    }

    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }

  throw new TypeError('val must be string, number or Buffer');
}

function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();

    if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }

      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read(buf, i) {
    if (indexSize === 1) {
      return buf[i];
    } else {
      return buf.readUInt16BE(i * indexSize);
    }
  }

  var i;

  if (dir) {
    var foundIndex = -1;

    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;

    for (i = byteOffset; i >= 0; i--) {
      var found = true;

      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break;
        }
      }

      if (found) return i;
    }
  }

  return -1;
}

Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1;
};

Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};

Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};

function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;

  if (!length) {
    length = remaining;
  } else {
    length = Number(length);

    if (length > remaining) {
      length = remaining;
    }
  }

  var strLen = string.length;

  if (length > strLen / 2) {
    length = strLen / 2;
  }

  var i;

  for (i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (numberIsNaN(parsed)) return i;
    buf[offset + i] = parsed;
  }

  return i;
}

function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}

function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}

function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}

function ucs2Write(buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}

Buffer.prototype.write = function write(string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0; // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0; // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0;

    if (isFinite(length)) {
      length = length >>> 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  } else {
    throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds');
  }

  if (!encoding) encoding = 'utf8';
  var loweredCase = false;

  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length);

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length);

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length);

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON() {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};

function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf);
  } else {
    return base64.fromByteArray(buf.slice(start, end));
  }
}

function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];
  var i = start;

  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte = void 0,
          thirdByte = void 0,
          fourthByte = void 0,
          tempCodePoint = void 0;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }

          break;

        case 2:
          secondByte = buf[i + 1];

          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;

            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }

          break;

        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];

          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;

            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }

          break;

        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];

          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;

            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }

      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res);
} // Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety


var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;

  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
  } // Decode in chunks to avoid "call stack size exceeded".


  var res = '';
  var i = 0;

  while (i < len) {
    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
  }

  return res;
}

function asciiSlice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }

  return ret;
}

function latin1Slice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }

  return ret;
}

function hexSlice(buf, start, end) {
  var len = buf.length;
  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;
  var out = '';

  for (var i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]];
  }

  return out;
}

function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = ''; // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)

  for (var i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }

  return res;
}

Buffer.prototype.slice = function slice(start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;
  var newBuf = this.subarray(start, end); // Return an augmented `Uint8Array` instance

  Object.setPrototypeOf(newBuf, Buffer.prototype);
  return newBuf;
};
/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */


function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
}

Buffer.prototype.readUintLE = Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var val = this[offset];
  var mul = 1;
  var i = 0;

  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val;
};

Buffer.prototype.readUintBE = Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;

  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;

  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val;
};

Buffer.prototype.readUint8 = Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset];
};

Buffer.prototype.readUint16LE = Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | this[offset + 1] << 8;
};

Buffer.prototype.readUint16BE = Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] << 8 | this[offset + 1];
};

Buffer.prototype.readUint32LE = Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
};

Buffer.prototype.readUint32BE = Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};

Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
  offset = offset >>> 0;
  validateNumber(offset, 'offset');
  var first = this[offset];
  var last = this[offset + 7];

  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8);
  }

  var lo = first + this[++offset] * Math.pow(2, 8) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 24);
  var hi = this[++offset] + this[++offset] * Math.pow(2, 8) + this[++offset] * Math.pow(2, 16) + last * Math.pow(2, 24);
  return BigInt(lo) + (BigInt(hi) << BigInt(32));
});
Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
  offset = offset >>> 0;
  validateNumber(offset, 'offset');
  var first = this[offset];
  var last = this[offset + 7];

  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8);
  }

  var hi = first * Math.pow(2, 24) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 8) + this[++offset];
  var lo = this[++offset] * Math.pow(2, 24) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 8) + last;
  return (BigInt(hi) << BigInt(32)) + BigInt(lo);
});

Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var val = this[offset];
  var mul = 1;
  var i = 0;

  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  mul *= 0x80;
  if (val >= mul) val -= Math.pow(2, 8 * byteLength);
  return val;
};

Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];

  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }

  mul *= 0x80;
  if (val >= mul) val -= Math.pow(2, 8 * byteLength);
  return val;
};

Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return this[offset];
  return (0xff - this[offset] + 1) * -1;
};

Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | this[offset + 1] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | this[offset] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};

Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};

Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
  offset = offset >>> 0;
  validateNumber(offset, 'offset');
  var first = this[offset];
  var last = this[offset + 7];

  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8);
  }

  var val = this[offset + 4] + this[offset + 5] * Math.pow(2, 8) + this[offset + 6] * Math.pow(2, 16) + (last << 24); // Overflow

  return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * Math.pow(2, 8) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 24));
});
Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
  offset = offset >>> 0;
  validateNumber(offset, 'offset');
  var first = this[offset];
  var last = this[offset + 7];

  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8);
  }

  var val = (first << 24) + // Overflow
  this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 8) + this[++offset];
  return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * Math.pow(2, 24) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 8) + last);
});

Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, true, 23, 4);
};

Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, false, 23, 4);
};

Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, true, 52, 8);
};

Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, false, 52, 8);
};

function checkInt(buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
}

Buffer.prototype.writeUintLE = Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;

  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;

  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUintBE = Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;

  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;

  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUint8 = Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  this[offset] = value & 0xff;
  return offset + 1;
};

Buffer.prototype.writeUint16LE = Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  this[offset] = value & 0xff;
  this[offset + 1] = value >>> 8;
  return offset + 2;
};

Buffer.prototype.writeUint16BE = Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  this[offset] = value >>> 8;
  this[offset + 1] = value & 0xff;
  return offset + 2;
};

Buffer.prototype.writeUint32LE = Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  this[offset + 3] = value >>> 24;
  this[offset + 2] = value >>> 16;
  this[offset + 1] = value >>> 8;
  this[offset] = value & 0xff;
  return offset + 4;
};

Buffer.prototype.writeUint32BE = Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  this[offset] = value >>> 24;
  this[offset + 1] = value >>> 16;
  this[offset + 2] = value >>> 8;
  this[offset + 3] = value & 0xff;
  return offset + 4;
};

function wrtBigUInt64LE(buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7);
  var lo = Number(value & BigInt(0xffffffff));
  buf[offset++] = lo;
  lo = lo >> 8;
  buf[offset++] = lo;
  lo = lo >> 8;
  buf[offset++] = lo;
  lo = lo >> 8;
  buf[offset++] = lo;
  var hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
  buf[offset++] = hi;
  hi = hi >> 8;
  buf[offset++] = hi;
  hi = hi >> 8;
  buf[offset++] = hi;
  hi = hi >> 8;
  buf[offset++] = hi;
  return offset;
}

function wrtBigUInt64BE(buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7);
  var lo = Number(value & BigInt(0xffffffff));
  buf[offset + 7] = lo;
  lo = lo >> 8;
  buf[offset + 6] = lo;
  lo = lo >> 8;
  buf[offset + 5] = lo;
  lo = lo >> 8;
  buf[offset + 4] = lo;
  var hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
  buf[offset + 3] = hi;
  hi = hi >> 8;
  buf[offset + 2] = hi;
  hi = hi >> 8;
  buf[offset + 1] = hi;
  hi = hi >> 8;
  buf[offset] = hi;
  return offset + 8;
}

Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'));
});
Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'));
});

Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;

  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);
    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;

  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }

    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;

  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);
    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;

  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }

    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = value & 0xff;
  return offset + 1;
};

Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  this[offset] = value & 0xff;
  this[offset + 1] = value >>> 8;
  return offset + 2;
};

Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  this[offset] = value >>> 8;
  this[offset + 1] = value & 0xff;
  return offset + 2;
};

Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  this[offset] = value & 0xff;
  this[offset + 1] = value >>> 8;
  this[offset + 2] = value >>> 16;
  this[offset + 3] = value >>> 24;
  return offset + 4;
};

Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  this[offset] = value >>> 24;
  this[offset + 1] = value >>> 16;
  this[offset + 2] = value >>> 8;
  this[offset + 3] = value & 0xff;
  return offset + 4;
};

Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'));
});
Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'));
});

function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
  if (offset < 0) throw new RangeError('Index out of range');
}

function writeFloat(buf, value, offset, littleEndian, noAssert) {
  value = +value;
  offset = offset >>> 0;

  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  ieee754.write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}

Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert);
};

Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert);
};

function writeDouble(buf, value, offset, littleEndian, noAssert) {
  value = +value;
  offset = offset >>> 0;

  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  ieee754.write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert);
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert);
}; // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)


Buffer.prototype.copy = function copy(target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer');
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start; // Copy 0 bytes; we're done

  if (end === start) return 0;
  if (target.length === 0 || this.length === 0) return 0; // Fatal error conditions

  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds');
  }

  if (start < 0 || start >= this.length) throw new RangeError('Index out of range');
  if (end < 0) throw new RangeError('sourceEnd out of bounds'); // Are we oob?

  if (end > this.length) end = this.length;

  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end);
  } else {
    Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
  }

  return len;
}; // Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])


Buffer.prototype.fill = function fill(val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }

    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string');
    }

    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding);
    }

    if (val.length === 1) {
      var code = val.charCodeAt(0);

      if (encoding === 'utf8' && code < 128 || encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code;
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  } else if (typeof val === 'boolean') {
    val = Number(val);
  } // Invalid ranges are not set to a default, so can range check early.


  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index');
  }

  if (end <= start) {
    return this;
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;
  if (!val) val = 0;
  var i;

  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, encoding);
    var len = bytes.length;

    if (len === 0) {
      throw new TypeError('The value "' + val + '" is invalid for argument "value"');
    }

    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this;
}; // CUSTOM ERRORS
// =============
// Simplified versions from Node, changed for Buffer-only usage


var errors = {};

function E(sym, getMessage, Base) {
  errors[sym] = /*#__PURE__*/function (_Base) {
    _inherits(NodeError, _Base);

    var _super = _createSuper(NodeError);

    function NodeError() {
      var _this;

      _classCallCheck(this, NodeError);

      _this = _super.call(this);
      Object.defineProperty(_assertThisInitialized(_this), 'message', {
        value: getMessage.apply(_assertThisInitialized(_this), arguments),
        writable: true,
        configurable: true
      }); // Add the error code to the name to include it in the stack trace.

      _this.name = "".concat(_this.name, " [").concat(sym, "]"); // Access the stack to generate the error message including the error code
      // from the name.

      _this.stack; // eslint-disable-line no-unused-expressions
      // Reset the name to the actual name.

      delete _this.name;
      return _this;
    }

    _createClass(NodeError, [{
      key: "code",
      get: function get() {
        return sym;
      },
      set: function set(value) {
        Object.defineProperty(this, 'code', {
          configurable: true,
          enumerable: true,
          value: value,
          writable: true
        });
      }
    }, {
      key: "toString",
      value: function toString() {
        return "".concat(this.name, " [").concat(sym, "]: ").concat(this.message);
      }
    }]);

    return NodeError;
  }(Base);
}

E('ERR_BUFFER_OUT_OF_BOUNDS', function (name) {
  if (name) {
    return "".concat(name, " is outside of buffer bounds");
  }

  return 'Attempt to access memory outside buffer bounds';
}, RangeError);
E('ERR_INVALID_ARG_TYPE', function (name, actual) {
  return "The \"".concat(name, "\" argument must be of type number. Received type ").concat(_typeof(actual));
}, TypeError);
E('ERR_OUT_OF_RANGE', function (str, range, input) {
  var msg = "The value of \"".concat(str, "\" is out of range.");
  var received = input;

  if (Number.isInteger(input) && Math.abs(input) > Math.pow(2, 32)) {
    received = addNumericalSeparator(String(input));
  } else if (typeof input === 'bigint') {
    received = String(input);

    if (input > Math.pow(BigInt(2), BigInt(32)) || input < -Math.pow(BigInt(2), BigInt(32))) {
      received = addNumericalSeparator(received);
    }

    received += 'n';
  }

  msg += " It must be ".concat(range, ". Received ").concat(received);
  return msg;
}, RangeError);

function addNumericalSeparator(val) {
  var res = '';
  var i = val.length;
  var start = val[0] === '-' ? 1 : 0;

  for (; i >= start + 4; i -= 3) {
    res = "_".concat(val.slice(i - 3, i)).concat(res);
  }

  return "".concat(val.slice(0, i)).concat(res);
} // CHECK FUNCTIONS
// ===============


function checkBounds(buf, offset, byteLength) {
  validateNumber(offset, 'offset');

  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
    boundsError(offset, buf.length - (byteLength + 1));
  }
}

function checkIntBI(value, min, max, buf, offset, byteLength) {
  if (value > max || value < min) {
    var n = typeof min === 'bigint' ? 'n' : '';
    var range;

    if (byteLength > 3) {
      if (min === 0 || min === BigInt(0)) {
        range = ">= 0".concat(n, " and < 2").concat(n, " ** ").concat((byteLength + 1) * 8).concat(n);
      } else {
        range = ">= -(2".concat(n, " ** ").concat((byteLength + 1) * 8 - 1).concat(n, ") and < 2 ** ") + "".concat((byteLength + 1) * 8 - 1).concat(n);
      }
    } else {
      range = ">= ".concat(min).concat(n, " and <= ").concat(max).concat(n);
    }

    throw new errors.ERR_OUT_OF_RANGE('value', range, value);
  }

  checkBounds(buf, offset, byteLength);
}

function validateNumber(value, name) {
  if (typeof value !== 'number') {
    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value);
  }
}

function boundsError(value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type);
    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value);
  }

  if (length < 0) {
    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
  }

  throw new errors.ERR_OUT_OF_RANGE(type || 'offset', ">= ".concat(type ? 1 : 0, " and <= ").concat(length), value);
} // HELPER FUNCTIONS
// ================


var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;

function base64clean(str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]; // Node strips out invalid characters like \n and \t from the string, base64-js does not

  str = str.trim().replace(INVALID_BASE64_RE, ''); // Node converts strings with length < 2 to ''

  if (str.length < 2) return ''; // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not

  while (str.length % 4 !== 0) {
    str = str + '=';
  }

  return str;
}

function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i); // is surrogate component

    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } // valid lead


        leadSurrogate = codePoint;
        continue;
      } // 2 leads in a row


      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue;
      } // valid surrogate pair


      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null; // encode utf8

    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break;
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break;
      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break;
      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break;
      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else {
      throw new Error('Invalid code point');
    }
  }

  return bytes;
}

function asciiToBytes(str) {
  var byteArray = [];

  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }

  return byteArray;
}

function utf16leToBytes(str, units) {
  var c, hi, lo;
  var byteArray = [];

  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break;
    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray;
}

function base64ToBytes(str) {
  return base64.toByteArray(base64clean(str));
}

function blitBuffer(src, dst, offset, length) {
  var i;

  for (i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }

  return i;
} // ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166


function isInstance(obj, type) {
  return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
}

function numberIsNaN(obj) {
  // For IE11 support
  return obj !== obj; // eslint-disable-line no-self-compare
} // Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219


var hexSliceLookupTable = function () {
  var alphabet = '0123456789abcdef';
  var table = new Array(256);

  for (var i = 0; i < 16; ++i) {
    var i16 = i * 16;

    for (var j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j];
    }
  }

  return table;
}(); // Return not function with Error if BigInt not supported


function defineBigIntMethod(fn) {
  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn;
}

function BufferBigIntNotDefined() {
  throw new Error('BigInt not supported');
}

/***/ }),

/***/ "./node_modules/file-type/index.js":
/*!*****************************************!*\
  !*** ./node_modules/file-type/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];


function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var _require = __webpack_require__(/*! ./util */ "./node_modules/file-type/util.js"),
    multiByteIndexOf = _require.multiByteIndexOf,
    stringToBytes = _require.stringToBytes,
    readUInt64LE = _require.readUInt64LE,
    tarHeaderChecksumMatches = _require.tarHeaderChecksumMatches,
    uint8ArrayUtf8ByteString = _require.uint8ArrayUtf8ByteString;

var supported = __webpack_require__(/*! ./supported */ "./node_modules/file-type/supported.js");

var xpiZipFilename = stringToBytes('META-INF/mozilla.rsa');
var oxmlContentTypes = stringToBytes('[Content_Types].xml');
var oxmlRels = stringToBytes('_rels/.rels');

var fileType = function fileType(input) {
  if (!(input instanceof Uint8Array || input instanceof ArrayBuffer || Buffer.isBuffer(input))) {
    throw new TypeError("Expected the `input` argument to be of type `Uint8Array` or `Buffer` or `ArrayBuffer`, got `".concat(_typeof(input), "`"));
  }

  var buffer = input instanceof Uint8Array ? input : new Uint8Array(input);

  if (!(buffer && buffer.length > 1)) {
    return;
  }

  var check = function check(header, options) {
    options = _objectSpread({
      offset: 0
    }, options);

    for (var i = 0; i < header.length; i++) {
      // If a bitmask is set
      if (options.mask) {
        // If header doesn't equal `buf` with bits masked off
        if (header[i] !== (options.mask[i] & buffer[i + options.offset])) {
          return false;
        }
      } else if (header[i] !== buffer[i + options.offset]) {
        return false;
      }
    }

    return true;
  };

  var checkString = function checkString(header, options) {
    return check(stringToBytes(header), options);
  };

  if (check([0xFF, 0xD8, 0xFF])) {
    return {
      ext: 'jpg',
      mime: 'image/jpeg'
    };
  }

  if (check([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) {
    // APNG format (https://wiki.mozilla.org/APNG_Specification)
    // 1. Find the first IDAT (image data) chunk (49 44 41 54)
    // 2. Check if there is an "acTL" chunk before the IDAT one (61 63 54 4C)
    // Offset calculated as follows:
    // - 8 bytes: PNG signature
    // - 4 (length) + 4 (chunk type) + 13 (chunk data) + 4 (CRC): IHDR chunk
    var startIndex = 33;
    var firstImageDataChunkIndex = buffer.findIndex(function (el, i) {
      return i >= startIndex && buffer[i] === 0x49 && buffer[i + 1] === 0x44 && buffer[i + 2] === 0x41 && buffer[i + 3] === 0x54;
    });
    var sliced = buffer.subarray(startIndex, firstImageDataChunkIndex);

    if (sliced.findIndex(function (el, i) {
      return sliced[i] === 0x61 && sliced[i + 1] === 0x63 && sliced[i + 2] === 0x54 && sliced[i + 3] === 0x4C;
    }) >= 0) {
      return {
        ext: 'apng',
        mime: 'image/apng'
      };
    }

    return {
      ext: 'png',
      mime: 'image/png'
    };
  }

  if (check([0x47, 0x49, 0x46])) {
    return {
      ext: 'gif',
      mime: 'image/gif'
    };
  }

  if (check([0x57, 0x45, 0x42, 0x50], {
    offset: 8
  })) {
    return {
      ext: 'webp',
      mime: 'image/webp'
    };
  }

  if (check([0x46, 0x4C, 0x49, 0x46])) {
    return {
      ext: 'flif',
      mime: 'image/flif'
    };
  } // `cr2`, `orf`, and `arw` need to be before `tif` check


  if ((check([0x49, 0x49, 0x2A, 0x0]) || check([0x4D, 0x4D, 0x0, 0x2A])) && check([0x43, 0x52], {
    offset: 8
  })) {
    return {
      ext: 'cr2',
      mime: 'image/x-canon-cr2'
    };
  }

  if (check([0x49, 0x49, 0x52, 0x4F, 0x08, 0x00, 0x00, 0x00, 0x18])) {
    return {
      ext: 'orf',
      mime: 'image/x-olympus-orf'
    };
  }

  if (check([0x49, 0x49, 0x2A, 0x00]) && (check([0x10, 0xFB, 0x86, 0x01], {
    offset: 4
  }) || check([0x08, 0x00, 0x00, 0x00], {
    offset: 4
  })) && // This pattern differentiates ARW from other TIFF-ish file types:
  check([0x00, 0xFE, 0x00, 0x04, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x03, 0x01], {
    offset: 9
  })) {
    return {
      ext: 'arw',
      mime: 'image/x-sony-arw'
    };
  }

  if (check([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00]) && (check([0x2D, 0x00, 0xFE, 0x00], {
    offset: 8
  }) || check([0x27, 0x00, 0xFE, 0x00], {
    offset: 8
  }))) {
    return {
      ext: 'dng',
      mime: 'image/x-adobe-dng'
    };
  }

  if (check([0x49, 0x49, 0x2A, 0x00]) && check([0x1C, 0x00, 0xFE, 0x00], {
    offset: 8
  })) {
    return {
      ext: 'nef',
      mime: 'image/x-nikon-nef'
    };
  }

  if (check([0x49, 0x49, 0x55, 0x00, 0x18, 0x00, 0x00, 0x00, 0x88, 0xE7, 0x74, 0xD8])) {
    return {
      ext: 'rw2',
      mime: 'image/x-panasonic-rw2'
    };
  } // `raf` is here just to keep all the raw image detectors together.


  if (checkString('FUJIFILMCCD-RAW')) {
    return {
      ext: 'raf',
      mime: 'image/x-fujifilm-raf'
    };
  }

  if (check([0x49, 0x49, 0x2A, 0x0]) || check([0x4D, 0x4D, 0x0, 0x2A])) {
    return {
      ext: 'tif',
      mime: 'image/tiff'
    };
  }

  if (check([0x42, 0x4D])) {
    return {
      ext: 'bmp',
      mime: 'image/bmp'
    };
  }

  if (check([0x49, 0x49, 0xBC])) {
    return {
      ext: 'jxr',
      mime: 'image/vnd.ms-photo'
    };
  }

  if (check([0x38, 0x42, 0x50, 0x53])) {
    return {
      ext: 'psd',
      mime: 'image/vnd.adobe.photoshop'
    };
  } // Zip-based file formats
  // Need to be before the `zip` check


  var zipHeader = [0x50, 0x4B, 0x3, 0x4];

  if (check(zipHeader)) {
    if (check([0x6D, 0x69, 0x6D, 0x65, 0x74, 0x79, 0x70, 0x65, 0x61, 0x70, 0x70, 0x6C, 0x69, 0x63, 0x61, 0x74, 0x69, 0x6F, 0x6E, 0x2F, 0x65, 0x70, 0x75, 0x62, 0x2B, 0x7A, 0x69, 0x70], {
      offset: 30
    })) {
      return {
        ext: 'epub',
        mime: 'application/epub+zip'
      };
    } // Assumes signed `.xpi` from addons.mozilla.org


    if (check(xpiZipFilename, {
      offset: 30
    })) {
      return {
        ext: 'xpi',
        mime: 'application/x-xpinstall'
      };
    }

    if (checkString('mimetypeapplication/vnd.oasis.opendocument.text', {
      offset: 30
    })) {
      return {
        ext: 'odt',
        mime: 'application/vnd.oasis.opendocument.text'
      };
    }

    if (checkString('mimetypeapplication/vnd.oasis.opendocument.spreadsheet', {
      offset: 30
    })) {
      return {
        ext: 'ods',
        mime: 'application/vnd.oasis.opendocument.spreadsheet'
      };
    }

    if (checkString('mimetypeapplication/vnd.oasis.opendocument.presentation', {
      offset: 30
    })) {
      return {
        ext: 'odp',
        mime: 'application/vnd.oasis.opendocument.presentation'
      };
    } // The docx, xlsx and pptx file types extend the Office Open XML file format:
    // https://en.wikipedia.org/wiki/Office_Open_XML_file_formats
    // We look for:
    // - one entry named '[Content_Types].xml' or '_rels/.rels',
    // - one entry indicating specific type of file.
    // MS Office, OpenOffice and LibreOffice may put the parts in different order, so the check should not rely on it.


    var zipHeaderIndex = 0; // The first zip header was already found at index 0

    var oxmlFound = false;
    var type;

    do {
      var offset = zipHeaderIndex + 30;

      if (!oxmlFound) {
        oxmlFound = check(oxmlContentTypes, {
          offset: offset
        }) || check(oxmlRels, {
          offset: offset
        });
      }

      if (!type) {
        if (checkString('word/', {
          offset: offset
        })) {
          type = {
            ext: 'docx',
            mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          };
        } else if (checkString('ppt/', {
          offset: offset
        })) {
          type = {
            ext: 'pptx',
            mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          };
        } else if (checkString('xl/', {
          offset: offset
        })) {
          type = {
            ext: 'xlsx',
            mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          };
        }
      }

      if (oxmlFound && type) {
        return type;
      }

      zipHeaderIndex = multiByteIndexOf(buffer, zipHeader, offset);
    } while (zipHeaderIndex >= 0); // No more zip parts available in the buffer, but maybe we are almost certain about the type?


    if (type) {
      return type;
    }
  }

  if (check([0x50, 0x4B]) && (buffer[2] === 0x3 || buffer[2] === 0x5 || buffer[2] === 0x7) && (buffer[3] === 0x4 || buffer[3] === 0x6 || buffer[3] === 0x8)) {
    return {
      ext: 'zip',
      mime: 'application/zip'
    };
  }

  if (check([0x30, 0x30, 0x30, 0x30, 0x30, 0x30], {
    offset: 148,
    mask: [0xF8, 0xF8, 0xF8, 0xF8, 0xF8, 0xF8]
  }) && // Valid tar checksum
  tarHeaderChecksumMatches(buffer)) {
    return {
      ext: 'tar',
      mime: 'application/x-tar'
    };
  }

  if (check([0x52, 0x61, 0x72, 0x21, 0x1A, 0x7]) && (buffer[6] === 0x0 || buffer[6] === 0x1)) {
    return {
      ext: 'rar',
      mime: 'application/x-rar-compressed'
    };
  }

  if (check([0x1F, 0x8B, 0x8])) {
    return {
      ext: 'gz',
      mime: 'application/gzip'
    };
  }

  if (check([0x42, 0x5A, 0x68])) {
    return {
      ext: 'bz2',
      mime: 'application/x-bzip2'
    };
  }

  if (check([0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C])) {
    return {
      ext: '7z',
      mime: 'application/x-7z-compressed'
    };
  }

  if (check([0x78, 0x01])) {
    return {
      ext: 'dmg',
      mime: 'application/x-apple-diskimage'
    };
  } // `mov` format variants


  if (check([0x66, 0x72, 0x65, 0x65], {
    offset: 4
  }) || // `free`
  check([0x6D, 0x64, 0x61, 0x74], {
    offset: 4
  }) || // `mdat` MJPEG
  check([0x6D, 0x6F, 0x6F, 0x76], {
    offset: 4
  }) || // `moov`
  check([0x77, 0x69, 0x64, 0x65], {
    offset: 4
  }) // `wide`
  ) {
    return {
      ext: 'mov',
      mime: 'video/quicktime'
    };
  } // File Type Box (https://en.wikipedia.org/wiki/ISO_base_media_file_format)
  // It's not required to be first, but it's recommended to be. Almost all ISO base media files start with `ftyp` box.
  // `ftyp` box must contain a brand major identifier, which must consist of ISO 8859-1 printable characters.
  // Here we check for 8859-1 printable characters (for simplicity, it's a mask which also catches one non-printable character).


  if (check([0x66, 0x74, 0x79, 0x70], {
    offset: 4
  }) && // `ftyp`
  (buffer[8] & 0x60) !== 0x00 && (buffer[9] & 0x60) !== 0x00 && (buffer[10] & 0x60) !== 0x00 && (buffer[11] & 0x60) !== 0x00 // Brand major
  ) {
    // They all can have MIME `video/mp4` except `application/mp4` special-case which is hard to detect.
    // For some cases, we're specific, everything else falls to `video/mp4` with `mp4` extension.
    var brandMajor = uint8ArrayUtf8ByteString(buffer, 8, 12);

    switch (brandMajor) {
      case 'mif1':
        return {
          ext: 'heic',
          mime: 'image/heif'
        };

      case 'msf1':
        return {
          ext: 'heic',
          mime: 'image/heif-sequence'
        };

      case 'heic':
      case 'heix':
        return {
          ext: 'heic',
          mime: 'image/heic'
        };

      case 'hevc':
      case 'hevx':
        return {
          ext: 'heic',
          mime: 'image/heic-sequence'
        };

      case 'qt  ':
        return {
          ext: 'mov',
          mime: 'video/quicktime'
        };

      case 'M4V ':
      case 'M4VH':
      case 'M4VP':
        return {
          ext: 'm4v',
          mime: 'video/x-m4v'
        };

      case 'M4P ':
        return {
          ext: 'm4p',
          mime: 'video/mp4'
        };

      case 'M4B ':
        return {
          ext: 'm4b',
          mime: 'audio/mp4'
        };

      case 'M4A ':
        return {
          ext: 'm4a',
          mime: 'audio/x-m4a'
        };

      case 'F4V ':
        return {
          ext: 'f4v',
          mime: 'video/mp4'
        };

      case 'F4P ':
        return {
          ext: 'f4p',
          mime: 'video/mp4'
        };

      case 'F4A ':
        return {
          ext: 'f4a',
          mime: 'audio/mp4'
        };

      case 'F4B ':
        return {
          ext: 'f4b',
          mime: 'audio/mp4'
        };

      default:
        if (brandMajor.startsWith('3g')) {
          if (brandMajor.startsWith('3g2')) {
            return {
              ext: '3g2',
              mime: 'video/3gpp2'
            };
          }

          return {
            ext: '3gp',
            mime: 'video/3gpp'
          };
        }

        return {
          ext: 'mp4',
          mime: 'video/mp4'
        };
    }
  }

  if (check([0x4D, 0x54, 0x68, 0x64])) {
    return {
      ext: 'mid',
      mime: 'audio/midi'
    };
  } // https://github.com/threatstack/libmagic/blob/master/magic/Magdir/matroska


  if (check([0x1A, 0x45, 0xDF, 0xA3])) {
    var _sliced = buffer.subarray(4, 4 + 4096);

    var idPos = _sliced.findIndex(function (el, i, arr) {
      return arr[i] === 0x42 && arr[i + 1] === 0x82;
    });

    if (idPos !== -1) {
      var docTypePos = idPos + 3;

      var findDocType = function findDocType(type) {
        return _toConsumableArray(type).every(function (c, i) {
          return _sliced[docTypePos + i] === c.charCodeAt(0);
        });
      };

      if (findDocType('matroska')) {
        return {
          ext: 'mkv',
          mime: 'video/x-matroska'
        };
      }

      if (findDocType('webm')) {
        return {
          ext: 'webm',
          mime: 'video/webm'
        };
      }
    }
  } // RIFF file format which might be AVI, WAV, QCP, etc


  if (check([0x52, 0x49, 0x46, 0x46])) {
    if (check([0x41, 0x56, 0x49], {
      offset: 8
    })) {
      return {
        ext: 'avi',
        mime: 'video/vnd.avi'
      };
    }

    if (check([0x57, 0x41, 0x56, 0x45], {
      offset: 8
    })) {
      return {
        ext: 'wav',
        mime: 'audio/vnd.wave'
      };
    } // QLCM, QCP file


    if (check([0x51, 0x4C, 0x43, 0x4D], {
      offset: 8
    })) {
      return {
        ext: 'qcp',
        mime: 'audio/qcelp'
      };
    }
  } // ASF_Header_Object first 80 bytes


  if (check([0x30, 0x26, 0xB2, 0x75, 0x8E, 0x66, 0xCF, 0x11, 0xA6, 0xD9])) {
    // Search for header should be in first 1KB of file.
    var _offset = 30;

    do {
      var objectSize = readUInt64LE(buffer, _offset + 16);

      if (check([0x91, 0x07, 0xDC, 0xB7, 0xB7, 0xA9, 0xCF, 0x11, 0x8E, 0xE6, 0x00, 0xC0, 0x0C, 0x20, 0x53, 0x65], {
        offset: _offset
      })) {
        // Sync on Stream-Properties-Object (B7DC0791-A9B7-11CF-8EE6-00C00C205365)
        if (check([0x40, 0x9E, 0x69, 0xF8, 0x4D, 0x5B, 0xCF, 0x11, 0xA8, 0xFD, 0x00, 0x80, 0x5F, 0x5C, 0x44, 0x2B], {
          offset: _offset + 24
        })) {
          // Found audio:
          return {
            ext: 'wma',
            mime: 'audio/x-ms-wma'
          };
        }

        if (check([0xC0, 0xEF, 0x19, 0xBC, 0x4D, 0x5B, 0xCF, 0x11, 0xA8, 0xFD, 0x00, 0x80, 0x5F, 0x5C, 0x44, 0x2B], {
          offset: _offset + 24
        })) {
          // Found video:
          return {
            ext: 'wmv',
            mime: 'video/x-ms-asf'
          };
        }

        break;
      }

      _offset += objectSize;
    } while (_offset + 24 <= buffer.length); // Default to ASF generic extension


    return {
      ext: 'asf',
      mime: 'application/vnd.ms-asf'
    };
  }

  if (check([0x0, 0x0, 0x1, 0xBA]) || check([0x0, 0x0, 0x1, 0xB3])) {
    return {
      ext: 'mpg',
      mime: 'video/mpeg'
    };
  } // Check for MPEG header at different starting offsets


  for (var start = 0; start < 2 && start < buffer.length - 16; start++) {
    if (check([0x49, 0x44, 0x33], {
      offset: start
    }) || // ID3 header
    check([0xFF, 0xE2], {
      offset: start,
      mask: [0xFF, 0xE6]
    }) // MPEG 1 or 2 Layer 3 header
    ) {
      return {
        ext: 'mp3',
        mime: 'audio/mpeg'
      };
    }

    if (check([0xFF, 0xE4], {
      offset: start,
      mask: [0xFF, 0xE6]
    }) // MPEG 1 or 2 Layer 2 header
    ) {
      return {
        ext: 'mp2',
        mime: 'audio/mpeg'
      };
    }

    if (check([0xFF, 0xF8], {
      offset: start,
      mask: [0xFF, 0xFC]
    }) // MPEG 2 layer 0 using ADTS
    ) {
      return {
        ext: 'mp2',
        mime: 'audio/mpeg'
      };
    }

    if (check([0xFF, 0xF0], {
      offset: start,
      mask: [0xFF, 0xFC]
    }) // MPEG 4 layer 0 using ADTS
    ) {
      return {
        ext: 'mp4',
        mime: 'audio/mpeg'
      };
    }
  } // Needs to be before `ogg` check


  if (check([0x4F, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64], {
    offset: 28
  })) {
    return {
      ext: 'opus',
      mime: 'audio/opus'
    };
  } // If 'OggS' in first  bytes, then OGG container


  if (check([0x4F, 0x67, 0x67, 0x53])) {
    // This is a OGG container
    // If ' theora' in header.
    if (check([0x80, 0x74, 0x68, 0x65, 0x6F, 0x72, 0x61], {
      offset: 28
    })) {
      return {
        ext: 'ogv',
        mime: 'video/ogg'
      };
    } // If '\x01video' in header.


    if (check([0x01, 0x76, 0x69, 0x64, 0x65, 0x6F, 0x00], {
      offset: 28
    })) {
      return {
        ext: 'ogm',
        mime: 'video/ogg'
      };
    } // If ' FLAC' in header  https://xiph.org/flac/faq.html


    if (check([0x7F, 0x46, 0x4C, 0x41, 0x43], {
      offset: 28
    })) {
      return {
        ext: 'oga',
        mime: 'audio/ogg'
      };
    } // 'Speex  ' in header https://en.wikipedia.org/wiki/Speex


    if (check([0x53, 0x70, 0x65, 0x65, 0x78, 0x20, 0x20], {
      offset: 28
    })) {
      return {
        ext: 'spx',
        mime: 'audio/ogg'
      };
    } // If '\x01vorbis' in header


    if (check([0x01, 0x76, 0x6F, 0x72, 0x62, 0x69, 0x73], {
      offset: 28
    })) {
      return {
        ext: 'ogg',
        mime: 'audio/ogg'
      };
    } // Default OGG container https://www.iana.org/assignments/media-types/application/ogg


    return {
      ext: 'ogx',
      mime: 'application/ogg'
    };
  }

  if (check([0x66, 0x4C, 0x61, 0x43])) {
    return {
      ext: 'flac',
      mime: 'audio/x-flac'
    };
  }

  if (check([0x4D, 0x41, 0x43, 0x20])) {
    // 'MAC '
    return {
      ext: 'ape',
      mime: 'audio/ape'
    };
  }

  if (check([0x77, 0x76, 0x70, 0x6B])) {
    // 'wvpk'
    return {
      ext: 'wv',
      mime: 'audio/wavpack'
    };
  }

  if (check([0x23, 0x21, 0x41, 0x4D, 0x52, 0x0A])) {
    return {
      ext: 'amr',
      mime: 'audio/amr'
    };
  }

  if (check([0x25, 0x50, 0x44, 0x46])) {
    return {
      ext: 'pdf',
      mime: 'application/pdf'
    };
  }

  if (check([0x4D, 0x5A])) {
    return {
      ext: 'exe',
      mime: 'application/x-msdownload'
    };
  }

  if ((buffer[0] === 0x43 || buffer[0] === 0x46) && check([0x57, 0x53], {
    offset: 1
  })) {
    return {
      ext: 'swf',
      mime: 'application/x-shockwave-flash'
    };
  }

  if (check([0x7B, 0x5C, 0x72, 0x74, 0x66])) {
    return {
      ext: 'rtf',
      mime: 'application/rtf'
    };
  }

  if (check([0x00, 0x61, 0x73, 0x6D])) {
    return {
      ext: 'wasm',
      mime: 'application/wasm'
    };
  }

  if (check([0x77, 0x4F, 0x46, 0x46]) && (check([0x00, 0x01, 0x00, 0x00], {
    offset: 4
  }) || check([0x4F, 0x54, 0x54, 0x4F], {
    offset: 4
  }))) {
    return {
      ext: 'woff',
      mime: 'font/woff'
    };
  }

  if (check([0x77, 0x4F, 0x46, 0x32]) && (check([0x00, 0x01, 0x00, 0x00], {
    offset: 4
  }) || check([0x4F, 0x54, 0x54, 0x4F], {
    offset: 4
  }))) {
    return {
      ext: 'woff2',
      mime: 'font/woff2'
    };
  }

  if (check([0x4C, 0x50], {
    offset: 34
  }) && (check([0x00, 0x00, 0x01], {
    offset: 8
  }) || check([0x01, 0x00, 0x02], {
    offset: 8
  }) || check([0x02, 0x00, 0x02], {
    offset: 8
  }))) {
    return {
      ext: 'eot',
      mime: 'application/vnd.ms-fontobject'
    };
  }

  if (check([0x00, 0x01, 0x00, 0x00, 0x00])) {
    return {
      ext: 'ttf',
      mime: 'font/ttf'
    };
  }

  if (check([0x4F, 0x54, 0x54, 0x4F, 0x00])) {
    return {
      ext: 'otf',
      mime: 'font/otf'
    };
  }

  if (check([0x00, 0x00, 0x01, 0x00])) {
    return {
      ext: 'ico',
      mime: 'image/x-icon'
    };
  }

  if (check([0x00, 0x00, 0x02, 0x00])) {
    return {
      ext: 'cur',
      mime: 'image/x-icon'
    };
  }

  if (check([0x46, 0x4C, 0x56, 0x01])) {
    return {
      ext: 'flv',
      mime: 'video/x-flv'
    };
  }

  if (check([0x25, 0x21])) {
    return {
      ext: 'ps',
      mime: 'application/postscript'
    };
  }

  if (check([0xFD, 0x37, 0x7A, 0x58, 0x5A, 0x00])) {
    return {
      ext: 'xz',
      mime: 'application/x-xz'
    };
  }

  if (check([0x53, 0x51, 0x4C, 0x69])) {
    return {
      ext: 'sqlite',
      mime: 'application/x-sqlite3'
    };
  }

  if (check([0x4E, 0x45, 0x53, 0x1A])) {
    return {
      ext: 'nes',
      mime: 'application/x-nintendo-nes-rom'
    };
  }

  if (check([0x43, 0x72, 0x32, 0x34])) {
    return {
      ext: 'crx',
      mime: 'application/x-google-chrome-extension'
    };
  }

  if (check([0x4D, 0x53, 0x43, 0x46]) || check([0x49, 0x53, 0x63, 0x28])) {
    return {
      ext: 'cab',
      mime: 'application/vnd.ms-cab-compressed'
    };
  } // Needs to be before `ar` check


  if (check([0x21, 0x3C, 0x61, 0x72, 0x63, 0x68, 0x3E, 0x0A, 0x64, 0x65, 0x62, 0x69, 0x61, 0x6E, 0x2D, 0x62, 0x69, 0x6E, 0x61, 0x72, 0x79])) {
    return {
      ext: 'deb',
      mime: 'application/x-deb'
    };
  }

  if (check([0x21, 0x3C, 0x61, 0x72, 0x63, 0x68, 0x3E])) {
    return {
      ext: 'ar',
      mime: 'application/x-unix-archive'
    };
  }

  if (check([0xED, 0xAB, 0xEE, 0xDB])) {
    return {
      ext: 'rpm',
      mime: 'application/x-rpm'
    };
  }

  if (check([0x1F, 0xA0]) || check([0x1F, 0x9D])) {
    return {
      ext: 'Z',
      mime: 'application/x-compress'
    };
  }

  if (check([0x4C, 0x5A, 0x49, 0x50])) {
    return {
      ext: 'lz',
      mime: 'application/x-lzip'
    };
  }

  if (check([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x3E])) {
    return {
      ext: 'msi',
      mime: 'application/x-msi'
    };
  }

  if (check([0x06, 0x0E, 0x2B, 0x34, 0x02, 0x05, 0x01, 0x01, 0x0D, 0x01, 0x02, 0x01, 0x01, 0x02])) {
    return {
      ext: 'mxf',
      mime: 'application/mxf'
    };
  }

  if (check([0x47], {
    offset: 4
  }) && (check([0x47], {
    offset: 192
  }) || check([0x47], {
    offset: 196
  }))) {
    return {
      ext: 'mts',
      mime: 'video/mp2t'
    };
  }

  if (check([0x42, 0x4C, 0x45, 0x4E, 0x44, 0x45, 0x52])) {
    return {
      ext: 'blend',
      mime: 'application/x-blender'
    };
  }

  if (check([0x42, 0x50, 0x47, 0xFB])) {
    return {
      ext: 'bpg',
      mime: 'image/bpg'
    };
  }

  if (check([0x00, 0x00, 0x00, 0x0C, 0x6A, 0x50, 0x20, 0x20, 0x0D, 0x0A, 0x87, 0x0A])) {
    // JPEG-2000 family
    if (check([0x6A, 0x70, 0x32, 0x20], {
      offset: 20
    })) {
      return {
        ext: 'jp2',
        mime: 'image/jp2'
      };
    }

    if (check([0x6A, 0x70, 0x78, 0x20], {
      offset: 20
    })) {
      return {
        ext: 'jpx',
        mime: 'image/jpx'
      };
    }

    if (check([0x6A, 0x70, 0x6D, 0x20], {
      offset: 20
    })) {
      return {
        ext: 'jpm',
        mime: 'image/jpm'
      };
    }

    if (check([0x6D, 0x6A, 0x70, 0x32], {
      offset: 20
    })) {
      return {
        ext: 'mj2',
        mime: 'image/mj2'
      };
    }
  }

  if (check([0x46, 0x4F, 0x52, 0x4D])) {
    return {
      ext: 'aif',
      mime: 'audio/aiff'
    };
  }

  if (checkString('<?xml ')) {
    return {
      ext: 'xml',
      mime: 'application/xml'
    };
  }

  if (check([0x42, 0x4F, 0x4F, 0x4B, 0x4D, 0x4F, 0x42, 0x49], {
    offset: 60
  })) {
    return {
      ext: 'mobi',
      mime: 'application/x-mobipocket-ebook'
    };
  }

  if (check([0xAB, 0x4B, 0x54, 0x58, 0x20, 0x31, 0x31, 0xBB, 0x0D, 0x0A, 0x1A, 0x0A])) {
    return {
      ext: 'ktx',
      mime: 'image/ktx'
    };
  }

  if (check([0x44, 0x49, 0x43, 0x4D], {
    offset: 128
  })) {
    return {
      ext: 'dcm',
      mime: 'application/dicom'
    };
  } // Musepack, SV7


  if (check([0x4D, 0x50, 0x2B])) {
    return {
      ext: 'mpc',
      mime: 'audio/x-musepack'
    };
  } // Musepack, SV8


  if (check([0x4D, 0x50, 0x43, 0x4B])) {
    return {
      ext: 'mpc',
      mime: 'audio/x-musepack'
    };
  }

  if (check([0x42, 0x45, 0x47, 0x49, 0x4E, 0x3A])) {
    return {
      ext: 'ics',
      mime: 'text/calendar'
    };
  }

  if (check([0x67, 0x6C, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00])) {
    return {
      ext: 'glb',
      mime: 'model/gltf-binary'
    };
  }

  if (check([0xD4, 0xC3, 0xB2, 0xA1]) || check([0xA1, 0xB2, 0xC3, 0xD4])) {
    return {
      ext: 'pcap',
      mime: 'application/vnd.tcpdump.pcap'
    };
  } // Sony DSD Stream File (DSF)


  if (check([0x44, 0x53, 0x44, 0x20])) {
    return {
      ext: 'dsf',
      mime: 'audio/x-dsf' // Non-standard

    };
  }

  if (check([0x4C, 0x00, 0x00, 0x00, 0x01, 0x14, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0xC0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x46])) {
    return {
      ext: 'lnk',
      mime: 'application/x.ms.shortcut' // Invented by us

    };
  }

  if (check([0x62, 0x6F, 0x6F, 0x6B, 0x00, 0x00, 0x00, 0x00, 0x6D, 0x61, 0x72, 0x6B, 0x00, 0x00, 0x00, 0x00])) {
    return {
      ext: 'alias',
      mime: 'application/x.apple.alias' // Invented by us

    };
  }

  if (checkString('Creative Voice File')) {
    return {
      ext: 'voc',
      mime: 'audio/x-voc'
    };
  }

  if (check([0x0B, 0x77])) {
    return {
      ext: 'ac3',
      mime: 'audio/vnd.dolby.dd-raw'
    };
  }

  if ((check([0x7E, 0x10, 0x04]) || check([0x7E, 0x18, 0x04])) && check([0x30, 0x4D, 0x49, 0x45], {
    offset: 4
  })) {
    return {
      ext: 'mie',
      mime: 'application/x-mie'
    };
  }

  if (check([0x41, 0x52, 0x52, 0x4F, 0x57, 0x31, 0x00, 0x00])) {
    return {
      ext: 'arrow',
      mime: 'application/x-apache-arrow'
    };
  }

  if (check([0x27, 0x0A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], {
    offset: 2
  })) {
    return {
      ext: 'shp',
      mime: 'application/x-esri-shape'
    };
  }
};

module.exports = fileType;
Object.defineProperty(fileType, 'minimumBytes', {
  value: 4100
});

fileType.stream = function (readableStream) {
  return new Promise(function (resolve, reject) {
    // Using `eval` to work around issues when bundling with Webpack
    var stream = eval('require')('stream'); // eslint-disable-line no-eval

    readableStream.on('error', reject);
    readableStream.once('readable', function () {
      var pass = new stream.PassThrough();
      var chunk = readableStream.read(module.exports.minimumBytes) || readableStream.read();

      try {
        pass.fileType = fileType(chunk);
      } catch (error) {
        reject(error);
      }

      readableStream.unshift(chunk);

      if (stream.pipeline) {
        resolve(stream.pipeline(readableStream, pass, function () {}));
      } else {
        resolve(readableStream.pipe(pass));
      }
    });
  });
};

Object.defineProperty(fileType, 'extensions', {
  get: function get() {
    return new Set(supported.extensions);
  }
});
Object.defineProperty(fileType, 'mimeTypes', {
  get: function get() {
    return new Set(supported.mimeTypes);
  }
});

/***/ }),

/***/ "./node_modules/file-type/supported.js":
/*!*********************************************!*\
  !*** ./node_modules/file-type/supported.js ***!
  \*********************************************/
/***/ ((module) => {

"use strict";


module.exports = {
  extensions: ['jpg', 'png', 'apng', 'gif', 'webp', 'flif', 'cr2', 'orf', 'arw', 'dng', 'nef', 'rw2', 'raf', 'tif', 'bmp', 'jxr', 'psd', 'zip', 'tar', 'rar', 'gz', 'bz2', '7z', 'dmg', 'mp4', 'mid', 'mkv', 'webm', 'mov', 'avi', 'mpg', 'mp2', 'mp3', 'm4a', 'oga', 'ogg', 'ogv', 'opus', 'flac', 'wav', 'spx', 'amr', 'pdf', 'epub', 'exe', 'swf', 'rtf', 'wasm', 'woff', 'woff2', 'eot', 'ttf', 'otf', 'ico', 'flv', 'ps', 'xz', 'sqlite', 'nes', 'crx', 'xpi', 'cab', 'deb', 'ar', 'rpm', 'Z', 'lz', 'msi', 'mxf', 'mts', 'blend', 'bpg', 'docx', 'pptx', 'xlsx', '3gp', '3g2', 'jp2', 'jpm', 'jpx', 'mj2', 'aif', 'qcp', 'odt', 'ods', 'odp', 'xml', 'mobi', 'heic', 'cur', 'ktx', 'ape', 'wv', 'wmv', 'wma', 'dcm', 'ics', 'glb', 'pcap', 'dsf', 'lnk', 'alias', 'voc', 'ac3', 'm4v', 'm4p', 'm4b', 'f4v', 'f4p', 'f4b', 'f4a', 'mie', 'asf', 'ogm', 'ogx', 'mpc', 'arrow', 'shp'],
  mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/flif', 'image/x-canon-cr2', 'image/tiff', 'image/bmp', 'image/vnd.ms-photo', 'image/vnd.adobe.photoshop', 'application/epub+zip', 'application/x-xpinstall', 'application/vnd.oasis.opendocument.text', 'application/vnd.oasis.opendocument.spreadsheet', 'application/vnd.oasis.opendocument.presentation', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip', 'application/x-tar', 'application/x-rar-compressed', 'application/gzip', 'application/x-bzip2', 'application/x-7z-compressed', 'application/x-apple-diskimage', 'application/x-apache-arrow', 'video/mp4', 'audio/midi', 'video/x-matroska', 'video/webm', 'video/quicktime', 'video/vnd.avi', 'audio/vnd.wave', 'audio/qcelp', 'audio/x-ms-wma', 'video/x-ms-asf', 'application/vnd.ms-asf', 'video/mpeg', 'video/3gpp', 'audio/mpeg', 'audio/mp4', // RFC 4337
  'audio/opus', 'video/ogg', 'audio/ogg', 'application/ogg', 'audio/x-flac', 'audio/ape', 'audio/wavpack', 'audio/amr', 'application/pdf', 'application/x-msdownload', 'application/x-shockwave-flash', 'application/rtf', 'application/wasm', 'font/woff', 'font/woff2', 'application/vnd.ms-fontobject', 'font/ttf', 'font/otf', 'image/x-icon', 'video/x-flv', 'application/postscript', 'application/x-xz', 'application/x-sqlite3', 'application/x-nintendo-nes-rom', 'application/x-google-chrome-extension', 'application/vnd.ms-cab-compressed', 'application/x-deb', 'application/x-unix-archive', 'application/x-rpm', 'application/x-compress', 'application/x-lzip', 'application/x-msi', 'application/x-mie', 'application/mxf', 'video/mp2t', 'application/x-blender', 'image/bpg', 'image/jp2', 'image/jpx', 'image/jpm', 'image/mj2', 'audio/aiff', 'application/xml', 'application/x-mobipocket-ebook', 'image/heif', 'image/heif-sequence', 'image/heic', 'image/heic-sequence', 'image/ktx', 'application/dicom', 'audio/x-musepack', 'text/calendar', 'model/gltf-binary', 'application/vnd.tcpdump.pcap', 'audio/x-dsf', // Non-standard
  'application/x.ms.shortcut', // Invented by us
  'application/x.apple.alias', // Invented by us
  'audio/x-voc', 'audio/vnd.dolby.dd-raw', 'audio/x-m4a', 'image/apng', 'image/x-olympus-orf', 'image/x-sony-arw', 'image/x-adobe-dng', 'image/x-nikon-nef', 'image/x-panasonic-rw2', 'image/x-fujifilm-raf', 'video/x-m4v', 'video/3gpp2', 'application/x-esri-shape']
};

/***/ }),

/***/ "./node_modules/file-type/util.js":
/*!****************************************!*\
  !*** ./node_modules/file-type/util.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];


function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

exports.stringToBytes = function (string) {
  return _toConsumableArray(string).map(function (character) {
    return character.charCodeAt(0);
  });
};

var uint8ArrayUtf8ByteString = function uint8ArrayUtf8ByteString(array, start, end) {
  return String.fromCharCode.apply(String, _toConsumableArray(array.slice(start, end)));
};

exports.readUInt64LE = function (buffer) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var n = buffer[offset];
  var mul = 1;
  var i = 0;

  while (++i < 8) {
    mul *= 0x100;
    n += buffer[offset + i] * mul;
  }

  return n;
};

exports.tarHeaderChecksumMatches = function (buffer) {
  // Does not check if checksum field characters are valid
  if (buffer.length < 512) {
    // `tar` header size, cannot compute checksum without it
    return false;
  }

  var MASK_8TH_BIT = 0x80;
  var sum = 256; // Intitalize sum, with 256 as sum of 8 spaces in checksum field

  var signedBitSum = 0; // Initialize signed bit sum

  for (var i = 0; i < 148; i++) {
    var byte = buffer[i];
    sum += byte;
    signedBitSum += byte & MASK_8TH_BIT; // Add signed bit to signed bit sum
  } // Skip checksum field


  for (var _i = 156; _i < 512; _i++) {
    var _byte = buffer[_i];
    sum += _byte;
    signedBitSum += _byte & MASK_8TH_BIT; // Add signed bit to signed bit sum
  }

  var readSum = parseInt(uint8ArrayUtf8ByteString(buffer, 148, 154), 8); // Read sum in header
  // Some implementations compute checksum incorrectly using signed bytes

  return (// Checksum in header equals the sum we calculated
    readSum === sum || // Checksum in header equals sum we calculated plus signed-to-unsigned delta
    readSum === sum - (signedBitSum << 1)
  );
};

exports.multiByteIndexOf = function (buffer, bytesToSearch) {
  var startAt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  // `Buffer#indexOf()` can search for multiple bytes
  if (Buffer && Buffer.isBuffer(buffer)) {
    return buffer.indexOf(Buffer.from(bytesToSearch), startAt);
  }

  var nextBytesMatch = function nextBytesMatch(buffer, bytes, startIndex) {
    for (var i = 1; i < bytes.length; i++) {
      if (bytes[i] !== buffer[startIndex + i]) {
        return false;
      }
    }

    return true;
  }; // `Uint8Array#indexOf()` can search for only a single byte


  var index = buffer.indexOf(bytesToSearch[0], startAt);

  while (index >= 0) {
    if (nextBytesMatch(buffer, bytesToSearch, index)) {
      return index;
    }

    index = buffer.indexOf(bytesToSearch[0], index + 1);
  }

  return -1;
};

exports.uint8ArrayUtf8ByteString = uint8ArrayUtf8ByteString;

/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];
  i += d;
  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;

  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;

  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }

  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);

    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }

    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }

    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = e << mLen | m;
  eLen += mLen;

  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
};

/***/ }),

/***/ "./node_modules/is-electron/index.js":
/*!*******************************************!*\
  !*** ./node_modules/is-electron/index.js ***!
  \*******************************************/
/***/ ((module) => {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

// https://github.com/electron/electron/issues/2288
function isElectron() {
  // Renderer process
  if (typeof window !== 'undefined' && _typeof(window.process) === 'object' && window.process.type === 'renderer') {
    return true;
  } // Main process


  if (typeof process !== 'undefined' && _typeof(process.versions) === 'object' && !!process.versions.electron) {
    return true;
  } // Detect the user agent when the `nodeIntegration` option is set to true


  if ((typeof navigator === "undefined" ? "undefined" : _typeof(navigator)) === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
    return true;
  }

  return false;
}

module.exports = isElectron;

/***/ }),

/***/ "./node_modules/is-url/index.js":
/*!**************************************!*\
  !*** ./node_modules/is-url/index.js ***!
  \**************************************/
/***/ ((module) => {

/**
 * Expose `isUrl`.
 */
module.exports = isUrl;
/**
 * RegExps.
 * A URL must match #1 and then at least one of #2/#3.
 * Use two levels of REs to avoid REDOS.
 */

var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
var localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/;
var nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;
/**
 * Loosely validate a URL `string`.
 *
 * @param {String} string
 * @return {Boolean}
 */

function isUrl(string) {
  if (typeof string !== 'string') {
    return false;
  }

  var match = string.match(protocolAndDomainRE);

  if (!match) {
    return false;
  }

  var everythingAfterProtocol = match[1];

  if (!everythingAfterProtocol) {
    return false;
  }

  if (localhostDomainRE.test(everythingAfterProtocol) || nonLocalhostDomainRE.test(everythingAfterProtocol)) {
    return true;
  }

  return false;
}

/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var runtime = function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.

  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }

  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.

    generator._invoke = makeInvokeMethod(innerFn, self, context);
    return generator;
  }

  exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.

  var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.


  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  exports.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }

    genFun.prototype = Object.create(Gp);
    return genFun;
  }; // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.


  exports.awrap = function (arg) {
    return {
      __await: arg
    };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;

        if (value && _typeof(value) === "object" && hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function (error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    } // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).


    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.

  exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;
    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        } // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;

        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);

          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;
        var record = tryCatch(innerFn, self, context);

        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted; // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.

          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  } // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.


  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

      context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.

      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    } // The delegate iterator is finished, so forget it and continue with
    // the outer generator.


    context.delegate = null;
    return ContinueSentinel;
  } // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.


  defineIteratorMethods(Gp);
  define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.

  define(Gp, iteratorSymbol, function () {
    return this;
  });
  define(Gp, "toString", function () {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{
      tryLoc: "root"
    }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function (object) {
    var keys = [];

    for (var key in object) {
      keys.push(key);
    }

    keys.reverse(); // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.

    return function next() {
      while (keys.length) {
        var key = keys.pop();

        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      } // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.


      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];

      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;
          return next;
        };

        return next.next = next;
      }
    } // Return an iterator with no values.


    return {
      next: doneResult
    };
  }

  exports.values = values;

  function doneResult() {
    return {
      value: undefined,
      done: true
    };
  }

  Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0; // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.

      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined;
      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },
    stop: function stop() {
      this.done = true;
      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;

      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;

      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      } // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.


      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  }; // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.

  return exports;
}( // If this script is executing as a CommonJS module, use module.exports
// as the regeneratorRuntime namespace. Otherwise create a new empty
// object. Either way, the resulting object will be used to initialize
// the regeneratorRuntime variable at the top of this file.
( false ? 0 : _typeof(module)) === "object" ? module.exports : {});

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if ((typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

/***/ }),

/***/ "./node_modules/wasm-feature-detect/dist/esm/index.js":
/*!************************************************************!*\
  !*** ./node_modules/wasm-feature-detect/dist/esm/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bigInt": () => (/* binding */ bigInt),
/* harmony export */   "bulkMemory": () => (/* binding */ bulkMemory),
/* harmony export */   "exceptions": () => (/* binding */ exceptions),
/* harmony export */   "multiValue": () => (/* binding */ multiValue),
/* harmony export */   "mutableGlobals": () => (/* binding */ mutableGlobals),
/* harmony export */   "referenceTypes": () => (/* binding */ referenceTypes),
/* harmony export */   "saturatedFloatToInt": () => (/* binding */ saturatedFloatToInt),
/* harmony export */   "signExtensions": () => (/* binding */ signExtensions),
/* harmony export */   "simd": () => (/* binding */ simd),
/* harmony export */   "tailCall": () => (/* binding */ tailCall),
/* harmony export */   "threads": () => (/* binding */ threads)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var bigInt = function bigInt() {
  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(e) {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return WebAssembly.instantiate(e);

            case 3:
              _context.t0 = _context.sent.instance.exports.b(BigInt(0));
              _context.t1 = BigInt(0);
              return _context.abrupt("return", _context.t0 === _context.t1);

            case 8:
              _context.prev = 8;
              _context.t2 = _context["catch"](0);
              return _context.abrupt("return", !1);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 8]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }()(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 6, 1, 96, 1, 126, 1, 126, 3, 2, 1, 0, 7, 5, 1, 1, 98, 0, 0, 10, 6, 1, 4, 0, 32, 0, 11]));
},
    bulkMemory = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 3, 1, 0, 1, 10, 14, 1, 12, 0, 65, 0, 65, 0, 65, 0, 252, 10, 0, 0, 11])));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function bulkMemory() {
    return _ref2.apply(this, arguments);
  };
}(),
    exceptions = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 8, 1, 6, 0, 6, 64, 25, 11, 11])));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function exceptions() {
    return _ref3.apply(this, arguments);
  };
}(),
    multiValue = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 6, 1, 96, 0, 2, 127, 127, 3, 2, 1, 0, 10, 8, 1, 6, 0, 65, 0, 65, 0, 11])));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function multiValue() {
    return _ref4.apply(this, arguments);
  };
}(),
    mutableGlobals = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt("return", WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 2, 8, 1, 1, 97, 1, 98, 3, 127, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 5, 1, 1, 97, 3, 1])));

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function mutableGlobals() {
    return _ref5.apply(this, arguments);
  };
}(),
    referenceTypes = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            return _context6.abrupt("return", WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 7, 1, 5, 0, 208, 112, 26, 11])));

          case 1:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function referenceTypes() {
    return _ref6.apply(this, arguments);
  };
}(),
    saturatedFloatToInt = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            return _context7.abrupt("return", WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 12, 1, 10, 0, 67, 0, 0, 0, 0, 252, 0, 26, 11])));

          case 1:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function saturatedFloatToInt() {
    return _ref7.apply(this, arguments);
  };
}(),
    signExtensions = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            return _context8.abrupt("return", WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 8, 1, 6, 0, 65, 0, 192, 26, 11])));

          case 1:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function signExtensions() {
    return _ref8.apply(this, arguments);
  };
}(),
    simd = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            return _context9.abrupt("return", WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11])));

          case 1:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function simd() {
    return _ref9.apply(this, arguments);
  };
}(),
    tailCall = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            return _context10.abrupt("return", WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 6, 1, 4, 0, 18, 0, 11])));

          case 1:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function tailCall() {
    return _ref10.apply(this, arguments);
  };
}(),
    threads = function threads() {
  return function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(e) {
      return _regeneratorRuntime().wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.prev = 0;
              return _context11.abrupt("return", ("undefined" != typeof MessageChannel && new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)), WebAssembly.validate(e)));

            case 4:
              _context11.prev = 4;
              _context11.t0 = _context11["catch"](0);
              return _context11.abrupt("return", !1);

            case 7:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, null, [[0, 4]]);
    }));

    return function (_x2) {
      return _ref11.apply(this, arguments);
    };
  }()(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11]));
};

/***/ }),

/***/ "./node_modules/zlibjs/bin/node-zlib.js":
/*!**********************************************!*\
  !*** ./node_modules/zlibjs/bin/node-zlib.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */
(function () {
  'use strict';

  function q(b) {
    throw b;
  }

  var t = void 0,
      v = !0;
  var B = "undefined" !== typeof Uint8Array && "undefined" !== typeof Uint16Array && "undefined" !== typeof Uint32Array && "undefined" !== typeof DataView;

  function G(b, a) {
    this.index = "number" === typeof a ? a : 0;
    this.m = 0;
    this.buffer = b instanceof (B ? Uint8Array : Array) ? b : new (B ? Uint8Array : Array)(32768);
    2 * this.buffer.length <= this.index && q(Error("invalid index"));
    this.buffer.length <= this.index && this.f();
  }

  G.prototype.f = function () {
    var b = this.buffer,
        a,
        c = b.length,
        d = new (B ? Uint8Array : Array)(c << 1);
    if (B) d.set(b);else for (a = 0; a < c; ++a) {
      d[a] = b[a];
    }
    return this.buffer = d;
  };

  G.prototype.d = function (b, a, c) {
    var d = this.buffer,
        e = this.index,
        f = this.m,
        g = d[e],
        k;
    c && 1 < a && (b = 8 < a ? (I[b & 255] << 24 | I[b >>> 8 & 255] << 16 | I[b >>> 16 & 255] << 8 | I[b >>> 24 & 255]) >> 32 - a : I[b] >> 8 - a);
    if (8 > a + f) g = g << a | b, f += a;else for (k = 0; k < a; ++k) {
      g = g << 1 | b >> a - k - 1 & 1, 8 === ++f && (f = 0, d[e++] = I[g], g = 0, e === d.length && (d = this.f()));
    }
    d[e] = g;
    this.buffer = d;
    this.m = f;
    this.index = e;
  };

  G.prototype.finish = function () {
    var b = this.buffer,
        a = this.index,
        c;
    0 < this.m && (b[a] <<= 8 - this.m, b[a] = I[b[a]], a++);
    B ? c = b.subarray(0, a) : (b.length = a, c = b);
    return c;
  };

  var aa = new (B ? Uint8Array : Array)(256),
      L;

  for (L = 0; 256 > L; ++L) {
    for (var R = L, ba = R, ca = 7, R = R >>> 1; R; R >>>= 1) {
      ba <<= 1, ba |= R & 1, --ca;
    }

    aa[L] = (ba << ca & 255) >>> 0;
  }

  var I = aa;

  function ha(b, a, c) {
    var d,
        e = "number" === typeof a ? a : a = 0,
        f = "number" === typeof c ? c : b.length;
    d = -1;

    for (e = f & 7; e--; ++a) {
      d = d >>> 8 ^ S[(d ^ b[a]) & 255];
    }

    for (e = f >> 3; e--; a += 8) {
      d = d >>> 8 ^ S[(d ^ b[a]) & 255], d = d >>> 8 ^ S[(d ^ b[a + 1]) & 255], d = d >>> 8 ^ S[(d ^ b[a + 2]) & 255], d = d >>> 8 ^ S[(d ^ b[a + 3]) & 255], d = d >>> 8 ^ S[(d ^ b[a + 4]) & 255], d = d >>> 8 ^ S[(d ^ b[a + 5]) & 255], d = d >>> 8 ^ S[(d ^ b[a + 6]) & 255], d = d >>> 8 ^ S[(d ^ b[a + 7]) & 255];
    }

    return (d ^ 4294967295) >>> 0;
  }

  var ia = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918E3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117],
      S = B ? new Uint32Array(ia) : ia;

  function ja() {}

  ;

  function ka(b) {
    this.buffer = new (B ? Uint16Array : Array)(2 * b);
    this.length = 0;
  }

  ka.prototype.getParent = function (b) {
    return 2 * ((b - 2) / 4 | 0);
  };

  ka.prototype.push = function (b, a) {
    var c,
        d,
        e = this.buffer,
        f;
    c = this.length;
    e[this.length++] = a;

    for (e[this.length++] = b; 0 < c;) {
      if (d = this.getParent(c), e[c] > e[d]) f = e[c], e[c] = e[d], e[d] = f, f = e[c + 1], e[c + 1] = e[d + 1], e[d + 1] = f, c = d;else break;
    }

    return this.length;
  };

  ka.prototype.pop = function () {
    var b,
        a,
        c = this.buffer,
        d,
        e,
        f;
    a = c[0];
    b = c[1];
    this.length -= 2;
    c[0] = c[this.length];
    c[1] = c[this.length + 1];

    for (f = 0;;) {
      e = 2 * f + 2;
      if (e >= this.length) break;
      e + 2 < this.length && c[e + 2] > c[e] && (e += 2);
      if (c[e] > c[f]) d = c[f], c[f] = c[e], c[e] = d, d = c[f + 1], c[f + 1] = c[e + 1], c[e + 1] = d;else break;
      f = e;
    }

    return {
      index: b,
      value: a,
      length: this.length
    };
  };

  function T(b) {
    var a = b.length,
        c = 0,
        d = Number.POSITIVE_INFINITY,
        e,
        f,
        g,
        k,
        h,
        m,
        r,
        p,
        l,
        n;

    for (p = 0; p < a; ++p) {
      b[p] > c && (c = b[p]), b[p] < d && (d = b[p]);
    }

    e = 1 << c;
    f = new (B ? Uint32Array : Array)(e);
    g = 1;
    k = 0;

    for (h = 2; g <= c;) {
      for (p = 0; p < a; ++p) {
        if (b[p] === g) {
          m = 0;
          r = k;

          for (l = 0; l < g; ++l) {
            m = m << 1 | r & 1, r >>= 1;
          }

          n = g << 16 | p;

          for (l = m; l < e; l += h) {
            f[l] = n;
          }

          ++k;
        }
      }

      ++g;
      k <<= 1;
      h <<= 1;
    }

    return [f, c, d];
  }

  ;

  function na(b, a) {
    this.k = oa;
    this.F = 0;
    this.input = B && b instanceof Array ? new Uint8Array(b) : b;
    this.b = 0;
    a && (a.lazy && (this.F = a.lazy), "number" === typeof a.compressionType && (this.k = a.compressionType), a.outputBuffer && (this.a = B && a.outputBuffer instanceof Array ? new Uint8Array(a.outputBuffer) : a.outputBuffer), "number" === typeof a.outputIndex && (this.b = a.outputIndex));
    this.a || (this.a = new (B ? Uint8Array : Array)(32768));
  }

  var oa = 2,
      pa = {
    NONE: 0,
    L: 1,
    t: oa,
    X: 3
  },
      qa = [],
      U;

  for (U = 0; 288 > U; U++) {
    switch (v) {
      case 143 >= U:
        qa.push([U + 48, 8]);
        break;

      case 255 >= U:
        qa.push([U - 144 + 400, 9]);
        break;

      case 279 >= U:
        qa.push([U - 256 + 0, 7]);
        break;

      case 287 >= U:
        qa.push([U - 280 + 192, 8]);
        break;

      default:
        q("invalid literal: " + U);
    }
  }

  na.prototype.h = function () {
    var b,
        a,
        c,
        d,
        e = this.input;

    switch (this.k) {
      case 0:
        c = 0;

        for (d = e.length; c < d;) {
          a = B ? e.subarray(c, c + 65535) : e.slice(c, c + 65535);
          c += a.length;
          var f = a,
              g = c === d,
              k = t,
              h = t,
              m = t,
              r = t,
              p = t,
              l = this.a,
              n = this.b;

          if (B) {
            for (l = new Uint8Array(this.a.buffer); l.length <= n + f.length + 5;) {
              l = new Uint8Array(l.length << 1);
            }

            l.set(this.a);
          }

          k = g ? 1 : 0;
          l[n++] = k | 0;
          h = f.length;
          m = ~h + 65536 & 65535;
          l[n++] = h & 255;
          l[n++] = h >>> 8 & 255;
          l[n++] = m & 255;
          l[n++] = m >>> 8 & 255;
          if (B) l.set(f, n), n += f.length, l = l.subarray(0, n);else {
            r = 0;

            for (p = f.length; r < p; ++r) {
              l[n++] = f[r];
            }

            l.length = n;
          }
          this.b = n;
          this.a = l;
        }

        break;

      case 1:
        var s = new G(B ? new Uint8Array(this.a.buffer) : this.a, this.b);
        s.d(1, 1, v);
        s.d(1, 2, v);
        var u = ra(this, e),
            w,
            C,
            x;
        w = 0;

        for (C = u.length; w < C; w++) {
          if (x = u[w], G.prototype.d.apply(s, qa[x]), 256 < x) s.d(u[++w], u[++w], v), s.d(u[++w], 5), s.d(u[++w], u[++w], v);else if (256 === x) break;
        }

        this.a = s.finish();
        this.b = this.a.length;
        break;

      case oa:
        var D = new G(B ? new Uint8Array(this.a.buffer) : this.a, this.b),
            M,
            z,
            N,
            X,
            Y,
            qb = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
            da,
            Fa,
            ea,
            Ga,
            la,
            ta = Array(19),
            Ha,
            Z,
            ma,
            E,
            Ia;
        M = oa;
        D.d(1, 1, v);
        D.d(M, 2, v);
        z = ra(this, e);
        da = sa(this.U, 15);
        Fa = ua(da);
        ea = sa(this.T, 7);
        Ga = ua(ea);

        for (N = 286; 257 < N && 0 === da[N - 1]; N--) {
          ;
        }

        for (X = 30; 1 < X && 0 === ea[X - 1]; X--) {
          ;
        }

        var Ja = N,
            Ka = X,
            K = new (B ? Uint32Array : Array)(Ja + Ka),
            y,
            O,
            A,
            fa,
            J = new (B ? Uint32Array : Array)(316),
            H,
            F,
            P = new (B ? Uint8Array : Array)(19);

        for (y = O = 0; y < Ja; y++) {
          K[O++] = da[y];
        }

        for (y = 0; y < Ka; y++) {
          K[O++] = ea[y];
        }

        if (!B) {
          y = 0;

          for (fa = P.length; y < fa; ++y) {
            P[y] = 0;
          }
        }

        y = H = 0;

        for (fa = K.length; y < fa; y += O) {
          for (O = 1; y + O < fa && K[y + O] === K[y]; ++O) {
            ;
          }

          A = O;
          if (0 === K[y]) {
            if (3 > A) for (; 0 < A--;) {
              J[H++] = 0, P[0]++;
            } else for (; 0 < A;) {
              F = 138 > A ? A : 138, F > A - 3 && F < A && (F = A - 3), 10 >= F ? (J[H++] = 17, J[H++] = F - 3, P[17]++) : (J[H++] = 18, J[H++] = F - 11, P[18]++), A -= F;
            }
          } else if (J[H++] = K[y], P[K[y]]++, A--, 3 > A) for (; 0 < A--;) {
            J[H++] = K[y], P[K[y]]++;
          } else for (; 0 < A;) {
            F = 6 > A ? A : 6, F > A - 3 && F < A && (F = A - 3), J[H++] = 16, J[H++] = F - 3, P[16]++, A -= F;
          }
        }

        b = B ? J.subarray(0, H) : J.slice(0, H);
        la = sa(P, 7);

        for (E = 0; 19 > E; E++) {
          ta[E] = la[qb[E]];
        }

        for (Y = 19; 4 < Y && 0 === ta[Y - 1]; Y--) {
          ;
        }

        Ha = ua(la);
        D.d(N - 257, 5, v);
        D.d(X - 1, 5, v);
        D.d(Y - 4, 4, v);

        for (E = 0; E < Y; E++) {
          D.d(ta[E], 3, v);
        }

        E = 0;

        for (Ia = b.length; E < Ia; E++) {
          if (Z = b[E], D.d(Ha[Z], la[Z], v), 16 <= Z) {
            E++;

            switch (Z) {
              case 16:
                ma = 2;
                break;

              case 17:
                ma = 3;
                break;

              case 18:
                ma = 7;
                break;

              default:
                q("invalid code: " + Z);
            }

            D.d(b[E], ma, v);
          }
        }

        var La = [Fa, da],
            Ma = [Ga, ea],
            Q,
            Na,
            ga,
            wa,
            Oa,
            Pa,
            Qa,
            Ra;
        Oa = La[0];
        Pa = La[1];
        Qa = Ma[0];
        Ra = Ma[1];
        Q = 0;

        for (Na = z.length; Q < Na; ++Q) {
          if (ga = z[Q], D.d(Oa[ga], Pa[ga], v), 256 < ga) D.d(z[++Q], z[++Q], v), wa = z[++Q], D.d(Qa[wa], Ra[wa], v), D.d(z[++Q], z[++Q], v);else if (256 === ga) break;
        }

        this.a = D.finish();
        this.b = this.a.length;
        break;

      default:
        q("invalid compression type");
    }

    return this.a;
  };

  function va(b, a) {
    this.length = b;
    this.N = a;
  }

  var xa = function () {
    function b(a) {
      switch (v) {
        case 3 === a:
          return [257, a - 3, 0];

        case 4 === a:
          return [258, a - 4, 0];

        case 5 === a:
          return [259, a - 5, 0];

        case 6 === a:
          return [260, a - 6, 0];

        case 7 === a:
          return [261, a - 7, 0];

        case 8 === a:
          return [262, a - 8, 0];

        case 9 === a:
          return [263, a - 9, 0];

        case 10 === a:
          return [264, a - 10, 0];

        case 12 >= a:
          return [265, a - 11, 1];

        case 14 >= a:
          return [266, a - 13, 1];

        case 16 >= a:
          return [267, a - 15, 1];

        case 18 >= a:
          return [268, a - 17, 1];

        case 22 >= a:
          return [269, a - 19, 2];

        case 26 >= a:
          return [270, a - 23, 2];

        case 30 >= a:
          return [271, a - 27, 2];

        case 34 >= a:
          return [272, a - 31, 2];

        case 42 >= a:
          return [273, a - 35, 3];

        case 50 >= a:
          return [274, a - 43, 3];

        case 58 >= a:
          return [275, a - 51, 3];

        case 66 >= a:
          return [276, a - 59, 3];

        case 82 >= a:
          return [277, a - 67, 4];

        case 98 >= a:
          return [278, a - 83, 4];

        case 114 >= a:
          return [279, a - 99, 4];

        case 130 >= a:
          return [280, a - 115, 4];

        case 162 >= a:
          return [281, a - 131, 5];

        case 194 >= a:
          return [282, a - 163, 5];

        case 226 >= a:
          return [283, a - 195, 5];

        case 257 >= a:
          return [284, a - 227, 5];

        case 258 === a:
          return [285, a - 258, 0];

        default:
          q("invalid length: " + a);
      }
    }

    var a = [],
        c,
        d;

    for (c = 3; 258 >= c; c++) {
      d = b(c), a[c] = d[2] << 24 | d[1] << 16 | d[0];
    }

    return a;
  }(),
      ya = B ? new Uint32Array(xa) : xa;

  function ra(b, a) {
    function c(a, c) {
      var b = a.N,
          d = [],
          f = 0,
          e;
      e = ya[a.length];
      d[f++] = e & 65535;
      d[f++] = e >> 16 & 255;
      d[f++] = e >> 24;
      var g;

      switch (v) {
        case 1 === b:
          g = [0, b - 1, 0];
          break;

        case 2 === b:
          g = [1, b - 2, 0];
          break;

        case 3 === b:
          g = [2, b - 3, 0];
          break;

        case 4 === b:
          g = [3, b - 4, 0];
          break;

        case 6 >= b:
          g = [4, b - 5, 1];
          break;

        case 8 >= b:
          g = [5, b - 7, 1];
          break;

        case 12 >= b:
          g = [6, b - 9, 2];
          break;

        case 16 >= b:
          g = [7, b - 13, 2];
          break;

        case 24 >= b:
          g = [8, b - 17, 3];
          break;

        case 32 >= b:
          g = [9, b - 25, 3];
          break;

        case 48 >= b:
          g = [10, b - 33, 4];
          break;

        case 64 >= b:
          g = [11, b - 49, 4];
          break;

        case 96 >= b:
          g = [12, b - 65, 5];
          break;

        case 128 >= b:
          g = [13, b - 97, 5];
          break;

        case 192 >= b:
          g = [14, b - 129, 6];
          break;

        case 256 >= b:
          g = [15, b - 193, 6];
          break;

        case 384 >= b:
          g = [16, b - 257, 7];
          break;

        case 512 >= b:
          g = [17, b - 385, 7];
          break;

        case 768 >= b:
          g = [18, b - 513, 8];
          break;

        case 1024 >= b:
          g = [19, b - 769, 8];
          break;

        case 1536 >= b:
          g = [20, b - 1025, 9];
          break;

        case 2048 >= b:
          g = [21, b - 1537, 9];
          break;

        case 3072 >= b:
          g = [22, b - 2049, 10];
          break;

        case 4096 >= b:
          g = [23, b - 3073, 10];
          break;

        case 6144 >= b:
          g = [24, b - 4097, 11];
          break;

        case 8192 >= b:
          g = [25, b - 6145, 11];
          break;

        case 12288 >= b:
          g = [26, b - 8193, 12];
          break;

        case 16384 >= b:
          g = [27, b - 12289, 12];
          break;

        case 24576 >= b:
          g = [28, b - 16385, 13];
          break;

        case 32768 >= b:
          g = [29, b - 24577, 13];
          break;

        default:
          q("invalid distance");
      }

      e = g;
      d[f++] = e[0];
      d[f++] = e[1];
      d[f++] = e[2];
      var h, k;
      h = 0;

      for (k = d.length; h < k; ++h) {
        l[n++] = d[h];
      }

      u[d[0]]++;
      w[d[3]]++;
      s = a.length + c - 1;
      p = null;
    }

    var d,
        e,
        f,
        g,
        k,
        h = {},
        m,
        r,
        p,
        l = B ? new Uint16Array(2 * a.length) : [],
        n = 0,
        s = 0,
        u = new (B ? Uint32Array : Array)(286),
        w = new (B ? Uint32Array : Array)(30),
        C = b.F,
        x;

    if (!B) {
      for (f = 0; 285 >= f;) {
        u[f++] = 0;
      }

      for (f = 0; 29 >= f;) {
        w[f++] = 0;
      }
    }

    u[256] = 1;
    d = 0;

    for (e = a.length; d < e; ++d) {
      f = k = 0;

      for (g = 3; f < g && d + f !== e; ++f) {
        k = k << 8 | a[d + f];
      }

      h[k] === t && (h[k] = []);
      m = h[k];

      if (!(0 < s--)) {
        for (; 0 < m.length && 32768 < d - m[0];) {
          m.shift();
        }

        if (d + 3 >= e) {
          p && c(p, -1);
          f = 0;

          for (g = e - d; f < g; ++f) {
            x = a[d + f], l[n++] = x, ++u[x];
          }

          break;
        }

        0 < m.length ? (r = za(a, d, m), p ? p.length < r.length ? (x = a[d - 1], l[n++] = x, ++u[x], c(r, 0)) : c(p, -1) : r.length < C ? p = r : c(r, 0)) : p ? c(p, -1) : (x = a[d], l[n++] = x, ++u[x]);
      }

      m.push(d);
    }

    l[n++] = 256;
    u[256]++;
    b.U = u;
    b.T = w;
    return B ? l.subarray(0, n) : l;
  }

  function za(b, a, c) {
    var d,
        e,
        f = 0,
        g,
        k,
        h,
        m,
        r = b.length;
    k = 0;
    m = c.length;

    a: for (; k < m; k++) {
      d = c[m - k - 1];
      g = 3;

      if (3 < f) {
        for (h = f; 3 < h; h--) {
          if (b[d + h - 1] !== b[a + h - 1]) continue a;
        }

        g = f;
      }

      for (; 258 > g && a + g < r && b[d + g] === b[a + g];) {
        ++g;
      }

      g > f && (e = d, f = g);
      if (258 === g) break;
    }

    return new va(f, a - e);
  }

  function sa(b, a) {
    var c = b.length,
        d = new ka(572),
        e = new (B ? Uint8Array : Array)(c),
        f,
        g,
        k,
        h,
        m;
    if (!B) for (h = 0; h < c; h++) {
      e[h] = 0;
    }

    for (h = 0; h < c; ++h) {
      0 < b[h] && d.push(h, b[h]);
    }

    f = Array(d.length / 2);
    g = new (B ? Uint32Array : Array)(d.length / 2);
    if (1 === f.length) return e[d.pop().index] = 1, e;
    h = 0;

    for (m = d.length / 2; h < m; ++h) {
      f[h] = d.pop(), g[h] = f[h].value;
    }

    k = Aa(g, g.length, a);
    h = 0;

    for (m = f.length; h < m; ++h) {
      e[f[h].index] = k[h];
    }

    return e;
  }

  function Aa(b, a, c) {
    function d(b) {
      var c = h[b][m[b]];
      c === a ? (d(b + 1), d(b + 1)) : --g[c];
      ++m[b];
    }

    var e = new (B ? Uint16Array : Array)(c),
        f = new (B ? Uint8Array : Array)(c),
        g = new (B ? Uint8Array : Array)(a),
        k = Array(c),
        h = Array(c),
        m = Array(c),
        r = (1 << c) - a,
        p = 1 << c - 1,
        l,
        n,
        s,
        u,
        w;
    e[c - 1] = a;

    for (n = 0; n < c; ++n) {
      r < p ? f[n] = 0 : (f[n] = 1, r -= p), r <<= 1, e[c - 2 - n] = (e[c - 1 - n] / 2 | 0) + a;
    }

    e[0] = f[0];
    k[0] = Array(e[0]);
    h[0] = Array(e[0]);

    for (n = 1; n < c; ++n) {
      e[n] > 2 * e[n - 1] + f[n] && (e[n] = 2 * e[n - 1] + f[n]), k[n] = Array(e[n]), h[n] = Array(e[n]);
    }

    for (l = 0; l < a; ++l) {
      g[l] = c;
    }

    for (s = 0; s < e[c - 1]; ++s) {
      k[c - 1][s] = b[s], h[c - 1][s] = s;
    }

    for (l = 0; l < c; ++l) {
      m[l] = 0;
    }

    1 === f[c - 1] && (--g[0], ++m[c - 1]);

    for (n = c - 2; 0 <= n; --n) {
      u = l = 0;
      w = m[n + 1];

      for (s = 0; s < e[n]; s++) {
        u = k[n + 1][w] + k[n + 1][w + 1], u > b[l] ? (k[n][s] = u, h[n][s] = a, w += 2) : (k[n][s] = b[l], h[n][s] = l, ++l);
      }

      m[n] = 0;
      1 === f[n] && d(n);
    }

    return g;
  }

  function ua(b) {
    var a = new (B ? Uint16Array : Array)(b.length),
        c = [],
        d = [],
        e = 0,
        f,
        g,
        k,
        h;
    f = 0;

    for (g = b.length; f < g; f++) {
      c[b[f]] = (c[b[f]] | 0) + 1;
    }

    f = 1;

    for (g = 16; f <= g; f++) {
      d[f] = e, e += c[f] | 0, e <<= 1;
    }

    f = 0;

    for (g = b.length; f < g; f++) {
      e = d[b[f]];
      d[b[f]] += 1;
      k = a[f] = 0;

      for (h = b[f]; k < h; k++) {
        a[f] = a[f] << 1 | e & 1, e >>>= 1;
      }
    }

    return a;
  }

  ;

  function Ba(b, a) {
    this.input = b;
    this.b = this.c = 0;
    this.g = {};
    a && (a.flags && (this.g = a.flags), "string" === typeof a.filename && (this.filename = a.filename), "string" === typeof a.comment && (this.w = a.comment), a.deflateOptions && (this.l = a.deflateOptions));
    this.l || (this.l = {});
  }

  Ba.prototype.h = function () {
    var b,
        a,
        c,
        d,
        e,
        f,
        g,
        k,
        h = new (B ? Uint8Array : Array)(32768),
        m = 0,
        r = this.input,
        p = this.c,
        l = this.filename,
        n = this.w;
    h[m++] = 31;
    h[m++] = 139;
    h[m++] = 8;
    b = 0;
    this.g.fname && (b |= Ca);
    this.g.fcomment && (b |= Da);
    this.g.fhcrc && (b |= Ea);
    h[m++] = b;
    a = (Date.now ? Date.now() : +new Date()) / 1E3 | 0;
    h[m++] = a & 255;
    h[m++] = a >>> 8 & 255;
    h[m++] = a >>> 16 & 255;
    h[m++] = a >>> 24 & 255;
    h[m++] = 0;
    h[m++] = Sa;

    if (this.g.fname !== t) {
      g = 0;

      for (k = l.length; g < k; ++g) {
        f = l.charCodeAt(g), 255 < f && (h[m++] = f >>> 8 & 255), h[m++] = f & 255;
      }

      h[m++] = 0;
    }

    if (this.g.comment) {
      g = 0;

      for (k = n.length; g < k; ++g) {
        f = n.charCodeAt(g), 255 < f && (h[m++] = f >>> 8 & 255), h[m++] = f & 255;
      }

      h[m++] = 0;
    }

    this.g.fhcrc && (c = ha(h, 0, m) & 65535, h[m++] = c & 255, h[m++] = c >>> 8 & 255);
    this.l.outputBuffer = h;
    this.l.outputIndex = m;
    e = new na(r, this.l);
    h = e.h();
    m = e.b;
    B && (m + 8 > h.buffer.byteLength ? (this.a = new Uint8Array(m + 8), this.a.set(new Uint8Array(h.buffer)), h = this.a) : h = new Uint8Array(h.buffer));
    d = ha(r, t, t);
    h[m++] = d & 255;
    h[m++] = d >>> 8 & 255;
    h[m++] = d >>> 16 & 255;
    h[m++] = d >>> 24 & 255;
    k = r.length;
    h[m++] = k & 255;
    h[m++] = k >>> 8 & 255;
    h[m++] = k >>> 16 & 255;
    h[m++] = k >>> 24 & 255;
    this.c = p;
    B && m < h.length && (this.a = h = h.subarray(0, m));
    return h;
  };

  var Sa = 255,
      Ea = 2,
      Ca = 8,
      Da = 16;

  function V(b, a) {
    this.o = [];
    this.p = 32768;
    this.e = this.j = this.c = this.s = 0;
    this.input = B ? new Uint8Array(b) : b;
    this.u = !1;
    this.q = Ta;
    this.K = !1;
    if (a || !(a = {})) a.index && (this.c = a.index), a.bufferSize && (this.p = a.bufferSize), a.bufferType && (this.q = a.bufferType), a.resize && (this.K = a.resize);

    switch (this.q) {
      case Ua:
        this.b = 32768;
        this.a = new (B ? Uint8Array : Array)(32768 + this.p + 258);
        break;

      case Ta:
        this.b = 0;
        this.a = new (B ? Uint8Array : Array)(this.p);
        this.f = this.S;
        this.z = this.O;
        this.r = this.Q;
        break;

      default:
        q(Error("invalid inflate mode"));
    }
  }

  var Ua = 0,
      Ta = 1;

  V.prototype.i = function () {
    for (; !this.u;) {
      var b = W(this, 3);
      b & 1 && (this.u = v);
      b >>>= 1;

      switch (b) {
        case 0:
          var a = this.input,
              c = this.c,
              d = this.a,
              e = this.b,
              f = a.length,
              g = t,
              k = t,
              h = d.length,
              m = t;
          this.e = this.j = 0;
          c + 1 >= f && q(Error("invalid uncompressed block header: LEN"));
          g = a[c++] | a[c++] << 8;
          c + 1 >= f && q(Error("invalid uncompressed block header: NLEN"));
          k = a[c++] | a[c++] << 8;
          g === ~k && q(Error("invalid uncompressed block header: length verify"));
          c + g > a.length && q(Error("input buffer is broken"));

          switch (this.q) {
            case Ua:
              for (; e + g > d.length;) {
                m = h - e;
                g -= m;
                if (B) d.set(a.subarray(c, c + m), e), e += m, c += m;else for (; m--;) {
                  d[e++] = a[c++];
                }
                this.b = e;
                d = this.f();
                e = this.b;
              }

              break;

            case Ta:
              for (; e + g > d.length;) {
                d = this.f({
                  B: 2
                });
              }

              break;

            default:
              q(Error("invalid inflate mode"));
          }

          if (B) d.set(a.subarray(c, c + g), e), e += g, c += g;else for (; g--;) {
            d[e++] = a[c++];
          }
          this.c = c;
          this.b = e;
          this.a = d;
          break;

        case 1:
          this.r(Va, Wa);
          break;

        case 2:
          for (var r = W(this, 5) + 257, p = W(this, 5) + 1, l = W(this, 4) + 4, n = new (B ? Uint8Array : Array)(Xa.length), s = t, u = t, w = t, C = t, x = t, D = t, M = t, z = t, N = t, z = 0; z < l; ++z) {
            n[Xa[z]] = W(this, 3);
          }

          if (!B) {
            z = l;

            for (l = n.length; z < l; ++z) {
              n[Xa[z]] = 0;
            }
          }

          s = T(n);
          C = new (B ? Uint8Array : Array)(r + p);
          z = 0;

          for (N = r + p; z < N;) {
            switch (x = Ya(this, s), x) {
              case 16:
                for (M = 3 + W(this, 2); M--;) {
                  C[z++] = D;
                }

                break;

              case 17:
                for (M = 3 + W(this, 3); M--;) {
                  C[z++] = 0;
                }

                D = 0;
                break;

              case 18:
                for (M = 11 + W(this, 7); M--;) {
                  C[z++] = 0;
                }

                D = 0;
                break;

              default:
                D = C[z++] = x;
            }
          }

          u = B ? T(C.subarray(0, r)) : T(C.slice(0, r));
          w = B ? T(C.subarray(r)) : T(C.slice(r));
          this.r(u, w);
          break;

        default:
          q(Error("unknown BTYPE: " + b));
      }
    }

    return this.z();
  };

  var Za = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
      Xa = B ? new Uint16Array(Za) : Za,
      $a = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 258, 258],
      ab = B ? new Uint16Array($a) : $a,
      bb = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0],
      cb = B ? new Uint8Array(bb) : bb,
      db = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577],
      eb = B ? new Uint16Array(db) : db,
      fb = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
      gb = B ? new Uint8Array(fb) : fb,
      hb = new (B ? Uint8Array : Array)(288),
      $,
      ib;
  $ = 0;

  for (ib = hb.length; $ < ib; ++$) {
    hb[$] = 143 >= $ ? 8 : 255 >= $ ? 9 : 279 >= $ ? 7 : 8;
  }

  var Va = T(hb),
      jb = new (B ? Uint8Array : Array)(30),
      kb,
      lb;
  kb = 0;

  for (lb = jb.length; kb < lb; ++kb) {
    jb[kb] = 5;
  }

  var Wa = T(jb);

  function W(b, a) {
    for (var c = b.j, d = b.e, e = b.input, f = b.c, g = e.length, k; d < a;) {
      f >= g && q(Error("input buffer is broken")), c |= e[f++] << d, d += 8;
    }

    k = c & (1 << a) - 1;
    b.j = c >>> a;
    b.e = d - a;
    b.c = f;
    return k;
  }

  function Ya(b, a) {
    for (var c = b.j, d = b.e, e = b.input, f = b.c, g = e.length, k = a[0], h = a[1], m, r; d < h && !(f >= g);) {
      c |= e[f++] << d, d += 8;
    }

    m = k[c & (1 << h) - 1];
    r = m >>> 16;
    r > d && q(Error("invalid code length: " + r));
    b.j = c >> r;
    b.e = d - r;
    b.c = f;
    return m & 65535;
  }

  V.prototype.r = function (b, a) {
    var c = this.a,
        d = this.b;
    this.A = b;

    for (var e = c.length - 258, f, g, k, h; 256 !== (f = Ya(this, b));) {
      if (256 > f) d >= e && (this.b = d, c = this.f(), d = this.b), c[d++] = f;else {
        g = f - 257;
        h = ab[g];
        0 < cb[g] && (h += W(this, cb[g]));
        f = Ya(this, a);
        k = eb[f];
        0 < gb[f] && (k += W(this, gb[f]));
        d >= e && (this.b = d, c = this.f(), d = this.b);

        for (; h--;) {
          c[d] = c[d++ - k];
        }
      }
    }

    for (; 8 <= this.e;) {
      this.e -= 8, this.c--;
    }

    this.b = d;
  };

  V.prototype.Q = function (b, a) {
    var c = this.a,
        d = this.b;
    this.A = b;

    for (var e = c.length, f, g, k, h; 256 !== (f = Ya(this, b));) {
      if (256 > f) d >= e && (c = this.f(), e = c.length), c[d++] = f;else {
        g = f - 257;
        h = ab[g];
        0 < cb[g] && (h += W(this, cb[g]));
        f = Ya(this, a);
        k = eb[f];
        0 < gb[f] && (k += W(this, gb[f]));
        d + h > e && (c = this.f(), e = c.length);

        for (; h--;) {
          c[d] = c[d++ - k];
        }
      }
    }

    for (; 8 <= this.e;) {
      this.e -= 8, this.c--;
    }

    this.b = d;
  };

  V.prototype.f = function () {
    var b = new (B ? Uint8Array : Array)(this.b - 32768),
        a = this.b - 32768,
        c,
        d,
        e = this.a;
    if (B) b.set(e.subarray(32768, b.length));else {
      c = 0;

      for (d = b.length; c < d; ++c) {
        b[c] = e[c + 32768];
      }
    }
    this.o.push(b);
    this.s += b.length;
    if (B) e.set(e.subarray(a, a + 32768));else for (c = 0; 32768 > c; ++c) {
      e[c] = e[a + c];
    }
    this.b = 32768;
    return e;
  };

  V.prototype.S = function (b) {
    var a,
        c = this.input.length / this.c + 1 | 0,
        d,
        e,
        f,
        g = this.input,
        k = this.a;
    b && ("number" === typeof b.B && (c = b.B), "number" === typeof b.M && (c += b.M));
    2 > c ? (d = (g.length - this.c) / this.A[2], f = 258 * (d / 2) | 0, e = f < k.length ? k.length + f : k.length << 1) : e = k.length * c;
    B ? (a = new Uint8Array(e), a.set(k)) : a = k;
    return this.a = a;
  };

  V.prototype.z = function () {
    var b = 0,
        a = this.a,
        c = this.o,
        d,
        e = new (B ? Uint8Array : Array)(this.s + (this.b - 32768)),
        f,
        g,
        k,
        h;
    if (0 === c.length) return B ? this.a.subarray(32768, this.b) : this.a.slice(32768, this.b);
    f = 0;

    for (g = c.length; f < g; ++f) {
      d = c[f];
      k = 0;

      for (h = d.length; k < h; ++k) {
        e[b++] = d[k];
      }
    }

    f = 32768;

    for (g = this.b; f < g; ++f) {
      e[b++] = a[f];
    }

    this.o = [];
    return this.buffer = e;
  };

  V.prototype.O = function () {
    var b,
        a = this.b;
    B ? this.K ? (b = new Uint8Array(a), b.set(this.a.subarray(0, a))) : b = this.a.subarray(0, a) : (this.a.length > a && (this.a.length = a), b = this.a);
    return this.buffer = b;
  };

  function mb(b) {
    this.input = b;
    this.c = 0;
    this.G = [];
    this.R = !1;
  }

  mb.prototype.i = function () {
    for (var b = this.input.length; this.c < b;) {
      var a = new ja(),
          c = t,
          d = t,
          e = t,
          f = t,
          g = t,
          k = t,
          h = t,
          m = t,
          r = t,
          p = this.input,
          l = this.c;
      a.C = p[l++];
      a.D = p[l++];
      (31 !== a.C || 139 !== a.D) && q(Error("invalid file signature:" + a.C + "," + a.D));
      a.v = p[l++];

      switch (a.v) {
        case 8:
          break;

        default:
          q(Error("unknown compression method: " + a.v));
      }

      a.n = p[l++];
      m = p[l++] | p[l++] << 8 | p[l++] << 16 | p[l++] << 24;
      a.$ = new Date(1E3 * m);
      a.ba = p[l++];
      a.aa = p[l++];
      0 < (a.n & 4) && (a.W = p[l++] | p[l++] << 8, l += a.W);

      if (0 < (a.n & Ca)) {
        h = [];

        for (k = 0; 0 < (g = p[l++]);) {
          h[k++] = String.fromCharCode(g);
        }

        a.name = h.join("");
      }

      if (0 < (a.n & Da)) {
        h = [];

        for (k = 0; 0 < (g = p[l++]);) {
          h[k++] = String.fromCharCode(g);
        }

        a.w = h.join("");
      }

      0 < (a.n & Ea) && (a.P = ha(p, 0, l) & 65535, a.P !== (p[l++] | p[l++] << 8) && q(Error("invalid header crc16")));
      c = p[p.length - 4] | p[p.length - 3] << 8 | p[p.length - 2] << 16 | p[p.length - 1] << 24;
      p.length - l - 4 - 4 < 512 * c && (f = c);
      d = new V(p, {
        index: l,
        bufferSize: f
      });
      a.data = e = d.i();
      l = d.c;
      a.Y = r = (p[l++] | p[l++] << 8 | p[l++] << 16 | p[l++] << 24) >>> 0;
      ha(e, t, t) !== r && q(Error("invalid CRC-32 checksum: 0x" + ha(e, t, t).toString(16) + " / 0x" + r.toString(16)));
      a.Z = c = (p[l++] | p[l++] << 8 | p[l++] << 16 | p[l++] << 24) >>> 0;
      (e.length & 4294967295) !== c && q(Error("invalid input size: " + (e.length & 4294967295) + " / " + c));
      this.G.push(a);
      this.c = l;
    }

    this.R = v;
    var n = this.G,
        s,
        u,
        w = 0,
        C = 0,
        x;
    s = 0;

    for (u = n.length; s < u; ++s) {
      C += n[s].data.length;
    }

    if (B) {
      x = new Uint8Array(C);

      for (s = 0; s < u; ++s) {
        x.set(n[s].data, w), w += n[s].data.length;
      }
    } else {
      x = [];

      for (s = 0; s < u; ++s) {
        x[s] = n[s].data;
      }

      x = Array.prototype.concat.apply([], x);
    }

    return x;
  };

  function nb(b) {
    if ("string" === typeof b) {
      var a = b.split(""),
          c,
          d;
      c = 0;

      for (d = a.length; c < d; c++) {
        a[c] = (a[c].charCodeAt(0) & 255) >>> 0;
      }

      b = a;
    }

    for (var e = 1, f = 0, g = b.length, k, h = 0; 0 < g;) {
      k = 1024 < g ? 1024 : g;
      g -= k;

      do {
        e += b[h++], f += e;
      } while (--k);

      e %= 65521;
      f %= 65521;
    }

    return (f << 16 | e) >>> 0;
  }

  ;

  function ob(b, a) {
    var c, d;
    this.input = b;
    this.c = 0;
    if (a || !(a = {})) a.index && (this.c = a.index), a.verify && (this.V = a.verify);
    c = b[this.c++];
    d = b[this.c++];

    switch (c & 15) {
      case pb:
        this.method = pb;
        break;

      default:
        q(Error("unsupported compression method"));
    }

    0 !== ((c << 8) + d) % 31 && q(Error("invalid fcheck flag:" + ((c << 8) + d) % 31));
    d & 32 && q(Error("fdict flag is not supported"));
    this.J = new V(b, {
      index: this.c,
      bufferSize: a.bufferSize,
      bufferType: a.bufferType,
      resize: a.resize
    });
  }

  ob.prototype.i = function () {
    var b = this.input,
        a,
        c;
    a = this.J.i();
    this.c = this.J.c;
    this.V && (c = (b[this.c++] << 24 | b[this.c++] << 16 | b[this.c++] << 8 | b[this.c++]) >>> 0, c !== nb(a) && q(Error("invalid adler-32 checksum")));
    return a;
  };

  var pb = 8;

  function rb(b, a) {
    this.input = b;
    this.a = new (B ? Uint8Array : Array)(32768);
    this.k = sb.t;
    var c = {},
        d;
    if ((a || !(a = {})) && "number" === typeof a.compressionType) this.k = a.compressionType;

    for (d in a) {
      c[d] = a[d];
    }

    c.outputBuffer = this.a;
    this.I = new na(this.input, c);
  }

  var sb = pa;

  rb.prototype.h = function () {
    var b,
        a,
        c,
        d,
        e,
        f,
        g,
        k = 0;
    g = this.a;
    b = pb;

    switch (b) {
      case pb:
        a = Math.LOG2E * Math.log(32768) - 8;
        break;

      default:
        q(Error("invalid compression method"));
    }

    c = a << 4 | b;
    g[k++] = c;

    switch (b) {
      case pb:
        switch (this.k) {
          case sb.NONE:
            e = 0;
            break;

          case sb.L:
            e = 1;
            break;

          case sb.t:
            e = 2;
            break;

          default:
            q(Error("unsupported compression type"));
        }

        break;

      default:
        q(Error("invalid compression method"));
    }

    d = e << 6 | 0;
    g[k++] = d | 31 - (256 * c + d) % 31;
    f = nb(this.input);
    this.I.b = k;
    g = this.I.h();
    k = g.length;
    B && (g = new Uint8Array(g.buffer), g.length <= k + 4 && (this.a = new Uint8Array(g.length + 4), this.a.set(g), g = this.a), g = g.subarray(0, k + 4));
    g[k++] = f >> 24 & 255;
    g[k++] = f >> 16 & 255;
    g[k++] = f >> 8 & 255;
    g[k++] = f & 255;
    return g;
  };

  exports.deflate = tb;
  exports.deflateSync = ub;
  exports.inflate = vb;
  exports.inflateSync = wb;
  exports.gzip = xb;
  exports.gzipSync = yb;
  exports.gunzip = zb;
  exports.gunzipSync = Ab;

  function tb(b, a, c) {
    process.nextTick(function () {
      var d, e;

      try {
        e = ub(b, c);
      } catch (f) {
        d = f;
      }

      a(d, e);
    });
  }

  function ub(b, a) {
    var c;
    c = new rb(b).h();
    a || (a = {});
    return a.H ? c : Bb(c);
  }

  function vb(b, a, c) {
    process.nextTick(function () {
      var d, e;

      try {
        e = wb(b, c);
      } catch (f) {
        d = f;
      }

      a(d, e);
    });
  }

  function wb(b, a) {
    var c;
    b.subarray = b.slice;
    c = new ob(b).i();
    a || (a = {});
    return a.noBuffer ? c : Bb(c);
  }

  function xb(b, a, c) {
    process.nextTick(function () {
      var d, e;

      try {
        e = yb(b, c);
      } catch (f) {
        d = f;
      }

      a(d, e);
    });
  }

  function yb(b, a) {
    var c;
    b.subarray = b.slice;
    c = new Ba(b).h();
    a || (a = {});
    return a.H ? c : Bb(c);
  }

  function zb(b, a, c) {
    process.nextTick(function () {
      var d, e;

      try {
        e = Ab(b, c);
      } catch (f) {
        d = f;
      }

      a(d, e);
    });
  }

  function Ab(b, a) {
    var c;
    b.subarray = b.slice;
    c = new mb(b).i();
    a || (a = {});
    return a.H ? c : Bb(c);
  }

  function Bb(b) {
    var a = new Buffer(b.length),
        c,
        d;
    c = 0;

    for (d = b.length; c < d; ++c) {
      a[c] = b[c];
    }

    return a;
  }

  ;
}).call(this);

/***/ }),

/***/ "./src/constants/PSM.js":
/*!******************************!*\
  !*** ./src/constants/PSM.js ***!
  \******************************/
/***/ ((module) => {

/*
 * PSM = Page Segmentation Mode
 */
module.exports = {
  OSD_ONLY: '0',
  AUTO_OSD: '1',
  AUTO_ONLY: '2',
  AUTO: '3',
  SINGLE_COLUMN: '4',
  SINGLE_BLOCK_VERT_TEXT: '5',
  SINGLE_BLOCK: '6',
  SINGLE_LINE: '7',
  SINGLE_WORD: '8',
  CIRCLE_WORD: '9',
  SINGLE_CHAR: '10',
  SPARSE_TEXT: '11',
  SPARSE_TEXT_OSD: '12'
};

/***/ }),

/***/ "./src/utils/getEnvironment.js":
/*!*************************************!*\
  !*** ./src/utils/getEnvironment.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var isElectron = __webpack_require__(/*! is-electron */ "./node_modules/is-electron/index.js");

module.exports = function (key) {
  var env = {};

  if (typeof WorkerGlobalScope !== 'undefined') {
    env.type = 'webworker';
  } else if (isElectron()) {
    env.type = 'electron';
  } else if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object') {
    env.type = 'browser';
  } else if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === 'object' && "function" === 'function') {
    env.type = 'node';
  }

  if (typeof key === 'undefined') {
    return env;
  }

  return env[key];
};

/***/ }),

/***/ "./src/utils/log.js":
/*!**************************!*\
  !*** ./src/utils/log.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports) {

var _this = this;

var logging = false;
exports.logging = logging;

exports.setLogging = function (_logging) {
  logging = _logging;
};

exports.log = function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return logging ? console.log.apply(_this, args) : null;
};

/***/ }),

/***/ "./src/worker-script/browser/cache.js":
/*!********************************************!*\
  !*** ./src/worker-script/browser/cache.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _require = __webpack_require__(/*! idb-keyval */ "./node_modules/idb-keyval/dist/idb-keyval.mjs"),
    set = _require.set,
    get = _require.get,
    del = _require.del;

module.exports = {
  readCache: get,
  writeCache: set,
  deleteCache: del,
  checkCache: function checkCache(path) {
    return get(path).then(function (v) {
      return typeof v !== 'undefined';
    });
  }
};

/***/ }),

/***/ "./src/worker-script/browser/getCore.js":
/*!**********************************************!*\
  !*** ./src/worker-script/browser/getCore.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = __webpack_require__(/*! wasm-feature-detect */ "./node_modules/wasm-feature-detect/dist/esm/index.js"),
    simd = _require.simd;

var _require2 = __webpack_require__(/*! ../../../package.json */ "./package.json"),
    dependencies = _require2.dependencies;

module.exports = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(corePath, res) {
    var corePathImport, simdSupport;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(typeof __webpack_require__.g.TesseractCore === 'undefined')) {
              _context.next = 15;
              break;
            }

            res.progress({
              status: 'loading tesseract core',
              progress: 0
            }); // If the user specifies a core path, we use that
            // Otherwise, we detect the correct core based on SIMD support

            corePathImport = corePath;

            if (corePathImport) {
              _context.next = 8;
              break;
            }

            _context.next = 6;
            return simd();

          case 6:
            simdSupport = _context.sent;

            if (simdSupport) {
              corePathImport = "https://unpkg.com/tesseract.js-core@v".concat(dependencies['tesseract.js-core'].substring(1), "/tesseract-core-simd.wasm.js");
            } else {
              corePathImport = "https://unpkg.com/tesseract.js-core@v".concat(dependencies['tesseract.js-core'].substring(1), "/tesseract-core.wasm.js");
            }

          case 8:
            __webpack_require__.g.importScripts(corePathImport);

            if (!(typeof __webpack_require__.g.TesseractCoreWASM !== 'undefined' && (typeof WebAssembly === "undefined" ? "undefined" : _typeof(WebAssembly)) === 'object')) {
              _context.next = 13;
              break;
            }

            __webpack_require__.g.TesseractCore = __webpack_require__.g.TesseractCoreWASM;
            _context.next = 14;
            break;

          case 13:
            throw Error('Failed to load TesseractCore');

          case 14:
            res.progress({
              status: 'loading tesseract core',
              progress: 1
            });

          case 15:
            return _context.abrupt("return", __webpack_require__.g.TesseractCore);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/***/ }),

/***/ "./src/worker-script/browser/gunzip.js":
/*!*********************************************!*\
  !*** ./src/worker-script/browser/gunzip.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! zlibjs */ "./node_modules/zlibjs/bin/node-zlib.js").gunzipSync;

/***/ }),

/***/ "./src/worker-script/constants/defaultParams.js":
/*!******************************************************!*\
  !*** ./src/worker-script/constants/defaultParams.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * default params for tesseract.js
 */
var PSM = __webpack_require__(/*! ../../constants/PSM */ "./src/constants/PSM.js");

module.exports = {
  tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
  tessedit_char_whitelist: '',
  tessjs_create_hocr: '1',
  tessjs_create_tsv: '1',
  tessjs_create_box: '0',
  tessjs_create_unlv: '0',
  tessjs_create_osd: '0'
};

/***/ }),

/***/ "./src/worker-script/index.js":
/*!************************************!*\
  !*** ./src/worker-script/index.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var _this = this;

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 *
 * Worker script for browser and node
 *
 * @fileoverview Worker script for browser and node
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
__webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");

var fileType = __webpack_require__(/*! file-type */ "./node_modules/file-type/index.js");

var isURL = __webpack_require__(/*! is-url */ "./node_modules/is-url/index.js");

var dump = __webpack_require__(/*! ./utils/dump */ "./src/worker-script/utils/dump.js");

var isWebWorker = __webpack_require__(/*! ../utils/getEnvironment */ "./src/utils/getEnvironment.js")('type') === 'webworker';

var setImage = __webpack_require__(/*! ./utils/setImage */ "./src/worker-script/utils/setImage.js");

var defaultParams = __webpack_require__(/*! ./constants/defaultParams */ "./src/worker-script/constants/defaultParams.js");

var _require = __webpack_require__(/*! ../utils/log */ "./src/utils/log.js"),
    log = _require.log,
    setLogging = _require.setLogging;
/*
 * Tesseract Module returned by TesseractCore.
 */


var TessModule;
/*
 * TessearctBaseAPI instance
 */

var api = null;
var latestJob;
var adapter = {};
var params = defaultParams;

var load = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(_ref, res) {
    var workerId, jobId, _ref$payload$options, corePath, logging, Core;

    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            workerId = _ref.workerId, jobId = _ref.jobId, _ref$payload$options = _ref.payload.options, corePath = _ref$payload$options.corePath, logging = _ref$payload$options.logging;
            setLogging(logging);

            if (TessModule) {
              _context.next = 10;
              break;
            }

            _context.next = 5;
            return adapter.getCore(corePath, res);

          case 5:
            Core = _context.sent;
            res.progress({
              workerId: workerId,
              status: 'initializing tesseract',
              progress: 0
            });
            Core({
              TesseractProgress: function TesseractProgress(percent) {
                latestJob.progress({
                  workerId: workerId,
                  jobId: jobId,
                  status: 'recognizing text',
                  progress: Math.max(0, (percent - 30) / 70)
                });
              }
            }).then(function (tessModule) {
              TessModule = tessModule;
              res.progress({
                workerId: workerId,
                status: 'initialized tesseract',
                progress: 1
              });
              res.resolve({
                loaded: true
              });
            });
            _context.next = 11;
            break;

          case 10:
            res.resolve({
              loaded: true
            });

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function load(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

var FS = function FS(_ref3, res) {
  var _TessModule$FS;

  var workerId = _ref3.workerId,
      _ref3$payload = _ref3.payload,
      method = _ref3$payload.method,
      args = _ref3$payload.args;
  log("[".concat(workerId, "]: FS.").concat(method, " with args ").concat(args));
  res.resolve((_TessModule$FS = TessModule.FS)[method].apply(_TessModule$FS, _toConsumableArray(args)));
};

var loadLanguage = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(_ref4, res) {
    var workerId, _ref4$payload, langs, _ref4$payload$options, langPath, dataPath, cachePath, cacheMethod, _ref4$payload$options2, gzip, loadAndGunzipFile;

    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            workerId = _ref4.workerId, _ref4$payload = _ref4.payload, langs = _ref4$payload.langs, _ref4$payload$options = _ref4$payload.options, langPath = _ref4$payload$options.langPath, dataPath = _ref4$payload$options.dataPath, cachePath = _ref4$payload$options.cachePath, cacheMethod = _ref4$payload$options.cacheMethod, _ref4$payload$options2 = _ref4$payload$options.gzip, gzip = _ref4$payload$options2 === void 0 ? true : _ref4$payload$options2;

            loadAndGunzipFile = /*#__PURE__*/function () {
              var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(_lang) {
                var lang, readCache, data, _data, path, fetchUrl, resp, type;

                return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        lang = typeof _lang === 'string' ? _lang : _lang.code;
                        readCache = ['refresh', 'none'].includes(cacheMethod) ? function () {
                          return Promise.resolve();
                        } : adapter.readCache;
                        data = null;
                        _context2.prev = 3;
                        _context2.next = 6;
                        return readCache("".concat(cachePath || '.', "/").concat(lang, ".traineddata"));

                      case 6:
                        _data = _context2.sent;

                        if (!(typeof _data !== 'undefined')) {
                          _context2.next = 13;
                          break;
                        }

                        log("[".concat(workerId, "]: Load ").concat(lang, ".traineddata from cache"));
                        res.progress({
                          workerId: workerId,
                          status: 'loading language traineddata (from cache)',
                          progress: 0.5
                        });
                        data = _data;
                        _context2.next = 14;
                        break;

                      case 13:
                        throw Error('Not found in cache');

                      case 14:
                        _context2.next = 40;
                        break;

                      case 16:
                        _context2.prev = 16;
                        _context2.t0 = _context2["catch"](3);
                        log("[".concat(workerId, "]: Load ").concat(lang, ".traineddata from ").concat(langPath));

                        if (!(typeof _lang === 'string')) {
                          _context2.next = 39;
                          break;
                        }

                        path = null;

                        if (isURL(langPath) || langPath.startsWith('moz-extension://') || langPath.startsWith('chrome-extension://') || langPath.startsWith('file://')) {
                          /** When langPath is an URL */
                          path = langPath;
                        }

                        if (!(path !== null)) {
                          _context2.next = 34;
                          break;
                        }

                        fetchUrl = "".concat(path, "/").concat(lang, ".traineddata").concat(gzip ? '.gz' : '');
                        _context2.next = 26;
                        return (isWebWorker ? fetch : adapter.fetch)(fetchUrl);

                      case 26:
                        resp = _context2.sent;

                        if (resp.ok) {
                          _context2.next = 29;
                          break;
                        }

                        throw Error("Network error while fetching ".concat(fetchUrl, ". Response code: ").concat(resp.status));

                      case 29:
                        _context2.next = 31;
                        return resp.arrayBuffer();

                      case 31:
                        data = _context2.sent;
                        _context2.next = 37;
                        break;

                      case 34:
                        _context2.next = 36;
                        return adapter.readCache("".concat(langPath, "/").concat(lang, ".traineddata").concat(gzip ? '.gz' : ''));

                      case 36:
                        data = _context2.sent;

                      case 37:
                        _context2.next = 40;
                        break;

                      case 39:
                        data = _lang.data; // eslint-disable-line

                      case 40:
                        data = new Uint8Array(data);
                        type = fileType(data);

                        if (typeof type !== 'undefined' && type.mime === 'application/gzip') {
                          data = adapter.gunzip(data);
                        }

                        if (TessModule) {
                          if (dataPath) {
                            try {
                              TessModule.FS.mkdir(dataPath);
                            } catch (err) {
                              res.reject(err.toString());
                            }
                          }

                          TessModule.FS.writeFile("".concat(dataPath || '.', "/").concat(lang, ".traineddata"), data);
                        }

                        if (!['write', 'refresh', undefined].includes(cacheMethod)) {
                          _context2.next = 47;
                          break;
                        }

                        _context2.next = 47;
                        return adapter.writeCache("".concat(cachePath || '.', "/").concat(lang, ".traineddata"), data);

                      case 47:
                        return _context2.abrupt("return", Promise.resolve(data));

                      case 48:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[3, 16]]);
              }));

              return function loadAndGunzipFile(_x5) {
                return _ref6.apply(this, arguments);
              };
            }();

            res.progress({
              workerId: workerId,
              status: 'loading language traineddata',
              progress: 0
            });
            _context3.prev = 3;
            _context3.next = 6;
            return Promise.all((typeof langs === 'string' ? langs.split('+') : langs).map(loadAndGunzipFile));

          case 6:
            res.progress({
              workerId: workerId,
              status: 'loaded language traineddata',
              progress: 1
            });
            res.resolve(langs);
            _context3.next = 13;
            break;

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](3);

            if (isWebWorker && _context3.t0 instanceof DOMException) {
              /*
               * For some reason google chrome throw DOMException in loadLang,
               * while other browser is OK, for now we ignore this exception
               * and hopefully to find the root cause one day.
               */
            } else {
              res.reject(_context3.t0.toString());
            }

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[3, 10]]);
  }));

  return function loadLanguage(_x3, _x4) {
    return _ref5.apply(this, arguments);
  };
}();

var setParameters = function setParameters(_ref7, res) {
  var _params = _ref7.payload.params;
  Object.keys(_params).filter(function (k) {
    return !k.startsWith('tessjs_');
  }).forEach(function (key) {
    api.SetVariable(key, _params[key]);
  });
  params = _objectSpread(_objectSpread({}, params), _params);

  if (typeof res !== 'undefined') {
    res.resolve(params);
  }
};

var initialize = function initialize(_ref8, res) {
  var workerId = _ref8.workerId,
      _ref8$payload = _ref8.payload,
      _langs = _ref8$payload.langs,
      oem = _ref8$payload.oem;
  var langs = typeof _langs === 'string' ? _langs : _langs.map(function (l) {
    return typeof l === 'string' ? l : l.data;
  }).join('+');

  try {
    res.progress({
      workerId: workerId,
      status: 'initializing api',
      progress: 0
    });

    if (api !== null) {
      api.End();
    }

    someData = options.dataPath;
    someOtherData = dataPath;
    api = new TessModule.TessBaseAPI();
    api.Init(null, langs, oem);
    params = defaultParams;
    setParameters({
      payload: {
        params: params
      }
    });
    res.progress({
      workerId: workerId,
      status: 'initialized api',
      progress: 1
    });
    res.resolve();
  } catch (err) {
    res.reject(err.toString());
  }
};

var recognize = function recognize(_ref9, res) {
  var _ref9$payload = _ref9.payload,
      image = _ref9$payload.image,
      rec = _ref9$payload.options.rectangle;

  try {
    var ptr = setImage(TessModule, api, image);

    if (_typeof(rec) === 'object') {
      api.SetRectangle(rec.left, rec.top, rec.width, rec.height);
    }

    api.Recognize(null);
    res.resolve(dump(TessModule, api, params));

    TessModule._free(ptr);
  } catch (err) {
    res.reject(err.toString());
  }
};

var getPDF = function getPDF(_ref10, res) {
  var _ref10$payload = _ref10.payload,
      title = _ref10$payload.title,
      textonly = _ref10$payload.textonly;
  var pdfRenderer = new TessModule.TessPDFRenderer('tesseract-ocr', '/', textonly);
  pdfRenderer.BeginDocument(title);
  pdfRenderer.AddImage(api);
  pdfRenderer.EndDocument();

  TessModule._free(pdfRenderer);

  res.resolve(TessModule.FS.readFile('/tesseract-ocr.pdf'));
};

var detect = function detect(_ref11, res) {
  var image = _ref11.payload.image;

  try {
    var ptr = setImage(TessModule, api, image);
    var results = new TessModule.OSResults();

    if (!api.DetectOS(results)) {
      api.End();

      TessModule._free(ptr);

      res.reject('Failed to detect OS');
    } else {
      var best = results.best_result;
      var oid = best.orientation_id;
      var sid = best.script_id;

      TessModule._free(ptr);

      res.resolve({
        tesseract_script_id: sid,
        script: results.unicharset.get_script_from_script_id(sid),
        script_confidence: best.sconfidence,
        orientation_degrees: [0, 270, 180, 90][oid],
        orientation_confidence: best.oconfidence
      });
    }
  } catch (err) {
    res.reject(err.toString());
  }
};

var terminate = function terminate(_, res) {
  try {
    if (api !== null) {
      api.End();
    }

    res.resolve({
      terminated: true
    });
  } catch (err) {
    res.reject(err.toString());
  }
};
/**
 * dispatchHandlers
 *
 * @name dispatchHandlers
 * @function worker data handler
 * @access public
 * @param {object} data
 * @param {string} data.jobId - unique job id
 * @param {string} data.action - action of the job, only recognize and detect for now
 * @param {object} data.payload - data for the job
 * @param {function} send - trigger job to work
 */


exports.dispatchHandlers = function (packet, send) {
  var res = function res(status, data) {
    send(_objectSpread(_objectSpread({}, packet), {}, {
      status: status,
      data: data
    }));
  };

  res.resolve = res.bind(_this, 'resolve');
  res.reject = res.bind(_this, 'reject');
  res.progress = res.bind(_this, 'progress');
  latestJob = res;

  try {
    ({
      load: load,
      FS: FS,
      loadLanguage: loadLanguage,
      initialize: initialize,
      setParameters: setParameters,
      recognize: recognize,
      getPDF: getPDF,
      detect: detect,
      terminate: terminate
    })[packet.action](packet, res);
  } catch (err) {
    /** Prepare exception to travel through postMessage */
    res.reject(err.toString());
  }
};
/**
 * setAdapter
 *
 * @name setAdapter
 * @function
 * @access public
 * @param {object} adapter - implementation of the worker, different in browser and node environment
 */


exports.setAdapter = function (_adapter) {
  adapter = _adapter;
};

/***/ }),

/***/ "./src/worker-script/utils/dump.js":
/*!*****************************************!*\
  !*** ./src/worker-script/utils/dump.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 *
 * Dump data to a big JSON tree
 *
 * @fileoverview dump data to JSON tree
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */

/**
 * deindent
 *
 * The generated HOCR is excessively indented, so
 * we get rid of that indentation
 *
 * @name deindent
 * @function deindent string
 * @access public
 */
var deindent = function deindent(html) {
  var lines = html.split('\n');

  if (lines[0].substring(0, 2) === '  ') {
    for (var i = 0; i < lines.length; i += 1) {
      if (lines[i].substring(0, 2) === '  ') {
        lines[i] = lines[i].slice(2);
      }
    }
  }

  return lines.join('\n');
};
/**
 * dump
 *
 * @name dump
 * @function dump recognition result to a JSON object
 * @access public
 */


module.exports = function (TessModule, api, _ref) {
  var tessjs_create_hocr = _ref.tessjs_create_hocr,
      tessjs_create_tsv = _ref.tessjs_create_tsv,
      tessjs_create_box = _ref.tessjs_create_box,
      tessjs_create_unlv = _ref.tessjs_create_unlv,
      tessjs_create_osd = _ref.tessjs_create_osd;
  var ri = api.GetIterator();
  var RIL_BLOCK = TessModule.RIL_BLOCK,
      RIL_PARA = TessModule.RIL_PARA,
      RIL_TEXTLINE = TessModule.RIL_TEXTLINE,
      RIL_WORD = TessModule.RIL_WORD,
      RIL_SYMBOL = TessModule.RIL_SYMBOL;
  var blocks = [];
  var block;
  var para;
  var textline;
  var word;
  var symbol;

  var enumToString = function enumToString(value, prefix) {
    return Object.keys(TessModule).filter(function (e) {
      return e.startsWith("".concat(prefix, "_")) && TessModule[e] === value;
    }).map(function (e) {
      return e.slice(prefix.length + 1);
    })[0];
  };

  ri.Begin();

  do {
    if (ri.IsAtBeginningOf(RIL_BLOCK)) {
      var poly = ri.BlockPolygon();
      var polygon = null; // BlockPolygon() returns null when automatic page segmentation is off

      if (TessModule.getPointer(poly) > 0) {
        var n = poly.get_n();
        var px = poly.get_x();
        var py = poly.get_y();
        polygon = [];

        for (var i = 0; i < n; i += 1) {
          polygon.push([px.getValue(i), py.getValue(i)]);
        }
        /*
         * TODO: find out why _ptaDestroy doesn't work
         */
        // TessModule._ptaDestroy(TessModule.getPointer(poly));

      }

      block = {
        paragraphs: [],
        text: ri.GetUTF8Text(RIL_BLOCK),
        confidence: ri.Confidence(RIL_BLOCK),
        baseline: ri.getBaseline(RIL_BLOCK),
        bbox: ri.getBoundingBox(RIL_BLOCK),
        blocktype: enumToString(ri.BlockType(), 'PT'),
        polygon: polygon
      };
      blocks.push(block);
    }

    if (ri.IsAtBeginningOf(RIL_PARA)) {
      para = {
        lines: [],
        text: ri.GetUTF8Text(RIL_PARA),
        confidence: ri.Confidence(RIL_PARA),
        baseline: ri.getBaseline(RIL_PARA),
        bbox: ri.getBoundingBox(RIL_PARA),
        is_ltr: !!ri.ParagraphIsLtr()
      };
      block.paragraphs.push(para);
    }

    if (ri.IsAtBeginningOf(RIL_TEXTLINE)) {
      textline = {
        words: [],
        text: ri.GetUTF8Text(RIL_TEXTLINE),
        confidence: ri.Confidence(RIL_TEXTLINE),
        baseline: ri.getBaseline(RIL_TEXTLINE),
        bbox: ri.getBoundingBox(RIL_TEXTLINE)
      };
      para.lines.push(textline);
    }

    if (ri.IsAtBeginningOf(RIL_WORD)) {
      var fontInfo = ri.getWordFontAttributes();
      var wordDir = ri.WordDirection();
      word = {
        symbols: [],
        choices: [],
        text: ri.GetUTF8Text(RIL_WORD),
        confidence: ri.Confidence(RIL_WORD),
        baseline: ri.getBaseline(RIL_WORD),
        bbox: ri.getBoundingBox(RIL_WORD),
        is_numeric: !!ri.WordIsNumeric(),
        in_dictionary: !!ri.WordIsFromDictionary(),
        direction: enumToString(wordDir, 'DIR'),
        language: ri.WordRecognitionLanguage(),
        is_bold: fontInfo.is_bold,
        is_italic: fontInfo.is_italic,
        is_underlined: fontInfo.is_underlined,
        is_monospace: fontInfo.is_monospace,
        is_serif: fontInfo.is_serif,
        is_smallcaps: fontInfo.is_smallcaps,
        font_size: fontInfo.pointsize,
        font_id: fontInfo.font_id,
        font_name: fontInfo.font_name
      };
      var wc = new TessModule.WordChoiceIterator(ri);

      do {
        word.choices.push({
          text: wc.GetUTF8Text(),
          confidence: wc.Confidence()
        });
      } while (wc.Next());

      TessModule.destroy(wc);
      textline.words.push(word);
    } // let image = null;
    // var pix = ri.GetBinaryImage(TessModule.RIL_SYMBOL)
    // var image = pix2array(pix);
    // // for some reason it seems that things stop working if you destroy pics
    // TessModule._pixDestroy(TessModule.getPointer(pix));


    if (ri.IsAtBeginningOf(RIL_SYMBOL)) {
      symbol = {
        choices: [],
        image: null,
        text: ri.GetUTF8Text(RIL_SYMBOL),
        confidence: ri.Confidence(RIL_SYMBOL),
        baseline: ri.getBaseline(RIL_SYMBOL),
        bbox: ri.getBoundingBox(RIL_SYMBOL),
        is_superscript: !!ri.SymbolIsSuperscript(),
        is_subscript: !!ri.SymbolIsSubscript(),
        is_dropcap: !!ri.SymbolIsDropcap()
      };
      word.symbols.push(symbol);
      var ci = new TessModule.ChoiceIterator(ri);

      do {
        symbol.choices.push({
          text: ci.GetUTF8Text(),
          confidence: ci.Confidence()
        });
      } while (ci.Next()); // TessModule.destroy(i);

    }
  } while (ri.Next(RIL_SYMBOL));

  TessModule.destroy(ri);
  return {
    text: api.GetUTF8Text(),
    hocr: tessjs_create_hocr === '1' ? deindent(api.GetHOCRText()) : null,
    tsv: tessjs_create_tsv === '1' ? api.GetTSVText() : null,
    box: tessjs_create_box === '1' ? api.GetBoxText() : null,
    unlv: tessjs_create_unlv === '1' ? api.GetUNLVText() : null,
    osd: tessjs_create_osd === '1' ? api.GetOsdText() : null,
    confidence: api.MeanTextConf(),
    blocks: blocks,
    psm: enumToString(api.GetPageSegMode(), 'PSM'),
    oem: enumToString(api.oem(), 'OEM'),
    version: api.Version()
  };
};

/***/ }),

/***/ "./src/worker-script/utils/setImage.js":
/*!*********************************************!*\
  !*** ./src/worker-script/utils/setImage.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var bmp = __webpack_require__(/*! bmp-js */ "./node_modules/bmp-js/index.js");

var fileType = __webpack_require__(/*! file-type */ "./node_modules/file-type/index.js");
/**
 * setImage
 *
 * @name setImage
 * @function set image in tesseract for recognition
 * @access public
 */


module.exports = function (TessModule, api, image) {
  var _buf$slice$toString$m, _buf$slice$toString$m2;

  var buf = Buffer.from(Array.from(_objectSpread(_objectSpread({}, image), {}, {
    length: Object.keys(image).length
  })));
  var type = fileType(buf);
  var bytesPerPixel = 0;
  var data = null;
  var pix = null;
  var w = 0;
  var h = 0;
  var exif = ((_buf$slice$toString$m = buf.slice(0, 500).toString().match(/\x01\x12\x00\x03\x00\x00\x00\x01\x00(.)/)) === null || _buf$slice$toString$m === void 0 ? void 0 : (_buf$slice$toString$m2 = _buf$slice$toString$m[1]) === null || _buf$slice$toString$m2 === void 0 ? void 0 : _buf$slice$toString$m2.charCodeAt(0)) || 1;
  /*
   * Leptonica supports uncompressed but not compressed bmp files
   * @see https://github.com/DanBloomberg/leptonica/issues/607#issuecomment-1068802516
   * We therefore use bmp-js to process all bmp files
   */

  if (type && type.mime === 'image/bmp') {
    var bmpBuf = bmp.decode(buf);
    data = TessModule._malloc(bmpBuf.data.length * Uint8Array.BYTES_PER_ELEMENT);
    TessModule.HEAPU8.set(bmpBuf.data, data);
    w = bmpBuf.width;
    h = bmpBuf.height;
    bytesPerPixel = 4;
  } else {
    var ptr = TessModule._malloc(buf.length * Uint8Array.BYTES_PER_ELEMENT);

    TessModule.HEAPU8.set(buf, ptr);
    pix = TessModule._pixReadMem(ptr, buf.length);

    if (TessModule.getValue(pix + 7 * 4, 'i32') === 0) {
      /*
       * Set a yres default value to prevent warning from tesseract
       * See kMinCredibleResolution in tesseract/src/ccstruct/publictypes.h
       */
      TessModule.setValue(pix + 7 * 4, 300, 'i32');
    }

    var _Array$fill$map = Array(2).fill(0).map(function (v, idx) {
      return TessModule.getValue(pix + idx * 4, 'i32');
    });

    var _Array$fill$map2 = _slicedToArray(_Array$fill$map, 2);

    w = _Array$fill$map2[0];
    h = _Array$fill$map2[1];
  }
  /*
   * As some image format (ex. bmp) is not supported natiely by tesseract,
   * sometimes it will not return pix directly, but data and bytesPerPixel
   * for another SetImage usage.
   *
   */


  if (data === null) {
    api.SetImage(pix, undefined, undefined, undefined, undefined, exif);
  } else {
    api.SetImage(data, w, h, bytesPerPixel, w * bytesPerPixel, exif);
  }

  return data === null ? pix : data;
};

/***/ }),

/***/ "./node_modules/idb-keyval/dist/idb-keyval.mjs":
/*!*****************************************************!*\
  !*** ./node_modules/idb-keyval/dist/idb-keyval.mjs ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Store": () => (/* binding */ Store),
/* harmony export */   "clear": () => (/* binding */ clear),
/* harmony export */   "del": () => (/* binding */ del),
/* harmony export */   "get": () => (/* binding */ get),
/* harmony export */   "keys": () => (/* binding */ keys),
/* harmony export */   "set": () => (/* binding */ set)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Store = /*#__PURE__*/function () {
  function Store() {
    var dbName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'keyval-store';
    var storeName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'keyval';

    _classCallCheck(this, Store);

    this.storeName = storeName;
    this._dbp = new Promise(function (resolve, reject) {
      var openreq = indexedDB.open(dbName, 1);

      openreq.onerror = function () {
        return reject(openreq.error);
      };

      openreq.onsuccess = function () {
        return resolve(openreq.result);
      }; // First time setup: create an empty object store


      openreq.onupgradeneeded = function () {
        openreq.result.createObjectStore(storeName);
      };
    });
  }

  _createClass(Store, [{
    key: "_withIDBStore",
    value: function _withIDBStore(type, callback) {
      var _this = this;

      return this._dbp.then(function (db) {
        return new Promise(function (resolve, reject) {
          var transaction = db.transaction(_this.storeName, type);

          transaction.oncomplete = function () {
            return resolve();
          };

          transaction.onabort = transaction.onerror = function () {
            return reject(transaction.error);
          };

          callback(transaction.objectStore(_this.storeName));
        });
      });
    }
  }]);

  return Store;
}();

var store;

function getDefaultStore() {
  if (!store) store = new Store();
  return store;
}

function get(key) {
  var store = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getDefaultStore();
  var req;
  return store._withIDBStore('readonly', function (store) {
    req = store.get(key);
  }).then(function () {
    return req.result;
  });
}

function set(key, value) {
  var store = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : getDefaultStore();
  return store._withIDBStore('readwrite', function (store) {
    store.put(value, key);
  });
}

function del(key) {
  var store = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getDefaultStore();
  return store._withIDBStore('readwrite', function (store) {
    store.delete(key);
  });
}

function clear() {
  var store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getDefaultStore();
  return store._withIDBStore('readwrite', function (store) {
    store.clear();
  });
}

function keys() {
  var store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getDefaultStore();
  var keys = [];
  return store._withIDBStore('readonly', function (store) {
    // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
    // And openKeyCursor isn't supported by Safari.
    (store.openKeyCursor || store.openCursor).call(store).onsuccess = function () {
      if (!this.result) return;
      keys.push(this.result.key);
      this.result.continue();
    };
  }).then(function () {
    return keys;
  });
}



/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"tesseract.js","version":"3.0.2","description":"Pure Javascript Multilingual OCR","main":"src/index.js","types":"src/index.d.ts","unpkg":"dist/tesseract.min.js","jsdelivr":"dist/tesseract.min.js","scripts":{"start":"node scripts/server.js","build":"rimraf dist && webpack --config scripts/webpack.config.prod.js","profile:tesseract":"webpack-bundle-analyzer dist/tesseract-stats.json","profile:worker":"webpack-bundle-analyzer dist/worker-stats.json","prepublishOnly":"npm run build","wait":"rimraf dist && wait-on http://localhost:3000/dist/tesseract.dev.js","test":"npm-run-all -p -r start test:all","test:all":"npm-run-all wait test:browser:* test:node:all","test:node":"nyc mocha --exit --bail --require ./scripts/test-helper.js","test:node:all":"npm run test:node -- ./tests/*.test.js","test:browser-tpl":"mocha-headless-chrome -a incognito -a no-sandbox -a disable-setuid-sandbox -a disable-logging -t 300000","test:browser:detect":"npm run test:browser-tpl -- -f ./tests/detect.test.html","test:browser:recognize":"npm run test:browser-tpl -- -f ./tests/recognize.test.html","test:browser:scheduler":"npm run test:browser-tpl -- -f ./tests/scheduler.test.html","test:browser:FS":"npm run test:browser-tpl -- -f ./tests/FS.test.html","lint":"eslint src","lint:fix":"eslint --fix src","postinstall":"opencollective-postinstall || true"},"browser":{"./src/worker/node/index.js":"./src/worker/browser/index.js"},"author":"","contributors":["jeromewu"],"license":"Apache-2.0","devDependencies":{"@babel/core":"^7.18.7","@babel/preset-env":"^7.18.7","acorn":"^6.4.0","babel-loader":"^8.2.0","buffer":"^6.0.3","cors":"^2.8.5","eslint":"^7.2.0","eslint-config-airbnb-base":"^14.2.0","eslint-plugin-import":"^2.22.1","expect.js":"^0.3.1","express":"^4.17.1","mocha":"^8.1.3","mocha-headless-chrome":"^2.0.3","npm-run-all":"^4.1.5","nyc":"^15.1.0","rimraf":"^2.7.1","wait-on":"^3.3.0","webpack":"^5.74.0","webpack-bundle-analyzer":"^4.6.0","webpack-cli":"^4.10.0","webpack-dev-middleware":"^5.3.3"},"dependencies":{"babel-eslint":"^10.1.0","bmp-js":"^0.1.0","file-type":"^12.4.1","idb-keyval":"^3.2.0","is-electron":"^2.2.0","is-url":"^1.2.4","node-fetch":"^2.6.0","opencollective-postinstall":"^2.0.2","regenerator-runtime":"^0.13.3","resolve-url":"^0.2.1","tesseract.js-core":"^3.0.1","wasm-feature-detect":"^1.2.11","zlibjs":"^0.3.1"},"repository":{"type":"git","url":"https://github.com/musicnotes-com/tesseract.js.git"},"bugs":{"url":"https://github.com/musicnotes-com/tesseract.js/issues"},"homepage":"https://github.com/musicnotes-com/tesseract.js"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************************************!*\
  !*** ./src/worker-script/browser/index.js ***!
  \********************************************/
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 *
 * Browser worker scripts
 *
 * @fileoverview Browser worker implementation
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
var worker = __webpack_require__(/*! .. */ "./src/worker-script/index.js");

var getCore = __webpack_require__(/*! ./getCore */ "./src/worker-script/browser/getCore.js");

var gunzip = __webpack_require__(/*! ./gunzip */ "./src/worker-script/browser/gunzip.js");

var cache = __webpack_require__(/*! ./cache */ "./src/worker-script/browser/cache.js");
/*
 * register message handler
 */


__webpack_require__.g.addEventListener('message', function (_ref) {
  var data = _ref.data;
  worker.dispatchHandlers(data, function (obj) {
    return postMessage(obj);
  });
});
/*
 * getCore is a sync function to load and return
 * TesseractCore.
 */

worker.setAdapter(_objectSpread({
  getCore: getCore,
  gunzip: gunzip,
  fetch: function fetch() {}
}, cache));
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFGO1VBQVk7O1FBQU0sS0FBSyxNQUFJQSxDQUFUO1VBQVcyaEIsQ0FBQyxHQUFDLENBQUMsQ0FBRCxFQUFHM2hCLENBQUMsR0FBQyxDQUFMLEVBQU8sQ0FBUCxDQUFGO1VBQVk7O1FBQU0sS0FBSyxNQUFJQSxDQUFUO1VBQVcyaEIsQ0FBQyxHQUFDLENBQUMsQ0FBRCxFQUFHM2hCLENBQUMsR0FBQyxDQUFMLEVBQU8sQ0FBUCxDQUFGO1VBQVk7O1FBQU0sS0FBSyxNQUFJQSxDQUFUO1VBQVcyaEIsQ0FBQyxHQUFDLENBQUMsQ0FBRCxFQUFHM2hCLENBQUMsR0FBQyxDQUFMLEVBQU8sQ0FBUCxDQUFGO1VBQVk7O1FBQU0sS0FBSyxLQUFHQSxDQUFSO1VBQVUyaEIsQ0FBQyxHQUFDLENBQUMsQ0FBRCxFQUFHM2hCLENBQUMsR0FBQyxDQUFMLEVBQU8sQ0FBUCxDQUFGO1VBQVk7O1FBQU0sS0FBSyxLQUFHQSxDQUFSO1VBQVUyaEIsQ0FBQyxHQUFDLENBQUMsQ0FBRCxFQUFHM2hCLENBQUMsR0FBQyxDQUFMLEVBQU8sQ0FBUCxDQUFGO1VBQVk7O1FBQU0sS0FBSyxNQUFJQSxDQUFUO1VBQVcyaEIsQ0FBQyxHQUFDLENBQUMsQ0FBRCxFQUFHM2hCLENBQUMsR0FBQyxDQUFMLEVBQU8sQ0FBUCxDQUFGO1VBQVk7O1FBQU0sS0FBSyxNQUFJQSxDQUFUO1VBQVcyaEIsQ0FBQyxHQUFDLENBQUMsQ0FBRCxFQUFHM2hCLENBQUMsR0FBQyxFQUFMLEVBQVEsQ0FBUixDQUFGO1VBQWE7O1FBQU0sS0FBSyxNQUFJQSxDQUFUO1VBQVcyaEIsQ0FBQyxHQUFDLENBQUMsQ0FBRCxFQUFHM2hCLENBQUMsR0FBQyxFQUFMLEVBQVEsQ0FBUixDQUFGO1VBQWE7O1FBQU0sS0FBSyxNQUFJQSxDQUFUO1VBQVcyaEIsQ0FBQyxHQUFDLENBQUMsQ0FBRCxFQUFHM2hCLENBQUMsR0FBQyxFQUFMLEVBQVEsQ0FBUixDQUFGO1VBQWE7O1FBQU0sS0FBSyxNQUFJQSxDQUFUO1VBQVcyaEIsQ0FBQyxHQUFDLENBQUMsRUFBRCxFQUFJ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L3Rlc3NlcmFjdC5qcy8uL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vdGVzc2VyYWN0LmpzLy4vbm9kZV9tb2R1bGVzL2JtcC1qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvLi9ub2RlX21vZHVsZXMvYm1wLWpzL2xpYi9kZWNvZGVyLmpzIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy8uL25vZGVfbW9kdWxlcy9ibXAtanMvbGliL2VuY29kZXIuanMiLCJ3ZWJwYWNrOi8vdGVzc2VyYWN0LmpzLy4vbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qcyIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvLi9ub2RlX21vZHVsZXMvZmlsZS10eXBlL2luZGV4LmpzIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy8uL25vZGVfbW9kdWxlcy9maWxlLXR5cGUvc3VwcG9ydGVkLmpzIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy8uL25vZGVfbW9kdWxlcy9maWxlLXR5cGUvdXRpbC5qcyIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvLi9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvLi9ub2RlX21vZHVsZXMvaXMtZWxlY3Ryb24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vdGVzc2VyYWN0LmpzLy4vbm9kZV9tb2R1bGVzL2lzLXVybC9pbmRleC5qcyIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvLi9ub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy8uL25vZGVfbW9kdWxlcy93YXNtLWZlYXR1cmUtZGV0ZWN0L2Rpc3QvZXNtL2luZGV4LmpzIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy8uL25vZGVfbW9kdWxlcy96bGlianMvYmluL25vZGUtemxpYi5qcyIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvLi9zcmMvY29uc3RhbnRzL1BTTS5qcyIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvLi9zcmMvdXRpbHMvZ2V0RW52aXJvbm1lbnQuanMiLCJ3ZWJwYWNrOi8vdGVzc2VyYWN0LmpzLy4vc3JjL3V0aWxzL2xvZy5qcyIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvLi9zcmMvd29ya2VyLXNjcmlwdC9icm93c2VyL2NhY2hlLmpzIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy8uL3NyYy93b3JrZXItc2NyaXB0L2Jyb3dzZXIvZ2V0Q29yZS5qcyIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvLi9zcmMvd29ya2VyLXNjcmlwdC9icm93c2VyL2d1bnppcC5qcyIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvLi9zcmMvd29ya2VyLXNjcmlwdC9jb25zdGFudHMvZGVmYXVsdFBhcmFtcy5qcyIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvLi9zcmMvd29ya2VyLXNjcmlwdC9pbmRleC5qcyIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvLi9zcmMvd29ya2VyLXNjcmlwdC91dGlscy9kdW1wLmpzIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy8uL3NyYy93b3JrZXItc2NyaXB0L3V0aWxzL3NldEltYWdlLmpzIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy8uL25vZGVfbW9kdWxlcy9pZGIta2V5dmFsL2Rpc3QvaWRiLWtleXZhbC5tanMiLCJ3ZWJwYWNrOi8vdGVzc2VyYWN0LmpzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdGVzc2VyYWN0LmpzL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vdGVzc2VyYWN0LmpzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdGVzc2VyYWN0LmpzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdGVzc2VyYWN0LmpzL3dlYnBhY2svcnVudGltZS9ub2RlIG1vZHVsZSBkZWNvcmF0b3IiLCJ3ZWJwYWNrOi8vdGVzc2VyYWN0LmpzLy4vc3JjL3dvcmtlci1zY3JpcHQvYnJvd3Nlci9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuZXhwb3J0cy5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuZXhwb3J0cy50b0J5dGVBcnJheSA9IHRvQnl0ZUFycmF5XG5leHBvcnRzLmZyb21CeXRlQXJyYXkgPSBmcm9tQnl0ZUFycmF5XG5cbnZhciBsb29rdXAgPSBbXVxudmFyIHJldkxvb2t1cCA9IFtdXG52YXIgQXJyID0gdHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnID8gVWludDhBcnJheSA6IEFycmF5XG5cbnZhciBjb2RlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nXG5mb3IgKHZhciBpID0gMCwgbGVuID0gY29kZS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICBsb29rdXBbaV0gPSBjb2RlW2ldXG4gIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaVxufVxuXG4vLyBTdXBwb3J0IGRlY29kaW5nIFVSTC1zYWZlIGJhc2U2NCBzdHJpbmdzLCBhcyBOb2RlLmpzIGRvZXMuXG4vLyBTZWU6IGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Jhc2U2NCNVUkxfYXBwbGljYXRpb25zXG5yZXZMb29rdXBbJy0nLmNoYXJDb2RlQXQoMCldID0gNjJcbnJldkxvb2t1cFsnXycuY2hhckNvZGVBdCgwKV0gPSA2M1xuXG5mdW5jdGlvbiBnZXRMZW5zIChiNjQpIHtcbiAgdmFyIGxlbiA9IGI2NC5sZW5ndGhcblxuICBpZiAobGVuICUgNCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuICB9XG5cbiAgLy8gVHJpbSBvZmYgZXh0cmEgYnl0ZXMgYWZ0ZXIgcGxhY2Vob2xkZXIgYnl0ZXMgYXJlIGZvdW5kXG4gIC8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2JlYXRnYW1taXQvYmFzZTY0LWpzL2lzc3Vlcy80MlxuICB2YXIgdmFsaWRMZW4gPSBiNjQuaW5kZXhPZignPScpXG4gIGlmICh2YWxpZExlbiA9PT0gLTEpIHZhbGlkTGVuID0gbGVuXG5cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IHZhbGlkTGVuID09PSBsZW5cbiAgICA/IDBcbiAgICA6IDQgLSAodmFsaWRMZW4gJSA0KVxuXG4gIHJldHVybiBbdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbl1cbn1cblxuLy8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChiNjQpIHtcbiAgdmFyIGxlbnMgPSBnZXRMZW5zKGI2NClcbiAgdmFyIHZhbGlkTGVuID0gbGVuc1swXVxuICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gbGVuc1sxXVxuICByZXR1cm4gKCh2YWxpZExlbiArIHBsYWNlSG9sZGVyc0xlbikgKiAzIC8gNCkgLSBwbGFjZUhvbGRlcnNMZW5cbn1cblxuZnVuY3Rpb24gX2J5dGVMZW5ndGggKGI2NCwgdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbikge1xuICByZXR1cm4gKCh2YWxpZExlbiArIHBsYWNlSG9sZGVyc0xlbikgKiAzIC8gNCkgLSBwbGFjZUhvbGRlcnNMZW5cbn1cblxuZnVuY3Rpb24gdG9CeXRlQXJyYXkgKGI2NCkge1xuICB2YXIgdG1wXG4gIHZhciBsZW5zID0gZ2V0TGVucyhiNjQpXG4gIHZhciB2YWxpZExlbiA9IGxlbnNbMF1cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IGxlbnNbMV1cblxuICB2YXIgYXJyID0gbmV3IEFycihfYnl0ZUxlbmd0aChiNjQsIHZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW4pKVxuXG4gIHZhciBjdXJCeXRlID0gMFxuXG4gIC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcbiAgdmFyIGxlbiA9IHBsYWNlSG9sZGVyc0xlbiA+IDBcbiAgICA/IHZhbGlkTGVuIC0gNFxuICAgIDogdmFsaWRMZW5cblxuICB2YXIgaVxuICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDQpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTgpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCAxMikgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildIDw8IDYpIHxcbiAgICAgIHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMyldXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDE2KSAmIDB4RkZcbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzTGVuID09PSAyKSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDIpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA+PiA0KVxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVyc0xlbiA9PT0gMSkge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxMCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDQpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA+PiAyKVxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcbiAgcmV0dXJuIGxvb2t1cFtudW0gPj4gMTggJiAweDNGXSArXG4gICAgbG9va3VwW251bSA+PiAxMiAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtID4+IDYgJiAweDNGXSArXG4gICAgbG9va3VwW251bSAmIDB4M0ZdXG59XG5cbmZ1bmN0aW9uIGVuY29kZUNodW5rICh1aW50OCwgc3RhcnQsIGVuZCkge1xuICB2YXIgdG1wXG4gIHZhciBvdXRwdXQgPSBbXVxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkgKz0gMykge1xuICAgIHRtcCA9XG4gICAgICAoKHVpbnQ4W2ldIDw8IDE2KSAmIDB4RkYwMDAwKSArXG4gICAgICAoKHVpbnQ4W2kgKyAxXSA8PCA4KSAmIDB4RkYwMCkgK1xuICAgICAgKHVpbnQ4W2kgKyAyXSAmIDB4RkYpXG4gICAgb3V0cHV0LnB1c2godHJpcGxldFRvQmFzZTY0KHRtcCkpXG4gIH1cbiAgcmV0dXJuIG91dHB1dC5qb2luKCcnKVxufVxuXG5mdW5jdGlvbiBmcm9tQnl0ZUFycmF5ICh1aW50OCkge1xuICB2YXIgdG1wXG4gIHZhciBsZW4gPSB1aW50OC5sZW5ndGhcbiAgdmFyIGV4dHJhQnl0ZXMgPSBsZW4gJSAzIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG4gIHZhciBwYXJ0cyA9IFtdXG4gIHZhciBtYXhDaHVua0xlbmd0aCA9IDE2MzgzIC8vIG11c3QgYmUgbXVsdGlwbGUgb2YgM1xuXG4gIC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcbiAgZm9yICh2YXIgaSA9IDAsIGxlbjIgPSBsZW4gLSBleHRyYUJ5dGVzOyBpIDwgbGVuMjsgaSArPSBtYXhDaHVua0xlbmd0aCkge1xuICAgIHBhcnRzLnB1c2goZW5jb2RlQ2h1bmsodWludDgsIGksIChpICsgbWF4Q2h1bmtMZW5ndGgpID4gbGVuMiA/IGxlbjIgOiAoaSArIG1heENodW5rTGVuZ3RoKSkpXG4gIH1cblxuICAvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG4gIGlmIChleHRyYUJ5dGVzID09PSAxKSB7XG4gICAgdG1wID0gdWludDhbbGVuIC0gMV1cbiAgICBwYXJ0cy5wdXNoKFxuICAgICAgbG9va3VwW3RtcCA+PiAyXSArXG4gICAgICBsb29rdXBbKHRtcCA8PCA0KSAmIDB4M0ZdICtcbiAgICAgICc9PSdcbiAgICApXG4gIH0gZWxzZSBpZiAoZXh0cmFCeXRlcyA9PT0gMikge1xuICAgIHRtcCA9ICh1aW50OFtsZW4gLSAyXSA8PCA4KSArIHVpbnQ4W2xlbiAtIDFdXG4gICAgcGFydHMucHVzaChcbiAgICAgIGxvb2t1cFt0bXAgPj4gMTBdICtcbiAgICAgIGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl0gK1xuICAgICAgbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXSArXG4gICAgICAnPSdcbiAgICApXG4gIH1cblxuICByZXR1cm4gcGFydHMuam9pbignJylcbn1cbiIsIi8qKlxuICogQGF1dGhvciBzaGFvemlsZWVcbiAqXG4gKiBzdXBwb3J0IDFiaXQgNGJpdCA4Yml0IDI0Yml0IGRlY29kZVxuICogZW5jb2RlIHdpdGggMjRiaXRcbiAqIFxuICovXG5cbnZhciBlbmNvZGUgPSByZXF1aXJlKCcuL2xpYi9lbmNvZGVyJyksXG4gICAgZGVjb2RlID0gcmVxdWlyZSgnLi9saWIvZGVjb2RlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZW5jb2RlOiBlbmNvZGUsXG4gIGRlY29kZTogZGVjb2RlXG59O1xuIiwiLyoqXG4gKiBAYXV0aG9yIHNoYW96aWxlZVxuICpcbiAqIEJtcCBmb3JtYXQgZGVjb2RlcixzdXBwb3J0IDFiaXQgNGJpdCA4Yml0IDI0Yml0IGJtcFxuICpcbiAqL1xuXG5mdW5jdGlvbiBCbXBEZWNvZGVyKGJ1ZmZlcixpc193aXRoX2FscGhhKSB7XG4gIHRoaXMucG9zID0gMDtcbiAgdGhpcy5idWZmZXIgPSBidWZmZXI7XG4gIHRoaXMuaXNfd2l0aF9hbHBoYSA9ICEhaXNfd2l0aF9hbHBoYTtcbiAgdGhpcy5ib3R0b21fdXAgPSB0cnVlO1xuICB0aGlzLmZsYWcgPSB0aGlzLmJ1ZmZlci50b1N0cmluZyhcInV0Zi04XCIsIDAsIHRoaXMucG9zICs9IDIpO1xuICBpZiAodGhpcy5mbGFnICE9IFwiQk1cIikgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBCTVAgRmlsZVwiKTtcbiAgdGhpcy5wYXJzZUhlYWRlcigpO1xuICB0aGlzLnBhcnNlUkdCQSgpO1xufVxuXG5CbXBEZWNvZGVyLnByb3RvdHlwZS5wYXJzZUhlYWRlciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmZpbGVTaXplID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgdGhpcy5wb3MgKz0gNDtcbiAgdGhpcy5yZXNlcnZlZCA9IHRoaXMuYnVmZmVyLnJlYWRVSW50MzJMRSh0aGlzLnBvcyk7XG4gIHRoaXMucG9zICs9IDQ7XG4gIHRoaXMub2Zmc2V0ID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgdGhpcy5wb3MgKz0gNDtcbiAgdGhpcy5oZWFkZXJTaXplID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgdGhpcy5wb3MgKz0gNDtcbiAgdGhpcy53aWR0aCA9IHRoaXMuYnVmZmVyLnJlYWRVSW50MzJMRSh0aGlzLnBvcyk7XG4gIHRoaXMucG9zICs9IDQ7XG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy5idWZmZXIucmVhZEludDMyTEUodGhpcy5wb3MpO1xuICB0aGlzLnBvcyArPSA0O1xuICB0aGlzLnBsYW5lcyA9IHRoaXMuYnVmZmVyLnJlYWRVSW50MTZMRSh0aGlzLnBvcyk7XG4gIHRoaXMucG9zICs9IDI7XG4gIHRoaXMuYml0UFAgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDE2TEUodGhpcy5wb3MpO1xuICB0aGlzLnBvcyArPSAyO1xuICB0aGlzLmNvbXByZXNzID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgdGhpcy5wb3MgKz0gNDtcbiAgdGhpcy5yYXdTaXplID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgdGhpcy5wb3MgKz0gNDtcbiAgdGhpcy5ociA9IHRoaXMuYnVmZmVyLnJlYWRVSW50MzJMRSh0aGlzLnBvcyk7XG4gIHRoaXMucG9zICs9IDQ7XG4gIHRoaXMudnIgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDMyTEUodGhpcy5wb3MpO1xuICB0aGlzLnBvcyArPSA0O1xuICB0aGlzLmNvbG9ycyA9IHRoaXMuYnVmZmVyLnJlYWRVSW50MzJMRSh0aGlzLnBvcyk7XG4gIHRoaXMucG9zICs9IDQ7XG4gIHRoaXMuaW1wb3J0YW50Q29sb3JzID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgdGhpcy5wb3MgKz0gNDtcblxuICBpZih0aGlzLmJpdFBQID09PSAxNiAmJiB0aGlzLmlzX3dpdGhfYWxwaGEpe1xuICAgIHRoaXMuYml0UFAgPSAxNVxuICB9XG4gIGlmICh0aGlzLmJpdFBQIDwgMTUpIHtcbiAgICB2YXIgbGVuID0gdGhpcy5jb2xvcnMgPT09IDAgPyAxIDw8IHRoaXMuYml0UFAgOiB0aGlzLmNvbG9ycztcbiAgICB0aGlzLnBhbGV0dGUgPSBuZXcgQXJyYXkobGVuKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YXIgYmx1ZSA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgIHZhciBncmVlbiA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgIHZhciByZWQgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICB2YXIgcXVhZCA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgIHRoaXMucGFsZXR0ZVtpXSA9IHtcbiAgICAgICAgcmVkOiByZWQsXG4gICAgICAgIGdyZWVuOiBncmVlbixcbiAgICAgICAgYmx1ZTogYmx1ZSxcbiAgICAgICAgcXVhZDogcXVhZFxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgaWYodGhpcy5oZWlnaHQgPCAwKSB7XG4gICAgdGhpcy5oZWlnaHQgKj0gLTE7XG4gICAgdGhpcy5ib3R0b21fdXAgPSBmYWxzZTtcbiAgfVxuXG59XG5cbkJtcERlY29kZXIucHJvdG90eXBlLnBhcnNlUkdCQSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBiaXRuID0gXCJiaXRcIiArIHRoaXMuYml0UFA7XG4gICAgdmFyIGxlbiA9IHRoaXMud2lkdGggKiB0aGlzLmhlaWdodCAqIDQ7XG4gICAgdGhpcy5kYXRhID0gbmV3IEJ1ZmZlcihsZW4pO1xuICAgIHRoaXNbYml0bl0oKTtcbn07XG5cbkJtcERlY29kZXIucHJvdG90eXBlLmJpdDEgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHhsZW4gPSBNYXRoLmNlaWwodGhpcy53aWR0aCAvIDgpO1xuICB2YXIgbW9kZSA9IHhsZW4lNDtcbiAgdmFyIHkgPSB0aGlzLmhlaWdodCA+PSAwID8gdGhpcy5oZWlnaHQgLSAxIDogLXRoaXMuaGVpZ2h0XG4gIGZvciAodmFyIHkgPSB0aGlzLmhlaWdodCAtIDE7IHkgPj0gMDsgeS0tKSB7XG4gICAgdmFyIGxpbmUgPSB0aGlzLmJvdHRvbV91cCA/IHkgOiB0aGlzLmhlaWdodCAtIDEgLSB5XG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB4bGVuOyB4KyspIHtcbiAgICAgIHZhciBiID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgdmFyIGxvY2F0aW9uID0gbGluZSAqIHRoaXMud2lkdGggKiA0ICsgeCo4KjQ7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDg7IGkrKykge1xuICAgICAgICBpZih4KjgraTx0aGlzLndpZHRoKXtcbiAgICAgICAgICB2YXIgcmdiID0gdGhpcy5wYWxldHRlWygoYj4+KDctaSkpJjB4MSldO1xuXG4gICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uK2kqNF0gPSAwO1xuICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbitpKjQgKyAxXSA9IHJnYi5ibHVlO1xuICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbitpKjQgKyAyXSA9IHJnYi5ncmVlbjtcbiAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24raSo0ICsgM10gPSByZ2IucmVkO1xuXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1vZGUgIT0gMCl7XG4gICAgICB0aGlzLnBvcys9KDQgLSBtb2RlKTtcbiAgICB9XG4gIH1cbn07XG5cbkJtcERlY29kZXIucHJvdG90eXBlLmJpdDQgPSBmdW5jdGlvbigpIHtcbiAgICAvL1JMRS00XG4gICAgaWYodGhpcy5jb21wcmVzcyA9PSAyKXtcbiAgICAgICAgdGhpcy5kYXRhLmZpbGwoMHhmZik7XG5cbiAgICAgICAgdmFyIGxvY2F0aW9uID0gMDtcbiAgICAgICAgdmFyIGxpbmVzID0gdGhpcy5ib3R0b21fdXA/dGhpcy5oZWlnaHQtMTowO1xuICAgICAgICB2YXIgbG93X25pYmJsZSA9IGZhbHNlOy8vZm9yIGFsbCBjb3VudCBvZiBwaXhlbFxuXG4gICAgICAgIHdoaWxlKGxvY2F0aW9uPHRoaXMuZGF0YS5sZW5ndGgpe1xuICAgICAgICAgICAgdmFyIGEgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICAgICAgICB2YXIgYiA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgIC8vYWJzb2x1dGUgbW9kZVxuICAgICAgICAgICAgaWYoYSA9PSAwKXtcbiAgICAgICAgICAgICAgICBpZihiID09IDApey8vbGluZSBlbmRcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5ib3R0b21fdXApe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMtLTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lcysrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uID0gbGluZXMqdGhpcy53aWR0aCo0O1xuICAgICAgICAgICAgICAgICAgICBsb3dfbmliYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGIgPT0gMSl7Ly9pbWFnZSBlbmRcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYoYiA9PTIpe1xuICAgICAgICAgICAgICAgICAgICAvL29mZnNldCB4LHlcbiAgICAgICAgICAgICAgICAgICAgdmFyIHggPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB5ID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmJvdHRvbV91cCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lcy09eTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lcys9eTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uICs9KHkqdGhpcy53aWR0aCo0K3gqNCk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDtpPGI7aSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb3dfbmliYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0UGl4ZWxEYXRhLmNhbGwodGhpcywgKGMgJiAweDBmKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFBpeGVsRGF0YS5jYWxsKHRoaXMsIChjICYgMHhmMCk+PjQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGkgJiAxKSAmJiAoaSsxIDwgYikpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxvd19uaWJibGUgPSAhbG93X25pYmJsZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICgoKChiKzEpID4+IDEpICYgMSApID09IDEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3MrK1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9ZWxzZXsvL2VuY29kZWQgbW9kZVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb3dfbmliYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRQaXhlbERhdGEuY2FsbCh0aGlzLCAoYiAmIDB4MGYpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFBpeGVsRGF0YS5jYWxsKHRoaXMsIChiICYgMHhmMCk+PjQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxvd19uaWJibGUgPSAhbG93X25pYmJsZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG5cblxuXG4gICAgICAgIGZ1bmN0aW9uIHNldFBpeGVsRGF0YShyZ2JJbmRleCl7XG4gICAgICAgICAgICB2YXIgcmdiID0gdGhpcy5wYWxldHRlW3JnYkluZGV4XTtcbiAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbl0gPSAwO1xuICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMV0gPSByZ2IuYmx1ZTtcbiAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDJdID0gcmdiLmdyZWVuO1xuICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgM10gPSByZ2IucmVkO1xuICAgICAgICAgICAgbG9jYXRpb24rPTQ7XG4gICAgICAgIH1cbiAgICB9ZWxzZXtcblxuICAgICAgdmFyIHhsZW4gPSBNYXRoLmNlaWwodGhpcy53aWR0aC8yKTtcbiAgICAgIHZhciBtb2RlID0geGxlbiU0O1xuICAgICAgZm9yICh2YXIgeSA9IHRoaXMuaGVpZ2h0IC0gMTsgeSA+PSAwOyB5LS0pIHtcbiAgICAgICAgdmFyIGxpbmUgPSB0aGlzLmJvdHRvbV91cCA/IHkgOiB0aGlzLmhlaWdodCAtIDEgLSB5XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgeGxlbjsgeCsrKSB7XG4gICAgICAgICAgdmFyIGIgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICAgICAgdmFyIGxvY2F0aW9uID0gbGluZSAqIHRoaXMud2lkdGggKiA0ICsgeCoyKjQ7XG5cbiAgICAgICAgICB2YXIgYmVmb3JlID0gYj4+NDtcbiAgICAgICAgICB2YXIgYWZ0ZXIgPSBiJjB4MEY7XG5cbiAgICAgICAgICB2YXIgcmdiID0gdGhpcy5wYWxldHRlW2JlZm9yZV07XG4gICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uXSA9IDA7XG4gICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMV0gPSByZ2IuYmx1ZTtcbiAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAyXSA9IHJnYi5ncmVlbjtcbiAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAzXSA9IHJnYi5yZWQ7XG5cblxuICAgICAgICAgIGlmKHgqMisxPj10aGlzLndpZHRoKWJyZWFrO1xuXG4gICAgICAgICAgcmdiID0gdGhpcy5wYWxldHRlW2FmdGVyXTtcblxuICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbis0XSA9IDA7XG4gICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uKzQgKyAxXSA9IHJnYi5ibHVlO1xuICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbis0ICsgMl0gPSByZ2IuZ3JlZW47XG4gICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uKzQgKyAzXSA9IHJnYi5yZWQ7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtb2RlICE9IDApe1xuICAgICAgICAgIHRoaXMucG9zKz0oNCAtIG1vZGUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9XG5cbn07XG5cbkJtcERlY29kZXIucHJvdG90eXBlLmJpdDggPSBmdW5jdGlvbigpIHtcbiAgICAvL1JMRS04XG4gICAgaWYodGhpcy5jb21wcmVzcyA9PSAxKXtcbiAgICAgICAgdGhpcy5kYXRhLmZpbGwoMHhmZik7XG5cbiAgICAgICAgdmFyIGxvY2F0aW9uID0gMDtcbiAgICAgICAgdmFyIGxpbmVzID0gdGhpcy5ib3R0b21fdXA/dGhpcy5oZWlnaHQtMTowO1xuXG4gICAgICAgIHdoaWxlKGxvY2F0aW9uPHRoaXMuZGF0YS5sZW5ndGgpe1xuICAgICAgICAgICAgdmFyIGEgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICAgICAgICB2YXIgYiA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgIC8vYWJzb2x1dGUgbW9kZVxuICAgICAgICAgICAgaWYoYSA9PSAwKXtcbiAgICAgICAgICAgICAgICBpZihiID09IDApey8vbGluZSBlbmRcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5ib3R0b21fdXApe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMtLTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lcysrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uID0gbGluZXMqdGhpcy53aWR0aCo0O1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihiID09IDEpey8vaW1hZ2UgZW5kXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGIgPT0yKXtcbiAgICAgICAgICAgICAgICAgICAgLy9vZmZzZXQgeCx5XG4gICAgICAgICAgICAgICAgICAgIHZhciB4ID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgICAgICAgICAgICAgICB2YXIgeSA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5ib3R0b21fdXApe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMtPXk7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMrPXk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbiArPSh5KnRoaXMud2lkdGgqNCt4KjQpO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDtpPGI7aSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0UGl4ZWxEYXRhLmNhbGwodGhpcywgYyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYoYiYxID09IDEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3MrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9ZWxzZXsvL2VuY29kZWQgbW9kZVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFBpeGVsRGF0YS5jYWxsKHRoaXMsIGIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuXG5cbiAgICAgICAgZnVuY3Rpb24gc2V0UGl4ZWxEYXRhKHJnYkluZGV4KXtcbiAgICAgICAgICAgIHZhciByZ2IgPSB0aGlzLnBhbGV0dGVbcmdiSW5kZXhdO1xuICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uXSA9IDA7XG4gICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAxXSA9IHJnYi5ibHVlO1xuICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMl0gPSByZ2IuZ3JlZW47XG4gICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAzXSA9IHJnYi5yZWQ7XG4gICAgICAgICAgICBsb2NhdGlvbis9NDtcbiAgICAgICAgfVxuICAgIH1lbHNlIHtcbiAgICAgICAgdmFyIG1vZGUgPSB0aGlzLndpZHRoICUgNDtcbiAgICAgICAgZm9yICh2YXIgeSA9IHRoaXMuaGVpZ2h0IC0gMTsgeSA+PSAwOyB5LS0pIHtcbiAgICAgICAgICAgIHZhciBsaW5lID0gdGhpcy5ib3R0b21fdXAgPyB5IDogdGhpcy5oZWlnaHQgLSAxIC0geVxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYiA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBsaW5lICogdGhpcy53aWR0aCAqIDQgKyB4ICogNDtcbiAgICAgICAgICAgICAgICBpZiAoYiA8IHRoaXMucGFsZXR0ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJnYiA9IHRoaXMucGFsZXR0ZVtiXTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb25dID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMV0gPSByZ2IuYmx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMl0gPSByZ2IuZ3JlZW47XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDNdID0gcmdiLnJlZDtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbl0gPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAxXSA9IDB4RkY7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDJdID0gMHhGRjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgM10gPSAweEZGO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtb2RlICE9IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBvcyArPSAoNCAtIG1vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuQm1wRGVjb2Rlci5wcm90b3R5cGUuYml0MTUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRpZl93ID10aGlzLndpZHRoICUgMztcbiAgdmFyIF8xMTExMSA9IHBhcnNlSW50KFwiMTExMTFcIiwgMiksXzFfNSA9IF8xMTExMTtcbiAgZm9yICh2YXIgeSA9IHRoaXMuaGVpZ2h0IC0gMTsgeSA+PSAwOyB5LS0pIHtcbiAgICB2YXIgbGluZSA9IHRoaXMuYm90dG9tX3VwID8geSA6IHRoaXMuaGVpZ2h0IC0gMSAtIHlcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xuXG4gICAgICB2YXIgQiA9IHRoaXMuYnVmZmVyLnJlYWRVSW50MTZMRSh0aGlzLnBvcyk7XG4gICAgICB0aGlzLnBvcys9MjtcbiAgICAgIHZhciBibHVlID0gKEIgJiBfMV81KSAvIF8xXzUgKiAyNTUgfCAwO1xuICAgICAgdmFyIGdyZWVuID0gKEIgPj4gNSAmIF8xXzUgKSAvIF8xXzUgKiAyNTUgfCAwO1xuICAgICAgdmFyIHJlZCA9IChCID4+IDEwICYgXzFfNSkgLyBfMV81ICogMjU1IHwgMDtcbiAgICAgIHZhciBhbHBoYSA9IChCPj4xNSk/MHhGRjoweDAwO1xuXG4gICAgICB2YXIgbG9jYXRpb24gPSBsaW5lICogdGhpcy53aWR0aCAqIDQgKyB4ICogNDtcblxuICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uXSA9IGFscGhhO1xuICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMV0gPSBibHVlO1xuICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMl0gPSBncmVlbjtcbiAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDNdID0gcmVkO1xuICAgIH1cbiAgICAvL3NraXAgZXh0cmEgYnl0ZXNcbiAgICB0aGlzLnBvcyArPSBkaWZfdztcbiAgfVxufTtcblxuQm1wRGVjb2Rlci5wcm90b3R5cGUuYml0MTYgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRpZl93ID0odGhpcy53aWR0aCAlIDIpKjI7XG4gIC8vZGVmYXVsdCB4cmdiNTU1XG4gIHRoaXMubWFza1JlZCA9IDB4N0MwMDtcbiAgdGhpcy5tYXNrR3JlZW4gPSAweDNFMDtcbiAgdGhpcy5tYXNrQmx1ZSA9MHgxRjtcbiAgdGhpcy5tYXNrMCA9IDA7XG5cbiAgaWYodGhpcy5jb21wcmVzcyA9PSAzKXtcbiAgICB0aGlzLm1hc2tSZWQgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDMyTEUodGhpcy5wb3MpO1xuICAgIHRoaXMucG9zKz00O1xuICAgIHRoaXMubWFza0dyZWVuID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgICB0aGlzLnBvcys9NDtcbiAgICB0aGlzLm1hc2tCbHVlID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgICB0aGlzLnBvcys9NDtcbiAgICB0aGlzLm1hc2swID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgICB0aGlzLnBvcys9NDtcbiAgfVxuXG5cbiAgdmFyIG5zPVswLDAsMF07XG4gIGZvciAodmFyIGk9MDtpPDE2O2krKyl7XG4gICAgaWYgKCh0aGlzLm1hc2tSZWQ+PmkpJjB4MDEpIG5zWzBdKys7XG4gICAgaWYgKCh0aGlzLm1hc2tHcmVlbj4+aSkmMHgwMSkgbnNbMV0rKztcbiAgICBpZiAoKHRoaXMubWFza0JsdWU+PmkpJjB4MDEpIG5zWzJdKys7XG4gIH1cbiAgbnNbMV0rPW5zWzBdOyBuc1syXSs9bnNbMV07XHRuc1swXT04LW5zWzBdOyBuc1sxXS09ODsgbnNbMl0tPTg7XG5cbiAgZm9yICh2YXIgeSA9IHRoaXMuaGVpZ2h0IC0gMTsgeSA+PSAwOyB5LS0pIHtcbiAgICB2YXIgbGluZSA9IHRoaXMuYm90dG9tX3VwID8geSA6IHRoaXMuaGVpZ2h0IC0gMSAtIHk7XG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcblxuICAgICAgdmFyIEIgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDE2TEUodGhpcy5wb3MpO1xuICAgICAgdGhpcy5wb3MrPTI7XG5cbiAgICAgIHZhciBibHVlID0gKEImdGhpcy5tYXNrQmx1ZSk8PG5zWzBdO1xuICAgICAgdmFyIGdyZWVuID0gKEImdGhpcy5tYXNrR3JlZW4pPj5uc1sxXTtcbiAgICAgIHZhciByZWQgPSAoQiZ0aGlzLm1hc2tSZWQpPj5uc1syXTtcblxuICAgICAgdmFyIGxvY2F0aW9uID0gbGluZSAqIHRoaXMud2lkdGggKiA0ICsgeCAqIDQ7XG5cbiAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbl0gPSAwO1xuICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMV0gPSBibHVlO1xuICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMl0gPSBncmVlbjtcbiAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDNdID0gcmVkO1xuICAgIH1cbiAgICAvL3NraXAgZXh0cmEgYnl0ZXNcbiAgICB0aGlzLnBvcyArPSBkaWZfdztcbiAgfVxufTtcblxuQm1wRGVjb2Rlci5wcm90b3R5cGUuYml0MjQgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgeSA9IHRoaXMuaGVpZ2h0IC0gMTsgeSA+PSAwOyB5LS0pIHtcbiAgICB2YXIgbGluZSA9IHRoaXMuYm90dG9tX3VwID8geSA6IHRoaXMuaGVpZ2h0IC0gMSAtIHlcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xuICAgICAgLy9MaXR0bGUgRW5kaWFuIHJnYlxuICAgICAgdmFyIGJsdWUgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICB2YXIgZ3JlZW4gPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICB2YXIgcmVkID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgdmFyIGxvY2F0aW9uID0gbGluZSAqIHRoaXMud2lkdGggKiA0ICsgeCAqIDQ7XG4gICAgICB0aGlzLmRhdGFbbG9jYXRpb25dID0gMDtcbiAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDFdID0gYmx1ZTtcbiAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDJdID0gZ3JlZW47XG4gICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAzXSA9IHJlZDtcbiAgICB9XG4gICAgLy9za2lwIGV4dHJhIGJ5dGVzXG4gICAgdGhpcy5wb3MgKz0gKHRoaXMud2lkdGggJSA0KTtcbiAgfVxuXG59O1xuXG4vKipcbiAqIGFkZCAzMmJpdCBkZWNvZGUgZnVuY1xuICogQGF1dGhvciBzb3Vib2tcbiAqL1xuQm1wRGVjb2Rlci5wcm90b3R5cGUuYml0MzIgPSBmdW5jdGlvbigpIHtcbiAgLy9CSV9CSVRGSUVMRFNcbiAgaWYodGhpcy5jb21wcmVzcyA9PSAzKXtcbiAgICB0aGlzLm1hc2tSZWQgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDMyTEUodGhpcy5wb3MpO1xuICAgIHRoaXMucG9zKz00O1xuICAgIHRoaXMubWFza0dyZWVuID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgICB0aGlzLnBvcys9NDtcbiAgICB0aGlzLm1hc2tCbHVlID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgICB0aGlzLnBvcys9NDtcbiAgICB0aGlzLm1hc2swID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgICB0aGlzLnBvcys9NDtcbiAgICAgIGZvciAodmFyIHkgPSB0aGlzLmhlaWdodCAtIDE7IHkgPj0gMDsgeS0tKSB7XG4gICAgICAgICAgdmFyIGxpbmUgPSB0aGlzLmJvdHRvbV91cCA/IHkgOiB0aGlzLmhlaWdodCAtIDEgLSB5O1xuICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XG4gICAgICAgICAgICAgIC8vTGl0dGxlIEVuZGlhbiByZ2JhXG4gICAgICAgICAgICAgIHZhciBhbHBoYSA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgICAgdmFyIGJsdWUgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICAgICAgICAgIHZhciBncmVlbiA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgICAgdmFyIHJlZCA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gbGluZSAqIHRoaXMud2lkdGggKiA0ICsgeCAqIDQ7XG4gICAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbl0gPSBhbHBoYTtcbiAgICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMV0gPSBibHVlO1xuICAgICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAyXSA9IGdyZWVuO1xuICAgICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAzXSA9IHJlZDtcbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgfWVsc2V7XG4gICAgICBmb3IgKHZhciB5ID0gdGhpcy5oZWlnaHQgLSAxOyB5ID49IDA7IHktLSkge1xuICAgICAgICAgIHZhciBsaW5lID0gdGhpcy5ib3R0b21fdXAgPyB5IDogdGhpcy5oZWlnaHQgLSAxIC0geTtcbiAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xuICAgICAgICAgICAgICAvL0xpdHRsZSBFbmRpYW4gYXJnYlxuICAgICAgICAgICAgICB2YXIgYmx1ZSA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgICAgdmFyIGdyZWVuID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgICAgICAgICB2YXIgcmVkID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgICAgICAgICB2YXIgYWxwaGEgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IGxpbmUgKiB0aGlzLndpZHRoICogNCArIHggKiA0O1xuICAgICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb25dID0gYWxwaGE7XG4gICAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDFdID0gYmx1ZTtcbiAgICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMl0gPSBncmVlbjtcbiAgICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgM10gPSByZWQ7XG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gIH1cblxuXG5cblxufTtcblxuQm1wRGVjb2Rlci5wcm90b3R5cGUuZ2V0RGF0YSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5kYXRhO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihibXBEYXRhKSB7XG4gIHZhciBkZWNvZGVyID0gbmV3IEJtcERlY29kZXIoYm1wRGF0YSk7XG4gIHJldHVybiBkZWNvZGVyO1xufTtcbiIsIi8qKlxuICogQGF1dGhvciBzaGFvemlsZWVcbiAqXG4gKiBCTVAgZm9ybWF0IGVuY29kZXIsZW5jb2RlIDI0Yml0IEJNUFxuICogTm90IHN1cHBvcnQgcXVhbGl0eSBjb21wcmVzc2lvblxuICpcbiAqL1xuXG5mdW5jdGlvbiBCbXBFbmNvZGVyKGltZ0RhdGEpe1xuXHR0aGlzLmJ1ZmZlciA9IGltZ0RhdGEuZGF0YTtcblx0dGhpcy53aWR0aCA9IGltZ0RhdGEud2lkdGg7XG5cdHRoaXMuaGVpZ2h0ID0gaW1nRGF0YS5oZWlnaHQ7XG5cdHRoaXMuZXh0cmFCeXRlcyA9IHRoaXMud2lkdGglNDtcblx0dGhpcy5yZ2JTaXplID0gdGhpcy5oZWlnaHQqKDMqdGhpcy53aWR0aCt0aGlzLmV4dHJhQnl0ZXMpO1xuXHR0aGlzLmhlYWRlckluZm9TaXplID0gNDA7XG5cblx0dGhpcy5kYXRhID0gW107XG5cdC8qKioqKioqKioqKioqKioqKipoZWFkZXIqKioqKioqKioqKioqKioqKioqKioqKi9cblx0dGhpcy5mbGFnID0gXCJCTVwiO1xuXHR0aGlzLnJlc2VydmVkID0gMDtcblx0dGhpcy5vZmZzZXQgPSA1NDtcblx0dGhpcy5maWxlU2l6ZSA9IHRoaXMucmdiU2l6ZSt0aGlzLm9mZnNldDtcblx0dGhpcy5wbGFuZXMgPSAxO1xuXHR0aGlzLmJpdFBQID0gMjQ7XG5cdHRoaXMuY29tcHJlc3MgPSAwO1xuXHR0aGlzLmhyID0gMDtcblx0dGhpcy52ciA9IDA7XG5cdHRoaXMuY29sb3JzID0gMDtcblx0dGhpcy5pbXBvcnRhbnRDb2xvcnMgPSAwO1xufVxuXG5CbXBFbmNvZGVyLnByb3RvdHlwZS5lbmNvZGUgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRlbXBCdWZmZXIgPSBuZXcgQnVmZmVyKHRoaXMub2Zmc2V0K3RoaXMucmdiU2l6ZSk7XG5cdHRoaXMucG9zID0gMDtcblx0dGVtcEJ1ZmZlci53cml0ZSh0aGlzLmZsYWcsdGhpcy5wb3MsMik7dGhpcy5wb3MrPTI7XG5cdHRlbXBCdWZmZXIud3JpdGVVSW50MzJMRSh0aGlzLmZpbGVTaXplLHRoaXMucG9zKTt0aGlzLnBvcys9NDtcblx0dGVtcEJ1ZmZlci53cml0ZVVJbnQzMkxFKHRoaXMucmVzZXJ2ZWQsdGhpcy5wb3MpO3RoaXMucG9zKz00O1xuXHR0ZW1wQnVmZmVyLndyaXRlVUludDMyTEUodGhpcy5vZmZzZXQsdGhpcy5wb3MpO3RoaXMucG9zKz00O1xuXG5cdHRlbXBCdWZmZXIud3JpdGVVSW50MzJMRSh0aGlzLmhlYWRlckluZm9TaXplLHRoaXMucG9zKTt0aGlzLnBvcys9NDtcblx0dGVtcEJ1ZmZlci53cml0ZVVJbnQzMkxFKHRoaXMud2lkdGgsdGhpcy5wb3MpO3RoaXMucG9zKz00O1xuXHR0ZW1wQnVmZmVyLndyaXRlSW50MzJMRSgtdGhpcy5oZWlnaHQsdGhpcy5wb3MpO3RoaXMucG9zKz00O1xuXHR0ZW1wQnVmZmVyLndyaXRlVUludDE2TEUodGhpcy5wbGFuZXMsdGhpcy5wb3MpO3RoaXMucG9zKz0yO1xuXHR0ZW1wQnVmZmVyLndyaXRlVUludDE2TEUodGhpcy5iaXRQUCx0aGlzLnBvcyk7dGhpcy5wb3MrPTI7XG5cdHRlbXBCdWZmZXIud3JpdGVVSW50MzJMRSh0aGlzLmNvbXByZXNzLHRoaXMucG9zKTt0aGlzLnBvcys9NDtcblx0dGVtcEJ1ZmZlci53cml0ZVVJbnQzMkxFKHRoaXMucmdiU2l6ZSx0aGlzLnBvcyk7dGhpcy5wb3MrPTQ7XG5cdHRlbXBCdWZmZXIud3JpdGVVSW50MzJMRSh0aGlzLmhyLHRoaXMucG9zKTt0aGlzLnBvcys9NDtcblx0dGVtcEJ1ZmZlci53cml0ZVVJbnQzMkxFKHRoaXMudnIsdGhpcy5wb3MpO3RoaXMucG9zKz00O1xuXHR0ZW1wQnVmZmVyLndyaXRlVUludDMyTEUodGhpcy5jb2xvcnMsdGhpcy5wb3MpO3RoaXMucG9zKz00O1xuXHR0ZW1wQnVmZmVyLndyaXRlVUludDMyTEUodGhpcy5pbXBvcnRhbnRDb2xvcnMsdGhpcy5wb3MpO3RoaXMucG9zKz00O1xuXG5cdHZhciBpPTA7XG5cdHZhciByb3dCeXRlcyA9IDMqdGhpcy53aWR0aCt0aGlzLmV4dHJhQnl0ZXM7XG5cblx0Zm9yICh2YXIgeSA9IDA7IHkgPHRoaXMuaGVpZ2h0OyB5Kyspe1xuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKXtcblx0XHRcdHZhciBwID0gdGhpcy5wb3MreSpyb3dCeXRlcyt4KjM7XG5cdFx0XHRpKys7Ly9hXG5cdFx0XHR0ZW1wQnVmZmVyW3BdPSB0aGlzLmJ1ZmZlcltpKytdOy8vYlxuXHRcdFx0dGVtcEJ1ZmZlcltwKzFdID0gdGhpcy5idWZmZXJbaSsrXTsvL2dcblx0XHRcdHRlbXBCdWZmZXJbcCsyXSAgPSB0aGlzLmJ1ZmZlcltpKytdOy8vclxuXHRcdH1cblx0XHRpZih0aGlzLmV4dHJhQnl0ZXM+MCl7XG5cdFx0XHR2YXIgZmlsbE9mZnNldCA9IHRoaXMucG9zK3kqcm93Qnl0ZXMrdGhpcy53aWR0aCozO1xuXHRcdFx0dGVtcEJ1ZmZlci5maWxsKDAsZmlsbE9mZnNldCxmaWxsT2Zmc2V0K3RoaXMuZXh0cmFCeXRlcyk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRlbXBCdWZmZXI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGltZ0RhdGEsIHF1YWxpdHkpIHtcbiAgaWYgKHR5cGVvZiBxdWFsaXR5ID09PSAndW5kZWZpbmVkJykgcXVhbGl0eSA9IDEwMDtcbiBcdHZhciBlbmNvZGVyID0gbmV3IEJtcEVuY29kZXIoaW1nRGF0YSk7XG5cdHZhciBkYXRhID0gZW5jb2Rlci5lbmNvZGUoKTtcbiAgcmV0dXJuIHtcbiAgICBkYXRhOiBkYXRhLFxuICAgIHdpZHRoOiBpbWdEYXRhLndpZHRoLFxuICAgIGhlaWdodDogaW1nRGF0YS5oZWlnaHRcbiAgfTtcbn07XG4iLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cbid1c2Ugc3RyaWN0J1xuXG5jb25zdCBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxuY29uc3QgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxuY29uc3QgY3VzdG9tSW5zcGVjdFN5bWJvbCA9XG4gICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2xbJ2ZvciddID09PSAnZnVuY3Rpb24nKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGRvdC1ub3RhdGlvblxuICAgID8gU3ltYm9sWydmb3InXSgnbm9kZWpzLnV0aWwuaW5zcGVjdC5jdXN0b20nKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGRvdC1ub3RhdGlvblxuICAgIDogbnVsbFxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gU2xvd0J1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5cbmNvbnN0IEtfTUFYX0xFTkdUSCA9IDB4N2ZmZmZmZmZcbmV4cG9ydHMua01heExlbmd0aCA9IEtfTUFYX0xFTkdUSFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBQcmludCB3YXJuaW5nIGFuZCByZWNvbW1lbmQgdXNpbmcgYGJ1ZmZlcmAgdjQueCB3aGljaCBoYXMgYW4gT2JqZWN0XG4gKiAgICAgICAgICAgICAgIGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBXZSByZXBvcnQgdGhhdCB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBpZiB0aGUgYXJlIG5vdCBzdWJjbGFzc2FibGVcbiAqIHVzaW5nIF9fcHJvdG9fXy4gRmlyZWZveCA0LTI5IGxhY2tzIHN1cHBvcnQgZm9yIGFkZGluZyBuZXcgcHJvcGVydGllcyB0byBgVWludDhBcnJheWBcbiAqIChTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOCkuIElFIDEwIGxhY2tzIHN1cHBvcnRcbiAqIGZvciBfX3Byb3RvX18gYW5kIGhhcyBhIGJ1Z2d5IHR5cGVkIGFycmF5IGltcGxlbWVudGF0aW9uLlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IHR5cGVkQXJyYXlTdXBwb3J0KClcblxuaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgY29uc29sZS5lcnJvciA9PT0gJ2Z1bmN0aW9uJykge1xuICBjb25zb2xlLmVycm9yKFxuICAgICdUaGlzIGJyb3dzZXIgbGFja3MgdHlwZWQgYXJyYXkgKFVpbnQ4QXJyYXkpIHN1cHBvcnQgd2hpY2ggaXMgcmVxdWlyZWQgYnkgJyArXG4gICAgJ2BidWZmZXJgIHY1LnguIFVzZSBgYnVmZmVyYCB2NC54IGlmIHlvdSByZXF1aXJlIG9sZCBicm93c2VyIHN1cHBvcnQuJ1xuICApXG59XG5cbmZ1bmN0aW9uIHR5cGVkQXJyYXlTdXBwb3J0ICgpIHtcbiAgLy8gQ2FuIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkP1xuICB0cnkge1xuICAgIGNvbnN0IGFyciA9IG5ldyBVaW50OEFycmF5KDEpXG4gICAgY29uc3QgcHJvdG8gPSB7IGZvbzogZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfSB9XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHByb3RvLCBVaW50OEFycmF5LnByb3RvdHlwZSlcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoYXJyLCBwcm90bylcbiAgICByZXR1cm4gYXJyLmZvbygpID09PSA0MlxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlci5wcm90b3R5cGUsICdwYXJlbnQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKHRoaXMpKSByZXR1cm4gdW5kZWZpbmVkXG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyXG4gIH1cbn0pXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIucHJvdG90eXBlLCAnb2Zmc2V0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0aGlzKSkgcmV0dXJuIHVuZGVmaW5lZFxuICAgIHJldHVybiB0aGlzLmJ5dGVPZmZzZXRcbiAgfVxufSlcblxuZnVuY3Rpb24gY3JlYXRlQnVmZmVyIChsZW5ndGgpIHtcbiAgaWYgKGxlbmd0aCA+IEtfTUFYX0xFTkdUSCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgXCInICsgbGVuZ3RoICsgJ1wiIGlzIGludmFsaWQgZm9yIG9wdGlvbiBcInNpemVcIicpXG4gIH1cbiAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2VcbiAgY29uc3QgYnVmID0gbmV3IFVpbnQ4QXJyYXkobGVuZ3RoKVxuICBPYmplY3Quc2V0UHJvdG90eXBlT2YoYnVmLCBCdWZmZXIucHJvdG90eXBlKVxuICByZXR1cm4gYnVmXG59XG5cbi8qKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBoYXZlIHRoZWlyXG4gKiBwcm90b3R5cGUgY2hhbmdlZCB0byBgQnVmZmVyLnByb3RvdHlwZWAuIEZ1cnRoZXJtb3JlLCBgQnVmZmVyYCBpcyBhIHN1YmNsYXNzIG9mXG4gKiBgVWludDhBcnJheWAsIHNvIHRoZSByZXR1cm5lZCBpbnN0YW5jZXMgd2lsbCBoYXZlIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBtZXRob2RzXG4gKiBhbmQgdGhlIGBVaW50OEFycmF5YCBtZXRob2RzLiBTcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdFxuICogcmV0dXJucyBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBUaGUgYFVpbnQ4QXJyYXlgIHByb3RvdHlwZSByZW1haW5zIHVubW9kaWZpZWQuXG4gKi9cblxuZnVuY3Rpb24gQnVmZmVyIChhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICAvLyBDb21tb24gY2FzZS5cbiAgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZ09yT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ1RoZSBcInN0cmluZ1wiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuIFJlY2VpdmVkIHR5cGUgbnVtYmVyJ1xuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gYWxsb2NVbnNhZmUoYXJnKVxuICB9XG4gIHJldHVybiBmcm9tKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyIC8vIG5vdCB1c2VkIGJ5IHRoaXMgaW1wbGVtZW50YXRpb25cblxuZnVuY3Rpb24gZnJvbSAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmcm9tU3RyaW5nKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0KVxuICB9XG5cbiAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5Vmlldyh2YWx1ZSlcbiAgfVxuXG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdUaGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCAnICtcbiAgICAgICdvciBBcnJheS1saWtlIE9iamVjdC4gUmVjZWl2ZWQgdHlwZSAnICsgKHR5cGVvZiB2YWx1ZSlcbiAgICApXG4gIH1cblxuICBpZiAoaXNJbnN0YW5jZSh2YWx1ZSwgQXJyYXlCdWZmZXIpIHx8XG4gICAgICAodmFsdWUgJiYgaXNJbnN0YW5jZSh2YWx1ZS5idWZmZXIsIEFycmF5QnVmZmVyKSkpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAodHlwZW9mIFNoYXJlZEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgKGlzSW5zdGFuY2UodmFsdWUsIFNoYXJlZEFycmF5QnVmZmVyKSB8fFxuICAgICAgKHZhbHVlICYmIGlzSW5zdGFuY2UodmFsdWUuYnVmZmVyLCBTaGFyZWRBcnJheUJ1ZmZlcikpKSkge1xuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdUaGUgXCJ2YWx1ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG9mIHR5cGUgbnVtYmVyLiBSZWNlaXZlZCB0eXBlIG51bWJlcidcbiAgICApXG4gIH1cblxuICBjb25zdCB2YWx1ZU9mID0gdmFsdWUudmFsdWVPZiAmJiB2YWx1ZS52YWx1ZU9mKClcbiAgaWYgKHZhbHVlT2YgIT0gbnVsbCAmJiB2YWx1ZU9mICE9PSB2YWx1ZSkge1xuICAgIHJldHVybiBCdWZmZXIuZnJvbSh2YWx1ZU9mLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBjb25zdCBiID0gZnJvbU9iamVjdCh2YWx1ZSlcbiAgaWYgKGIpIHJldHVybiBiXG5cbiAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1ByaW1pdGl2ZSAhPSBudWxsICYmXG4gICAgICB0eXBlb2YgdmFsdWVbU3ltYm9sLnRvUHJpbWl0aXZlXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBCdWZmZXIuZnJvbSh2YWx1ZVtTeW1ib2wudG9QcmltaXRpdmVdKCdzdHJpbmcnKSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAnVGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgb25lIG9mIHR5cGUgc3RyaW5nLCBCdWZmZXIsIEFycmF5QnVmZmVyLCBBcnJheSwgJyArXG4gICAgJ29yIEFycmF5LWxpa2UgT2JqZWN0LiBSZWNlaXZlZCB0eXBlICcgKyAodHlwZW9mIHZhbHVlKVxuICApXG59XG5cbi8qKlxuICogRnVuY3Rpb25hbGx5IGVxdWl2YWxlbnQgdG8gQnVmZmVyKGFyZywgZW5jb2RpbmcpIGJ1dCB0aHJvd3MgYSBUeXBlRXJyb3JcbiAqIGlmIHZhbHVlIGlzIGEgbnVtYmVyLlxuICogQnVmZmVyLmZyb20oc3RyWywgZW5jb2RpbmddKVxuICogQnVmZmVyLmZyb20oYXJyYXkpXG4gKiBCdWZmZXIuZnJvbShidWZmZXIpXG4gKiBCdWZmZXIuZnJvbShhcnJheUJ1ZmZlclssIGJ5dGVPZmZzZXRbLCBsZW5ndGhdXSlcbiAqKi9cbkJ1ZmZlci5mcm9tID0gZnVuY3Rpb24gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGZyb20odmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuLy8gTm90ZTogQ2hhbmdlIHByb3RvdHlwZSAqYWZ0ZXIqIEJ1ZmZlci5mcm9tIGlzIGRlZmluZWQgdG8gd29ya2Fyb3VuZCBDaHJvbWUgYnVnOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvcHVsbC8xNDhcbk9iamVjdC5zZXRQcm90b3R5cGVPZihCdWZmZXIucHJvdG90eXBlLCBVaW50OEFycmF5LnByb3RvdHlwZSlcbk9iamVjdC5zZXRQcm90b3R5cGVPZihCdWZmZXIsIFVpbnQ4QXJyYXkpXG5cbmZ1bmN0aW9uIGFzc2VydFNpemUgKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBudW1iZXInKVxuICB9IGVsc2UgaWYgKHNpemUgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSBcIicgKyBzaXplICsgJ1wiIGlzIGludmFsaWQgZm9yIG9wdGlvbiBcInNpemVcIicpXG4gIH1cbn1cblxuZnVuY3Rpb24gYWxsb2MgKHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgaWYgKHNpemUgPD0gMCkge1xuICAgIHJldHVybiBjcmVhdGVCdWZmZXIoc2l6ZSlcbiAgfVxuICBpZiAoZmlsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT25seSBwYXkgYXR0ZW50aW9uIHRvIGVuY29kaW5nIGlmIGl0J3MgYSBzdHJpbmcuIFRoaXNcbiAgICAvLyBwcmV2ZW50cyBhY2NpZGVudGFsbHkgc2VuZGluZyBpbiBhIG51bWJlciB0aGF0IHdvdWxkXG4gICAgLy8gYmUgaW50ZXJwcmV0ZWQgYXMgYSBzdGFydCBvZmZzZXQuXG4gICAgcmV0dXJuIHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZydcbiAgICAgID8gY3JlYXRlQnVmZmVyKHNpemUpLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgICA6IGNyZWF0ZUJ1ZmZlcihzaXplKS5maWxsKGZpbGwpXG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqIGFsbG9jKHNpemVbLCBmaWxsWywgZW5jb2RpbmddXSlcbiAqKi9cbkJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICByZXR1cm4gYWxsb2Moc2l6ZSwgZmlsbCwgZW5jb2RpbmcpXG59XG5cbmZ1bmN0aW9uIGFsbG9jVW5zYWZlIChzaXplKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplIDwgMCA/IDAgOiBjaGVja2VkKHNpemUpIHwgMClcbn1cblxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIEJ1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShzaXplKVxufVxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIFNsb3dCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShzaXplKVxufVxuXG5mdW5jdGlvbiBmcm9tU3RyaW5nIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnIHx8IGVuY29kaW5nID09PSAnJykge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gIH1cblxuICBpZiAoIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgfVxuXG4gIGNvbnN0IGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIGxldCBidWYgPSBjcmVhdGVCdWZmZXIobGVuZ3RoKVxuXG4gIGNvbnN0IGFjdHVhbCA9IGJ1Zi53cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuXG4gIGlmIChhY3R1YWwgIT09IGxlbmd0aCkge1xuICAgIC8vIFdyaXRpbmcgYSBoZXggc3RyaW5nLCBmb3IgZXhhbXBsZSwgdGhhdCBjb250YWlucyBpbnZhbGlkIGNoYXJhY3RlcnMgd2lsbFxuICAgIC8vIGNhdXNlIGV2ZXJ5dGhpbmcgYWZ0ZXIgdGhlIGZpcnN0IGludmFsaWQgY2hhcmFjdGVyIHRvIGJlIGlnbm9yZWQuIChlLmcuXG4gICAgLy8gJ2FieHhjZCcgd2lsbCBiZSB0cmVhdGVkIGFzICdhYicpXG4gICAgYnVmID0gYnVmLnNsaWNlKDAsIGFjdHVhbClcbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5TGlrZSAoYXJyYXkpIHtcbiAgY29uc3QgbGVuZ3RoID0gYXJyYXkubGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIGNvbnN0IGJ1ZiA9IGNyZWF0ZUJ1ZmZlcihsZW5ndGgpXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICBidWZbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5VmlldyAoYXJyYXlWaWV3KSB7XG4gIGlmIChpc0luc3RhbmNlKGFycmF5VmlldywgVWludDhBcnJheSkpIHtcbiAgICBjb25zdCBjb3B5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlWaWV3KVxuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIoY29weS5idWZmZXIsIGNvcHkuYnl0ZU9mZnNldCwgY29weS5ieXRlTGVuZ3RoKVxuICB9XG4gIHJldHVybiBmcm9tQXJyYXlMaWtlKGFycmF5Vmlldylcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyIChhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmIChieXRlT2Zmc2V0IDwgMCB8fCBhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcIm9mZnNldFwiIGlzIG91dHNpZGUgb2YgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQgKyAobGVuZ3RoIHx8IDApKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wibGVuZ3RoXCIgaXMgb3V0c2lkZSBvZiBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGxldCBidWZcbiAgaWYgKGJ5dGVPZmZzZXQgPT09IHVuZGVmaW5lZCAmJiBsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5KVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQpXG4gIH0gZWxzZSB7XG4gICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlXG4gIE9iamVjdC5zZXRQcm90b3R5cGVPZihidWYsIEJ1ZmZlci5wcm90b3R5cGUpXG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBmcm9tT2JqZWN0IChvYmopIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihvYmopKSB7XG4gICAgY29uc3QgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICBjb25zdCBidWYgPSBjcmVhdGVCdWZmZXIobGVuKVxuXG4gICAgaWYgKGJ1Zi5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBidWZcbiAgICB9XG5cbiAgICBvYmouY29weShidWYsIDAsIDAsIGxlbilcbiAgICByZXR1cm4gYnVmXG4gIH1cblxuICBpZiAob2JqLmxlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHR5cGVvZiBvYmoubGVuZ3RoICE9PSAnbnVtYmVyJyB8fCBudW1iZXJJc05hTihvYmoubGVuZ3RoKSkge1xuICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcigwKVxuICAgIH1cbiAgICByZXR1cm4gZnJvbUFycmF5TGlrZShvYmopXG4gIH1cblxuICBpZiAob2JqLnR5cGUgPT09ICdCdWZmZXInICYmIEFycmF5LmlzQXJyYXkob2JqLmRhdGEpKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUxpa2Uob2JqLmRhdGEpXG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tlZCAobGVuZ3RoKSB7XG4gIC8vIE5vdGU6IGNhbm5vdCB1c2UgYGxlbmd0aCA8IEtfTUFYX0xFTkdUSGAgaGVyZSBiZWNhdXNlIHRoYXQgZmFpbHMgd2hlblxuICAvLyBsZW5ndGggaXMgTmFOICh3aGljaCBpcyBvdGhlcndpc2UgY29lcmNlZCB0byB6ZXJvLilcbiAgaWYgKGxlbmd0aCA+PSBLX01BWF9MRU5HVEgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAnc2l6ZTogMHgnICsgS19NQVhfTEVOR1RILnRvU3RyaW5nKDE2KSArICcgYnl0ZXMnKVxuICB9XG4gIHJldHVybiBsZW5ndGggfCAwXG59XG5cbmZ1bmN0aW9uIFNsb3dCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAoK2xlbmd0aCAhPSBsZW5ndGgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbiAgICBsZW5ndGggPSAwXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlci5hbGxvYygrbGVuZ3RoKVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiBpc0J1ZmZlciAoYikge1xuICByZXR1cm4gYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyID09PSB0cnVlICYmXG4gICAgYiAhPT0gQnVmZmVyLnByb3RvdHlwZSAvLyBzbyBCdWZmZXIuaXNCdWZmZXIoQnVmZmVyLnByb3RvdHlwZSkgd2lsbCBiZSBmYWxzZVxufVxuXG5CdWZmZXIuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKGEsIGIpIHtcbiAgaWYgKGlzSW5zdGFuY2UoYSwgVWludDhBcnJheSkpIGEgPSBCdWZmZXIuZnJvbShhLCBhLm9mZnNldCwgYS5ieXRlTGVuZ3RoKVxuICBpZiAoaXNJbnN0YW5jZShiLCBVaW50OEFycmF5KSkgYiA9IEJ1ZmZlci5mcm9tKGIsIGIub2Zmc2V0LCBiLmJ5dGVMZW5ndGgpXG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGEpIHx8ICFCdWZmZXIuaXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ1RoZSBcImJ1ZjFcIiwgXCJidWYyXCIgYXJndW1lbnRzIG11c3QgYmUgb25lIG9mIHR5cGUgQnVmZmVyIG9yIFVpbnQ4QXJyYXknXG4gICAgKVxuICB9XG5cbiAgaWYgKGEgPT09IGIpIHJldHVybiAwXG5cbiAgbGV0IHggPSBhLmxlbmd0aFxuICBsZXQgeSA9IGIubGVuZ3RoXG5cbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IE1hdGgubWluKHgsIHkpOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgeCA9IGFbaV1cbiAgICAgIHkgPSBiW2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiBpc0VuY29kaW5nIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdsYXRpbjEnOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIGNvbmNhdCAobGlzdCwgbGVuZ3RoKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShsaXN0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gIH1cblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gQnVmZmVyLmFsbG9jKDApXG4gIH1cblxuICBsZXQgaVxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBsZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShsZW5ndGgpXG4gIGxldCBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgbGV0IGJ1ZiA9IGxpc3RbaV1cbiAgICBpZiAoaXNJbnN0YW5jZShidWYsIFVpbnQ4QXJyYXkpKSB7XG4gICAgICBpZiAocG9zICsgYnVmLmxlbmd0aCA+IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgYnVmID0gQnVmZmVyLmZyb20oYnVmKVxuICAgICAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFVpbnQ4QXJyYXkucHJvdG90eXBlLnNldC5jYWxsKFxuICAgICAgICAgIGJ1ZmZlcixcbiAgICAgICAgICBidWYsXG4gICAgICAgICAgcG9zXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmLmNvcHkoYnVmZmVyLCBwb3MpXG4gICAgfVxuICAgIHBvcyArPSBidWYubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZmZlclxufVxuXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIoc3RyaW5nKSkge1xuICAgIHJldHVybiBzdHJpbmcubGVuZ3RoXG4gIH1cbiAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhzdHJpbmcpIHx8IGlzSW5zdGFuY2Uoc3RyaW5nLCBBcnJheUJ1ZmZlcikpIHtcbiAgICByZXR1cm4gc3RyaW5nLmJ5dGVMZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ1RoZSBcInN0cmluZ1wiIGFyZ3VtZW50IG11c3QgYmUgb25lIG9mIHR5cGUgc3RyaW5nLCBCdWZmZXIsIG9yIEFycmF5QnVmZmVyLiAnICtcbiAgICAgICdSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2Ygc3RyaW5nXG4gICAgKVxuICB9XG5cbiAgY29uc3QgbGVuID0gc3RyaW5nLmxlbmd0aFxuICBjb25zdCBtdXN0TWF0Y2ggPSAoYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdID09PSB0cnVlKVxuICBpZiAoIW11c3RNYXRjaCAmJiBsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIGxldCBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxlblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIGxlbiAqIDJcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBsZW4gPj4+IDFcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHtcbiAgICAgICAgICByZXR1cm4gbXVzdE1hdGNoID8gLTEgOiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aCAvLyBhc3N1bWUgdXRmOFxuICAgICAgICB9XG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcblxuZnVuY3Rpb24gc2xvd1RvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICBsZXQgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIC8vIE5vIG5lZWQgdG8gdmVyaWZ5IHRoYXQgXCJ0aGlzLmxlbmd0aCA8PSBNQVhfVUlOVDMyXCIgc2luY2UgaXQncyBhIHJlYWQtb25seVxuICAvLyBwcm9wZXJ0eSBvZiBhIHR5cGVkIGFycmF5LlxuXG4gIC8vIFRoaXMgYmVoYXZlcyBuZWl0aGVyIGxpa2UgU3RyaW5nIG5vciBVaW50OEFycmF5IGluIHRoYXQgd2Ugc2V0IHN0YXJ0L2VuZFxuICAvLyB0byB0aGVpciB1cHBlci9sb3dlciBib3VuZHMgaWYgdGhlIHZhbHVlIHBhc3NlZCBpcyBvdXQgb2YgcmFuZ2UuXG4gIC8vIHVuZGVmaW5lZCBpcyBoYW5kbGVkIHNwZWNpYWxseSBhcyBwZXIgRUNNQS0yNjIgNnRoIEVkaXRpb24sXG4gIC8vIFNlY3Rpb24gMTMuMy4zLjcgUnVudGltZSBTZW1hbnRpY3M6IEtleWVkQmluZGluZ0luaXRpYWxpemF0aW9uLlxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCB8fCBzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICAvLyBSZXR1cm4gZWFybHkgaWYgc3RhcnQgPiB0aGlzLmxlbmd0aC4gRG9uZSBoZXJlIHRvIHByZXZlbnQgcG90ZW50aWFsIHVpbnQzMlxuICAvLyBjb2VyY2lvbiBmYWlsIGJlbG93LlxuICBpZiAoc3RhcnQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbmQgPD0gMCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgLy8gRm9yY2UgY29lcmNpb24gdG8gdWludDMyLiBUaGlzIHdpbGwgYWxzbyBjb2VyY2UgZmFsc2V5L05hTiB2YWx1ZXMgdG8gMC5cbiAgZW5kID4+Pj0gMFxuICBzdGFydCA+Pj49IDBcblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gVGhpcyBwcm9wZXJ0eSBpcyB1c2VkIGJ5IGBCdWZmZXIuaXNCdWZmZXJgIChhbmQgdGhlIGBpcy1idWZmZXJgIG5wbSBwYWNrYWdlKVxuLy8gdG8gZGV0ZWN0IGEgQnVmZmVyIGluc3RhbmNlLiBJdCdzIG5vdCBwb3NzaWJsZSB0byB1c2UgYGluc3RhbmNlb2YgQnVmZmVyYFxuLy8gcmVsaWFibHkgaW4gYSBicm93c2VyaWZ5IGNvbnRleHQgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBtdWx0aXBsZSBkaWZmZXJlbnRcbi8vIGNvcGllcyBvZiB0aGUgJ2J1ZmZlcicgcGFja2FnZSBpbiB1c2UuIFRoaXMgbWV0aG9kIHdvcmtzIGV2ZW4gZm9yIEJ1ZmZlclxuLy8gaW5zdGFuY2VzIHRoYXQgd2VyZSBjcmVhdGVkIGZyb20gYW5vdGhlciBjb3B5IG9mIHRoZSBgYnVmZmVyYCBwYWNrYWdlLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9pc3N1ZXMvMTU0XG5CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblxuZnVuY3Rpb24gc3dhcCAoYiwgbiwgbSkge1xuICBjb25zdCBpID0gYltuXVxuICBiW25dID0gYlttXVxuICBiW21dID0gaVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAxNiA9IGZ1bmN0aW9uIHN3YXAxNiAoKSB7XG4gIGNvbnN0IGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSAyICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAxNi1iaXRzJylcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMSlcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAzMiA9IGZ1bmN0aW9uIHN3YXAzMiAoKSB7XG4gIGNvbnN0IGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA0ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAzMi1iaXRzJylcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgMilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXA2NCA9IGZ1bmN0aW9uIHN3YXA2NCAoKSB7XG4gIGNvbnN0IGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA4ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA2NC1iaXRzJylcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSA4KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgNylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgNilcbiAgICBzd2FwKHRoaXMsIGkgKyAyLCBpICsgNSlcbiAgICBzd2FwKHRoaXMsIGkgKyAzLCBpICsgNClcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0xvY2FsZVN0cmluZyA9IEJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmdcblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICBpZiAodGhpcyA9PT0gYikgcmV0dXJuIHRydWVcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpID09PSAwXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QgKCkge1xuICBsZXQgc3RyID0gJydcbiAgY29uc3QgbWF4ID0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFU1xuICBzdHIgPSB0aGlzLnRvU3RyaW5nKCdoZXgnLCAwLCBtYXgpLnJlcGxhY2UoLyguezJ9KS9nLCAnJDEgJykudHJpbSgpXG4gIGlmICh0aGlzLmxlbmd0aCA+IG1heCkgc3RyICs9ICcgLi4uICdcbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cbmlmIChjdXN0b21JbnNwZWN0U3ltYm9sKSB7XG4gIEJ1ZmZlci5wcm90b3R5cGVbY3VzdG9tSW5zcGVjdFN5bWJvbF0gPSBCdWZmZXIucHJvdG90eXBlLmluc3BlY3Rcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKGlzSW5zdGFuY2UodGFyZ2V0LCBVaW50OEFycmF5KSkge1xuICAgIHRhcmdldCA9IEJ1ZmZlci5mcm9tKHRhcmdldCwgdGFyZ2V0Lm9mZnNldCwgdGFyZ2V0LmJ5dGVMZW5ndGgpXG4gIH1cbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnVGhlIFwidGFyZ2V0XCIgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBCdWZmZXIgb3IgVWludDhBcnJheS4gJyArXG4gICAgICAnUmVjZWl2ZWQgdHlwZSAnICsgKHR5cGVvZiB0YXJnZXQpXG4gICAgKVxuICB9XG5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSB0YXJnZXQgPyB0YXJnZXQubGVuZ3RoIDogMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNTdGFydCA9IDBcbiAgfVxuICBpZiAodGhpc0VuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc0VuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IGVuZCA+IHRhcmdldC5sZW5ndGggfHwgdGhpc1N0YXJ0IDwgMCB8fCB0aGlzRW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCAmJiBzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCkge1xuICAgIHJldHVybiAtMVxuICB9XG4gIGlmIChzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgc3RhcnQgPj4+PSAwXG4gIGVuZCA+Pj49IDBcbiAgdGhpc1N0YXJ0ID4+Pj0gMFxuICB0aGlzRW5kID4+Pj0gMFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQpIHJldHVybiAwXG5cbiAgbGV0IHggPSB0aGlzRW5kIC0gdGhpc1N0YXJ0XG4gIGxldCB5ID0gZW5kIC0gc3RhcnRcbiAgY29uc3QgbGVuID0gTWF0aC5taW4oeCwgeSlcblxuICBjb25zdCB0aGlzQ29weSA9IHRoaXMuc2xpY2UodGhpc1N0YXJ0LCB0aGlzRW5kKVxuICBjb25zdCB0YXJnZXRDb3B5ID0gdGFyZ2V0LnNsaWNlKHN0YXJ0LCBlbmQpXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIGlmICh0aGlzQ29weVtpXSAhPT0gdGFyZ2V0Q29weVtpXSkge1xuICAgICAgeCA9IHRoaXNDb3B5W2ldXG4gICAgICB5ID0gdGFyZ2V0Q29weVtpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbi8vIEZpbmRzIGVpdGhlciB0aGUgZmlyc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0ID49IGBieXRlT2Zmc2V0YCxcbi8vIE9SIHRoZSBsYXN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA8PSBgYnl0ZU9mZnNldGAuXG4vL1xuLy8gQXJndW1lbnRzOlxuLy8gLSBidWZmZXIgLSBhIEJ1ZmZlciB0byBzZWFyY2hcbi8vIC0gdmFsIC0gYSBzdHJpbmcsIEJ1ZmZlciwgb3IgbnVtYmVyXG4vLyAtIGJ5dGVPZmZzZXQgLSBhbiBpbmRleCBpbnRvIGBidWZmZXJgOyB3aWxsIGJlIGNsYW1wZWQgdG8gYW4gaW50MzJcbi8vIC0gZW5jb2RpbmcgLSBhbiBvcHRpb25hbCBlbmNvZGluZywgcmVsZXZhbnQgaXMgdmFsIGlzIGEgc3RyaW5nXG4vLyAtIGRpciAtIHRydWUgZm9yIGluZGV4T2YsIGZhbHNlIGZvciBsYXN0SW5kZXhPZlxuZnVuY3Rpb24gYmlkaXJlY3Rpb25hbEluZGV4T2YgKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIC8vIEVtcHR5IGJ1ZmZlciBtZWFucyBubyBtYXRjaFxuICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xXG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXRcbiAgaWYgKHR5cGVvZiBieXRlT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gYnl0ZU9mZnNldFxuICAgIGJ5dGVPZmZzZXQgPSAwXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA+IDB4N2ZmZmZmZmYpIHtcbiAgICBieXRlT2Zmc2V0ID0gMHg3ZmZmZmZmZlxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAtMHg4MDAwMDAwMCkge1xuICAgIGJ5dGVPZmZzZXQgPSAtMHg4MDAwMDAwMFxuICB9XG4gIGJ5dGVPZmZzZXQgPSArYnl0ZU9mZnNldCAvLyBDb2VyY2UgdG8gTnVtYmVyLlxuICBpZiAobnVtYmVySXNOYU4oYnl0ZU9mZnNldCkpIHtcbiAgICAvLyBieXRlT2Zmc2V0OiBpdCBpdCdzIHVuZGVmaW5lZCwgbnVsbCwgTmFOLCBcImZvb1wiLCBldGMsIHNlYXJjaCB3aG9sZSBidWZmZXJcbiAgICBieXRlT2Zmc2V0ID0gZGlyID8gMCA6IChidWZmZXIubGVuZ3RoIC0gMSlcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0OiBuZWdhdGl2ZSBvZmZzZXRzIHN0YXJ0IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyXG4gIGlmIChieXRlT2Zmc2V0IDwgMCkgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggKyBieXRlT2Zmc2V0XG4gIGlmIChieXRlT2Zmc2V0ID49IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICBpZiAoZGlyKSByZXR1cm4gLTFcbiAgICBlbHNlIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoIC0gMVxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAwKSB7XG4gICAgaWYgKGRpcikgYnl0ZU9mZnNldCA9IDBcbiAgICBlbHNlIHJldHVybiAtMVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIHZhbFxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWwgPSBCdWZmZXIuZnJvbSh2YWwsIGVuY29kaW5nKVxuICB9XG5cbiAgLy8gRmluYWxseSwgc2VhcmNoIGVpdGhlciBpbmRleE9mIChpZiBkaXIgaXMgdHJ1ZSkgb3IgbGFzdEluZGV4T2ZcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcih2YWwpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcvYnVmZmVyIGFsd2F5cyBmYWlsc1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDB4RkYgLy8gU2VhcmNoIGZvciBhIGJ5dGUgdmFsdWUgWzAtMjU1XVxuICAgIGlmICh0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGRpcikge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCBbdmFsXSwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlcicpXG59XG5cbmZ1bmN0aW9uIGFycmF5SW5kZXhPZiAoYXJyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgbGV0IGluZGV4U2l6ZSA9IDFcbiAgbGV0IGFyckxlbmd0aCA9IGFyci5sZW5ndGhcbiAgbGV0IHZhbExlbmd0aCA9IHZhbC5sZW5ndGhcblxuICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKGVuY29kaW5nID09PSAndWNzMicgfHwgZW5jb2RpbmcgPT09ICd1Y3MtMicgfHxcbiAgICAgICAgZW5jb2RpbmcgPT09ICd1dGYxNmxlJyB8fCBlbmNvZGluZyA9PT0gJ3V0Zi0xNmxlJykge1xuICAgICAgaWYgKGFyci5sZW5ndGggPCAyIHx8IHZhbC5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiAtMVxuICAgICAgfVxuICAgICAgaW5kZXhTaXplID0gMlxuICAgICAgYXJyTGVuZ3RoIC89IDJcbiAgICAgIHZhbExlbmd0aCAvPSAyXG4gICAgICBieXRlT2Zmc2V0IC89IDJcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWFkIChidWYsIGkpIHtcbiAgICBpZiAoaW5kZXhTaXplID09PSAxKSB7XG4gICAgICByZXR1cm4gYnVmW2ldXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBidWYucmVhZFVJbnQxNkJFKGkgKiBpbmRleFNpemUpXG4gICAgfVxuICB9XG5cbiAgbGV0IGlcbiAgaWYgKGRpcikge1xuICAgIGxldCBmb3VuZEluZGV4ID0gLTFcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpIDwgYXJyTGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZWFkKGFyciwgaSkgPT09IHJlYWQodmFsLCBmb3VuZEluZGV4ID09PSAtMSA/IDAgOiBpIC0gZm91bmRJbmRleCkpIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSBmb3VuZEluZGV4ID0gaVxuICAgICAgICBpZiAoaSAtIGZvdW5kSW5kZXggKyAxID09PSB2YWxMZW5ndGgpIHJldHVybiBmb3VuZEluZGV4ICogaW5kZXhTaXplXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZm91bmRJbmRleCAhPT0gLTEpIGkgLT0gaSAtIGZvdW5kSW5kZXhcbiAgICAgICAgZm91bmRJbmRleCA9IC0xXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChieXRlT2Zmc2V0ICsgdmFsTGVuZ3RoID4gYXJyTGVuZ3RoKSBieXRlT2Zmc2V0ID0gYXJyTGVuZ3RoIC0gdmFsTGVuZ3RoXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGxldCBmb3VuZCA9IHRydWVcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdmFsTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHJlYWQoYXJyLCBpICsgaikgIT09IHJlYWQodmFsLCBqKSkge1xuICAgICAgICAgIGZvdW5kID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm91bmQpIHJldHVybiBpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gdGhpcy5pbmRleE9mKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpICE9PSAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiBpbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCB0cnVlKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gbGFzdEluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGZhbHNlKVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgY29uc3QgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGxldCBpXG4gIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBpZiAobnVtYmVySXNOYU4ocGFyc2VkKSkgcmV0dXJuIGlcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiB1Y3MyV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gd3JpdGUgKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcpXG4gIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgb2Zmc2V0WywgbGVuZ3RoXVssIGVuY29kaW5nXSlcbiAgfSBlbHNlIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aCA+Pj4gMFxuICAgICAgaWYgKGVuY29kaW5nID09PSB1bmRlZmluZWQpIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0J1ZmZlci53cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXRbLCBsZW5ndGhdKSBpcyBubyBsb25nZXIgc3VwcG9ydGVkJ1xuICAgIClcbiAgfVxuXG4gIGNvbnN0IHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCB8fCBsZW5ndGggPiByZW1haW5pbmcpIGxlbmd0aCA9IHJlbWFpbmluZ1xuXG4gIGlmICgoc3RyaW5nLmxlbmd0aCA+IDAgJiYgKGxlbmd0aCA8IDAgfHwgb2Zmc2V0IDwgMCkpIHx8IG9mZnNldCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gd3JpdGUgb3V0c2lkZSBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgbGV0IGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGFzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgLy8gV2FybmluZzogbWF4TGVuZ3RoIG5vdCB0YWtlbiBpbnRvIGFjY291bnQgaW4gYmFzZTY0V3JpdGVcbiAgICAgICAgcmV0dXJuIGJhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1Y3MyV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG5mdW5jdGlvbiBiYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuICBjb25zdCByZXMgPSBbXVxuXG4gIGxldCBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICBjb25zdCBmaXJzdEJ5dGUgPSBidWZbaV1cbiAgICBsZXQgY29kZVBvaW50ID0gbnVsbFxuICAgIGxldCBieXRlc1BlclNlcXVlbmNlID0gKGZpcnN0Qnl0ZSA+IDB4RUYpXG4gICAgICA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpXG4gICAgICAgICAgPyAzXG4gICAgICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRilcbiAgICAgICAgICAgICAgPyAyXG4gICAgICAgICAgICAgIDogMVxuXG4gICAgaWYgKGkgKyBieXRlc1BlclNlcXVlbmNlIDw9IGVuZCkge1xuICAgICAgbGV0IHNlY29uZEJ5dGUsIHRoaXJkQnl0ZSwgZm91cnRoQnl0ZSwgdGVtcENvZGVQb2ludFxuXG4gICAgICBzd2l0Y2ggKGJ5dGVzUGVyU2VxdWVuY2UpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGlmIChmaXJzdEJ5dGUgPCAweDgwKSB7XG4gICAgICAgICAgICBjb2RlUG9pbnQgPSBmaXJzdEJ5dGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHgxRikgPDwgMHg2IHwgKHNlY29uZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4QyB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKHRoaXJkQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0ZGICYmICh0ZW1wQ29kZVBvaW50IDwgMHhEODAwIHx8IHRlbXBDb2RlUG9pbnQgPiAweERGRkYpKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGZvdXJ0aEJ5dGUgPSBidWZbaSArIDNdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwICYmIChmb3VydGhCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweDEyIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweEMgfCAodGhpcmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKGZvdXJ0aEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweEZGRkYgJiYgdGVtcENvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvZGVQb2ludCA9PT0gbnVsbCkge1xuICAgICAgLy8gd2UgZGlkIG5vdCBnZW5lcmF0ZSBhIHZhbGlkIGNvZGVQb2ludCBzbyBpbnNlcnQgYVxuICAgICAgLy8gcmVwbGFjZW1lbnQgY2hhciAoVStGRkZEKSBhbmQgYWR2YW5jZSBvbmx5IDEgYnl0ZVxuICAgICAgY29kZVBvaW50ID0gMHhGRkZEXG4gICAgICBieXRlc1BlclNlcXVlbmNlID0gMVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50ID4gMHhGRkZGKSB7XG4gICAgICAvLyBlbmNvZGUgdG8gdXRmMTYgKHN1cnJvZ2F0ZSBwYWlyIGRhbmNlKVxuICAgICAgY29kZVBvaW50IC09IDB4MTAwMDBcbiAgICAgIHJlcy5wdXNoKGNvZGVQb2ludCA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMClcbiAgICAgIGNvZGVQb2ludCA9IDB4REMwMCB8IGNvZGVQb2ludCAmIDB4M0ZGXG4gICAgfVxuXG4gICAgcmVzLnB1c2goY29kZVBvaW50KVxuICAgIGkgKz0gYnl0ZXNQZXJTZXF1ZW5jZVxuICB9XG5cbiAgcmV0dXJuIGRlY29kZUNvZGVQb2ludHNBcnJheShyZXMpXG59XG5cbi8vIEJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIyNzQ3MjcyLzY4MDc0MiwgdGhlIGJyb3dzZXIgd2l0aFxuLy8gdGhlIGxvd2VzdCBsaW1pdCBpcyBDaHJvbWUsIHdpdGggMHgxMDAwMCBhcmdzLlxuLy8gV2UgZ28gMSBtYWduaXR1ZGUgbGVzcywgZm9yIHNhZmV0eVxuY29uc3QgTUFYX0FSR1VNRU5UU19MRU5HVEggPSAweDEwMDBcblxuZnVuY3Rpb24gZGVjb2RlQ29kZVBvaW50c0FycmF5IChjb2RlUG9pbnRzKSB7XG4gIGNvbnN0IGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgbGV0IHJlcyA9ICcnXG4gIGxldCBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBsZXQgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGxhdGluMVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgbGV0IHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgY29uc3QgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIGxldCBvdXQgPSAnJ1xuICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIG91dCArPSBoZXhTbGljZUxvb2t1cFRhYmxlW2J1ZltpXV1cbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGNvbnN0IGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIGxldCByZXMgPSAnJ1xuICAvLyBJZiBieXRlcy5sZW5ndGggaXMgb2RkLCB0aGUgbGFzdCA4IGJpdHMgbXVzdCBiZSBpZ25vcmVkIChzYW1lIGFzIG5vZGUuanMpXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoIC0gMTsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyAoYnl0ZXNbaSArIDFdICogMjU2KSlcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICBjb25zdCBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IH5+c3RhcnRcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB+fmVuZFxuXG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCArPSBsZW5cbiAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgfSBlbHNlIGlmIChzdGFydCA+IGxlbikge1xuICAgIHN0YXJ0ID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5cbiAgICBpZiAoZW5kIDwgMCkgZW5kID0gMFxuICB9IGVsc2UgaWYgKGVuZCA+IGxlbikge1xuICAgIGVuZCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIGNvbnN0IG5ld0J1ZiA9IHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZClcbiAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2VcbiAgT2JqZWN0LnNldFByb3RvdHlwZU9mKG5ld0J1ZiwgQnVmZmVyLnByb3RvdHlwZSlcblxuICByZXR1cm4gbmV3QnVmXG59XG5cbi8qXG4gKiBOZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGJ1ZmZlciBpc24ndCB0cnlpbmcgdG8gd3JpdGUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPZmZzZXQgKG9mZnNldCwgZXh0LCBsZW5ndGgpIHtcbiAgaWYgKChvZmZzZXQgJSAxKSAhPT0gMCB8fCBvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IGlzIG5vdCB1aW50JylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVaW50TEUgPVxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludExFID0gZnVuY3Rpb24gcmVhZFVJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICBsZXQgdmFsID0gdGhpc1tvZmZzZXRdXG4gIGxldCBtdWwgPSAxXG4gIGxldCBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVpbnRCRSA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50QkUgPSBmdW5jdGlvbiByZWFkVUludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcbiAgfVxuXG4gIGxldCB2YWwgPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF1cbiAgbGV0IG11bCA9IDFcbiAgd2hpbGUgKGJ5dGVMZW5ndGggPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVaW50OCA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIHJlYWRVSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVaW50MTZMRSA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVpbnQxNkJFID1cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCA4KSB8IHRoaXNbb2Zmc2V0ICsgMV1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVWludDMyTEUgPVxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiByZWFkVUludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICgodGhpc1tvZmZzZXRdKSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikpICtcbiAgICAgICh0aGlzW29mZnNldCArIDNdICogMHgxMDAwMDAwKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVaW50MzJCRSA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSAqIDB4MTAwMDAwMCkgK1xuICAgICgodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICB0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRCaWdVSW50NjRMRSA9IGRlZmluZUJpZ0ludE1ldGhvZChmdW5jdGlvbiByZWFkQmlnVUludDY0TEUgKG9mZnNldCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgdmFsaWRhdGVOdW1iZXIob2Zmc2V0LCAnb2Zmc2V0JylcbiAgY29uc3QgZmlyc3QgPSB0aGlzW29mZnNldF1cbiAgY29uc3QgbGFzdCA9IHRoaXNbb2Zmc2V0ICsgN11cbiAgaWYgKGZpcnN0ID09PSB1bmRlZmluZWQgfHwgbGFzdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYm91bmRzRXJyb3Iob2Zmc2V0LCB0aGlzLmxlbmd0aCAtIDgpXG4gIH1cblxuICBjb25zdCBsbyA9IGZpcnN0ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogOCArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDE2ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMjRcblxuICBjb25zdCBoaSA9IHRoaXNbKytvZmZzZXRdICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogOCArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDE2ICtcbiAgICBsYXN0ICogMiAqKiAyNFxuXG4gIHJldHVybiBCaWdJbnQobG8pICsgKEJpZ0ludChoaSkgPDwgQmlnSW50KDMyKSlcbn0pXG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEJpZ1VJbnQ2NEJFID0gZGVmaW5lQmlnSW50TWV0aG9kKGZ1bmN0aW9uIHJlYWRCaWdVSW50NjRCRSAob2Zmc2V0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICB2YWxpZGF0ZU51bWJlcihvZmZzZXQsICdvZmZzZXQnKVxuICBjb25zdCBmaXJzdCA9IHRoaXNbb2Zmc2V0XVxuICBjb25zdCBsYXN0ID0gdGhpc1tvZmZzZXQgKyA3XVxuICBpZiAoZmlyc3QgPT09IHVuZGVmaW5lZCB8fCBsYXN0ID09PSB1bmRlZmluZWQpIHtcbiAgICBib3VuZHNFcnJvcihvZmZzZXQsIHRoaXMubGVuZ3RoIC0gOClcbiAgfVxuXG4gIGNvbnN0IGhpID0gZmlyc3QgKiAyICoqIDI0ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMTYgK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiA4ICtcbiAgICB0aGlzWysrb2Zmc2V0XVxuXG4gIGNvbnN0IGxvID0gdGhpc1srK29mZnNldF0gKiAyICoqIDI0ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMTYgK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiA4ICtcbiAgICBsYXN0XG5cbiAgcmV0dXJuIChCaWdJbnQoaGkpIDw8IEJpZ0ludCgzMikpICsgQmlnSW50KGxvKVxufSlcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgbGV0IHZhbCA9IHRoaXNbb2Zmc2V0XVxuICBsZXQgbXVsID0gMVxuICBsZXQgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIGxldCBpID0gYnl0ZUxlbmd0aFxuICBsZXQgbXVsID0gMVxuICBsZXQgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWldXG4gIHdoaWxlIChpID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0taV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gcmVhZEludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgY29uc3QgdmFsID0gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gcmVhZEludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIGNvbnN0IHZhbCA9IHRoaXNbb2Zmc2V0ICsgMV0gfCAodGhpc1tvZmZzZXRdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdKSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10gPDwgMjQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiByZWFkSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCAyNCkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRCaWdJbnQ2NExFID0gZGVmaW5lQmlnSW50TWV0aG9kKGZ1bmN0aW9uIHJlYWRCaWdJbnQ2NExFIChvZmZzZXQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIHZhbGlkYXRlTnVtYmVyKG9mZnNldCwgJ29mZnNldCcpXG4gIGNvbnN0IGZpcnN0ID0gdGhpc1tvZmZzZXRdXG4gIGNvbnN0IGxhc3QgPSB0aGlzW29mZnNldCArIDddXG4gIGlmIChmaXJzdCA9PT0gdW5kZWZpbmVkIHx8IGxhc3QgPT09IHVuZGVmaW5lZCkge1xuICAgIGJvdW5kc0Vycm9yKG9mZnNldCwgdGhpcy5sZW5ndGggLSA4KVxuICB9XG5cbiAgY29uc3QgdmFsID0gdGhpc1tvZmZzZXQgKyA0XSArXG4gICAgdGhpc1tvZmZzZXQgKyA1XSAqIDIgKiogOCArXG4gICAgdGhpc1tvZmZzZXQgKyA2XSAqIDIgKiogMTYgK1xuICAgIChsYXN0IDw8IDI0KSAvLyBPdmVyZmxvd1xuXG4gIHJldHVybiAoQmlnSW50KHZhbCkgPDwgQmlnSW50KDMyKSkgK1xuICAgIEJpZ0ludChmaXJzdCArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDggK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiAxNiArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDI0KVxufSlcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkQmlnSW50NjRCRSA9IGRlZmluZUJpZ0ludE1ldGhvZChmdW5jdGlvbiByZWFkQmlnSW50NjRCRSAob2Zmc2V0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICB2YWxpZGF0ZU51bWJlcihvZmZzZXQsICdvZmZzZXQnKVxuICBjb25zdCBmaXJzdCA9IHRoaXNbb2Zmc2V0XVxuICBjb25zdCBsYXN0ID0gdGhpc1tvZmZzZXQgKyA3XVxuICBpZiAoZmlyc3QgPT09IHVuZGVmaW5lZCB8fCBsYXN0ID09PSB1bmRlZmluZWQpIHtcbiAgICBib3VuZHNFcnJvcihvZmZzZXQsIHRoaXMubGVuZ3RoIC0gOClcbiAgfVxuXG4gIGNvbnN0IHZhbCA9IChmaXJzdCA8PCAyNCkgKyAvLyBPdmVyZmxvd1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiAxNiArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDggK1xuICAgIHRoaXNbKytvZmZzZXRdXG5cbiAgcmV0dXJuIChCaWdJbnQodmFsKSA8PCBCaWdJbnQoMzIpKSArXG4gICAgQmlnSW50KHRoaXNbKytvZmZzZXRdICogMiAqKiAyNCArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDE2ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogOCArXG4gICAgbGFzdClcbn0pXG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gcmVhZEZsb2F0QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDUyLCA4KVxufVxuXG5mdW5jdGlvbiBjaGVja0ludCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYnVmZmVyXCIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpXG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVWludExFID1cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjb25zdCBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIGxldCBtdWwgPSAxXG4gIGxldCBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVaW50QkUgPVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlVUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNvbnN0IG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgbGV0IGkgPSBieXRlTGVuZ3RoIC0gMVxuICBsZXQgbXVsID0gMVxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVpbnQ4ID1cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweGZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVWludDE2TEUgPVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVpbnQxNkJFID1cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVaW50MzJMRSA9XG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVWludDMyQkUgPVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gd3J0QmlnVUludDY0TEUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbWluLCBtYXgpIHtcbiAgY2hlY2tJbnRCSSh2YWx1ZSwgbWluLCBtYXgsIGJ1Ziwgb2Zmc2V0LCA3KVxuXG4gIGxldCBsbyA9IE51bWJlcih2YWx1ZSAmIEJpZ0ludCgweGZmZmZmZmZmKSlcbiAgYnVmW29mZnNldCsrXSA9IGxvXG4gIGxvID0gbG8gPj4gOFxuICBidWZbb2Zmc2V0KytdID0gbG9cbiAgbG8gPSBsbyA+PiA4XG4gIGJ1ZltvZmZzZXQrK10gPSBsb1xuICBsbyA9IGxvID4+IDhcbiAgYnVmW29mZnNldCsrXSA9IGxvXG4gIGxldCBoaSA9IE51bWJlcih2YWx1ZSA+PiBCaWdJbnQoMzIpICYgQmlnSW50KDB4ZmZmZmZmZmYpKVxuICBidWZbb2Zmc2V0KytdID0gaGlcbiAgaGkgPSBoaSA+PiA4XG4gIGJ1ZltvZmZzZXQrK10gPSBoaVxuICBoaSA9IGhpID4+IDhcbiAgYnVmW29mZnNldCsrXSA9IGhpXG4gIGhpID0gaGkgPj4gOFxuICBidWZbb2Zmc2V0KytdID0gaGlcbiAgcmV0dXJuIG9mZnNldFxufVxuXG5mdW5jdGlvbiB3cnRCaWdVSW50NjRCRSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBtaW4sIG1heCkge1xuICBjaGVja0ludEJJKHZhbHVlLCBtaW4sIG1heCwgYnVmLCBvZmZzZXQsIDcpXG5cbiAgbGV0IGxvID0gTnVtYmVyKHZhbHVlICYgQmlnSW50KDB4ZmZmZmZmZmYpKVxuICBidWZbb2Zmc2V0ICsgN10gPSBsb1xuICBsbyA9IGxvID4+IDhcbiAgYnVmW29mZnNldCArIDZdID0gbG9cbiAgbG8gPSBsbyA+PiA4XG4gIGJ1ZltvZmZzZXQgKyA1XSA9IGxvXG4gIGxvID0gbG8gPj4gOFxuICBidWZbb2Zmc2V0ICsgNF0gPSBsb1xuICBsZXQgaGkgPSBOdW1iZXIodmFsdWUgPj4gQmlnSW50KDMyKSAmIEJpZ0ludCgweGZmZmZmZmZmKSlcbiAgYnVmW29mZnNldCArIDNdID0gaGlcbiAgaGkgPSBoaSA+PiA4XG4gIGJ1ZltvZmZzZXQgKyAyXSA9IGhpXG4gIGhpID0gaGkgPj4gOFxuICBidWZbb2Zmc2V0ICsgMV0gPSBoaVxuICBoaSA9IGhpID4+IDhcbiAgYnVmW29mZnNldF0gPSBoaVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlQmlnVUludDY0TEUgPSBkZWZpbmVCaWdJbnRNZXRob2QoZnVuY3Rpb24gd3JpdGVCaWdVSW50NjRMRSAodmFsdWUsIG9mZnNldCA9IDApIHtcbiAgcmV0dXJuIHdydEJpZ1VJbnQ2NExFKHRoaXMsIHZhbHVlLCBvZmZzZXQsIEJpZ0ludCgwKSwgQmlnSW50KCcweGZmZmZmZmZmZmZmZmZmZmYnKSlcbn0pXG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVCaWdVSW50NjRCRSA9IGRlZmluZUJpZ0ludE1ldGhvZChmdW5jdGlvbiB3cml0ZUJpZ1VJbnQ2NEJFICh2YWx1ZSwgb2Zmc2V0ID0gMCkge1xuICByZXR1cm4gd3J0QmlnVUludDY0QkUodGhpcywgdmFsdWUsIG9mZnNldCwgQmlnSW50KDApLCBCaWdJbnQoJzB4ZmZmZmZmZmZmZmZmZmZmZicpKVxufSlcblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludExFID0gZnVuY3Rpb24gd3JpdGVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjb25zdCBsaW1pdCA9IE1hdGgucG93KDIsICg4ICogYnl0ZUxlbmd0aCkgLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICBsZXQgaSA9IDBcbiAgbGV0IG11bCA9IDFcbiAgbGV0IHN1YiA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpIC0gMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFID0gZnVuY3Rpb24gd3JpdGVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjb25zdCBsaW1pdCA9IE1hdGgucG93KDIsICg4ICogYnl0ZUxlbmd0aCkgLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICBsZXQgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIGxldCBtdWwgPSAxXG4gIGxldCBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpICsgMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiB3cml0ZUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlQmlnSW50NjRMRSA9IGRlZmluZUJpZ0ludE1ldGhvZChmdW5jdGlvbiB3cml0ZUJpZ0ludDY0TEUgKHZhbHVlLCBvZmZzZXQgPSAwKSB7XG4gIHJldHVybiB3cnRCaWdVSW50NjRMRSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAtQmlnSW50KCcweDgwMDAwMDAwMDAwMDAwMDAnKSwgQmlnSW50KCcweDdmZmZmZmZmZmZmZmZmZmYnKSlcbn0pXG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVCaWdJbnQ2NEJFID0gZGVmaW5lQmlnSW50TWV0aG9kKGZ1bmN0aW9uIHdyaXRlQmlnSW50NjRCRSAodmFsdWUsIG9mZnNldCA9IDApIHtcbiAgcmV0dXJuIHdydEJpZ1VJbnQ2NEJFKHRoaXMsIHZhbHVlLCBvZmZzZXQsIC1CaWdJbnQoJzB4ODAwMDAwMDAwMDAwMDAwMCcpLCBCaWdJbnQoJzB4N2ZmZmZmZmZmZmZmZmZmZicpKVxufSlcblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA4LCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkgKHRhcmdldCwgdGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgc2hvdWxkIGJlIGEgQnVmZmVyJylcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldFN0YXJ0ID49IHRhcmdldC5sZW5ndGgpIHRhcmdldFN0YXJ0ID0gdGFyZ2V0Lmxlbmd0aFxuICBpZiAoIXRhcmdldFN0YXJ0KSB0YXJnZXRTdGFydCA9IDBcbiAgaWYgKGVuZCA+IDAgJiYgZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMFxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCB0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGlmICh0YXJnZXRTdGFydCA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIH1cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChlbmQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0ICsgc3RhcnRcbiAgfVxuXG4gIGNvbnN0IGxlbiA9IGVuZCAtIHN0YXJ0XG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCAmJiB0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuY29weVdpdGhpbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIFVzZSBidWlsdC1pbiB3aGVuIGF2YWlsYWJsZSwgbWlzc2luZyBmcm9tIElFMTFcbiAgICB0aGlzLmNvcHlXaXRoaW4odGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpXG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpLFxuICAgICAgdGFyZ2V0U3RhcnRcbiAgICApXG4gIH1cblxuICByZXR1cm4gbGVuXG59XG5cbi8vIFVzYWdlOlxuLy8gICAgYnVmZmVyLmZpbGwobnVtYmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChidWZmZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKHN0cmluZ1ssIG9mZnNldFssIGVuZF1dWywgZW5jb2RpbmddKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCAodmFsLCBzdGFydCwgZW5kLCBlbmNvZGluZykge1xuICAvLyBIYW5kbGUgc3RyaW5nIGNhc2VzOlxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodHlwZW9mIHN0YXJ0ID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBzdGFydFxuICAgICAgc3RhcnQgPSAwXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVuZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gZW5kXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH1cbiAgICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycgJiYgIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgIH1cbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY29uc3QgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoKGVuY29kaW5nID09PSAndXRmOCcgJiYgY29kZSA8IDEyOCkgfHxcbiAgICAgICAgICBlbmNvZGluZyA9PT0gJ2xhdGluMScpIHtcbiAgICAgICAgLy8gRmFzdCBwYXRoOiBJZiBgdmFsYCBmaXRzIGludG8gYSBzaW5nbGUgYnl0ZSwgdXNlIHRoYXQgbnVtZXJpYyB2YWx1ZS5cbiAgICAgICAgdmFsID0gY29kZVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDI1NVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdib29sZWFuJykge1xuICAgIHZhbCA9IE51bWJlcih2YWwpXG4gIH1cblxuICAvLyBJbnZhbGlkIHJhbmdlcyBhcmUgbm90IHNldCB0byBhIGRlZmF1bHQsIHNvIGNhbiByYW5nZSBjaGVjayBlYXJseS5cbiAgaWYgKHN0YXJ0IDwgMCB8fCB0aGlzLmxlbmd0aCA8IHN0YXJ0IHx8IHRoaXMubGVuZ3RoIDwgZW5kKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ091dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHN0YXJ0ID0gc3RhcnQgPj4+IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyB0aGlzLmxlbmd0aCA6IGVuZCA+Pj4gMFxuXG4gIGlmICghdmFsKSB2YWwgPSAwXG5cbiAgbGV0IGlcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgdGhpc1tpXSA9IHZhbFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zdCBieXRlcyA9IEJ1ZmZlci5pc0J1ZmZlcih2YWwpXG4gICAgICA/IHZhbFxuICAgICAgOiBCdWZmZXIuZnJvbSh2YWwsIGVuY29kaW5nKVxuICAgIGNvbnN0IGxlbiA9IGJ5dGVzLmxlbmd0aFxuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSB2YWx1ZSBcIicgKyB2YWwgK1xuICAgICAgICAnXCIgaXMgaW52YWxpZCBmb3IgYXJndW1lbnQgXCJ2YWx1ZVwiJylcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyArK2kpIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gQ1VTVE9NIEVSUk9SU1xuLy8gPT09PT09PT09PT09PVxuXG4vLyBTaW1wbGlmaWVkIHZlcnNpb25zIGZyb20gTm9kZSwgY2hhbmdlZCBmb3IgQnVmZmVyLW9ubHkgdXNhZ2VcbmNvbnN0IGVycm9ycyA9IHt9XG5mdW5jdGlvbiBFIChzeW0sIGdldE1lc3NhZ2UsIEJhc2UpIHtcbiAgZXJyb3JzW3N5bV0gPSBjbGFzcyBOb2RlRXJyb3IgZXh0ZW5kcyBCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICBzdXBlcigpXG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbWVzc2FnZScsIHtcbiAgICAgICAgdmFsdWU6IGdldE1lc3NhZ2UuYXBwbHkodGhpcywgYXJndW1lbnRzKSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSlcblxuICAgICAgLy8gQWRkIHRoZSBlcnJvciBjb2RlIHRvIHRoZSBuYW1lIHRvIGluY2x1ZGUgaXQgaW4gdGhlIHN0YWNrIHRyYWNlLlxuICAgICAgdGhpcy5uYW1lID0gYCR7dGhpcy5uYW1lfSBbJHtzeW19XWBcbiAgICAgIC8vIEFjY2VzcyB0aGUgc3RhY2sgdG8gZ2VuZXJhdGUgdGhlIGVycm9yIG1lc3NhZ2UgaW5jbHVkaW5nIHRoZSBlcnJvciBjb2RlXG4gICAgICAvLyBmcm9tIHRoZSBuYW1lLlxuICAgICAgdGhpcy5zdGFjayAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuICAgICAgLy8gUmVzZXQgdGhlIG5hbWUgdG8gdGhlIGFjdHVhbCBuYW1lLlxuICAgICAgZGVsZXRlIHRoaXMubmFtZVxuICAgIH1cblxuICAgIGdldCBjb2RlICgpIHtcbiAgICAgIHJldHVybiBzeW1cbiAgICB9XG5cbiAgICBzZXQgY29kZSAodmFsdWUpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnY29kZScsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdG9TdHJpbmcgKCkge1xuICAgICAgcmV0dXJuIGAke3RoaXMubmFtZX0gWyR7c3ltfV06ICR7dGhpcy5tZXNzYWdlfWBcbiAgICB9XG4gIH1cbn1cblxuRSgnRVJSX0JVRkZFUl9PVVRfT0ZfQk9VTkRTJyxcbiAgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAobmFtZSkge1xuICAgICAgcmV0dXJuIGAke25hbWV9IGlzIG91dHNpZGUgb2YgYnVmZmVyIGJvdW5kc2BcbiAgICB9XG5cbiAgICByZXR1cm4gJ0F0dGVtcHQgdG8gYWNjZXNzIG1lbW9yeSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnXG4gIH0sIFJhbmdlRXJyb3IpXG5FKCdFUlJfSU5WQUxJRF9BUkdfVFlQRScsXG4gIGZ1bmN0aW9uIChuYW1lLCBhY3R1YWwpIHtcbiAgICByZXR1cm4gYFRoZSBcIiR7bmFtZX1cIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyLiBSZWNlaXZlZCB0eXBlICR7dHlwZW9mIGFjdHVhbH1gXG4gIH0sIFR5cGVFcnJvcilcbkUoJ0VSUl9PVVRfT0ZfUkFOR0UnLFxuICBmdW5jdGlvbiAoc3RyLCByYW5nZSwgaW5wdXQpIHtcbiAgICBsZXQgbXNnID0gYFRoZSB2YWx1ZSBvZiBcIiR7c3RyfVwiIGlzIG91dCBvZiByYW5nZS5gXG4gICAgbGV0IHJlY2VpdmVkID0gaW5wdXRcbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihpbnB1dCkgJiYgTWF0aC5hYnMoaW5wdXQpID4gMiAqKiAzMikge1xuICAgICAgcmVjZWl2ZWQgPSBhZGROdW1lcmljYWxTZXBhcmF0b3IoU3RyaW5nKGlucHV0KSlcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ2JpZ2ludCcpIHtcbiAgICAgIHJlY2VpdmVkID0gU3RyaW5nKGlucHV0KVxuICAgICAgaWYgKGlucHV0ID4gQmlnSW50KDIpICoqIEJpZ0ludCgzMikgfHwgaW5wdXQgPCAtKEJpZ0ludCgyKSAqKiBCaWdJbnQoMzIpKSkge1xuICAgICAgICByZWNlaXZlZCA9IGFkZE51bWVyaWNhbFNlcGFyYXRvcihyZWNlaXZlZClcbiAgICAgIH1cbiAgICAgIHJlY2VpdmVkICs9ICduJ1xuICAgIH1cbiAgICBtc2cgKz0gYCBJdCBtdXN0IGJlICR7cmFuZ2V9LiBSZWNlaXZlZCAke3JlY2VpdmVkfWBcbiAgICByZXR1cm4gbXNnXG4gIH0sIFJhbmdlRXJyb3IpXG5cbmZ1bmN0aW9uIGFkZE51bWVyaWNhbFNlcGFyYXRvciAodmFsKSB7XG4gIGxldCByZXMgPSAnJ1xuICBsZXQgaSA9IHZhbC5sZW5ndGhcbiAgY29uc3Qgc3RhcnQgPSB2YWxbMF0gPT09ICctJyA/IDEgOiAwXG4gIGZvciAoOyBpID49IHN0YXJ0ICsgNDsgaSAtPSAzKSB7XG4gICAgcmVzID0gYF8ke3ZhbC5zbGljZShpIC0gMywgaSl9JHtyZXN9YFxuICB9XG4gIHJldHVybiBgJHt2YWwuc2xpY2UoMCwgaSl9JHtyZXN9YFxufVxuXG4vLyBDSEVDSyBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBjaGVja0JvdW5kcyAoYnVmLCBvZmZzZXQsIGJ5dGVMZW5ndGgpIHtcbiAgdmFsaWRhdGVOdW1iZXIob2Zmc2V0LCAnb2Zmc2V0JylcbiAgaWYgKGJ1ZltvZmZzZXRdID09PSB1bmRlZmluZWQgfHwgYnVmW29mZnNldCArIGJ5dGVMZW5ndGhdID09PSB1bmRlZmluZWQpIHtcbiAgICBib3VuZHNFcnJvcihvZmZzZXQsIGJ1Zi5sZW5ndGggLSAoYnl0ZUxlbmd0aCArIDEpKVxuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50QkkgKHZhbHVlLCBtaW4sIG1heCwgYnVmLCBvZmZzZXQsIGJ5dGVMZW5ndGgpIHtcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB7XG4gICAgY29uc3QgbiA9IHR5cGVvZiBtaW4gPT09ICdiaWdpbnQnID8gJ24nIDogJydcbiAgICBsZXQgcmFuZ2VcbiAgICBpZiAoYnl0ZUxlbmd0aCA+IDMpIHtcbiAgICAgIGlmIChtaW4gPT09IDAgfHwgbWluID09PSBCaWdJbnQoMCkpIHtcbiAgICAgICAgcmFuZ2UgPSBgPj0gMCR7bn0gYW5kIDwgMiR7bn0gKiogJHsoYnl0ZUxlbmd0aCArIDEpICogOH0ke259YFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmFuZ2UgPSBgPj0gLSgyJHtufSAqKiAkeyhieXRlTGVuZ3RoICsgMSkgKiA4IC0gMX0ke259KSBhbmQgPCAyICoqIGAgK1xuICAgICAgICAgICAgICAgIGAkeyhieXRlTGVuZ3RoICsgMSkgKiA4IC0gMX0ke259YFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByYW5nZSA9IGA+PSAke21pbn0ke259IGFuZCA8PSAke21heH0ke259YFxuICAgIH1cbiAgICB0aHJvdyBuZXcgZXJyb3JzLkVSUl9PVVRfT0ZfUkFOR0UoJ3ZhbHVlJywgcmFuZ2UsIHZhbHVlKVxuICB9XG4gIGNoZWNrQm91bmRzKGJ1Ziwgb2Zmc2V0LCBieXRlTGVuZ3RoKVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZU51bWJlciAodmFsdWUsIG5hbWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkVSUl9JTlZBTElEX0FSR19UWVBFKG5hbWUsICdudW1iZXInLCB2YWx1ZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBib3VuZHNFcnJvciAodmFsdWUsIGxlbmd0aCwgdHlwZSkge1xuICBpZiAoTWF0aC5mbG9vcih2YWx1ZSkgIT09IHZhbHVlKSB7XG4gICAgdmFsaWRhdGVOdW1iZXIodmFsdWUsIHR5cGUpXG4gICAgdGhyb3cgbmV3IGVycm9ycy5FUlJfT1VUX09GX1JBTkdFKHR5cGUgfHwgJ29mZnNldCcsICdhbiBpbnRlZ2VyJywgdmFsdWUpXG4gIH1cblxuICBpZiAobGVuZ3RoIDwgMCkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuRVJSX0JVRkZFUl9PVVRfT0ZfQk9VTkRTKClcbiAgfVxuXG4gIHRocm93IG5ldyBlcnJvcnMuRVJSX09VVF9PRl9SQU5HRSh0eXBlIHx8ICdvZmZzZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYD49ICR7dHlwZSA/IDEgOiAwfSBhbmQgPD0gJHtsZW5ndGh9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlKVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbmNvbnN0IElOVkFMSURfQkFTRTY0X1JFID0gL1teKy8wLTlBLVphLXotX10vZ1xuXG5mdW5jdGlvbiBiYXNlNjRjbGVhbiAoc3RyKSB7XG4gIC8vIE5vZGUgdGFrZXMgZXF1YWwgc2lnbnMgYXMgZW5kIG9mIHRoZSBCYXNlNjQgZW5jb2RpbmdcbiAgc3RyID0gc3RyLnNwbGl0KCc9JylbMF1cbiAgLy8gTm9kZSBzdHJpcHMgb3V0IGludmFsaWQgY2hhcmFjdGVycyBsaWtlIFxcbiBhbmQgXFx0IGZyb20gdGhlIHN0cmluZywgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHN0ciA9IHN0ci50cmltKCkucmVwbGFjZShJTlZBTElEX0JBU0U2NF9SRSwgJycpXG4gIC8vIE5vZGUgY29udmVydHMgc3RyaW5ncyB3aXRoIGxlbmd0aCA8IDIgdG8gJydcbiAgaWYgKHN0ci5sZW5ndGggPCAyKSByZXR1cm4gJydcbiAgLy8gTm9kZSBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgYmFzZTY0IHN0cmluZ3MgKG1pc3NpbmcgdHJhaWxpbmcgPT09KSwgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHdoaWxlIChzdHIubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgIHN0ciA9IHN0ciArICc9J1xuICB9XG4gIHJldHVybiBzdHJcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICBsZXQgY29kZVBvaW50XG4gIGNvbnN0IGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcbiAgbGV0IGxlYWRTdXJyb2dhdGUgPSBudWxsXG4gIGNvbnN0IGJ5dGVzID0gW11cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgY29kZVBvaW50ID0gc3RyaW5nLmNoYXJDb2RlQXQoaSlcblxuICAgIC8vIGlzIHN1cnJvZ2F0ZSBjb21wb25lbnRcbiAgICBpZiAoY29kZVBvaW50ID4gMHhEN0ZGICYmIGNvZGVQb2ludCA8IDB4RTAwMCkge1xuICAgICAgLy8gbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICghbGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgICAvLyBubyBsZWFkIHlldFxuICAgICAgICBpZiAoY29kZVBvaW50ID4gMHhEQkZGKSB7XG4gICAgICAgICAgLy8gdW5leHBlY3RlZCB0cmFpbFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSBpZiAoaSArIDEgPT09IGxlbmd0aCkge1xuICAgICAgICAgIC8vIHVucGFpcmVkIGxlYWRcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsaWQgbGVhZFxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gMiBsZWFkcyBpbiBhIHJvd1xuICAgICAgaWYgKGNvZGVQb2ludCA8IDB4REMwMCkge1xuICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyB2YWxpZCBzdXJyb2dhdGUgcGFpclxuICAgICAgY29kZVBvaW50ID0gKGxlYWRTdXJyb2dhdGUgLSAweEQ4MDAgPDwgMTAgfCBjb2RlUG9pbnQgLSAweERDMDApICsgMHgxMDAwMFxuICAgIH0gZWxzZSBpZiAobGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgLy8gdmFsaWQgYm1wIGNoYXIsIGJ1dCBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgfVxuXG4gICAgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcblxuICAgIC8vIGVuY29kZSB1dGY4XG4gICAgaWYgKGNvZGVQb2ludCA8IDB4ODApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMSkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChjb2RlUG9pbnQpXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDgwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2IHwgMHhDMCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyB8IDB4RTAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDQpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDEyIHwgMHhGMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2RlIHBvaW50JylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnl0ZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgY29uc3QgYnl0ZUFycmF5ID0gW11cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICBsZXQgYywgaGksIGxvXG4gIGNvbnN0IGJ5dGVBcnJheSA9IFtdXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG5cbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgbGV0IGlcbiAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKSBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbi8vIEFycmF5QnVmZmVyIG9yIFVpbnQ4QXJyYXkgb2JqZWN0cyBmcm9tIG90aGVyIGNvbnRleHRzIChpLmUuIGlmcmFtZXMpIGRvIG5vdCBwYXNzXG4vLyB0aGUgYGluc3RhbmNlb2ZgIGNoZWNrIGJ1dCB0aGV5IHNob3VsZCBiZSB0cmVhdGVkIGFzIG9mIHRoYXQgdHlwZS5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvaXNzdWVzLzE2NlxuZnVuY3Rpb24gaXNJbnN0YW5jZSAob2JqLCB0eXBlKSB7XG4gIHJldHVybiBvYmogaW5zdGFuY2VvZiB0eXBlIHx8XG4gICAgKG9iaiAhPSBudWxsICYmIG9iai5jb25zdHJ1Y3RvciAhPSBudWxsICYmIG9iai5jb25zdHJ1Y3Rvci5uYW1lICE9IG51bGwgJiZcbiAgICAgIG9iai5jb25zdHJ1Y3Rvci5uYW1lID09PSB0eXBlLm5hbWUpXG59XG5mdW5jdGlvbiBudW1iZXJJc05hTiAob2JqKSB7XG4gIC8vIEZvciBJRTExIHN1cHBvcnRcbiAgcmV0dXJuIG9iaiAhPT0gb2JqIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2VsZi1jb21wYXJlXG59XG5cbi8vIENyZWF0ZSBsb29rdXAgdGFibGUgZm9yIGB0b1N0cmluZygnaGV4JylgXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL2lzc3Vlcy8yMTlcbmNvbnN0IGhleFNsaWNlTG9va3VwVGFibGUgPSAoZnVuY3Rpb24gKCkge1xuICBjb25zdCBhbHBoYWJldCA9ICcwMTIzNDU2Nzg5YWJjZGVmJ1xuICBjb25zdCB0YWJsZSA9IG5ldyBBcnJheSgyNTYpXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7ICsraSkge1xuICAgIGNvbnN0IGkxNiA9IGkgKiAxNlxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTY7ICsraikge1xuICAgICAgdGFibGVbaTE2ICsgal0gPSBhbHBoYWJldFtpXSArIGFscGhhYmV0W2pdXG4gICAgfVxuICB9XG4gIHJldHVybiB0YWJsZVxufSkoKVxuXG4vLyBSZXR1cm4gbm90IGZ1bmN0aW9uIHdpdGggRXJyb3IgaWYgQmlnSW50IG5vdCBzdXBwb3J0ZWRcbmZ1bmN0aW9uIGRlZmluZUJpZ0ludE1ldGhvZCAoZm4pIHtcbiAgcmV0dXJuIHR5cGVvZiBCaWdJbnQgPT09ICd1bmRlZmluZWQnID8gQnVmZmVyQmlnSW50Tm90RGVmaW5lZCA6IGZuXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlckJpZ0ludE5vdERlZmluZWQgKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ0JpZ0ludCBub3Qgc3VwcG9ydGVkJylcbn1cbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IHtcblx0bXVsdGlCeXRlSW5kZXhPZixcblx0c3RyaW5nVG9CeXRlcyxcblx0cmVhZFVJbnQ2NExFLFxuXHR0YXJIZWFkZXJDaGVja3N1bU1hdGNoZXMsXG5cdHVpbnQ4QXJyYXlVdGY4Qnl0ZVN0cmluZ1xufSA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuY29uc3Qgc3VwcG9ydGVkID0gcmVxdWlyZSgnLi9zdXBwb3J0ZWQnKTtcblxuY29uc3QgeHBpWmlwRmlsZW5hbWUgPSBzdHJpbmdUb0J5dGVzKCdNRVRBLUlORi9tb3ppbGxhLnJzYScpO1xuY29uc3Qgb3htbENvbnRlbnRUeXBlcyA9IHN0cmluZ1RvQnl0ZXMoJ1tDb250ZW50X1R5cGVzXS54bWwnKTtcbmNvbnN0IG94bWxSZWxzID0gc3RyaW5nVG9CeXRlcygnX3JlbHMvLnJlbHMnKTtcblxuY29uc3QgZmlsZVR5cGUgPSBpbnB1dCA9PiB7XG5cdGlmICghKGlucHV0IGluc3RhbmNlb2YgVWludDhBcnJheSB8fCBpbnB1dCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyIHx8IEJ1ZmZlci5pc0J1ZmZlcihpbnB1dCkpKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihgRXhwZWN0ZWQgdGhlIFxcYGlucHV0XFxgIGFyZ3VtZW50IHRvIGJlIG9mIHR5cGUgXFxgVWludDhBcnJheVxcYCBvciBcXGBCdWZmZXJcXGAgb3IgXFxgQXJyYXlCdWZmZXJcXGAsIGdvdCBcXGAke3R5cGVvZiBpbnB1dH1cXGBgKTtcblx0fVxuXG5cdGNvbnN0IGJ1ZmZlciA9IGlucHV0IGluc3RhbmNlb2YgVWludDhBcnJheSA/IGlucHV0IDogbmV3IFVpbnQ4QXJyYXkoaW5wdXQpO1xuXG5cdGlmICghKGJ1ZmZlciAmJiBidWZmZXIubGVuZ3RoID4gMSkpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBjaGVjayA9IChoZWFkZXIsIG9wdGlvbnMpID0+IHtcblx0XHRvcHRpb25zID0ge1xuXHRcdFx0b2Zmc2V0OiAwLFxuXHRcdFx0Li4ub3B0aW9uc1xuXHRcdH07XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGhlYWRlci5sZW5ndGg7IGkrKykge1xuXHRcdFx0Ly8gSWYgYSBiaXRtYXNrIGlzIHNldFxuXHRcdFx0aWYgKG9wdGlvbnMubWFzaykge1xuXHRcdFx0XHQvLyBJZiBoZWFkZXIgZG9lc24ndCBlcXVhbCBgYnVmYCB3aXRoIGJpdHMgbWFza2VkIG9mZlxuXHRcdFx0XHRpZiAoaGVhZGVyW2ldICE9PSAob3B0aW9ucy5tYXNrW2ldICYgYnVmZmVyW2kgKyBvcHRpb25zLm9mZnNldF0pKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKGhlYWRlcltpXSAhPT0gYnVmZmVyW2kgKyBvcHRpb25zLm9mZnNldF0pIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9O1xuXG5cdGNvbnN0IGNoZWNrU3RyaW5nID0gKGhlYWRlciwgb3B0aW9ucykgPT4gY2hlY2soc3RyaW5nVG9CeXRlcyhoZWFkZXIpLCBvcHRpb25zKTtcblxuXHRpZiAoY2hlY2soWzB4RkYsIDB4RDgsIDB4RkZdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdqcGcnLFxuXHRcdFx0bWltZTogJ2ltYWdlL2pwZWcnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg4OSwgMHg1MCwgMHg0RSwgMHg0NywgMHgwRCwgMHgwQSwgMHgxQSwgMHgwQV0pKSB7XG5cdFx0Ly8gQVBORyBmb3JtYXQgKGh0dHBzOi8vd2lraS5tb3ppbGxhLm9yZy9BUE5HX1NwZWNpZmljYXRpb24pXG5cdFx0Ly8gMS4gRmluZCB0aGUgZmlyc3QgSURBVCAoaW1hZ2UgZGF0YSkgY2h1bmsgKDQ5IDQ0IDQxIDU0KVxuXHRcdC8vIDIuIENoZWNrIGlmIHRoZXJlIGlzIGFuIFwiYWNUTFwiIGNodW5rIGJlZm9yZSB0aGUgSURBVCBvbmUgKDYxIDYzIDU0IDRDKVxuXG5cdFx0Ly8gT2Zmc2V0IGNhbGN1bGF0ZWQgYXMgZm9sbG93czpcblx0XHQvLyAtIDggYnl0ZXM6IFBORyBzaWduYXR1cmVcblx0XHQvLyAtIDQgKGxlbmd0aCkgKyA0IChjaHVuayB0eXBlKSArIDEzIChjaHVuayBkYXRhKSArIDQgKENSQyk6IElIRFIgY2h1bmtcblx0XHRjb25zdCBzdGFydEluZGV4ID0gMzM7XG5cdFx0Y29uc3QgZmlyc3RJbWFnZURhdGFDaHVua0luZGV4ID0gYnVmZmVyLmZpbmRJbmRleCgoZWwsIGkpID0+IGkgPj0gc3RhcnRJbmRleCAmJiBidWZmZXJbaV0gPT09IDB4NDkgJiYgYnVmZmVyW2kgKyAxXSA9PT0gMHg0NCAmJiBidWZmZXJbaSArIDJdID09PSAweDQxICYmIGJ1ZmZlcltpICsgM10gPT09IDB4NTQpO1xuXHRcdGNvbnN0IHNsaWNlZCA9IGJ1ZmZlci5zdWJhcnJheShzdGFydEluZGV4LCBmaXJzdEltYWdlRGF0YUNodW5rSW5kZXgpO1xuXG5cdFx0aWYgKHNsaWNlZC5maW5kSW5kZXgoKGVsLCBpKSA9PiBzbGljZWRbaV0gPT09IDB4NjEgJiYgc2xpY2VkW2kgKyAxXSA9PT0gMHg2MyAmJiBzbGljZWRbaSArIDJdID09PSAweDU0ICYmIHNsaWNlZFtpICsgM10gPT09IDB4NEMpID49IDApIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV4dDogJ2FwbmcnLFxuXHRcdFx0XHRtaW1lOiAnaW1hZ2UvYXBuZydcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3BuZycsXG5cdFx0XHRtaW1lOiAnaW1hZ2UvcG5nJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NDcsIDB4NDksIDB4NDZdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdnaWYnLFxuXHRcdFx0bWltZTogJ2ltYWdlL2dpZidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDU3LCAweDQ1LCAweDQyLCAweDUwXSwge29mZnNldDogOH0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3dlYnAnLFxuXHRcdFx0bWltZTogJ2ltYWdlL3dlYnAnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg0NiwgMHg0QywgMHg0OSwgMHg0Nl0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2ZsaWYnLFxuXHRcdFx0bWltZTogJ2ltYWdlL2ZsaWYnXG5cdFx0fTtcblx0fVxuXG5cdC8vIGBjcjJgLCBgb3JmYCwgYW5kIGBhcndgIG5lZWQgdG8gYmUgYmVmb3JlIGB0aWZgIGNoZWNrXG5cdGlmIChcblx0XHQoY2hlY2soWzB4NDksIDB4NDksIDB4MkEsIDB4MF0pIHx8IGNoZWNrKFsweDRELCAweDRELCAweDAsIDB4MkFdKSkgJiZcblx0XHRjaGVjayhbMHg0MywgMHg1Ml0sIHtvZmZzZXQ6IDh9KVxuXHQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnY3IyJyxcblx0XHRcdG1pbWU6ICdpbWFnZS94LWNhbm9uLWNyMidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDQ5LCAweDQ5LCAweDUyLCAweDRGLCAweDA4LCAweDAwLCAweDAwLCAweDAwLCAweDE4XSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnb3JmJyxcblx0XHRcdG1pbWU6ICdpbWFnZS94LW9seW1wdXMtb3JmJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoXG5cdFx0Y2hlY2soWzB4NDksIDB4NDksIDB4MkEsIDB4MDBdKSAmJlxuXHRcdChjaGVjayhbMHgxMCwgMHhGQiwgMHg4NiwgMHgwMV0sIHtvZmZzZXQ6IDR9KSB8fCBjaGVjayhbMHgwOCwgMHgwMCwgMHgwMCwgMHgwMF0sIHtvZmZzZXQ6IDR9KSkgJiZcblx0XHQvLyBUaGlzIHBhdHRlcm4gZGlmZmVyZW50aWF0ZXMgQVJXIGZyb20gb3RoZXIgVElGRi1pc2ggZmlsZSB0eXBlczpcblx0XHRjaGVjayhbMHgwMCwgMHhGRSwgMHgwMCwgMHgwNCwgMHgwMCwgMHgwMSwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMSwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMywgMHgwMV0sIHtvZmZzZXQ6IDl9KVxuXHQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnYXJ3Jyxcblx0XHRcdG1pbWU6ICdpbWFnZS94LXNvbnktYXJ3J1xuXHRcdH07XG5cdH1cblxuXHRpZiAoXG5cdFx0Y2hlY2soWzB4NDksIDB4NDksIDB4MkEsIDB4MDAsIDB4MDgsIDB4MDAsIDB4MDAsIDB4MDBdKSAmJlxuXHRcdChjaGVjayhbMHgyRCwgMHgwMCwgMHhGRSwgMHgwMF0sIHtvZmZzZXQ6IDh9KSB8fFxuXHRcdGNoZWNrKFsweDI3LCAweDAwLCAweEZFLCAweDAwXSwge29mZnNldDogOH0pKVxuXHQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnZG5nJyxcblx0XHRcdG1pbWU6ICdpbWFnZS94LWFkb2JlLWRuZydcblx0XHR9O1xuXHR9XG5cblx0aWYgKFxuXHRcdGNoZWNrKFsweDQ5LCAweDQ5LCAweDJBLCAweDAwXSkgJiZcblx0XHRjaGVjayhbMHgxQywgMHgwMCwgMHhGRSwgMHgwMF0sIHtvZmZzZXQ6IDh9KVxuXHQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnbmVmJyxcblx0XHRcdG1pbWU6ICdpbWFnZS94LW5pa29uLW5lZidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDQ5LCAweDQ5LCAweDU1LCAweDAwLCAweDE4LCAweDAwLCAweDAwLCAweDAwLCAweDg4LCAweEU3LCAweDc0LCAweEQ4XSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAncncyJyxcblx0XHRcdG1pbWU6ICdpbWFnZS94LXBhbmFzb25pYy1ydzInXG5cdFx0fTtcblx0fVxuXG5cdC8vIGByYWZgIGlzIGhlcmUganVzdCB0byBrZWVwIGFsbCB0aGUgcmF3IGltYWdlIGRldGVjdG9ycyB0b2dldGhlci5cblx0aWYgKGNoZWNrU3RyaW5nKCdGVUpJRklMTUNDRC1SQVcnKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdyYWYnLFxuXHRcdFx0bWltZTogJ2ltYWdlL3gtZnVqaWZpbG0tcmFmJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoXG5cdFx0Y2hlY2soWzB4NDksIDB4NDksIDB4MkEsIDB4MF0pIHx8XG5cdFx0Y2hlY2soWzB4NEQsIDB4NEQsIDB4MCwgMHgyQV0pXG5cdCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICd0aWYnLFxuXHRcdFx0bWltZTogJ2ltYWdlL3RpZmYnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg0MiwgMHg0RF0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2JtcCcsXG5cdFx0XHRtaW1lOiAnaW1hZ2UvYm1wJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NDksIDB4NDksIDB4QkNdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdqeHInLFxuXHRcdFx0bWltZTogJ2ltYWdlL3ZuZC5tcy1waG90bydcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDM4LCAweDQyLCAweDUwLCAweDUzXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAncHNkJyxcblx0XHRcdG1pbWU6ICdpbWFnZS92bmQuYWRvYmUucGhvdG9zaG9wJ1xuXHRcdH07XG5cdH1cblxuXHQvLyBaaXAtYmFzZWQgZmlsZSBmb3JtYXRzXG5cdC8vIE5lZWQgdG8gYmUgYmVmb3JlIHRoZSBgemlwYCBjaGVja1xuXHRjb25zdCB6aXBIZWFkZXIgPSBbMHg1MCwgMHg0QiwgMHgzLCAweDRdO1xuXHRpZiAoY2hlY2soemlwSGVhZGVyKSkge1xuXHRcdGlmIChcblx0XHRcdGNoZWNrKFsweDZELCAweDY5LCAweDZELCAweDY1LCAweDc0LCAweDc5LCAweDcwLCAweDY1LCAweDYxLCAweDcwLCAweDcwLCAweDZDLCAweDY5LCAweDYzLCAweDYxLCAweDc0LCAweDY5LCAweDZGLCAweDZFLCAweDJGLCAweDY1LCAweDcwLCAweDc1LCAweDYyLCAweDJCLCAweDdBLCAweDY5LCAweDcwXSwge29mZnNldDogMzB9KVxuXHRcdCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZXh0OiAnZXB1YicsXG5cdFx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi9lcHViK3ppcCdcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Ly8gQXNzdW1lcyBzaWduZWQgYC54cGlgIGZyb20gYWRkb25zLm1vemlsbGEub3JnXG5cdFx0aWYgKGNoZWNrKHhwaVppcEZpbGVuYW1lLCB7b2Zmc2V0OiAzMH0pKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRleHQ6ICd4cGknLFxuXHRcdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC14cGluc3RhbGwnXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGlmIChjaGVja1N0cmluZygnbWltZXR5cGVhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnRleHQnLCB7b2Zmc2V0OiAzMH0pKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRleHQ6ICdvZHQnLFxuXHRcdFx0XHRtaW1lOiAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC50ZXh0J1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAoY2hlY2tTdHJpbmcoJ21pbWV0eXBlYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5zcHJlYWRzaGVldCcsIHtvZmZzZXQ6IDMwfSkpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV4dDogJ29kcycsXG5cdFx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnNwcmVhZHNoZWV0J1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAoY2hlY2tTdHJpbmcoJ21pbWV0eXBlYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5wcmVzZW50YXRpb24nLCB7b2Zmc2V0OiAzMH0pKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRleHQ6ICdvZHAnLFxuXHRcdFx0XHRtaW1lOiAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5wcmVzZW50YXRpb24nXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8vIFRoZSBkb2N4LCB4bHN4IGFuZCBwcHR4IGZpbGUgdHlwZXMgZXh0ZW5kIHRoZSBPZmZpY2UgT3BlbiBYTUwgZmlsZSBmb3JtYXQ6XG5cdFx0Ly8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvT2ZmaWNlX09wZW5fWE1MX2ZpbGVfZm9ybWF0c1xuXHRcdC8vIFdlIGxvb2sgZm9yOlxuXHRcdC8vIC0gb25lIGVudHJ5IG5hbWVkICdbQ29udGVudF9UeXBlc10ueG1sJyBvciAnX3JlbHMvLnJlbHMnLFxuXHRcdC8vIC0gb25lIGVudHJ5IGluZGljYXRpbmcgc3BlY2lmaWMgdHlwZSBvZiBmaWxlLlxuXHRcdC8vIE1TIE9mZmljZSwgT3Blbk9mZmljZSBhbmQgTGlicmVPZmZpY2UgbWF5IHB1dCB0aGUgcGFydHMgaW4gZGlmZmVyZW50IG9yZGVyLCBzbyB0aGUgY2hlY2sgc2hvdWxkIG5vdCByZWx5IG9uIGl0LlxuXHRcdGxldCB6aXBIZWFkZXJJbmRleCA9IDA7IC8vIFRoZSBmaXJzdCB6aXAgaGVhZGVyIHdhcyBhbHJlYWR5IGZvdW5kIGF0IGluZGV4IDBcblx0XHRsZXQgb3htbEZvdW5kID0gZmFsc2U7XG5cdFx0bGV0IHR5cGU7XG5cblx0XHRkbyB7XG5cdFx0XHRjb25zdCBvZmZzZXQgPSB6aXBIZWFkZXJJbmRleCArIDMwO1xuXG5cdFx0XHRpZiAoIW94bWxGb3VuZCkge1xuXHRcdFx0XHRveG1sRm91bmQgPSAoY2hlY2sob3htbENvbnRlbnRUeXBlcywge29mZnNldH0pIHx8IGNoZWNrKG94bWxSZWxzLCB7b2Zmc2V0fSkpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXR5cGUpIHtcblx0XHRcdFx0aWYgKGNoZWNrU3RyaW5nKCd3b3JkLycsIHtvZmZzZXR9KSkge1xuXHRcdFx0XHRcdHR5cGUgPSB7XG5cdFx0XHRcdFx0XHRleHQ6ICdkb2N4Jyxcblx0XHRcdFx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC5kb2N1bWVudCdcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9IGVsc2UgaWYgKGNoZWNrU3RyaW5nKCdwcHQvJywge29mZnNldH0pKSB7XG5cdFx0XHRcdFx0dHlwZSA9IHtcblx0XHRcdFx0XHRcdGV4dDogJ3BwdHgnLFxuXHRcdFx0XHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5wcmVzZW50YXRpb24nXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fSBlbHNlIGlmIChjaGVja1N0cmluZygneGwvJywge29mZnNldH0pKSB7XG5cdFx0XHRcdFx0dHlwZSA9IHtcblx0XHRcdFx0XHRcdGV4dDogJ3hsc3gnLFxuXHRcdFx0XHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnNoZWV0J1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG94bWxGb3VuZCAmJiB0eXBlKSB7XG5cdFx0XHRcdHJldHVybiB0eXBlO1xuXHRcdFx0fVxuXG5cdFx0XHR6aXBIZWFkZXJJbmRleCA9IG11bHRpQnl0ZUluZGV4T2YoYnVmZmVyLCB6aXBIZWFkZXIsIG9mZnNldCk7XG5cdFx0fSB3aGlsZSAoemlwSGVhZGVySW5kZXggPj0gMCk7XG5cblx0XHQvLyBObyBtb3JlIHppcCBwYXJ0cyBhdmFpbGFibGUgaW4gdGhlIGJ1ZmZlciwgYnV0IG1heWJlIHdlIGFyZSBhbG1vc3QgY2VydGFpbiBhYm91dCB0aGUgdHlwZT9cblx0XHRpZiAodHlwZSkge1xuXHRcdFx0cmV0dXJuIHR5cGU7XG5cdFx0fVxuXHR9XG5cblx0aWYgKFxuXHRcdGNoZWNrKFsweDUwLCAweDRCXSkgJiZcblx0XHQoYnVmZmVyWzJdID09PSAweDMgfHwgYnVmZmVyWzJdID09PSAweDUgfHwgYnVmZmVyWzJdID09PSAweDcpICYmXG5cdFx0KGJ1ZmZlclszXSA9PT0gMHg0IHx8IGJ1ZmZlclszXSA9PT0gMHg2IHx8IGJ1ZmZlclszXSA9PT0gMHg4KVxuXHQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnemlwJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi96aXAnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChcblx0XHRjaGVjayhbMHgzMCwgMHgzMCwgMHgzMCwgMHgzMCwgMHgzMCwgMHgzMF0sIHtvZmZzZXQ6IDE0OCwgbWFzazogWzB4RjgsIDB4RjgsIDB4RjgsIDB4RjgsIDB4RjgsIDB4RjhdfSkgJiYgLy8gVmFsaWQgdGFyIGNoZWNrc3VtXG5cdFx0dGFySGVhZGVyQ2hlY2tzdW1NYXRjaGVzKGJ1ZmZlcilcblx0KSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3RhcicsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC10YXInXG5cdFx0fTtcblx0fVxuXG5cdGlmIChcblx0XHRjaGVjayhbMHg1MiwgMHg2MSwgMHg3MiwgMHgyMSwgMHgxQSwgMHg3XSkgJiZcblx0XHQoYnVmZmVyWzZdID09PSAweDAgfHwgYnVmZmVyWzZdID09PSAweDEpXG5cdCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdyYXInLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3gtcmFyLWNvbXByZXNzZWQnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHgxRiwgMHg4QiwgMHg4XSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnZ3onLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL2d6aXAnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg0MiwgMHg1QSwgMHg2OF0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2J6MicsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC1iemlwMidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDM3LCAweDdBLCAweEJDLCAweEFGLCAweDI3LCAweDFDXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnN3onLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3gtN3otY29tcHJlc3NlZCdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDc4LCAweDAxXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnZG1nJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LWFwcGxlLWRpc2tpbWFnZSdcblx0XHR9O1xuXHR9XG5cblx0Ly8gYG1vdmAgZm9ybWF0IHZhcmlhbnRzXG5cdGlmIChcblx0XHRjaGVjayhbMHg2NiwgMHg3MiwgMHg2NSwgMHg2NV0sIHtvZmZzZXQ6IDR9KSB8fCAvLyBgZnJlZWBcblx0XHRjaGVjayhbMHg2RCwgMHg2NCwgMHg2MSwgMHg3NF0sIHtvZmZzZXQ6IDR9KSB8fCAvLyBgbWRhdGAgTUpQRUdcblx0XHRjaGVjayhbMHg2RCwgMHg2RiwgMHg2RiwgMHg3Nl0sIHtvZmZzZXQ6IDR9KSB8fCAvLyBgbW9vdmBcblx0XHRjaGVjayhbMHg3NywgMHg2OSwgMHg2NCwgMHg2NV0sIHtvZmZzZXQ6IDR9KSAvLyBgd2lkZWBcblx0KSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ21vdicsXG5cdFx0XHRtaW1lOiAndmlkZW8vcXVpY2t0aW1lJ1xuXHRcdH07XG5cdH1cblxuXHQvLyBGaWxlIFR5cGUgQm94IChodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JU09fYmFzZV9tZWRpYV9maWxlX2Zvcm1hdClcblx0Ly8gSXQncyBub3QgcmVxdWlyZWQgdG8gYmUgZmlyc3QsIGJ1dCBpdCdzIHJlY29tbWVuZGVkIHRvIGJlLiBBbG1vc3QgYWxsIElTTyBiYXNlIG1lZGlhIGZpbGVzIHN0YXJ0IHdpdGggYGZ0eXBgIGJveC5cblx0Ly8gYGZ0eXBgIGJveCBtdXN0IGNvbnRhaW4gYSBicmFuZCBtYWpvciBpZGVudGlmaWVyLCB3aGljaCBtdXN0IGNvbnNpc3Qgb2YgSVNPIDg4NTktMSBwcmludGFibGUgY2hhcmFjdGVycy5cblx0Ly8gSGVyZSB3ZSBjaGVjayBmb3IgODg1OS0xIHByaW50YWJsZSBjaGFyYWN0ZXJzIChmb3Igc2ltcGxpY2l0eSwgaXQncyBhIG1hc2sgd2hpY2ggYWxzbyBjYXRjaGVzIG9uZSBub24tcHJpbnRhYmxlIGNoYXJhY3RlcikuXG5cdGlmIChcblx0XHRjaGVjayhbMHg2NiwgMHg3NCwgMHg3OSwgMHg3MF0sIHtvZmZzZXQ6IDR9KSAmJiAvLyBgZnR5cGBcblx0XHQoYnVmZmVyWzhdICYgMHg2MCkgIT09IDB4MDAgJiYgKGJ1ZmZlcls5XSAmIDB4NjApICE9PSAweDAwICYmIChidWZmZXJbMTBdICYgMHg2MCkgIT09IDB4MDAgJiYgKGJ1ZmZlclsxMV0gJiAweDYwKSAhPT0gMHgwMCAvLyBCcmFuZCBtYWpvclxuXHQpIHtcblx0XHQvLyBUaGV5IGFsbCBjYW4gaGF2ZSBNSU1FIGB2aWRlby9tcDRgIGV4Y2VwdCBgYXBwbGljYXRpb24vbXA0YCBzcGVjaWFsLWNhc2Ugd2hpY2ggaXMgaGFyZCB0byBkZXRlY3QuXG5cdFx0Ly8gRm9yIHNvbWUgY2FzZXMsIHdlJ3JlIHNwZWNpZmljLCBldmVyeXRoaW5nIGVsc2UgZmFsbHMgdG8gYHZpZGVvL21wNGAgd2l0aCBgbXA0YCBleHRlbnNpb24uXG5cdFx0Y29uc3QgYnJhbmRNYWpvciA9IHVpbnQ4QXJyYXlVdGY4Qnl0ZVN0cmluZyhidWZmZXIsIDgsIDEyKTtcblx0XHRzd2l0Y2ggKGJyYW5kTWFqb3IpIHtcblx0XHRcdGNhc2UgJ21pZjEnOlxuXHRcdFx0XHRyZXR1cm4ge2V4dDogJ2hlaWMnLCBtaW1lOiAnaW1hZ2UvaGVpZid9O1xuXHRcdFx0Y2FzZSAnbXNmMSc6XG5cdFx0XHRcdHJldHVybiB7ZXh0OiAnaGVpYycsIG1pbWU6ICdpbWFnZS9oZWlmLXNlcXVlbmNlJ307XG5cdFx0XHRjYXNlICdoZWljJzogY2FzZSAnaGVpeCc6XG5cdFx0XHRcdHJldHVybiB7ZXh0OiAnaGVpYycsIG1pbWU6ICdpbWFnZS9oZWljJ307XG5cdFx0XHRjYXNlICdoZXZjJzogY2FzZSAnaGV2eCc6XG5cdFx0XHRcdHJldHVybiB7ZXh0OiAnaGVpYycsIG1pbWU6ICdpbWFnZS9oZWljLXNlcXVlbmNlJ307XG5cdFx0XHRjYXNlICdxdCAgJzpcblx0XHRcdFx0cmV0dXJuIHtleHQ6ICdtb3YnLCBtaW1lOiAndmlkZW8vcXVpY2t0aW1lJ307XG5cdFx0XHRjYXNlICdNNFYgJzogY2FzZSAnTTRWSCc6IGNhc2UgJ000VlAnOlxuXHRcdFx0XHRyZXR1cm4ge2V4dDogJ200dicsIG1pbWU6ICd2aWRlby94LW00did9O1xuXHRcdFx0Y2FzZSAnTTRQICc6XG5cdFx0XHRcdHJldHVybiB7ZXh0OiAnbTRwJywgbWltZTogJ3ZpZGVvL21wNCd9O1xuXHRcdFx0Y2FzZSAnTTRCICc6XG5cdFx0XHRcdHJldHVybiB7ZXh0OiAnbTRiJywgbWltZTogJ2F1ZGlvL21wNCd9O1xuXHRcdFx0Y2FzZSAnTTRBICc6XG5cdFx0XHRcdHJldHVybiB7ZXh0OiAnbTRhJywgbWltZTogJ2F1ZGlvL3gtbTRhJ307XG5cdFx0XHRjYXNlICdGNFYgJzpcblx0XHRcdFx0cmV0dXJuIHtleHQ6ICdmNHYnLCBtaW1lOiAndmlkZW8vbXA0J307XG5cdFx0XHRjYXNlICdGNFAgJzpcblx0XHRcdFx0cmV0dXJuIHtleHQ6ICdmNHAnLCBtaW1lOiAndmlkZW8vbXA0J307XG5cdFx0XHRjYXNlICdGNEEgJzpcblx0XHRcdFx0cmV0dXJuIHtleHQ6ICdmNGEnLCBtaW1lOiAnYXVkaW8vbXA0J307XG5cdFx0XHRjYXNlICdGNEIgJzpcblx0XHRcdFx0cmV0dXJuIHtleHQ6ICdmNGInLCBtaW1lOiAnYXVkaW8vbXA0J307XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRpZiAoYnJhbmRNYWpvci5zdGFydHNXaXRoKCczZycpKSB7XG5cdFx0XHRcdFx0aWYgKGJyYW5kTWFqb3Iuc3RhcnRzV2l0aCgnM2cyJykpIHtcblx0XHRcdFx0XHRcdHJldHVybiB7ZXh0OiAnM2cyJywgbWltZTogJ3ZpZGVvLzNncHAyJ307XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIHtleHQ6ICczZ3AnLCBtaW1lOiAndmlkZW8vM2dwcCd9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHtleHQ6ICdtcDQnLCBtaW1lOiAndmlkZW8vbXA0J307XG5cdFx0fVxuXHR9XG5cblx0aWYgKGNoZWNrKFsweDRELCAweDU0LCAweDY4LCAweDY0XSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnbWlkJyxcblx0XHRcdG1pbWU6ICdhdWRpby9taWRpJ1xuXHRcdH07XG5cdH1cblxuXHQvLyBodHRwczovL2dpdGh1Yi5jb20vdGhyZWF0c3RhY2svbGlibWFnaWMvYmxvYi9tYXN0ZXIvbWFnaWMvTWFnZGlyL21hdHJvc2thXG5cdGlmIChjaGVjayhbMHgxQSwgMHg0NSwgMHhERiwgMHhBM10pKSB7XG5cdFx0Y29uc3Qgc2xpY2VkID0gYnVmZmVyLnN1YmFycmF5KDQsIDQgKyA0MDk2KTtcblx0XHRjb25zdCBpZFBvcyA9IHNsaWNlZC5maW5kSW5kZXgoKGVsLCBpLCBhcnIpID0+IGFycltpXSA9PT0gMHg0MiAmJiBhcnJbaSArIDFdID09PSAweDgyKTtcblxuXHRcdGlmIChpZFBvcyAhPT0gLTEpIHtcblx0XHRcdGNvbnN0IGRvY1R5cGVQb3MgPSBpZFBvcyArIDM7XG5cdFx0XHRjb25zdCBmaW5kRG9jVHlwZSA9IHR5cGUgPT4gWy4uLnR5cGVdLmV2ZXJ5KChjLCBpKSA9PiBzbGljZWRbZG9jVHlwZVBvcyArIGldID09PSBjLmNoYXJDb2RlQXQoMCkpO1xuXG5cdFx0XHRpZiAoZmluZERvY1R5cGUoJ21hdHJvc2thJykpIHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRleHQ6ICdta3YnLFxuXHRcdFx0XHRcdG1pbWU6ICd2aWRlby94LW1hdHJvc2thJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZmluZERvY1R5cGUoJ3dlYm0nKSkge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGV4dDogJ3dlYm0nLFxuXHRcdFx0XHRcdG1pbWU6ICd2aWRlby93ZWJtJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFJJRkYgZmlsZSBmb3JtYXQgd2hpY2ggbWlnaHQgYmUgQVZJLCBXQVYsIFFDUCwgZXRjXG5cdGlmIChjaGVjayhbMHg1MiwgMHg0OSwgMHg0NiwgMHg0Nl0pKSB7XG5cdFx0aWYgKGNoZWNrKFsweDQxLCAweDU2LCAweDQ5XSwge29mZnNldDogOH0pKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRleHQ6ICdhdmknLFxuXHRcdFx0XHRtaW1lOiAndmlkZW8vdm5kLmF2aSdcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0aWYgKGNoZWNrKFsweDU3LCAweDQxLCAweDU2LCAweDQ1XSwge29mZnNldDogOH0pKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRleHQ6ICd3YXYnLFxuXHRcdFx0XHRtaW1lOiAnYXVkaW8vdm5kLndhdmUnXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8vIFFMQ00sIFFDUCBmaWxlXG5cdFx0aWYgKGNoZWNrKFsweDUxLCAweDRDLCAweDQzLCAweDREXSwge29mZnNldDogOH0pKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRleHQ6ICdxY3AnLFxuXHRcdFx0XHRtaW1lOiAnYXVkaW8vcWNlbHAnXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXG5cdC8vIEFTRl9IZWFkZXJfT2JqZWN0IGZpcnN0IDgwIGJ5dGVzXG5cdGlmIChjaGVjayhbMHgzMCwgMHgyNiwgMHhCMiwgMHg3NSwgMHg4RSwgMHg2NiwgMHhDRiwgMHgxMSwgMHhBNiwgMHhEOV0pKSB7XG5cdFx0Ly8gU2VhcmNoIGZvciBoZWFkZXIgc2hvdWxkIGJlIGluIGZpcnN0IDFLQiBvZiBmaWxlLlxuXG5cdFx0bGV0IG9mZnNldCA9IDMwO1xuXHRcdGRvIHtcblx0XHRcdGNvbnN0IG9iamVjdFNpemUgPSByZWFkVUludDY0TEUoYnVmZmVyLCBvZmZzZXQgKyAxNik7XG5cdFx0XHRpZiAoY2hlY2soWzB4OTEsIDB4MDcsIDB4REMsIDB4QjcsIDB4QjcsIDB4QTksIDB4Q0YsIDB4MTEsIDB4OEUsIDB4RTYsIDB4MDAsIDB4QzAsIDB4MEMsIDB4MjAsIDB4NTMsIDB4NjVdLCB7b2Zmc2V0fSkpIHtcblx0XHRcdFx0Ly8gU3luYyBvbiBTdHJlYW0tUHJvcGVydGllcy1PYmplY3QgKEI3REMwNzkxLUE5QjctMTFDRi04RUU2LTAwQzAwQzIwNTM2NSlcblx0XHRcdFx0aWYgKGNoZWNrKFsweDQwLCAweDlFLCAweDY5LCAweEY4LCAweDRELCAweDVCLCAweENGLCAweDExLCAweEE4LCAweEZELCAweDAwLCAweDgwLCAweDVGLCAweDVDLCAweDQ0LCAweDJCXSwge29mZnNldDogb2Zmc2V0ICsgMjR9KSkge1xuXHRcdFx0XHRcdC8vIEZvdW5kIGF1ZGlvOlxuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRleHQ6ICd3bWEnLFxuXHRcdFx0XHRcdFx0bWltZTogJ2F1ZGlvL3gtbXMtd21hJ1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoY2hlY2soWzB4QzAsIDB4RUYsIDB4MTksIDB4QkMsIDB4NEQsIDB4NUIsIDB4Q0YsIDB4MTEsIDB4QTgsIDB4RkQsIDB4MDAsIDB4ODAsIDB4NUYsIDB4NUMsIDB4NDQsIDB4MkJdLCB7b2Zmc2V0OiBvZmZzZXQgKyAyNH0pKSB7XG5cdFx0XHRcdFx0Ly8gRm91bmQgdmlkZW86XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdGV4dDogJ3dtdicsXG5cdFx0XHRcdFx0XHRtaW1lOiAndmlkZW8veC1tcy1hc2YnXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRvZmZzZXQgKz0gb2JqZWN0U2l6ZTtcblx0XHR9IHdoaWxlIChvZmZzZXQgKyAyNCA8PSBidWZmZXIubGVuZ3RoKTtcblxuXHRcdC8vIERlZmF1bHQgdG8gQVNGIGdlbmVyaWMgZXh0ZW5zaW9uXG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2FzZicsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24vdm5kLm1zLWFzZidcblx0XHR9O1xuXHR9XG5cblx0aWYgKFxuXHRcdGNoZWNrKFsweDAsIDB4MCwgMHgxLCAweEJBXSkgfHxcblx0XHRjaGVjayhbMHgwLCAweDAsIDB4MSwgMHhCM10pXG5cdCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdtcGcnLFxuXHRcdFx0bWltZTogJ3ZpZGVvL21wZWcnXG5cdFx0fTtcblx0fVxuXG5cdC8vIENoZWNrIGZvciBNUEVHIGhlYWRlciBhdCBkaWZmZXJlbnQgc3RhcnRpbmcgb2Zmc2V0c1xuXHRmb3IgKGxldCBzdGFydCA9IDA7IHN0YXJ0IDwgMiAmJiBzdGFydCA8IChidWZmZXIubGVuZ3RoIC0gMTYpOyBzdGFydCsrKSB7XG5cdFx0aWYgKFxuXHRcdFx0Y2hlY2soWzB4NDksIDB4NDQsIDB4MzNdLCB7b2Zmc2V0OiBzdGFydH0pIHx8IC8vIElEMyBoZWFkZXJcblx0XHRcdGNoZWNrKFsweEZGLCAweEUyXSwge29mZnNldDogc3RhcnQsIG1hc2s6IFsweEZGLCAweEU2XX0pIC8vIE1QRUcgMSBvciAyIExheWVyIDMgaGVhZGVyXG5cdFx0KSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRleHQ6ICdtcDMnLFxuXHRcdFx0XHRtaW1lOiAnYXVkaW8vbXBlZydcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0aWYgKFxuXHRcdFx0Y2hlY2soWzB4RkYsIDB4RTRdLCB7b2Zmc2V0OiBzdGFydCwgbWFzazogWzB4RkYsIDB4RTZdfSkgLy8gTVBFRyAxIG9yIDIgTGF5ZXIgMiBoZWFkZXJcblx0XHQpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV4dDogJ21wMicsXG5cdFx0XHRcdG1pbWU6ICdhdWRpby9tcGVnJ1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAoXG5cdFx0XHRjaGVjayhbMHhGRiwgMHhGOF0sIHtvZmZzZXQ6IHN0YXJ0LCBtYXNrOiBbMHhGRiwgMHhGQ119KSAvLyBNUEVHIDIgbGF5ZXIgMCB1c2luZyBBRFRTXG5cdFx0KSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRleHQ6ICdtcDInLFxuXHRcdFx0XHRtaW1lOiAnYXVkaW8vbXBlZydcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0aWYgKFxuXHRcdFx0Y2hlY2soWzB4RkYsIDB4RjBdLCB7b2Zmc2V0OiBzdGFydCwgbWFzazogWzB4RkYsIDB4RkNdfSkgLy8gTVBFRyA0IGxheWVyIDAgdXNpbmcgQURUU1xuXHRcdCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZXh0OiAnbXA0Jyxcblx0XHRcdFx0bWltZTogJ2F1ZGlvL21wZWcnXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXG5cdC8vIE5lZWRzIHRvIGJlIGJlZm9yZSBgb2dnYCBjaGVja1xuXHRpZiAoY2hlY2soWzB4NEYsIDB4NzAsIDB4NzUsIDB4NzMsIDB4NDgsIDB4NjUsIDB4NjEsIDB4NjRdLCB7b2Zmc2V0OiAyOH0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ29wdXMnLFxuXHRcdFx0bWltZTogJ2F1ZGlvL29wdXMnXG5cdFx0fTtcblx0fVxuXG5cdC8vIElmICdPZ2dTJyBpbiBmaXJzdCAgYnl0ZXMsIHRoZW4gT0dHIGNvbnRhaW5lclxuXHRpZiAoY2hlY2soWzB4NEYsIDB4NjcsIDB4NjcsIDB4NTNdKSkge1xuXHRcdC8vIFRoaXMgaXMgYSBPR0cgY29udGFpbmVyXG5cblx0XHQvLyBJZiAnIHRoZW9yYScgaW4gaGVhZGVyLlxuXHRcdGlmIChjaGVjayhbMHg4MCwgMHg3NCwgMHg2OCwgMHg2NSwgMHg2RiwgMHg3MiwgMHg2MV0sIHtvZmZzZXQ6IDI4fSkpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV4dDogJ29ndicsXG5cdFx0XHRcdG1pbWU6ICd2aWRlby9vZ2cnXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8vIElmICdcXHgwMXZpZGVvJyBpbiBoZWFkZXIuXG5cdFx0aWYgKGNoZWNrKFsweDAxLCAweDc2LCAweDY5LCAweDY0LCAweDY1LCAweDZGLCAweDAwXSwge29mZnNldDogMjh9KSkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZXh0OiAnb2dtJyxcblx0XHRcdFx0bWltZTogJ3ZpZGVvL29nZydcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Ly8gSWYgJyBGTEFDJyBpbiBoZWFkZXIgIGh0dHBzOi8veGlwaC5vcmcvZmxhYy9mYXEuaHRtbFxuXHRcdGlmIChjaGVjayhbMHg3RiwgMHg0NiwgMHg0QywgMHg0MSwgMHg0M10sIHtvZmZzZXQ6IDI4fSkpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV4dDogJ29nYScsXG5cdFx0XHRcdG1pbWU6ICdhdWRpby9vZ2cnXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8vICdTcGVleCAgJyBpbiBoZWFkZXIgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU3BlZXhcblx0XHRpZiAoY2hlY2soWzB4NTMsIDB4NzAsIDB4NjUsIDB4NjUsIDB4NzgsIDB4MjAsIDB4MjBdLCB7b2Zmc2V0OiAyOH0pKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRleHQ6ICdzcHgnLFxuXHRcdFx0XHRtaW1lOiAnYXVkaW8vb2dnJ1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHQvLyBJZiAnXFx4MDF2b3JiaXMnIGluIGhlYWRlclxuXHRcdGlmIChjaGVjayhbMHgwMSwgMHg3NiwgMHg2RiwgMHg3MiwgMHg2MiwgMHg2OSwgMHg3M10sIHtvZmZzZXQ6IDI4fSkpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV4dDogJ29nZycsXG5cdFx0XHRcdG1pbWU6ICdhdWRpby9vZ2cnXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8vIERlZmF1bHQgT0dHIGNvbnRhaW5lciBodHRwczovL3d3dy5pYW5hLm9yZy9hc3NpZ25tZW50cy9tZWRpYS10eXBlcy9hcHBsaWNhdGlvbi9vZ2dcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnb2d4Jyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi9vZ2cnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg2NiwgMHg0QywgMHg2MSwgMHg0M10pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2ZsYWMnLFxuXHRcdFx0bWltZTogJ2F1ZGlvL3gtZmxhYydcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDRELCAweDQxLCAweDQzLCAweDIwXSkpIHsgLy8gJ01BQyAnXG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2FwZScsXG5cdFx0XHRtaW1lOiAnYXVkaW8vYXBlJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NzcsIDB4NzYsIDB4NzAsIDB4NkJdKSkgeyAvLyAnd3Zwaydcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnd3YnLFxuXHRcdFx0bWltZTogJ2F1ZGlvL3dhdnBhY2snXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHgyMywgMHgyMSwgMHg0MSwgMHg0RCwgMHg1MiwgMHgwQV0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2FtcicsXG5cdFx0XHRtaW1lOiAnYXVkaW8vYW1yJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4MjUsIDB4NTAsIDB4NDQsIDB4NDZdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdwZGYnLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3BkZidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDRELCAweDVBXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnZXhlJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LW1zZG93bmxvYWQnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChcblx0XHQoYnVmZmVyWzBdID09PSAweDQzIHx8IGJ1ZmZlclswXSA9PT0gMHg0NikgJiZcblx0XHRjaGVjayhbMHg1NywgMHg1M10sIHtvZmZzZXQ6IDF9KVxuXHQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnc3dmJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaCdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDdCLCAweDVDLCAweDcyLCAweDc0LCAweDY2XSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAncnRmJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi9ydGYnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHgwMCwgMHg2MSwgMHg3MywgMHg2RF0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3dhc20nLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3dhc20nXG5cdFx0fTtcblx0fVxuXG5cdGlmIChcblx0XHRjaGVjayhbMHg3NywgMHg0RiwgMHg0NiwgMHg0Nl0pICYmXG5cdFx0KFxuXHRcdFx0Y2hlY2soWzB4MDAsIDB4MDEsIDB4MDAsIDB4MDBdLCB7b2Zmc2V0OiA0fSkgfHxcblx0XHRcdGNoZWNrKFsweDRGLCAweDU0LCAweDU0LCAweDRGXSwge29mZnNldDogNH0pXG5cdFx0KVxuXHQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnd29mZicsXG5cdFx0XHRtaW1lOiAnZm9udC93b2ZmJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoXG5cdFx0Y2hlY2soWzB4NzcsIDB4NEYsIDB4NDYsIDB4MzJdKSAmJlxuXHRcdChcblx0XHRcdGNoZWNrKFsweDAwLCAweDAxLCAweDAwLCAweDAwXSwge29mZnNldDogNH0pIHx8XG5cdFx0XHRjaGVjayhbMHg0RiwgMHg1NCwgMHg1NCwgMHg0Rl0sIHtvZmZzZXQ6IDR9KVxuXHRcdClcblx0KSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3dvZmYyJyxcblx0XHRcdG1pbWU6ICdmb250L3dvZmYyJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoXG5cdFx0Y2hlY2soWzB4NEMsIDB4NTBdLCB7b2Zmc2V0OiAzNH0pICYmXG5cdFx0KFxuXHRcdFx0Y2hlY2soWzB4MDAsIDB4MDAsIDB4MDFdLCB7b2Zmc2V0OiA4fSkgfHxcblx0XHRcdGNoZWNrKFsweDAxLCAweDAwLCAweDAyXSwge29mZnNldDogOH0pIHx8XG5cdFx0XHRjaGVjayhbMHgwMiwgMHgwMCwgMHgwMl0sIHtvZmZzZXQ6IDh9KVxuXHRcdClcblx0KSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2VvdCcsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24vdm5kLm1zLWZvbnRvYmplY3QnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHgwMCwgMHgwMSwgMHgwMCwgMHgwMCwgMHgwMF0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3R0ZicsXG5cdFx0XHRtaW1lOiAnZm9udC90dGYnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg0RiwgMHg1NCwgMHg1NCwgMHg0RiwgMHgwMF0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ290ZicsXG5cdFx0XHRtaW1lOiAnZm9udC9vdGYnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHgwMCwgMHgwMCwgMHgwMSwgMHgwMF0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2ljbycsXG5cdFx0XHRtaW1lOiAnaW1hZ2UveC1pY29uJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4MDAsIDB4MDAsIDB4MDIsIDB4MDBdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdjdXInLFxuXHRcdFx0bWltZTogJ2ltYWdlL3gtaWNvbidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDQ2LCAweDRDLCAweDU2LCAweDAxXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnZmx2Jyxcblx0XHRcdG1pbWU6ICd2aWRlby94LWZsdidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDI1LCAweDIxXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAncHMnLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3Bvc3RzY3JpcHQnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHhGRCwgMHgzNywgMHg3QSwgMHg1OCwgMHg1QSwgMHgwMF0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3h6Jyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LXh6J1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NTMsIDB4NTEsIDB4NEMsIDB4NjldKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdzcWxpdGUnLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3gtc3FsaXRlMydcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDRFLCAweDQ1LCAweDUzLCAweDFBXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnbmVzJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LW5pbnRlbmRvLW5lcy1yb20nXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg0MywgMHg3MiwgMHgzMiwgMHgzNF0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2NyeCcsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC1nb29nbGUtY2hyb21lLWV4dGVuc2lvbidcblx0XHR9O1xuXHR9XG5cblx0aWYgKFxuXHRcdGNoZWNrKFsweDRELCAweDUzLCAweDQzLCAweDQ2XSkgfHxcblx0XHRjaGVjayhbMHg0OSwgMHg1MywgMHg2MywgMHgyOF0pXG5cdCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdjYWInLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1jYWItY29tcHJlc3NlZCdcblx0XHR9O1xuXHR9XG5cblx0Ly8gTmVlZHMgdG8gYmUgYmVmb3JlIGBhcmAgY2hlY2tcblx0aWYgKGNoZWNrKFsweDIxLCAweDNDLCAweDYxLCAweDcyLCAweDYzLCAweDY4LCAweDNFLCAweDBBLCAweDY0LCAweDY1LCAweDYyLCAweDY5LCAweDYxLCAweDZFLCAweDJELCAweDYyLCAweDY5LCAweDZFLCAweDYxLCAweDcyLCAweDc5XSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnZGViJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LWRlYidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDIxLCAweDNDLCAweDYxLCAweDcyLCAweDYzLCAweDY4LCAweDNFXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnYXInLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3gtdW5peC1hcmNoaXZlJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4RUQsIDB4QUIsIDB4RUUsIDB4REJdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdycG0nLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3gtcnBtJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoXG5cdFx0Y2hlY2soWzB4MUYsIDB4QTBdKSB8fFxuXHRcdGNoZWNrKFsweDFGLCAweDlEXSlcblx0KSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ1onLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3gtY29tcHJlc3MnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg0QywgMHg1QSwgMHg0OSwgMHg1MF0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2x6Jyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LWx6aXAnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHhEMCwgMHhDRiwgMHgxMSwgMHhFMCwgMHhBMSwgMHhCMSwgMHgxQSwgMHhFMSwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgzRV0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ21zaScsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC1tc2knXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHgwNiwgMHgwRSwgMHgyQiwgMHgzNCwgMHgwMiwgMHgwNSwgMHgwMSwgMHgwMSwgMHgwRCwgMHgwMSwgMHgwMiwgMHgwMSwgMHgwMSwgMHgwMl0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ214ZicsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24vbXhmJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NDddLCB7b2Zmc2V0OiA0fSkgJiYgKGNoZWNrKFsweDQ3XSwge29mZnNldDogMTkyfSkgfHwgY2hlY2soWzB4NDddLCB7b2Zmc2V0OiAxOTZ9KSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnbXRzJyxcblx0XHRcdG1pbWU6ICd2aWRlby9tcDJ0J1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NDIsIDB4NEMsIDB4NDUsIDB4NEUsIDB4NDQsIDB4NDUsIDB4NTJdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdibGVuZCcsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC1ibGVuZGVyJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NDIsIDB4NTAsIDB4NDcsIDB4RkJdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdicGcnLFxuXHRcdFx0bWltZTogJ2ltYWdlL2JwZydcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDAwLCAweDAwLCAweDAwLCAweDBDLCAweDZBLCAweDUwLCAweDIwLCAweDIwLCAweDBELCAweDBBLCAweDg3LCAweDBBXSkpIHtcblx0XHQvLyBKUEVHLTIwMDAgZmFtaWx5XG5cblx0XHRpZiAoY2hlY2soWzB4NkEsIDB4NzAsIDB4MzIsIDB4MjBdLCB7b2Zmc2V0OiAyMH0pKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRleHQ6ICdqcDInLFxuXHRcdFx0XHRtaW1lOiAnaW1hZ2UvanAyJ1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAoY2hlY2soWzB4NkEsIDB4NzAsIDB4NzgsIDB4MjBdLCB7b2Zmc2V0OiAyMH0pKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRleHQ6ICdqcHgnLFxuXHRcdFx0XHRtaW1lOiAnaW1hZ2UvanB4J1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAoY2hlY2soWzB4NkEsIDB4NzAsIDB4NkQsIDB4MjBdLCB7b2Zmc2V0OiAyMH0pKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRleHQ6ICdqcG0nLFxuXHRcdFx0XHRtaW1lOiAnaW1hZ2UvanBtJ1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAoY2hlY2soWzB4NkQsIDB4NkEsIDB4NzAsIDB4MzJdLCB7b2Zmc2V0OiAyMH0pKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRleHQ6ICdtajInLFxuXHRcdFx0XHRtaW1lOiAnaW1hZ2UvbWoyJ1xuXHRcdFx0fTtcblx0XHR9XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NDYsIDB4NEYsIDB4NTIsIDB4NERdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdhaWYnLFxuXHRcdFx0bWltZTogJ2F1ZGlvL2FpZmYnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVja1N0cmluZygnPD94bWwgJykpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAneG1sJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94bWwnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg0MiwgMHg0RiwgMHg0RiwgMHg0QiwgMHg0RCwgMHg0RiwgMHg0MiwgMHg0OV0sIHtvZmZzZXQ6IDYwfSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnbW9iaScsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC1tb2JpcG9ja2V0LWVib29rJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4QUIsIDB4NEIsIDB4NTQsIDB4NTgsIDB4MjAsIDB4MzEsIDB4MzEsIDB4QkIsIDB4MEQsIDB4MEEsIDB4MUEsIDB4MEFdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdrdHgnLFxuXHRcdFx0bWltZTogJ2ltYWdlL2t0eCdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDQ0LCAweDQ5LCAweDQzLCAweDREXSwge29mZnNldDogMTI4fSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnZGNtJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi9kaWNvbSdcblx0XHR9O1xuXHR9XG5cblx0Ly8gTXVzZXBhY2ssIFNWN1xuXHRpZiAoY2hlY2soWzB4NEQsIDB4NTAsIDB4MkJdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdtcGMnLFxuXHRcdFx0bWltZTogJ2F1ZGlvL3gtbXVzZXBhY2snXG5cdFx0fTtcblx0fVxuXG5cdC8vIE11c2VwYWNrLCBTVjhcblx0aWYgKGNoZWNrKFsweDRELCAweDUwLCAweDQzLCAweDRCXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnbXBjJyxcblx0XHRcdG1pbWU6ICdhdWRpby94LW11c2VwYWNrJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NDIsIDB4NDUsIDB4NDcsIDB4NDksIDB4NEUsIDB4M0FdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdpY3MnLFxuXHRcdFx0bWltZTogJ3RleHQvY2FsZW5kYXInXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg2NywgMHg2QywgMHg1NCwgMHg0NiwgMHgwMiwgMHgwMCwgMHgwMCwgMHgwMF0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2dsYicsXG5cdFx0XHRtaW1lOiAnbW9kZWwvZ2x0Zi1iaW5hcnknXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHhENCwgMHhDMywgMHhCMiwgMHhBMV0pIHx8IGNoZWNrKFsweEExLCAweEIyLCAweEMzLCAweEQ0XSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAncGNhcCcsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24vdm5kLnRjcGR1bXAucGNhcCdcblx0XHR9O1xuXHR9XG5cblx0Ly8gU29ueSBEU0QgU3RyZWFtIEZpbGUgKERTRilcblx0aWYgKGNoZWNrKFsweDQ0LCAweDUzLCAweDQ0LCAweDIwXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnZHNmJyxcblx0XHRcdG1pbWU6ICdhdWRpby94LWRzZicgLy8gTm9uLXN0YW5kYXJkXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg0QywgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMSwgMHgxNCwgMHgwMiwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHhDMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHg0Nl0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2xuaycsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC5tcy5zaG9ydGN1dCcgLy8gSW52ZW50ZWQgYnkgdXNcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDYyLCAweDZGLCAweDZGLCAweDZCLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDZELCAweDYxLCAweDcyLCAweDZCLCAweDAwLCAweDAwLCAweDAwLCAweDAwXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnYWxpYXMnLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3guYXBwbGUuYWxpYXMnIC8vIEludmVudGVkIGJ5IHVzXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVja1N0cmluZygnQ3JlYXRpdmUgVm9pY2UgRmlsZScpKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3ZvYycsXG5cdFx0XHRtaW1lOiAnYXVkaW8veC12b2MnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHgwQiwgMHg3N10pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2FjMycsXG5cdFx0XHRtaW1lOiAnYXVkaW8vdm5kLmRvbGJ5LmRkLXJhdydcblx0XHR9O1xuXHR9XG5cblx0aWYgKChjaGVjayhbMHg3RSwgMHgxMCwgMHgwNF0pIHx8IGNoZWNrKFsweDdFLCAweDE4LCAweDA0XSkpICYmIGNoZWNrKFsweDMwLCAweDRELCAweDQ5LCAweDQ1XSwge29mZnNldDogNH0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ21pZScsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC1taWUnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg0MSwgMHg1MiwgMHg1MiwgMHg0RiwgMHg1NywgMHgzMSwgMHgwMCwgMHgwMF0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2Fycm93Jyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LWFwYWNoZS1hcnJvdydcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDI3LCAweDBBLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwXSwge29mZnNldDogMn0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3NocCcsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC1lc3JpLXNoYXBlJ1xuXHRcdH07XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZmlsZVR5cGU7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShmaWxlVHlwZSwgJ21pbmltdW1CeXRlcycsIHt2YWx1ZTogNDEwMH0pO1xuXG5maWxlVHlwZS5zdHJlYW0gPSByZWFkYWJsZVN0cmVhbSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdC8vIFVzaW5nIGBldmFsYCB0byB3b3JrIGFyb3VuZCBpc3N1ZXMgd2hlbiBidW5kbGluZyB3aXRoIFdlYnBhY2tcblx0Y29uc3Qgc3RyZWFtID0gZXZhbCgncmVxdWlyZScpKCdzdHJlYW0nKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1ldmFsXG5cblx0cmVhZGFibGVTdHJlYW0ub24oJ2Vycm9yJywgcmVqZWN0KTtcblx0cmVhZGFibGVTdHJlYW0ub25jZSgncmVhZGFibGUnLCAoKSA9PiB7XG5cdFx0Y29uc3QgcGFzcyA9IG5ldyBzdHJlYW0uUGFzc1Rocm91Z2goKTtcblx0XHRjb25zdCBjaHVuayA9IHJlYWRhYmxlU3RyZWFtLnJlYWQobW9kdWxlLmV4cG9ydHMubWluaW11bUJ5dGVzKSB8fCByZWFkYWJsZVN0cmVhbS5yZWFkKCk7XG5cdFx0dHJ5IHtcblx0XHRcdHBhc3MuZmlsZVR5cGUgPSBmaWxlVHlwZShjaHVuayk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0fVxuXG5cdFx0cmVhZGFibGVTdHJlYW0udW5zaGlmdChjaHVuayk7XG5cblx0XHRpZiAoc3RyZWFtLnBpcGVsaW5lKSB7XG5cdFx0XHRyZXNvbHZlKHN0cmVhbS5waXBlbGluZShyZWFkYWJsZVN0cmVhbSwgcGFzcywgKCkgPT4ge30pKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzb2x2ZShyZWFkYWJsZVN0cmVhbS5waXBlKHBhc3MpKTtcblx0XHR9XG5cdH0pO1xufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShmaWxlVHlwZSwgJ2V4dGVuc2lvbnMnLCB7XG5cdGdldCgpIHtcblx0XHRyZXR1cm4gbmV3IFNldChzdXBwb3J0ZWQuZXh0ZW5zaW9ucyk7XG5cdH1cbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZmlsZVR5cGUsICdtaW1lVHlwZXMnLCB7XG5cdGdldCgpIHtcblx0XHRyZXR1cm4gbmV3IFNldChzdXBwb3J0ZWQubWltZVR5cGVzKTtcblx0fVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRleHRlbnNpb25zOiBbXG5cdFx0J2pwZycsXG5cdFx0J3BuZycsXG5cdFx0J2FwbmcnLFxuXHRcdCdnaWYnLFxuXHRcdCd3ZWJwJyxcblx0XHQnZmxpZicsXG5cdFx0J2NyMicsXG5cdFx0J29yZicsXG5cdFx0J2FydycsXG5cdFx0J2RuZycsXG5cdFx0J25lZicsXG5cdFx0J3J3MicsXG5cdFx0J3JhZicsXG5cdFx0J3RpZicsXG5cdFx0J2JtcCcsXG5cdFx0J2p4cicsXG5cdFx0J3BzZCcsXG5cdFx0J3ppcCcsXG5cdFx0J3RhcicsXG5cdFx0J3JhcicsXG5cdFx0J2d6Jyxcblx0XHQnYnoyJyxcblx0XHQnN3onLFxuXHRcdCdkbWcnLFxuXHRcdCdtcDQnLFxuXHRcdCdtaWQnLFxuXHRcdCdta3YnLFxuXHRcdCd3ZWJtJyxcblx0XHQnbW92Jyxcblx0XHQnYXZpJyxcblx0XHQnbXBnJyxcblx0XHQnbXAyJyxcblx0XHQnbXAzJyxcblx0XHQnbTRhJyxcblx0XHQnb2dhJyxcblx0XHQnb2dnJyxcblx0XHQnb2d2Jyxcblx0XHQnb3B1cycsXG5cdFx0J2ZsYWMnLFxuXHRcdCd3YXYnLFxuXHRcdCdzcHgnLFxuXHRcdCdhbXInLFxuXHRcdCdwZGYnLFxuXHRcdCdlcHViJyxcblx0XHQnZXhlJyxcblx0XHQnc3dmJyxcblx0XHQncnRmJyxcblx0XHQnd2FzbScsXG5cdFx0J3dvZmYnLFxuXHRcdCd3b2ZmMicsXG5cdFx0J2VvdCcsXG5cdFx0J3R0ZicsXG5cdFx0J290ZicsXG5cdFx0J2ljbycsXG5cdFx0J2ZsdicsXG5cdFx0J3BzJyxcblx0XHQneHonLFxuXHRcdCdzcWxpdGUnLFxuXHRcdCduZXMnLFxuXHRcdCdjcngnLFxuXHRcdCd4cGknLFxuXHRcdCdjYWInLFxuXHRcdCdkZWInLFxuXHRcdCdhcicsXG5cdFx0J3JwbScsXG5cdFx0J1onLFxuXHRcdCdseicsXG5cdFx0J21zaScsXG5cdFx0J214ZicsXG5cdFx0J210cycsXG5cdFx0J2JsZW5kJyxcblx0XHQnYnBnJyxcblx0XHQnZG9jeCcsXG5cdFx0J3BwdHgnLFxuXHRcdCd4bHN4Jyxcblx0XHQnM2dwJyxcblx0XHQnM2cyJyxcblx0XHQnanAyJyxcblx0XHQnanBtJyxcblx0XHQnanB4Jyxcblx0XHQnbWoyJyxcblx0XHQnYWlmJyxcblx0XHQncWNwJyxcblx0XHQnb2R0Jyxcblx0XHQnb2RzJyxcblx0XHQnb2RwJyxcblx0XHQneG1sJyxcblx0XHQnbW9iaScsXG5cdFx0J2hlaWMnLFxuXHRcdCdjdXInLFxuXHRcdCdrdHgnLFxuXHRcdCdhcGUnLFxuXHRcdCd3dicsXG5cdFx0J3dtdicsXG5cdFx0J3dtYScsXG5cdFx0J2RjbScsXG5cdFx0J2ljcycsXG5cdFx0J2dsYicsXG5cdFx0J3BjYXAnLFxuXHRcdCdkc2YnLFxuXHRcdCdsbmsnLFxuXHRcdCdhbGlhcycsXG5cdFx0J3ZvYycsXG5cdFx0J2FjMycsXG5cdFx0J200dicsXG5cdFx0J200cCcsXG5cdFx0J200YicsXG5cdFx0J2Y0dicsXG5cdFx0J2Y0cCcsXG5cdFx0J2Y0YicsXG5cdFx0J2Y0YScsXG5cdFx0J21pZScsXG5cdFx0J2FzZicsXG5cdFx0J29nbScsXG5cdFx0J29neCcsXG5cdFx0J21wYycsXG5cdFx0J2Fycm93Jyxcblx0XHQnc2hwJ1xuXHRdLFxuXHRtaW1lVHlwZXM6IFtcblx0XHQnaW1hZ2UvanBlZycsXG5cdFx0J2ltYWdlL3BuZycsXG5cdFx0J2ltYWdlL2dpZicsXG5cdFx0J2ltYWdlL3dlYnAnLFxuXHRcdCdpbWFnZS9mbGlmJyxcblx0XHQnaW1hZ2UveC1jYW5vbi1jcjInLFxuXHRcdCdpbWFnZS90aWZmJyxcblx0XHQnaW1hZ2UvYm1wJyxcblx0XHQnaW1hZ2Uvdm5kLm1zLXBob3RvJyxcblx0XHQnaW1hZ2Uvdm5kLmFkb2JlLnBob3Rvc2hvcCcsXG5cdFx0J2FwcGxpY2F0aW9uL2VwdWIremlwJyxcblx0XHQnYXBwbGljYXRpb24veC14cGluc3RhbGwnLFxuXHRcdCdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnRleHQnLFxuXHRcdCdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnNwcmVhZHNoZWV0Jyxcblx0XHQnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5wcmVzZW50YXRpb24nLFxuXHRcdCdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC5kb2N1bWVudCcsXG5cdFx0J2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5wcmVzZW50YXRpb24nLFxuXHRcdCdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5zaGVldCcsXG5cdFx0J2FwcGxpY2F0aW9uL3ppcCcsXG5cdFx0J2FwcGxpY2F0aW9uL3gtdGFyJyxcblx0XHQnYXBwbGljYXRpb24veC1yYXItY29tcHJlc3NlZCcsXG5cdFx0J2FwcGxpY2F0aW9uL2d6aXAnLFxuXHRcdCdhcHBsaWNhdGlvbi94LWJ6aXAyJyxcblx0XHQnYXBwbGljYXRpb24veC03ei1jb21wcmVzc2VkJyxcblx0XHQnYXBwbGljYXRpb24veC1hcHBsZS1kaXNraW1hZ2UnLFxuXHRcdCdhcHBsaWNhdGlvbi94LWFwYWNoZS1hcnJvdycsXG5cdFx0J3ZpZGVvL21wNCcsXG5cdFx0J2F1ZGlvL21pZGknLFxuXHRcdCd2aWRlby94LW1hdHJvc2thJyxcblx0XHQndmlkZW8vd2VibScsXG5cdFx0J3ZpZGVvL3F1aWNrdGltZScsXG5cdFx0J3ZpZGVvL3ZuZC5hdmknLFxuXHRcdCdhdWRpby92bmQud2F2ZScsXG5cdFx0J2F1ZGlvL3FjZWxwJyxcblx0XHQnYXVkaW8veC1tcy13bWEnLFxuXHRcdCd2aWRlby94LW1zLWFzZicsXG5cdFx0J2FwcGxpY2F0aW9uL3ZuZC5tcy1hc2YnLFxuXHRcdCd2aWRlby9tcGVnJyxcblx0XHQndmlkZW8vM2dwcCcsXG5cdFx0J2F1ZGlvL21wZWcnLFxuXHRcdCdhdWRpby9tcDQnLCAvLyBSRkMgNDMzN1xuXHRcdCdhdWRpby9vcHVzJyxcblx0XHQndmlkZW8vb2dnJyxcblx0XHQnYXVkaW8vb2dnJyxcblx0XHQnYXBwbGljYXRpb24vb2dnJyxcblx0XHQnYXVkaW8veC1mbGFjJyxcblx0XHQnYXVkaW8vYXBlJyxcblx0XHQnYXVkaW8vd2F2cGFjaycsXG5cdFx0J2F1ZGlvL2FtcicsXG5cdFx0J2FwcGxpY2F0aW9uL3BkZicsXG5cdFx0J2FwcGxpY2F0aW9uL3gtbXNkb3dubG9hZCcsXG5cdFx0J2FwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoJyxcblx0XHQnYXBwbGljYXRpb24vcnRmJyxcblx0XHQnYXBwbGljYXRpb24vd2FzbScsXG5cdFx0J2ZvbnQvd29mZicsXG5cdFx0J2ZvbnQvd29mZjInLFxuXHRcdCdhcHBsaWNhdGlvbi92bmQubXMtZm9udG9iamVjdCcsXG5cdFx0J2ZvbnQvdHRmJyxcblx0XHQnZm9udC9vdGYnLFxuXHRcdCdpbWFnZS94LWljb24nLFxuXHRcdCd2aWRlby94LWZsdicsXG5cdFx0J2FwcGxpY2F0aW9uL3Bvc3RzY3JpcHQnLFxuXHRcdCdhcHBsaWNhdGlvbi94LXh6Jyxcblx0XHQnYXBwbGljYXRpb24veC1zcWxpdGUzJyxcblx0XHQnYXBwbGljYXRpb24veC1uaW50ZW5kby1uZXMtcm9tJyxcblx0XHQnYXBwbGljYXRpb24veC1nb29nbGUtY2hyb21lLWV4dGVuc2lvbicsXG5cdFx0J2FwcGxpY2F0aW9uL3ZuZC5tcy1jYWItY29tcHJlc3NlZCcsXG5cdFx0J2FwcGxpY2F0aW9uL3gtZGViJyxcblx0XHQnYXBwbGljYXRpb24veC11bml4LWFyY2hpdmUnLFxuXHRcdCdhcHBsaWNhdGlvbi94LXJwbScsXG5cdFx0J2FwcGxpY2F0aW9uL3gtY29tcHJlc3MnLFxuXHRcdCdhcHBsaWNhdGlvbi94LWx6aXAnLFxuXHRcdCdhcHBsaWNhdGlvbi94LW1zaScsXG5cdFx0J2FwcGxpY2F0aW9uL3gtbWllJyxcblx0XHQnYXBwbGljYXRpb24vbXhmJyxcblx0XHQndmlkZW8vbXAydCcsXG5cdFx0J2FwcGxpY2F0aW9uL3gtYmxlbmRlcicsXG5cdFx0J2ltYWdlL2JwZycsXG5cdFx0J2ltYWdlL2pwMicsXG5cdFx0J2ltYWdlL2pweCcsXG5cdFx0J2ltYWdlL2pwbScsXG5cdFx0J2ltYWdlL21qMicsXG5cdFx0J2F1ZGlvL2FpZmYnLFxuXHRcdCdhcHBsaWNhdGlvbi94bWwnLFxuXHRcdCdhcHBsaWNhdGlvbi94LW1vYmlwb2NrZXQtZWJvb2snLFxuXHRcdCdpbWFnZS9oZWlmJyxcblx0XHQnaW1hZ2UvaGVpZi1zZXF1ZW5jZScsXG5cdFx0J2ltYWdlL2hlaWMnLFxuXHRcdCdpbWFnZS9oZWljLXNlcXVlbmNlJyxcblx0XHQnaW1hZ2Uva3R4Jyxcblx0XHQnYXBwbGljYXRpb24vZGljb20nLFxuXHRcdCdhdWRpby94LW11c2VwYWNrJyxcblx0XHQndGV4dC9jYWxlbmRhcicsXG5cdFx0J21vZGVsL2dsdGYtYmluYXJ5Jyxcblx0XHQnYXBwbGljYXRpb24vdm5kLnRjcGR1bXAucGNhcCcsXG5cdFx0J2F1ZGlvL3gtZHNmJywgLy8gTm9uLXN0YW5kYXJkXG5cdFx0J2FwcGxpY2F0aW9uL3gubXMuc2hvcnRjdXQnLCAvLyBJbnZlbnRlZCBieSB1c1xuXHRcdCdhcHBsaWNhdGlvbi94LmFwcGxlLmFsaWFzJywgLy8gSW52ZW50ZWQgYnkgdXNcblx0XHQnYXVkaW8veC12b2MnLFxuXHRcdCdhdWRpby92bmQuZG9sYnkuZGQtcmF3Jyxcblx0XHQnYXVkaW8veC1tNGEnLFxuXHRcdCdpbWFnZS9hcG5nJyxcblx0XHQnaW1hZ2UveC1vbHltcHVzLW9yZicsXG5cdFx0J2ltYWdlL3gtc29ueS1hcncnLFxuXHRcdCdpbWFnZS94LWFkb2JlLWRuZycsXG5cdFx0J2ltYWdlL3gtbmlrb24tbmVmJyxcblx0XHQnaW1hZ2UveC1wYW5hc29uaWMtcncyJyxcblx0XHQnaW1hZ2UveC1mdWppZmlsbS1yYWYnLFxuXHRcdCd2aWRlby94LW00dicsXG5cdFx0J3ZpZGVvLzNncHAyJyxcblx0XHQnYXBwbGljYXRpb24veC1lc3JpLXNoYXBlJ1xuXHRdXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLnN0cmluZ1RvQnl0ZXMgPSBzdHJpbmcgPT4gWy4uLnN0cmluZ10ubWFwKGNoYXJhY3RlciA9PiBjaGFyYWN0ZXIuY2hhckNvZGVBdCgwKSk7XG5cbmNvbnN0IHVpbnQ4QXJyYXlVdGY4Qnl0ZVN0cmluZyA9IChhcnJheSwgc3RhcnQsIGVuZCkgPT4ge1xuXHRyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSguLi5hcnJheS5zbGljZShzdGFydCwgZW5kKSk7XG59O1xuXG5leHBvcnRzLnJlYWRVSW50NjRMRSA9IChidWZmZXIsIG9mZnNldCA9IDApID0+IHtcblx0bGV0IG4gPSBidWZmZXJbb2Zmc2V0XTtcblx0bGV0IG11bCA9IDE7XG5cdGxldCBpID0gMDtcblxuXHR3aGlsZSAoKytpIDwgOCkge1xuXHRcdG11bCAqPSAweDEwMDtcblx0XHRuICs9IGJ1ZmZlcltvZmZzZXQgKyBpXSAqIG11bDtcblx0fVxuXG5cdHJldHVybiBuO1xufTtcblxuZXhwb3J0cy50YXJIZWFkZXJDaGVja3N1bU1hdGNoZXMgPSBidWZmZXIgPT4geyAvLyBEb2VzIG5vdCBjaGVjayBpZiBjaGVja3N1bSBmaWVsZCBjaGFyYWN0ZXJzIGFyZSB2YWxpZFxuXHRpZiAoYnVmZmVyLmxlbmd0aCA8IDUxMikgeyAvLyBgdGFyYCBoZWFkZXIgc2l6ZSwgY2Fubm90IGNvbXB1dGUgY2hlY2tzdW0gd2l0aG91dCBpdFxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGNvbnN0IE1BU0tfOFRIX0JJVCA9IDB4ODA7XG5cblx0bGV0IHN1bSA9IDI1NjsgLy8gSW50aXRhbGl6ZSBzdW0sIHdpdGggMjU2IGFzIHN1bSBvZiA4IHNwYWNlcyBpbiBjaGVja3N1bSBmaWVsZFxuXHRsZXQgc2lnbmVkQml0U3VtID0gMDsgLy8gSW5pdGlhbGl6ZSBzaWduZWQgYml0IHN1bVxuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgMTQ4OyBpKyspIHtcblx0XHRjb25zdCBieXRlID0gYnVmZmVyW2ldO1xuXHRcdHN1bSArPSBieXRlO1xuXHRcdHNpZ25lZEJpdFN1bSArPSBieXRlICYgTUFTS184VEhfQklUOyAvLyBBZGQgc2lnbmVkIGJpdCB0byBzaWduZWQgYml0IHN1bVxuXHR9XG5cblx0Ly8gU2tpcCBjaGVja3N1bSBmaWVsZFxuXG5cdGZvciAobGV0IGkgPSAxNTY7IGkgPCA1MTI7IGkrKykge1xuXHRcdGNvbnN0IGJ5dGUgPSBidWZmZXJbaV07XG5cdFx0c3VtICs9IGJ5dGU7XG5cdFx0c2lnbmVkQml0U3VtICs9IGJ5dGUgJiBNQVNLXzhUSF9CSVQ7IC8vIEFkZCBzaWduZWQgYml0IHRvIHNpZ25lZCBiaXQgc3VtXG5cdH1cblxuXHRjb25zdCByZWFkU3VtID0gcGFyc2VJbnQodWludDhBcnJheVV0ZjhCeXRlU3RyaW5nKGJ1ZmZlciwgMTQ4LCAxNTQpLCA4KTsgLy8gUmVhZCBzdW0gaW4gaGVhZGVyXG5cblx0Ly8gU29tZSBpbXBsZW1lbnRhdGlvbnMgY29tcHV0ZSBjaGVja3N1bSBpbmNvcnJlY3RseSB1c2luZyBzaWduZWQgYnl0ZXNcblx0cmV0dXJuIChcblx0XHQvLyBDaGVja3N1bSBpbiBoZWFkZXIgZXF1YWxzIHRoZSBzdW0gd2UgY2FsY3VsYXRlZFxuXHRcdHJlYWRTdW0gPT09IHN1bSB8fFxuXG5cdFx0Ly8gQ2hlY2tzdW0gaW4gaGVhZGVyIGVxdWFscyBzdW0gd2UgY2FsY3VsYXRlZCBwbHVzIHNpZ25lZC10by11bnNpZ25lZCBkZWx0YVxuXHRcdHJlYWRTdW0gPT09IChzdW0gLSAoc2lnbmVkQml0U3VtIDw8IDEpKVxuXHQpO1xufTtcblxuZXhwb3J0cy5tdWx0aUJ5dGVJbmRleE9mID0gKGJ1ZmZlciwgYnl0ZXNUb1NlYXJjaCwgc3RhcnRBdCA9IDApID0+IHtcblx0Ly8gYEJ1ZmZlciNpbmRleE9mKClgIGNhbiBzZWFyY2ggZm9yIG11bHRpcGxlIGJ5dGVzXG5cdGlmIChCdWZmZXIgJiYgQnVmZmVyLmlzQnVmZmVyKGJ1ZmZlcikpIHtcblx0XHRyZXR1cm4gYnVmZmVyLmluZGV4T2YoQnVmZmVyLmZyb20oYnl0ZXNUb1NlYXJjaCksIHN0YXJ0QXQpO1xuXHR9XG5cblx0Y29uc3QgbmV4dEJ5dGVzTWF0Y2ggPSAoYnVmZmVyLCBieXRlcywgc3RhcnRJbmRleCkgPT4ge1xuXHRcdGZvciAobGV0IGkgPSAxOyBpIDwgYnl0ZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmIChieXRlc1tpXSAhPT0gYnVmZmVyW3N0YXJ0SW5kZXggKyBpXSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH07XG5cblx0Ly8gYFVpbnQ4QXJyYXkjaW5kZXhPZigpYCBjYW4gc2VhcmNoIGZvciBvbmx5IGEgc2luZ2xlIGJ5dGVcblx0bGV0IGluZGV4ID0gYnVmZmVyLmluZGV4T2YoYnl0ZXNUb1NlYXJjaFswXSwgc3RhcnRBdCk7XG5cdHdoaWxlIChpbmRleCA+PSAwKSB7XG5cdFx0aWYgKG5leHRCeXRlc01hdGNoKGJ1ZmZlciwgYnl0ZXNUb1NlYXJjaCwgaW5kZXgpKSB7XG5cdFx0XHRyZXR1cm4gaW5kZXg7XG5cdFx0fVxuXG5cdFx0aW5kZXggPSBidWZmZXIuaW5kZXhPZihieXRlc1RvU2VhcmNoWzBdLCBpbmRleCArIDEpO1xuXHR9XG5cblx0cmV0dXJuIC0xO1xufTtcblxuZXhwb3J0cy51aW50OEFycmF5VXRmOEJ5dGVTdHJpbmcgPSB1aW50OEFycmF5VXRmOEJ5dGVTdHJpbmc7XG4iLCIvKiEgaWVlZTc1NC4gQlNELTMtQ2xhdXNlIExpY2Vuc2UuIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZy9vcGVuc291cmNlPiAqL1xuZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSAoZSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSAobSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICgodmFsdWUgKiBjKSAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uL2VsZWN0cm9uL2lzc3Vlcy8yMjg4XG5mdW5jdGlvbiBpc0VsZWN0cm9uKCkge1xuICAgIC8vIFJlbmRlcmVyIHByb2Nlc3NcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdy5wcm9jZXNzID09PSAnb2JqZWN0JyAmJiB3aW5kb3cucHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIE1haW4gcHJvY2Vzc1xuICAgIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHByb2Nlc3MudmVyc2lvbnMgPT09ICdvYmplY3QnICYmICEhcHJvY2Vzcy52ZXJzaW9ucy5lbGVjdHJvbikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBEZXRlY3QgdGhlIHVzZXIgYWdlbnQgd2hlbiB0aGUgYG5vZGVJbnRlZ3JhdGlvbmAgb3B0aW9uIGlzIHNldCB0byB0cnVlXG4gICAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgPT09ICdvYmplY3QnICYmIHR5cGVvZiBuYXZpZ2F0b3IudXNlckFnZW50ID09PSAnc3RyaW5nJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0VsZWN0cm9uJykgPj0gMCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNFbGVjdHJvbjtcbiIsIlxuLyoqXG4gKiBFeHBvc2UgYGlzVXJsYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVXJsO1xuXG4vKipcbiAqIFJlZ0V4cHMuXG4gKiBBIFVSTCBtdXN0IG1hdGNoICMxIGFuZCB0aGVuIGF0IGxlYXN0IG9uZSBvZiAjMi8jMy5cbiAqIFVzZSB0d28gbGV2ZWxzIG9mIFJFcyB0byBhdm9pZCBSRURPUy5cbiAqL1xuXG52YXIgcHJvdG9jb2xBbmREb21haW5SRSA9IC9eKD86XFx3KzopP1xcL1xcLyhcXFMrKSQvO1xuXG52YXIgbG9jYWxob3N0RG9tYWluUkUgPSAvXmxvY2FsaG9zdFtcXDo/XFxkXSooPzpbXlxcOj9cXGRdXFxTKik/JC9cbnZhciBub25Mb2NhbGhvc3REb21haW5SRSA9IC9eW15cXHNcXC5dK1xcLlxcU3syLH0kLztcblxuLyoqXG4gKiBMb29zZWx5IHZhbGlkYXRlIGEgVVJMIGBzdHJpbmdgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxuZnVuY3Rpb24gaXNVcmwoc3RyaW5nKXtcbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIG1hdGNoID0gc3RyaW5nLm1hdGNoKHByb3RvY29sQW5kRG9tYWluUkUpO1xuICBpZiAoIW1hdGNoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGV2ZXJ5dGhpbmdBZnRlclByb3RvY29sID0gbWF0Y2hbMV07XG4gIGlmICghZXZlcnl0aGluZ0FmdGVyUHJvdG9jb2wpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAobG9jYWxob3N0RG9tYWluUkUudGVzdChldmVyeXRoaW5nQWZ0ZXJQcm90b2NvbCkgfHxcbiAgICAgIG5vbkxvY2FsaG9zdERvbWFpblJFLnRlc3QoZXZlcnl0aGluZ0FmdGVyUHJvdG9jb2wpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbnZhciBydW50aW1lID0gKGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgZnVuY3Rpb24gZGVmaW5lKG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIG9ialtrZXldO1xuICB9XG4gIHRyeSB7XG4gICAgLy8gSUUgOCBoYXMgYSBicm9rZW4gT2JqZWN0LmRlZmluZVByb3BlcnR5IHRoYXQgb25seSB3b3JrcyBvbiBET00gb2JqZWN0cy5cbiAgICBkZWZpbmUoe30sIFwiXCIpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBkZWZpbmUgPSBmdW5jdGlvbihvYmosIGtleSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XSA9IHZhbHVlO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBleHBvcnRzLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBkZWZpbmUoSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIGRlZmluZShHcCwgXCJjb25zdHJ1Y3RvclwiLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gIGRlZmluZShHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSwgXCJjb25zdHJ1Y3RvclwiLCBHZW5lcmF0b3JGdW5jdGlvbik7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gZGVmaW5lKFxuICAgIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLFxuICAgIHRvU3RyaW5nVGFnU3ltYm9sLFxuICAgIFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICApO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIGRlZmluZShwcm90b3R5cGUsIG1ldGhvZCwgZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBleHBvcnRzLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGRlZmluZShnZW5GdW4sIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvckZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IsIFByb21pc2VJbXBsKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIC8vIElmIGEgcmVqZWN0ZWQgUHJvbWlzZSB3YXMgeWllbGRlZCwgdGhyb3cgdGhlIHJlamVjdGlvbiBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLlxuICAgICAgICAgIHJldHVybiBpbnZva2UoXCJ0aHJvd1wiLCBlcnJvciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2VJbXBsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuICAgICAgICAvLyBJZiBlbnF1ZXVlIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gd2Ugd2FudCB0byB3YWl0IHVudGlsXG4gICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG4gICAgICAgIC8vIGVucXVldWUgaGFzIG5vdCBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gaXQgaXMgaW1wb3J0YW50IHRvXG4gICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuICAgICAgICAvLyBhbnkgbmVjZXNzYXJ5IHNldHVwIGluIGEgcHJlZGljdGFibGUgd2F5LiBUaGlzIHByZWRpY3RhYmlsaXR5XG4gICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG4gICAgICAgIC8vIGV4ZWN1dGUgY29kZSBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0LiBTaW5jZSB3ZSBpbXBsZW1lbnQgc2ltcGxlXG4gICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cbiAgICAgICAgcHJldmlvdXNQcm9taXNlID8gcHJldmlvdXNQcm9taXNlLnRoZW4oXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsXG4gICAgICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcbiAgICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmdcbiAgICAgICAgKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcbiAgZGVmaW5lKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlLCBhc3luY0l0ZXJhdG9yU3ltYm9sLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuICBleHBvcnRzLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QsIFByb21pc2VJbXBsKSB7XG4gICAgaWYgKFByb21pc2VJbXBsID09PSB2b2lkIDApIFByb21pc2VJbXBsID0gUHJvbWlzZTtcblxuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSxcbiAgICAgIFByb21pc2VJbXBsXG4gICAgKTtcblxuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAvLyBOb3RlOiBbXCJyZXR1cm5cIl0gbXVzdCBiZSB1c2VkIGZvciBFUzMgcGFyc2luZyBjb21wYXRpYmlsaXR5LlxuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBkZWZpbmUoR3AsIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvclwiKTtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIGRlZmluZShHcCwgaXRlcmF0b3JTeW1ib2wsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9KTtcblxuICBkZWZpbmUoR3AsIFwidG9TdHJpbmdcIiwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgZXhwb3J0cy5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIGV4cG9ydHMudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZVxuICAvLyBvciBub3QsIHJldHVybiB0aGUgcnVudGltZSBvYmplY3Qgc28gdGhhdCB3ZSBjYW4gZGVjbGFyZSB0aGUgdmFyaWFibGVcbiAgLy8gcmVnZW5lcmF0b3JSdW50aW1lIGluIHRoZSBvdXRlciBzY29wZSwgd2hpY2ggYWxsb3dzIHRoaXMgbW9kdWxlIHRvIGJlXG4gIC8vIGluamVjdGVkIGVhc2lseSBieSBgYmluL3JlZ2VuZXJhdG9yIC0taW5jbHVkZS1ydW50aW1lIHNjcmlwdC5qc2AuXG4gIHJldHVybiBleHBvcnRzO1xuXG59KFxuICAvLyBJZiB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGUsIHVzZSBtb2R1bGUuZXhwb3J0c1xuICAvLyBhcyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIG5hbWVzcGFjZS4gT3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBlbXB0eVxuICAvLyBvYmplY3QuIEVpdGhlciB3YXksIHRoZSByZXN1bHRpbmcgb2JqZWN0IHdpbGwgYmUgdXNlZCB0byBpbml0aWFsaXplXG4gIC8vIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgdmFyaWFibGUgYXQgdGhlIHRvcCBvZiB0aGlzIGZpbGUuXG4gIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgPyBtb2R1bGUuZXhwb3J0cyA6IHt9XG4pKTtcblxudHJ5IHtcbiAgcmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbn0gY2F0Y2ggKGFjY2lkZW50YWxTdHJpY3RNb2RlKSB7XG4gIC8vIFRoaXMgbW9kdWxlIHNob3VsZCBub3QgYmUgcnVubmluZyBpbiBzdHJpY3QgbW9kZSwgc28gdGhlIGFib3ZlXG4gIC8vIGFzc2lnbm1lbnQgc2hvdWxkIGFsd2F5cyB3b3JrIHVubGVzcyBzb21ldGhpbmcgaXMgbWlzY29uZmlndXJlZC4gSnVzdFxuICAvLyBpbiBjYXNlIHJ1bnRpbWUuanMgYWNjaWRlbnRhbGx5IHJ1bnMgaW4gc3RyaWN0IG1vZGUsIGluIG1vZGVybiBlbmdpbmVzXG4gIC8vIHdlIGNhbiBleHBsaWNpdGx5IGFjY2VzcyBnbG9iYWxUaGlzLiBJbiBvbGRlciBlbmdpbmVzIHdlIGNhbiBlc2NhcGVcbiAgLy8gc3RyaWN0IG1vZGUgdXNpbmcgYSBnbG9iYWwgRnVuY3Rpb24gY2FsbC4gVGhpcyBjb3VsZCBjb25jZWl2YWJseSBmYWlsXG4gIC8vIGlmIGEgQ29udGVudCBTZWN1cml0eSBQb2xpY3kgZm9yYmlkcyB1c2luZyBGdW5jdGlvbiwgYnV0IGluIHRoYXQgY2FzZVxuICAvLyB0aGUgcHJvcGVyIHNvbHV0aW9uIGlzIHRvIGZpeCB0aGUgYWNjaWRlbnRhbCBzdHJpY3QgbW9kZSBwcm9ibGVtLiBJZlxuICAvLyB5b3UndmUgbWlzY29uZmlndXJlZCB5b3VyIGJ1bmRsZXIgdG8gZm9yY2Ugc3RyaWN0IG1vZGUgYW5kIGFwcGxpZWQgYVxuICAvLyBDU1AgdG8gZm9yYmlkIEZ1bmN0aW9uLCBhbmQgeW91J3JlIG5vdCB3aWxsaW5nIHRvIGZpeCBlaXRoZXIgb2YgdGhvc2VcbiAgLy8gcHJvYmxlbXMsIHBsZWFzZSBkZXRhaWwgeW91ciB1bmlxdWUgcHJlZGljYW1lbnQgaW4gYSBHaXRIdWIgaXNzdWUuXG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gXCJvYmplY3RcIikge1xuICAgIGdsb2JhbFRoaXMucmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbiAgfSBlbHNlIHtcbiAgICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xuICB9XG59XG4iLCJleHBvcnQgY29uc3QgYmlnSW50PSgpPT4oYXN5bmMgZT0+e3RyeXtyZXR1cm4oYXdhaXQgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGUoZSkpLmluc3RhbmNlLmV4cG9ydHMuYihCaWdJbnQoMCkpPT09QmlnSW50KDApfWNhdGNoKGUpe3JldHVybiExfX0pKG5ldyBVaW50OEFycmF5KFswLDk3LDExNSwxMDksMSwwLDAsMCwxLDYsMSw5NiwxLDEyNiwxLDEyNiwzLDIsMSwwLDcsNSwxLDEsOTgsMCwwLDEwLDYsMSw0LDAsMzIsMCwxMV0pKSxidWxrTWVtb3J5PWFzeW5jKCk9PldlYkFzc2VtYmx5LnZhbGlkYXRlKG5ldyBVaW50OEFycmF5KFswLDk3LDExNSwxMDksMSwwLDAsMCwxLDQsMSw5NiwwLDAsMywyLDEsMCw1LDMsMSwwLDEsMTAsMTQsMSwxMiwwLDY1LDAsNjUsMCw2NSwwLDI1MiwxMCwwLDAsMTFdKSksZXhjZXB0aW9ucz1hc3luYygpPT5XZWJBc3NlbWJseS52YWxpZGF0ZShuZXcgVWludDhBcnJheShbMCw5NywxMTUsMTA5LDEsMCwwLDAsMSw0LDEsOTYsMCwwLDMsMiwxLDAsMTAsOCwxLDYsMCw2LDY0LDI1LDExLDExXSkpLG11bHRpVmFsdWU9YXN5bmMoKT0+V2ViQXNzZW1ibHkudmFsaWRhdGUobmV3IFVpbnQ4QXJyYXkoWzAsOTcsMTE1LDEwOSwxLDAsMCwwLDEsNiwxLDk2LDAsMiwxMjcsMTI3LDMsMiwxLDAsMTAsOCwxLDYsMCw2NSwwLDY1LDAsMTFdKSksbXV0YWJsZUdsb2JhbHM9YXN5bmMoKT0+V2ViQXNzZW1ibHkudmFsaWRhdGUobmV3IFVpbnQ4QXJyYXkoWzAsOTcsMTE1LDEwOSwxLDAsMCwwLDIsOCwxLDEsOTcsMSw5OCwzLDEyNywxLDYsNiwxLDEyNywxLDY1LDAsMTEsNyw1LDEsMSw5NywzLDFdKSkscmVmZXJlbmNlVHlwZXM9YXN5bmMoKT0+V2ViQXNzZW1ibHkudmFsaWRhdGUobmV3IFVpbnQ4QXJyYXkoWzAsOTcsMTE1LDEwOSwxLDAsMCwwLDEsNCwxLDk2LDAsMCwzLDIsMSwwLDEwLDcsMSw1LDAsMjA4LDExMiwyNiwxMV0pKSxzYXR1cmF0ZWRGbG9hdFRvSW50PWFzeW5jKCk9PldlYkFzc2VtYmx5LnZhbGlkYXRlKG5ldyBVaW50OEFycmF5KFswLDk3LDExNSwxMDksMSwwLDAsMCwxLDQsMSw5NiwwLDAsMywyLDEsMCwxMCwxMiwxLDEwLDAsNjcsMCwwLDAsMCwyNTIsMCwyNiwxMV0pKSxzaWduRXh0ZW5zaW9ucz1hc3luYygpPT5XZWJBc3NlbWJseS52YWxpZGF0ZShuZXcgVWludDhBcnJheShbMCw5NywxMTUsMTA5LDEsMCwwLDAsMSw0LDEsOTYsMCwwLDMsMiwxLDAsMTAsOCwxLDYsMCw2NSwwLDE5MiwyNiwxMV0pKSxzaW1kPWFzeW5jKCk9PldlYkFzc2VtYmx5LnZhbGlkYXRlKG5ldyBVaW50OEFycmF5KFswLDk3LDExNSwxMDksMSwwLDAsMCwxLDUsMSw5NiwwLDEsMTIzLDMsMiwxLDAsMTAsMTAsMSw4LDAsNjUsMCwyNTMsMTUsMjUzLDk4LDExXSkpLHRhaWxDYWxsPWFzeW5jKCk9PldlYkFzc2VtYmx5LnZhbGlkYXRlKG5ldyBVaW50OEFycmF5KFswLDk3LDExNSwxMDksMSwwLDAsMCwxLDQsMSw5NiwwLDAsMywyLDEsMCwxMCw2LDEsNCwwLDE4LDAsMTFdKSksdGhyZWFkcz0oKT0+KGFzeW5jIGU9Pnt0cnl7cmV0dXJuXCJ1bmRlZmluZWRcIiE9dHlwZW9mIE1lc3NhZ2VDaGFubmVsJiYobmV3IE1lc3NhZ2VDaGFubmVsKS5wb3J0MS5wb3N0TWVzc2FnZShuZXcgU2hhcmVkQXJyYXlCdWZmZXIoMSkpLFdlYkFzc2VtYmx5LnZhbGlkYXRlKGUpfWNhdGNoKGUpe3JldHVybiExfX0pKG5ldyBVaW50OEFycmF5KFswLDk3LDExNSwxMDksMSwwLDAsMCwxLDQsMSw5NiwwLDAsMywyLDEsMCw1LDQsMSwzLDEsMSwxMCwxMSwxLDksMCw2NSwwLDI1NCwxNiwyLDAsMjYsMTFdKSk7XG4iLCIvKiogQGxpY2Vuc2UgemxpYi5qcyAyMDEyIC0gaW1heWEgWyBodHRwczovL2dpdGh1Yi5jb20vaW1heWEvemxpYi5qcyBdIFRoZSBNSVQgTGljZW5zZSAqLyhmdW5jdGlvbigpIHsndXNlIHN0cmljdCc7ZnVuY3Rpb24gcShiKXt0aHJvdyBiO312YXIgdD12b2lkIDAsdj0hMDt2YXIgQj1cInVuZGVmaW5lZFwiIT09dHlwZW9mIFVpbnQ4QXJyYXkmJlwidW5kZWZpbmVkXCIhPT10eXBlb2YgVWludDE2QXJyYXkmJlwidW5kZWZpbmVkXCIhPT10eXBlb2YgVWludDMyQXJyYXkmJlwidW5kZWZpbmVkXCIhPT10eXBlb2YgRGF0YVZpZXc7ZnVuY3Rpb24gRyhiLGEpe3RoaXMuaW5kZXg9XCJudW1iZXJcIj09PXR5cGVvZiBhP2E6MDt0aGlzLm09MDt0aGlzLmJ1ZmZlcj1iIGluc3RhbmNlb2YoQj9VaW50OEFycmF5OkFycmF5KT9iOm5ldyAoQj9VaW50OEFycmF5OkFycmF5KSgzMjc2OCk7Mip0aGlzLmJ1ZmZlci5sZW5ndGg8PXRoaXMuaW5kZXgmJnEoRXJyb3IoXCJpbnZhbGlkIGluZGV4XCIpKTt0aGlzLmJ1ZmZlci5sZW5ndGg8PXRoaXMuaW5kZXgmJnRoaXMuZigpfUcucHJvdG90eXBlLmY9ZnVuY3Rpb24oKXt2YXIgYj10aGlzLmJ1ZmZlcixhLGM9Yi5sZW5ndGgsZD1uZXcgKEI/VWludDhBcnJheTpBcnJheSkoYzw8MSk7aWYoQilkLnNldChiKTtlbHNlIGZvcihhPTA7YTxjOysrYSlkW2FdPWJbYV07cmV0dXJuIHRoaXMuYnVmZmVyPWR9O1xuRy5wcm90b3R5cGUuZD1mdW5jdGlvbihiLGEsYyl7dmFyIGQ9dGhpcy5idWZmZXIsZT10aGlzLmluZGV4LGY9dGhpcy5tLGc9ZFtlXSxrO2MmJjE8YSYmKGI9ODxhPyhJW2ImMjU1XTw8MjR8SVtiPj4+OCYyNTVdPDwxNnxJW2I+Pj4xNiYyNTVdPDw4fElbYj4+PjI0JjI1NV0pPj4zMi1hOklbYl0+PjgtYSk7aWYoOD5hK2YpZz1nPDxhfGIsZis9YTtlbHNlIGZvcihrPTA7azxhOysraylnPWc8PDF8Yj4+YS1rLTEmMSw4PT09KytmJiYoZj0wLGRbZSsrXT1JW2ddLGc9MCxlPT09ZC5sZW5ndGgmJihkPXRoaXMuZigpKSk7ZFtlXT1nO3RoaXMuYnVmZmVyPWQ7dGhpcy5tPWY7dGhpcy5pbmRleD1lfTtHLnByb3RvdHlwZS5maW5pc2g9ZnVuY3Rpb24oKXt2YXIgYj10aGlzLmJ1ZmZlcixhPXRoaXMuaW5kZXgsYzswPHRoaXMubSYmKGJbYV08PD04LXRoaXMubSxiW2FdPUlbYlthXV0sYSsrKTtCP2M9Yi5zdWJhcnJheSgwLGEpOihiLmxlbmd0aD1hLGM9Yik7cmV0dXJuIGN9O1xudmFyIGFhPW5ldyAoQj9VaW50OEFycmF5OkFycmF5KSgyNTYpLEw7Zm9yKEw9MDsyNTY+TDsrK0wpe2Zvcih2YXIgUj1MLGJhPVIsY2E9NyxSPVI+Pj4xO1I7Uj4+Pj0xKWJhPDw9MSxiYXw9UiYxLC0tY2E7YWFbTF09KGJhPDxjYSYyNTUpPj4+MH12YXIgST1hYTtmdW5jdGlvbiBoYShiLGEsYyl7dmFyIGQsZT1cIm51bWJlclwiPT09dHlwZW9mIGE/YTphPTAsZj1cIm51bWJlclwiPT09dHlwZW9mIGM/YzpiLmxlbmd0aDtkPS0xO2ZvcihlPWYmNztlLS07KythKWQ9ZD4+PjheU1soZF5iW2FdKSYyNTVdO2ZvcihlPWY+PjM7ZS0tO2ErPTgpZD1kPj4+OF5TWyhkXmJbYV0pJjI1NV0sZD1kPj4+OF5TWyhkXmJbYSsxXSkmMjU1XSxkPWQ+Pj44XlNbKGReYlthKzJdKSYyNTVdLGQ9ZD4+PjheU1soZF5iW2ErM10pJjI1NV0sZD1kPj4+OF5TWyhkXmJbYSs0XSkmMjU1XSxkPWQ+Pj44XlNbKGReYlthKzVdKSYyNTVdLGQ9ZD4+PjheU1soZF5iW2ErNl0pJjI1NV0sZD1kPj4+OF5TWyhkXmJbYSs3XSkmMjU1XTtyZXR1cm4oZF40Mjk0OTY3Mjk1KT4+PjB9XG52YXIgaWE9WzAsMTk5Njk1OTg5NCwzOTkzOTE5Nzg4LDI1Njc1MjQ3OTQsMTI0NjM0MTM3LDE4ODYwNTc2MTUsMzkxNTYyMTY4NSwyNjU3MzkyMDM1LDI0OTI2ODI3NCwyMDQ0NTA4MzI0LDM3NzIxMTUyMzAsMjU0NzE3Nzg2NCwxNjI5NDE5OTUsMjEyNTU2MTAyMSwzODg3NjA3MDQ3LDI0Mjg0NDQwNDksNDk4NTM2NTQ4LDE3ODk5Mjc2NjYsNDA4OTAxNjY0OCwyMjI3MDYxMjE0LDQ1MDU0ODg2MSwxODQzMjU4NjAzLDQxMDc1ODA3NTMsMjIxMTY3NzYzOSwzMjU4ODM5OTAsMTY4NDc3NzE1Miw0MjUxMTIyMDQyLDIzMjE5MjY2MzYsMzM1NjMzNDg3LDE2NjEzNjU0NjUsNDE5NTMwMjc1NSwyMzY2MTE1MzE3LDk5NzA3MzA5NiwxMjgxOTUzODg2LDM1Nzk4NTUzMzIsMjcyNDY4ODI0MiwxMDA2ODg4MTQ1LDEyNTg2MDc2ODcsMzUyNDEwMTYyOSwyNzY4OTQyNDQzLDkwMTA5NzcyMiwxMTE5MDAwNjg0LDM2ODY1MTcyMDYsMjg5ODA2NTcyOCw4NTMwNDQ0NTEsMTE3MjI2NjEwMSwzNzA1MDE1NzU5LFxuMjg4MjYxNjY2NSw2NTE3Njc5ODAsMTM3MzUwMzU0NiwzMzY5NTU0MzA0LDMyMTgxMDQ1OTgsNTY1NTA3MjUzLDE0NTQ2MjE3MzEsMzQ4NTExMTcwNSwzMDk5NDM2MzAzLDY3MTI2Njk3NCwxNTk0MTk4MDI0LDMzMjI3MzA5MzAsMjk3MDM0NzgxMiw3OTU4MzU1MjcsMTQ4MzIzMDIyNSwzMjQ0MzY3Mjc1LDMwNjAxNDk1NjUsMTk5NDE0NjE5MiwzMTE1ODUzNCwyNTYzOTA3NzcyLDQwMjM3MTc5MzAsMTkwNzQ1OTQ2NSwxMTI2MzcyMTUsMjY4MDE1MzI1MywzOTA0NDI3MDU5LDIwMTM3NzYyOTAsMjUxNzIyMDM2LDI1MTcyMTUzNzQsMzc3NTgzMDA0MCwyMTM3NjU2NzYzLDE0MTM3NjgxMywyNDM5Mjc3NzE5LDM4NjUyNzEyOTcsMTgwMjE5NTQ0NCw0NzY4NjQ4NjYsMjIzODAwMTM2OCw0MDY2NTA4ODc4LDE4MTIzNzA5MjUsNDUzMDkyNzMxLDIxODE2MjUwMjUsNDExMTQ1MTIyMywxNzA2MDg4OTAyLDMxNDA0MjcwNCwyMzQ0NTMyMjAyLDQyNDAwMTc1MzIsMTY1ODY1ODI3MSwzNjY2MTk5NzcsXG4yMzYyNjcwMzIzLDQyMjQ5OTQ0MDUsMTMwMzUzNTk2MCw5ODQ5NjE0ODYsMjc0NzAwNzA5MiwzNTY5MDM3NTM4LDEyNTYxNzA4MTcsMTAzNzYwNDMxMSwyNzY1MjEwNzMzLDM1NTQwNzk5OTUsMTEzMTAxNDUwNiw4Nzk2Nzk5OTYsMjkwOTI0MzQ2MiwzNjYzNzcxODU2LDExNDExMjQ0NjcsODU1ODQyMjc3LDI4NTI4MDE2MzEsMzcwODY0ODY0OSwxMzQyNTMzOTQ4LDY1NDQ1OTMwNiwzMTg4Mzk2MDQ4LDMzNzMwMTUxNzQsMTQ2NjQ3OTkwOSw1NDQxNzk2MzUsMzExMDUyMzkxMywzNDYyNTIyMDE1LDE1OTE2NzEwNTQsNzAyMTM4Nzc2LDI5NjY0NjA0NTAsMzM1Mjc5OTQxMiwxNTA0OTE4ODA3LDc4MzU1MTg3MywzMDgyNjQwNDQzLDMyMzM0NDI5ODksMzk4ODI5MjM4NCwyNTk2MjU0NjQ2LDYyMzE3MDY4LDE5NTc4MTA4NDIsMzkzOTg0NTk0NSwyNjQ3ODE2MTExLDgxNDcwOTk3LDE5NDM4MDM1MjMsMzgxNDkxODkzMCwyNDg5NTk2ODA0LDIyNTI3NDQzMCwyMDUzNzkwMzc2LDM4MjYxNzU3NTUsXG4yNDY2OTA2MDEzLDE2NzgxNjc0MywyMDk3NjUxMzc3LDQwMjc1NTI1ODAsMjI2NTQ5MDM4Niw1MDM0NDQwNzIsMTc2MjA1MDgxNCw0MTUwNDE3MjQ1LDIxNTQxMjkzNTUsNDI2NTIyMjI1LDE4NTI1MDc4NzksNDI3NTMxMzUyNiwyMzEyMzE3OTIwLDI4Mjc1MzYyNiwxNzQyNTU1ODUyLDQxODk3MDgxNDMsMjM5NDg3Nzk0NSwzOTc5MTc3NjMsMTYyMjE4MzYzNywzNjA0MzkwODg4LDI3MTQ4NjY1NTgsOTUzNzI5NzMyLDEzNDAwNzY2MjYsMzUxODcxOTk4NSwyNzk3MzYwOTk5LDEwNjg4MjgzODEsMTIxOTYzODg1OSwzNjI0NzQxODUwLDI5MzY2NzUxNDgsOTA2MTg1NDYyLDEwOTA4MTI1MTIsMzc0NzY3MjAwMywyODI1Mzc5NjY5LDgyOTMyOTEzNSwxMTgxMzM1MTYxLDM0MTIxNzc4MDQsMzE2MDgzNDg0Miw2MjgwODU0MDgsMTM4MjYwNTM2NiwzNDIzMzY5MTA5LDMxMzgwNzg0NjcsNTcwNTYyMjMzLDE0MjY0MDA4MTUsMzMxNzMxNjU0MiwyOTk4NzMzNjA4LDczMzIzOTk1NCwxNTU1MjYxOTU2LFxuMzI2ODkzNTU5MSwzMDUwMzYwNjI1LDc1MjQ1OTQwMywxNTQxMzIwMjIxLDI2MDcwNzE5MjAsMzk2NTk3MzAzMCwxOTY5OTIyOTcyLDQwNzM1NDk4LDI2MTc4MzcyMjUsMzk0MzU3NzE1MSwxOTEzMDg3ODc3LDgzOTA4MzcxLDI1MTIzNDE2MzQsMzgwMzc0MDY5MiwyMDc1MjA4NjIyLDIxMzI2MTExMiwyNDYzMjcyNjAzLDM4NTU5OTAyODUsMjA5NDg1NDA3MSwxOTg5NTg4ODEsMjI2MjAyOTAxMiw0MDU3MjYwNjEwLDE3NTkzNTk5OTIsNTM0NDE0MTkwLDIxNzY3MTg1NDEsNDEzOTMyOTExNSwxODczODM2MDAxLDQxNDY2NDU2NywyMjgyMjQ4OTM0LDQyNzkyMDAzNjgsMTcxMTY4NDU1NCwyODUyODExMTYsMjQwNTgwMTcyNyw0MTY3MjE2NzQ1LDE2MzQ0Njc3OTUsMzc2MjI5NzAxLDI2ODUwNjc4OTYsMzYwODAwNzQwNiwxMzA4OTE4NjEyLDk1NjU0MzkzOCwyODA4NTU1MTA1LDM0OTU5NTgyNjMsMTIzMTYzNjMwMSwxMDQ3NDI3MDM1LDI5MzI5NTk4MTgsMzY1NDcwMzgzNiwxMDg4MzU5MjcwLFxuOTM2OTE4RTMsMjg0NzcxNDg5OSwzNzM2ODM3ODI5LDEyMDI5MDA4NjMsODE3MjMzODk3LDMxODMzNDIxMDgsMzQwMTIzNzEzMCwxNDA0Mjc3NTUyLDYxNTgxODE1MCwzMTM0MjA3NDkzLDM0NTM0MjEyMDMsMTQyMzg1NzQ0OSw2MDE0NTA0MzEsMzAwOTgzNzYxNCwzMjk0NzEwNDU2LDE1NjcxMDM3NDYsNzExOTI4NzI0LDMwMjA2Njg0NzEsMzI3MjM4MDA2NSwxNTEwMzM0MjM1LDc1NTE2NzExN10sUz1CP25ldyBVaW50MzJBcnJheShpYSk6aWE7ZnVuY3Rpb24gamEoKXt9O2Z1bmN0aW9uIGthKGIpe3RoaXMuYnVmZmVyPW5ldyAoQj9VaW50MTZBcnJheTpBcnJheSkoMipiKTt0aGlzLmxlbmd0aD0wfWthLnByb3RvdHlwZS5nZXRQYXJlbnQ9ZnVuY3Rpb24oYil7cmV0dXJuIDIqKChiLTIpLzR8MCl9O2thLnByb3RvdHlwZS5wdXNoPWZ1bmN0aW9uKGIsYSl7dmFyIGMsZCxlPXRoaXMuYnVmZmVyLGY7Yz10aGlzLmxlbmd0aDtlW3RoaXMubGVuZ3RoKytdPWE7Zm9yKGVbdGhpcy5sZW5ndGgrK109YjswPGM7KWlmKGQ9dGhpcy5nZXRQYXJlbnQoYyksZVtjXT5lW2RdKWY9ZVtjXSxlW2NdPWVbZF0sZVtkXT1mLGY9ZVtjKzFdLGVbYysxXT1lW2QrMV0sZVtkKzFdPWYsYz1kO2Vsc2UgYnJlYWs7cmV0dXJuIHRoaXMubGVuZ3RofTtcbmthLnByb3RvdHlwZS5wb3A9ZnVuY3Rpb24oKXt2YXIgYixhLGM9dGhpcy5idWZmZXIsZCxlLGY7YT1jWzBdO2I9Y1sxXTt0aGlzLmxlbmd0aC09MjtjWzBdPWNbdGhpcy5sZW5ndGhdO2NbMV09Y1t0aGlzLmxlbmd0aCsxXTtmb3IoZj0wOzspe2U9MipmKzI7aWYoZT49dGhpcy5sZW5ndGgpYnJlYWs7ZSsyPHRoaXMubGVuZ3RoJiZjW2UrMl0+Y1tlXSYmKGUrPTIpO2lmKGNbZV0+Y1tmXSlkPWNbZl0sY1tmXT1jW2VdLGNbZV09ZCxkPWNbZisxXSxjW2YrMV09Y1tlKzFdLGNbZSsxXT1kO2Vsc2UgYnJlYWs7Zj1lfXJldHVybntpbmRleDpiLHZhbHVlOmEsbGVuZ3RoOnRoaXMubGVuZ3RofX07ZnVuY3Rpb24gVChiKXt2YXIgYT1iLmxlbmd0aCxjPTAsZD1OdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksZSxmLGcsayxoLG0scixwLGwsbjtmb3IocD0wO3A8YTsrK3ApYltwXT5jJiYoYz1iW3BdKSxiW3BdPGQmJihkPWJbcF0pO2U9MTw8YztmPW5ldyAoQj9VaW50MzJBcnJheTpBcnJheSkoZSk7Zz0xO2s9MDtmb3IoaD0yO2c8PWM7KXtmb3IocD0wO3A8YTsrK3ApaWYoYltwXT09PWcpe209MDtyPWs7Zm9yKGw9MDtsPGc7KytsKW09bTw8MXxyJjEscj4+PTE7bj1nPDwxNnxwO2ZvcihsPW07bDxlO2wrPWgpZltsXT1uOysra30rK2c7azw8PTE7aDw8PTF9cmV0dXJuW2YsYyxkXX07ZnVuY3Rpb24gbmEoYixhKXt0aGlzLms9b2E7dGhpcy5GPTA7dGhpcy5pbnB1dD1CJiZiIGluc3RhbmNlb2YgQXJyYXk/bmV3IFVpbnQ4QXJyYXkoYik6Yjt0aGlzLmI9MDthJiYoYS5sYXp5JiYodGhpcy5GPWEubGF6eSksXCJudW1iZXJcIj09PXR5cGVvZiBhLmNvbXByZXNzaW9uVHlwZSYmKHRoaXMuaz1hLmNvbXByZXNzaW9uVHlwZSksYS5vdXRwdXRCdWZmZXImJih0aGlzLmE9QiYmYS5vdXRwdXRCdWZmZXIgaW5zdGFuY2VvZiBBcnJheT9uZXcgVWludDhBcnJheShhLm91dHB1dEJ1ZmZlcik6YS5vdXRwdXRCdWZmZXIpLFwibnVtYmVyXCI9PT10eXBlb2YgYS5vdXRwdXRJbmRleCYmKHRoaXMuYj1hLm91dHB1dEluZGV4KSk7dGhpcy5hfHwodGhpcy5hPW5ldyAoQj9VaW50OEFycmF5OkFycmF5KSgzMjc2OCkpfXZhciBvYT0yLHBhPXtOT05FOjAsTDoxLHQ6b2EsWDozfSxxYT1bXSxVO1xuZm9yKFU9MDsyODg+VTtVKyspc3dpdGNoKHYpe2Nhc2UgMTQzPj1VOnFhLnB1c2goW1UrNDgsOF0pO2JyZWFrO2Nhc2UgMjU1Pj1VOnFhLnB1c2goW1UtMTQ0KzQwMCw5XSk7YnJlYWs7Y2FzZSAyNzk+PVU6cWEucHVzaChbVS0yNTYrMCw3XSk7YnJlYWs7Y2FzZSAyODc+PVU6cWEucHVzaChbVS0yODArMTkyLDhdKTticmVhaztkZWZhdWx0OnEoXCJpbnZhbGlkIGxpdGVyYWw6IFwiK1UpfVxubmEucHJvdG90eXBlLmg9ZnVuY3Rpb24oKXt2YXIgYixhLGMsZCxlPXRoaXMuaW5wdXQ7c3dpdGNoKHRoaXMuayl7Y2FzZSAwOmM9MDtmb3IoZD1lLmxlbmd0aDtjPGQ7KXthPUI/ZS5zdWJhcnJheShjLGMrNjU1MzUpOmUuc2xpY2UoYyxjKzY1NTM1KTtjKz1hLmxlbmd0aDt2YXIgZj1hLGc9Yz09PWQsaz10LGg9dCxtPXQscj10LHA9dCxsPXRoaXMuYSxuPXRoaXMuYjtpZihCKXtmb3IobD1uZXcgVWludDhBcnJheSh0aGlzLmEuYnVmZmVyKTtsLmxlbmd0aDw9bitmLmxlbmd0aCs1OylsPW5ldyBVaW50OEFycmF5KGwubGVuZ3RoPDwxKTtsLnNldCh0aGlzLmEpfWs9Zz8xOjA7bFtuKytdPWt8MDtoPWYubGVuZ3RoO209fmgrNjU1MzYmNjU1MzU7bFtuKytdPWgmMjU1O2xbbisrXT1oPj4+OCYyNTU7bFtuKytdPW0mMjU1O2xbbisrXT1tPj4+OCYyNTU7aWYoQilsLnNldChmLG4pLG4rPWYubGVuZ3RoLGw9bC5zdWJhcnJheSgwLG4pO2Vsc2V7cj0wO2ZvcihwPWYubGVuZ3RoO3I8cDsrK3IpbFtuKytdPVxuZltyXTtsLmxlbmd0aD1ufXRoaXMuYj1uO3RoaXMuYT1sfWJyZWFrO2Nhc2UgMTp2YXIgcz1uZXcgRyhCP25ldyBVaW50OEFycmF5KHRoaXMuYS5idWZmZXIpOnRoaXMuYSx0aGlzLmIpO3MuZCgxLDEsdik7cy5kKDEsMix2KTt2YXIgdT1yYSh0aGlzLGUpLHcsQyx4O3c9MDtmb3IoQz11Lmxlbmd0aDt3PEM7dysrKWlmKHg9dVt3XSxHLnByb3RvdHlwZS5kLmFwcGx5KHMscWFbeF0pLDI1Njx4KXMuZCh1Wysrd10sdVsrK3ddLHYpLHMuZCh1Wysrd10sNSkscy5kKHVbKyt3XSx1Wysrd10sdik7ZWxzZSBpZigyNTY9PT14KWJyZWFrO3RoaXMuYT1zLmZpbmlzaCgpO3RoaXMuYj10aGlzLmEubGVuZ3RoO2JyZWFrO2Nhc2Ugb2E6dmFyIEQ9bmV3IEcoQj9uZXcgVWludDhBcnJheSh0aGlzLmEuYnVmZmVyKTp0aGlzLmEsdGhpcy5iKSxNLHosTixYLFkscWI9WzE2LDE3LDE4LDAsOCw3LDksNiwxMCw1LDExLDQsMTIsMywxMywyLDE0LDEsMTVdLGRhLEZhLGVhLEdhLGxhLHRhPUFycmF5KDE5KSxcbkhhLFosbWEsRSxJYTtNPW9hO0QuZCgxLDEsdik7RC5kKE0sMix2KTt6PXJhKHRoaXMsZSk7ZGE9c2EodGhpcy5VLDE1KTtGYT11YShkYSk7ZWE9c2EodGhpcy5ULDcpO0dhPXVhKGVhKTtmb3IoTj0yODY7MjU3PE4mJjA9PT1kYVtOLTFdO04tLSk7Zm9yKFg9MzA7MTxYJiYwPT09ZWFbWC0xXTtYLS0pO3ZhciBKYT1OLEthPVgsSz1uZXcgKEI/VWludDMyQXJyYXk6QXJyYXkpKEphK0thKSx5LE8sQSxmYSxKPW5ldyAoQj9VaW50MzJBcnJheTpBcnJheSkoMzE2KSxILEYsUD1uZXcgKEI/VWludDhBcnJheTpBcnJheSkoMTkpO2Zvcih5PU89MDt5PEphO3krKylLW08rK109ZGFbeV07Zm9yKHk9MDt5PEthO3krKylLW08rK109ZWFbeV07aWYoIUIpe3k9MDtmb3IoZmE9UC5sZW5ndGg7eTxmYTsrK3kpUFt5XT0wfXk9SD0wO2ZvcihmYT1LLmxlbmd0aDt5PGZhO3krPU8pe2ZvcihPPTE7eStPPGZhJiZLW3krT109PT1LW3ldOysrTyk7QT1PO2lmKDA9PT1LW3ldKWlmKDM+QSlmb3IoOzA8QS0tOylKW0grK109XG4wLFBbMF0rKztlbHNlIGZvcig7MDxBOylGPTEzOD5BP0E6MTM4LEY+QS0zJiZGPEEmJihGPUEtMyksMTA+PUY/KEpbSCsrXT0xNyxKW0grK109Ri0zLFBbMTddKyspOihKW0grK109MTgsSltIKytdPUYtMTEsUFsxOF0rKyksQS09RjtlbHNlIGlmKEpbSCsrXT1LW3ldLFBbS1t5XV0rKyxBLS0sMz5BKWZvcig7MDxBLS07KUpbSCsrXT1LW3ldLFBbS1t5XV0rKztlbHNlIGZvcig7MDxBOylGPTY+QT9BOjYsRj5BLTMmJkY8QSYmKEY9QS0zKSxKW0grK109MTYsSltIKytdPUYtMyxQWzE2XSsrLEEtPUZ9Yj1CP0ouc3ViYXJyYXkoMCxIKTpKLnNsaWNlKDAsSCk7bGE9c2EoUCw3KTtmb3IoRT0wOzE5PkU7RSsrKXRhW0VdPWxhW3FiW0VdXTtmb3IoWT0xOTs0PFkmJjA9PT10YVtZLTFdO1ktLSk7SGE9dWEobGEpO0QuZChOLTI1Nyw1LHYpO0QuZChYLTEsNSx2KTtELmQoWS00LDQsdik7Zm9yKEU9MDtFPFk7RSsrKUQuZCh0YVtFXSwzLHYpO0U9MDtmb3IoSWE9Yi5sZW5ndGg7RTxJYTtFKyspaWYoWj1cbmJbRV0sRC5kKEhhW1pdLGxhW1pdLHYpLDE2PD1aKXtFKys7c3dpdGNoKFope2Nhc2UgMTY6bWE9MjticmVhaztjYXNlIDE3Om1hPTM7YnJlYWs7Y2FzZSAxODptYT03O2JyZWFrO2RlZmF1bHQ6cShcImludmFsaWQgY29kZTogXCIrWil9RC5kKGJbRV0sbWEsdil9dmFyIExhPVtGYSxkYV0sTWE9W0dhLGVhXSxRLE5hLGdhLHdhLE9hLFBhLFFhLFJhO09hPUxhWzBdO1BhPUxhWzFdO1FhPU1hWzBdO1JhPU1hWzFdO1E9MDtmb3IoTmE9ei5sZW5ndGg7UTxOYTsrK1EpaWYoZ2E9eltRXSxELmQoT2FbZ2FdLFBhW2dhXSx2KSwyNTY8Z2EpRC5kKHpbKytRXSx6WysrUV0sdiksd2E9elsrK1FdLEQuZChRYVt3YV0sUmFbd2FdLHYpLEQuZCh6WysrUV0selsrK1FdLHYpO2Vsc2UgaWYoMjU2PT09Z2EpYnJlYWs7dGhpcy5hPUQuZmluaXNoKCk7dGhpcy5iPXRoaXMuYS5sZW5ndGg7YnJlYWs7ZGVmYXVsdDpxKFwiaW52YWxpZCBjb21wcmVzc2lvbiB0eXBlXCIpfXJldHVybiB0aGlzLmF9O1xuZnVuY3Rpb24gdmEoYixhKXt0aGlzLmxlbmd0aD1iO3RoaXMuTj1hfVxudmFyIHhhPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYihhKXtzd2l0Y2godil7Y2FzZSAzPT09YTpyZXR1cm5bMjU3LGEtMywwXTtjYXNlIDQ9PT1hOnJldHVyblsyNTgsYS00LDBdO2Nhc2UgNT09PWE6cmV0dXJuWzI1OSxhLTUsMF07Y2FzZSA2PT09YTpyZXR1cm5bMjYwLGEtNiwwXTtjYXNlIDc9PT1hOnJldHVyblsyNjEsYS03LDBdO2Nhc2UgOD09PWE6cmV0dXJuWzI2MixhLTgsMF07Y2FzZSA5PT09YTpyZXR1cm5bMjYzLGEtOSwwXTtjYXNlIDEwPT09YTpyZXR1cm5bMjY0LGEtMTAsMF07Y2FzZSAxMj49YTpyZXR1cm5bMjY1LGEtMTEsMV07Y2FzZSAxND49YTpyZXR1cm5bMjY2LGEtMTMsMV07Y2FzZSAxNj49YTpyZXR1cm5bMjY3LGEtMTUsMV07Y2FzZSAxOD49YTpyZXR1cm5bMjY4LGEtMTcsMV07Y2FzZSAyMj49YTpyZXR1cm5bMjY5LGEtMTksMl07Y2FzZSAyNj49YTpyZXR1cm5bMjcwLGEtMjMsMl07Y2FzZSAzMD49YTpyZXR1cm5bMjcxLGEtMjcsMl07Y2FzZSAzND49YTpyZXR1cm5bMjcyLFxuYS0zMSwyXTtjYXNlIDQyPj1hOnJldHVyblsyNzMsYS0zNSwzXTtjYXNlIDUwPj1hOnJldHVyblsyNzQsYS00MywzXTtjYXNlIDU4Pj1hOnJldHVyblsyNzUsYS01MSwzXTtjYXNlIDY2Pj1hOnJldHVyblsyNzYsYS01OSwzXTtjYXNlIDgyPj1hOnJldHVyblsyNzcsYS02Nyw0XTtjYXNlIDk4Pj1hOnJldHVyblsyNzgsYS04Myw0XTtjYXNlIDExND49YTpyZXR1cm5bMjc5LGEtOTksNF07Y2FzZSAxMzA+PWE6cmV0dXJuWzI4MCxhLTExNSw0XTtjYXNlIDE2Mj49YTpyZXR1cm5bMjgxLGEtMTMxLDVdO2Nhc2UgMTk0Pj1hOnJldHVyblsyODIsYS0xNjMsNV07Y2FzZSAyMjY+PWE6cmV0dXJuWzI4MyxhLTE5NSw1XTtjYXNlIDI1Nz49YTpyZXR1cm5bMjg0LGEtMjI3LDVdO2Nhc2UgMjU4PT09YTpyZXR1cm5bMjg1LGEtMjU4LDBdO2RlZmF1bHQ6cShcImludmFsaWQgbGVuZ3RoOiBcIithKX19dmFyIGE9W10sYyxkO2ZvcihjPTM7MjU4Pj1jO2MrKylkPWIoYyksYVtjXT1kWzJdPDwyNHxkWzFdPDxcbjE2fGRbMF07cmV0dXJuIGF9KCkseWE9Qj9uZXcgVWludDMyQXJyYXkoeGEpOnhhO1xuZnVuY3Rpb24gcmEoYixhKXtmdW5jdGlvbiBjKGEsYyl7dmFyIGI9YS5OLGQ9W10sZj0wLGU7ZT15YVthLmxlbmd0aF07ZFtmKytdPWUmNjU1MzU7ZFtmKytdPWU+PjE2JjI1NTtkW2YrK109ZT4+MjQ7dmFyIGc7c3dpdGNoKHYpe2Nhc2UgMT09PWI6Zz1bMCxiLTEsMF07YnJlYWs7Y2FzZSAyPT09YjpnPVsxLGItMiwwXTticmVhaztjYXNlIDM9PT1iOmc9WzIsYi0zLDBdO2JyZWFrO2Nhc2UgND09PWI6Zz1bMyxiLTQsMF07YnJlYWs7Y2FzZSA2Pj1iOmc9WzQsYi01LDFdO2JyZWFrO2Nhc2UgOD49YjpnPVs1LGItNywxXTticmVhaztjYXNlIDEyPj1iOmc9WzYsYi05LDJdO2JyZWFrO2Nhc2UgMTY+PWI6Zz1bNyxiLTEzLDJdO2JyZWFrO2Nhc2UgMjQ+PWI6Zz1bOCxiLTE3LDNdO2JyZWFrO2Nhc2UgMzI+PWI6Zz1bOSxiLTI1LDNdO2JyZWFrO2Nhc2UgNDg+PWI6Zz1bMTAsYi0zMyw0XTticmVhaztjYXNlIDY0Pj1iOmc9WzExLGItNDksNF07YnJlYWs7Y2FzZSA5Nj49YjpnPVsxMixiLVxuNjUsNV07YnJlYWs7Y2FzZSAxMjg+PWI6Zz1bMTMsYi05Nyw1XTticmVhaztjYXNlIDE5Mj49YjpnPVsxNCxiLTEyOSw2XTticmVhaztjYXNlIDI1Nj49YjpnPVsxNSxiLTE5Myw2XTticmVhaztjYXNlIDM4ND49YjpnPVsxNixiLTI1Nyw3XTticmVhaztjYXNlIDUxMj49YjpnPVsxNyxiLTM4NSw3XTticmVhaztjYXNlIDc2OD49YjpnPVsxOCxiLTUxMyw4XTticmVhaztjYXNlIDEwMjQ+PWI6Zz1bMTksYi03NjksOF07YnJlYWs7Y2FzZSAxNTM2Pj1iOmc9WzIwLGItMTAyNSw5XTticmVhaztjYXNlIDIwNDg+PWI6Zz1bMjEsYi0xNTM3LDldO2JyZWFrO2Nhc2UgMzA3Mj49YjpnPVsyMixiLTIwNDksMTBdO2JyZWFrO2Nhc2UgNDA5Nj49YjpnPVsyMyxiLTMwNzMsMTBdO2JyZWFrO2Nhc2UgNjE0ND49YjpnPVsyNCxiLTQwOTcsMTFdO2JyZWFrO2Nhc2UgODE5Mj49YjpnPVsyNSxiLTYxNDUsMTFdO2JyZWFrO2Nhc2UgMTIyODg+PWI6Zz1bMjYsYi04MTkzLDEyXTticmVhaztjYXNlIDE2Mzg0Pj1cbmI6Zz1bMjcsYi0xMjI4OSwxMl07YnJlYWs7Y2FzZSAyNDU3Nj49YjpnPVsyOCxiLTE2Mzg1LDEzXTticmVhaztjYXNlIDMyNzY4Pj1iOmc9WzI5LGItMjQ1NzcsMTNdO2JyZWFrO2RlZmF1bHQ6cShcImludmFsaWQgZGlzdGFuY2VcIil9ZT1nO2RbZisrXT1lWzBdO2RbZisrXT1lWzFdO2RbZisrXT1lWzJdO3ZhciBoLGs7aD0wO2ZvcihrPWQubGVuZ3RoO2g8azsrK2gpbFtuKytdPWRbaF07dVtkWzBdXSsrO3dbZFszXV0rKztzPWEubGVuZ3RoK2MtMTtwPW51bGx9dmFyIGQsZSxmLGcsayxoPXt9LG0scixwLGw9Qj9uZXcgVWludDE2QXJyYXkoMiphLmxlbmd0aCk6W10sbj0wLHM9MCx1PW5ldyAoQj9VaW50MzJBcnJheTpBcnJheSkoMjg2KSx3PW5ldyAoQj9VaW50MzJBcnJheTpBcnJheSkoMzApLEM9Yi5GLHg7aWYoIUIpe2ZvcihmPTA7Mjg1Pj1mOyl1W2YrK109MDtmb3IoZj0wOzI5Pj1mOyl3W2YrK109MH11WzI1Nl09MTtkPTA7Zm9yKGU9YS5sZW5ndGg7ZDxlOysrZCl7Zj1rPTA7XG5mb3IoZz0zO2Y8ZyYmZCtmIT09ZTsrK2Ypaz1rPDw4fGFbZCtmXTtoW2tdPT09dCYmKGhba109W10pO209aFtrXTtpZighKDA8cy0tKSl7Zm9yKDswPG0ubGVuZ3RoJiYzMjc2ODxkLW1bMF07KW0uc2hpZnQoKTtpZihkKzM+PWUpe3AmJmMocCwtMSk7Zj0wO2ZvcihnPWUtZDtmPGc7KytmKXg9YVtkK2ZdLGxbbisrXT14LCsrdVt4XTticmVha30wPG0ubGVuZ3RoPyhyPXphKGEsZCxtKSxwP3AubGVuZ3RoPHIubGVuZ3RoPyh4PWFbZC0xXSxsW24rK109eCwrK3VbeF0sYyhyLDApKTpjKHAsLTEpOnIubGVuZ3RoPEM/cD1yOmMociwwKSk6cD9jKHAsLTEpOih4PWFbZF0sbFtuKytdPXgsKyt1W3hdKX1tLnB1c2goZCl9bFtuKytdPTI1Njt1WzI1Nl0rKztiLlU9dTtiLlQ9dztyZXR1cm4gQj9sLnN1YmFycmF5KDAsbik6bH1cbmZ1bmN0aW9uIHphKGIsYSxjKXt2YXIgZCxlLGY9MCxnLGssaCxtLHI9Yi5sZW5ndGg7az0wO209Yy5sZW5ndGg7YTpmb3IoO2s8bTtrKyspe2Q9Y1ttLWstMV07Zz0zO2lmKDM8Zil7Zm9yKGg9ZjszPGg7aC0tKWlmKGJbZCtoLTFdIT09YlthK2gtMV0pY29udGludWUgYTtnPWZ9Zm9yKDsyNTg+ZyYmYStnPHImJmJbZCtnXT09PWJbYStnXTspKytnO2c+ZiYmKGU9ZCxmPWcpO2lmKDI1OD09PWcpYnJlYWt9cmV0dXJuIG5ldyB2YShmLGEtZSl9XG5mdW5jdGlvbiBzYShiLGEpe3ZhciBjPWIubGVuZ3RoLGQ9bmV3IGthKDU3MiksZT1uZXcgKEI/VWludDhBcnJheTpBcnJheSkoYyksZixnLGssaCxtO2lmKCFCKWZvcihoPTA7aDxjO2grKyllW2hdPTA7Zm9yKGg9MDtoPGM7KytoKTA8YltoXSYmZC5wdXNoKGgsYltoXSk7Zj1BcnJheShkLmxlbmd0aC8yKTtnPW5ldyAoQj9VaW50MzJBcnJheTpBcnJheSkoZC5sZW5ndGgvMik7aWYoMT09PWYubGVuZ3RoKXJldHVybiBlW2QucG9wKCkuaW5kZXhdPTEsZTtoPTA7Zm9yKG09ZC5sZW5ndGgvMjtoPG07KytoKWZbaF09ZC5wb3AoKSxnW2hdPWZbaF0udmFsdWU7az1BYShnLGcubGVuZ3RoLGEpO2g9MDtmb3IobT1mLmxlbmd0aDtoPG07KytoKWVbZltoXS5pbmRleF09a1toXTtyZXR1cm4gZX1cbmZ1bmN0aW9uIEFhKGIsYSxjKXtmdW5jdGlvbiBkKGIpe3ZhciBjPWhbYl1bbVtiXV07Yz09PWE/KGQoYisxKSxkKGIrMSkpOi0tZ1tjXTsrK21bYl19dmFyIGU9bmV3IChCP1VpbnQxNkFycmF5OkFycmF5KShjKSxmPW5ldyAoQj9VaW50OEFycmF5OkFycmF5KShjKSxnPW5ldyAoQj9VaW50OEFycmF5OkFycmF5KShhKSxrPUFycmF5KGMpLGg9QXJyYXkoYyksbT1BcnJheShjKSxyPSgxPDxjKS1hLHA9MTw8Yy0xLGwsbixzLHUsdztlW2MtMV09YTtmb3Iobj0wO248YzsrK24pcjxwP2Zbbl09MDooZltuXT0xLHItPXApLHI8PD0xLGVbYy0yLW5dPShlW2MtMS1uXS8yfDApK2E7ZVswXT1mWzBdO2tbMF09QXJyYXkoZVswXSk7aFswXT1BcnJheShlWzBdKTtmb3Iobj0xO248YzsrK24pZVtuXT4yKmVbbi0xXStmW25dJiYoZVtuXT0yKmVbbi0xXStmW25dKSxrW25dPUFycmF5KGVbbl0pLGhbbl09QXJyYXkoZVtuXSk7Zm9yKGw9MDtsPGE7KytsKWdbbF09Yztmb3Iocz0wO3M8ZVtjLTFdOysrcylrW2MtXG4xXVtzXT1iW3NdLGhbYy0xXVtzXT1zO2ZvcihsPTA7bDxjOysrbCltW2xdPTA7MT09PWZbYy0xXSYmKC0tZ1swXSwrK21bYy0xXSk7Zm9yKG49Yy0yOzA8PW47LS1uKXt1PWw9MDt3PW1bbisxXTtmb3Iocz0wO3M8ZVtuXTtzKyspdT1rW24rMV1bd10ra1tuKzFdW3crMV0sdT5iW2xdPyhrW25dW3NdPXUsaFtuXVtzXT1hLHcrPTIpOihrW25dW3NdPWJbbF0saFtuXVtzXT1sLCsrbCk7bVtuXT0wOzE9PT1mW25dJiZkKG4pfXJldHVybiBnfVxuZnVuY3Rpb24gdWEoYil7dmFyIGE9bmV3IChCP1VpbnQxNkFycmF5OkFycmF5KShiLmxlbmd0aCksYz1bXSxkPVtdLGU9MCxmLGcsayxoO2Y9MDtmb3IoZz1iLmxlbmd0aDtmPGc7ZisrKWNbYltmXV09KGNbYltmXV18MCkrMTtmPTE7Zm9yKGc9MTY7Zjw9ZztmKyspZFtmXT1lLGUrPWNbZl18MCxlPDw9MTtmPTA7Zm9yKGc9Yi5sZW5ndGg7ZjxnO2YrKyl7ZT1kW2JbZl1dO2RbYltmXV0rPTE7az1hW2ZdPTA7Zm9yKGg9YltmXTtrPGg7aysrKWFbZl09YVtmXTw8MXxlJjEsZT4+Pj0xfXJldHVybiBhfTtmdW5jdGlvbiBCYShiLGEpe3RoaXMuaW5wdXQ9Yjt0aGlzLmI9dGhpcy5jPTA7dGhpcy5nPXt9O2EmJihhLmZsYWdzJiYodGhpcy5nPWEuZmxhZ3MpLFwic3RyaW5nXCI9PT10eXBlb2YgYS5maWxlbmFtZSYmKHRoaXMuZmlsZW5hbWU9YS5maWxlbmFtZSksXCJzdHJpbmdcIj09PXR5cGVvZiBhLmNvbW1lbnQmJih0aGlzLnc9YS5jb21tZW50KSxhLmRlZmxhdGVPcHRpb25zJiYodGhpcy5sPWEuZGVmbGF0ZU9wdGlvbnMpKTt0aGlzLmx8fCh0aGlzLmw9e30pfVxuQmEucHJvdG90eXBlLmg9ZnVuY3Rpb24oKXt2YXIgYixhLGMsZCxlLGYsZyxrLGg9bmV3IChCP1VpbnQ4QXJyYXk6QXJyYXkpKDMyNzY4KSxtPTAscj10aGlzLmlucHV0LHA9dGhpcy5jLGw9dGhpcy5maWxlbmFtZSxuPXRoaXMudztoW20rK109MzE7aFttKytdPTEzOTtoW20rK109ODtiPTA7dGhpcy5nLmZuYW1lJiYoYnw9Q2EpO3RoaXMuZy5mY29tbWVudCYmKGJ8PURhKTt0aGlzLmcuZmhjcmMmJihifD1FYSk7aFttKytdPWI7YT0oRGF0ZS5ub3c/RGF0ZS5ub3coKTorbmV3IERhdGUpLzFFM3wwO2hbbSsrXT1hJjI1NTtoW20rK109YT4+PjgmMjU1O2hbbSsrXT1hPj4+MTYmMjU1O2hbbSsrXT1hPj4+MjQmMjU1O2hbbSsrXT0wO2hbbSsrXT1TYTtpZih0aGlzLmcuZm5hbWUhPT10KXtnPTA7Zm9yKGs9bC5sZW5ndGg7ZzxrOysrZylmPWwuY2hhckNvZGVBdChnKSwyNTU8ZiYmKGhbbSsrXT1mPj4+OCYyNTUpLGhbbSsrXT1mJjI1NTtoW20rK109MH1pZih0aGlzLmcuY29tbWVudCl7Zz1cbjA7Zm9yKGs9bi5sZW5ndGg7ZzxrOysrZylmPW4uY2hhckNvZGVBdChnKSwyNTU8ZiYmKGhbbSsrXT1mPj4+OCYyNTUpLGhbbSsrXT1mJjI1NTtoW20rK109MH10aGlzLmcuZmhjcmMmJihjPWhhKGgsMCxtKSY2NTUzNSxoW20rK109YyYyNTUsaFttKytdPWM+Pj44JjI1NSk7dGhpcy5sLm91dHB1dEJ1ZmZlcj1oO3RoaXMubC5vdXRwdXRJbmRleD1tO2U9bmV3IG5hKHIsdGhpcy5sKTtoPWUuaCgpO209ZS5iO0ImJihtKzg+aC5idWZmZXIuYnl0ZUxlbmd0aD8odGhpcy5hPW5ldyBVaW50OEFycmF5KG0rOCksdGhpcy5hLnNldChuZXcgVWludDhBcnJheShoLmJ1ZmZlcikpLGg9dGhpcy5hKTpoPW5ldyBVaW50OEFycmF5KGguYnVmZmVyKSk7ZD1oYShyLHQsdCk7aFttKytdPWQmMjU1O2hbbSsrXT1kPj4+OCYyNTU7aFttKytdPWQ+Pj4xNiYyNTU7aFttKytdPWQ+Pj4yNCYyNTU7az1yLmxlbmd0aDtoW20rK109ayYyNTU7aFttKytdPWs+Pj44JjI1NTtoW20rK109az4+PjE2JjI1NTtoW20rK109XG5rPj4+MjQmMjU1O3RoaXMuYz1wO0ImJm08aC5sZW5ndGgmJih0aGlzLmE9aD1oLnN1YmFycmF5KDAsbSkpO3JldHVybiBofTt2YXIgU2E9MjU1LEVhPTIsQ2E9OCxEYT0xNjtmdW5jdGlvbiBWKGIsYSl7dGhpcy5vPVtdO3RoaXMucD0zMjc2ODt0aGlzLmU9dGhpcy5qPXRoaXMuYz10aGlzLnM9MDt0aGlzLmlucHV0PUI/bmV3IFVpbnQ4QXJyYXkoYik6Yjt0aGlzLnU9ITE7dGhpcy5xPVRhO3RoaXMuSz0hMTtpZihhfHwhKGE9e30pKWEuaW5kZXgmJih0aGlzLmM9YS5pbmRleCksYS5idWZmZXJTaXplJiYodGhpcy5wPWEuYnVmZmVyU2l6ZSksYS5idWZmZXJUeXBlJiYodGhpcy5xPWEuYnVmZmVyVHlwZSksYS5yZXNpemUmJih0aGlzLks9YS5yZXNpemUpO3N3aXRjaCh0aGlzLnEpe2Nhc2UgVWE6dGhpcy5iPTMyNzY4O3RoaXMuYT1uZXcgKEI/VWludDhBcnJheTpBcnJheSkoMzI3NjgrdGhpcy5wKzI1OCk7YnJlYWs7Y2FzZSBUYTp0aGlzLmI9MDt0aGlzLmE9bmV3IChCP1VpbnQ4QXJyYXk6QXJyYXkpKHRoaXMucCk7dGhpcy5mPXRoaXMuUzt0aGlzLno9dGhpcy5PO3RoaXMucj10aGlzLlE7YnJlYWs7ZGVmYXVsdDpxKEVycm9yKFwiaW52YWxpZCBpbmZsYXRlIG1vZGVcIikpfX1cbnZhciBVYT0wLFRhPTE7XG5WLnByb3RvdHlwZS5pPWZ1bmN0aW9uKCl7Zm9yKDshdGhpcy51Oyl7dmFyIGI9Vyh0aGlzLDMpO2ImMSYmKHRoaXMudT12KTtiPj4+PTE7c3dpdGNoKGIpe2Nhc2UgMDp2YXIgYT10aGlzLmlucHV0LGM9dGhpcy5jLGQ9dGhpcy5hLGU9dGhpcy5iLGY9YS5sZW5ndGgsZz10LGs9dCxoPWQubGVuZ3RoLG09dDt0aGlzLmU9dGhpcy5qPTA7YysxPj1mJiZxKEVycm9yKFwiaW52YWxpZCB1bmNvbXByZXNzZWQgYmxvY2sgaGVhZGVyOiBMRU5cIikpO2c9YVtjKytdfGFbYysrXTw8ODtjKzE+PWYmJnEoRXJyb3IoXCJpbnZhbGlkIHVuY29tcHJlc3NlZCBibG9jayBoZWFkZXI6IE5MRU5cIikpO2s9YVtjKytdfGFbYysrXTw8ODtnPT09fmsmJnEoRXJyb3IoXCJpbnZhbGlkIHVuY29tcHJlc3NlZCBibG9jayBoZWFkZXI6IGxlbmd0aCB2ZXJpZnlcIikpO2MrZz5hLmxlbmd0aCYmcShFcnJvcihcImlucHV0IGJ1ZmZlciBpcyBicm9rZW5cIikpO3N3aXRjaCh0aGlzLnEpe2Nhc2UgVWE6Zm9yKDtlK2c+ZC5sZW5ndGg7KXttPVxuaC1lO2ctPW07aWYoQilkLnNldChhLnN1YmFycmF5KGMsYyttKSxlKSxlKz1tLGMrPW07ZWxzZSBmb3IoO20tLTspZFtlKytdPWFbYysrXTt0aGlzLmI9ZTtkPXRoaXMuZigpO2U9dGhpcy5ifWJyZWFrO2Nhc2UgVGE6Zm9yKDtlK2c+ZC5sZW5ndGg7KWQ9dGhpcy5mKHtCOjJ9KTticmVhaztkZWZhdWx0OnEoRXJyb3IoXCJpbnZhbGlkIGluZmxhdGUgbW9kZVwiKSl9aWYoQilkLnNldChhLnN1YmFycmF5KGMsYytnKSxlKSxlKz1nLGMrPWc7ZWxzZSBmb3IoO2ctLTspZFtlKytdPWFbYysrXTt0aGlzLmM9Yzt0aGlzLmI9ZTt0aGlzLmE9ZDticmVhaztjYXNlIDE6dGhpcy5yKFZhLFdhKTticmVhaztjYXNlIDI6Zm9yKHZhciByPVcodGhpcyw1KSsyNTcscD1XKHRoaXMsNSkrMSxsPVcodGhpcyw0KSs0LG49bmV3IChCP1VpbnQ4QXJyYXk6QXJyYXkpKFhhLmxlbmd0aCkscz10LHU9dCx3PXQsQz10LHg9dCxEPXQsTT10LHo9dCxOPXQsej0wO3o8bDsrK3opbltYYVt6XV09Vyh0aGlzLDMpO2lmKCFCKXt6PVxubDtmb3IobD1uLmxlbmd0aDt6PGw7Kyt6KW5bWGFbel1dPTB9cz1UKG4pO0M9bmV3IChCP1VpbnQ4QXJyYXk6QXJyYXkpKHIrcCk7ej0wO2ZvcihOPXIrcDt6PE47KXN3aXRjaCh4PVlhKHRoaXMscykseCl7Y2FzZSAxNjpmb3IoTT0zK1codGhpcywyKTtNLS07KUNbeisrXT1EO2JyZWFrO2Nhc2UgMTc6Zm9yKE09MytXKHRoaXMsMyk7TS0tOylDW3orK109MDtEPTA7YnJlYWs7Y2FzZSAxODpmb3IoTT0xMStXKHRoaXMsNyk7TS0tOylDW3orK109MDtEPTA7YnJlYWs7ZGVmYXVsdDpEPUNbeisrXT14fXU9Qj9UKEMuc3ViYXJyYXkoMCxyKSk6VChDLnNsaWNlKDAscikpO3c9Qj9UKEMuc3ViYXJyYXkocikpOlQoQy5zbGljZShyKSk7dGhpcy5yKHUsdyk7YnJlYWs7ZGVmYXVsdDpxKEVycm9yKFwidW5rbm93biBCVFlQRTogXCIrYikpfX1yZXR1cm4gdGhpcy56KCl9O1xudmFyIFphPVsxNiwxNywxOCwwLDgsNyw5LDYsMTAsNSwxMSw0LDEyLDMsMTMsMiwxNCwxLDE1XSxYYT1CP25ldyBVaW50MTZBcnJheShaYSk6WmEsJGE9WzMsNCw1LDYsNyw4LDksMTAsMTEsMTMsMTUsMTcsMTksMjMsMjcsMzEsMzUsNDMsNTEsNTksNjcsODMsOTksMTE1LDEzMSwxNjMsMTk1LDIyNywyNTgsMjU4LDI1OF0sYWI9Qj9uZXcgVWludDE2QXJyYXkoJGEpOiRhLGJiPVswLDAsMCwwLDAsMCwwLDAsMSwxLDEsMSwyLDIsMiwyLDMsMywzLDMsNCw0LDQsNCw1LDUsNSw1LDAsMCwwXSxjYj1CP25ldyBVaW50OEFycmF5KGJiKTpiYixkYj1bMSwyLDMsNCw1LDcsOSwxMywxNywyNSwzMyw0OSw2NSw5NywxMjksMTkzLDI1NywzODUsNTEzLDc2OSwxMDI1LDE1MzcsMjA0OSwzMDczLDQwOTcsNjE0NSw4MTkzLDEyMjg5LDE2Mzg1LDI0NTc3XSxlYj1CP25ldyBVaW50MTZBcnJheShkYik6ZGIsZmI9WzAsMCwwLDAsMSwxLDIsMiwzLDMsNCw0LDUsNSw2LDYsNyw3LDgsOCw5LDksMTAsXG4xMCwxMSwxMSwxMiwxMiwxMywxM10sZ2I9Qj9uZXcgVWludDhBcnJheShmYik6ZmIsaGI9bmV3IChCP1VpbnQ4QXJyYXk6QXJyYXkpKDI4OCksJCxpYjskPTA7Zm9yKGliPWhiLmxlbmd0aDskPGliOysrJCloYlskXT0xNDM+PSQ/ODoyNTU+PSQ/OToyNzk+PSQ/Nzo4O3ZhciBWYT1UKGhiKSxqYj1uZXcgKEI/VWludDhBcnJheTpBcnJheSkoMzApLGtiLGxiO2tiPTA7Zm9yKGxiPWpiLmxlbmd0aDtrYjxsYjsrK2tiKWpiW2tiXT01O3ZhciBXYT1UKGpiKTtmdW5jdGlvbiBXKGIsYSl7Zm9yKHZhciBjPWIuaixkPWIuZSxlPWIuaW5wdXQsZj1iLmMsZz1lLmxlbmd0aCxrO2Q8YTspZj49ZyYmcShFcnJvcihcImlucHV0IGJ1ZmZlciBpcyBicm9rZW5cIikpLGN8PWVbZisrXTw8ZCxkKz04O2s9YyYoMTw8YSktMTtiLmo9Yz4+PmE7Yi5lPWQtYTtiLmM9ZjtyZXR1cm4ga31cbmZ1bmN0aW9uIFlhKGIsYSl7Zm9yKHZhciBjPWIuaixkPWIuZSxlPWIuaW5wdXQsZj1iLmMsZz1lLmxlbmd0aCxrPWFbMF0saD1hWzFdLG0scjtkPGgmJiEoZj49Zyk7KWN8PWVbZisrXTw8ZCxkKz04O209a1tjJigxPDxoKS0xXTtyPW0+Pj4xNjtyPmQmJnEoRXJyb3IoXCJpbnZhbGlkIGNvZGUgbGVuZ3RoOiBcIityKSk7Yi5qPWM+PnI7Yi5lPWQtcjtiLmM9ZjtyZXR1cm4gbSY2NTUzNX1cblYucHJvdG90eXBlLnI9ZnVuY3Rpb24oYixhKXt2YXIgYz10aGlzLmEsZD10aGlzLmI7dGhpcy5BPWI7Zm9yKHZhciBlPWMubGVuZ3RoLTI1OCxmLGcsayxoOzI1NiE9PShmPVlhKHRoaXMsYikpOylpZigyNTY+ZilkPj1lJiYodGhpcy5iPWQsYz10aGlzLmYoKSxkPXRoaXMuYiksY1tkKytdPWY7ZWxzZXtnPWYtMjU3O2g9YWJbZ107MDxjYltnXSYmKGgrPVcodGhpcyxjYltnXSkpO2Y9WWEodGhpcyxhKTtrPWViW2ZdOzA8Z2JbZl0mJihrKz1XKHRoaXMsZ2JbZl0pKTtkPj1lJiYodGhpcy5iPWQsYz10aGlzLmYoKSxkPXRoaXMuYik7Zm9yKDtoLS07KWNbZF09Y1tkKysta119Zm9yKDs4PD10aGlzLmU7KXRoaXMuZS09OCx0aGlzLmMtLTt0aGlzLmI9ZH07XG5WLnByb3RvdHlwZS5RPWZ1bmN0aW9uKGIsYSl7dmFyIGM9dGhpcy5hLGQ9dGhpcy5iO3RoaXMuQT1iO2Zvcih2YXIgZT1jLmxlbmd0aCxmLGcsayxoOzI1NiE9PShmPVlhKHRoaXMsYikpOylpZigyNTY+ZilkPj1lJiYoYz10aGlzLmYoKSxlPWMubGVuZ3RoKSxjW2QrK109ZjtlbHNle2c9Zi0yNTc7aD1hYltnXTswPGNiW2ddJiYoaCs9Vyh0aGlzLGNiW2ddKSk7Zj1ZYSh0aGlzLGEpO2s9ZWJbZl07MDxnYltmXSYmKGsrPVcodGhpcyxnYltmXSkpO2QraD5lJiYoYz10aGlzLmYoKSxlPWMubGVuZ3RoKTtmb3IoO2gtLTspY1tkXT1jW2QrKy1rXX1mb3IoOzg8PXRoaXMuZTspdGhpcy5lLT04LHRoaXMuYy0tO3RoaXMuYj1kfTtcblYucHJvdG90eXBlLmY9ZnVuY3Rpb24oKXt2YXIgYj1uZXcgKEI/VWludDhBcnJheTpBcnJheSkodGhpcy5iLTMyNzY4KSxhPXRoaXMuYi0zMjc2OCxjLGQsZT10aGlzLmE7aWYoQiliLnNldChlLnN1YmFycmF5KDMyNzY4LGIubGVuZ3RoKSk7ZWxzZXtjPTA7Zm9yKGQ9Yi5sZW5ndGg7YzxkOysrYyliW2NdPWVbYyszMjc2OF19dGhpcy5vLnB1c2goYik7dGhpcy5zKz1iLmxlbmd0aDtpZihCKWUuc2V0KGUuc3ViYXJyYXkoYSxhKzMyNzY4KSk7ZWxzZSBmb3IoYz0wOzMyNzY4PmM7KytjKWVbY109ZVthK2NdO3RoaXMuYj0zMjc2ODtyZXR1cm4gZX07XG5WLnByb3RvdHlwZS5TPWZ1bmN0aW9uKGIpe3ZhciBhLGM9dGhpcy5pbnB1dC5sZW5ndGgvdGhpcy5jKzF8MCxkLGUsZixnPXRoaXMuaW5wdXQsaz10aGlzLmE7YiYmKFwibnVtYmVyXCI9PT10eXBlb2YgYi5CJiYoYz1iLkIpLFwibnVtYmVyXCI9PT10eXBlb2YgYi5NJiYoYys9Yi5NKSk7Mj5jPyhkPShnLmxlbmd0aC10aGlzLmMpL3RoaXMuQVsyXSxmPTI1OCooZC8yKXwwLGU9ZjxrLmxlbmd0aD9rLmxlbmd0aCtmOmsubGVuZ3RoPDwxKTplPWsubGVuZ3RoKmM7Qj8oYT1uZXcgVWludDhBcnJheShlKSxhLnNldChrKSk6YT1rO3JldHVybiB0aGlzLmE9YX07XG5WLnByb3RvdHlwZS56PWZ1bmN0aW9uKCl7dmFyIGI9MCxhPXRoaXMuYSxjPXRoaXMubyxkLGU9bmV3IChCP1VpbnQ4QXJyYXk6QXJyYXkpKHRoaXMucysodGhpcy5iLTMyNzY4KSksZixnLGssaDtpZigwPT09Yy5sZW5ndGgpcmV0dXJuIEI/dGhpcy5hLnN1YmFycmF5KDMyNzY4LHRoaXMuYik6dGhpcy5hLnNsaWNlKDMyNzY4LHRoaXMuYik7Zj0wO2ZvcihnPWMubGVuZ3RoO2Y8ZzsrK2Ype2Q9Y1tmXTtrPTA7Zm9yKGg9ZC5sZW5ndGg7azxoOysrayllW2IrK109ZFtrXX1mPTMyNzY4O2ZvcihnPXRoaXMuYjtmPGc7KytmKWVbYisrXT1hW2ZdO3RoaXMubz1bXTtyZXR1cm4gdGhpcy5idWZmZXI9ZX07XG5WLnByb3RvdHlwZS5PPWZ1bmN0aW9uKCl7dmFyIGIsYT10aGlzLmI7Qj90aGlzLks/KGI9bmV3IFVpbnQ4QXJyYXkoYSksYi5zZXQodGhpcy5hLnN1YmFycmF5KDAsYSkpKTpiPXRoaXMuYS5zdWJhcnJheSgwLGEpOih0aGlzLmEubGVuZ3RoPmEmJih0aGlzLmEubGVuZ3RoPWEpLGI9dGhpcy5hKTtyZXR1cm4gdGhpcy5idWZmZXI9Yn07ZnVuY3Rpb24gbWIoYil7dGhpcy5pbnB1dD1iO3RoaXMuYz0wO3RoaXMuRz1bXTt0aGlzLlI9ITF9XG5tYi5wcm90b3R5cGUuaT1mdW5jdGlvbigpe2Zvcih2YXIgYj10aGlzLmlucHV0Lmxlbmd0aDt0aGlzLmM8Yjspe3ZhciBhPW5ldyBqYSxjPXQsZD10LGU9dCxmPXQsZz10LGs9dCxoPXQsbT10LHI9dCxwPXRoaXMuaW5wdXQsbD10aGlzLmM7YS5DPXBbbCsrXTthLkQ9cFtsKytdOygzMSE9PWEuQ3x8MTM5IT09YS5EKSYmcShFcnJvcihcImludmFsaWQgZmlsZSBzaWduYXR1cmU6XCIrYS5DK1wiLFwiK2EuRCkpO2Eudj1wW2wrK107c3dpdGNoKGEudil7Y2FzZSA4OmJyZWFrO2RlZmF1bHQ6cShFcnJvcihcInVua25vd24gY29tcHJlc3Npb24gbWV0aG9kOiBcIithLnYpKX1hLm49cFtsKytdO209cFtsKytdfHBbbCsrXTw8OHxwW2wrK108PDE2fHBbbCsrXTw8MjQ7YS4kPW5ldyBEYXRlKDFFMyptKTthLmJhPXBbbCsrXTthLmFhPXBbbCsrXTswPChhLm4mNCkmJihhLlc9cFtsKytdfHBbbCsrXTw8OCxsKz1hLlcpO2lmKDA8KGEubiZDYSkpe2g9W107Zm9yKGs9MDswPChnPXBbbCsrXSk7KWhbaysrXT1cblN0cmluZy5mcm9tQ2hhckNvZGUoZyk7YS5uYW1lPWguam9pbihcIlwiKX1pZigwPChhLm4mRGEpKXtoPVtdO2ZvcihrPTA7MDwoZz1wW2wrK10pOyloW2srK109U3RyaW5nLmZyb21DaGFyQ29kZShnKTthLnc9aC5qb2luKFwiXCIpfTA8KGEubiZFYSkmJihhLlA9aGEocCwwLGwpJjY1NTM1LGEuUCE9PShwW2wrK118cFtsKytdPDw4KSYmcShFcnJvcihcImludmFsaWQgaGVhZGVyIGNyYzE2XCIpKSk7Yz1wW3AubGVuZ3RoLTRdfHBbcC5sZW5ndGgtM108PDh8cFtwLmxlbmd0aC0yXTw8MTZ8cFtwLmxlbmd0aC0xXTw8MjQ7cC5sZW5ndGgtbC00LTQ8NTEyKmMmJihmPWMpO2Q9bmV3IFYocCx7aW5kZXg6bCxidWZmZXJTaXplOmZ9KTthLmRhdGE9ZT1kLmkoKTtsPWQuYzthLlk9cj0ocFtsKytdfHBbbCsrXTw8OHxwW2wrK108PDE2fHBbbCsrXTw8MjQpPj4+MDtoYShlLHQsdCkhPT1yJiZxKEVycm9yKFwiaW52YWxpZCBDUkMtMzIgY2hlY2tzdW06IDB4XCIraGEoZSx0LHQpLnRvU3RyaW5nKDE2KStcIiAvIDB4XCIrXG5yLnRvU3RyaW5nKDE2KSkpO2EuWj1jPShwW2wrK118cFtsKytdPDw4fHBbbCsrXTw8MTZ8cFtsKytdPDwyNCk+Pj4wOyhlLmxlbmd0aCY0Mjk0OTY3Mjk1KSE9PWMmJnEoRXJyb3IoXCJpbnZhbGlkIGlucHV0IHNpemU6IFwiKyhlLmxlbmd0aCY0Mjk0OTY3Mjk1KStcIiAvIFwiK2MpKTt0aGlzLkcucHVzaChhKTt0aGlzLmM9bH10aGlzLlI9djt2YXIgbj10aGlzLkcscyx1LHc9MCxDPTAseDtzPTA7Zm9yKHU9bi5sZW5ndGg7czx1OysrcylDKz1uW3NdLmRhdGEubGVuZ3RoO2lmKEIpe3g9bmV3IFVpbnQ4QXJyYXkoQyk7Zm9yKHM9MDtzPHU7KytzKXguc2V0KG5bc10uZGF0YSx3KSx3Kz1uW3NdLmRhdGEubGVuZ3RofWVsc2V7eD1bXTtmb3Iocz0wO3M8dTsrK3MpeFtzXT1uW3NdLmRhdGE7eD1BcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLHgpfXJldHVybiB4fTtmdW5jdGlvbiBuYihiKXtpZihcInN0cmluZ1wiPT09dHlwZW9mIGIpe3ZhciBhPWIuc3BsaXQoXCJcIiksYyxkO2M9MDtmb3IoZD1hLmxlbmd0aDtjPGQ7YysrKWFbY109KGFbY10uY2hhckNvZGVBdCgwKSYyNTUpPj4+MDtiPWF9Zm9yKHZhciBlPTEsZj0wLGc9Yi5sZW5ndGgsayxoPTA7MDxnOyl7az0xMDI0PGc/MTAyNDpnO2ctPWs7ZG8gZSs9YltoKytdLGYrPWU7d2hpbGUoLS1rKTtlJT02NTUyMTtmJT02NTUyMX1yZXR1cm4oZjw8MTZ8ZSk+Pj4wfTtmdW5jdGlvbiBvYihiLGEpe3ZhciBjLGQ7dGhpcy5pbnB1dD1iO3RoaXMuYz0wO2lmKGF8fCEoYT17fSkpYS5pbmRleCYmKHRoaXMuYz1hLmluZGV4KSxhLnZlcmlmeSYmKHRoaXMuVj1hLnZlcmlmeSk7Yz1iW3RoaXMuYysrXTtkPWJbdGhpcy5jKytdO3N3aXRjaChjJjE1KXtjYXNlIHBiOnRoaXMubWV0aG9kPXBiO2JyZWFrO2RlZmF1bHQ6cShFcnJvcihcInVuc3VwcG9ydGVkIGNvbXByZXNzaW9uIG1ldGhvZFwiKSl9MCE9PSgoYzw8OCkrZCklMzEmJnEoRXJyb3IoXCJpbnZhbGlkIGZjaGVjayBmbGFnOlwiKygoYzw8OCkrZCklMzEpKTtkJjMyJiZxKEVycm9yKFwiZmRpY3QgZmxhZyBpcyBub3Qgc3VwcG9ydGVkXCIpKTt0aGlzLko9bmV3IFYoYix7aW5kZXg6dGhpcy5jLGJ1ZmZlclNpemU6YS5idWZmZXJTaXplLGJ1ZmZlclR5cGU6YS5idWZmZXJUeXBlLHJlc2l6ZTphLnJlc2l6ZX0pfVxub2IucHJvdG90eXBlLmk9ZnVuY3Rpb24oKXt2YXIgYj10aGlzLmlucHV0LGEsYzthPXRoaXMuSi5pKCk7dGhpcy5jPXRoaXMuSi5jO3RoaXMuViYmKGM9KGJbdGhpcy5jKytdPDwyNHxiW3RoaXMuYysrXTw8MTZ8Ylt0aGlzLmMrK108PDh8Ylt0aGlzLmMrK10pPj4+MCxjIT09bmIoYSkmJnEoRXJyb3IoXCJpbnZhbGlkIGFkbGVyLTMyIGNoZWNrc3VtXCIpKSk7cmV0dXJuIGF9O3ZhciBwYj04O2Z1bmN0aW9uIHJiKGIsYSl7dGhpcy5pbnB1dD1iO3RoaXMuYT1uZXcgKEI/VWludDhBcnJheTpBcnJheSkoMzI3NjgpO3RoaXMuaz1zYi50O3ZhciBjPXt9LGQ7aWYoKGF8fCEoYT17fSkpJiZcIm51bWJlclwiPT09dHlwZW9mIGEuY29tcHJlc3Npb25UeXBlKXRoaXMuaz1hLmNvbXByZXNzaW9uVHlwZTtmb3IoZCBpbiBhKWNbZF09YVtkXTtjLm91dHB1dEJ1ZmZlcj10aGlzLmE7dGhpcy5JPW5ldyBuYSh0aGlzLmlucHV0LGMpfXZhciBzYj1wYTtcbnJiLnByb3RvdHlwZS5oPWZ1bmN0aW9uKCl7dmFyIGIsYSxjLGQsZSxmLGcsaz0wO2c9dGhpcy5hO2I9cGI7c3dpdGNoKGIpe2Nhc2UgcGI6YT1NYXRoLkxPRzJFKk1hdGgubG9nKDMyNzY4KS04O2JyZWFrO2RlZmF1bHQ6cShFcnJvcihcImludmFsaWQgY29tcHJlc3Npb24gbWV0aG9kXCIpKX1jPWE8PDR8YjtnW2srK109Yztzd2l0Y2goYil7Y2FzZSBwYjpzd2l0Y2godGhpcy5rKXtjYXNlIHNiLk5PTkU6ZT0wO2JyZWFrO2Nhc2Ugc2IuTDplPTE7YnJlYWs7Y2FzZSBzYi50OmU9MjticmVhaztkZWZhdWx0OnEoRXJyb3IoXCJ1bnN1cHBvcnRlZCBjb21wcmVzc2lvbiB0eXBlXCIpKX1icmVhaztkZWZhdWx0OnEoRXJyb3IoXCJpbnZhbGlkIGNvbXByZXNzaW9uIG1ldGhvZFwiKSl9ZD1lPDw2fDA7Z1trKytdPWR8MzEtKDI1NipjK2QpJTMxO2Y9bmIodGhpcy5pbnB1dCk7dGhpcy5JLmI9aztnPXRoaXMuSS5oKCk7az1nLmxlbmd0aDtCJiYoZz1uZXcgVWludDhBcnJheShnLmJ1ZmZlciksZy5sZW5ndGg8PVxuays0JiYodGhpcy5hPW5ldyBVaW50OEFycmF5KGcubGVuZ3RoKzQpLHRoaXMuYS5zZXQoZyksZz10aGlzLmEpLGc9Zy5zdWJhcnJheSgwLGsrNCkpO2dbaysrXT1mPj4yNCYyNTU7Z1trKytdPWY+PjE2JjI1NTtnW2srK109Zj4+OCYyNTU7Z1trKytdPWYmMjU1O3JldHVybiBnfTtleHBvcnRzLmRlZmxhdGU9dGI7ZXhwb3J0cy5kZWZsYXRlU3luYz11YjtleHBvcnRzLmluZmxhdGU9dmI7ZXhwb3J0cy5pbmZsYXRlU3luYz13YjtleHBvcnRzLmd6aXA9eGI7ZXhwb3J0cy5nemlwU3luYz15YjtleHBvcnRzLmd1bnppcD16YjtleHBvcnRzLmd1bnppcFN5bmM9QWI7ZnVuY3Rpb24gdGIoYixhLGMpe3Byb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKXt2YXIgZCxlO3RyeXtlPXViKGIsYyl9Y2F0Y2goZil7ZD1mfWEoZCxlKX0pfWZ1bmN0aW9uIHViKGIsYSl7dmFyIGM7Yz0obmV3IHJiKGIpKS5oKCk7YXx8KGE9e30pO3JldHVybiBhLkg/YzpCYihjKX1mdW5jdGlvbiB2YihiLGEsYyl7cHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpe3ZhciBkLGU7dHJ5e2U9d2IoYixjKX1jYXRjaChmKXtkPWZ9YShkLGUpfSl9XG5mdW5jdGlvbiB3YihiLGEpe3ZhciBjO2Iuc3ViYXJyYXk9Yi5zbGljZTtjPShuZXcgb2IoYikpLmkoKTthfHwoYT17fSk7cmV0dXJuIGEubm9CdWZmZXI/YzpCYihjKX1mdW5jdGlvbiB4YihiLGEsYyl7cHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpe3ZhciBkLGU7dHJ5e2U9eWIoYixjKX1jYXRjaChmKXtkPWZ9YShkLGUpfSl9ZnVuY3Rpb24geWIoYixhKXt2YXIgYztiLnN1YmFycmF5PWIuc2xpY2U7Yz0obmV3IEJhKGIpKS5oKCk7YXx8KGE9e30pO3JldHVybiBhLkg/YzpCYihjKX1mdW5jdGlvbiB6YihiLGEsYyl7cHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpe3ZhciBkLGU7dHJ5e2U9QWIoYixjKX1jYXRjaChmKXtkPWZ9YShkLGUpfSl9ZnVuY3Rpb24gQWIoYixhKXt2YXIgYztiLnN1YmFycmF5PWIuc2xpY2U7Yz0obmV3IG1iKGIpKS5pKCk7YXx8KGE9e30pO3JldHVybiBhLkg/YzpCYihjKX1cbmZ1bmN0aW9uIEJiKGIpe3ZhciBhPW5ldyBCdWZmZXIoYi5sZW5ndGgpLGMsZDtjPTA7Zm9yKGQ9Yi5sZW5ndGg7YzxkOysrYylhW2NdPWJbY107cmV0dXJuIGF9O30pLmNhbGwodGhpcyk7XG4iLCIvKlxyXG4gKiBQU00gPSBQYWdlIFNlZ21lbnRhdGlvbiBNb2RlXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBPU0RfT05MWTogJzAnLFxyXG4gIEFVVE9fT1NEOiAnMScsXHJcbiAgQVVUT19PTkxZOiAnMicsXHJcbiAgQVVUTzogJzMnLFxyXG4gIFNJTkdMRV9DT0xVTU46ICc0JyxcclxuICBTSU5HTEVfQkxPQ0tfVkVSVF9URVhUOiAnNScsXHJcbiAgU0lOR0xFX0JMT0NLOiAnNicsXHJcbiAgU0lOR0xFX0xJTkU6ICc3JyxcclxuICBTSU5HTEVfV09SRDogJzgnLFxyXG4gIENJUkNMRV9XT1JEOiAnOScsXHJcbiAgU0lOR0xFX0NIQVI6ICcxMCcsXHJcbiAgU1BBUlNFX1RFWFQ6ICcxMScsXHJcbiAgU1BBUlNFX1RFWFRfT1NEOiAnMTInLFxyXG59O1xyXG4iLCJjb25zdCBpc0VsZWN0cm9uID0gcmVxdWlyZSgnaXMtZWxlY3Ryb24nKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gKGtleSkgPT4ge1xyXG4gIGNvbnN0IGVudiA9IHt9O1xyXG5cclxuICBpZiAodHlwZW9mIFdvcmtlckdsb2JhbFNjb3BlICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgZW52LnR5cGUgPSAnd2Vid29ya2VyJztcclxuICB9IGVsc2UgaWYgKGlzRWxlY3Ryb24oKSkge1xyXG4gICAgZW52LnR5cGUgPSAnZWxlY3Ryb24nO1xyXG4gIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHtcclxuICAgIGVudi50eXBlID0gJ2Jyb3dzZXInO1xyXG4gIH0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnICYmIHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBlbnYudHlwZSA9ICdub2RlJztcclxuICB9XHJcblxyXG4gIGlmICh0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgcmV0dXJuIGVudjtcclxuICB9XHJcblxyXG4gIHJldHVybiBlbnZba2V5XTtcclxufTtcclxuIiwibGV0IGxvZ2dpbmcgPSBmYWxzZTtcclxuXHJcbmV4cG9ydHMubG9nZ2luZyA9IGxvZ2dpbmc7XHJcblxyXG5leHBvcnRzLnNldExvZ2dpbmcgPSAoX2xvZ2dpbmcpID0+IHtcclxuICBsb2dnaW5nID0gX2xvZ2dpbmc7XHJcbn07XHJcblxyXG5leHBvcnRzLmxvZyA9ICguLi5hcmdzKSA9PiAobG9nZ2luZyA/IGNvbnNvbGUubG9nLmFwcGx5KHRoaXMsIGFyZ3MpIDogbnVsbCk7XHJcbiIsImNvbnN0IHsgc2V0LCBnZXQsIGRlbCB9ID0gcmVxdWlyZSgnaWRiLWtleXZhbCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgcmVhZENhY2hlOiBnZXQsXHJcbiAgd3JpdGVDYWNoZTogc2V0LFxyXG4gIGRlbGV0ZUNhY2hlOiBkZWwsXHJcbiAgY2hlY2tDYWNoZTogKHBhdGgpID0+IChcclxuICAgIGdldChwYXRoKS50aGVuKCh2KSA9PiB0eXBlb2YgdiAhPT0gJ3VuZGVmaW5lZCcpXHJcbiAgKSxcclxufTtcclxuIiwiY29uc3QgeyBzaW1kIH0gPSByZXF1aXJlKCd3YXNtLWZlYXR1cmUtZGV0ZWN0Jyk7XHJcbmNvbnN0IHsgZGVwZW5kZW5jaWVzIH0gPSByZXF1aXJlKCcuLi8uLi8uLi9wYWNrYWdlLmpzb24nKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgKGNvcmVQYXRoLCByZXMpID0+IHtcclxuICBpZiAodHlwZW9mIGdsb2JhbC5UZXNzZXJhY3RDb3JlID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgcmVzLnByb2dyZXNzKHsgc3RhdHVzOiAnbG9hZGluZyB0ZXNzZXJhY3QgY29yZScsIHByb2dyZXNzOiAwIH0pO1xyXG5cclxuICAgIC8vIElmIHRoZSB1c2VyIHNwZWNpZmllcyBhIGNvcmUgcGF0aCwgd2UgdXNlIHRoYXRcclxuICAgIC8vIE90aGVyd2lzZSwgd2UgZGV0ZWN0IHRoZSBjb3JyZWN0IGNvcmUgYmFzZWQgb24gU0lNRCBzdXBwb3J0XHJcbiAgICBsZXQgY29yZVBhdGhJbXBvcnQgPSBjb3JlUGF0aDtcclxuICAgIGlmICghY29yZVBhdGhJbXBvcnQpIHtcclxuICAgICAgY29uc3Qgc2ltZFN1cHBvcnQgPSBhd2FpdCBzaW1kKCk7XHJcbiAgICAgIGlmIChzaW1kU3VwcG9ydCkge1xyXG4gICAgICAgIGNvcmVQYXRoSW1wb3J0ID0gYGh0dHBzOi8vdW5wa2cuY29tL3Rlc3NlcmFjdC5qcy1jb3JlQHYke2RlcGVuZGVuY2llc1sndGVzc2VyYWN0LmpzLWNvcmUnXS5zdWJzdHJpbmcoMSl9L3Rlc3NlcmFjdC1jb3JlLXNpbWQud2FzbS5qc2A7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29yZVBhdGhJbXBvcnQgPSBgaHR0cHM6Ly91bnBrZy5jb20vdGVzc2VyYWN0LmpzLWNvcmVAdiR7ZGVwZW5kZW5jaWVzWyd0ZXNzZXJhY3QuanMtY29yZSddLnN1YnN0cmluZygxKX0vdGVzc2VyYWN0LWNvcmUud2FzbS5qc2A7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnbG9iYWwuaW1wb3J0U2NyaXB0cyhjb3JlUGF0aEltcG9ydCk7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBnbG9iYWwuVGVzc2VyYWN0Q29yZVdBU00gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBXZWJBc3NlbWJseSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgZ2xvYmFsLlRlc3NlcmFjdENvcmUgPSBnbG9iYWwuVGVzc2VyYWN0Q29yZVdBU007XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBFcnJvcignRmFpbGVkIHRvIGxvYWQgVGVzc2VyYWN0Q29yZScpO1xyXG4gICAgfVxyXG4gICAgcmVzLnByb2dyZXNzKHsgc3RhdHVzOiAnbG9hZGluZyB0ZXNzZXJhY3QgY29yZScsIHByb2dyZXNzOiAxIH0pO1xyXG4gIH1cclxuICByZXR1cm4gZ2xvYmFsLlRlc3NlcmFjdENvcmU7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnemxpYmpzJykuZ3VuemlwU3luYztcclxuIiwiLypcclxuICogZGVmYXVsdCBwYXJhbXMgZm9yIHRlc3NlcmFjdC5qc1xyXG4gKi9cclxuY29uc3QgUFNNID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL1BTTScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgdGVzc2VkaXRfcGFnZXNlZ19tb2RlOiBQU00uU0lOR0xFX0JMT0NLLFxyXG4gIHRlc3NlZGl0X2NoYXJfd2hpdGVsaXN0OiAnJyxcclxuICB0ZXNzanNfY3JlYXRlX2hvY3I6ICcxJyxcclxuICB0ZXNzanNfY3JlYXRlX3RzdjogJzEnLFxyXG4gIHRlc3Nqc19jcmVhdGVfYm94OiAnMCcsXHJcbiAgdGVzc2pzX2NyZWF0ZV91bmx2OiAnMCcsXHJcbiAgdGVzc2pzX2NyZWF0ZV9vc2Q6ICcwJyxcclxufTtcclxuIiwiLyoqXHJcbiAqXHJcbiAqIFdvcmtlciBzY3JpcHQgZm9yIGJyb3dzZXIgYW5kIG5vZGVcclxuICpcclxuICogQGZpbGVvdmVydmlldyBXb3JrZXIgc2NyaXB0IGZvciBicm93c2VyIGFuZCBub2RlXHJcbiAqIEBhdXRob3IgS2V2aW4gS3dvayA8YW50aW1hdHRlcjE1QGdtYWlsLmNvbT5cclxuICogQGF1dGhvciBHdWlsbGVybW8gV2Vic3RlciA8Z3VpQG1pdC5lZHU+XHJcbiAqIEBhdXRob3IgSmVyb21lIFd1IDxqZXJvbWV3dXNAZ21haWwuY29tPlxyXG4gKi9cclxucmVxdWlyZSgncmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lJyk7XHJcbmNvbnN0IGZpbGVUeXBlID0gcmVxdWlyZSgnZmlsZS10eXBlJyk7XHJcbmNvbnN0IGlzVVJMID0gcmVxdWlyZSgnaXMtdXJsJyk7XHJcbmNvbnN0IGR1bXAgPSByZXF1aXJlKCcuL3V0aWxzL2R1bXAnKTtcclxuY29uc3QgaXNXZWJXb3JrZXIgPSByZXF1aXJlKCcuLi91dGlscy9nZXRFbnZpcm9ubWVudCcpKCd0eXBlJykgPT09ICd3ZWJ3b3JrZXInO1xyXG5jb25zdCBzZXRJbWFnZSA9IHJlcXVpcmUoJy4vdXRpbHMvc2V0SW1hZ2UnKTtcclxuY29uc3QgZGVmYXVsdFBhcmFtcyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzL2RlZmF1bHRQYXJhbXMnKTtcclxuY29uc3QgeyBsb2csIHNldExvZ2dpbmcgfSA9IHJlcXVpcmUoJy4uL3V0aWxzL2xvZycpO1xyXG5cclxuLypcclxuICogVGVzc2VyYWN0IE1vZHVsZSByZXR1cm5lZCBieSBUZXNzZXJhY3RDb3JlLlxyXG4gKi9cclxubGV0IFRlc3NNb2R1bGU7XHJcbi8qXHJcbiAqIFRlc3NlYXJjdEJhc2VBUEkgaW5zdGFuY2VcclxuICovXHJcbmxldCBhcGkgPSBudWxsO1xyXG5sZXQgbGF0ZXN0Sm9iO1xyXG5sZXQgYWRhcHRlciA9IHt9O1xyXG5sZXQgcGFyYW1zID0gZGVmYXVsdFBhcmFtcztcclxuXHJcbmNvbnN0IGxvYWQgPSBhc3luYyAoeyB3b3JrZXJJZCwgam9iSWQsIHBheWxvYWQ6IHsgb3B0aW9uczogeyBjb3JlUGF0aCwgbG9nZ2luZyB9IH0gfSwgcmVzKSA9PiB7XHJcbiAgc2V0TG9nZ2luZyhsb2dnaW5nKTtcclxuICBpZiAoIVRlc3NNb2R1bGUpIHtcclxuICAgIGNvbnN0IENvcmUgPSBhd2FpdCBhZGFwdGVyLmdldENvcmUoY29yZVBhdGgsIHJlcyk7XHJcblxyXG4gICAgcmVzLnByb2dyZXNzKHsgd29ya2VySWQsIHN0YXR1czogJ2luaXRpYWxpemluZyB0ZXNzZXJhY3QnLCBwcm9ncmVzczogMCB9KTtcclxuXHJcbiAgICBDb3JlKHtcclxuICAgICAgVGVzc2VyYWN0UHJvZ3Jlc3MocGVyY2VudCkge1xyXG4gICAgICAgIGxhdGVzdEpvYi5wcm9ncmVzcyh7XHJcbiAgICAgICAgICB3b3JrZXJJZCxcclxuICAgICAgICAgIGpvYklkLFxyXG4gICAgICAgICAgc3RhdHVzOiAncmVjb2duaXppbmcgdGV4dCcsXHJcbiAgICAgICAgICBwcm9ncmVzczogTWF0aC5tYXgoMCwgKHBlcmNlbnQgLSAzMCkgLyA3MCksXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICB9KS50aGVuKCh0ZXNzTW9kdWxlKSA9PiB7XHJcbiAgICAgIFRlc3NNb2R1bGUgPSB0ZXNzTW9kdWxlO1xyXG4gICAgICByZXMucHJvZ3Jlc3MoeyB3b3JrZXJJZCwgc3RhdHVzOiAnaW5pdGlhbGl6ZWQgdGVzc2VyYWN0JywgcHJvZ3Jlc3M6IDEgfSk7XHJcbiAgICAgIHJlcy5yZXNvbHZlKHsgbG9hZGVkOiB0cnVlIH0pO1xyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJlcy5yZXNvbHZlKHsgbG9hZGVkOiB0cnVlIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IEZTID0gKHsgd29ya2VySWQsIHBheWxvYWQ6IHsgbWV0aG9kLCBhcmdzIH0gfSwgcmVzKSA9PiB7XHJcbiAgbG9nKGBbJHt3b3JrZXJJZH1dOiBGUy4ke21ldGhvZH0gd2l0aCBhcmdzICR7YXJnc31gKTtcclxuICByZXMucmVzb2x2ZShUZXNzTW9kdWxlLkZTW21ldGhvZF0oLi4uYXJncykpO1xyXG59O1xyXG5cclxuY29uc3QgbG9hZExhbmd1YWdlID0gYXN5bmMgKHtcclxuICB3b3JrZXJJZCxcclxuICBwYXlsb2FkOiB7XHJcbiAgICBsYW5ncyxcclxuICAgIG9wdGlvbnM6IHtcclxuICAgICAgbGFuZ1BhdGgsXHJcbiAgICAgIGRhdGFQYXRoLFxyXG4gICAgICBjYWNoZVBhdGgsXHJcbiAgICAgIGNhY2hlTWV0aG9kLFxyXG4gICAgICBnemlwID0gdHJ1ZSxcclxuICAgIH0sXHJcbiAgfSxcclxufSxcclxucmVzKSA9PiB7XHJcbiAgY29uc3QgbG9hZEFuZEd1bnppcEZpbGUgPSBhc3luYyAoX2xhbmcpID0+IHtcclxuICAgIGNvbnN0IGxhbmcgPSB0eXBlb2YgX2xhbmcgPT09ICdzdHJpbmcnID8gX2xhbmcgOiBfbGFuZy5jb2RlO1xyXG4gICAgY29uc3QgcmVhZENhY2hlID0gWydyZWZyZXNoJywgJ25vbmUnXS5pbmNsdWRlcyhjYWNoZU1ldGhvZClcclxuICAgICAgPyAoKSA9PiBQcm9taXNlLnJlc29sdmUoKVxyXG4gICAgICA6IGFkYXB0ZXIucmVhZENhY2hlO1xyXG4gICAgbGV0IGRhdGEgPSBudWxsO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IF9kYXRhID0gYXdhaXQgcmVhZENhY2hlKGAke2NhY2hlUGF0aCB8fCAnLid9LyR7bGFuZ30udHJhaW5lZGRhdGFgKTtcclxuICAgICAgaWYgKHR5cGVvZiBfZGF0YSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBsb2coYFske3dvcmtlcklkfV06IExvYWQgJHtsYW5nfS50cmFpbmVkZGF0YSBmcm9tIGNhY2hlYCk7XHJcbiAgICAgICAgcmVzLnByb2dyZXNzKHsgd29ya2VySWQsIHN0YXR1czogJ2xvYWRpbmcgbGFuZ3VhZ2UgdHJhaW5lZGRhdGEgKGZyb20gY2FjaGUpJywgcHJvZ3Jlc3M6IDAuNSB9KTtcclxuICAgICAgICBkYXRhID0gX2RhdGE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgRXJyb3IoJ05vdCBmb3VuZCBpbiBjYWNoZScpO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGxvZyhgWyR7d29ya2VySWR9XTogTG9hZCAke2xhbmd9LnRyYWluZWRkYXRhIGZyb20gJHtsYW5nUGF0aH1gKTtcclxuICAgICAgaWYgKHR5cGVvZiBfbGFuZyA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICBsZXQgcGF0aCA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmIChpc1VSTChsYW5nUGF0aCkgfHwgbGFuZ1BhdGguc3RhcnRzV2l0aCgnbW96LWV4dGVuc2lvbjovLycpIHx8IGxhbmdQYXRoLnN0YXJ0c1dpdGgoJ2Nocm9tZS1leHRlbnNpb246Ly8nKSB8fCBsYW5nUGF0aC5zdGFydHNXaXRoKCdmaWxlOi8vJykpIHsgLyoqIFdoZW4gbGFuZ1BhdGggaXMgYW4gVVJMICovXHJcbiAgICAgICAgICBwYXRoID0gbGFuZ1BhdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGF0aCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgY29uc3QgZmV0Y2hVcmwgPSBgJHtwYXRofS8ke2xhbmd9LnRyYWluZWRkYXRhJHtnemlwID8gJy5neicgOiAnJ31gO1xyXG4gICAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IChpc1dlYldvcmtlciA/IGZldGNoIDogYWRhcHRlci5mZXRjaCkoZmV0Y2hVcmwpO1xyXG4gICAgICAgICAgaWYgKCFyZXNwLm9rKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBOZXR3b3JrIGVycm9yIHdoaWxlIGZldGNoaW5nICR7ZmV0Y2hVcmx9LiBSZXNwb25zZSBjb2RlOiAke3Jlc3Auc3RhdHVzfWApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZGF0YSA9IGF3YWl0IHJlc3AuYXJyYXlCdWZmZXIoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZGF0YSA9IGF3YWl0IGFkYXB0ZXIucmVhZENhY2hlKGAke2xhbmdQYXRofS8ke2xhbmd9LnRyYWluZWRkYXRhJHtnemlwID8gJy5neicgOiAnJ31gKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGF0YSA9IF9sYW5nLmRhdGE7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRhdGEgPSBuZXcgVWludDhBcnJheShkYXRhKTtcclxuXHJcbiAgICBjb25zdCB0eXBlID0gZmlsZVR5cGUoZGF0YSk7XHJcbiAgICBpZiAodHlwZW9mIHR5cGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGUubWltZSA9PT0gJ2FwcGxpY2F0aW9uL2d6aXAnKSB7XHJcbiAgICAgIGRhdGEgPSBhZGFwdGVyLmd1bnppcChkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoVGVzc01vZHVsZSkge1xyXG4gICAgICBpZiAoZGF0YVBhdGgpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgVGVzc01vZHVsZS5GUy5ta2RpcihkYXRhUGF0aCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICByZXMucmVqZWN0KGVyci50b1N0cmluZygpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgVGVzc01vZHVsZS5GUy53cml0ZUZpbGUoYCR7ZGF0YVBhdGggfHwgJy4nfS8ke2xhbmd9LnRyYWluZWRkYXRhYCwgZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKFsnd3JpdGUnLCAncmVmcmVzaCcsIHVuZGVmaW5lZF0uaW5jbHVkZXMoY2FjaGVNZXRob2QpKSB7XHJcbiAgICAgIGF3YWl0IGFkYXB0ZXIud3JpdGVDYWNoZShgJHtjYWNoZVBhdGggfHwgJy4nfS8ke2xhbmd9LnRyYWluZWRkYXRhYCwgZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShkYXRhKTtcclxuICB9O1xyXG5cclxuICByZXMucHJvZ3Jlc3MoeyB3b3JrZXJJZCwgc3RhdHVzOiAnbG9hZGluZyBsYW5ndWFnZSB0cmFpbmVkZGF0YScsIHByb2dyZXNzOiAwIH0pO1xyXG4gIHRyeSB7XHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbCgodHlwZW9mIGxhbmdzID09PSAnc3RyaW5nJyA/IGxhbmdzLnNwbGl0KCcrJykgOiBsYW5ncykubWFwKGxvYWRBbmRHdW56aXBGaWxlKSk7XHJcbiAgICByZXMucHJvZ3Jlc3MoeyB3b3JrZXJJZCwgc3RhdHVzOiAnbG9hZGVkIGxhbmd1YWdlIHRyYWluZWRkYXRhJywgcHJvZ3Jlc3M6IDEgfSk7XHJcbiAgICByZXMucmVzb2x2ZShsYW5ncyk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICBpZiAoaXNXZWJXb3JrZXIgJiYgZXJyIGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uKSB7XHJcbiAgICAgIC8qXHJcbiAgICAgICAqIEZvciBzb21lIHJlYXNvbiBnb29nbGUgY2hyb21lIHRocm93IERPTUV4Y2VwdGlvbiBpbiBsb2FkTGFuZyxcclxuICAgICAgICogd2hpbGUgb3RoZXIgYnJvd3NlciBpcyBPSywgZm9yIG5vdyB3ZSBpZ25vcmUgdGhpcyBleGNlcHRpb25cclxuICAgICAgICogYW5kIGhvcGVmdWxseSB0byBmaW5kIHRoZSByb290IGNhdXNlIG9uZSBkYXkuXHJcbiAgICAgICAqL1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzLnJlamVjdChlcnIudG9TdHJpbmcoKSk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3Qgc2V0UGFyYW1ldGVycyA9ICh7IHBheWxvYWQ6IHsgcGFyYW1zOiBfcGFyYW1zIH0gfSwgcmVzKSA9PiB7XHJcbiAgT2JqZWN0LmtleXMoX3BhcmFtcylcclxuICAgIC5maWx0ZXIoKGspID0+ICFrLnN0YXJ0c1dpdGgoJ3Rlc3Nqc18nKSlcclxuICAgIC5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgYXBpLlNldFZhcmlhYmxlKGtleSwgX3BhcmFtc1trZXldKTtcclxuICAgIH0pO1xyXG4gIHBhcmFtcyA9IHsgLi4ucGFyYW1zLCAuLi5fcGFyYW1zIH07XHJcblxyXG4gIGlmICh0eXBlb2YgcmVzICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgcmVzLnJlc29sdmUocGFyYW1zKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBpbml0aWFsaXplID0gKHtcclxuICB3b3JrZXJJZCxcclxuICBwYXlsb2FkOiB7IGxhbmdzOiBfbGFuZ3MsIG9lbSB9LFxyXG59LCByZXMpID0+IHtcclxuICBjb25zdCBsYW5ncyA9ICh0eXBlb2YgX2xhbmdzID09PSAnc3RyaW5nJylcclxuICAgID8gX2xhbmdzXHJcbiAgICA6IF9sYW5ncy5tYXAoKGwpID0+ICgodHlwZW9mIGwgPT09ICdzdHJpbmcnKSA/IGwgOiBsLmRhdGEpKS5qb2luKCcrJyk7XHJcblxyXG4gIHRyeSB7XHJcbiAgICByZXMucHJvZ3Jlc3Moe1xyXG4gICAgICB3b3JrZXJJZCwgc3RhdHVzOiAnaW5pdGlhbGl6aW5nIGFwaScsIHByb2dyZXNzOiAwLFxyXG4gICAgfSk7XHJcbiAgICBpZiAoYXBpICE9PSBudWxsKSB7XHJcbiAgICAgIGFwaS5FbmQoKTtcclxuICAgICAgfVxyXG4gICAgICBzb21lRGF0YSA9IG9wdGlvbnMuZGF0YVBhdGg7XHJcbiAgICAgIHNvbWVPdGhlckRhdGEgPSBkYXRhUGF0aDtcclxuICAgIGFwaSA9IG5ldyBUZXNzTW9kdWxlLlRlc3NCYXNlQVBJKCk7XHJcbiAgICBhcGkuSW5pdChudWxsLCBsYW5ncywgb2VtKTtcclxuICAgIHBhcmFtcyA9IGRlZmF1bHRQYXJhbXM7XHJcbiAgICBzZXRQYXJhbWV0ZXJzKHsgcGF5bG9hZDogeyBwYXJhbXMgfSB9KTtcclxuICAgIHJlcy5wcm9ncmVzcyh7XHJcbiAgICAgIHdvcmtlcklkLCBzdGF0dXM6ICdpbml0aWFsaXplZCBhcGknLCBwcm9ncmVzczogMSxcclxuICAgIH0pO1xyXG4gICAgcmVzLnJlc29sdmUoKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJlcy5yZWplY3QoZXJyLnRvU3RyaW5nKCkpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IHJlY29nbml6ZSA9ICh7IHBheWxvYWQ6IHsgaW1hZ2UsIG9wdGlvbnM6IHsgcmVjdGFuZ2xlOiByZWMgfSB9IH0sIHJlcykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBwdHIgPSBzZXRJbWFnZShUZXNzTW9kdWxlLCBhcGksIGltYWdlKTtcclxuICAgIGlmICh0eXBlb2YgcmVjID09PSAnb2JqZWN0Jykge1xyXG4gICAgICBhcGkuU2V0UmVjdGFuZ2xlKHJlYy5sZWZ0LCByZWMudG9wLCByZWMud2lkdGgsIHJlYy5oZWlnaHQpO1xyXG4gICAgfVxyXG4gICAgYXBpLlJlY29nbml6ZShudWxsKTtcclxuICAgIHJlcy5yZXNvbHZlKGR1bXAoVGVzc01vZHVsZSwgYXBpLCBwYXJhbXMpKTtcclxuICAgIFRlc3NNb2R1bGUuX2ZyZWUocHRyKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJlcy5yZWplY3QoZXJyLnRvU3RyaW5nKCkpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGdldFBERiA9ICh7IHBheWxvYWQ6IHsgdGl0bGUsIHRleHRvbmx5IH0gfSwgcmVzKSA9PiB7XHJcbiAgY29uc3QgcGRmUmVuZGVyZXIgPSBuZXcgVGVzc01vZHVsZS5UZXNzUERGUmVuZGVyZXIoJ3Rlc3NlcmFjdC1vY3InLCAnLycsIHRleHRvbmx5KTtcclxuICBwZGZSZW5kZXJlci5CZWdpbkRvY3VtZW50KHRpdGxlKTtcclxuICBwZGZSZW5kZXJlci5BZGRJbWFnZShhcGkpO1xyXG4gIHBkZlJlbmRlcmVyLkVuZERvY3VtZW50KCk7XHJcbiAgVGVzc01vZHVsZS5fZnJlZShwZGZSZW5kZXJlcik7XHJcblxyXG4gIHJlcy5yZXNvbHZlKFRlc3NNb2R1bGUuRlMucmVhZEZpbGUoJy90ZXNzZXJhY3Qtb2NyLnBkZicpKTtcclxufTtcclxuXHJcbmNvbnN0IGRldGVjdCA9ICh7IHBheWxvYWQ6IHsgaW1hZ2UgfSB9LCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcHRyID0gc2V0SW1hZ2UoVGVzc01vZHVsZSwgYXBpLCBpbWFnZSk7XHJcbiAgICBjb25zdCByZXN1bHRzID0gbmV3IFRlc3NNb2R1bGUuT1NSZXN1bHRzKCk7XHJcblxyXG4gICAgaWYgKCFhcGkuRGV0ZWN0T1MocmVzdWx0cykpIHtcclxuICAgICAgYXBpLkVuZCgpO1xyXG4gICAgICBUZXNzTW9kdWxlLl9mcmVlKHB0cik7XHJcbiAgICAgIHJlcy5yZWplY3QoJ0ZhaWxlZCB0byBkZXRlY3QgT1MnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGJlc3QgPSByZXN1bHRzLmJlc3RfcmVzdWx0O1xyXG4gICAgICBjb25zdCBvaWQgPSBiZXN0Lm9yaWVudGF0aW9uX2lkO1xyXG4gICAgICBjb25zdCBzaWQgPSBiZXN0LnNjcmlwdF9pZDtcclxuXHJcbiAgICAgIFRlc3NNb2R1bGUuX2ZyZWUocHRyKTtcclxuXHJcbiAgICAgIHJlcy5yZXNvbHZlKHtcclxuICAgICAgICB0ZXNzZXJhY3Rfc2NyaXB0X2lkOiBzaWQsXHJcbiAgICAgICAgc2NyaXB0OiByZXN1bHRzLnVuaWNoYXJzZXQuZ2V0X3NjcmlwdF9mcm9tX3NjcmlwdF9pZChzaWQpLFxyXG4gICAgICAgIHNjcmlwdF9jb25maWRlbmNlOiBiZXN0LnNjb25maWRlbmNlLFxyXG4gICAgICAgIG9yaWVudGF0aW9uX2RlZ3JlZXM6IFswLCAyNzAsIDE4MCwgOTBdW29pZF0sXHJcbiAgICAgICAgb3JpZW50YXRpb25fY29uZmlkZW5jZTogYmVzdC5vY29uZmlkZW5jZSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICByZXMucmVqZWN0KGVyci50b1N0cmluZygpKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCB0ZXJtaW5hdGUgPSAoXywgcmVzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGlmIChhcGkgIT09IG51bGwpIHtcclxuICAgICAgYXBpLkVuZCgpO1xyXG4gICAgfVxyXG4gICAgcmVzLnJlc29sdmUoeyB0ZXJtaW5hdGVkOiB0cnVlIH0pO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmVzLnJlamVjdChlcnIudG9TdHJpbmcoKSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIGRpc3BhdGNoSGFuZGxlcnNcclxuICpcclxuICogQG5hbWUgZGlzcGF0Y2hIYW5kbGVyc1xyXG4gKiBAZnVuY3Rpb24gd29ya2VyIGRhdGEgaGFuZGxlclxyXG4gKiBAYWNjZXNzIHB1YmxpY1xyXG4gKiBAcGFyYW0ge29iamVjdH0gZGF0YVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0YS5qb2JJZCAtIHVuaXF1ZSBqb2IgaWRcclxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGEuYWN0aW9uIC0gYWN0aW9uIG9mIHRoZSBqb2IsIG9ubHkgcmVjb2duaXplIGFuZCBkZXRlY3QgZm9yIG5vd1xyXG4gKiBAcGFyYW0ge29iamVjdH0gZGF0YS5wYXlsb2FkIC0gZGF0YSBmb3IgdGhlIGpvYlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzZW5kIC0gdHJpZ2dlciBqb2IgdG8gd29ya1xyXG4gKi9cclxuZXhwb3J0cy5kaXNwYXRjaEhhbmRsZXJzID0gKHBhY2tldCwgc2VuZCkgPT4ge1xyXG4gIGNvbnN0IHJlcyA9IChzdGF0dXMsIGRhdGEpID0+IHtcclxuICAgIHNlbmQoe1xyXG4gICAgICAuLi5wYWNrZXQsXHJcbiAgICAgIHN0YXR1cyxcclxuICAgICAgZGF0YSxcclxuICAgIH0pO1xyXG4gIH07XHJcbiAgcmVzLnJlc29sdmUgPSByZXMuYmluZCh0aGlzLCAncmVzb2x2ZScpO1xyXG4gIHJlcy5yZWplY3QgPSByZXMuYmluZCh0aGlzLCAncmVqZWN0Jyk7XHJcbiAgcmVzLnByb2dyZXNzID0gcmVzLmJpbmQodGhpcywgJ3Byb2dyZXNzJyk7XHJcblxyXG4gIGxhdGVzdEpvYiA9IHJlcztcclxuXHJcbiAgdHJ5IHtcclxuICAgICh7XHJcbiAgICAgIGxvYWQsXHJcbiAgICAgIEZTLFxyXG4gICAgICBsb2FkTGFuZ3VhZ2UsXHJcbiAgICAgIGluaXRpYWxpemUsXHJcbiAgICAgIHNldFBhcmFtZXRlcnMsXHJcbiAgICAgIHJlY29nbml6ZSxcclxuICAgICAgZ2V0UERGLFxyXG4gICAgICBkZXRlY3QsXHJcbiAgICAgIHRlcm1pbmF0ZSxcclxuICAgIH0pW3BhY2tldC5hY3Rpb25dKHBhY2tldCwgcmVzKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIC8qKiBQcmVwYXJlIGV4Y2VwdGlvbiB0byB0cmF2ZWwgdGhyb3VnaCBwb3N0TWVzc2FnZSAqL1xyXG4gICAgcmVzLnJlamVjdChlcnIudG9TdHJpbmcoKSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIHNldEFkYXB0ZXJcclxuICpcclxuICogQG5hbWUgc2V0QWRhcHRlclxyXG4gKiBAZnVuY3Rpb25cclxuICogQGFjY2VzcyBwdWJsaWNcclxuICogQHBhcmFtIHtvYmplY3R9IGFkYXB0ZXIgLSBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgd29ya2VyLCBkaWZmZXJlbnQgaW4gYnJvd3NlciBhbmQgbm9kZSBlbnZpcm9ubWVudFxyXG4gKi9cclxuZXhwb3J0cy5zZXRBZGFwdGVyID0gKF9hZGFwdGVyKSA9PiB7XHJcbiAgYWRhcHRlciA9IF9hZGFwdGVyO1xyXG59O1xyXG4iLCIvKipcclxuICpcclxuICogRHVtcCBkYXRhIHRvIGEgYmlnIEpTT04gdHJlZVxyXG4gKlxyXG4gKiBAZmlsZW92ZXJ2aWV3IGR1bXAgZGF0YSB0byBKU09OIHRyZWVcclxuICogQGF1dGhvciBLZXZpbiBLd29rIDxhbnRpbWF0dGVyMTVAZ21haWwuY29tPlxyXG4gKiBAYXV0aG9yIEd1aWxsZXJtbyBXZWJzdGVyIDxndWlAbWl0LmVkdT5cclxuICogQGF1dGhvciBKZXJvbWUgV3UgPGplcm9tZXd1c0BnbWFpbC5jb20+XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIGRlaW5kZW50XHJcbiAqXHJcbiAqIFRoZSBnZW5lcmF0ZWQgSE9DUiBpcyBleGNlc3NpdmVseSBpbmRlbnRlZCwgc29cclxuICogd2UgZ2V0IHJpZCBvZiB0aGF0IGluZGVudGF0aW9uXHJcbiAqXHJcbiAqIEBuYW1lIGRlaW5kZW50XHJcbiAqIEBmdW5jdGlvbiBkZWluZGVudCBzdHJpbmdcclxuICogQGFjY2VzcyBwdWJsaWNcclxuICovXHJcbmNvbnN0IGRlaW5kZW50ID0gKGh0bWwpID0+IHtcclxuICBjb25zdCBsaW5lcyA9IGh0bWwuc3BsaXQoJ1xcbicpO1xyXG4gIGlmIChsaW5lc1swXS5zdWJzdHJpbmcoMCwgMikgPT09ICcgICcpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgaWYgKGxpbmVzW2ldLnN1YnN0cmluZygwLCAyKSA9PT0gJyAgJykge1xyXG4gICAgICAgIGxpbmVzW2ldID0gbGluZXNbaV0uc2xpY2UoMik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIGR1bXBcclxuICpcclxuICogQG5hbWUgZHVtcFxyXG4gKiBAZnVuY3Rpb24gZHVtcCByZWNvZ25pdGlvbiByZXN1bHQgdG8gYSBKU09OIG9iamVjdFxyXG4gKiBAYWNjZXNzIHB1YmxpY1xyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAoVGVzc01vZHVsZSwgYXBpLCB7XHJcbiAgdGVzc2pzX2NyZWF0ZV9ob2NyLFxyXG4gIHRlc3Nqc19jcmVhdGVfdHN2LFxyXG4gIHRlc3Nqc19jcmVhdGVfYm94LFxyXG4gIHRlc3Nqc19jcmVhdGVfdW5sdixcclxuICB0ZXNzanNfY3JlYXRlX29zZCxcclxufSkgPT4ge1xyXG4gIGNvbnN0IHJpID0gYXBpLkdldEl0ZXJhdG9yKCk7XHJcbiAgY29uc3Qge1xyXG4gICAgUklMX0JMT0NLLFxyXG4gICAgUklMX1BBUkEsXHJcbiAgICBSSUxfVEVYVExJTkUsXHJcbiAgICBSSUxfV09SRCxcclxuICAgIFJJTF9TWU1CT0wsXHJcbiAgfSA9IFRlc3NNb2R1bGU7XHJcbiAgY29uc3QgYmxvY2tzID0gW107XHJcbiAgbGV0IGJsb2NrO1xyXG4gIGxldCBwYXJhO1xyXG4gIGxldCB0ZXh0bGluZTtcclxuICBsZXQgd29yZDtcclxuICBsZXQgc3ltYm9sO1xyXG5cclxuICBjb25zdCBlbnVtVG9TdHJpbmcgPSAodmFsdWUsIHByZWZpeCkgPT4gKFxyXG4gICAgT2JqZWN0LmtleXMoVGVzc01vZHVsZSlcclxuICAgICAgLmZpbHRlcigoZSkgPT4gKGUuc3RhcnRzV2l0aChgJHtwcmVmaXh9X2ApICYmIFRlc3NNb2R1bGVbZV0gPT09IHZhbHVlKSlcclxuICAgICAgLm1hcCgoZSkgPT4gZS5zbGljZShwcmVmaXgubGVuZ3RoICsgMSkpWzBdXHJcbiAgKTtcclxuXHJcbiAgcmkuQmVnaW4oKTtcclxuICBkbyB7XHJcbiAgICBpZiAocmkuSXNBdEJlZ2lubmluZ09mKFJJTF9CTE9DSykpIHtcclxuICAgICAgY29uc3QgcG9seSA9IHJpLkJsb2NrUG9seWdvbigpO1xyXG4gICAgICBsZXQgcG9seWdvbiA9IG51bGw7XHJcbiAgICAgIC8vIEJsb2NrUG9seWdvbigpIHJldHVybnMgbnVsbCB3aGVuIGF1dG9tYXRpYyBwYWdlIHNlZ21lbnRhdGlvbiBpcyBvZmZcclxuICAgICAgaWYgKFRlc3NNb2R1bGUuZ2V0UG9pbnRlcihwb2x5KSA+IDApIHtcclxuICAgICAgICBjb25zdCBuID0gcG9seS5nZXRfbigpO1xyXG4gICAgICAgIGNvbnN0IHB4ID0gcG9seS5nZXRfeCgpO1xyXG4gICAgICAgIGNvbnN0IHB5ID0gcG9seS5nZXRfeSgpO1xyXG4gICAgICAgIHBvbHlnb24gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkgKz0gMSkge1xyXG4gICAgICAgICAgcG9seWdvbi5wdXNoKFtweC5nZXRWYWx1ZShpKSwgcHkuZ2V0VmFsdWUoaSldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUT0RPOiBmaW5kIG91dCB3aHkgX3B0YURlc3Ryb3kgZG9lc24ndCB3b3JrXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgLy8gVGVzc01vZHVsZS5fcHRhRGVzdHJveShUZXNzTW9kdWxlLmdldFBvaW50ZXIocG9seSkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBibG9jayA9IHtcclxuICAgICAgICBwYXJhZ3JhcGhzOiBbXSxcclxuICAgICAgICB0ZXh0OiByaS5HZXRVVEY4VGV4dChSSUxfQkxPQ0spLFxyXG4gICAgICAgIGNvbmZpZGVuY2U6IHJpLkNvbmZpZGVuY2UoUklMX0JMT0NLKSxcclxuICAgICAgICBiYXNlbGluZTogcmkuZ2V0QmFzZWxpbmUoUklMX0JMT0NLKSxcclxuICAgICAgICBiYm94OiByaS5nZXRCb3VuZGluZ0JveChSSUxfQkxPQ0spLFxyXG4gICAgICAgIGJsb2NrdHlwZTogZW51bVRvU3RyaW5nKHJpLkJsb2NrVHlwZSgpLCAnUFQnKSxcclxuICAgICAgICBwb2x5Z29uLFxyXG4gICAgICB9O1xyXG4gICAgICBibG9ja3MucHVzaChibG9jayk7XHJcbiAgICB9XHJcbiAgICBpZiAocmkuSXNBdEJlZ2lubmluZ09mKFJJTF9QQVJBKSkge1xyXG4gICAgICBwYXJhID0ge1xyXG4gICAgICAgIGxpbmVzOiBbXSxcclxuICAgICAgICB0ZXh0OiByaS5HZXRVVEY4VGV4dChSSUxfUEFSQSksXHJcbiAgICAgICAgY29uZmlkZW5jZTogcmkuQ29uZmlkZW5jZShSSUxfUEFSQSksXHJcbiAgICAgICAgYmFzZWxpbmU6IHJpLmdldEJhc2VsaW5lKFJJTF9QQVJBKSxcclxuICAgICAgICBiYm94OiByaS5nZXRCb3VuZGluZ0JveChSSUxfUEFSQSksXHJcbiAgICAgICAgaXNfbHRyOiAhIXJpLlBhcmFncmFwaElzTHRyKCksXHJcbiAgICAgIH07XHJcbiAgICAgIGJsb2NrLnBhcmFncmFwaHMucHVzaChwYXJhKTtcclxuICAgIH1cclxuICAgIGlmIChyaS5Jc0F0QmVnaW5uaW5nT2YoUklMX1RFWFRMSU5FKSkge1xyXG4gICAgICB0ZXh0bGluZSA9IHtcclxuICAgICAgICB3b3JkczogW10sXHJcbiAgICAgICAgdGV4dDogcmkuR2V0VVRGOFRleHQoUklMX1RFWFRMSU5FKSxcclxuICAgICAgICBjb25maWRlbmNlOiByaS5Db25maWRlbmNlKFJJTF9URVhUTElORSksXHJcbiAgICAgICAgYmFzZWxpbmU6IHJpLmdldEJhc2VsaW5lKFJJTF9URVhUTElORSksXHJcbiAgICAgICAgYmJveDogcmkuZ2V0Qm91bmRpbmdCb3goUklMX1RFWFRMSU5FKSxcclxuICAgICAgfTtcclxuICAgICAgcGFyYS5saW5lcy5wdXNoKHRleHRsaW5lKTtcclxuICAgIH1cclxuICAgIGlmIChyaS5Jc0F0QmVnaW5uaW5nT2YoUklMX1dPUkQpKSB7XHJcbiAgICAgIGNvbnN0IGZvbnRJbmZvID0gcmkuZ2V0V29yZEZvbnRBdHRyaWJ1dGVzKCk7XHJcbiAgICAgIGNvbnN0IHdvcmREaXIgPSByaS5Xb3JkRGlyZWN0aW9uKCk7XHJcbiAgICAgIHdvcmQgPSB7XHJcbiAgICAgICAgc3ltYm9sczogW10sXHJcbiAgICAgICAgY2hvaWNlczogW10sXHJcblxyXG4gICAgICAgIHRleHQ6IHJpLkdldFVURjhUZXh0KFJJTF9XT1JEKSxcclxuICAgICAgICBjb25maWRlbmNlOiByaS5Db25maWRlbmNlKFJJTF9XT1JEKSxcclxuICAgICAgICBiYXNlbGluZTogcmkuZ2V0QmFzZWxpbmUoUklMX1dPUkQpLFxyXG4gICAgICAgIGJib3g6IHJpLmdldEJvdW5kaW5nQm94KFJJTF9XT1JEKSxcclxuXHJcbiAgICAgICAgaXNfbnVtZXJpYzogISFyaS5Xb3JkSXNOdW1lcmljKCksXHJcbiAgICAgICAgaW5fZGljdGlvbmFyeTogISFyaS5Xb3JkSXNGcm9tRGljdGlvbmFyeSgpLFxyXG4gICAgICAgIGRpcmVjdGlvbjogZW51bVRvU3RyaW5nKHdvcmREaXIsICdESVInKSxcclxuICAgICAgICBsYW5ndWFnZTogcmkuV29yZFJlY29nbml0aW9uTGFuZ3VhZ2UoKSxcclxuXHJcbiAgICAgICAgaXNfYm9sZDogZm9udEluZm8uaXNfYm9sZCxcclxuICAgICAgICBpc19pdGFsaWM6IGZvbnRJbmZvLmlzX2l0YWxpYyxcclxuICAgICAgICBpc191bmRlcmxpbmVkOiBmb250SW5mby5pc191bmRlcmxpbmVkLFxyXG4gICAgICAgIGlzX21vbm9zcGFjZTogZm9udEluZm8uaXNfbW9ub3NwYWNlLFxyXG4gICAgICAgIGlzX3NlcmlmOiBmb250SW5mby5pc19zZXJpZixcclxuICAgICAgICBpc19zbWFsbGNhcHM6IGZvbnRJbmZvLmlzX3NtYWxsY2FwcyxcclxuICAgICAgICBmb250X3NpemU6IGZvbnRJbmZvLnBvaW50c2l6ZSxcclxuICAgICAgICBmb250X2lkOiBmb250SW5mby5mb250X2lkLFxyXG4gICAgICAgIGZvbnRfbmFtZTogZm9udEluZm8uZm9udF9uYW1lLFxyXG4gICAgICB9O1xyXG4gICAgICBjb25zdCB3YyA9IG5ldyBUZXNzTW9kdWxlLldvcmRDaG9pY2VJdGVyYXRvcihyaSk7XHJcbiAgICAgIGRvIHtcclxuICAgICAgICB3b3JkLmNob2ljZXMucHVzaCh7XHJcbiAgICAgICAgICB0ZXh0OiB3Yy5HZXRVVEY4VGV4dCgpLFxyXG4gICAgICAgICAgY29uZmlkZW5jZTogd2MuQ29uZmlkZW5jZSgpLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IHdoaWxlICh3Yy5OZXh0KCkpO1xyXG4gICAgICBUZXNzTW9kdWxlLmRlc3Ryb3kod2MpO1xyXG4gICAgICB0ZXh0bGluZS53b3Jkcy5wdXNoKHdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGxldCBpbWFnZSA9IG51bGw7XHJcbiAgICAvLyB2YXIgcGl4ID0gcmkuR2V0QmluYXJ5SW1hZ2UoVGVzc01vZHVsZS5SSUxfU1lNQk9MKVxyXG4gICAgLy8gdmFyIGltYWdlID0gcGl4MmFycmF5KHBpeCk7XHJcbiAgICAvLyAvLyBmb3Igc29tZSByZWFzb24gaXQgc2VlbXMgdGhhdCB0aGluZ3Mgc3RvcCB3b3JraW5nIGlmIHlvdSBkZXN0cm95IHBpY3NcclxuICAgIC8vIFRlc3NNb2R1bGUuX3BpeERlc3Ryb3koVGVzc01vZHVsZS5nZXRQb2ludGVyKHBpeCkpO1xyXG4gICAgaWYgKHJpLklzQXRCZWdpbm5pbmdPZihSSUxfU1lNQk9MKSkge1xyXG4gICAgICBzeW1ib2wgPSB7XHJcbiAgICAgICAgY2hvaWNlczogW10sXHJcbiAgICAgICAgaW1hZ2U6IG51bGwsXHJcbiAgICAgICAgdGV4dDogcmkuR2V0VVRGOFRleHQoUklMX1NZTUJPTCksXHJcbiAgICAgICAgY29uZmlkZW5jZTogcmkuQ29uZmlkZW5jZShSSUxfU1lNQk9MKSxcclxuICAgICAgICBiYXNlbGluZTogcmkuZ2V0QmFzZWxpbmUoUklMX1NZTUJPTCksXHJcbiAgICAgICAgYmJveDogcmkuZ2V0Qm91bmRpbmdCb3goUklMX1NZTUJPTCksXHJcbiAgICAgICAgaXNfc3VwZXJzY3JpcHQ6ICEhcmkuU3ltYm9sSXNTdXBlcnNjcmlwdCgpLFxyXG4gICAgICAgIGlzX3N1YnNjcmlwdDogISFyaS5TeW1ib2xJc1N1YnNjcmlwdCgpLFxyXG4gICAgICAgIGlzX2Ryb3BjYXA6ICEhcmkuU3ltYm9sSXNEcm9wY2FwKCksXHJcbiAgICAgIH07XHJcbiAgICAgIHdvcmQuc3ltYm9scy5wdXNoKHN5bWJvbCk7XHJcbiAgICAgIGNvbnN0IGNpID0gbmV3IFRlc3NNb2R1bGUuQ2hvaWNlSXRlcmF0b3IocmkpO1xyXG4gICAgICBkbyB7XHJcbiAgICAgICAgc3ltYm9sLmNob2ljZXMucHVzaCh7XHJcbiAgICAgICAgICB0ZXh0OiBjaS5HZXRVVEY4VGV4dCgpLFxyXG4gICAgICAgICAgY29uZmlkZW5jZTogY2kuQ29uZmlkZW5jZSgpLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IHdoaWxlIChjaS5OZXh0KCkpO1xyXG4gICAgICAvLyBUZXNzTW9kdWxlLmRlc3Ryb3koaSk7XHJcbiAgICB9XHJcbiAgfSB3aGlsZSAocmkuTmV4dChSSUxfU1lNQk9MKSk7XHJcbiAgVGVzc01vZHVsZS5kZXN0cm95KHJpKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHRleHQ6IGFwaS5HZXRVVEY4VGV4dCgpLFxyXG4gICAgaG9jcjogdGVzc2pzX2NyZWF0ZV9ob2NyID09PSAnMScgPyBkZWluZGVudChhcGkuR2V0SE9DUlRleHQoKSkgOiBudWxsLFxyXG4gICAgdHN2OiB0ZXNzanNfY3JlYXRlX3RzdiA9PT0gJzEnID8gYXBpLkdldFRTVlRleHQoKSA6IG51bGwsXHJcbiAgICBib3g6IHRlc3Nqc19jcmVhdGVfYm94ID09PSAnMScgPyBhcGkuR2V0Qm94VGV4dCgpIDogbnVsbCxcclxuICAgIHVubHY6IHRlc3Nqc19jcmVhdGVfdW5sdiA9PT0gJzEnID8gYXBpLkdldFVOTFZUZXh0KCkgOiBudWxsLFxyXG4gICAgb3NkOiB0ZXNzanNfY3JlYXRlX29zZCA9PT0gJzEnID8gYXBpLkdldE9zZFRleHQoKSA6IG51bGwsXHJcbiAgICBjb25maWRlbmNlOiBhcGkuTWVhblRleHRDb25mKCksXHJcbiAgICBibG9ja3MsXHJcbiAgICBwc206IGVudW1Ub1N0cmluZyhhcGkuR2V0UGFnZVNlZ01vZGUoKSwgJ1BTTScpLFxyXG4gICAgb2VtOiBlbnVtVG9TdHJpbmcoYXBpLm9lbSgpLCAnT0VNJyksXHJcbiAgICB2ZXJzaW9uOiBhcGkuVmVyc2lvbigpLFxyXG4gIH07XHJcbn07XHJcbiIsImNvbnN0IGJtcCA9IHJlcXVpcmUoJ2JtcC1qcycpO1xyXG5jb25zdCBmaWxlVHlwZSA9IHJlcXVpcmUoJ2ZpbGUtdHlwZScpO1xyXG5cclxuLyoqXHJcbiAqIHNldEltYWdlXHJcbiAqXHJcbiAqIEBuYW1lIHNldEltYWdlXHJcbiAqIEBmdW5jdGlvbiBzZXQgaW1hZ2UgaW4gdGVzc2VyYWN0IGZvciByZWNvZ25pdGlvblxyXG4gKiBAYWNjZXNzIHB1YmxpY1xyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAoVGVzc01vZHVsZSwgYXBpLCBpbWFnZSkgPT4ge1xyXG4gIGNvbnN0IGJ1ZiA9IEJ1ZmZlci5mcm9tKEFycmF5LmZyb20oeyAuLi5pbWFnZSwgbGVuZ3RoOiBPYmplY3Qua2V5cyhpbWFnZSkubGVuZ3RoIH0pKTtcclxuICBjb25zdCB0eXBlID0gZmlsZVR5cGUoYnVmKTtcclxuICBsZXQgYnl0ZXNQZXJQaXhlbCA9IDA7XHJcbiAgbGV0IGRhdGEgPSBudWxsO1xyXG4gIGxldCBwaXggPSBudWxsO1xyXG4gIGxldCB3ID0gMDtcclxuICBsZXQgaCA9IDA7XHJcblxyXG4gIGNvbnN0IGV4aWYgPSBidWYuc2xpY2UoMCwgNTAwKS50b1N0cmluZygpLm1hdGNoKC9cXHgwMVxceDEyXFx4MDBcXHgwM1xceDAwXFx4MDBcXHgwMFxceDAxXFx4MDAoLikvKT8uWzFdPy5jaGFyQ29kZUF0KDApIHx8IDE7XHJcblxyXG4gIC8qXHJcbiAgICogTGVwdG9uaWNhIHN1cHBvcnRzIHVuY29tcHJlc3NlZCBidXQgbm90IGNvbXByZXNzZWQgYm1wIGZpbGVzXHJcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vRGFuQmxvb21iZXJnL2xlcHRvbmljYS9pc3N1ZXMvNjA3I2lzc3VlY29tbWVudC0xMDY4ODAyNTE2XHJcbiAgICogV2UgdGhlcmVmb3JlIHVzZSBibXAtanMgdG8gcHJvY2VzcyBhbGwgYm1wIGZpbGVzXHJcbiAgICovXHJcbiAgaWYgKHR5cGUgJiYgdHlwZS5taW1lID09PSAnaW1hZ2UvYm1wJykge1xyXG4gICAgY29uc3QgYm1wQnVmID0gYm1wLmRlY29kZShidWYpO1xyXG4gICAgZGF0YSA9IFRlc3NNb2R1bGUuX21hbGxvYyhibXBCdWYuZGF0YS5sZW5ndGggKiBVaW50OEFycmF5LkJZVEVTX1BFUl9FTEVNRU5UKTtcclxuICAgIFRlc3NNb2R1bGUuSEVBUFU4LnNldChibXBCdWYuZGF0YSwgZGF0YSk7XHJcbiAgICB3ID0gYm1wQnVmLndpZHRoO1xyXG4gICAgaCA9IGJtcEJ1Zi5oZWlnaHQ7XHJcbiAgICBieXRlc1BlclBpeGVsID0gNDtcclxuICB9IGVsc2Uge1xyXG4gICAgY29uc3QgcHRyID0gVGVzc01vZHVsZS5fbWFsbG9jKGJ1Zi5sZW5ndGggKiBVaW50OEFycmF5LkJZVEVTX1BFUl9FTEVNRU5UKTtcclxuICAgIFRlc3NNb2R1bGUuSEVBUFU4LnNldChidWYsIHB0cik7XHJcbiAgICBwaXggPSBUZXNzTW9kdWxlLl9waXhSZWFkTWVtKHB0ciwgYnVmLmxlbmd0aCk7XHJcbiAgICBpZiAoVGVzc01vZHVsZS5nZXRWYWx1ZShwaXggKyAoNyAqIDQpLCAnaTMyJykgPT09IDApIHtcclxuICAgICAgLypcclxuICAgICAgICogU2V0IGEgeXJlcyBkZWZhdWx0IHZhbHVlIHRvIHByZXZlbnQgd2FybmluZyBmcm9tIHRlc3NlcmFjdFxyXG4gICAgICAgKiBTZWUga01pbkNyZWRpYmxlUmVzb2x1dGlvbiBpbiB0ZXNzZXJhY3Qvc3JjL2Njc3RydWN0L3B1YmxpY3R5cGVzLmhcclxuICAgICAgICovXHJcbiAgICAgIFRlc3NNb2R1bGUuc2V0VmFsdWUocGl4ICsgKDcgKiA0KSwgMzAwLCAnaTMyJyk7XHJcbiAgICB9XHJcbiAgICBbdywgaF0gPSBBcnJheSgyKS5maWxsKDApXHJcbiAgICAgIC5tYXAoKHYsIGlkeCkgPT4gKFxyXG4gICAgICAgIFRlc3NNb2R1bGUuZ2V0VmFsdWUocGl4ICsgKGlkeCAqIDQpLCAnaTMyJylcclxuICAgICAgKSk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gICAqIEFzIHNvbWUgaW1hZ2UgZm9ybWF0IChleC4gYm1wKSBpcyBub3Qgc3VwcG9ydGVkIG5hdGllbHkgYnkgdGVzc2VyYWN0LFxyXG4gICAqIHNvbWV0aW1lcyBpdCB3aWxsIG5vdCByZXR1cm4gcGl4IGRpcmVjdGx5LCBidXQgZGF0YSBhbmQgYnl0ZXNQZXJQaXhlbFxyXG4gICAqIGZvciBhbm90aGVyIFNldEltYWdlIHVzYWdlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgaWYgKGRhdGEgPT09IG51bGwpIHtcclxuICAgIGFwaS5TZXRJbWFnZShwaXgsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZXhpZik7XHJcbiAgfSBlbHNlIHtcclxuICAgIGFwaS5TZXRJbWFnZShkYXRhLCB3LCBoLCBieXRlc1BlclBpeGVsLCB3ICogYnl0ZXNQZXJQaXhlbCwgZXhpZik7XHJcbiAgfVxyXG4gIHJldHVybiBkYXRhID09PSBudWxsID8gcGl4IDogZGF0YTtcclxufTtcclxuIiwiY2xhc3MgU3RvcmUge1xyXG4gICAgY29uc3RydWN0b3IoZGJOYW1lID0gJ2tleXZhbC1zdG9yZScsIHN0b3JlTmFtZSA9ICdrZXl2YWwnKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yZU5hbWUgPSBzdG9yZU5hbWU7XHJcbiAgICAgICAgdGhpcy5fZGJwID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBvcGVucmVxID0gaW5kZXhlZERCLm9wZW4oZGJOYW1lLCAxKTtcclxuICAgICAgICAgICAgb3BlbnJlcS5vbmVycm9yID0gKCkgPT4gcmVqZWN0KG9wZW5yZXEuZXJyb3IpO1xyXG4gICAgICAgICAgICBvcGVucmVxLm9uc3VjY2VzcyA9ICgpID0+IHJlc29sdmUob3BlbnJlcS5yZXN1bHQpO1xyXG4gICAgICAgICAgICAvLyBGaXJzdCB0aW1lIHNldHVwOiBjcmVhdGUgYW4gZW1wdHkgb2JqZWN0IHN0b3JlXHJcbiAgICAgICAgICAgIG9wZW5yZXEub251cGdyYWRlbmVlZGVkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb3BlbnJlcS5yZXN1bHQuY3JlYXRlT2JqZWN0U3RvcmUoc3RvcmVOYW1lKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIF93aXRoSURCU3RvcmUodHlwZSwgY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGJwLnRoZW4oZGIgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IGRiLnRyYW5zYWN0aW9uKHRoaXMuc3RvcmVOYW1lLCB0eXBlKTtcclxuICAgICAgICAgICAgdHJhbnNhY3Rpb24ub25jb21wbGV0ZSA9ICgpID0+IHJlc29sdmUoKTtcclxuICAgICAgICAgICAgdHJhbnNhY3Rpb24ub25hYm9ydCA9IHRyYW5zYWN0aW9uLm9uZXJyb3IgPSAoKSA9PiByZWplY3QodHJhbnNhY3Rpb24uZXJyb3IpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayh0cmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0aGlzLnN0b3JlTmFtZSkpO1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxufVxyXG5sZXQgc3RvcmU7XHJcbmZ1bmN0aW9uIGdldERlZmF1bHRTdG9yZSgpIHtcclxuICAgIGlmICghc3RvcmUpXHJcbiAgICAgICAgc3RvcmUgPSBuZXcgU3RvcmUoKTtcclxuICAgIHJldHVybiBzdG9yZTtcclxufVxyXG5mdW5jdGlvbiBnZXQoa2V5LCBzdG9yZSA9IGdldERlZmF1bHRTdG9yZSgpKSB7XHJcbiAgICBsZXQgcmVxO1xyXG4gICAgcmV0dXJuIHN0b3JlLl93aXRoSURCU3RvcmUoJ3JlYWRvbmx5Jywgc3RvcmUgPT4ge1xyXG4gICAgICAgIHJlcSA9IHN0b3JlLmdldChrZXkpO1xyXG4gICAgfSkudGhlbigoKSA9PiByZXEucmVzdWx0KTtcclxufVxyXG5mdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSwgc3RvcmUgPSBnZXREZWZhdWx0U3RvcmUoKSkge1xyXG4gICAgcmV0dXJuIHN0b3JlLl93aXRoSURCU3RvcmUoJ3JlYWR3cml0ZScsIHN0b3JlID0+IHtcclxuICAgICAgICBzdG9yZS5wdXQodmFsdWUsIGtleSk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBkZWwoa2V5LCBzdG9yZSA9IGdldERlZmF1bHRTdG9yZSgpKSB7XHJcbiAgICByZXR1cm4gc3RvcmUuX3dpdGhJREJTdG9yZSgncmVhZHdyaXRlJywgc3RvcmUgPT4ge1xyXG4gICAgICAgIHN0b3JlLmRlbGV0ZShrZXkpO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gY2xlYXIoc3RvcmUgPSBnZXREZWZhdWx0U3RvcmUoKSkge1xyXG4gICAgcmV0dXJuIHN0b3JlLl93aXRoSURCU3RvcmUoJ3JlYWR3cml0ZScsIHN0b3JlID0+IHtcclxuICAgICAgICBzdG9yZS5jbGVhcigpO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24ga2V5cyhzdG9yZSA9IGdldERlZmF1bHRTdG9yZSgpKSB7XHJcbiAgICBjb25zdCBrZXlzID0gW107XHJcbiAgICByZXR1cm4gc3RvcmUuX3dpdGhJREJTdG9yZSgncmVhZG9ubHknLCBzdG9yZSA9PiB7XHJcbiAgICAgICAgLy8gVGhpcyB3b3VsZCBiZSBzdG9yZS5nZXRBbGxLZXlzKCksIGJ1dCBpdCBpc24ndCBzdXBwb3J0ZWQgYnkgRWRnZSBvciBTYWZhcmkuXHJcbiAgICAgICAgLy8gQW5kIG9wZW5LZXlDdXJzb3IgaXNuJ3Qgc3VwcG9ydGVkIGJ5IFNhZmFyaS5cclxuICAgICAgICAoc3RvcmUub3BlbktleUN1cnNvciB8fCBzdG9yZS5vcGVuQ3Vyc29yKS5jYWxsKHN0b3JlKS5vbnN1Y2Nlc3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5yZXN1bHQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGtleXMucHVzaCh0aGlzLnJlc3VsdC5rZXkpO1xyXG4gICAgICAgICAgICB0aGlzLnJlc3VsdC5jb250aW51ZSgpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KS50aGVuKCgpID0+IGtleXMpO1xyXG59XG5cbmV4cG9ydCB7IFN0b3JlLCBnZXQsIHNldCwgZGVsLCBjbGVhciwga2V5cyB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIi8qKlxyXG4gKlxyXG4gKiBCcm93c2VyIHdvcmtlciBzY3JpcHRzXHJcbiAqXHJcbiAqIEBmaWxlb3ZlcnZpZXcgQnJvd3NlciB3b3JrZXIgaW1wbGVtZW50YXRpb25cclxuICogQGF1dGhvciBLZXZpbiBLd29rIDxhbnRpbWF0dGVyMTVAZ21haWwuY29tPlxyXG4gKiBAYXV0aG9yIEd1aWxsZXJtbyBXZWJzdGVyIDxndWlAbWl0LmVkdT5cclxuICogQGF1dGhvciBKZXJvbWUgV3UgPGplcm9tZXd1c0BnbWFpbC5jb20+XHJcbiAqL1xyXG5cclxuY29uc3Qgd29ya2VyID0gcmVxdWlyZSgnLi4nKTtcclxuY29uc3QgZ2V0Q29yZSA9IHJlcXVpcmUoJy4vZ2V0Q29yZScpO1xyXG5jb25zdCBndW56aXAgPSByZXF1aXJlKCcuL2d1bnppcCcpO1xyXG5jb25zdCBjYWNoZSA9IHJlcXVpcmUoJy4vY2FjaGUnKTtcclxuXHJcbi8qXHJcbiAqIHJlZ2lzdGVyIG1lc3NhZ2UgaGFuZGxlclxyXG4gKi9cclxuZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoeyBkYXRhIH0pID0+IHtcclxuICB3b3JrZXIuZGlzcGF0Y2hIYW5kbGVycyhkYXRhLCAob2JqKSA9PiBwb3N0TWVzc2FnZShvYmopKTtcclxufSk7XHJcblxyXG4vKlxyXG4gKiBnZXRDb3JlIGlzIGEgc3luYyBmdW5jdGlvbiB0byBsb2FkIGFuZCByZXR1cm5cclxuICogVGVzc2VyYWN0Q29yZS5cclxuICovXHJcbndvcmtlci5zZXRBZGFwdGVyKHtcclxuICBnZXRDb3JlLFxyXG4gIGd1bnppcCxcclxuICBmZXRjaDogKCkgPT4ge30sXHJcbiAgLi4uY2FjaGUsXHJcbn0pO1xyXG4iXSwibmFtZXMiOlsiZXhwb3J0cyIsImJ5dGVMZW5ndGgiLCJ0b0J5dGVBcnJheSIsImZyb21CeXRlQXJyYXkiLCJsb29rdXAiLCJyZXZMb29rdXAiLCJBcnIiLCJVaW50OEFycmF5IiwiQXJyYXkiLCJjb2RlIiwiaSIsImxlbiIsImxlbmd0aCIsImNoYXJDb2RlQXQiLCJnZXRMZW5zIiwiYjY0IiwiRXJyb3IiLCJ2YWxpZExlbiIsImluZGV4T2YiLCJwbGFjZUhvbGRlcnNMZW4iLCJsZW5zIiwiX2J5dGVMZW5ndGgiLCJ0bXAiLCJhcnIiLCJjdXJCeXRlIiwidHJpcGxldFRvQmFzZTY0IiwibnVtIiwiZW5jb2RlQ2h1bmsiLCJ1aW50OCIsInN0YXJ0IiwiZW5kIiwib3V0cHV0IiwicHVzaCIsImpvaW4iLCJleHRyYUJ5dGVzIiwicGFydHMiLCJtYXhDaHVua0xlbmd0aCIsImxlbjIiLCJlbmNvZGUiLCJyZXF1aXJlIiwiZGVjb2RlIiwibW9kdWxlIiwiQm1wRGVjb2RlciIsImJ1ZmZlciIsImlzX3dpdGhfYWxwaGEiLCJwb3MiLCJib3R0b21fdXAiLCJmbGFnIiwidG9TdHJpbmciLCJwYXJzZUhlYWRlciIsInBhcnNlUkdCQSIsInByb3RvdHlwZSIsImZpbGVTaXplIiwicmVhZFVJbnQzMkxFIiwicmVzZXJ2ZWQiLCJvZmZzZXQiLCJoZWFkZXJTaXplIiwid2lkdGgiLCJoZWlnaHQiLCJyZWFkSW50MzJMRSIsInBsYW5lcyIsInJlYWRVSW50MTZMRSIsImJpdFBQIiwiY29tcHJlc3MiLCJyYXdTaXplIiwiaHIiLCJ2ciIsImNvbG9ycyIsImltcG9ydGFudENvbG9ycyIsInBhbGV0dGUiLCJibHVlIiwicmVhZFVJbnQ4IiwiZ3JlZW4iLCJyZWQiLCJxdWFkIiwiYml0biIsImRhdGEiLCJCdWZmZXIiLCJiaXQxIiwieGxlbiIsIk1hdGgiLCJjZWlsIiwibW9kZSIsInkiLCJsaW5lIiwieCIsImIiLCJsb2NhdGlvbiIsInJnYiIsImJpdDQiLCJzZXRQaXhlbERhdGEiLCJyZ2JJbmRleCIsImZpbGwiLCJsaW5lcyIsImxvd19uaWJibGUiLCJhIiwiYyIsImNhbGwiLCJiZWZvcmUiLCJhZnRlciIsImJpdDgiLCJiaXQxNSIsImRpZl93IiwiXzExMTExIiwicGFyc2VJbnQiLCJfMV81IiwiQiIsImFscGhhIiwiYml0MTYiLCJtYXNrUmVkIiwibWFza0dyZWVuIiwibWFza0JsdWUiLCJtYXNrMCIsIm5zIiwiYml0MjQiLCJiaXQzMiIsImdldERhdGEiLCJibXBEYXRhIiwiZGVjb2RlciIsIkJtcEVuY29kZXIiLCJpbWdEYXRhIiwicmdiU2l6ZSIsImhlYWRlckluZm9TaXplIiwidGVtcEJ1ZmZlciIsIndyaXRlIiwid3JpdGVVSW50MzJMRSIsIndyaXRlSW50MzJMRSIsIndyaXRlVUludDE2TEUiLCJyb3dCeXRlcyIsInAiLCJmaWxsT2Zmc2V0IiwicXVhbGl0eSIsImVuY29kZXIiLCJiYXNlNjQiLCJpZWVlNzU0IiwiY3VzdG9tSW5zcGVjdFN5bWJvbCIsIlN5bWJvbCIsIlNsb3dCdWZmZXIiLCJJTlNQRUNUX01BWF9CWVRFUyIsIktfTUFYX0xFTkdUSCIsImtNYXhMZW5ndGgiLCJUWVBFRF9BUlJBWV9TVVBQT1JUIiwidHlwZWRBcnJheVN1cHBvcnQiLCJjb25zb2xlIiwiZXJyb3IiLCJwcm90byIsImZvbyIsIk9iamVjdCIsInNldFByb3RvdHlwZU9mIiwiZSIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImdldCIsImlzQnVmZmVyIiwidW5kZWZpbmVkIiwiYnl0ZU9mZnNldCIsImNyZWF0ZUJ1ZmZlciIsIlJhbmdlRXJyb3IiLCJidWYiLCJhcmciLCJlbmNvZGluZ09yT2Zmc2V0IiwiVHlwZUVycm9yIiwiYWxsb2NVbnNhZmUiLCJmcm9tIiwicG9vbFNpemUiLCJ2YWx1ZSIsImZyb21TdHJpbmciLCJBcnJheUJ1ZmZlciIsImlzVmlldyIsImZyb21BcnJheVZpZXciLCJpc0luc3RhbmNlIiwiZnJvbUFycmF5QnVmZmVyIiwiU2hhcmVkQXJyYXlCdWZmZXIiLCJ2YWx1ZU9mIiwiZnJvbU9iamVjdCIsInRvUHJpbWl0aXZlIiwiYXNzZXJ0U2l6ZSIsInNpemUiLCJhbGxvYyIsImVuY29kaW5nIiwiY2hlY2tlZCIsImFsbG9jVW5zYWZlU2xvdyIsInN0cmluZyIsImlzRW5jb2RpbmciLCJhY3R1YWwiLCJzbGljZSIsImZyb21BcnJheUxpa2UiLCJhcnJheSIsImFycmF5VmlldyIsImNvcHkiLCJvYmoiLCJudW1iZXJJc05hTiIsInR5cGUiLCJpc0FycmF5IiwiX2lzQnVmZmVyIiwiY29tcGFyZSIsIm1pbiIsIlN0cmluZyIsInRvTG93ZXJDYXNlIiwiY29uY2F0IiwibGlzdCIsInNldCIsIm11c3RNYXRjaCIsImFyZ3VtZW50cyIsImxvd2VyZWRDYXNlIiwidXRmOFRvQnl0ZXMiLCJiYXNlNjRUb0J5dGVzIiwic2xvd1RvU3RyaW5nIiwiaGV4U2xpY2UiLCJ1dGY4U2xpY2UiLCJhc2NpaVNsaWNlIiwibGF0aW4xU2xpY2UiLCJiYXNlNjRTbGljZSIsInV0ZjE2bGVTbGljZSIsInN3YXAiLCJuIiwibSIsInN3YXAxNiIsInN3YXAzMiIsInN3YXA2NCIsImFwcGx5IiwidG9Mb2NhbGVTdHJpbmciLCJlcXVhbHMiLCJpbnNwZWN0Iiwic3RyIiwibWF4IiwicmVwbGFjZSIsInRyaW0iLCJ0YXJnZXQiLCJ0aGlzU3RhcnQiLCJ0aGlzRW5kIiwidGhpc0NvcHkiLCJ0YXJnZXRDb3B5IiwiYmlkaXJlY3Rpb25hbEluZGV4T2YiLCJ2YWwiLCJkaXIiLCJhcnJheUluZGV4T2YiLCJsYXN0SW5kZXhPZiIsImluZGV4U2l6ZSIsImFyckxlbmd0aCIsInZhbExlbmd0aCIsInJlYWQiLCJyZWFkVUludDE2QkUiLCJmb3VuZEluZGV4IiwiZm91bmQiLCJqIiwiaW5jbHVkZXMiLCJoZXhXcml0ZSIsIk51bWJlciIsInJlbWFpbmluZyIsInN0ckxlbiIsInBhcnNlZCIsInN1YnN0ciIsInV0ZjhXcml0ZSIsImJsaXRCdWZmZXIiLCJhc2NpaVdyaXRlIiwiYXNjaWlUb0J5dGVzIiwiYmFzZTY0V3JpdGUiLCJ1Y3MyV3JpdGUiLCJ1dGYxNmxlVG9CeXRlcyIsImlzRmluaXRlIiwidG9KU09OIiwiX2FyciIsInJlcyIsImZpcnN0Qnl0ZSIsImNvZGVQb2ludCIsImJ5dGVzUGVyU2VxdWVuY2UiLCJzZWNvbmRCeXRlIiwidGhpcmRCeXRlIiwiZm91cnRoQnl0ZSIsInRlbXBDb2RlUG9pbnQiLCJkZWNvZGVDb2RlUG9pbnRzQXJyYXkiLCJNQVhfQVJHVU1FTlRTX0xFTkdUSCIsImNvZGVQb2ludHMiLCJmcm9tQ2hhckNvZGUiLCJyZXQiLCJvdXQiLCJoZXhTbGljZUxvb2t1cFRhYmxlIiwiYnl0ZXMiLCJuZXdCdWYiLCJzdWJhcnJheSIsImNoZWNrT2Zmc2V0IiwiZXh0IiwicmVhZFVpbnRMRSIsInJlYWRVSW50TEUiLCJub0Fzc2VydCIsIm11bCIsInJlYWRVaW50QkUiLCJyZWFkVUludEJFIiwicmVhZFVpbnQ4IiwicmVhZFVpbnQxNkxFIiwicmVhZFVpbnQxNkJFIiwicmVhZFVpbnQzMkxFIiwicmVhZFVpbnQzMkJFIiwicmVhZFVJbnQzMkJFIiwicmVhZEJpZ1VJbnQ2NExFIiwiZGVmaW5lQmlnSW50TWV0aG9kIiwidmFsaWRhdGVOdW1iZXIiLCJmaXJzdCIsImxhc3QiLCJib3VuZHNFcnJvciIsImxvIiwiaGkiLCJCaWdJbnQiLCJyZWFkQmlnVUludDY0QkUiLCJyZWFkSW50TEUiLCJwb3ciLCJyZWFkSW50QkUiLCJyZWFkSW50OCIsInJlYWRJbnQxNkxFIiwicmVhZEludDE2QkUiLCJyZWFkSW50MzJCRSIsInJlYWRCaWdJbnQ2NExFIiwicmVhZEJpZ0ludDY0QkUiLCJyZWFkRmxvYXRMRSIsInJlYWRGbG9hdEJFIiwicmVhZERvdWJsZUxFIiwicmVhZERvdWJsZUJFIiwiY2hlY2tJbnQiLCJ3cml0ZVVpbnRMRSIsIndyaXRlVUludExFIiwibWF4Qnl0ZXMiLCJ3cml0ZVVpbnRCRSIsIndyaXRlVUludEJFIiwid3JpdGVVaW50OCIsIndyaXRlVUludDgiLCJ3cml0ZVVpbnQxNkxFIiwid3JpdGVVaW50MTZCRSIsIndyaXRlVUludDE2QkUiLCJ3cml0ZVVpbnQzMkxFIiwid3JpdGVVaW50MzJCRSIsIndyaXRlVUludDMyQkUiLCJ3cnRCaWdVSW50NjRMRSIsImNoZWNrSW50QkkiLCJ3cnRCaWdVSW50NjRCRSIsIndyaXRlQmlnVUludDY0TEUiLCJ3cml0ZUJpZ1VJbnQ2NEJFIiwid3JpdGVJbnRMRSIsImxpbWl0Iiwic3ViIiwid3JpdGVJbnRCRSIsIndyaXRlSW50OCIsIndyaXRlSW50MTZMRSIsIndyaXRlSW50MTZCRSIsIndyaXRlSW50MzJCRSIsIndyaXRlQmlnSW50NjRMRSIsIndyaXRlQmlnSW50NjRCRSIsImNoZWNrSUVFRTc1NCIsIndyaXRlRmxvYXQiLCJsaXR0bGVFbmRpYW4iLCJ3cml0ZUZsb2F0TEUiLCJ3cml0ZUZsb2F0QkUiLCJ3cml0ZURvdWJsZSIsIndyaXRlRG91YmxlTEUiLCJ3cml0ZURvdWJsZUJFIiwidGFyZ2V0U3RhcnQiLCJjb3B5V2l0aGluIiwiZXJyb3JzIiwiRSIsInN5bSIsImdldE1lc3NhZ2UiLCJCYXNlIiwid3JpdGFibGUiLCJjb25maWd1cmFibGUiLCJuYW1lIiwic3RhY2siLCJtZXNzYWdlIiwicmFuZ2UiLCJpbnB1dCIsIm1zZyIsInJlY2VpdmVkIiwiaXNJbnRlZ2VyIiwiYWJzIiwiYWRkTnVtZXJpY2FsU2VwYXJhdG9yIiwiY2hlY2tCb3VuZHMiLCJFUlJfT1VUX09GX1JBTkdFIiwiRVJSX0lOVkFMSURfQVJHX1RZUEUiLCJmbG9vciIsIkVSUl9CVUZGRVJfT1VUX09GX0JPVU5EUyIsIklOVkFMSURfQkFTRTY0X1JFIiwiYmFzZTY0Y2xlYW4iLCJzcGxpdCIsInVuaXRzIiwiSW5maW5pdHkiLCJsZWFkU3Vycm9nYXRlIiwiYnl0ZUFycmF5Iiwic3JjIiwiZHN0IiwiY29uc3RydWN0b3IiLCJhbHBoYWJldCIsInRhYmxlIiwiaTE2IiwiZm4iLCJCdWZmZXJCaWdJbnROb3REZWZpbmVkIiwibXVsdGlCeXRlSW5kZXhPZiIsInN0cmluZ1RvQnl0ZXMiLCJyZWFkVUludDY0TEUiLCJ0YXJIZWFkZXJDaGVja3N1bU1hdGNoZXMiLCJ1aW50OEFycmF5VXRmOEJ5dGVTdHJpbmciLCJzdXBwb3J0ZWQiLCJ4cGlaaXBGaWxlbmFtZSIsIm94bWxDb250ZW50VHlwZXMiLCJveG1sUmVscyIsImZpbGVUeXBlIiwiY2hlY2siLCJoZWFkZXIiLCJvcHRpb25zIiwibWFzayIsImNoZWNrU3RyaW5nIiwibWltZSIsInN0YXJ0SW5kZXgiLCJmaXJzdEltYWdlRGF0YUNodW5rSW5kZXgiLCJmaW5kSW5kZXgiLCJlbCIsInNsaWNlZCIsInppcEhlYWRlciIsInppcEhlYWRlckluZGV4Iiwib3htbEZvdW5kIiwiYnJhbmRNYWpvciIsInN0YXJ0c1dpdGgiLCJpZFBvcyIsImRvY1R5cGVQb3MiLCJmaW5kRG9jVHlwZSIsImV2ZXJ5Iiwib2JqZWN0U2l6ZSIsInN0cmVhbSIsInJlYWRhYmxlU3RyZWFtIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJldmFsIiwib24iLCJvbmNlIiwicGFzcyIsIlBhc3NUaHJvdWdoIiwiY2h1bmsiLCJtaW5pbXVtQnl0ZXMiLCJ1bnNoaWZ0IiwicGlwZWxpbmUiLCJwaXBlIiwiU2V0IiwiZXh0ZW5zaW9ucyIsIm1pbWVUeXBlcyIsIm1hcCIsImNoYXJhY3RlciIsIk1BU0tfOFRIX0JJVCIsInN1bSIsInNpZ25lZEJpdFN1bSIsImJ5dGUiLCJyZWFkU3VtIiwiYnl0ZXNUb1NlYXJjaCIsInN0YXJ0QXQiLCJuZXh0Qnl0ZXNNYXRjaCIsImluZGV4IiwiaXNMRSIsIm1MZW4iLCJuQnl0ZXMiLCJlTGVuIiwiZU1heCIsImVCaWFzIiwibkJpdHMiLCJkIiwicyIsIk5hTiIsInJ0IiwiaXNOYU4iLCJsb2ciLCJMTjIiLCJpc0VsZWN0cm9uIiwid2luZG93IiwicHJvY2VzcyIsInZlcnNpb25zIiwiZWxlY3Ryb24iLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJpc1VybCIsInByb3RvY29sQW5kRG9tYWluUkUiLCJsb2NhbGhvc3REb21haW5SRSIsIm5vbkxvY2FsaG9zdERvbWFpblJFIiwibWF0Y2giLCJldmVyeXRoaW5nQWZ0ZXJQcm90b2NvbCIsInRlc3QiLCJydW50aW1lIiwiT3AiLCJoYXNPd24iLCJoYXNPd25Qcm9wZXJ0eSIsIiRTeW1ib2wiLCJpdGVyYXRvclN5bWJvbCIsIml0ZXJhdG9yIiwiYXN5bmNJdGVyYXRvclN5bWJvbCIsImFzeW5jSXRlcmF0b3IiLCJ0b1N0cmluZ1RhZ1N5bWJvbCIsInRvU3RyaW5nVGFnIiwiZGVmaW5lIiwia2V5IiwiZXJyIiwid3JhcCIsImlubmVyRm4iLCJvdXRlckZuIiwic2VsZiIsInRyeUxvY3NMaXN0IiwicHJvdG9HZW5lcmF0b3IiLCJHZW5lcmF0b3IiLCJnZW5lcmF0b3IiLCJjcmVhdGUiLCJjb250ZXh0IiwiQ29udGV4dCIsIl9pbnZva2UiLCJtYWtlSW52b2tlTWV0aG9kIiwidHJ5Q2F0Y2giLCJHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0IiwiR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCIsIkdlblN0YXRlRXhlY3V0aW5nIiwiR2VuU3RhdGVDb21wbGV0ZWQiLCJDb250aW51ZVNlbnRpbmVsIiwiR2VuZXJhdG9yRnVuY3Rpb24iLCJHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSIsIkl0ZXJhdG9yUHJvdG90eXBlIiwiZ2V0UHJvdG8iLCJnZXRQcm90b3R5cGVPZiIsIk5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlIiwidmFsdWVzIiwiR3AiLCJkaXNwbGF5TmFtZSIsImRlZmluZUl0ZXJhdG9yTWV0aG9kcyIsImZvckVhY2giLCJtZXRob2QiLCJpc0dlbmVyYXRvckZ1bmN0aW9uIiwiZ2VuRnVuIiwiY3RvciIsIm1hcmsiLCJfX3Byb3RvX18iLCJhd3JhcCIsIl9fYXdhaXQiLCJBc3luY0l0ZXJhdG9yIiwiUHJvbWlzZUltcGwiLCJpbnZva2UiLCJyZWNvcmQiLCJyZXN1bHQiLCJ0aGVuIiwidW53cmFwcGVkIiwicHJldmlvdXNQcm9taXNlIiwiZW5xdWV1ZSIsImNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnIiwiYXN5bmMiLCJpdGVyIiwibmV4dCIsImRvbmUiLCJzdGF0ZSIsImRvbmVSZXN1bHQiLCJkZWxlZ2F0ZSIsImRlbGVnYXRlUmVzdWx0IiwibWF5YmVJbnZva2VEZWxlZ2F0ZSIsInNlbnQiLCJfc2VudCIsImRpc3BhdGNoRXhjZXB0aW9uIiwiYWJydXB0IiwiaW5mbyIsInJlc3VsdE5hbWUiLCJuZXh0TG9jIiwicHVzaFRyeUVudHJ5IiwibG9jcyIsImVudHJ5IiwidHJ5TG9jIiwiY2F0Y2hMb2MiLCJmaW5hbGx5TG9jIiwiYWZ0ZXJMb2MiLCJ0cnlFbnRyaWVzIiwicmVzZXRUcnlFbnRyeSIsImNvbXBsZXRpb24iLCJyZXNldCIsImtleXMiLCJvYmplY3QiLCJyZXZlcnNlIiwicG9wIiwiaXRlcmFibGUiLCJpdGVyYXRvck1ldGhvZCIsInNraXBUZW1wUmVzZXQiLCJwcmV2IiwiY2hhckF0Iiwic3RvcCIsInJvb3RFbnRyeSIsInJvb3RSZWNvcmQiLCJydmFsIiwiZXhjZXB0aW9uIiwiaGFuZGxlIiwibG9jIiwiY2F1Z2h0IiwiaGFzQ2F0Y2giLCJoYXNGaW5hbGx5IiwiZmluYWxseUVudHJ5IiwiY29tcGxldGUiLCJmaW5pc2giLCJ0aHJvd24iLCJkZWxlZ2F0ZVlpZWxkIiwicmVnZW5lcmF0b3JSdW50aW1lIiwiYWNjaWRlbnRhbFN0cmljdE1vZGUiLCJnbG9iYWxUaGlzIiwiRnVuY3Rpb24iLCJiaWdJbnQiLCJXZWJBc3NlbWJseSIsImluc3RhbnRpYXRlIiwiaW5zdGFuY2UiLCJidWxrTWVtb3J5IiwidmFsaWRhdGUiLCJleGNlcHRpb25zIiwibXVsdGlWYWx1ZSIsIm11dGFibGVHbG9iYWxzIiwicmVmZXJlbmNlVHlwZXMiLCJzYXR1cmF0ZWRGbG9hdFRvSW50Iiwic2lnbkV4dGVuc2lvbnMiLCJzaW1kIiwidGFpbENhbGwiLCJ0aHJlYWRzIiwiTWVzc2FnZUNoYW5uZWwiLCJwb3J0MSIsInBvc3RNZXNzYWdlIiwicSIsInQiLCJ2IiwiVWludDE2QXJyYXkiLCJVaW50MzJBcnJheSIsIkRhdGFWaWV3IiwiRyIsImYiLCJnIiwiayIsIkkiLCJhYSIsIkwiLCJSIiwiYmEiLCJjYSIsImhhIiwiUyIsImlhIiwiamEiLCJrYSIsImdldFBhcmVudCIsIlQiLCJQT1NJVElWRV9JTkZJTklUWSIsImgiLCJyIiwibCIsIm5hIiwib2EiLCJGIiwibGF6eSIsImNvbXByZXNzaW9uVHlwZSIsIm91dHB1dEJ1ZmZlciIsIm91dHB1dEluZGV4IiwicGEiLCJOT05FIiwiWCIsInFhIiwiVSIsInUiLCJyYSIsInciLCJDIiwiRCIsIk0iLCJ6IiwiTiIsIlkiLCJxYiIsImRhIiwiRmEiLCJlYSIsIkdhIiwibGEiLCJ0YSIsIkhhIiwiWiIsIm1hIiwiSWEiLCJzYSIsInVhIiwiSmEiLCJLYSIsIksiLCJPIiwiQSIsImZhIiwiSiIsIkgiLCJQIiwiTGEiLCJNYSIsIlEiLCJOYSIsImdhIiwid2EiLCJPYSIsIlBhIiwiUWEiLCJSYSIsInZhIiwieGEiLCJ5YSIsInNoaWZ0IiwiemEiLCJBYSIsIkJhIiwiZmxhZ3MiLCJmaWxlbmFtZSIsImNvbW1lbnQiLCJkZWZsYXRlT3B0aW9ucyIsImZuYW1lIiwiQ2EiLCJmY29tbWVudCIsIkRhIiwiZmhjcmMiLCJFYSIsIkRhdGUiLCJub3ciLCJTYSIsIlYiLCJvIiwiVGEiLCJidWZmZXJTaXplIiwiYnVmZmVyVHlwZSIsInJlc2l6ZSIsIlVhIiwiVyIsIlZhIiwiV2EiLCJYYSIsIllhIiwiWmEiLCIkYSIsImFiIiwiYmIiLCJjYiIsImRiIiwiZWIiLCJmYiIsImdiIiwiaGIiLCIkIiwiaWIiLCJqYiIsImtiIiwibGIiLCJtYiIsIm5iIiwib2IiLCJ2ZXJpZnkiLCJwYiIsInJiIiwic2IiLCJMT0cyRSIsImRlZmxhdGUiLCJ0YiIsImRlZmxhdGVTeW5jIiwidWIiLCJpbmZsYXRlIiwidmIiLCJpbmZsYXRlU3luYyIsIndiIiwiZ3ppcCIsInhiIiwiZ3ppcFN5bmMiLCJ5YiIsImd1bnppcCIsInpiIiwiZ3VuemlwU3luYyIsIkFiIiwibmV4dFRpY2siLCJCYiIsIm5vQnVmZmVyIiwiT1NEX09OTFkiLCJBVVRPX09TRCIsIkFVVE9fT05MWSIsIkFVVE8iLCJTSU5HTEVfQ09MVU1OIiwiU0lOR0xFX0JMT0NLX1ZFUlRfVEVYVCIsIlNJTkdMRV9CTE9DSyIsIlNJTkdMRV9MSU5FIiwiU0lOR0xFX1dPUkQiLCJDSVJDTEVfV09SRCIsIlNJTkdMRV9DSEFSIiwiU1BBUlNFX1RFWFQiLCJTUEFSU0VfVEVYVF9PU0QiLCJlbnYiLCJXb3JrZXJHbG9iYWxTY29wZSIsImxvZ2dpbmciLCJzZXRMb2dnaW5nIiwiX2xvZ2dpbmciLCJhcmdzIiwiZGVsIiwicmVhZENhY2hlIiwid3JpdGVDYWNoZSIsImRlbGV0ZUNhY2hlIiwiY2hlY2tDYWNoZSIsInBhdGgiLCJkZXBlbmRlbmNpZXMiLCJjb3JlUGF0aCIsImdsb2JhbCIsIlRlc3NlcmFjdENvcmUiLCJwcm9ncmVzcyIsInN0YXR1cyIsImNvcmVQYXRoSW1wb3J0Iiwic2ltZFN1cHBvcnQiLCJzdWJzdHJpbmciLCJpbXBvcnRTY3JpcHRzIiwiVGVzc2VyYWN0Q29yZVdBU00iLCJQU00iLCJ0ZXNzZWRpdF9wYWdlc2VnX21vZGUiLCJ0ZXNzZWRpdF9jaGFyX3doaXRlbGlzdCIsInRlc3Nqc19jcmVhdGVfaG9jciIsInRlc3Nqc19jcmVhdGVfdHN2IiwidGVzc2pzX2NyZWF0ZV9ib3giLCJ0ZXNzanNfY3JlYXRlX3VubHYiLCJ0ZXNzanNfY3JlYXRlX29zZCIsImlzVVJMIiwiZHVtcCIsImlzV2ViV29ya2VyIiwic2V0SW1hZ2UiLCJkZWZhdWx0UGFyYW1zIiwiVGVzc01vZHVsZSIsImFwaSIsImxhdGVzdEpvYiIsImFkYXB0ZXIiLCJwYXJhbXMiLCJsb2FkIiwid29ya2VySWQiLCJqb2JJZCIsInBheWxvYWQiLCJnZXRDb3JlIiwiQ29yZSIsIlRlc3NlcmFjdFByb2dyZXNzIiwicGVyY2VudCIsInRlc3NNb2R1bGUiLCJsb2FkZWQiLCJGUyIsImxvYWRMYW5ndWFnZSIsImxhbmdzIiwibGFuZ1BhdGgiLCJkYXRhUGF0aCIsImNhY2hlUGF0aCIsImNhY2hlTWV0aG9kIiwibG9hZEFuZEd1bnppcEZpbGUiLCJfbGFuZyIsImxhbmciLCJfZGF0YSIsImZldGNoVXJsIiwiZmV0Y2giLCJyZXNwIiwib2siLCJhcnJheUJ1ZmZlciIsIm1rZGlyIiwid3JpdGVGaWxlIiwiYWxsIiwiRE9NRXhjZXB0aW9uIiwic2V0UGFyYW1ldGVycyIsIl9wYXJhbXMiLCJmaWx0ZXIiLCJTZXRWYXJpYWJsZSIsImluaXRpYWxpemUiLCJfbGFuZ3MiLCJvZW0iLCJFbmQiLCJzb21lRGF0YSIsInNvbWVPdGhlckRhdGEiLCJUZXNzQmFzZUFQSSIsIkluaXQiLCJyZWNvZ25pemUiLCJpbWFnZSIsInJlYyIsInJlY3RhbmdsZSIsInB0ciIsIlNldFJlY3RhbmdsZSIsImxlZnQiLCJ0b3AiLCJSZWNvZ25pemUiLCJfZnJlZSIsImdldFBERiIsInRpdGxlIiwidGV4dG9ubHkiLCJwZGZSZW5kZXJlciIsIlRlc3NQREZSZW5kZXJlciIsIkJlZ2luRG9jdW1lbnQiLCJBZGRJbWFnZSIsIkVuZERvY3VtZW50IiwicmVhZEZpbGUiLCJkZXRlY3QiLCJyZXN1bHRzIiwiT1NSZXN1bHRzIiwiRGV0ZWN0T1MiLCJiZXN0IiwiYmVzdF9yZXN1bHQiLCJvaWQiLCJvcmllbnRhdGlvbl9pZCIsInNpZCIsInNjcmlwdF9pZCIsInRlc3NlcmFjdF9zY3JpcHRfaWQiLCJzY3JpcHQiLCJ1bmljaGFyc2V0IiwiZ2V0X3NjcmlwdF9mcm9tX3NjcmlwdF9pZCIsInNjcmlwdF9jb25maWRlbmNlIiwic2NvbmZpZGVuY2UiLCJvcmllbnRhdGlvbl9kZWdyZWVzIiwib3JpZW50YXRpb25fY29uZmlkZW5jZSIsIm9jb25maWRlbmNlIiwidGVybWluYXRlIiwiXyIsInRlcm1pbmF0ZWQiLCJkaXNwYXRjaEhhbmRsZXJzIiwicGFja2V0Iiwic2VuZCIsImJpbmQiLCJhY3Rpb24iLCJzZXRBZGFwdGVyIiwiX2FkYXB0ZXIiLCJkZWluZGVudCIsImh0bWwiLCJyaSIsIkdldEl0ZXJhdG9yIiwiUklMX0JMT0NLIiwiUklMX1BBUkEiLCJSSUxfVEVYVExJTkUiLCJSSUxfV09SRCIsIlJJTF9TWU1CT0wiLCJibG9ja3MiLCJibG9jayIsInBhcmEiLCJ0ZXh0bGluZSIsIndvcmQiLCJzeW1ib2wiLCJlbnVtVG9TdHJpbmciLCJwcmVmaXgiLCJCZWdpbiIsIklzQXRCZWdpbm5pbmdPZiIsInBvbHkiLCJCbG9ja1BvbHlnb24iLCJwb2x5Z29uIiwiZ2V0UG9pbnRlciIsImdldF9uIiwicHgiLCJnZXRfeCIsInB5IiwiZ2V0X3kiLCJnZXRWYWx1ZSIsInBhcmFncmFwaHMiLCJ0ZXh0IiwiR2V0VVRGOFRleHQiLCJjb25maWRlbmNlIiwiQ29uZmlkZW5jZSIsImJhc2VsaW5lIiwiZ2V0QmFzZWxpbmUiLCJiYm94IiwiZ2V0Qm91bmRpbmdCb3giLCJibG9ja3R5cGUiLCJCbG9ja1R5cGUiLCJpc19sdHIiLCJQYXJhZ3JhcGhJc0x0ciIsIndvcmRzIiwiZm9udEluZm8iLCJnZXRXb3JkRm9udEF0dHJpYnV0ZXMiLCJ3b3JkRGlyIiwiV29yZERpcmVjdGlvbiIsInN5bWJvbHMiLCJjaG9pY2VzIiwiaXNfbnVtZXJpYyIsIldvcmRJc051bWVyaWMiLCJpbl9kaWN0aW9uYXJ5IiwiV29yZElzRnJvbURpY3Rpb25hcnkiLCJkaXJlY3Rpb24iLCJsYW5ndWFnZSIsIldvcmRSZWNvZ25pdGlvbkxhbmd1YWdlIiwiaXNfYm9sZCIsImlzX2l0YWxpYyIsImlzX3VuZGVybGluZWQiLCJpc19tb25vc3BhY2UiLCJpc19zZXJpZiIsImlzX3NtYWxsY2FwcyIsImZvbnRfc2l6ZSIsInBvaW50c2l6ZSIsImZvbnRfaWQiLCJmb250X25hbWUiLCJ3YyIsIldvcmRDaG9pY2VJdGVyYXRvciIsIk5leHQiLCJkZXN0cm95IiwiaXNfc3VwZXJzY3JpcHQiLCJTeW1ib2xJc1N1cGVyc2NyaXB0IiwiaXNfc3Vic2NyaXB0IiwiU3ltYm9sSXNTdWJzY3JpcHQiLCJpc19kcm9wY2FwIiwiU3ltYm9sSXNEcm9wY2FwIiwiY2kiLCJDaG9pY2VJdGVyYXRvciIsImhvY3IiLCJHZXRIT0NSVGV4dCIsInRzdiIsIkdldFRTVlRleHQiLCJib3giLCJHZXRCb3hUZXh0IiwidW5sdiIsIkdldFVOTFZUZXh0Iiwib3NkIiwiR2V0T3NkVGV4dCIsIk1lYW5UZXh0Q29uZiIsInBzbSIsIkdldFBhZ2VTZWdNb2RlIiwidmVyc2lvbiIsIlZlcnNpb24iLCJibXAiLCJieXRlc1BlclBpeGVsIiwicGl4IiwiZXhpZiIsImJtcEJ1ZiIsIl9tYWxsb2MiLCJCWVRFU19QRVJfRUxFTUVOVCIsIkhFQVBVOCIsIl9waXhSZWFkTWVtIiwic2V0VmFsdWUiLCJpZHgiLCJTZXRJbWFnZSIsIlN0b3JlIiwiZGJOYW1lIiwic3RvcmVOYW1lIiwiX2RicCIsIm9wZW5yZXEiLCJpbmRleGVkREIiLCJvcGVuIiwib25lcnJvciIsIm9uc3VjY2VzcyIsIm9udXBncmFkZW5lZWRlZCIsImNyZWF0ZU9iamVjdFN0b3JlIiwiY2FsbGJhY2siLCJ0cmFuc2FjdGlvbiIsIm9uY29tcGxldGUiLCJvbmFib3J0Iiwib2JqZWN0U3RvcmUiLCJzdG9yZSIsImdldERlZmF1bHRTdG9yZSIsInJlcSIsIl93aXRoSURCU3RvcmUiLCJwdXQiLCJkZWxldGUiLCJjbGVhciIsIm9wZW5LZXlDdXJzb3IiLCJvcGVuQ3Vyc29yIiwiY29udGludWUiLCJ3b3JrZXIiLCJjYWNoZSIsImFkZEV2ZW50TGlzdGVuZXIiXSwic291cmNlUm9vdCI6IiJ9