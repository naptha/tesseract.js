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
module.exports = JSON.parse('{"name":"tesseract.js","version":"3.0.2","description":"Pure Javascript Multilingual OCR","main":"src/index.js","types":"src/index.d.ts","unpkg":"dist/tesseract.min.js","jsdelivr":"dist/tesseract.min.js","scripts":{"start":"node scripts/server.js","build":"rimraf dist && webpack --config scripts/webpack.config.prod.js","profile:tesseract":"webpack-bundle-analyzer dist/tesseract-stats.json","profile:worker":"webpack-bundle-analyzer dist/worker-stats.json","prepublishOnly":"npm run build","wait":"rimraf dist && wait-on http://localhost:3000/dist/tesseract.dev.js","test":"npm-run-all -p -r start test:all","test:all":"npm-run-all wait test:browser:* test:node:all","test:node":"nyc mocha --exit --bail --require ./scripts/test-helper.js","test:node:all":"npm run test:node -- ./tests/*.test.js","test:browser-tpl":"mocha-headless-chrome -a incognito -a no-sandbox -a disable-setuid-sandbox -a disable-logging -t 300000","test:browser:detect":"npm run test:browser-tpl -- -f ./tests/detect.test.html","test:browser:recognize":"npm run test:browser-tpl -- -f ./tests/recognize.test.html","test:browser:scheduler":"npm run test:browser-tpl -- -f ./tests/scheduler.test.html","test:browser:FS":"npm run test:browser-tpl -- -f ./tests/FS.test.html","lint":"eslint src","lint:fix":"eslint --fix src","postinstall":"opencollective-postinstall || true"},"browser":{"./src/worker/node/index.js":"./src/worker/browser/index.js"},"author":"","contributors":["jeromewu"],"license":"Apache-2.0","devDependencies":{"@babel/core":"^7.18.7","@babel/preset-env":"^7.18.7","acorn":"^6.4.0","babel-loader":"^8.2.0","buffer":"^6.0.3","cors":"^2.8.5","eslint":"^7.2.0","eslint-config-airbnb-base":"^14.2.0","eslint-plugin-import":"^2.22.1","expect.js":"^0.3.1","express":"^4.17.1","mocha":"^8.1.3","mocha-headless-chrome":"^2.0.3","npm-run-all":"^4.1.5","nyc":"^15.1.0","rimraf":"^2.7.1","wait-on":"^3.3.0","webpack":"^5.74.0","webpack-bundle-analyzer":"^4.6.0","webpack-cli":"^4.10.0","webpack-dev-middleware":"^5.3.3"},"dependencies":{"babel-eslint":"^10.1.0","bmp-js":"^0.1.0","file-type":"^12.4.1","idb-keyval":"^3.2.0","is-electron":"^2.2.0","is-url":"^1.2.4","node-fetch":"^2.6.0","opencollective-postinstall":"^2.0.2","regenerator-runtime":"^0.13.3","resolve-url":"^0.2.1","tesseract.js-core":"^3.0.1","wasm-feature-detect":"^1.2.11","zlibjs":"^0.3.1"},"repository":{"type":"git","url":"https://github.com/naptha/tesseract.js.git"},"bugs":{"url":"https://github.com/naptha/tesseract.js/issues"},"homepage":"https://github.com/naptha/tesseract.js","collective":{"type":"opencollective","url":"https://opencollective.com/tesseractjs"}}');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFGO1VBQVk7O1FBQU0sS0FBSyxNQUFJQSxDQUFUO1VBQVcyaEIsQ0FBQyxHQUFDLENBQUMsQ0FBRCxFQUFHM2hCLENBQUMsR0FBQyxDQUFMLEVBQU8sQ0FBUCxDQUFGO1VBQVk7O1FBQU0sS0FBSyxNQUFJQSxDQUFUO1VBQVcyaEIsQ0FBQyxHQUFDLENBQUMsQ0FBRCxFQUFHM2hCLENBQUMsR0FBQyxDQUFMLEVBQU8sQ0FBUCxDQUFGO1VBQVk7O1FBQU0sS0FBSyxNQUFJQSxDQUFUO1VBQVcyaEIsQ0FBQyxHQUFDLENBQUMsQ0FBRCxFQUFHM2hCLENBQUMsR0FBQyxDQUFMLEVBQU8sQ0FBUCxDQUFGO1VBQVk7O1FBQU0sS0FBSyxLQUFHQSxDQUFSO1VBQVUyaEIsQ0FBQyxHQUFDLENBQUMsQ0FBRCxFQUFHM2hCLENBQUMsR0FBQyxDQUFMLEVBQU8sQ0FBUCxDQUFGO1VBQVk7O1FBQU0sS0FBSyxLQUFHQSxDQUFSO1VBQVUyaEIsQ0FBQyxHQUFDLENBQUMsQ0FBRCxFQUFHM2hCLENBQUMsR0FBQyxDQUFMLEVBQU8sQ0FBUCxDQUFGO1VBQVk7O1FBQU0sS0FBSyxNQUFJQSxDQUFUO1VBQVcyaEIsQ0FBQyxHQUFDLENBQUMsQ0FBRCxFQUFHM2hCLENBQUMsR0FBQyxDQUFMLEVBQU8sQ0FBUCxDQUFGO1VBQVk7O1FBQU0sS0FBSyxNQUFJQSxDQUFUO1VBQVcyaEIsQ0FBQyxHQUFDLENBQUMsQ0FBRCxFQUFHM2hCLENBQUMsR0FBQyxFQUFMLEVBQVEsQ0FBUixDQUFGO1VBQWE7O1FBQU0sS0FBSyxNQUFJQSxDQUFUO1VBQVcyaEIsQ0FBQyxHQUFDLENBQUMsQ0FBRCxFQUFHM2hCLENBQUMsR0FBQyxFQUFMLEVBQVEsQ0FBUixDQUFGO1VBQWE7O1FBQU0sS0FBSyxNQUFJQSxDQUFUO1VBQVcyaEIsQ0FBQyxHQUFDLENBQUMsQ0FBRCxFQUFHM2hCLENBQUMsR0FBQyxFQUFMLEVBQVEsQ0FBUixDQUFGO1VBQWE7O1FBQU0sS0FBSyxNQUFJQSxDQUFUO1VBQVcyaEIsQ0FBQyxHQUFDLENBQUMsRUFBRCxFQUFJ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QUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU15ZCxNQUFNLEdBQUc3K0IsbUJBQU8sQ0FBQyx3Q0FBRCxDQUF0Qjs7QUFDQSxJQUFNc3hCLE9BQU8sR0FBR3R4QixtQkFBTyxDQUFDLHlEQUFELENBQXZCOztBQUNBLElBQU1xdEIsTUFBTSxHQUFHcnRCLG1CQUFPLENBQUMsdURBQUQsQ0FBdEI7O0FBQ0EsSUFBTTgrQixLQUFLLEdBQUc5K0IsbUJBQU8sQ0FBQyxxREFBRCxDQUFyQjtBQUVBO0FBQ0E7QUFDQTs7O0FBQ0F1dkIscUJBQU0sQ0FBQ3dQLGdCQUFQLENBQXdCLFNBQXhCLEVBQW1DLGdCQUFjO0VBQUEsSUFBWDE4QixJQUFXLFFBQVhBLElBQVc7RUFDL0N3OEIsTUFBTSxDQUFDMUksZ0JBQVAsQ0FBd0I5ekIsSUFBeEIsRUFBOEIsVUFBQ2tILEdBQUQ7SUFBQSxPQUFTMGEsV0FBVyxDQUFDMWEsR0FBRCxDQUFwQjtFQUFBLENBQTlCO0FBQ0QsQ0FGRDtBQUlBO0FBQ0E7QUFDQTtBQUNBOztBQUNBczFCLE1BQU0sQ0FBQ3JJLFVBQVA7RUFDRWxGLE9BQU8sRUFBUEEsT0FERjtFQUVFakUsTUFBTSxFQUFOQSxNQUZGO0VBR0VtRixLQUFLLEVBQUUsaUJBQU0sQ0FBRTtBQUhqQixHQUlLc00sS0FKTCxHIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVzc2VyYWN0LmpzLy4vbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvLi9ub2RlX21vZHVsZXMvYm1wLWpzL2luZGV4LmpzIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy8uL25vZGVfbW9kdWxlcy9ibXAtanMvbGliL2RlY29kZXIuanMiLCJ3ZWJwYWNrOi8vdGVzc2VyYWN0LmpzLy4vbm9kZV9tb2R1bGVzL2JtcC1qcy9saWIvZW5jb2Rlci5qcyIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvLi9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy8uL25vZGVfbW9kdWxlcy9maWxlLXR5cGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vdGVzc2VyYWN0LmpzLy4vbm9kZV9tb2R1bGVzL2ZpbGUtdHlwZS9zdXBwb3J0ZWQuanMiLCJ3ZWJwYWNrOi8vdGVzc2VyYWN0LmpzLy4vbm9kZV9tb2R1bGVzL2ZpbGUtdHlwZS91dGlsLmpzIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy8uL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy8uL25vZGVfbW9kdWxlcy9pcy1lbGVjdHJvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvLi9ub2RlX21vZHVsZXMvaXMtdXJsL2luZGV4LmpzIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy8uL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCJ3ZWJwYWNrOi8vdGVzc2VyYWN0LmpzLy4vbm9kZV9tb2R1bGVzL3dhc20tZmVhdHVyZS1kZXRlY3QvZGlzdC9lc20vaW5kZXguanMiLCJ3ZWJwYWNrOi8vdGVzc2VyYWN0LmpzLy4vbm9kZV9tb2R1bGVzL3psaWJqcy9iaW4vbm9kZS16bGliLmpzIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy8uL3NyYy9jb25zdGFudHMvUFNNLmpzIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy8uL3NyYy91dGlscy9nZXRFbnZpcm9ubWVudC5qcyIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvLi9zcmMvdXRpbHMvbG9nLmpzIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy8uL3NyYy93b3JrZXItc2NyaXB0L2Jyb3dzZXIvY2FjaGUuanMiLCJ3ZWJwYWNrOi8vdGVzc2VyYWN0LmpzLy4vc3JjL3dvcmtlci1zY3JpcHQvYnJvd3Nlci9nZXRDb3JlLmpzIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy8uL3NyYy93b3JrZXItc2NyaXB0L2Jyb3dzZXIvZ3VuemlwLmpzIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy8uL3NyYy93b3JrZXItc2NyaXB0L2NvbnN0YW50cy9kZWZhdWx0UGFyYW1zLmpzIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy8uL3NyYy93b3JrZXItc2NyaXB0L2luZGV4LmpzIiwid2VicGFjazovL3Rlc3NlcmFjdC5qcy8uL3NyYy93b3JrZXItc2NyaXB0L3V0aWxzL2R1bXAuanMiLCJ3ZWJwYWNrOi8vdGVzc2VyYWN0LmpzLy4vc3JjL3dvcmtlci1zY3JpcHQvdXRpbHMvc2V0SW1hZ2UuanMiLCJ3ZWJwYWNrOi8vdGVzc2VyYWN0LmpzLy4vbm9kZV9tb2R1bGVzL2lkYi1rZXl2YWwvZGlzdC9pZGIta2V5dmFsLm1qcyIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdGVzc2VyYWN0LmpzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvd2VicGFjay9ydW50aW1lL25vZGUgbW9kdWxlIGRlY29yYXRvciIsIndlYnBhY2s6Ly90ZXNzZXJhY3QuanMvLi9zcmMvd29ya2VyLXNjcmlwdC9icm93c2VyL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5leHBvcnRzLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5leHBvcnRzLnRvQnl0ZUFycmF5ID0gdG9CeXRlQXJyYXlcbmV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IGZyb21CeXRlQXJyYXlcblxudmFyIGxvb2t1cCA9IFtdXG52YXIgcmV2TG9va3VwID0gW11cbnZhciBBcnIgPSB0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcgPyBVaW50OEFycmF5IDogQXJyYXlcblxudmFyIGNvZGUgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLydcbmZvciAodmFyIGkgPSAwLCBsZW4gPSBjb2RlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gIGxvb2t1cFtpXSA9IGNvZGVbaV1cbiAgcmV2TG9va3VwW2NvZGUuY2hhckNvZGVBdChpKV0gPSBpXG59XG5cbi8vIFN1cHBvcnQgZGVjb2RpbmcgVVJMLXNhZmUgYmFzZTY0IHN0cmluZ3MsIGFzIE5vZGUuanMgZG9lcy5cbi8vIFNlZTogaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQmFzZTY0I1VSTF9hcHBsaWNhdGlvbnNcbnJldkxvb2t1cFsnLScuY2hhckNvZGVBdCgwKV0gPSA2MlxucmV2TG9va3VwWydfJy5jaGFyQ29kZUF0KDApXSA9IDYzXG5cbmZ1bmN0aW9uIGdldExlbnMgKGI2NCkge1xuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXG4gIGlmIChsZW4gJSA0ID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG4gIH1cblxuICAvLyBUcmltIG9mZiBleHRyYSBieXRlcyBhZnRlciBwbGFjZWhvbGRlciBieXRlcyBhcmUgZm91bmRcbiAgLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vYmVhdGdhbW1pdC9iYXNlNjQtanMvaXNzdWVzLzQyXG4gIHZhciB2YWxpZExlbiA9IGI2NC5pbmRleE9mKCc9JylcbiAgaWYgKHZhbGlkTGVuID09PSAtMSkgdmFsaWRMZW4gPSBsZW5cblxuICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gdmFsaWRMZW4gPT09IGxlblxuICAgID8gMFxuICAgIDogNCAtICh2YWxpZExlbiAlIDQpXG5cbiAgcmV0dXJuIFt2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuXVxufVxuXG4vLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKGI2NCkge1xuICB2YXIgbGVucyA9IGdldExlbnMoYjY0KVxuICB2YXIgdmFsaWRMZW4gPSBsZW5zWzBdXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSBsZW5zWzFdXG4gIHJldHVybiAoKHZhbGlkTGVuICsgcGxhY2VIb2xkZXJzTGVuKSAqIDMgLyA0KSAtIHBsYWNlSG9sZGVyc0xlblxufVxuXG5mdW5jdGlvbiBfYnl0ZUxlbmd0aCAoYjY0LCB2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuKSB7XG4gIHJldHVybiAoKHZhbGlkTGVuICsgcGxhY2VIb2xkZXJzTGVuKSAqIDMgLyA0KSAtIHBsYWNlSG9sZGVyc0xlblxufVxuXG5mdW5jdGlvbiB0b0J5dGVBcnJheSAoYjY0KSB7XG4gIHZhciB0bXBcbiAgdmFyIGxlbnMgPSBnZXRMZW5zKGI2NClcbiAgdmFyIHZhbGlkTGVuID0gbGVuc1swXVxuICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gbGVuc1sxXVxuXG4gIHZhciBhcnIgPSBuZXcgQXJyKF9ieXRlTGVuZ3RoKGI2NCwgdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbikpXG5cbiAgdmFyIGN1ckJ5dGUgPSAwXG5cbiAgLy8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuICB2YXIgbGVuID0gcGxhY2VIb2xkZXJzTGVuID4gMFxuICAgID8gdmFsaWRMZW4gLSA0XG4gICAgOiB2YWxpZExlblxuXG4gIHZhciBpXG4gIGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxOCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDEyKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPDwgNikgfFxuICAgICAgcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAzKV1cbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gMTYpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnNMZW4gPT09IDIpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMikgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldID4+IDQpXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzTGVuID09PSAxKSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDEwKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgNCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildID4+IDIpXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuICByZXR1cm4gbG9va3VwW251bSA+PiAxOCAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gPj4gNiAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtICYgMHgzRl1cbn1cblxuZnVuY3Rpb24gZW5jb2RlQ2h1bmsgKHVpbnQ4LCBzdGFydCwgZW5kKSB7XG4gIHZhciB0bXBcbiAgdmFyIG91dHB1dCA9IFtdXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSAzKSB7XG4gICAgdG1wID1cbiAgICAgICgodWludDhbaV0gPDwgMTYpICYgMHhGRjAwMDApICtcbiAgICAgICgodWludDhbaSArIDFdIDw8IDgpICYgMHhGRjAwKSArXG4gICAgICAodWludDhbaSArIDJdICYgMHhGRilcbiAgICBvdXRwdXQucHVzaCh0cmlwbGV0VG9CYXNlNjQodG1wKSlcbiAgfVxuICByZXR1cm4gb3V0cHV0LmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGZyb21CeXRlQXJyYXkgKHVpbnQ4KSB7XG4gIHZhciB0bXBcbiAgdmFyIGxlbiA9IHVpbnQ4Lmxlbmd0aFxuICB2YXIgZXh0cmFCeXRlcyA9IGxlbiAlIDMgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayh1aW50OCwgaSwgKGkgKyBtYXhDaHVua0xlbmd0aCkgPiBsZW4yID8gbGVuMiA6IChpICsgbWF4Q2h1bmtMZW5ndGgpKSlcbiAgfVxuXG4gIC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcbiAgaWYgKGV4dHJhQnl0ZXMgPT09IDEpIHtcbiAgICB0bXAgPSB1aW50OFtsZW4gLSAxXVxuICAgIHBhcnRzLnB1c2goXG4gICAgICBsb29rdXBbdG1wID4+IDJdICtcbiAgICAgIGxvb2t1cFsodG1wIDw8IDQpICYgMHgzRl0gK1xuICAgICAgJz09J1xuICAgIClcbiAgfSBlbHNlIGlmIChleHRyYUJ5dGVzID09PSAyKSB7XG4gICAgdG1wID0gKHVpbnQ4W2xlbiAtIDJdIDw8IDgpICsgdWludDhbbGVuIC0gMV1cbiAgICBwYXJ0cy5wdXNoKFxuICAgICAgbG9va3VwW3RtcCA+PiAxMF0gK1xuICAgICAgbG9va3VwWyh0bXAgPj4gNCkgJiAweDNGXSArXG4gICAgICBsb29rdXBbKHRtcCA8PCAyKSAmIDB4M0ZdICtcbiAgICAgICc9J1xuICAgIClcbiAgfVxuXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuIiwiLyoqXG4gKiBAYXV0aG9yIHNoYW96aWxlZVxuICpcbiAqIHN1cHBvcnQgMWJpdCA0Yml0IDhiaXQgMjRiaXQgZGVjb2RlXG4gKiBlbmNvZGUgd2l0aCAyNGJpdFxuICogXG4gKi9cblxudmFyIGVuY29kZSA9IHJlcXVpcmUoJy4vbGliL2VuY29kZXInKSxcbiAgICBkZWNvZGUgPSByZXF1aXJlKCcuL2xpYi9kZWNvZGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBlbmNvZGU6IGVuY29kZSxcbiAgZGVjb2RlOiBkZWNvZGVcbn07XG4iLCIvKipcbiAqIEBhdXRob3Igc2hhb3ppbGVlXG4gKlxuICogQm1wIGZvcm1hdCBkZWNvZGVyLHN1cHBvcnQgMWJpdCA0Yml0IDhiaXQgMjRiaXQgYm1wXG4gKlxuICovXG5cbmZ1bmN0aW9uIEJtcERlY29kZXIoYnVmZmVyLGlzX3dpdGhfYWxwaGEpIHtcbiAgdGhpcy5wb3MgPSAwO1xuICB0aGlzLmJ1ZmZlciA9IGJ1ZmZlcjtcbiAgdGhpcy5pc193aXRoX2FscGhhID0gISFpc193aXRoX2FscGhhO1xuICB0aGlzLmJvdHRvbV91cCA9IHRydWU7XG4gIHRoaXMuZmxhZyA9IHRoaXMuYnVmZmVyLnRvU3RyaW5nKFwidXRmLThcIiwgMCwgdGhpcy5wb3MgKz0gMik7XG4gIGlmICh0aGlzLmZsYWcgIT0gXCJCTVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIEJNUCBGaWxlXCIpO1xuICB0aGlzLnBhcnNlSGVhZGVyKCk7XG4gIHRoaXMucGFyc2VSR0JBKCk7XG59XG5cbkJtcERlY29kZXIucHJvdG90eXBlLnBhcnNlSGVhZGVyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZmlsZVNpemUgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDMyTEUodGhpcy5wb3MpO1xuICB0aGlzLnBvcyArPSA0O1xuICB0aGlzLnJlc2VydmVkID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgdGhpcy5wb3MgKz0gNDtcbiAgdGhpcy5vZmZzZXQgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDMyTEUodGhpcy5wb3MpO1xuICB0aGlzLnBvcyArPSA0O1xuICB0aGlzLmhlYWRlclNpemUgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDMyTEUodGhpcy5wb3MpO1xuICB0aGlzLnBvcyArPSA0O1xuICB0aGlzLndpZHRoID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgdGhpcy5wb3MgKz0gNDtcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLmJ1ZmZlci5yZWFkSW50MzJMRSh0aGlzLnBvcyk7XG4gIHRoaXMucG9zICs9IDQ7XG4gIHRoaXMucGxhbmVzID0gdGhpcy5idWZmZXIucmVhZFVJbnQxNkxFKHRoaXMucG9zKTtcbiAgdGhpcy5wb3MgKz0gMjtcbiAgdGhpcy5iaXRQUCA9IHRoaXMuYnVmZmVyLnJlYWRVSW50MTZMRSh0aGlzLnBvcyk7XG4gIHRoaXMucG9zICs9IDI7XG4gIHRoaXMuY29tcHJlc3MgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDMyTEUodGhpcy5wb3MpO1xuICB0aGlzLnBvcyArPSA0O1xuICB0aGlzLnJhd1NpemUgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDMyTEUodGhpcy5wb3MpO1xuICB0aGlzLnBvcyArPSA0O1xuICB0aGlzLmhyID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgdGhpcy5wb3MgKz0gNDtcbiAgdGhpcy52ciA9IHRoaXMuYnVmZmVyLnJlYWRVSW50MzJMRSh0aGlzLnBvcyk7XG4gIHRoaXMucG9zICs9IDQ7XG4gIHRoaXMuY29sb3JzID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgdGhpcy5wb3MgKz0gNDtcbiAgdGhpcy5pbXBvcnRhbnRDb2xvcnMgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDMyTEUodGhpcy5wb3MpO1xuICB0aGlzLnBvcyArPSA0O1xuXG4gIGlmKHRoaXMuYml0UFAgPT09IDE2ICYmIHRoaXMuaXNfd2l0aF9hbHBoYSl7XG4gICAgdGhpcy5iaXRQUCA9IDE1XG4gIH1cbiAgaWYgKHRoaXMuYml0UFAgPCAxNSkge1xuICAgIHZhciBsZW4gPSB0aGlzLmNvbG9ycyA9PT0gMCA/IDEgPDwgdGhpcy5iaXRQUCA6IHRoaXMuY29sb3JzO1xuICAgIHRoaXMucGFsZXR0ZSA9IG5ldyBBcnJheShsZW4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHZhciBibHVlID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgdmFyIGdyZWVuID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgdmFyIHJlZCA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgIHZhciBxdWFkID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgdGhpcy5wYWxldHRlW2ldID0ge1xuICAgICAgICByZWQ6IHJlZCxcbiAgICAgICAgZ3JlZW46IGdyZWVuLFxuICAgICAgICBibHVlOiBibHVlLFxuICAgICAgICBxdWFkOiBxdWFkXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBpZih0aGlzLmhlaWdodCA8IDApIHtcbiAgICB0aGlzLmhlaWdodCAqPSAtMTtcbiAgICB0aGlzLmJvdHRvbV91cCA9IGZhbHNlO1xuICB9XG5cbn1cblxuQm1wRGVjb2Rlci5wcm90b3R5cGUucGFyc2VSR0JBID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJpdG4gPSBcImJpdFwiICsgdGhpcy5iaXRQUDtcbiAgICB2YXIgbGVuID0gdGhpcy53aWR0aCAqIHRoaXMuaGVpZ2h0ICogNDtcbiAgICB0aGlzLmRhdGEgPSBuZXcgQnVmZmVyKGxlbik7XG4gICAgdGhpc1tiaXRuXSgpO1xufTtcblxuQm1wRGVjb2Rlci5wcm90b3R5cGUuYml0MSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgeGxlbiA9IE1hdGguY2VpbCh0aGlzLndpZHRoIC8gOCk7XG4gIHZhciBtb2RlID0geGxlbiU0O1xuICB2YXIgeSA9IHRoaXMuaGVpZ2h0ID49IDAgPyB0aGlzLmhlaWdodCAtIDEgOiAtdGhpcy5oZWlnaHRcbiAgZm9yICh2YXIgeSA9IHRoaXMuaGVpZ2h0IC0gMTsgeSA+PSAwOyB5LS0pIHtcbiAgICB2YXIgbGluZSA9IHRoaXMuYm90dG9tX3VwID8geSA6IHRoaXMuaGVpZ2h0IC0gMSAtIHlcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHhsZW47IHgrKykge1xuICAgICAgdmFyIGIgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICB2YXIgbG9jYXRpb24gPSBsaW5lICogdGhpcy53aWR0aCAqIDQgKyB4KjgqNDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgODsgaSsrKSB7XG4gICAgICAgIGlmKHgqOCtpPHRoaXMud2lkdGgpe1xuICAgICAgICAgIHZhciByZ2IgPSB0aGlzLnBhbGV0dGVbKChiPj4oNy1pKSkmMHgxKV07XG5cbiAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24raSo0XSA9IDA7XG4gICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uK2kqNCArIDFdID0gcmdiLmJsdWU7XG4gICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uK2kqNCArIDJdID0gcmdiLmdyZWVuO1xuICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbitpKjQgKyAzXSA9IHJnYi5yZWQ7XG5cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobW9kZSAhPSAwKXtcbiAgICAgIHRoaXMucG9zKz0oNCAtIG1vZGUpO1xuICAgIH1cbiAgfVxufTtcblxuQm1wRGVjb2Rlci5wcm90b3R5cGUuYml0NCA9IGZ1bmN0aW9uKCkge1xuICAgIC8vUkxFLTRcbiAgICBpZih0aGlzLmNvbXByZXNzID09IDIpe1xuICAgICAgICB0aGlzLmRhdGEuZmlsbCgweGZmKTtcblxuICAgICAgICB2YXIgbG9jYXRpb24gPSAwO1xuICAgICAgICB2YXIgbGluZXMgPSB0aGlzLmJvdHRvbV91cD90aGlzLmhlaWdodC0xOjA7XG4gICAgICAgIHZhciBsb3dfbmliYmxlID0gZmFsc2U7Ly9mb3IgYWxsIGNvdW50IG9mIHBpeGVsXG5cbiAgICAgICAgd2hpbGUobG9jYXRpb248dGhpcy5kYXRhLmxlbmd0aCl7XG4gICAgICAgICAgICB2YXIgYSA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgIHZhciBiID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgICAgICAgLy9hYnNvbHV0ZSBtb2RlXG4gICAgICAgICAgICBpZihhID09IDApe1xuICAgICAgICAgICAgICAgIGlmKGIgPT0gMCl7Ly9saW5lIGVuZFxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmJvdHRvbV91cCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lcy0tO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzKys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24gPSBsaW5lcyp0aGlzLndpZHRoKjQ7XG4gICAgICAgICAgICAgICAgICAgIGxvd19uaWJibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYoYiA9PSAxKXsvL2ltYWdlIGVuZFxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihiID09Mil7XG4gICAgICAgICAgICAgICAgICAgIC8vb2Zmc2V0IHgseVxuICAgICAgICAgICAgICAgICAgICB2YXIgeCA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHkgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuYm90dG9tX3VwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzLT15O1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzKz15O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24gKz0oeSp0aGlzLndpZHRoKjQreCo0KTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGMgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8YjtpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvd19uaWJibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRQaXhlbERhdGEuY2FsbCh0aGlzLCAoYyAmIDB4MGYpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0UGl4ZWxEYXRhLmNhbGwodGhpcywgKGMgJiAweGYwKT4+NCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoaSAmIDEpICYmIChpKzEgPCBiKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYyA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgbG93X25pYmJsZSA9ICFsb3dfbmliYmxlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCgoKGIrMSkgPj4gMSkgJiAxICkgPT0gMSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcysrXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1lbHNley8vZW5jb2RlZCBtb2RlXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvd19uaWJibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFBpeGVsRGF0YS5jYWxsKHRoaXMsIChiICYgMHgwZikpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0UGl4ZWxEYXRhLmNhbGwodGhpcywgKGIgJiAweGYwKT4+NCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbG93X25pYmJsZSA9ICFsb3dfbmliYmxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuXG5cbiAgICAgICAgZnVuY3Rpb24gc2V0UGl4ZWxEYXRhKHJnYkluZGV4KXtcbiAgICAgICAgICAgIHZhciByZ2IgPSB0aGlzLnBhbGV0dGVbcmdiSW5kZXhdO1xuICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uXSA9IDA7XG4gICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAxXSA9IHJnYi5ibHVlO1xuICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMl0gPSByZ2IuZ3JlZW47XG4gICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAzXSA9IHJnYi5yZWQ7XG4gICAgICAgICAgICBsb2NhdGlvbis9NDtcbiAgICAgICAgfVxuICAgIH1lbHNle1xuXG4gICAgICB2YXIgeGxlbiA9IE1hdGguY2VpbCh0aGlzLndpZHRoLzIpO1xuICAgICAgdmFyIG1vZGUgPSB4bGVuJTQ7XG4gICAgICBmb3IgKHZhciB5ID0gdGhpcy5oZWlnaHQgLSAxOyB5ID49IDA7IHktLSkge1xuICAgICAgICB2YXIgbGluZSA9IHRoaXMuYm90dG9tX3VwID8geSA6IHRoaXMuaGVpZ2h0IC0gMSAtIHlcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB4bGVuOyB4KyspIHtcbiAgICAgICAgICB2YXIgYiA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICB2YXIgbG9jYXRpb24gPSBsaW5lICogdGhpcy53aWR0aCAqIDQgKyB4KjIqNDtcblxuICAgICAgICAgIHZhciBiZWZvcmUgPSBiPj40O1xuICAgICAgICAgIHZhciBhZnRlciA9IGImMHgwRjtcblxuICAgICAgICAgIHZhciByZ2IgPSB0aGlzLnBhbGV0dGVbYmVmb3JlXTtcbiAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb25dID0gMDtcbiAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAxXSA9IHJnYi5ibHVlO1xuICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDJdID0gcmdiLmdyZWVuO1xuICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDNdID0gcmdiLnJlZDtcblxuXG4gICAgICAgICAgaWYoeCoyKzE+PXRoaXMud2lkdGgpYnJlYWs7XG5cbiAgICAgICAgICByZ2IgPSB0aGlzLnBhbGV0dGVbYWZ0ZXJdO1xuXG4gICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uKzRdID0gMDtcbiAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24rNCArIDFdID0gcmdiLmJsdWU7XG4gICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uKzQgKyAyXSA9IHJnYi5ncmVlbjtcbiAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24rNCArIDNdID0gcmdiLnJlZDtcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vZGUgIT0gMCl7XG4gICAgICAgICAgdGhpcy5wb3MrPSg0IC0gbW9kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH1cblxufTtcblxuQm1wRGVjb2Rlci5wcm90b3R5cGUuYml0OCA9IGZ1bmN0aW9uKCkge1xuICAgIC8vUkxFLThcbiAgICBpZih0aGlzLmNvbXByZXNzID09IDEpe1xuICAgICAgICB0aGlzLmRhdGEuZmlsbCgweGZmKTtcblxuICAgICAgICB2YXIgbG9jYXRpb24gPSAwO1xuICAgICAgICB2YXIgbGluZXMgPSB0aGlzLmJvdHRvbV91cD90aGlzLmhlaWdodC0xOjA7XG5cbiAgICAgICAgd2hpbGUobG9jYXRpb248dGhpcy5kYXRhLmxlbmd0aCl7XG4gICAgICAgICAgICB2YXIgYSA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgIHZhciBiID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgICAgICAgLy9hYnNvbHV0ZSBtb2RlXG4gICAgICAgICAgICBpZihhID09IDApe1xuICAgICAgICAgICAgICAgIGlmKGIgPT0gMCl7Ly9saW5lIGVuZFxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmJvdHRvbV91cCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lcy0tO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzKys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24gPSBsaW5lcyp0aGlzLndpZHRoKjQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGIgPT0gMSl7Ly9pbWFnZSBlbmRcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYoYiA9PTIpe1xuICAgICAgICAgICAgICAgICAgICAvL29mZnNldCB4LHlcbiAgICAgICAgICAgICAgICAgICAgdmFyIHggPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB5ID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmJvdHRvbV91cCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lcy09eTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lcys9eTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uICs9KHkqdGhpcy53aWR0aCo0K3gqNCk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8YjtpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGMgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRQaXhlbERhdGEuY2FsbCh0aGlzLCBjKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZihiJjEgPT0gMSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcysrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1lbHNley8vZW5jb2RlZCBtb2RlXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0UGl4ZWxEYXRhLmNhbGwodGhpcywgYik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuXG5cblxuICAgICAgICBmdW5jdGlvbiBzZXRQaXhlbERhdGEocmdiSW5kZXgpe1xuICAgICAgICAgICAgdmFyIHJnYiA9IHRoaXMucGFsZXR0ZVtyZ2JJbmRleF07XG4gICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb25dID0gMDtcbiAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDFdID0gcmdiLmJsdWU7XG4gICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAyXSA9IHJnYi5ncmVlbjtcbiAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDNdID0gcmdiLnJlZDtcbiAgICAgICAgICAgIGxvY2F0aW9uKz00O1xuICAgICAgICB9XG4gICAgfWVsc2Uge1xuICAgICAgICB2YXIgbW9kZSA9IHRoaXMud2lkdGggJSA0O1xuICAgICAgICBmb3IgKHZhciB5ID0gdGhpcy5oZWlnaHQgLSAxOyB5ID49IDA7IHktLSkge1xuICAgICAgICAgICAgdmFyIGxpbmUgPSB0aGlzLmJvdHRvbV91cCA/IHkgOiB0aGlzLmhlaWdodCAtIDEgLSB5XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xuICAgICAgICAgICAgICAgIHZhciBiID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IGxpbmUgKiB0aGlzLndpZHRoICogNCArIHggKiA0O1xuICAgICAgICAgICAgICAgIGlmIChiIDwgdGhpcy5wYWxldHRlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmdiID0gdGhpcy5wYWxldHRlW2JdO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbl0gPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAxXSA9IHJnYi5ibHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAyXSA9IHJnYi5ncmVlbjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgM10gPSByZ2IucmVkO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uXSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDFdID0gMHhGRjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMl0gPSAweEZGO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAzXSA9IDB4RkY7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1vZGUgIT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMucG9zICs9ICg0IC0gbW9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5CbXBEZWNvZGVyLnByb3RvdHlwZS5iaXQxNSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGlmX3cgPXRoaXMud2lkdGggJSAzO1xuICB2YXIgXzExMTExID0gcGFyc2VJbnQoXCIxMTExMVwiLCAyKSxfMV81ID0gXzExMTExO1xuICBmb3IgKHZhciB5ID0gdGhpcy5oZWlnaHQgLSAxOyB5ID49IDA7IHktLSkge1xuICAgIHZhciBsaW5lID0gdGhpcy5ib3R0b21fdXAgPyB5IDogdGhpcy5oZWlnaHQgLSAxIC0geVxuICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XG5cbiAgICAgIHZhciBCID0gdGhpcy5idWZmZXIucmVhZFVJbnQxNkxFKHRoaXMucG9zKTtcbiAgICAgIHRoaXMucG9zKz0yO1xuICAgICAgdmFyIGJsdWUgPSAoQiAmIF8xXzUpIC8gXzFfNSAqIDI1NSB8IDA7XG4gICAgICB2YXIgZ3JlZW4gPSAoQiA+PiA1ICYgXzFfNSApIC8gXzFfNSAqIDI1NSB8IDA7XG4gICAgICB2YXIgcmVkID0gKEIgPj4gMTAgJiBfMV81KSAvIF8xXzUgKiAyNTUgfCAwO1xuICAgICAgdmFyIGFscGhhID0gKEI+PjE1KT8weEZGOjB4MDA7XG5cbiAgICAgIHZhciBsb2NhdGlvbiA9IGxpbmUgKiB0aGlzLndpZHRoICogNCArIHggKiA0O1xuXG4gICAgICB0aGlzLmRhdGFbbG9jYXRpb25dID0gYWxwaGE7XG4gICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAxXSA9IGJsdWU7XG4gICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAyXSA9IGdyZWVuO1xuICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgM10gPSByZWQ7XG4gICAgfVxuICAgIC8vc2tpcCBleHRyYSBieXRlc1xuICAgIHRoaXMucG9zICs9IGRpZl93O1xuICB9XG59O1xuXG5CbXBEZWNvZGVyLnByb3RvdHlwZS5iaXQxNiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGlmX3cgPSh0aGlzLndpZHRoICUgMikqMjtcbiAgLy9kZWZhdWx0IHhyZ2I1NTVcbiAgdGhpcy5tYXNrUmVkID0gMHg3QzAwO1xuICB0aGlzLm1hc2tHcmVlbiA9IDB4M0UwO1xuICB0aGlzLm1hc2tCbHVlID0weDFGO1xuICB0aGlzLm1hc2swID0gMDtcblxuICBpZih0aGlzLmNvbXByZXNzID09IDMpe1xuICAgIHRoaXMubWFza1JlZCA9IHRoaXMuYnVmZmVyLnJlYWRVSW50MzJMRSh0aGlzLnBvcyk7XG4gICAgdGhpcy5wb3MrPTQ7XG4gICAgdGhpcy5tYXNrR3JlZW4gPSB0aGlzLmJ1ZmZlci5yZWFkVUludDMyTEUodGhpcy5wb3MpO1xuICAgIHRoaXMucG9zKz00O1xuICAgIHRoaXMubWFza0JsdWUgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDMyTEUodGhpcy5wb3MpO1xuICAgIHRoaXMucG9zKz00O1xuICAgIHRoaXMubWFzazAgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDMyTEUodGhpcy5wb3MpO1xuICAgIHRoaXMucG9zKz00O1xuICB9XG5cblxuICB2YXIgbnM9WzAsMCwwXTtcbiAgZm9yICh2YXIgaT0wO2k8MTY7aSsrKXtcbiAgICBpZiAoKHRoaXMubWFza1JlZD4+aSkmMHgwMSkgbnNbMF0rKztcbiAgICBpZiAoKHRoaXMubWFza0dyZWVuPj5pKSYweDAxKSBuc1sxXSsrO1xuICAgIGlmICgodGhpcy5tYXNrQmx1ZT4+aSkmMHgwMSkgbnNbMl0rKztcbiAgfVxuICBuc1sxXSs9bnNbMF07IG5zWzJdKz1uc1sxXTtcdG5zWzBdPTgtbnNbMF07IG5zWzFdLT04OyBuc1syXS09ODtcblxuICBmb3IgKHZhciB5ID0gdGhpcy5oZWlnaHQgLSAxOyB5ID49IDA7IHktLSkge1xuICAgIHZhciBsaW5lID0gdGhpcy5ib3R0b21fdXAgPyB5IDogdGhpcy5oZWlnaHQgLSAxIC0geTtcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xuXG4gICAgICB2YXIgQiA9IHRoaXMuYnVmZmVyLnJlYWRVSW50MTZMRSh0aGlzLnBvcyk7XG4gICAgICB0aGlzLnBvcys9MjtcblxuICAgICAgdmFyIGJsdWUgPSAoQiZ0aGlzLm1hc2tCbHVlKTw8bnNbMF07XG4gICAgICB2YXIgZ3JlZW4gPSAoQiZ0aGlzLm1hc2tHcmVlbik+Pm5zWzFdO1xuICAgICAgdmFyIHJlZCA9IChCJnRoaXMubWFza1JlZCk+Pm5zWzJdO1xuXG4gICAgICB2YXIgbG9jYXRpb24gPSBsaW5lICogdGhpcy53aWR0aCAqIDQgKyB4ICogNDtcblxuICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uXSA9IDA7XG4gICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAxXSA9IGJsdWU7XG4gICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAyXSA9IGdyZWVuO1xuICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgM10gPSByZWQ7XG4gICAgfVxuICAgIC8vc2tpcCBleHRyYSBieXRlc1xuICAgIHRoaXMucG9zICs9IGRpZl93O1xuICB9XG59O1xuXG5CbXBEZWNvZGVyLnByb3RvdHlwZS5iaXQyNCA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciB5ID0gdGhpcy5oZWlnaHQgLSAxOyB5ID49IDA7IHktLSkge1xuICAgIHZhciBsaW5lID0gdGhpcy5ib3R0b21fdXAgPyB5IDogdGhpcy5oZWlnaHQgLSAxIC0geVxuICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XG4gICAgICAvL0xpdHRsZSBFbmRpYW4gcmdiXG4gICAgICB2YXIgYmx1ZSA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgIHZhciBncmVlbiA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgIHZhciByZWQgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICB2YXIgbG9jYXRpb24gPSBsaW5lICogdGhpcy53aWR0aCAqIDQgKyB4ICogNDtcbiAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbl0gPSAwO1xuICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMV0gPSBibHVlO1xuICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMl0gPSBncmVlbjtcbiAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDNdID0gcmVkO1xuICAgIH1cbiAgICAvL3NraXAgZXh0cmEgYnl0ZXNcbiAgICB0aGlzLnBvcyArPSAodGhpcy53aWR0aCAlIDQpO1xuICB9XG5cbn07XG5cbi8qKlxuICogYWRkIDMyYml0IGRlY29kZSBmdW5jXG4gKiBAYXV0aG9yIHNvdWJva1xuICovXG5CbXBEZWNvZGVyLnByb3RvdHlwZS5iaXQzMiA9IGZ1bmN0aW9uKCkge1xuICAvL0JJX0JJVEZJRUxEU1xuICBpZih0aGlzLmNvbXByZXNzID09IDMpe1xuICAgIHRoaXMubWFza1JlZCA9IHRoaXMuYnVmZmVyLnJlYWRVSW50MzJMRSh0aGlzLnBvcyk7XG4gICAgdGhpcy5wb3MrPTQ7XG4gICAgdGhpcy5tYXNrR3JlZW4gPSB0aGlzLmJ1ZmZlci5yZWFkVUludDMyTEUodGhpcy5wb3MpO1xuICAgIHRoaXMucG9zKz00O1xuICAgIHRoaXMubWFza0JsdWUgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDMyTEUodGhpcy5wb3MpO1xuICAgIHRoaXMucG9zKz00O1xuICAgIHRoaXMubWFzazAgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDMyTEUodGhpcy5wb3MpO1xuICAgIHRoaXMucG9zKz00O1xuICAgICAgZm9yICh2YXIgeSA9IHRoaXMuaGVpZ2h0IC0gMTsgeSA+PSAwOyB5LS0pIHtcbiAgICAgICAgICB2YXIgbGluZSA9IHRoaXMuYm90dG9tX3VwID8geSA6IHRoaXMuaGVpZ2h0IC0gMSAtIHk7XG4gICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcbiAgICAgICAgICAgICAgLy9MaXR0bGUgRW5kaWFuIHJnYmFcbiAgICAgICAgICAgICAgdmFyIGFscGhhID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgICAgICAgICB2YXIgYmx1ZSA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgICAgdmFyIGdyZWVuID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgICAgICAgICB2YXIgcmVkID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBsaW5lICogdGhpcy53aWR0aCAqIDQgKyB4ICogNDtcbiAgICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uXSA9IGFscGhhO1xuICAgICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAxXSA9IGJsdWU7XG4gICAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDJdID0gZ3JlZW47XG4gICAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDNdID0gcmVkO1xuICAgICAgICAgIH1cbiAgICAgIH1cblxuICB9ZWxzZXtcbiAgICAgIGZvciAodmFyIHkgPSB0aGlzLmhlaWdodCAtIDE7IHkgPj0gMDsgeS0tKSB7XG4gICAgICAgICAgdmFyIGxpbmUgPSB0aGlzLmJvdHRvbV91cCA/IHkgOiB0aGlzLmhlaWdodCAtIDEgLSB5O1xuICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XG4gICAgICAgICAgICAgIC8vTGl0dGxlIEVuZGlhbiBhcmdiXG4gICAgICAgICAgICAgIHZhciBibHVlID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgICAgICAgICB2YXIgZ3JlZW4gPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICAgICAgICAgIHZhciByZWQgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICAgICAgICAgIHZhciBhbHBoYSA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gbGluZSAqIHRoaXMud2lkdGggKiA0ICsgeCAqIDQ7XG4gICAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbl0gPSBhbHBoYTtcbiAgICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMV0gPSBibHVlO1xuICAgICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAyXSA9IGdyZWVuO1xuICAgICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAzXSA9IHJlZDtcbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgfVxuXG5cblxuXG59O1xuXG5CbXBEZWNvZGVyLnByb3RvdHlwZS5nZXREYXRhID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmRhdGE7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGJtcERhdGEpIHtcbiAgdmFyIGRlY29kZXIgPSBuZXcgQm1wRGVjb2RlcihibXBEYXRhKTtcbiAgcmV0dXJuIGRlY29kZXI7XG59O1xuIiwiLyoqXG4gKiBAYXV0aG9yIHNoYW96aWxlZVxuICpcbiAqIEJNUCBmb3JtYXQgZW5jb2RlcixlbmNvZGUgMjRiaXQgQk1QXG4gKiBOb3Qgc3VwcG9ydCBxdWFsaXR5IGNvbXByZXNzaW9uXG4gKlxuICovXG5cbmZ1bmN0aW9uIEJtcEVuY29kZXIoaW1nRGF0YSl7XG5cdHRoaXMuYnVmZmVyID0gaW1nRGF0YS5kYXRhO1xuXHR0aGlzLndpZHRoID0gaW1nRGF0YS53aWR0aDtcblx0dGhpcy5oZWlnaHQgPSBpbWdEYXRhLmhlaWdodDtcblx0dGhpcy5leHRyYUJ5dGVzID0gdGhpcy53aWR0aCU0O1xuXHR0aGlzLnJnYlNpemUgPSB0aGlzLmhlaWdodCooMyp0aGlzLndpZHRoK3RoaXMuZXh0cmFCeXRlcyk7XG5cdHRoaXMuaGVhZGVySW5mb1NpemUgPSA0MDtcblxuXHR0aGlzLmRhdGEgPSBbXTtcblx0LyoqKioqKioqKioqKioqKioqKmhlYWRlcioqKioqKioqKioqKioqKioqKioqKioqL1xuXHR0aGlzLmZsYWcgPSBcIkJNXCI7XG5cdHRoaXMucmVzZXJ2ZWQgPSAwO1xuXHR0aGlzLm9mZnNldCA9IDU0O1xuXHR0aGlzLmZpbGVTaXplID0gdGhpcy5yZ2JTaXplK3RoaXMub2Zmc2V0O1xuXHR0aGlzLnBsYW5lcyA9IDE7XG5cdHRoaXMuYml0UFAgPSAyNDtcblx0dGhpcy5jb21wcmVzcyA9IDA7XG5cdHRoaXMuaHIgPSAwO1xuXHR0aGlzLnZyID0gMDtcblx0dGhpcy5jb2xvcnMgPSAwO1xuXHR0aGlzLmltcG9ydGFudENvbG9ycyA9IDA7XG59XG5cbkJtcEVuY29kZXIucHJvdG90eXBlLmVuY29kZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdGVtcEJ1ZmZlciA9IG5ldyBCdWZmZXIodGhpcy5vZmZzZXQrdGhpcy5yZ2JTaXplKTtcblx0dGhpcy5wb3MgPSAwO1xuXHR0ZW1wQnVmZmVyLndyaXRlKHRoaXMuZmxhZyx0aGlzLnBvcywyKTt0aGlzLnBvcys9Mjtcblx0dGVtcEJ1ZmZlci53cml0ZVVJbnQzMkxFKHRoaXMuZmlsZVNpemUsdGhpcy5wb3MpO3RoaXMucG9zKz00O1xuXHR0ZW1wQnVmZmVyLndyaXRlVUludDMyTEUodGhpcy5yZXNlcnZlZCx0aGlzLnBvcyk7dGhpcy5wb3MrPTQ7XG5cdHRlbXBCdWZmZXIud3JpdGVVSW50MzJMRSh0aGlzLm9mZnNldCx0aGlzLnBvcyk7dGhpcy5wb3MrPTQ7XG5cblx0dGVtcEJ1ZmZlci53cml0ZVVJbnQzMkxFKHRoaXMuaGVhZGVySW5mb1NpemUsdGhpcy5wb3MpO3RoaXMucG9zKz00O1xuXHR0ZW1wQnVmZmVyLndyaXRlVUludDMyTEUodGhpcy53aWR0aCx0aGlzLnBvcyk7dGhpcy5wb3MrPTQ7XG5cdHRlbXBCdWZmZXIud3JpdGVJbnQzMkxFKC10aGlzLmhlaWdodCx0aGlzLnBvcyk7dGhpcy5wb3MrPTQ7XG5cdHRlbXBCdWZmZXIud3JpdGVVSW50MTZMRSh0aGlzLnBsYW5lcyx0aGlzLnBvcyk7dGhpcy5wb3MrPTI7XG5cdHRlbXBCdWZmZXIud3JpdGVVSW50MTZMRSh0aGlzLmJpdFBQLHRoaXMucG9zKTt0aGlzLnBvcys9Mjtcblx0dGVtcEJ1ZmZlci53cml0ZVVJbnQzMkxFKHRoaXMuY29tcHJlc3MsdGhpcy5wb3MpO3RoaXMucG9zKz00O1xuXHR0ZW1wQnVmZmVyLndyaXRlVUludDMyTEUodGhpcy5yZ2JTaXplLHRoaXMucG9zKTt0aGlzLnBvcys9NDtcblx0dGVtcEJ1ZmZlci53cml0ZVVJbnQzMkxFKHRoaXMuaHIsdGhpcy5wb3MpO3RoaXMucG9zKz00O1xuXHR0ZW1wQnVmZmVyLndyaXRlVUludDMyTEUodGhpcy52cix0aGlzLnBvcyk7dGhpcy5wb3MrPTQ7XG5cdHRlbXBCdWZmZXIud3JpdGVVSW50MzJMRSh0aGlzLmNvbG9ycyx0aGlzLnBvcyk7dGhpcy5wb3MrPTQ7XG5cdHRlbXBCdWZmZXIud3JpdGVVSW50MzJMRSh0aGlzLmltcG9ydGFudENvbG9ycyx0aGlzLnBvcyk7dGhpcy5wb3MrPTQ7XG5cblx0dmFyIGk9MDtcblx0dmFyIHJvd0J5dGVzID0gMyp0aGlzLndpZHRoK3RoaXMuZXh0cmFCeXRlcztcblxuXHRmb3IgKHZhciB5ID0gMDsgeSA8dGhpcy5oZWlnaHQ7IHkrKyl7XG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4Kyspe1xuXHRcdFx0dmFyIHAgPSB0aGlzLnBvcyt5KnJvd0J5dGVzK3gqMztcblx0XHRcdGkrKzsvL2Fcblx0XHRcdHRlbXBCdWZmZXJbcF09IHRoaXMuYnVmZmVyW2krK107Ly9iXG5cdFx0XHR0ZW1wQnVmZmVyW3ArMV0gPSB0aGlzLmJ1ZmZlcltpKytdOy8vZ1xuXHRcdFx0dGVtcEJ1ZmZlcltwKzJdICA9IHRoaXMuYnVmZmVyW2krK107Ly9yXG5cdFx0fVxuXHRcdGlmKHRoaXMuZXh0cmFCeXRlcz4wKXtcblx0XHRcdHZhciBmaWxsT2Zmc2V0ID0gdGhpcy5wb3MreSpyb3dCeXRlcyt0aGlzLndpZHRoKjM7XG5cdFx0XHR0ZW1wQnVmZmVyLmZpbGwoMCxmaWxsT2Zmc2V0LGZpbGxPZmZzZXQrdGhpcy5leHRyYUJ5dGVzKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdGVtcEJ1ZmZlcjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaW1nRGF0YSwgcXVhbGl0eSkge1xuICBpZiAodHlwZW9mIHF1YWxpdHkgPT09ICd1bmRlZmluZWQnKSBxdWFsaXR5ID0gMTAwO1xuIFx0dmFyIGVuY29kZXIgPSBuZXcgQm1wRW5jb2RlcihpbWdEYXRhKTtcblx0dmFyIGRhdGEgPSBlbmNvZGVyLmVuY29kZSgpO1xuICByZXR1cm4ge1xuICAgIGRhdGE6IGRhdGEsXG4gICAgd2lkdGg6IGltZ0RhdGEud2lkdGgsXG4gICAgaGVpZ2h0OiBpbWdEYXRhLmhlaWdodFxuICB9O1xufTtcbiIsIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG5jb25zdCBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5jb25zdCBjdXN0b21JbnNwZWN0U3ltYm9sID1cbiAgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIFN5bWJvbFsnZm9yJ10gPT09ICdmdW5jdGlvbicpIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZG90LW5vdGF0aW9uXG4gICAgPyBTeW1ib2xbJ2ZvciddKCdub2RlanMudXRpbC5pbnNwZWN0LmN1c3RvbScpIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZG90LW5vdGF0aW9uXG4gICAgOiBudWxsXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBTbG93QnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcblxuY29uc3QgS19NQVhfTEVOR1RIID0gMHg3ZmZmZmZmZlxuZXhwb3J0cy5rTWF4TGVuZ3RoID0gS19NQVhfTEVOR1RIXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFByaW50IHdhcm5pbmcgYW5kIHJlY29tbWVuZCB1c2luZyBgYnVmZmVyYCB2NC54IHdoaWNoIGhhcyBhbiBPYmplY3RcbiAqICAgICAgICAgICAgICAgaW1wbGVtZW50YXRpb24gKG1vc3QgY29tcGF0aWJsZSwgZXZlbiBJRTYpXG4gKlxuICogQnJvd3NlcnMgdGhhdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLCBDaHJvbWUgNyssIFNhZmFyaSA1LjErLFxuICogT3BlcmEgMTEuNissIGlPUyA0LjIrLlxuICpcbiAqIFdlIHJlcG9ydCB0aGF0IHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdHlwZWQgYXJyYXlzIGlmIHRoZSBhcmUgbm90IHN1YmNsYXNzYWJsZVxuICogdXNpbmcgX19wcm90b19fLiBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YFxuICogKFNlZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4KS4gSUUgMTAgbGFja3Mgc3VwcG9ydFxuICogZm9yIF9fcHJvdG9fXyBhbmQgaGFzIGEgYnVnZ3kgdHlwZWQgYXJyYXkgaW1wbGVtZW50YXRpb24uXG4gKi9cbkJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUID0gdHlwZWRBcnJheVN1cHBvcnQoKVxuXG5pZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiBjb25zb2xlLmVycm9yID09PSAnZnVuY3Rpb24nKSB7XG4gIGNvbnNvbGUuZXJyb3IoXG4gICAgJ1RoaXMgYnJvd3NlciBsYWNrcyB0eXBlZCBhcnJheSAoVWludDhBcnJheSkgc3VwcG9ydCB3aGljaCBpcyByZXF1aXJlZCBieSAnICtcbiAgICAnYGJ1ZmZlcmAgdjUueC4gVXNlIGBidWZmZXJgIHY0LnggaWYgeW91IHJlcXVpcmUgb2xkIGJyb3dzZXIgc3VwcG9ydC4nXG4gIClcbn1cblxuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICAvLyBDYW4gdHlwZWQgYXJyYXkgaW5zdGFuY2VzIGNhbiBiZSBhdWdtZW50ZWQ/XG4gIHRyeSB7XG4gICAgY29uc3QgYXJyID0gbmV3IFVpbnQ4QXJyYXkoMSlcbiAgICBjb25zdCBwcm90byA9IHsgZm9vOiBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9IH1cbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YocHJvdG8sIFVpbnQ4QXJyYXkucHJvdG90eXBlKVxuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihhcnIsIHByb3RvKVxuICAgIHJldHVybiBhcnIuZm9vKCkgPT09IDQyXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLnByb3RvdHlwZSwgJ3BhcmVudCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGhpcykpIHJldHVybiB1bmRlZmluZWRcbiAgICByZXR1cm4gdGhpcy5idWZmZXJcbiAgfVxufSlcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlci5wcm90b3R5cGUsICdvZmZzZXQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKHRoaXMpKSByZXR1cm4gdW5kZWZpbmVkXG4gICAgcmV0dXJuIHRoaXMuYnl0ZU9mZnNldFxuICB9XG59KVxuXG5mdW5jdGlvbiBjcmVhdGVCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAobGVuZ3RoID4gS19NQVhfTEVOR1RIKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSBcIicgKyBsZW5ndGggKyAnXCIgaXMgaW52YWxpZCBmb3Igb3B0aW9uIFwic2l6ZVwiJylcbiAgfVxuICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZVxuICBjb25zdCBidWYgPSBuZXcgVWludDhBcnJheShsZW5ndGgpXG4gIE9iamVjdC5zZXRQcm90b3R5cGVPZihidWYsIEJ1ZmZlci5wcm90b3R5cGUpXG4gIHJldHVybiBidWZcbn1cblxuLyoqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGhhdmUgdGhlaXJcbiAqIHByb3RvdHlwZSBjaGFuZ2VkIHRvIGBCdWZmZXIucHJvdG90eXBlYC4gRnVydGhlcm1vcmUsIGBCdWZmZXJgIGlzIGEgc3ViY2xhc3Mgb2ZcbiAqIGBVaW50OEFycmF5YCwgc28gdGhlIHJldHVybmVkIGluc3RhbmNlcyB3aWxsIGhhdmUgYWxsIHRoZSBub2RlIGBCdWZmZXJgIG1ldGhvZHNcbiAqIGFuZCB0aGUgYFVpbnQ4QXJyYXlgIG1ldGhvZHMuIFNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0XG4gKiByZXR1cm5zIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIFRoZSBgVWludDhBcnJheWAgcHJvdG90eXBlIHJlbWFpbnMgdW5tb2RpZmllZC5cbiAqL1xuXG5mdW5jdGlvbiBCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIC8vIENvbW1vbiBjYXNlLlxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAnVGhlIFwic3RyaW5nXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4gUmVjZWl2ZWQgdHlwZSBudW1iZXInXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBhbGxvY1Vuc2FmZShhcmcpXG4gIH1cbiAgcmV0dXJuIGZyb20oYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTIgLy8gbm90IHVzZWQgYnkgdGhpcyBpbXBsZW1lbnRhdGlvblxuXG5mdW5jdGlvbiBmcm9tICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZyb21TdHJpbmcodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQpXG4gIH1cblxuICBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KHZhbHVlKSkge1xuICAgIHJldHVybiBmcm9tQXJyYXlWaWV3KHZhbHVlKVxuICB9XG5cbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ1RoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksICcgK1xuICAgICAgJ29yIEFycmF5LWxpa2UgT2JqZWN0LiBSZWNlaXZlZCB0eXBlICcgKyAodHlwZW9mIHZhbHVlKVxuICAgIClcbiAgfVxuXG4gIGlmIChpc0luc3RhbmNlKHZhbHVlLCBBcnJheUJ1ZmZlcikgfHxcbiAgICAgICh2YWx1ZSAmJiBpc0luc3RhbmNlKHZhbHVlLmJ1ZmZlciwgQXJyYXlCdWZmZXIpKSkge1xuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmICh0eXBlb2YgU2hhcmVkQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAoaXNJbnN0YW5jZSh2YWx1ZSwgU2hhcmVkQXJyYXlCdWZmZXIpIHx8XG4gICAgICAodmFsdWUgJiYgaXNJbnN0YW5jZSh2YWx1ZS5idWZmZXIsIFNoYXJlZEFycmF5QnVmZmVyKSkpKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ1RoZSBcInZhbHVlXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgb2YgdHlwZSBudW1iZXIuIFJlY2VpdmVkIHR5cGUgbnVtYmVyJ1xuICAgIClcbiAgfVxuXG4gIGNvbnN0IHZhbHVlT2YgPSB2YWx1ZS52YWx1ZU9mICYmIHZhbHVlLnZhbHVlT2YoKVxuICBpZiAodmFsdWVPZiAhPSBudWxsICYmIHZhbHVlT2YgIT09IHZhbHVlKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHZhbHVlT2YsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGNvbnN0IGIgPSBmcm9tT2JqZWN0KHZhbHVlKVxuICBpZiAoYikgcmV0dXJuIGJcblxuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvUHJpbWl0aXZlICE9IG51bGwgJiZcbiAgICAgIHR5cGVvZiB2YWx1ZVtTeW1ib2wudG9QcmltaXRpdmVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHZhbHVlW1N5bWJvbC50b1ByaW1pdGl2ZV0oJ3N0cmluZycpLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICdUaGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCAnICtcbiAgICAnb3IgQXJyYXktbGlrZSBPYmplY3QuIFJlY2VpdmVkIHR5cGUgJyArICh0eXBlb2YgdmFsdWUpXG4gIClcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsbHkgZXF1aXZhbGVudCB0byBCdWZmZXIoYXJnLCBlbmNvZGluZykgYnV0IHRocm93cyBhIFR5cGVFcnJvclxuICogaWYgdmFsdWUgaXMgYSBudW1iZXIuXG4gKiBCdWZmZXIuZnJvbShzdHJbLCBlbmNvZGluZ10pXG4gKiBCdWZmZXIuZnJvbShhcnJheSlcbiAqIEJ1ZmZlci5mcm9tKGJ1ZmZlcilcbiAqIEJ1ZmZlci5mcm9tKGFycmF5QnVmZmVyWywgYnl0ZU9mZnNldFssIGxlbmd0aF1dKVxuICoqL1xuQnVmZmVyLmZyb20gPSBmdW5jdGlvbiAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gZnJvbSh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG4vLyBOb3RlOiBDaGFuZ2UgcHJvdG90eXBlICphZnRlciogQnVmZmVyLmZyb20gaXMgZGVmaW5lZCB0byB3b3JrYXJvdW5kIENocm9tZSBidWc6XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzE0OFxuT2JqZWN0LnNldFByb3RvdHlwZU9mKEJ1ZmZlci5wcm90b3R5cGUsIFVpbnQ4QXJyYXkucHJvdG90eXBlKVxuT2JqZWN0LnNldFByb3RvdHlwZU9mKEJ1ZmZlciwgVWludDhBcnJheSlcblxuZnVuY3Rpb24gYXNzZXJ0U2l6ZSAoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIG51bWJlcicpXG4gIH0gZWxzZSBpZiAoc2l6ZSA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlIFwiJyArIHNpemUgKyAnXCIgaXMgaW52YWxpZCBmb3Igb3B0aW9uIFwic2l6ZVwiJylcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvYyAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplKVxuICB9XG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHBheSBhdHRlbnRpb24gdG8gZW5jb2RpbmcgaWYgaXQncyBhIHN0cmluZy4gVGhpc1xuICAgIC8vIHByZXZlbnRzIGFjY2lkZW50YWxseSBzZW5kaW5nIGluIGEgbnVtYmVyIHRoYXQgd291bGRcbiAgICAvLyBiZSBpbnRlcnByZXRlZCBhcyBhIHN0YXJ0IG9mZnNldC5cbiAgICByZXR1cm4gdHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJ1xuICAgICAgPyBjcmVhdGVCdWZmZXIoc2l6ZSkuZmlsbChmaWxsLCBlbmNvZGluZylcbiAgICAgIDogY3JlYXRlQnVmZmVyKHNpemUpLmZpbGwoZmlsbClcbiAgfVxuICByZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUpXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBmaWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogYWxsb2Moc2l6ZVssIGZpbGxbLCBlbmNvZGluZ11dKVxuICoqL1xuQnVmZmVyLmFsbG9jID0gZnVuY3Rpb24gKHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIHJldHVybiBhbGxvYyhzaXplLCBmaWxsLCBlbmNvZGluZylcbn1cblxuZnVuY3Rpb24gYWxsb2NVbnNhZmUgKHNpemUpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICByZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUgPCAwID8gMCA6IGNoZWNrZWQoc2l6ZSkgfCAwKVxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gQnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKHNpemUpXG59XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gU2xvd0J1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICovXG5CdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKHNpemUpXG59XG5cbmZ1bmN0aW9uIGZyb21TdHJpbmcgKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycgfHwgZW5jb2RpbmcgPT09ICcnKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgfVxuXG4gIGlmICghQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICB9XG5cbiAgY29uc3QgbGVuZ3RoID0gYnl0ZUxlbmd0aChzdHJpbmcsIGVuY29kaW5nKSB8IDBcbiAgbGV0IGJ1ZiA9IGNyZWF0ZUJ1ZmZlcihsZW5ndGgpXG5cbiAgY29uc3QgYWN0dWFsID0gYnVmLndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG5cbiAgaWYgKGFjdHVhbCAhPT0gbGVuZ3RoKSB7XG4gICAgLy8gV3JpdGluZyBhIGhleCBzdHJpbmcsIGZvciBleGFtcGxlLCB0aGF0IGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycyB3aWxsXG4gICAgLy8gY2F1c2UgZXZlcnl0aGluZyBhZnRlciB0aGUgZmlyc3QgaW52YWxpZCBjaGFyYWN0ZXIgdG8gYmUgaWdub3JlZC4gKGUuZy5cbiAgICAvLyAnYWJ4eGNkJyB3aWxsIGJlIHRyZWF0ZWQgYXMgJ2FiJylcbiAgICBidWYgPSBidWYuc2xpY2UoMCwgYWN0dWFsKVxuICB9XG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlMaWtlIChhcnJheSkge1xuICBjb25zdCBsZW5ndGggPSBhcnJheS5sZW5ndGggPCAwID8gMCA6IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgY29uc3QgYnVmID0gY3JlYXRlQnVmZmVyKGxlbmd0aClcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIGJ1ZltpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlWaWV3IChhcnJheVZpZXcpIHtcbiAgaWYgKGlzSW5zdGFuY2UoYXJyYXlWaWV3LCBVaW50OEFycmF5KSkge1xuICAgIGNvbnN0IGNvcHkgPSBuZXcgVWludDhBcnJheShhcnJheVZpZXcpXG4gICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcihjb3B5LmJ1ZmZlciwgY29weS5ieXRlT2Zmc2V0LCBjb3B5LmJ5dGVMZW5ndGgpXG4gIH1cbiAgcmV0dXJuIGZyb21BcnJheUxpa2UoYXJyYXlWaWV3KVxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlCdWZmZXIgKGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwIHx8IGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0KSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wib2Zmc2V0XCIgaXMgb3V0c2lkZSBvZiBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmIChhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCArIChsZW5ndGggfHwgMCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJsZW5ndGhcIiBpcyBvdXRzaWRlIG9mIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgbGV0IGJ1ZlxuICBpZiAoYnl0ZU9mZnNldCA9PT0gdW5kZWZpbmVkICYmIGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXkpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBidWYgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldClcbiAgfSBlbHNlIHtcbiAgICBidWYgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2VcbiAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGJ1ZiwgQnVmZmVyLnByb3RvdHlwZSlcblxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGZyb21PYmplY3QgKG9iaikge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKG9iaikpIHtcbiAgICBjb25zdCBsZW4gPSBjaGVja2VkKG9iai5sZW5ndGgpIHwgMFxuICAgIGNvbnN0IGJ1ZiA9IGNyZWF0ZUJ1ZmZlcihsZW4pXG5cbiAgICBpZiAoYnVmLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGJ1ZlxuICAgIH1cblxuICAgIG9iai5jb3B5KGJ1ZiwgMCwgMCwgbGVuKVxuICAgIHJldHVybiBidWZcbiAgfVxuXG4gIGlmIChvYmoubGVuZ3RoICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAodHlwZW9mIG9iai5sZW5ndGggIT09ICdudW1iZXInIHx8IG51bWJlcklzTmFOKG9iai5sZW5ndGgpKSB7XG4gICAgICByZXR1cm4gY3JlYXRlQnVmZmVyKDApXG4gICAgfVxuICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKG9iailcbiAgfVxuXG4gIGlmIChvYmoudHlwZSA9PT0gJ0J1ZmZlcicgJiYgQXJyYXkuaXNBcnJheShvYmouZGF0YSkpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5TGlrZShvYmouZGF0YSlcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwgS19NQVhfTEVOR1RIYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IEtfTUFYX0xFTkdUSCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBLX01BWF9MRU5HVEgudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZnVuY3Rpb24gU2xvd0J1ZmZlciAobGVuZ3RoKSB7XG4gIGlmICgrbGVuZ3RoICE9IGxlbmd0aCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGVxZXFlcVxuICAgIGxlbmd0aCA9IDBcbiAgfVxuICByZXR1cm4gQnVmZmVyLmFsbG9jKCtsZW5ndGgpXG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyIChiKSB7XG4gIHJldHVybiBiICE9IG51bGwgJiYgYi5faXNCdWZmZXIgPT09IHRydWUgJiZcbiAgICBiICE9PSBCdWZmZXIucHJvdG90eXBlIC8vIHNvIEJ1ZmZlci5pc0J1ZmZlcihCdWZmZXIucHJvdG90eXBlKSB3aWxsIGJlIGZhbHNlXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoaXNJbnN0YW5jZShhLCBVaW50OEFycmF5KSkgYSA9IEJ1ZmZlci5mcm9tKGEsIGEub2Zmc2V0LCBhLmJ5dGVMZW5ndGgpXG4gIGlmIChpc0luc3RhbmNlKGIsIFVpbnQ4QXJyYXkpKSBiID0gQnVmZmVyLmZyb20oYiwgYi5vZmZzZXQsIGIuYnl0ZUxlbmd0aClcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYSkgfHwgIUJ1ZmZlci5pc0J1ZmZlcihiKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnVGhlIFwiYnVmMVwiLCBcImJ1ZjJcIiBhcmd1bWVudHMgbXVzdCBiZSBvbmUgb2YgdHlwZSBCdWZmZXIgb3IgVWludDhBcnJheSdcbiAgICApXG4gIH1cblxuICBpZiAoYSA9PT0gYikgcmV0dXJuIDBcblxuICBsZXQgeCA9IGEubGVuZ3RoXG4gIGxldCB5ID0gYi5sZW5ndGhcblxuICBmb3IgKGxldCBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICB4ID0gYVtpXVxuICAgICAgeSA9IGJbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIGlzRW5jb2RpbmcgKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gY29uY2F0IChsaXN0LCBsZW5ndGgpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGxpc3QpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBCdWZmZXIuYWxsb2MoMClcbiAgfVxuXG4gIGxldCBpXG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGxlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgICAgbGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbmd0aClcbiAgbGV0IHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICBsZXQgYnVmID0gbGlzdFtpXVxuICAgIGlmIChpc0luc3RhbmNlKGJ1ZiwgVWludDhBcnJheSkpIHtcbiAgICAgIGlmIChwb3MgKyBidWYubGVuZ3RoID4gYnVmZmVyLmxlbmd0aCkge1xuICAgICAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSBidWYgPSBCdWZmZXIuZnJvbShidWYpXG4gICAgICAgIGJ1Zi5jb3B5KGJ1ZmZlciwgcG9zKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICAgICAgYnVmZmVyLFxuICAgICAgICAgIGJ1ZixcbiAgICAgICAgICBwb3NcbiAgICAgICAgKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH0gZWxzZSB7XG4gICAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICB9XG4gICAgcG9zICs9IGJ1Zi5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmZmVyXG59XG5cbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdHJpbmcpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5sZW5ndGhcbiAgfVxuICBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KHN0cmluZykgfHwgaXNJbnN0YW5jZShzdHJpbmcsIEFycmF5QnVmZmVyKSkge1xuICAgIHJldHVybiBzdHJpbmcuYnl0ZUxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnVGhlIFwic3RyaW5nXCIgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBzdHJpbmcsIEJ1ZmZlciwgb3IgQXJyYXlCdWZmZXIuICcgK1xuICAgICAgJ1JlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBzdHJpbmdcbiAgICApXG4gIH1cblxuICBjb25zdCBsZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGNvbnN0IG11c3RNYXRjaCA9IChhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gPT09IHRydWUpXG4gIGlmICghbXVzdE1hdGNoICYmIGxlbiA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBVc2UgYSBmb3IgbG9vcCB0byBhdm9pZCByZWN1cnNpb25cbiAgbGV0IGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGVuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gbGVuICogMlxuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGxlbiA+Pj4gMVxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkge1xuICAgICAgICAgIHJldHVybiBtdXN0TWF0Y2ggPyAtMSA6IHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoIC8vIGFzc3VtZSB1dGY4XG4gICAgICAgIH1cbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuXG5mdW5jdGlvbiBzbG93VG9TdHJpbmcgKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIGxldCBsb3dlcmVkQ2FzZSA9IGZhbHNlXG5cbiAgLy8gTm8gbmVlZCB0byB2ZXJpZnkgdGhhdCBcInRoaXMubGVuZ3RoIDw9IE1BWF9VSU5UMzJcIiBzaW5jZSBpdCdzIGEgcmVhZC1vbmx5XG4gIC8vIHByb3BlcnR5IG9mIGEgdHlwZWQgYXJyYXkuXG5cbiAgLy8gVGhpcyBiZWhhdmVzIG5laXRoZXIgbGlrZSBTdHJpbmcgbm9yIFVpbnQ4QXJyYXkgaW4gdGhhdCB3ZSBzZXQgc3RhcnQvZW5kXG4gIC8vIHRvIHRoZWlyIHVwcGVyL2xvd2VyIGJvdW5kcyBpZiB0aGUgdmFsdWUgcGFzc2VkIGlzIG91dCBvZiByYW5nZS5cbiAgLy8gdW5kZWZpbmVkIGlzIGhhbmRsZWQgc3BlY2lhbGx5IGFzIHBlciBFQ01BLTI2MiA2dGggRWRpdGlvbixcbiAgLy8gU2VjdGlvbiAxMy4zLjMuNyBSdW50aW1lIFNlbWFudGljczogS2V5ZWRCaW5kaW5nSW5pdGlhbGl6YXRpb24uXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkIHx8IHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIC8vIFJldHVybiBlYXJseSBpZiBzdGFydCA+IHRoaXMubGVuZ3RoLiBEb25lIGhlcmUgdG8gcHJldmVudCBwb3RlbnRpYWwgdWludDMyXG4gIC8vIGNvZXJjaW9uIGZhaWwgYmVsb3cuXG4gIGlmIChzdGFydCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVuZCA8PSAwKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICAvLyBGb3JjZSBjb2VyY2lvbiB0byB1aW50MzIuIFRoaXMgd2lsbCBhbHNvIGNvZXJjZSBmYWxzZXkvTmFOIHZhbHVlcyB0byAwLlxuICBlbmQgPj4+PSAwXG4gIHN0YXJ0ID4+Pj0gMFxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdXRmMTZsZVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9IChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG4vLyBUaGlzIHByb3BlcnR5IGlzIHVzZWQgYnkgYEJ1ZmZlci5pc0J1ZmZlcmAgKGFuZCB0aGUgYGlzLWJ1ZmZlcmAgbnBtIHBhY2thZ2UpXG4vLyB0byBkZXRlY3QgYSBCdWZmZXIgaW5zdGFuY2UuIEl0J3Mgbm90IHBvc3NpYmxlIHRvIHVzZSBgaW5zdGFuY2VvZiBCdWZmZXJgXG4vLyByZWxpYWJseSBpbiBhIGJyb3dzZXJpZnkgY29udGV4dCBiZWNhdXNlIHRoZXJlIGNvdWxkIGJlIG11bHRpcGxlIGRpZmZlcmVudFxuLy8gY29waWVzIG9mIHRoZSAnYnVmZmVyJyBwYWNrYWdlIGluIHVzZS4gVGhpcyBtZXRob2Qgd29ya3MgZXZlbiBmb3IgQnVmZmVyXG4vLyBpbnN0YW5jZXMgdGhhdCB3ZXJlIGNyZWF0ZWQgZnJvbSBhbm90aGVyIGNvcHkgb2YgdGhlIGBidWZmZXJgIHBhY2thZ2UuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL2lzc3Vlcy8xNTRcbkJ1ZmZlci5wcm90b3R5cGUuX2lzQnVmZmVyID0gdHJ1ZVxuXG5mdW5jdGlvbiBzd2FwIChiLCBuLCBtKSB7XG4gIGNvbnN0IGkgPSBiW25dXG4gIGJbbl0gPSBiW21dXG4gIGJbbV0gPSBpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDE2ID0gZnVuY3Rpb24gc3dhcDE2ICgpIHtcbiAgY29uc3QgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDIgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDE2LWJpdHMnKVxuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAxKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDMyID0gZnVuY3Rpb24gc3dhcDMyICgpIHtcbiAgY29uc3QgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDQgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDMyLWJpdHMnKVxuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDQpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAzKVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyAyKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDY0ID0gZnVuY3Rpb24gc3dhcDY0ICgpIHtcbiAgY29uc3QgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDggIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDY0LWJpdHMnKVxuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDgpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyA3KVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyA2KVxuICAgIHN3YXAodGhpcywgaSArIDIsIGkgKyA1KVxuICAgIHN3YXAodGhpcywgaSArIDMsIGkgKyA0KVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiAnJ1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCAwLCBsZW5ndGgpXG4gIHJldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvTG9jYWxlU3RyaW5nID0gQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZ1xuXG5CdWZmZXIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAoYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYikgPT09IDBcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gIGxldCBzdHIgPSAnJ1xuICBjb25zdCBtYXggPSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTXG4gIHN0ciA9IHRoaXMudG9TdHJpbmcoJ2hleCcsIDAsIG1heCkucmVwbGFjZSgvKC57Mn0pL2csICckMSAnKS50cmltKClcbiAgaWYgKHRoaXMubGVuZ3RoID4gbWF4KSBzdHIgKz0gJyAuLi4gJ1xuICByZXR1cm4gJzxCdWZmZXIgJyArIHN0ciArICc+J1xufVxuaWYgKGN1c3RvbUluc3BlY3RTeW1ib2wpIHtcbiAgQnVmZmVyLnByb3RvdHlwZVtjdXN0b21JbnNwZWN0U3ltYm9sXSA9IEJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdFxufVxuXG5CdWZmZXIucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlICh0YXJnZXQsIHN0YXJ0LCBlbmQsIHRoaXNTdGFydCwgdGhpc0VuZCkge1xuICBpZiAoaXNJbnN0YW5jZSh0YXJnZXQsIFVpbnQ4QXJyYXkpKSB7XG4gICAgdGFyZ2V0ID0gQnVmZmVyLmZyb20odGFyZ2V0LCB0YXJnZXQub2Zmc2V0LCB0YXJnZXQuYnl0ZUxlbmd0aClcbiAgfVxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0YXJnZXQpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdUaGUgXCJ0YXJnZXRcIiBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIEJ1ZmZlciBvciBVaW50OEFycmF5LiAnICtcbiAgICAgICdSZWNlaXZlZCB0eXBlICcgKyAodHlwZW9mIHRhcmdldClcbiAgICApXG4gIH1cblxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuZCA9IHRhcmdldCA/IHRhcmdldC5sZW5ndGggOiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1N0YXJ0ID0gMFxuICB9XG4gIGlmICh0aGlzRW5kID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzRW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChzdGFydCA8IDAgfHwgZW5kID4gdGFyZ2V0Lmxlbmd0aCB8fCB0aGlzU3RhcnQgPCAwIHx8IHRoaXNFbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdvdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kICYmIHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kKSB7XG4gICAgcmV0dXJuIC0xXG4gIH1cbiAgaWYgKHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAxXG4gIH1cblxuICBzdGFydCA+Pj49IDBcbiAgZW5kID4+Pj0gMFxuICB0aGlzU3RhcnQgPj4+PSAwXG4gIHRoaXNFbmQgPj4+PSAwXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCkgcmV0dXJuIDBcblxuICBsZXQgeCA9IHRoaXNFbmQgLSB0aGlzU3RhcnRcbiAgbGV0IHkgPSBlbmQgLSBzdGFydFxuICBjb25zdCBsZW4gPSBNYXRoLm1pbih4LCB5KVxuXG4gIGNvbnN0IHRoaXNDb3B5ID0gdGhpcy5zbGljZSh0aGlzU3RhcnQsIHRoaXNFbmQpXG4gIGNvbnN0IHRhcmdldENvcHkgPSB0YXJnZXQuc2xpY2Uoc3RhcnQsIGVuZClcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKHRoaXNDb3B5W2ldICE9PSB0YXJnZXRDb3B5W2ldKSB7XG4gICAgICB4ID0gdGhpc0NvcHlbaV1cbiAgICAgIHkgPSB0YXJnZXRDb3B5W2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuLy8gRmluZHMgZWl0aGVyIHRoZSBmaXJzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPj0gYGJ5dGVPZmZzZXRgLFxuLy8gT1IgdGhlIGxhc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0IDw9IGBieXRlT2Zmc2V0YC5cbi8vXG4vLyBBcmd1bWVudHM6XG4vLyAtIGJ1ZmZlciAtIGEgQnVmZmVyIHRvIHNlYXJjaFxuLy8gLSB2YWwgLSBhIHN0cmluZywgQnVmZmVyLCBvciBudW1iZXJcbi8vIC0gYnl0ZU9mZnNldCAtIGFuIGluZGV4IGludG8gYGJ1ZmZlcmA7IHdpbGwgYmUgY2xhbXBlZCB0byBhbiBpbnQzMlxuLy8gLSBlbmNvZGluZyAtIGFuIG9wdGlvbmFsIGVuY29kaW5nLCByZWxldmFudCBpcyB2YWwgaXMgYSBzdHJpbmdcbi8vIC0gZGlyIC0gdHJ1ZSBmb3IgaW5kZXhPZiwgZmFsc2UgZm9yIGxhc3RJbmRleE9mXG5mdW5jdGlvbiBiaWRpcmVjdGlvbmFsSW5kZXhPZiAoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgLy8gRW1wdHkgYnVmZmVyIG1lYW5zIG5vIG1hdGNoXG4gIGlmIChidWZmZXIubGVuZ3RoID09PSAwKSByZXR1cm4gLTFcblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldFxuICBpZiAodHlwZW9mIGJ5dGVPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBieXRlT2Zmc2V0XG4gICAgYnl0ZU9mZnNldCA9IDBcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0ID4gMHg3ZmZmZmZmZikge1xuICAgIGJ5dGVPZmZzZXQgPSAweDdmZmZmZmZmXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IC0weDgwMDAwMDAwKSB7XG4gICAgYnl0ZU9mZnNldCA9IC0weDgwMDAwMDAwXG4gIH1cbiAgYnl0ZU9mZnNldCA9ICtieXRlT2Zmc2V0IC8vIENvZXJjZSB0byBOdW1iZXIuXG4gIGlmIChudW1iZXJJc05hTihieXRlT2Zmc2V0KSkge1xuICAgIC8vIGJ5dGVPZmZzZXQ6IGl0IGl0J3MgdW5kZWZpbmVkLCBudWxsLCBOYU4sIFwiZm9vXCIsIGV0Yywgc2VhcmNoIHdob2xlIGJ1ZmZlclxuICAgIGJ5dGVPZmZzZXQgPSBkaXIgPyAwIDogKGJ1ZmZlci5sZW5ndGggLSAxKVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXQ6IG5lZ2F0aXZlIG9mZnNldHMgc3RhcnQgZnJvbSB0aGUgZW5kIG9mIHRoZSBidWZmZXJcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwKSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCArIGJ5dGVPZmZzZXRcbiAgaWYgKGJ5dGVPZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkge1xuICAgIGlmIChkaXIpIHJldHVybiAtMVxuICAgIGVsc2UgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggLSAxXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IDApIHtcbiAgICBpZiAoZGlyKSBieXRlT2Zmc2V0ID0gMFxuICAgIGVsc2UgcmV0dXJuIC0xXG4gIH1cblxuICAvLyBOb3JtYWxpemUgdmFsXG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIHZhbCA9IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gIH1cblxuICAvLyBGaW5hbGx5LCBzZWFyY2ggZWl0aGVyIGluZGV4T2YgKGlmIGRpciBpcyB0cnVlKSBvciBsYXN0SW5kZXhPZlxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHZhbCkpIHtcbiAgICAvLyBTcGVjaWFsIGNhc2U6IGxvb2tpbmcgZm9yIGVtcHR5IHN0cmluZy9idWZmZXIgYWx3YXlzIGZhaWxzXG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiAtMVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMHhGRiAvLyBTZWFyY2ggZm9yIGEgYnl0ZSB2YWx1ZSBbMC0yNTVdXG4gICAgaWYgKHR5cGVvZiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAoZGlyKSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIFt2YWxdLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyJylcbn1cblxuZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICBsZXQgaW5kZXhTaXplID0gMVxuICBsZXQgYXJyTGVuZ3RoID0gYXJyLmxlbmd0aFxuICBsZXQgdmFsTGVuZ3RoID0gdmFsLmxlbmd0aFxuXG4gIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoZW5jb2RpbmcgPT09ICd1Y3MyJyB8fCBlbmNvZGluZyA9PT0gJ3Vjcy0yJyB8fFxuICAgICAgICBlbmNvZGluZyA9PT0gJ3V0ZjE2bGUnIHx8IGVuY29kaW5nID09PSAndXRmLTE2bGUnKSB7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA8IDIgfHwgdmFsLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpbmRleFNpemUgPSAyXG4gICAgICBhcnJMZW5ndGggLz0gMlxuICAgICAgdmFsTGVuZ3RoIC89IDJcbiAgICAgIGJ5dGVPZmZzZXQgLz0gMlxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWQgKGJ1ZiwgaSkge1xuICAgIGlmIChpbmRleFNpemUgPT09IDEpIHtcbiAgICAgIHJldHVybiBidWZbaV1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJ1Zi5yZWFkVUludDE2QkUoaSAqIGluZGV4U2l6ZSlcbiAgICB9XG4gIH1cblxuICBsZXQgaVxuICBpZiAoZGlyKSB7XG4gICAgbGV0IGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPCBhcnJMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlYWQoYXJyLCBpKSA9PT0gcmVhZCh2YWwsIGZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4KSkge1xuICAgICAgICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIGZvdW5kSW5kZXggPSBpXG4gICAgICAgIGlmIChpIC0gZm91bmRJbmRleCArIDEgPT09IHZhbExlbmd0aCkgcmV0dXJuIGZvdW5kSW5kZXggKiBpbmRleFNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ICE9PSAtMSkgaSAtPSBpIC0gZm91bmRJbmRleFxuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGJ5dGVPZmZzZXQgKyB2YWxMZW5ndGggPiBhcnJMZW5ndGgpIGJ5dGVPZmZzZXQgPSBhcnJMZW5ndGggLSB2YWxMZW5ndGhcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpID49IDA7IGktLSkge1xuICAgICAgbGV0IGZvdW5kID0gdHJ1ZVxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB2YWxMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAocmVhZChhcnIsIGkgKyBqKSAhPT0gcmVhZCh2YWwsIGopKSB7XG4gICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuIGlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiB0aGlzLmluZGV4T2YodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykgIT09IC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIHRydWUpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZmFsc2UpXG59XG5cbmZ1bmN0aW9uIGhleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICBjb25zdCByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgbGV0IGlcbiAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgY29uc3QgcGFyc2VkID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGlmIChudW1iZXJJc05hTihwYXJzZWQpKSByZXR1cm4gaVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHBhcnNlZFxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIHV0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGFzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHVjczJXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZSAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZylcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBvZmZzZXRbLCBsZW5ndGhdWywgZW5jb2RpbmddKVxuICB9IGVsc2UgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgICBpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgbGVuZ3RoID0gbGVuZ3RoID4+PiAwXG4gICAgICBpZiAoZW5jb2RpbmcgPT09IHVuZGVmaW5lZCkgZW5jb2RpbmcgPSAndXRmOCdcbiAgICB9IGVsc2Uge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnQnVmZmVyLndyaXRlKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldFssIGxlbmd0aF0pIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQnXG4gICAgKVxuICB9XG5cbiAgY29uc3QgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IGxlbmd0aCA+IHJlbWFpbmluZykgbGVuZ3RoID0gcmVtYWluaW5nXG5cbiAgaWYgKChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSkgfHwgb2Zmc2V0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byB3cml0ZSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICBsZXQgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIGNvbnN0IHJlcyA9IFtdXG5cbiAgbGV0IGkgPSBzdGFydFxuICB3aGlsZSAoaSA8IGVuZCkge1xuICAgIGNvbnN0IGZpcnN0Qnl0ZSA9IGJ1ZltpXVxuICAgIGxldCBjb2RlUG9pbnQgPSBudWxsXG4gICAgbGV0IGJ5dGVzUGVyU2VxdWVuY2UgPSAoZmlyc3RCeXRlID4gMHhFRilcbiAgICAgID8gNFxuICAgICAgOiAoZmlyc3RCeXRlID4gMHhERilcbiAgICAgICAgICA/IDNcbiAgICAgICAgICA6IChmaXJzdEJ5dGUgPiAweEJGKVxuICAgICAgICAgICAgICA/IDJcbiAgICAgICAgICAgICAgOiAxXG5cbiAgICBpZiAoaSArIGJ5dGVzUGVyU2VxdWVuY2UgPD0gZW5kKSB7XG4gICAgICBsZXQgc2Vjb25kQnl0ZSwgdGhpcmRCeXRlLCBmb3VydGhCeXRlLCB0ZW1wQ29kZVBvaW50XG5cbiAgICAgIHN3aXRjaCAoYnl0ZXNQZXJTZXF1ZW5jZSkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgaWYgKGZpcnN0Qnl0ZSA8IDB4ODApIHtcbiAgICAgICAgICAgIGNvZGVQb2ludCA9IGZpcnN0Qnl0ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweDFGKSA8PCAweDYgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0YpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHhDIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAodGhpcmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3RkYgJiYgKHRlbXBDb2RlUG9pbnQgPCAweEQ4MDAgfHwgdGVtcENvZGVQb2ludCA+IDB4REZGRikpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgZm91cnRoQnl0ZSA9IGJ1ZltpICsgM11cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKGZvdXJ0aEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4MTIgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4QyB8ICh0aGlyZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAoZm91cnRoQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4RkZGRiAmJiB0ZW1wQ29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29kZVBvaW50ID09PSBudWxsKSB7XG4gICAgICAvLyB3ZSBkaWQgbm90IGdlbmVyYXRlIGEgdmFsaWQgY29kZVBvaW50IHNvIGluc2VydCBhXG4gICAgICAvLyByZXBsYWNlbWVudCBjaGFyIChVK0ZGRkQpIGFuZCBhZHZhbmNlIG9ubHkgMSBieXRlXG4gICAgICBjb2RlUG9pbnQgPSAweEZGRkRcbiAgICAgIGJ5dGVzUGVyU2VxdWVuY2UgPSAxXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPiAweEZGRkYpIHtcbiAgICAgIC8vIGVuY29kZSB0byB1dGYxNiAoc3Vycm9nYXRlIHBhaXIgZGFuY2UpXG4gICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMFxuICAgICAgcmVzLnB1c2goY29kZVBvaW50ID4+PiAxMCAmIDB4M0ZGIHwgMHhEODAwKVxuICAgICAgY29kZVBvaW50ID0gMHhEQzAwIHwgY29kZVBvaW50ICYgMHgzRkZcbiAgICB9XG5cbiAgICByZXMucHVzaChjb2RlUG9pbnQpXG4gICAgaSArPSBieXRlc1BlclNlcXVlbmNlXG4gIH1cblxuICByZXR1cm4gZGVjb2RlQ29kZVBvaW50c0FycmF5KHJlcylcbn1cblxuLy8gQmFzZWQgb24gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjI3NDcyNzIvNjgwNzQyLCB0aGUgYnJvd3NlciB3aXRoXG4vLyB0aGUgbG93ZXN0IGxpbWl0IGlzIENocm9tZSwgd2l0aCAweDEwMDAwIGFyZ3MuXG4vLyBXZSBnbyAxIG1hZ25pdHVkZSBsZXNzLCBmb3Igc2FmZXR5XG5jb25zdCBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgY29uc3QgbGVuID0gY29kZVBvaW50cy5sZW5ndGhcbiAgaWYgKGxlbiA8PSBNQVhfQVJHVU1FTlRTX0xFTkdUSCkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY29kZVBvaW50cykgLy8gYXZvaWQgZXh0cmEgc2xpY2UoKVxuICB9XG5cbiAgLy8gRGVjb2RlIGluIGNodW5rcyB0byBhdm9pZCBcImNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZFwiLlxuICBsZXQgcmVzID0gJydcbiAgbGV0IGkgPSAwXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXG4gICAgICBTdHJpbmcsXG4gICAgICBjb2RlUG9pbnRzLnNsaWNlKGksIGkgKz0gTUFYX0FSR1VNRU5UU19MRU5HVEgpXG4gICAgKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGxldCByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0gJiAweDdGKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gbGF0aW4xU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBsZXQgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBjb25zdCBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgbGV0IG91dCA9ICcnXG4gIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgb3V0ICs9IGhleFNsaWNlTG9va3VwVGFibGVbYnVmW2ldXVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgY29uc3QgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgbGV0IHJlcyA9ICcnXG4gIC8vIElmIGJ5dGVzLmxlbmd0aCBpcyBvZGQsIHRoZSBsYXN0IDggYml0cyBtdXN0IGJlIGlnbm9yZWQgKHNhbWUgYXMgbm9kZS5qcylcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGggLSAxOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIChieXRlc1tpICsgMV0gKiAyNTYpKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIHNsaWNlIChzdGFydCwgZW5kKSB7XG4gIGNvbnN0IGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gfn5zdGFydFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IH5+ZW5kXG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ICs9IGxlblxuICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICB9IGVsc2UgaWYgKHN0YXJ0ID4gbGVuKSB7XG4gICAgc3RhcnQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlblxuICAgIGlmIChlbmQgPCAwKSBlbmQgPSAwXG4gIH0gZWxzZSBpZiAoZW5kID4gbGVuKSB7XG4gICAgZW5kID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgY29uc3QgbmV3QnVmID0gdGhpcy5zdWJhcnJheShzdGFydCwgZW5kKVxuICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZVxuICBPYmplY3Quc2V0UHJvdG90eXBlT2YobmV3QnVmLCBCdWZmZXIucHJvdG90eXBlKVxuXG4gIHJldHVybiBuZXdCdWZcbn1cblxuLypcbiAqIE5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgYnVmZmVyIGlzbid0IHRyeWluZyB0byB3cml0ZSBvdXQgb2YgYm91bmRzLlxuICovXG5mdW5jdGlvbiBjaGVja09mZnNldCAob2Zmc2V0LCBleHQsIGxlbmd0aCkge1xuICBpZiAoKG9mZnNldCAlIDEpICE9PSAwIHx8IG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdvZmZzZXQgaXMgbm90IHVpbnQnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gbGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVpbnRMRSA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50TEUgPSBmdW5jdGlvbiByZWFkVUludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIGxldCB2YWwgPSB0aGlzW29mZnNldF1cbiAgbGV0IG11bCA9IDFcbiAgbGV0IGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVWludEJFID1cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRSA9IGZ1bmN0aW9uIHJlYWRVSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuICB9XG5cbiAgbGV0IHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXVxuICBsZXQgbXVsID0gMVxuICB3aGlsZSAoYnl0ZUxlbmd0aCA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVpbnQ4ID1cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gcmVhZFVJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVpbnQxNkxFID1cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVWludDE2QkUgPVxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiByZWFkVUludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDgpIHwgdGhpc1tvZmZzZXQgKyAxXVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVaW50MzJMRSA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKCh0aGlzW29mZnNldF0pIHxcbiAgICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSkgK1xuICAgICAgKHRoaXNbb2Zmc2V0ICsgM10gKiAweDEwMDAwMDApXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVpbnQzMkJFID1cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdICogMHgxMDAwMDAwKSArXG4gICAgKCh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgIHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEJpZ1VJbnQ2NExFID0gZGVmaW5lQmlnSW50TWV0aG9kKGZ1bmN0aW9uIHJlYWRCaWdVSW50NjRMRSAob2Zmc2V0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICB2YWxpZGF0ZU51bWJlcihvZmZzZXQsICdvZmZzZXQnKVxuICBjb25zdCBmaXJzdCA9IHRoaXNbb2Zmc2V0XVxuICBjb25zdCBsYXN0ID0gdGhpc1tvZmZzZXQgKyA3XVxuICBpZiAoZmlyc3QgPT09IHVuZGVmaW5lZCB8fCBsYXN0ID09PSB1bmRlZmluZWQpIHtcbiAgICBib3VuZHNFcnJvcihvZmZzZXQsIHRoaXMubGVuZ3RoIC0gOClcbiAgfVxuXG4gIGNvbnN0IGxvID0gZmlyc3QgK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiA4ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMTYgK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiAyNFxuXG4gIGNvbnN0IGhpID0gdGhpc1srK29mZnNldF0gK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiA4ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMTYgK1xuICAgIGxhc3QgKiAyICoqIDI0XG5cbiAgcmV0dXJuIEJpZ0ludChsbykgKyAoQmlnSW50KGhpKSA8PCBCaWdJbnQoMzIpKVxufSlcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkQmlnVUludDY0QkUgPSBkZWZpbmVCaWdJbnRNZXRob2QoZnVuY3Rpb24gcmVhZEJpZ1VJbnQ2NEJFIChvZmZzZXQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIHZhbGlkYXRlTnVtYmVyKG9mZnNldCwgJ29mZnNldCcpXG4gIGNvbnN0IGZpcnN0ID0gdGhpc1tvZmZzZXRdXG4gIGNvbnN0IGxhc3QgPSB0aGlzW29mZnNldCArIDddXG4gIGlmIChmaXJzdCA9PT0gdW5kZWZpbmVkIHx8IGxhc3QgPT09IHVuZGVmaW5lZCkge1xuICAgIGJvdW5kc0Vycm9yKG9mZnNldCwgdGhpcy5sZW5ndGggLSA4KVxuICB9XG5cbiAgY29uc3QgaGkgPSBmaXJzdCAqIDIgKiogMjQgK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiAxNiArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDggK1xuICAgIHRoaXNbKytvZmZzZXRdXG5cbiAgY29uc3QgbG8gPSB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMjQgK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiAxNiArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDggK1xuICAgIGxhc3RcblxuICByZXR1cm4gKEJpZ0ludChoaSkgPDwgQmlnSW50KDMyKSkgKyBCaWdJbnQobG8pXG59KVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRMRSA9IGZ1bmN0aW9uIHJlYWRJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICBsZXQgdmFsID0gdGhpc1tvZmZzZXRdXG4gIGxldCBtdWwgPSAxXG4gIGxldCBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50QkUgPSBmdW5jdGlvbiByZWFkSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgbGV0IGkgPSBieXRlTGVuZ3RoXG4gIGxldCBtdWwgPSAxXG4gIGxldCB2YWwgPSB0aGlzW29mZnNldCArIC0taV1cbiAgd2hpbGUgKGkgPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1pXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiByZWFkSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgaWYgKCEodGhpc1tvZmZzZXRdICYgMHg4MCkpIHJldHVybiAodGhpc1tvZmZzZXRdKVxuICByZXR1cm4gKCgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICBjb25zdCB2YWwgPSB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiByZWFkSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgY29uc3QgdmFsID0gdGhpc1tvZmZzZXQgKyAxXSB8ICh0aGlzW29mZnNldF0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gcmVhZEludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEJpZ0ludDY0TEUgPSBkZWZpbmVCaWdJbnRNZXRob2QoZnVuY3Rpb24gcmVhZEJpZ0ludDY0TEUgKG9mZnNldCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgdmFsaWRhdGVOdW1iZXIob2Zmc2V0LCAnb2Zmc2V0JylcbiAgY29uc3QgZmlyc3QgPSB0aGlzW29mZnNldF1cbiAgY29uc3QgbGFzdCA9IHRoaXNbb2Zmc2V0ICsgN11cbiAgaWYgKGZpcnN0ID09PSB1bmRlZmluZWQgfHwgbGFzdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYm91bmRzRXJyb3Iob2Zmc2V0LCB0aGlzLmxlbmd0aCAtIDgpXG4gIH1cblxuICBjb25zdCB2YWwgPSB0aGlzW29mZnNldCArIDRdICtcbiAgICB0aGlzW29mZnNldCArIDVdICogMiAqKiA4ICtcbiAgICB0aGlzW29mZnNldCArIDZdICogMiAqKiAxNiArXG4gICAgKGxhc3QgPDwgMjQpIC8vIE92ZXJmbG93XG5cbiAgcmV0dXJuIChCaWdJbnQodmFsKSA8PCBCaWdJbnQoMzIpKSArXG4gICAgQmlnSW50KGZpcnN0ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogOCArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDE2ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMjQpXG59KVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRCaWdJbnQ2NEJFID0gZGVmaW5lQmlnSW50TWV0aG9kKGZ1bmN0aW9uIHJlYWRCaWdJbnQ2NEJFIChvZmZzZXQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIHZhbGlkYXRlTnVtYmVyKG9mZnNldCwgJ29mZnNldCcpXG4gIGNvbnN0IGZpcnN0ID0gdGhpc1tvZmZzZXRdXG4gIGNvbnN0IGxhc3QgPSB0aGlzW29mZnNldCArIDddXG4gIGlmIChmaXJzdCA9PT0gdW5kZWZpbmVkIHx8IGxhc3QgPT09IHVuZGVmaW5lZCkge1xuICAgIGJvdW5kc0Vycm9yKG9mZnNldCwgdGhpcy5sZW5ndGggLSA4KVxuICB9XG5cbiAgY29uc3QgdmFsID0gKGZpcnN0IDw8IDI0KSArIC8vIE92ZXJmbG93XG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDE2ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogOCArXG4gICAgdGhpc1srK29mZnNldF1cblxuICByZXR1cm4gKEJpZ0ludCh2YWwpIDw8IEJpZ0ludCgzMikpICtcbiAgICBCaWdJbnQodGhpc1srK29mZnNldF0gKiAyICoqIDI0ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMTYgK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiA4ICtcbiAgICBsYXN0KVxufSlcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdExFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiByZWFkRmxvYXRCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiByZWFkRG91YmxlTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiByZWFkRG91YmxlQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgNTIsIDgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJidWZmZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVaW50TEUgPVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlVUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNvbnN0IG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgbGV0IG11bCA9IDFcbiAgbGV0IGkgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVpbnRCRSA9XG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludEJFID0gZnVuY3Rpb24gd3JpdGVVSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY29uc3QgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICBsZXQgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIGxldCBtdWwgPSAxXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVWludDggPVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVVSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4ZmYsIDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVaW50MTZMRSA9XG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVWludDE2QkUgPVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVpbnQzMkxFID1cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVaW50MzJCRSA9XG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5mdW5jdGlvbiB3cnRCaWdVSW50NjRMRSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBtaW4sIG1heCkge1xuICBjaGVja0ludEJJKHZhbHVlLCBtaW4sIG1heCwgYnVmLCBvZmZzZXQsIDcpXG5cbiAgbGV0IGxvID0gTnVtYmVyKHZhbHVlICYgQmlnSW50KDB4ZmZmZmZmZmYpKVxuICBidWZbb2Zmc2V0KytdID0gbG9cbiAgbG8gPSBsbyA+PiA4XG4gIGJ1ZltvZmZzZXQrK10gPSBsb1xuICBsbyA9IGxvID4+IDhcbiAgYnVmW29mZnNldCsrXSA9IGxvXG4gIGxvID0gbG8gPj4gOFxuICBidWZbb2Zmc2V0KytdID0gbG9cbiAgbGV0IGhpID0gTnVtYmVyKHZhbHVlID4+IEJpZ0ludCgzMikgJiBCaWdJbnQoMHhmZmZmZmZmZikpXG4gIGJ1ZltvZmZzZXQrK10gPSBoaVxuICBoaSA9IGhpID4+IDhcbiAgYnVmW29mZnNldCsrXSA9IGhpXG4gIGhpID0gaGkgPj4gOFxuICBidWZbb2Zmc2V0KytdID0gaGlcbiAgaGkgPSBoaSA+PiA4XG4gIGJ1ZltvZmZzZXQrK10gPSBoaVxuICByZXR1cm4gb2Zmc2V0XG59XG5cbmZ1bmN0aW9uIHdydEJpZ1VJbnQ2NEJFIChidWYsIHZhbHVlLCBvZmZzZXQsIG1pbiwgbWF4KSB7XG4gIGNoZWNrSW50QkkodmFsdWUsIG1pbiwgbWF4LCBidWYsIG9mZnNldCwgNylcblxuICBsZXQgbG8gPSBOdW1iZXIodmFsdWUgJiBCaWdJbnQoMHhmZmZmZmZmZikpXG4gIGJ1ZltvZmZzZXQgKyA3XSA9IGxvXG4gIGxvID0gbG8gPj4gOFxuICBidWZbb2Zmc2V0ICsgNl0gPSBsb1xuICBsbyA9IGxvID4+IDhcbiAgYnVmW29mZnNldCArIDVdID0gbG9cbiAgbG8gPSBsbyA+PiA4XG4gIGJ1ZltvZmZzZXQgKyA0XSA9IGxvXG4gIGxldCBoaSA9IE51bWJlcih2YWx1ZSA+PiBCaWdJbnQoMzIpICYgQmlnSW50KDB4ZmZmZmZmZmYpKVxuICBidWZbb2Zmc2V0ICsgM10gPSBoaVxuICBoaSA9IGhpID4+IDhcbiAgYnVmW29mZnNldCArIDJdID0gaGlcbiAgaGkgPSBoaSA+PiA4XG4gIGJ1ZltvZmZzZXQgKyAxXSA9IGhpXG4gIGhpID0gaGkgPj4gOFxuICBidWZbb2Zmc2V0XSA9IGhpXG4gIHJldHVybiBvZmZzZXQgKyA4XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVCaWdVSW50NjRMRSA9IGRlZmluZUJpZ0ludE1ldGhvZChmdW5jdGlvbiB3cml0ZUJpZ1VJbnQ2NExFICh2YWx1ZSwgb2Zmc2V0ID0gMCkge1xuICByZXR1cm4gd3J0QmlnVUludDY0TEUodGhpcywgdmFsdWUsIG9mZnNldCwgQmlnSW50KDApLCBCaWdJbnQoJzB4ZmZmZmZmZmZmZmZmZmZmZicpKVxufSlcblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUJpZ1VJbnQ2NEJFID0gZGVmaW5lQmlnSW50TWV0aG9kKGZ1bmN0aW9uIHdyaXRlQmlnVUludDY0QkUgKHZhbHVlLCBvZmZzZXQgPSAwKSB7XG4gIHJldHVybiB3cnRCaWdVSW50NjRCRSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBCaWdJbnQoMCksIEJpZ0ludCgnMHhmZmZmZmZmZmZmZmZmZmZmJykpXG59KVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNvbnN0IGxpbWl0ID0gTWF0aC5wb3coMiwgKDggKiBieXRlTGVuZ3RoKSAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIGxldCBpID0gMFxuICBsZXQgbXVsID0gMVxuICBsZXQgc3ViID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgLSAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50QkUgPSBmdW5jdGlvbiB3cml0ZUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNvbnN0IGxpbWl0ID0gTWF0aC5wb3coMiwgKDggKiBieXRlTGVuZ3RoKSAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIGxldCBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgbGV0IG11bCA9IDFcbiAgbGV0IHN1YiA9IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgKyAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4N2YsIC0weDgwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVCaWdJbnQ2NExFID0gZGVmaW5lQmlnSW50TWV0aG9kKGZ1bmN0aW9uIHdyaXRlQmlnSW50NjRMRSAodmFsdWUsIG9mZnNldCA9IDApIHtcbiAgcmV0dXJuIHdydEJpZ1VJbnQ2NExFKHRoaXMsIHZhbHVlLCBvZmZzZXQsIC1CaWdJbnQoJzB4ODAwMDAwMDAwMDAwMDAwMCcpLCBCaWdJbnQoJzB4N2ZmZmZmZmZmZmZmZmZmZicpKVxufSlcblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUJpZ0ludDY0QkUgPSBkZWZpbmVCaWdJbnRNZXRob2QoZnVuY3Rpb24gd3JpdGVCaWdJbnQ2NEJFICh2YWx1ZSwgb2Zmc2V0ID0gMCkge1xuICByZXR1cm4gd3J0QmlnVUludDY0QkUodGhpcywgdmFsdWUsIG9mZnNldCwgLUJpZ0ludCgnMHg4MDAwMDAwMDAwMDAwMDAwJyksIEJpZ0ludCgnMHg3ZmZmZmZmZmZmZmZmZmZmJykpXG59KVxuXG5mdW5jdGlvbiBjaGVja0lFRUU3NTQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuZnVuY3Rpb24gd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgNCwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gd3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDgsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG4gIHJldHVybiBvZmZzZXQgKyA4XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weSAodGFyZ2V0LCB0YXJnZXRTdGFydCwgc3RhcnQsIGVuZCkge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0YXJnZXQpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcmd1bWVudCBzaG91bGQgYmUgYSBCdWZmZXInKVxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0U3RhcnQgPj0gdGFyZ2V0Lmxlbmd0aCkgdGFyZ2V0U3RhcnQgPSB0YXJnZXQubGVuZ3RoXG4gIGlmICghdGFyZ2V0U3RhcnQpIHRhcmdldFN0YXJ0ID0gMFxuICBpZiAoZW5kID4gMCAmJiBlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVybiAwXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgaWYgKHRhcmdldFN0YXJ0IDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgfVxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbiAgaWYgKGVuZCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgKyBzdGFydFxuICB9XG5cbiAgY29uc3QgbGVuID0gZW5kIC0gc3RhcnRcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0ICYmIHR5cGVvZiBVaW50OEFycmF5LnByb3RvdHlwZS5jb3B5V2l0aGluID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gVXNlIGJ1aWx0LWluIHdoZW4gYXZhaWxhYmxlLCBtaXNzaW5nIGZyb20gSUUxMVxuICAgIHRoaXMuY29weVdpdGhpbih0YXJnZXRTdGFydCwgc3RhcnQsIGVuZClcbiAgfSBlbHNlIHtcbiAgICBVaW50OEFycmF5LnByb3RvdHlwZS5zZXQuY2FsbChcbiAgICAgIHRhcmdldCxcbiAgICAgIHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCBjb2RlID0gdmFsLmNoYXJDb2RlQXQoMClcbiAgICAgIGlmICgoZW5jb2RpbmcgPT09ICd1dGY4JyAmJiBjb2RlIDwgMTI4KSB8fFxuICAgICAgICAgIGVuY29kaW5nID09PSAnbGF0aW4xJykge1xuICAgICAgICAvLyBGYXN0IHBhdGg6IElmIGB2YWxgIGZpdHMgaW50byBhIHNpbmdsZSBieXRlLCB1c2UgdGhhdCBudW1lcmljIHZhbHVlLlxuICAgICAgICB2YWwgPSBjb2RlXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMjU1XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgdmFsID0gTnVtYmVyKHZhbClcbiAgfVxuXG4gIC8vIEludmFsaWQgcmFuZ2VzIGFyZSBub3Qgc2V0IHRvIGEgZGVmYXVsdCwgc28gY2FuIHJhbmdlIGNoZWNrIGVhcmx5LlxuICBpZiAoc3RhcnQgPCAwIHx8IHRoaXMubGVuZ3RoIDwgc3RhcnQgfHwgdGhpcy5sZW5ndGggPCBlbmQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignT3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgc3RhcnQgPSBzdGFydCA+Pj4gMFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IHRoaXMubGVuZ3RoIDogZW5kID4+PiAwXG5cbiAgaWYgKCF2YWwpIHZhbCA9IDBcblxuICBsZXQgaVxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgICB0aGlzW2ldID0gdmFsXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGJ5dGVzID0gQnVmZmVyLmlzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gICAgY29uc3QgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIHZhbHVlIFwiJyArIHZhbCArXG4gICAgICAgICdcIiBpcyBpbnZhbGlkIGZvciBhcmd1bWVudCBcInZhbHVlXCInKVxuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5kIC0gc3RhcnQ7ICsraSkge1xuICAgICAgdGhpc1tpICsgc3RhcnRdID0gYnl0ZXNbaSAlIGxlbl1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBDVVNUT00gRVJST1JTXG4vLyA9PT09PT09PT09PT09XG5cbi8vIFNpbXBsaWZpZWQgdmVyc2lvbnMgZnJvbSBOb2RlLCBjaGFuZ2VkIGZvciBCdWZmZXItb25seSB1c2FnZVxuY29uc3QgZXJyb3JzID0ge31cbmZ1bmN0aW9uIEUgKHN5bSwgZ2V0TWVzc2FnZSwgQmFzZSkge1xuICBlcnJvcnNbc3ltXSA9IGNsYXNzIE5vZGVFcnJvciBleHRlbmRzIEJhc2Uge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgIHN1cGVyKClcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdtZXNzYWdlJywge1xuICAgICAgICB2YWx1ZTogZ2V0TWVzc2FnZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KVxuXG4gICAgICAvLyBBZGQgdGhlIGVycm9yIGNvZGUgdG8gdGhlIG5hbWUgdG8gaW5jbHVkZSBpdCBpbiB0aGUgc3RhY2sgdHJhY2UuXG4gICAgICB0aGlzLm5hbWUgPSBgJHt0aGlzLm5hbWV9IFske3N5bX1dYFxuICAgICAgLy8gQWNjZXNzIHRoZSBzdGFjayB0byBnZW5lcmF0ZSB0aGUgZXJyb3IgbWVzc2FnZSBpbmNsdWRpbmcgdGhlIGVycm9yIGNvZGVcbiAgICAgIC8vIGZyb20gdGhlIG5hbWUuXG4gICAgICB0aGlzLnN0YWNrIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG4gICAgICAvLyBSZXNldCB0aGUgbmFtZSB0byB0aGUgYWN0dWFsIG5hbWUuXG4gICAgICBkZWxldGUgdGhpcy5uYW1lXG4gICAgfVxuXG4gICAgZ2V0IGNvZGUgKCkge1xuICAgICAgcmV0dXJuIHN5bVxuICAgIH1cblxuICAgIHNldCBjb2RlICh2YWx1ZSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdjb2RlJywge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0b1N0cmluZyAoKSB7XG4gICAgICByZXR1cm4gYCR7dGhpcy5uYW1lfSBbJHtzeW19XTogJHt0aGlzLm1lc3NhZ2V9YFxuICAgIH1cbiAgfVxufVxuXG5FKCdFUlJfQlVGRkVSX09VVF9PRl9CT1VORFMnLFxuICBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChuYW1lKSB7XG4gICAgICByZXR1cm4gYCR7bmFtZX0gaXMgb3V0c2lkZSBvZiBidWZmZXIgYm91bmRzYFxuICAgIH1cblxuICAgIHJldHVybiAnQXR0ZW1wdCB0byBhY2Nlc3MgbWVtb3J5IG91dHNpZGUgYnVmZmVyIGJvdW5kcydcbiAgfSwgUmFuZ2VFcnJvcilcbkUoJ0VSUl9JTlZBTElEX0FSR19UWVBFJyxcbiAgZnVuY3Rpb24gKG5hbWUsIGFjdHVhbCkge1xuICAgIHJldHVybiBgVGhlIFwiJHtuYW1lfVwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBudW1iZXIuIFJlY2VpdmVkIHR5cGUgJHt0eXBlb2YgYWN0dWFsfWBcbiAgfSwgVHlwZUVycm9yKVxuRSgnRVJSX09VVF9PRl9SQU5HRScsXG4gIGZ1bmN0aW9uIChzdHIsIHJhbmdlLCBpbnB1dCkge1xuICAgIGxldCBtc2cgPSBgVGhlIHZhbHVlIG9mIFwiJHtzdHJ9XCIgaXMgb3V0IG9mIHJhbmdlLmBcbiAgICBsZXQgcmVjZWl2ZWQgPSBpbnB1dFxuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGlucHV0KSAmJiBNYXRoLmFicyhpbnB1dCkgPiAyICoqIDMyKSB7XG4gICAgICByZWNlaXZlZCA9IGFkZE51bWVyaWNhbFNlcGFyYXRvcihTdHJpbmcoaW5wdXQpKVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnYmlnaW50Jykge1xuICAgICAgcmVjZWl2ZWQgPSBTdHJpbmcoaW5wdXQpXG4gICAgICBpZiAoaW5wdXQgPiBCaWdJbnQoMikgKiogQmlnSW50KDMyKSB8fCBpbnB1dCA8IC0oQmlnSW50KDIpICoqIEJpZ0ludCgzMikpKSB7XG4gICAgICAgIHJlY2VpdmVkID0gYWRkTnVtZXJpY2FsU2VwYXJhdG9yKHJlY2VpdmVkKVxuICAgICAgfVxuICAgICAgcmVjZWl2ZWQgKz0gJ24nXG4gICAgfVxuICAgIG1zZyArPSBgIEl0IG11c3QgYmUgJHtyYW5nZX0uIFJlY2VpdmVkICR7cmVjZWl2ZWR9YFxuICAgIHJldHVybiBtc2dcbiAgfSwgUmFuZ2VFcnJvcilcblxuZnVuY3Rpb24gYWRkTnVtZXJpY2FsU2VwYXJhdG9yICh2YWwpIHtcbiAgbGV0IHJlcyA9ICcnXG4gIGxldCBpID0gdmFsLmxlbmd0aFxuICBjb25zdCBzdGFydCA9IHZhbFswXSA9PT0gJy0nID8gMSA6IDBcbiAgZm9yICg7IGkgPj0gc3RhcnQgKyA0OyBpIC09IDMpIHtcbiAgICByZXMgPSBgXyR7dmFsLnNsaWNlKGkgLSAzLCBpKX0ke3Jlc31gXG4gIH1cbiAgcmV0dXJuIGAke3ZhbC5zbGljZSgwLCBpKX0ke3Jlc31gXG59XG5cbi8vIENIRUNLIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIGNoZWNrQm91bmRzIChidWYsIG9mZnNldCwgYnl0ZUxlbmd0aCkge1xuICB2YWxpZGF0ZU51bWJlcihvZmZzZXQsICdvZmZzZXQnKVxuICBpZiAoYnVmW29mZnNldF0gPT09IHVuZGVmaW5lZCB8fCBidWZbb2Zmc2V0ICsgYnl0ZUxlbmd0aF0gPT09IHVuZGVmaW5lZCkge1xuICAgIGJvdW5kc0Vycm9yKG9mZnNldCwgYnVmLmxlbmd0aCAtIChieXRlTGVuZ3RoICsgMSkpXG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tJbnRCSSAodmFsdWUsIG1pbiwgbWF4LCBidWYsIG9mZnNldCwgYnl0ZUxlbmd0aCkge1xuICBpZiAodmFsdWUgPiBtYXggfHwgdmFsdWUgPCBtaW4pIHtcbiAgICBjb25zdCBuID0gdHlwZW9mIG1pbiA9PT0gJ2JpZ2ludCcgPyAnbicgOiAnJ1xuICAgIGxldCByYW5nZVxuICAgIGlmIChieXRlTGVuZ3RoID4gMykge1xuICAgICAgaWYgKG1pbiA9PT0gMCB8fCBtaW4gPT09IEJpZ0ludCgwKSkge1xuICAgICAgICByYW5nZSA9IGA+PSAwJHtufSBhbmQgPCAyJHtufSAqKiAkeyhieXRlTGVuZ3RoICsgMSkgKiA4fSR7bn1gXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByYW5nZSA9IGA+PSAtKDIke259ICoqICR7KGJ5dGVMZW5ndGggKyAxKSAqIDggLSAxfSR7bn0pIGFuZCA8IDIgKiogYCArXG4gICAgICAgICAgICAgICAgYCR7KGJ5dGVMZW5ndGggKyAxKSAqIDggLSAxfSR7bn1gXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJhbmdlID0gYD49ICR7bWlufSR7bn0gYW5kIDw9ICR7bWF4fSR7bn1gXG4gICAgfVxuICAgIHRocm93IG5ldyBlcnJvcnMuRVJSX09VVF9PRl9SQU5HRSgndmFsdWUnLCByYW5nZSwgdmFsdWUpXG4gIH1cbiAgY2hlY2tCb3VuZHMoYnVmLCBvZmZzZXQsIGJ5dGVMZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlTnVtYmVyICh2YWx1ZSwgbmFtZSkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBlcnJvcnMuRVJSX0lOVkFMSURfQVJHX1RZUEUobmFtZSwgJ251bWJlcicsIHZhbHVlKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJvdW5kc0Vycm9yICh2YWx1ZSwgbGVuZ3RoLCB0eXBlKSB7XG4gIGlmIChNYXRoLmZsb29yKHZhbHVlKSAhPT0gdmFsdWUpIHtcbiAgICB2YWxpZGF0ZU51bWJlcih2YWx1ZSwgdHlwZSlcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkVSUl9PVVRfT0ZfUkFOR0UodHlwZSB8fCAnb2Zmc2V0JywgJ2FuIGludGVnZXInLCB2YWx1ZSlcbiAgfVxuXG4gIGlmIChsZW5ndGggPCAwKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5FUlJfQlVGRkVSX09VVF9PRl9CT1VORFMoKVxuICB9XG5cbiAgdGhyb3cgbmV3IGVycm9ycy5FUlJfT1VUX09GX1JBTkdFKHR5cGUgfHwgJ29mZnNldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgPj0gJHt0eXBlID8gMSA6IDB9IGFuZCA8PSAke2xlbmd0aH1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUpXG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxuY29uc3QgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rLzAtOUEtWmEtei1fXS9nXG5cbmZ1bmN0aW9uIGJhc2U2NGNsZWFuIChzdHIpIHtcbiAgLy8gTm9kZSB0YWtlcyBlcXVhbCBzaWducyBhcyBlbmQgb2YgdGhlIEJhc2U2NCBlbmNvZGluZ1xuICBzdHIgPSBzdHIuc3BsaXQoJz0nKVswXVxuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyLnRyaW0oKS5yZXBsYWNlKElOVkFMSURfQkFTRTY0X1JFLCAnJylcbiAgLy8gTm9kZSBjb252ZXJ0cyBzdHJpbmdzIHdpdGggbGVuZ3RoIDwgMiB0byAnJ1xuICBpZiAoc3RyLmxlbmd0aCA8IDIpIHJldHVybiAnJ1xuICAvLyBOb2RlIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBiYXNlNjQgc3RyaW5ncyAobWlzc2luZyB0cmFpbGluZyA9PT0pLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgd2hpbGUgKHN0ci5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgc3RyID0gc3RyICsgJz0nXG4gIH1cbiAgcmV0dXJuIHN0clxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyaW5nLCB1bml0cykge1xuICB1bml0cyA9IHVuaXRzIHx8IEluZmluaXR5XG4gIGxldCBjb2RlUG9pbnRcbiAgY29uc3QgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aFxuICBsZXQgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcbiAgY29uc3QgYnl0ZXMgPSBbXVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSAobGVhZFN1cnJvZ2F0ZSAtIDB4RDgwMCA8PCAxMCB8IGNvZGVQb2ludCAtIDB4REMwMCkgKyAweDEwMDAwXG4gICAgfSBlbHNlIGlmIChsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAvLyB2YWxpZCBibXAgY2hhciwgYnV0IGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICB9XG5cbiAgICBsZWFkU3Vycm9nYXRlID0gbnVsbFxuXG4gICAgLy8gZW5jb2RlIHV0ZjhcbiAgICBpZiAoY29kZVBvaW50IDwgMHg4MCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAxKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKGNvZGVQb2ludClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4ODAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgfCAweEMwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAzKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDIHwgMHhFMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gNCkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4MTIgfCAweEYwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBieXRlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICBjb25zdCBieXRlQXJyYXkgPSBbXVxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIsIHVuaXRzKSB7XG4gIGxldCBjLCBoaSwgbG9cbiAgY29uc3QgYnl0ZUFycmF5ID0gW11cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcblxuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KGJhc2U2NGNsZWFuKHN0cikpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICBsZXQgaVxuICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuLy8gQXJyYXlCdWZmZXIgb3IgVWludDhBcnJheSBvYmplY3RzIGZyb20gb3RoZXIgY29udGV4dHMgKGkuZS4gaWZyYW1lcykgZG8gbm90IHBhc3Ncbi8vIHRoZSBgaW5zdGFuY2VvZmAgY2hlY2sgYnV0IHRoZXkgc2hvdWxkIGJlIHRyZWF0ZWQgYXMgb2YgdGhhdCB0eXBlLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9pc3N1ZXMvMTY2XG5mdW5jdGlvbiBpc0luc3RhbmNlIChvYmosIHR5cGUpIHtcbiAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIHR5cGUgfHxcbiAgICAob2JqICE9IG51bGwgJiYgb2JqLmNvbnN0cnVjdG9yICE9IG51bGwgJiYgb2JqLmNvbnN0cnVjdG9yLm5hbWUgIT0gbnVsbCAmJlxuICAgICAgb2JqLmNvbnN0cnVjdG9yLm5hbWUgPT09IHR5cGUubmFtZSlcbn1cbmZ1bmN0aW9uIG51bWJlcklzTmFOIChvYmopIHtcbiAgLy8gRm9yIElFMTEgc3VwcG9ydFxuICByZXR1cm4gb2JqICE9PSBvYmogLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zZWxmLWNvbXBhcmVcbn1cblxuLy8gQ3JlYXRlIGxvb2t1cCB0YWJsZSBmb3IgYHRvU3RyaW5nKCdoZXgnKWBcbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvaXNzdWVzLzIxOVxuY29uc3QgaGV4U2xpY2VMb29rdXBUYWJsZSA9IChmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGFscGhhYmV0ID0gJzAxMjM0NTY3ODlhYmNkZWYnXG4gIGNvbnN0IHRhYmxlID0gbmV3IEFycmF5KDI1NilcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgKytpKSB7XG4gICAgY29uc3QgaTE2ID0gaSAqIDE2XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxNjsgKytqKSB7XG4gICAgICB0YWJsZVtpMTYgKyBqXSA9IGFscGhhYmV0W2ldICsgYWxwaGFiZXRbal1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhYmxlXG59KSgpXG5cbi8vIFJldHVybiBub3QgZnVuY3Rpb24gd2l0aCBFcnJvciBpZiBCaWdJbnQgbm90IHN1cHBvcnRlZFxuZnVuY3Rpb24gZGVmaW5lQmlnSW50TWV0aG9kIChmbikge1xuICByZXR1cm4gdHlwZW9mIEJpZ0ludCA9PT0gJ3VuZGVmaW5lZCcgPyBCdWZmZXJCaWdJbnROb3REZWZpbmVkIDogZm5cbn1cblxuZnVuY3Rpb24gQnVmZmVyQmlnSW50Tm90RGVmaW5lZCAoKSB7XG4gIHRocm93IG5ldyBFcnJvcignQmlnSW50IG5vdCBzdXBwb3J0ZWQnKVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3Qge1xuXHRtdWx0aUJ5dGVJbmRleE9mLFxuXHRzdHJpbmdUb0J5dGVzLFxuXHRyZWFkVUludDY0TEUsXG5cdHRhckhlYWRlckNoZWNrc3VtTWF0Y2hlcyxcblx0dWludDhBcnJheVV0ZjhCeXRlU3RyaW5nXG59ID0gcmVxdWlyZSgnLi91dGlsJyk7XG5jb25zdCBzdXBwb3J0ZWQgPSByZXF1aXJlKCcuL3N1cHBvcnRlZCcpO1xuXG5jb25zdCB4cGlaaXBGaWxlbmFtZSA9IHN0cmluZ1RvQnl0ZXMoJ01FVEEtSU5GL21vemlsbGEucnNhJyk7XG5jb25zdCBveG1sQ29udGVudFR5cGVzID0gc3RyaW5nVG9CeXRlcygnW0NvbnRlbnRfVHlwZXNdLnhtbCcpO1xuY29uc3Qgb3htbFJlbHMgPSBzdHJpbmdUb0J5dGVzKCdfcmVscy8ucmVscycpO1xuXG5jb25zdCBmaWxlVHlwZSA9IGlucHV0ID0+IHtcblx0aWYgKCEoaW5wdXQgaW5zdGFuY2VvZiBVaW50OEFycmF5IHx8IGlucHV0IGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgfHwgQnVmZmVyLmlzQnVmZmVyKGlucHV0KSkpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGBFeHBlY3RlZCB0aGUgXFxgaW5wdXRcXGAgYXJndW1lbnQgdG8gYmUgb2YgdHlwZSBcXGBVaW50OEFycmF5XFxgIG9yIFxcYEJ1ZmZlclxcYCBvciBcXGBBcnJheUJ1ZmZlclxcYCwgZ290IFxcYCR7dHlwZW9mIGlucHV0fVxcYGApO1xuXHR9XG5cblx0Y29uc3QgYnVmZmVyID0gaW5wdXQgaW5zdGFuY2VvZiBVaW50OEFycmF5ID8gaW5wdXQgOiBuZXcgVWludDhBcnJheShpbnB1dCk7XG5cblx0aWYgKCEoYnVmZmVyICYmIGJ1ZmZlci5sZW5ndGggPiAxKSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IGNoZWNrID0gKGhlYWRlciwgb3B0aW9ucykgPT4ge1xuXHRcdG9wdGlvbnMgPSB7XG5cdFx0XHRvZmZzZXQ6IDAsXG5cdFx0XHQuLi5vcHRpb25zXG5cdFx0fTtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaGVhZGVyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHQvLyBJZiBhIGJpdG1hc2sgaXMgc2V0XG5cdFx0XHRpZiAob3B0aW9ucy5tYXNrKSB7XG5cdFx0XHRcdC8vIElmIGhlYWRlciBkb2Vzbid0IGVxdWFsIGBidWZgIHdpdGggYml0cyBtYXNrZWQgb2ZmXG5cdFx0XHRcdGlmIChoZWFkZXJbaV0gIT09IChvcHRpb25zLm1hc2tbaV0gJiBidWZmZXJbaSArIG9wdGlvbnMub2Zmc2V0XSkpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoaGVhZGVyW2ldICE9PSBidWZmZXJbaSArIG9wdGlvbnMub2Zmc2V0XSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH07XG5cblx0Y29uc3QgY2hlY2tTdHJpbmcgPSAoaGVhZGVyLCBvcHRpb25zKSA9PiBjaGVjayhzdHJpbmdUb0J5dGVzKGhlYWRlciksIG9wdGlvbnMpO1xuXG5cdGlmIChjaGVjayhbMHhGRiwgMHhEOCwgMHhGRl0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2pwZycsXG5cdFx0XHRtaW1lOiAnaW1hZ2UvanBlZydcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDg5LCAweDUwLCAweDRFLCAweDQ3LCAweDBELCAweDBBLCAweDFBLCAweDBBXSkpIHtcblx0XHQvLyBBUE5HIGZvcm1hdCAoaHR0cHM6Ly93aWtpLm1vemlsbGEub3JnL0FQTkdfU3BlY2lmaWNhdGlvbilcblx0XHQvLyAxLiBGaW5kIHRoZSBmaXJzdCBJREFUIChpbWFnZSBkYXRhKSBjaHVuayAoNDkgNDQgNDEgNTQpXG5cdFx0Ly8gMi4gQ2hlY2sgaWYgdGhlcmUgaXMgYW4gXCJhY1RMXCIgY2h1bmsgYmVmb3JlIHRoZSBJREFUIG9uZSAoNjEgNjMgNTQgNEMpXG5cblx0XHQvLyBPZmZzZXQgY2FsY3VsYXRlZCBhcyBmb2xsb3dzOlxuXHRcdC8vIC0gOCBieXRlczogUE5HIHNpZ25hdHVyZVxuXHRcdC8vIC0gNCAobGVuZ3RoKSArIDQgKGNodW5rIHR5cGUpICsgMTMgKGNodW5rIGRhdGEpICsgNCAoQ1JDKTogSUhEUiBjaHVua1xuXHRcdGNvbnN0IHN0YXJ0SW5kZXggPSAzMztcblx0XHRjb25zdCBmaXJzdEltYWdlRGF0YUNodW5rSW5kZXggPSBidWZmZXIuZmluZEluZGV4KChlbCwgaSkgPT4gaSA+PSBzdGFydEluZGV4ICYmIGJ1ZmZlcltpXSA9PT0gMHg0OSAmJiBidWZmZXJbaSArIDFdID09PSAweDQ0ICYmIGJ1ZmZlcltpICsgMl0gPT09IDB4NDEgJiYgYnVmZmVyW2kgKyAzXSA9PT0gMHg1NCk7XG5cdFx0Y29uc3Qgc2xpY2VkID0gYnVmZmVyLnN1YmFycmF5KHN0YXJ0SW5kZXgsIGZpcnN0SW1hZ2VEYXRhQ2h1bmtJbmRleCk7XG5cblx0XHRpZiAoc2xpY2VkLmZpbmRJbmRleCgoZWwsIGkpID0+IHNsaWNlZFtpXSA9PT0gMHg2MSAmJiBzbGljZWRbaSArIDFdID09PSAweDYzICYmIHNsaWNlZFtpICsgMl0gPT09IDB4NTQgJiYgc2xpY2VkW2kgKyAzXSA9PT0gMHg0QykgPj0gMCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZXh0OiAnYXBuZycsXG5cdFx0XHRcdG1pbWU6ICdpbWFnZS9hcG5nJ1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAncG5nJyxcblx0XHRcdG1pbWU6ICdpbWFnZS9wbmcnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg0NywgMHg0OSwgMHg0Nl0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2dpZicsXG5cdFx0XHRtaW1lOiAnaW1hZ2UvZ2lmJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NTcsIDB4NDUsIDB4NDIsIDB4NTBdLCB7b2Zmc2V0OiA4fSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnd2VicCcsXG5cdFx0XHRtaW1lOiAnaW1hZ2Uvd2VicCdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDQ2LCAweDRDLCAweDQ5LCAweDQ2XSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnZmxpZicsXG5cdFx0XHRtaW1lOiAnaW1hZ2UvZmxpZidcblx0XHR9O1xuXHR9XG5cblx0Ly8gYGNyMmAsIGBvcmZgLCBhbmQgYGFyd2AgbmVlZCB0byBiZSBiZWZvcmUgYHRpZmAgY2hlY2tcblx0aWYgKFxuXHRcdChjaGVjayhbMHg0OSwgMHg0OSwgMHgyQSwgMHgwXSkgfHwgY2hlY2soWzB4NEQsIDB4NEQsIDB4MCwgMHgyQV0pKSAmJlxuXHRcdGNoZWNrKFsweDQzLCAweDUyXSwge29mZnNldDogOH0pXG5cdCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdjcjInLFxuXHRcdFx0bWltZTogJ2ltYWdlL3gtY2Fub24tY3IyJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NDksIDB4NDksIDB4NTIsIDB4NEYsIDB4MDgsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MThdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdvcmYnLFxuXHRcdFx0bWltZTogJ2ltYWdlL3gtb2x5bXB1cy1vcmYnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChcblx0XHRjaGVjayhbMHg0OSwgMHg0OSwgMHgyQSwgMHgwMF0pICYmXG5cdFx0KGNoZWNrKFsweDEwLCAweEZCLCAweDg2LCAweDAxXSwge29mZnNldDogNH0pIHx8IGNoZWNrKFsweDA4LCAweDAwLCAweDAwLCAweDAwXSwge29mZnNldDogNH0pKSAmJlxuXHRcdC8vIFRoaXMgcGF0dGVybiBkaWZmZXJlbnRpYXRlcyBBUlcgZnJvbSBvdGhlciBUSUZGLWlzaCBmaWxlIHR5cGVzOlxuXHRcdGNoZWNrKFsweDAwLCAweEZFLCAweDAwLCAweDA0LCAweDAwLCAweDAxLCAweDAwLCAweDAwLCAweDAwLCAweDAxLCAweDAwLCAweDAwLCAweDAwLCAweDAzLCAweDAxXSwge29mZnNldDogOX0pXG5cdCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdhcncnLFxuXHRcdFx0bWltZTogJ2ltYWdlL3gtc29ueS1hcncnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChcblx0XHRjaGVjayhbMHg0OSwgMHg0OSwgMHgyQSwgMHgwMCwgMHgwOCwgMHgwMCwgMHgwMCwgMHgwMF0pICYmXG5cdFx0KGNoZWNrKFsweDJELCAweDAwLCAweEZFLCAweDAwXSwge29mZnNldDogOH0pIHx8XG5cdFx0Y2hlY2soWzB4MjcsIDB4MDAsIDB4RkUsIDB4MDBdLCB7b2Zmc2V0OiA4fSkpXG5cdCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdkbmcnLFxuXHRcdFx0bWltZTogJ2ltYWdlL3gtYWRvYmUtZG5nJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoXG5cdFx0Y2hlY2soWzB4NDksIDB4NDksIDB4MkEsIDB4MDBdKSAmJlxuXHRcdGNoZWNrKFsweDFDLCAweDAwLCAweEZFLCAweDAwXSwge29mZnNldDogOH0pXG5cdCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICduZWYnLFxuXHRcdFx0bWltZTogJ2ltYWdlL3gtbmlrb24tbmVmJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NDksIDB4NDksIDB4NTUsIDB4MDAsIDB4MTgsIDB4MDAsIDB4MDAsIDB4MDAsIDB4ODgsIDB4RTcsIDB4NzQsIDB4RDhdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdydzInLFxuXHRcdFx0bWltZTogJ2ltYWdlL3gtcGFuYXNvbmljLXJ3Midcblx0XHR9O1xuXHR9XG5cblx0Ly8gYHJhZmAgaXMgaGVyZSBqdXN0IHRvIGtlZXAgYWxsIHRoZSByYXcgaW1hZ2UgZGV0ZWN0b3JzIHRvZ2V0aGVyLlxuXHRpZiAoY2hlY2tTdHJpbmcoJ0ZVSklGSUxNQ0NELVJBVycpKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3JhZicsXG5cdFx0XHRtaW1lOiAnaW1hZ2UveC1mdWppZmlsbS1yYWYnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChcblx0XHRjaGVjayhbMHg0OSwgMHg0OSwgMHgyQSwgMHgwXSkgfHxcblx0XHRjaGVjayhbMHg0RCwgMHg0RCwgMHgwLCAweDJBXSlcblx0KSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3RpZicsXG5cdFx0XHRtaW1lOiAnaW1hZ2UvdGlmZidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDQyLCAweDREXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnYm1wJyxcblx0XHRcdG1pbWU6ICdpbWFnZS9ibXAnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg0OSwgMHg0OSwgMHhCQ10pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2p4cicsXG5cdFx0XHRtaW1lOiAnaW1hZ2Uvdm5kLm1zLXBob3RvJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4MzgsIDB4NDIsIDB4NTAsIDB4NTNdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdwc2QnLFxuXHRcdFx0bWltZTogJ2ltYWdlL3ZuZC5hZG9iZS5waG90b3Nob3AnXG5cdFx0fTtcblx0fVxuXG5cdC8vIFppcC1iYXNlZCBmaWxlIGZvcm1hdHNcblx0Ly8gTmVlZCB0byBiZSBiZWZvcmUgdGhlIGB6aXBgIGNoZWNrXG5cdGNvbnN0IHppcEhlYWRlciA9IFsweDUwLCAweDRCLCAweDMsIDB4NF07XG5cdGlmIChjaGVjayh6aXBIZWFkZXIpKSB7XG5cdFx0aWYgKFxuXHRcdFx0Y2hlY2soWzB4NkQsIDB4NjksIDB4NkQsIDB4NjUsIDB4NzQsIDB4NzksIDB4NzAsIDB4NjUsIDB4NjEsIDB4NzAsIDB4NzAsIDB4NkMsIDB4NjksIDB4NjMsIDB4NjEsIDB4NzQsIDB4NjksIDB4NkYsIDB4NkUsIDB4MkYsIDB4NjUsIDB4NzAsIDB4NzUsIDB4NjIsIDB4MkIsIDB4N0EsIDB4NjksIDB4NzBdLCB7b2Zmc2V0OiAzMH0pXG5cdFx0KSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRleHQ6ICdlcHViJyxcblx0XHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL2VwdWIremlwJ1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHQvLyBBc3N1bWVzIHNpZ25lZCBgLnhwaWAgZnJvbSBhZGRvbnMubW96aWxsYS5vcmdcblx0XHRpZiAoY2hlY2soeHBpWmlwRmlsZW5hbWUsIHtvZmZzZXQ6IDMwfSkpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV4dDogJ3hwaScsXG5cdFx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LXhwaW5zdGFsbCdcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0aWYgKGNoZWNrU3RyaW5nKCdtaW1ldHlwZWFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQudGV4dCcsIHtvZmZzZXQ6IDMwfSkpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV4dDogJ29kdCcsXG5cdFx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnRleHQnXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGlmIChjaGVja1N0cmluZygnbWltZXR5cGVhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnNwcmVhZHNoZWV0Jywge29mZnNldDogMzB9KSkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZXh0OiAnb2RzJyxcblx0XHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuc3ByZWFkc2hlZXQnXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGlmIChjaGVja1N0cmluZygnbWltZXR5cGVhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnByZXNlbnRhdGlvbicsIHtvZmZzZXQ6IDMwfSkpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV4dDogJ29kcCcsXG5cdFx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnByZXNlbnRhdGlvbidcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Ly8gVGhlIGRvY3gsIHhsc3ggYW5kIHBwdHggZmlsZSB0eXBlcyBleHRlbmQgdGhlIE9mZmljZSBPcGVuIFhNTCBmaWxlIGZvcm1hdDpcblx0XHQvLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9PZmZpY2VfT3Blbl9YTUxfZmlsZV9mb3JtYXRzXG5cdFx0Ly8gV2UgbG9vayBmb3I6XG5cdFx0Ly8gLSBvbmUgZW50cnkgbmFtZWQgJ1tDb250ZW50X1R5cGVzXS54bWwnIG9yICdfcmVscy8ucmVscycsXG5cdFx0Ly8gLSBvbmUgZW50cnkgaW5kaWNhdGluZyBzcGVjaWZpYyB0eXBlIG9mIGZpbGUuXG5cdFx0Ly8gTVMgT2ZmaWNlLCBPcGVuT2ZmaWNlIGFuZCBMaWJyZU9mZmljZSBtYXkgcHV0IHRoZSBwYXJ0cyBpbiBkaWZmZXJlbnQgb3JkZXIsIHNvIHRoZSBjaGVjayBzaG91bGQgbm90IHJlbHkgb24gaXQuXG5cdFx0bGV0IHppcEhlYWRlckluZGV4ID0gMDsgLy8gVGhlIGZpcnN0IHppcCBoZWFkZXIgd2FzIGFscmVhZHkgZm91bmQgYXQgaW5kZXggMFxuXHRcdGxldCBveG1sRm91bmQgPSBmYWxzZTtcblx0XHRsZXQgdHlwZTtcblxuXHRcdGRvIHtcblx0XHRcdGNvbnN0IG9mZnNldCA9IHppcEhlYWRlckluZGV4ICsgMzA7XG5cblx0XHRcdGlmICghb3htbEZvdW5kKSB7XG5cdFx0XHRcdG94bWxGb3VuZCA9IChjaGVjayhveG1sQ29udGVudFR5cGVzLCB7b2Zmc2V0fSkgfHwgY2hlY2sob3htbFJlbHMsIHtvZmZzZXR9KSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghdHlwZSkge1xuXHRcdFx0XHRpZiAoY2hlY2tTdHJpbmcoJ3dvcmQvJywge29mZnNldH0pKSB7XG5cdFx0XHRcdFx0dHlwZSA9IHtcblx0XHRcdFx0XHRcdGV4dDogJ2RvY3gnLFxuXHRcdFx0XHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmRvY3VtZW50J1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH0gZWxzZSBpZiAoY2hlY2tTdHJpbmcoJ3BwdC8nLCB7b2Zmc2V0fSkpIHtcblx0XHRcdFx0XHR0eXBlID0ge1xuXHRcdFx0XHRcdFx0ZXh0OiAncHB0eCcsXG5cdFx0XHRcdFx0XHRtaW1lOiAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLnByZXNlbnRhdGlvbidcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9IGVsc2UgaWYgKGNoZWNrU3RyaW5nKCd4bC8nLCB7b2Zmc2V0fSkpIHtcblx0XHRcdFx0XHR0eXBlID0ge1xuXHRcdFx0XHRcdFx0ZXh0OiAneGxzeCcsXG5cdFx0XHRcdFx0XHRtaW1lOiAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwuc2hlZXQnXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAob3htbEZvdW5kICYmIHR5cGUpIHtcblx0XHRcdFx0cmV0dXJuIHR5cGU7XG5cdFx0XHR9XG5cblx0XHRcdHppcEhlYWRlckluZGV4ID0gbXVsdGlCeXRlSW5kZXhPZihidWZmZXIsIHppcEhlYWRlciwgb2Zmc2V0KTtcblx0XHR9IHdoaWxlICh6aXBIZWFkZXJJbmRleCA+PSAwKTtcblxuXHRcdC8vIE5vIG1vcmUgemlwIHBhcnRzIGF2YWlsYWJsZSBpbiB0aGUgYnVmZmVyLCBidXQgbWF5YmUgd2UgYXJlIGFsbW9zdCBjZXJ0YWluIGFib3V0IHRoZSB0eXBlP1xuXHRcdGlmICh0eXBlKSB7XG5cdFx0XHRyZXR1cm4gdHlwZTtcblx0XHR9XG5cdH1cblxuXHRpZiAoXG5cdFx0Y2hlY2soWzB4NTAsIDB4NEJdKSAmJlxuXHRcdChidWZmZXJbMl0gPT09IDB4MyB8fCBidWZmZXJbMl0gPT09IDB4NSB8fCBidWZmZXJbMl0gPT09IDB4NykgJiZcblx0XHQoYnVmZmVyWzNdID09PSAweDQgfHwgYnVmZmVyWzNdID09PSAweDYgfHwgYnVmZmVyWzNdID09PSAweDgpXG5cdCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICd6aXAnLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3ppcCdcblx0XHR9O1xuXHR9XG5cblx0aWYgKFxuXHRcdGNoZWNrKFsweDMwLCAweDMwLCAweDMwLCAweDMwLCAweDMwLCAweDMwXSwge29mZnNldDogMTQ4LCBtYXNrOiBbMHhGOCwgMHhGOCwgMHhGOCwgMHhGOCwgMHhGOCwgMHhGOF19KSAmJiAvLyBWYWxpZCB0YXIgY2hlY2tzdW1cblx0XHR0YXJIZWFkZXJDaGVja3N1bU1hdGNoZXMoYnVmZmVyKVxuXHQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAndGFyJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LXRhcidcblx0XHR9O1xuXHR9XG5cblx0aWYgKFxuXHRcdGNoZWNrKFsweDUyLCAweDYxLCAweDcyLCAweDIxLCAweDFBLCAweDddKSAmJlxuXHRcdChidWZmZXJbNl0gPT09IDB4MCB8fCBidWZmZXJbNl0gPT09IDB4MSlcblx0KSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3JhcicsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC1yYXItY29tcHJlc3NlZCdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDFGLCAweDhCLCAweDhdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdneicsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24vZ3ppcCdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDQyLCAweDVBLCAweDY4XSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnYnoyJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LWJ6aXAyJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4MzcsIDB4N0EsIDB4QkMsIDB4QUYsIDB4MjcsIDB4MUNdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICc3eicsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC03ei1jb21wcmVzc2VkJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NzgsIDB4MDFdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdkbWcnLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3gtYXBwbGUtZGlza2ltYWdlJ1xuXHRcdH07XG5cdH1cblxuXHQvLyBgbW92YCBmb3JtYXQgdmFyaWFudHNcblx0aWYgKFxuXHRcdGNoZWNrKFsweDY2LCAweDcyLCAweDY1LCAweDY1XSwge29mZnNldDogNH0pIHx8IC8vIGBmcmVlYFxuXHRcdGNoZWNrKFsweDZELCAweDY0LCAweDYxLCAweDc0XSwge29mZnNldDogNH0pIHx8IC8vIGBtZGF0YCBNSlBFR1xuXHRcdGNoZWNrKFsweDZELCAweDZGLCAweDZGLCAweDc2XSwge29mZnNldDogNH0pIHx8IC8vIGBtb292YFxuXHRcdGNoZWNrKFsweDc3LCAweDY5LCAweDY0LCAweDY1XSwge29mZnNldDogNH0pIC8vIGB3aWRlYFxuXHQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnbW92Jyxcblx0XHRcdG1pbWU6ICd2aWRlby9xdWlja3RpbWUnXG5cdFx0fTtcblx0fVxuXG5cdC8vIEZpbGUgVHlwZSBCb3ggKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0lTT19iYXNlX21lZGlhX2ZpbGVfZm9ybWF0KVxuXHQvLyBJdCdzIG5vdCByZXF1aXJlZCB0byBiZSBmaXJzdCwgYnV0IGl0J3MgcmVjb21tZW5kZWQgdG8gYmUuIEFsbW9zdCBhbGwgSVNPIGJhc2UgbWVkaWEgZmlsZXMgc3RhcnQgd2l0aCBgZnR5cGAgYm94LlxuXHQvLyBgZnR5cGAgYm94IG11c3QgY29udGFpbiBhIGJyYW5kIG1ham9yIGlkZW50aWZpZXIsIHdoaWNoIG11c3QgY29uc2lzdCBvZiBJU08gODg1OS0xIHByaW50YWJsZSBjaGFyYWN0ZXJzLlxuXHQvLyBIZXJlIHdlIGNoZWNrIGZvciA4ODU5LTEgcHJpbnRhYmxlIGNoYXJhY3RlcnMgKGZvciBzaW1wbGljaXR5LCBpdCdzIGEgbWFzayB3aGljaCBhbHNvIGNhdGNoZXMgb25lIG5vbi1wcmludGFibGUgY2hhcmFjdGVyKS5cblx0aWYgKFxuXHRcdGNoZWNrKFsweDY2LCAweDc0LCAweDc5LCAweDcwXSwge29mZnNldDogNH0pICYmIC8vIGBmdHlwYFxuXHRcdChidWZmZXJbOF0gJiAweDYwKSAhPT0gMHgwMCAmJiAoYnVmZmVyWzldICYgMHg2MCkgIT09IDB4MDAgJiYgKGJ1ZmZlclsxMF0gJiAweDYwKSAhPT0gMHgwMCAmJiAoYnVmZmVyWzExXSAmIDB4NjApICE9PSAweDAwIC8vIEJyYW5kIG1ham9yXG5cdCkge1xuXHRcdC8vIFRoZXkgYWxsIGNhbiBoYXZlIE1JTUUgYHZpZGVvL21wNGAgZXhjZXB0IGBhcHBsaWNhdGlvbi9tcDRgIHNwZWNpYWwtY2FzZSB3aGljaCBpcyBoYXJkIHRvIGRldGVjdC5cblx0XHQvLyBGb3Igc29tZSBjYXNlcywgd2UncmUgc3BlY2lmaWMsIGV2ZXJ5dGhpbmcgZWxzZSBmYWxscyB0byBgdmlkZW8vbXA0YCB3aXRoIGBtcDRgIGV4dGVuc2lvbi5cblx0XHRjb25zdCBicmFuZE1ham9yID0gdWludDhBcnJheVV0ZjhCeXRlU3RyaW5nKGJ1ZmZlciwgOCwgMTIpO1xuXHRcdHN3aXRjaCAoYnJhbmRNYWpvcikge1xuXHRcdFx0Y2FzZSAnbWlmMSc6XG5cdFx0XHRcdHJldHVybiB7ZXh0OiAnaGVpYycsIG1pbWU6ICdpbWFnZS9oZWlmJ307XG5cdFx0XHRjYXNlICdtc2YxJzpcblx0XHRcdFx0cmV0dXJuIHtleHQ6ICdoZWljJywgbWltZTogJ2ltYWdlL2hlaWYtc2VxdWVuY2UnfTtcblx0XHRcdGNhc2UgJ2hlaWMnOiBjYXNlICdoZWl4Jzpcblx0XHRcdFx0cmV0dXJuIHtleHQ6ICdoZWljJywgbWltZTogJ2ltYWdlL2hlaWMnfTtcblx0XHRcdGNhc2UgJ2hldmMnOiBjYXNlICdoZXZ4Jzpcblx0XHRcdFx0cmV0dXJuIHtleHQ6ICdoZWljJywgbWltZTogJ2ltYWdlL2hlaWMtc2VxdWVuY2UnfTtcblx0XHRcdGNhc2UgJ3F0ICAnOlxuXHRcdFx0XHRyZXR1cm4ge2V4dDogJ21vdicsIG1pbWU6ICd2aWRlby9xdWlja3RpbWUnfTtcblx0XHRcdGNhc2UgJ000ViAnOiBjYXNlICdNNFZIJzogY2FzZSAnTTRWUCc6XG5cdFx0XHRcdHJldHVybiB7ZXh0OiAnbTR2JywgbWltZTogJ3ZpZGVvL3gtbTR2J307XG5cdFx0XHRjYXNlICdNNFAgJzpcblx0XHRcdFx0cmV0dXJuIHtleHQ6ICdtNHAnLCBtaW1lOiAndmlkZW8vbXA0J307XG5cdFx0XHRjYXNlICdNNEIgJzpcblx0XHRcdFx0cmV0dXJuIHtleHQ6ICdtNGInLCBtaW1lOiAnYXVkaW8vbXA0J307XG5cdFx0XHRjYXNlICdNNEEgJzpcblx0XHRcdFx0cmV0dXJuIHtleHQ6ICdtNGEnLCBtaW1lOiAnYXVkaW8veC1tNGEnfTtcblx0XHRcdGNhc2UgJ0Y0ViAnOlxuXHRcdFx0XHRyZXR1cm4ge2V4dDogJ2Y0dicsIG1pbWU6ICd2aWRlby9tcDQnfTtcblx0XHRcdGNhc2UgJ0Y0UCAnOlxuXHRcdFx0XHRyZXR1cm4ge2V4dDogJ2Y0cCcsIG1pbWU6ICd2aWRlby9tcDQnfTtcblx0XHRcdGNhc2UgJ0Y0QSAnOlxuXHRcdFx0XHRyZXR1cm4ge2V4dDogJ2Y0YScsIG1pbWU6ICdhdWRpby9tcDQnfTtcblx0XHRcdGNhc2UgJ0Y0QiAnOlxuXHRcdFx0XHRyZXR1cm4ge2V4dDogJ2Y0YicsIG1pbWU6ICdhdWRpby9tcDQnfTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGlmIChicmFuZE1ham9yLnN0YXJ0c1dpdGgoJzNnJykpIHtcblx0XHRcdFx0XHRpZiAoYnJhbmRNYWpvci5zdGFydHNXaXRoKCczZzInKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHtleHQ6ICczZzInLCBtaW1lOiAndmlkZW8vM2dwcDInfTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4ge2V4dDogJzNncCcsIG1pbWU6ICd2aWRlby8zZ3BwJ307XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4ge2V4dDogJ21wNCcsIG1pbWU6ICd2aWRlby9tcDQnfTtcblx0XHR9XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NEQsIDB4NTQsIDB4NjgsIDB4NjRdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdtaWQnLFxuXHRcdFx0bWltZTogJ2F1ZGlvL21pZGknXG5cdFx0fTtcblx0fVxuXG5cdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90aHJlYXRzdGFjay9saWJtYWdpYy9ibG9iL21hc3Rlci9tYWdpYy9NYWdkaXIvbWF0cm9za2Fcblx0aWYgKGNoZWNrKFsweDFBLCAweDQ1LCAweERGLCAweEEzXSkpIHtcblx0XHRjb25zdCBzbGljZWQgPSBidWZmZXIuc3ViYXJyYXkoNCwgNCArIDQwOTYpO1xuXHRcdGNvbnN0IGlkUG9zID0gc2xpY2VkLmZpbmRJbmRleCgoZWwsIGksIGFycikgPT4gYXJyW2ldID09PSAweDQyICYmIGFycltpICsgMV0gPT09IDB4ODIpO1xuXG5cdFx0aWYgKGlkUG9zICE9PSAtMSkge1xuXHRcdFx0Y29uc3QgZG9jVHlwZVBvcyA9IGlkUG9zICsgMztcblx0XHRcdGNvbnN0IGZpbmREb2NUeXBlID0gdHlwZSA9PiBbLi4udHlwZV0uZXZlcnkoKGMsIGkpID0+IHNsaWNlZFtkb2NUeXBlUG9zICsgaV0gPT09IGMuY2hhckNvZGVBdCgwKSk7XG5cblx0XHRcdGlmIChmaW5kRG9jVHlwZSgnbWF0cm9za2EnKSkge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGV4dDogJ21rdicsXG5cdFx0XHRcdFx0bWltZTogJ3ZpZGVvL3gtbWF0cm9za2EnXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdGlmIChmaW5kRG9jVHlwZSgnd2VibScpKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0ZXh0OiAnd2VibScsXG5cdFx0XHRcdFx0bWltZTogJ3ZpZGVvL3dlYm0nXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gUklGRiBmaWxlIGZvcm1hdCB3aGljaCBtaWdodCBiZSBBVkksIFdBViwgUUNQLCBldGNcblx0aWYgKGNoZWNrKFsweDUyLCAweDQ5LCAweDQ2LCAweDQ2XSkpIHtcblx0XHRpZiAoY2hlY2soWzB4NDEsIDB4NTYsIDB4NDldLCB7b2Zmc2V0OiA4fSkpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV4dDogJ2F2aScsXG5cdFx0XHRcdG1pbWU6ICd2aWRlby92bmQuYXZpJ1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAoY2hlY2soWzB4NTcsIDB4NDEsIDB4NTYsIDB4NDVdLCB7b2Zmc2V0OiA4fSkpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV4dDogJ3dhdicsXG5cdFx0XHRcdG1pbWU6ICdhdWRpby92bmQud2F2ZSdcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Ly8gUUxDTSwgUUNQIGZpbGVcblx0XHRpZiAoY2hlY2soWzB4NTEsIDB4NEMsIDB4NDMsIDB4NERdLCB7b2Zmc2V0OiA4fSkpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV4dDogJ3FjcCcsXG5cdFx0XHRcdG1pbWU6ICdhdWRpby9xY2VscCdcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cblx0Ly8gQVNGX0hlYWRlcl9PYmplY3QgZmlyc3QgODAgYnl0ZXNcblx0aWYgKGNoZWNrKFsweDMwLCAweDI2LCAweEIyLCAweDc1LCAweDhFLCAweDY2LCAweENGLCAweDExLCAweEE2LCAweEQ5XSkpIHtcblx0XHQvLyBTZWFyY2ggZm9yIGhlYWRlciBzaG91bGQgYmUgaW4gZmlyc3QgMUtCIG9mIGZpbGUuXG5cblx0XHRsZXQgb2Zmc2V0ID0gMzA7XG5cdFx0ZG8ge1xuXHRcdFx0Y29uc3Qgb2JqZWN0U2l6ZSA9IHJlYWRVSW50NjRMRShidWZmZXIsIG9mZnNldCArIDE2KTtcblx0XHRcdGlmIChjaGVjayhbMHg5MSwgMHgwNywgMHhEQywgMHhCNywgMHhCNywgMHhBOSwgMHhDRiwgMHgxMSwgMHg4RSwgMHhFNiwgMHgwMCwgMHhDMCwgMHgwQywgMHgyMCwgMHg1MywgMHg2NV0sIHtvZmZzZXR9KSkge1xuXHRcdFx0XHQvLyBTeW5jIG9uIFN0cmVhbS1Qcm9wZXJ0aWVzLU9iamVjdCAoQjdEQzA3OTEtQTlCNy0xMUNGLThFRTYtMDBDMDBDMjA1MzY1KVxuXHRcdFx0XHRpZiAoY2hlY2soWzB4NDAsIDB4OUUsIDB4NjksIDB4RjgsIDB4NEQsIDB4NUIsIDB4Q0YsIDB4MTEsIDB4QTgsIDB4RkQsIDB4MDAsIDB4ODAsIDB4NUYsIDB4NUMsIDB4NDQsIDB4MkJdLCB7b2Zmc2V0OiBvZmZzZXQgKyAyNH0pKSB7XG5cdFx0XHRcdFx0Ly8gRm91bmQgYXVkaW86XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdGV4dDogJ3dtYScsXG5cdFx0XHRcdFx0XHRtaW1lOiAnYXVkaW8veC1tcy13bWEnXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjaGVjayhbMHhDMCwgMHhFRiwgMHgxOSwgMHhCQywgMHg0RCwgMHg1QiwgMHhDRiwgMHgxMSwgMHhBOCwgMHhGRCwgMHgwMCwgMHg4MCwgMHg1RiwgMHg1QywgMHg0NCwgMHgyQl0sIHtvZmZzZXQ6IG9mZnNldCArIDI0fSkpIHtcblx0XHRcdFx0XHQvLyBGb3VuZCB2aWRlbzpcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0ZXh0OiAnd212Jyxcblx0XHRcdFx0XHRcdG1pbWU6ICd2aWRlby94LW1zLWFzZidcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdG9mZnNldCArPSBvYmplY3RTaXplO1xuXHRcdH0gd2hpbGUgKG9mZnNldCArIDI0IDw9IGJ1ZmZlci5sZW5ndGgpO1xuXG5cdFx0Ly8gRGVmYXVsdCB0byBBU0YgZ2VuZXJpYyBleHRlbnNpb25cblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnYXNmJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi92bmQubXMtYXNmJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoXG5cdFx0Y2hlY2soWzB4MCwgMHgwLCAweDEsIDB4QkFdKSB8fFxuXHRcdGNoZWNrKFsweDAsIDB4MCwgMHgxLCAweEIzXSlcblx0KSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ21wZycsXG5cdFx0XHRtaW1lOiAndmlkZW8vbXBlZydcblx0XHR9O1xuXHR9XG5cblx0Ly8gQ2hlY2sgZm9yIE1QRUcgaGVhZGVyIGF0IGRpZmZlcmVudCBzdGFydGluZyBvZmZzZXRzXG5cdGZvciAobGV0IHN0YXJ0ID0gMDsgc3RhcnQgPCAyICYmIHN0YXJ0IDwgKGJ1ZmZlci5sZW5ndGggLSAxNik7IHN0YXJ0KyspIHtcblx0XHRpZiAoXG5cdFx0XHRjaGVjayhbMHg0OSwgMHg0NCwgMHgzM10sIHtvZmZzZXQ6IHN0YXJ0fSkgfHwgLy8gSUQzIGhlYWRlclxuXHRcdFx0Y2hlY2soWzB4RkYsIDB4RTJdLCB7b2Zmc2V0OiBzdGFydCwgbWFzazogWzB4RkYsIDB4RTZdfSkgLy8gTVBFRyAxIG9yIDIgTGF5ZXIgMyBoZWFkZXJcblx0XHQpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV4dDogJ21wMycsXG5cdFx0XHRcdG1pbWU6ICdhdWRpby9tcGVnJ1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAoXG5cdFx0XHRjaGVjayhbMHhGRiwgMHhFNF0sIHtvZmZzZXQ6IHN0YXJ0LCBtYXNrOiBbMHhGRiwgMHhFNl19KSAvLyBNUEVHIDEgb3IgMiBMYXllciAyIGhlYWRlclxuXHRcdCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZXh0OiAnbXAyJyxcblx0XHRcdFx0bWltZTogJ2F1ZGlvL21wZWcnXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGlmIChcblx0XHRcdGNoZWNrKFsweEZGLCAweEY4XSwge29mZnNldDogc3RhcnQsIG1hc2s6IFsweEZGLCAweEZDXX0pIC8vIE1QRUcgMiBsYXllciAwIHVzaW5nIEFEVFNcblx0XHQpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV4dDogJ21wMicsXG5cdFx0XHRcdG1pbWU6ICdhdWRpby9tcGVnJ1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAoXG5cdFx0XHRjaGVjayhbMHhGRiwgMHhGMF0sIHtvZmZzZXQ6IHN0YXJ0LCBtYXNrOiBbMHhGRiwgMHhGQ119KSAvLyBNUEVHIDQgbGF5ZXIgMCB1c2luZyBBRFRTXG5cdFx0KSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRleHQ6ICdtcDQnLFxuXHRcdFx0XHRtaW1lOiAnYXVkaW8vbXBlZydcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cblx0Ly8gTmVlZHMgdG8gYmUgYmVmb3JlIGBvZ2dgIGNoZWNrXG5cdGlmIChjaGVjayhbMHg0RiwgMHg3MCwgMHg3NSwgMHg3MywgMHg0OCwgMHg2NSwgMHg2MSwgMHg2NF0sIHtvZmZzZXQ6IDI4fSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnb3B1cycsXG5cdFx0XHRtaW1lOiAnYXVkaW8vb3B1cydcblx0XHR9O1xuXHR9XG5cblx0Ly8gSWYgJ09nZ1MnIGluIGZpcnN0ICBieXRlcywgdGhlbiBPR0cgY29udGFpbmVyXG5cdGlmIChjaGVjayhbMHg0RiwgMHg2NywgMHg2NywgMHg1M10pKSB7XG5cdFx0Ly8gVGhpcyBpcyBhIE9HRyBjb250YWluZXJcblxuXHRcdC8vIElmICcgdGhlb3JhJyBpbiBoZWFkZXIuXG5cdFx0aWYgKGNoZWNrKFsweDgwLCAweDc0LCAweDY4LCAweDY1LCAweDZGLCAweDcyLCAweDYxXSwge29mZnNldDogMjh9KSkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZXh0OiAnb2d2Jyxcblx0XHRcdFx0bWltZTogJ3ZpZGVvL29nZydcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Ly8gSWYgJ1xceDAxdmlkZW8nIGluIGhlYWRlci5cblx0XHRpZiAoY2hlY2soWzB4MDEsIDB4NzYsIDB4NjksIDB4NjQsIDB4NjUsIDB4NkYsIDB4MDBdLCB7b2Zmc2V0OiAyOH0pKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRleHQ6ICdvZ20nLFxuXHRcdFx0XHRtaW1lOiAndmlkZW8vb2dnJ1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHQvLyBJZiAnIEZMQUMnIGluIGhlYWRlciAgaHR0cHM6Ly94aXBoLm9yZy9mbGFjL2ZhcS5odG1sXG5cdFx0aWYgKGNoZWNrKFsweDdGLCAweDQ2LCAweDRDLCAweDQxLCAweDQzXSwge29mZnNldDogMjh9KSkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZXh0OiAnb2dhJyxcblx0XHRcdFx0bWltZTogJ2F1ZGlvL29nZydcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Ly8gJ1NwZWV4ICAnIGluIGhlYWRlciBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TcGVleFxuXHRcdGlmIChjaGVjayhbMHg1MywgMHg3MCwgMHg2NSwgMHg2NSwgMHg3OCwgMHgyMCwgMHgyMF0sIHtvZmZzZXQ6IDI4fSkpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV4dDogJ3NweCcsXG5cdFx0XHRcdG1pbWU6ICdhdWRpby9vZ2cnXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8vIElmICdcXHgwMXZvcmJpcycgaW4gaGVhZGVyXG5cdFx0aWYgKGNoZWNrKFsweDAxLCAweDc2LCAweDZGLCAweDcyLCAweDYyLCAweDY5LCAweDczXSwge29mZnNldDogMjh9KSkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZXh0OiAnb2dnJyxcblx0XHRcdFx0bWltZTogJ2F1ZGlvL29nZydcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Ly8gRGVmYXVsdCBPR0cgY29udGFpbmVyIGh0dHBzOi8vd3d3LmlhbmEub3JnL2Fzc2lnbm1lbnRzL21lZGlhLXR5cGVzL2FwcGxpY2F0aW9uL29nZ1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdvZ3gnLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL29nZydcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDY2LCAweDRDLCAweDYxLCAweDQzXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnZmxhYycsXG5cdFx0XHRtaW1lOiAnYXVkaW8veC1mbGFjJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NEQsIDB4NDEsIDB4NDMsIDB4MjBdKSkgeyAvLyAnTUFDICdcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnYXBlJyxcblx0XHRcdG1pbWU6ICdhdWRpby9hcGUnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg3NywgMHg3NiwgMHg3MCwgMHg2Ql0pKSB7IC8vICd3dnBrJ1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICd3dicsXG5cdFx0XHRtaW1lOiAnYXVkaW8vd2F2cGFjaydcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDIzLCAweDIxLCAweDQxLCAweDRELCAweDUyLCAweDBBXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnYW1yJyxcblx0XHRcdG1pbWU6ICdhdWRpby9hbXInXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHgyNSwgMHg1MCwgMHg0NCwgMHg0Nl0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3BkZicsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24vcGRmJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NEQsIDB4NUFdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdleGUnLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3gtbXNkb3dubG9hZCdcblx0XHR9O1xuXHR9XG5cblx0aWYgKFxuXHRcdChidWZmZXJbMF0gPT09IDB4NDMgfHwgYnVmZmVyWzBdID09PSAweDQ2KSAmJlxuXHRcdGNoZWNrKFsweDU3LCAweDUzXSwge29mZnNldDogMX0pXG5cdCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdzd2YnLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4N0IsIDB4NUMsIDB4NzIsIDB4NzQsIDB4NjZdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdydGYnLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3J0Zidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDAwLCAweDYxLCAweDczLCAweDZEXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnd2FzbScsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24vd2FzbSdcblx0XHR9O1xuXHR9XG5cblx0aWYgKFxuXHRcdGNoZWNrKFsweDc3LCAweDRGLCAweDQ2LCAweDQ2XSkgJiZcblx0XHQoXG5cdFx0XHRjaGVjayhbMHgwMCwgMHgwMSwgMHgwMCwgMHgwMF0sIHtvZmZzZXQ6IDR9KSB8fFxuXHRcdFx0Y2hlY2soWzB4NEYsIDB4NTQsIDB4NTQsIDB4NEZdLCB7b2Zmc2V0OiA0fSlcblx0XHQpXG5cdCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICd3b2ZmJyxcblx0XHRcdG1pbWU6ICdmb250L3dvZmYnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChcblx0XHRjaGVjayhbMHg3NywgMHg0RiwgMHg0NiwgMHgzMl0pICYmXG5cdFx0KFxuXHRcdFx0Y2hlY2soWzB4MDAsIDB4MDEsIDB4MDAsIDB4MDBdLCB7b2Zmc2V0OiA0fSkgfHxcblx0XHRcdGNoZWNrKFsweDRGLCAweDU0LCAweDU0LCAweDRGXSwge29mZnNldDogNH0pXG5cdFx0KVxuXHQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnd29mZjInLFxuXHRcdFx0bWltZTogJ2ZvbnQvd29mZjInXG5cdFx0fTtcblx0fVxuXG5cdGlmIChcblx0XHRjaGVjayhbMHg0QywgMHg1MF0sIHtvZmZzZXQ6IDM0fSkgJiZcblx0XHQoXG5cdFx0XHRjaGVjayhbMHgwMCwgMHgwMCwgMHgwMV0sIHtvZmZzZXQ6IDh9KSB8fFxuXHRcdFx0Y2hlY2soWzB4MDEsIDB4MDAsIDB4MDJdLCB7b2Zmc2V0OiA4fSkgfHxcblx0XHRcdGNoZWNrKFsweDAyLCAweDAwLCAweDAyXSwge29mZnNldDogOH0pXG5cdFx0KVxuXHQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnZW90Jyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi92bmQubXMtZm9udG9iamVjdCdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDAwLCAweDAxLCAweDAwLCAweDAwLCAweDAwXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAndHRmJyxcblx0XHRcdG1pbWU6ICdmb250L3R0Zidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDRGLCAweDU0LCAweDU0LCAweDRGLCAweDAwXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnb3RmJyxcblx0XHRcdG1pbWU6ICdmb250L290Zidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDAwLCAweDAwLCAweDAxLCAweDAwXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnaWNvJyxcblx0XHRcdG1pbWU6ICdpbWFnZS94LWljb24nXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHgwMCwgMHgwMCwgMHgwMiwgMHgwMF0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2N1cicsXG5cdFx0XHRtaW1lOiAnaW1hZ2UveC1pY29uJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NDYsIDB4NEMsIDB4NTYsIDB4MDFdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdmbHYnLFxuXHRcdFx0bWltZTogJ3ZpZGVvL3gtZmx2J1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4MjUsIDB4MjFdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdwcycsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24vcG9zdHNjcmlwdCdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweEZELCAweDM3LCAweDdBLCAweDU4LCAweDVBLCAweDAwXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAneHonLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3gteHonXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg1MywgMHg1MSwgMHg0QywgMHg2OV0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3NxbGl0ZScsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC1zcWxpdGUzJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NEUsIDB4NDUsIDB4NTMsIDB4MUFdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICduZXMnLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3gtbmludGVuZG8tbmVzLXJvbSdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDQzLCAweDcyLCAweDMyLCAweDM0XSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnY3J4Jyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LWdvb2dsZS1jaHJvbWUtZXh0ZW5zaW9uJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoXG5cdFx0Y2hlY2soWzB4NEQsIDB4NTMsIDB4NDMsIDB4NDZdKSB8fFxuXHRcdGNoZWNrKFsweDQ5LCAweDUzLCAweDYzLCAweDI4XSlcblx0KSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2NhYicsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24vdm5kLm1zLWNhYi1jb21wcmVzc2VkJ1xuXHRcdH07XG5cdH1cblxuXHQvLyBOZWVkcyB0byBiZSBiZWZvcmUgYGFyYCBjaGVja1xuXHRpZiAoY2hlY2soWzB4MjEsIDB4M0MsIDB4NjEsIDB4NzIsIDB4NjMsIDB4NjgsIDB4M0UsIDB4MEEsIDB4NjQsIDB4NjUsIDB4NjIsIDB4NjksIDB4NjEsIDB4NkUsIDB4MkQsIDB4NjIsIDB4NjksIDB4NkUsIDB4NjEsIDB4NzIsIDB4NzldKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdkZWInLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3gtZGViJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4MjEsIDB4M0MsIDB4NjEsIDB4NzIsIDB4NjMsIDB4NjgsIDB4M0VdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdhcicsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC11bml4LWFyY2hpdmUnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHhFRCwgMHhBQiwgMHhFRSwgMHhEQl0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3JwbScsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC1ycG0nXG5cdFx0fTtcblx0fVxuXG5cdGlmIChcblx0XHRjaGVjayhbMHgxRiwgMHhBMF0pIHx8XG5cdFx0Y2hlY2soWzB4MUYsIDB4OURdKVxuXHQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnWicsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC1jb21wcmVzcydcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDRDLCAweDVBLCAweDQ5LCAweDUwXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnbHonLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3gtbHppcCdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweEQwLCAweENGLCAweDExLCAweEUwLCAweEExLCAweEIxLCAweDFBLCAweEUxLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDNFXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnbXNpJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LW1zaSdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDA2LCAweDBFLCAweDJCLCAweDM0LCAweDAyLCAweDA1LCAweDAxLCAweDAxLCAweDBELCAweDAxLCAweDAyLCAweDAxLCAweDAxLCAweDAyXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnbXhmJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi9teGYnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg0N10sIHtvZmZzZXQ6IDR9KSAmJiAoY2hlY2soWzB4NDddLCB7b2Zmc2V0OiAxOTJ9KSB8fCBjaGVjayhbMHg0N10sIHtvZmZzZXQ6IDE5Nn0pKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdtdHMnLFxuXHRcdFx0bWltZTogJ3ZpZGVvL21wMnQnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg0MiwgMHg0QywgMHg0NSwgMHg0RSwgMHg0NCwgMHg0NSwgMHg1Ml0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2JsZW5kJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LWJsZW5kZXInXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg0MiwgMHg1MCwgMHg0NywgMHhGQl0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2JwZycsXG5cdFx0XHRtaW1lOiAnaW1hZ2UvYnBnJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4MDAsIDB4MDAsIDB4MDAsIDB4MEMsIDB4NkEsIDB4NTAsIDB4MjAsIDB4MjAsIDB4MEQsIDB4MEEsIDB4ODcsIDB4MEFdKSkge1xuXHRcdC8vIEpQRUctMjAwMCBmYW1pbHlcblxuXHRcdGlmIChjaGVjayhbMHg2QSwgMHg3MCwgMHgzMiwgMHgyMF0sIHtvZmZzZXQ6IDIwfSkpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV4dDogJ2pwMicsXG5cdFx0XHRcdG1pbWU6ICdpbWFnZS9qcDInXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGlmIChjaGVjayhbMHg2QSwgMHg3MCwgMHg3OCwgMHgyMF0sIHtvZmZzZXQ6IDIwfSkpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV4dDogJ2pweCcsXG5cdFx0XHRcdG1pbWU6ICdpbWFnZS9qcHgnXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGlmIChjaGVjayhbMHg2QSwgMHg3MCwgMHg2RCwgMHgyMF0sIHtvZmZzZXQ6IDIwfSkpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV4dDogJ2pwbScsXG5cdFx0XHRcdG1pbWU6ICdpbWFnZS9qcG0nXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGlmIChjaGVjayhbMHg2RCwgMHg2QSwgMHg3MCwgMHgzMl0sIHtvZmZzZXQ6IDIwfSkpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV4dDogJ21qMicsXG5cdFx0XHRcdG1pbWU6ICdpbWFnZS9tajInXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXG5cdGlmIChjaGVjayhbMHg0NiwgMHg0RiwgMHg1MiwgMHg0RF0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2FpZicsXG5cdFx0XHRtaW1lOiAnYXVkaW8vYWlmZidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrU3RyaW5nKCc8P3htbCAnKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICd4bWwnLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3htbCdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDQyLCAweDRGLCAweDRGLCAweDRCLCAweDRELCAweDRGLCAweDQyLCAweDQ5XSwge29mZnNldDogNjB9KSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdtb2JpJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LW1vYmlwb2NrZXQtZWJvb2snXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHhBQiwgMHg0QiwgMHg1NCwgMHg1OCwgMHgyMCwgMHgzMSwgMHgzMSwgMHhCQiwgMHgwRCwgMHgwQSwgMHgxQSwgMHgwQV0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2t0eCcsXG5cdFx0XHRtaW1lOiAnaW1hZ2Uva3R4J1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NDQsIDB4NDksIDB4NDMsIDB4NERdLCB7b2Zmc2V0OiAxMjh9KSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdkY20nLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL2RpY29tJ1xuXHRcdH07XG5cdH1cblxuXHQvLyBNdXNlcGFjaywgU1Y3XG5cdGlmIChjaGVjayhbMHg0RCwgMHg1MCwgMHgyQl0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ21wYycsXG5cdFx0XHRtaW1lOiAnYXVkaW8veC1tdXNlcGFjaydcblx0XHR9O1xuXHR9XG5cblx0Ly8gTXVzZXBhY2ssIFNWOFxuXHRpZiAoY2hlY2soWzB4NEQsIDB4NTAsIDB4NDMsIDB4NEJdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdtcGMnLFxuXHRcdFx0bWltZTogJ2F1ZGlvL3gtbXVzZXBhY2snXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg0MiwgMHg0NSwgMHg0NywgMHg0OSwgMHg0RSwgMHgzQV0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2ljcycsXG5cdFx0XHRtaW1lOiAndGV4dC9jYWxlbmRhcidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDY3LCAweDZDLCAweDU0LCAweDQ2LCAweDAyLCAweDAwLCAweDAwLCAweDAwXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnZ2xiJyxcblx0XHRcdG1pbWU6ICdtb2RlbC9nbHRmLWJpbmFyeSdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweEQ0LCAweEMzLCAweEIyLCAweEExXSkgfHwgY2hlY2soWzB4QTEsIDB4QjIsIDB4QzMsIDB4RDRdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdwY2FwJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi92bmQudGNwZHVtcC5wY2FwJ1xuXHRcdH07XG5cdH1cblxuXHQvLyBTb255IERTRCBTdHJlYW0gRmlsZSAoRFNGKVxuXHRpZiAoY2hlY2soWzB4NDQsIDB4NTMsIDB4NDQsIDB4MjBdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdkc2YnLFxuXHRcdFx0bWltZTogJ2F1ZGlvL3gtZHNmJyAvLyBOb24tc3RhbmRhcmRcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDRDLCAweDAwLCAweDAwLCAweDAwLCAweDAxLCAweDE0LCAweDAyLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweEMwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDQ2XSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnbG5rJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94Lm1zLnNob3J0Y3V0JyAvLyBJbnZlbnRlZCBieSB1c1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NjIsIDB4NkYsIDB4NkYsIDB4NkIsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4NkQsIDB4NjEsIDB4NzIsIDB4NkIsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDBdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdhbGlhcycsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC5hcHBsZS5hbGlhcycgLy8gSW52ZW50ZWQgYnkgdXNcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrU3RyaW5nKCdDcmVhdGl2ZSBWb2ljZSBGaWxlJykpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAndm9jJyxcblx0XHRcdG1pbWU6ICdhdWRpby94LXZvYydcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDBCLCAweDc3XSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnYWMzJyxcblx0XHRcdG1pbWU6ICdhdWRpby92bmQuZG9sYnkuZGQtcmF3J1xuXHRcdH07XG5cdH1cblxuXHRpZiAoKGNoZWNrKFsweDdFLCAweDEwLCAweDA0XSkgfHwgY2hlY2soWzB4N0UsIDB4MTgsIDB4MDRdKSkgJiYgY2hlY2soWzB4MzAsIDB4NEQsIDB4NDksIDB4NDVdLCB7b2Zmc2V0OiA0fSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnbWllJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LW1pZSdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDQxLCAweDUyLCAweDUyLCAweDRGLCAweDU3LCAweDMxLCAweDAwLCAweDAwXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnYXJyb3cnLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3gtYXBhY2hlLWFycm93J1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4MjcsIDB4MEEsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDBdLCB7b2Zmc2V0OiAyfSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnc2hwJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LWVzcmktc2hhcGUnXG5cdFx0fTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmaWxlVHlwZTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGZpbGVUeXBlLCAnbWluaW11bUJ5dGVzJywge3ZhbHVlOiA0MTAwfSk7XG5cbmZpbGVUeXBlLnN0cmVhbSA9IHJlYWRhYmxlU3RyZWFtID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0Ly8gVXNpbmcgYGV2YWxgIHRvIHdvcmsgYXJvdW5kIGlzc3VlcyB3aGVuIGJ1bmRsaW5nIHdpdGggV2VicGFja1xuXHRjb25zdCBzdHJlYW0gPSBldmFsKCdyZXF1aXJlJykoJ3N0cmVhbScpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWV2YWxcblxuXHRyZWFkYWJsZVN0cmVhbS5vbignZXJyb3InLCByZWplY3QpO1xuXHRyZWFkYWJsZVN0cmVhbS5vbmNlKCdyZWFkYWJsZScsICgpID0+IHtcblx0XHRjb25zdCBwYXNzID0gbmV3IHN0cmVhbS5QYXNzVGhyb3VnaCgpO1xuXHRcdGNvbnN0IGNodW5rID0gcmVhZGFibGVTdHJlYW0ucmVhZChtb2R1bGUuZXhwb3J0cy5taW5pbXVtQnl0ZXMpIHx8IHJlYWRhYmxlU3RyZWFtLnJlYWQoKTtcblx0XHR0cnkge1xuXHRcdFx0cGFzcy5maWxlVHlwZSA9IGZpbGVUeXBlKGNodW5rKTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHR9XG5cblx0XHRyZWFkYWJsZVN0cmVhbS51bnNoaWZ0KGNodW5rKTtcblxuXHRcdGlmIChzdHJlYW0ucGlwZWxpbmUpIHtcblx0XHRcdHJlc29sdmUoc3RyZWFtLnBpcGVsaW5lKHJlYWRhYmxlU3RyZWFtLCBwYXNzLCAoKSA9PiB7fSkpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXNvbHZlKHJlYWRhYmxlU3RyZWFtLnBpcGUocGFzcykpO1xuXHRcdH1cblx0fSk7XG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGZpbGVUeXBlLCAnZXh0ZW5zaW9ucycsIHtcblx0Z2V0KCkge1xuXHRcdHJldHVybiBuZXcgU2V0KHN1cHBvcnRlZC5leHRlbnNpb25zKTtcblx0fVxufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShmaWxlVHlwZSwgJ21pbWVUeXBlcycsIHtcblx0Z2V0KCkge1xuXHRcdHJldHVybiBuZXcgU2V0KHN1cHBvcnRlZC5taW1lVHlwZXMpO1xuXHR9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGV4dGVuc2lvbnM6IFtcblx0XHQnanBnJyxcblx0XHQncG5nJyxcblx0XHQnYXBuZycsXG5cdFx0J2dpZicsXG5cdFx0J3dlYnAnLFxuXHRcdCdmbGlmJyxcblx0XHQnY3IyJyxcblx0XHQnb3JmJyxcblx0XHQnYXJ3Jyxcblx0XHQnZG5nJyxcblx0XHQnbmVmJyxcblx0XHQncncyJyxcblx0XHQncmFmJyxcblx0XHQndGlmJyxcblx0XHQnYm1wJyxcblx0XHQnanhyJyxcblx0XHQncHNkJyxcblx0XHQnemlwJyxcblx0XHQndGFyJyxcblx0XHQncmFyJyxcblx0XHQnZ3onLFxuXHRcdCdiejInLFxuXHRcdCc3eicsXG5cdFx0J2RtZycsXG5cdFx0J21wNCcsXG5cdFx0J21pZCcsXG5cdFx0J21rdicsXG5cdFx0J3dlYm0nLFxuXHRcdCdtb3YnLFxuXHRcdCdhdmknLFxuXHRcdCdtcGcnLFxuXHRcdCdtcDInLFxuXHRcdCdtcDMnLFxuXHRcdCdtNGEnLFxuXHRcdCdvZ2EnLFxuXHRcdCdvZ2cnLFxuXHRcdCdvZ3YnLFxuXHRcdCdvcHVzJyxcblx0XHQnZmxhYycsXG5cdFx0J3dhdicsXG5cdFx0J3NweCcsXG5cdFx0J2FtcicsXG5cdFx0J3BkZicsXG5cdFx0J2VwdWInLFxuXHRcdCdleGUnLFxuXHRcdCdzd2YnLFxuXHRcdCdydGYnLFxuXHRcdCd3YXNtJyxcblx0XHQnd29mZicsXG5cdFx0J3dvZmYyJyxcblx0XHQnZW90Jyxcblx0XHQndHRmJyxcblx0XHQnb3RmJyxcblx0XHQnaWNvJyxcblx0XHQnZmx2Jyxcblx0XHQncHMnLFxuXHRcdCd4eicsXG5cdFx0J3NxbGl0ZScsXG5cdFx0J25lcycsXG5cdFx0J2NyeCcsXG5cdFx0J3hwaScsXG5cdFx0J2NhYicsXG5cdFx0J2RlYicsXG5cdFx0J2FyJyxcblx0XHQncnBtJyxcblx0XHQnWicsXG5cdFx0J2x6Jyxcblx0XHQnbXNpJyxcblx0XHQnbXhmJyxcblx0XHQnbXRzJyxcblx0XHQnYmxlbmQnLFxuXHRcdCdicGcnLFxuXHRcdCdkb2N4Jyxcblx0XHQncHB0eCcsXG5cdFx0J3hsc3gnLFxuXHRcdCczZ3AnLFxuXHRcdCczZzInLFxuXHRcdCdqcDInLFxuXHRcdCdqcG0nLFxuXHRcdCdqcHgnLFxuXHRcdCdtajInLFxuXHRcdCdhaWYnLFxuXHRcdCdxY3AnLFxuXHRcdCdvZHQnLFxuXHRcdCdvZHMnLFxuXHRcdCdvZHAnLFxuXHRcdCd4bWwnLFxuXHRcdCdtb2JpJyxcblx0XHQnaGVpYycsXG5cdFx0J2N1cicsXG5cdFx0J2t0eCcsXG5cdFx0J2FwZScsXG5cdFx0J3d2Jyxcblx0XHQnd212Jyxcblx0XHQnd21hJyxcblx0XHQnZGNtJyxcblx0XHQnaWNzJyxcblx0XHQnZ2xiJyxcblx0XHQncGNhcCcsXG5cdFx0J2RzZicsXG5cdFx0J2xuaycsXG5cdFx0J2FsaWFzJyxcblx0XHQndm9jJyxcblx0XHQnYWMzJyxcblx0XHQnbTR2Jyxcblx0XHQnbTRwJyxcblx0XHQnbTRiJyxcblx0XHQnZjR2Jyxcblx0XHQnZjRwJyxcblx0XHQnZjRiJyxcblx0XHQnZjRhJyxcblx0XHQnbWllJyxcblx0XHQnYXNmJyxcblx0XHQnb2dtJyxcblx0XHQnb2d4Jyxcblx0XHQnbXBjJyxcblx0XHQnYXJyb3cnLFxuXHRcdCdzaHAnXG5cdF0sXG5cdG1pbWVUeXBlczogW1xuXHRcdCdpbWFnZS9qcGVnJyxcblx0XHQnaW1hZ2UvcG5nJyxcblx0XHQnaW1hZ2UvZ2lmJyxcblx0XHQnaW1hZ2Uvd2VicCcsXG5cdFx0J2ltYWdlL2ZsaWYnLFxuXHRcdCdpbWFnZS94LWNhbm9uLWNyMicsXG5cdFx0J2ltYWdlL3RpZmYnLFxuXHRcdCdpbWFnZS9ibXAnLFxuXHRcdCdpbWFnZS92bmQubXMtcGhvdG8nLFxuXHRcdCdpbWFnZS92bmQuYWRvYmUucGhvdG9zaG9wJyxcblx0XHQnYXBwbGljYXRpb24vZXB1Yit6aXAnLFxuXHRcdCdhcHBsaWNhdGlvbi94LXhwaW5zdGFsbCcsXG5cdFx0J2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQudGV4dCcsXG5cdFx0J2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuc3ByZWFkc2hlZXQnLFxuXHRcdCdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnByZXNlbnRhdGlvbicsXG5cdFx0J2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmRvY3VtZW50Jyxcblx0XHQnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLnByZXNlbnRhdGlvbicsXG5cdFx0J2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnNoZWV0Jyxcblx0XHQnYXBwbGljYXRpb24vemlwJyxcblx0XHQnYXBwbGljYXRpb24veC10YXInLFxuXHRcdCdhcHBsaWNhdGlvbi94LXJhci1jb21wcmVzc2VkJyxcblx0XHQnYXBwbGljYXRpb24vZ3ppcCcsXG5cdFx0J2FwcGxpY2F0aW9uL3gtYnppcDInLFxuXHRcdCdhcHBsaWNhdGlvbi94LTd6LWNvbXByZXNzZWQnLFxuXHRcdCdhcHBsaWNhdGlvbi94LWFwcGxlLWRpc2tpbWFnZScsXG5cdFx0J2FwcGxpY2F0aW9uL3gtYXBhY2hlLWFycm93Jyxcblx0XHQndmlkZW8vbXA0Jyxcblx0XHQnYXVkaW8vbWlkaScsXG5cdFx0J3ZpZGVvL3gtbWF0cm9za2EnLFxuXHRcdCd2aWRlby93ZWJtJyxcblx0XHQndmlkZW8vcXVpY2t0aW1lJyxcblx0XHQndmlkZW8vdm5kLmF2aScsXG5cdFx0J2F1ZGlvL3ZuZC53YXZlJyxcblx0XHQnYXVkaW8vcWNlbHAnLFxuXHRcdCdhdWRpby94LW1zLXdtYScsXG5cdFx0J3ZpZGVvL3gtbXMtYXNmJyxcblx0XHQnYXBwbGljYXRpb24vdm5kLm1zLWFzZicsXG5cdFx0J3ZpZGVvL21wZWcnLFxuXHRcdCd2aWRlby8zZ3BwJyxcblx0XHQnYXVkaW8vbXBlZycsXG5cdFx0J2F1ZGlvL21wNCcsIC8vIFJGQyA0MzM3XG5cdFx0J2F1ZGlvL29wdXMnLFxuXHRcdCd2aWRlby9vZ2cnLFxuXHRcdCdhdWRpby9vZ2cnLFxuXHRcdCdhcHBsaWNhdGlvbi9vZ2cnLFxuXHRcdCdhdWRpby94LWZsYWMnLFxuXHRcdCdhdWRpby9hcGUnLFxuXHRcdCdhdWRpby93YXZwYWNrJyxcblx0XHQnYXVkaW8vYW1yJyxcblx0XHQnYXBwbGljYXRpb24vcGRmJyxcblx0XHQnYXBwbGljYXRpb24veC1tc2Rvd25sb2FkJyxcblx0XHQnYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2gnLFxuXHRcdCdhcHBsaWNhdGlvbi9ydGYnLFxuXHRcdCdhcHBsaWNhdGlvbi93YXNtJyxcblx0XHQnZm9udC93b2ZmJyxcblx0XHQnZm9udC93b2ZmMicsXG5cdFx0J2FwcGxpY2F0aW9uL3ZuZC5tcy1mb250b2JqZWN0Jyxcblx0XHQnZm9udC90dGYnLFxuXHRcdCdmb250L290ZicsXG5cdFx0J2ltYWdlL3gtaWNvbicsXG5cdFx0J3ZpZGVvL3gtZmx2Jyxcblx0XHQnYXBwbGljYXRpb24vcG9zdHNjcmlwdCcsXG5cdFx0J2FwcGxpY2F0aW9uL3gteHonLFxuXHRcdCdhcHBsaWNhdGlvbi94LXNxbGl0ZTMnLFxuXHRcdCdhcHBsaWNhdGlvbi94LW5pbnRlbmRvLW5lcy1yb20nLFxuXHRcdCdhcHBsaWNhdGlvbi94LWdvb2dsZS1jaHJvbWUtZXh0ZW5zaW9uJyxcblx0XHQnYXBwbGljYXRpb24vdm5kLm1zLWNhYi1jb21wcmVzc2VkJyxcblx0XHQnYXBwbGljYXRpb24veC1kZWInLFxuXHRcdCdhcHBsaWNhdGlvbi94LXVuaXgtYXJjaGl2ZScsXG5cdFx0J2FwcGxpY2F0aW9uL3gtcnBtJyxcblx0XHQnYXBwbGljYXRpb24veC1jb21wcmVzcycsXG5cdFx0J2FwcGxpY2F0aW9uL3gtbHppcCcsXG5cdFx0J2FwcGxpY2F0aW9uL3gtbXNpJyxcblx0XHQnYXBwbGljYXRpb24veC1taWUnLFxuXHRcdCdhcHBsaWNhdGlvbi9teGYnLFxuXHRcdCd2aWRlby9tcDJ0Jyxcblx0XHQnYXBwbGljYXRpb24veC1ibGVuZGVyJyxcblx0XHQnaW1hZ2UvYnBnJyxcblx0XHQnaW1hZ2UvanAyJyxcblx0XHQnaW1hZ2UvanB4Jyxcblx0XHQnaW1hZ2UvanBtJyxcblx0XHQnaW1hZ2UvbWoyJyxcblx0XHQnYXVkaW8vYWlmZicsXG5cdFx0J2FwcGxpY2F0aW9uL3htbCcsXG5cdFx0J2FwcGxpY2F0aW9uL3gtbW9iaXBvY2tldC1lYm9vaycsXG5cdFx0J2ltYWdlL2hlaWYnLFxuXHRcdCdpbWFnZS9oZWlmLXNlcXVlbmNlJyxcblx0XHQnaW1hZ2UvaGVpYycsXG5cdFx0J2ltYWdlL2hlaWMtc2VxdWVuY2UnLFxuXHRcdCdpbWFnZS9rdHgnLFxuXHRcdCdhcHBsaWNhdGlvbi9kaWNvbScsXG5cdFx0J2F1ZGlvL3gtbXVzZXBhY2snLFxuXHRcdCd0ZXh0L2NhbGVuZGFyJyxcblx0XHQnbW9kZWwvZ2x0Zi1iaW5hcnknLFxuXHRcdCdhcHBsaWNhdGlvbi92bmQudGNwZHVtcC5wY2FwJyxcblx0XHQnYXVkaW8veC1kc2YnLCAvLyBOb24tc3RhbmRhcmRcblx0XHQnYXBwbGljYXRpb24veC5tcy5zaG9ydGN1dCcsIC8vIEludmVudGVkIGJ5IHVzXG5cdFx0J2FwcGxpY2F0aW9uL3guYXBwbGUuYWxpYXMnLCAvLyBJbnZlbnRlZCBieSB1c1xuXHRcdCdhdWRpby94LXZvYycsXG5cdFx0J2F1ZGlvL3ZuZC5kb2xieS5kZC1yYXcnLFxuXHRcdCdhdWRpby94LW00YScsXG5cdFx0J2ltYWdlL2FwbmcnLFxuXHRcdCdpbWFnZS94LW9seW1wdXMtb3JmJyxcblx0XHQnaW1hZ2UveC1zb255LWFydycsXG5cdFx0J2ltYWdlL3gtYWRvYmUtZG5nJyxcblx0XHQnaW1hZ2UveC1uaWtvbi1uZWYnLFxuXHRcdCdpbWFnZS94LXBhbmFzb25pYy1ydzInLFxuXHRcdCdpbWFnZS94LWZ1amlmaWxtLXJhZicsXG5cdFx0J3ZpZGVvL3gtbTR2Jyxcblx0XHQndmlkZW8vM2dwcDInLFxuXHRcdCdhcHBsaWNhdGlvbi94LWVzcmktc2hhcGUnXG5cdF1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuc3RyaW5nVG9CeXRlcyA9IHN0cmluZyA9PiBbLi4uc3RyaW5nXS5tYXAoY2hhcmFjdGVyID0+IGNoYXJhY3Rlci5jaGFyQ29kZUF0KDApKTtcblxuY29uc3QgdWludDhBcnJheVV0ZjhCeXRlU3RyaW5nID0gKGFycmF5LCBzdGFydCwgZW5kKSA9PiB7XG5cdHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKC4uLmFycmF5LnNsaWNlKHN0YXJ0LCBlbmQpKTtcbn07XG5cbmV4cG9ydHMucmVhZFVJbnQ2NExFID0gKGJ1ZmZlciwgb2Zmc2V0ID0gMCkgPT4ge1xuXHRsZXQgbiA9IGJ1ZmZlcltvZmZzZXRdO1xuXHRsZXQgbXVsID0gMTtcblx0bGV0IGkgPSAwO1xuXG5cdHdoaWxlICgrK2kgPCA4KSB7XG5cdFx0bXVsICo9IDB4MTAwO1xuXHRcdG4gKz0gYnVmZmVyW29mZnNldCArIGldICogbXVsO1xuXHR9XG5cblx0cmV0dXJuIG47XG59O1xuXG5leHBvcnRzLnRhckhlYWRlckNoZWNrc3VtTWF0Y2hlcyA9IGJ1ZmZlciA9PiB7IC8vIERvZXMgbm90IGNoZWNrIGlmIGNoZWNrc3VtIGZpZWxkIGNoYXJhY3RlcnMgYXJlIHZhbGlkXG5cdGlmIChidWZmZXIubGVuZ3RoIDwgNTEyKSB7IC8vIGB0YXJgIGhlYWRlciBzaXplLCBjYW5ub3QgY29tcHV0ZSBjaGVja3N1bSB3aXRob3V0IGl0XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Y29uc3QgTUFTS184VEhfQklUID0gMHg4MDtcblxuXHRsZXQgc3VtID0gMjU2OyAvLyBJbnRpdGFsaXplIHN1bSwgd2l0aCAyNTYgYXMgc3VtIG9mIDggc3BhY2VzIGluIGNoZWNrc3VtIGZpZWxkXG5cdGxldCBzaWduZWRCaXRTdW0gPSAwOyAvLyBJbml0aWFsaXplIHNpZ25lZCBiaXQgc3VtXG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCAxNDg7IGkrKykge1xuXHRcdGNvbnN0IGJ5dGUgPSBidWZmZXJbaV07XG5cdFx0c3VtICs9IGJ5dGU7XG5cdFx0c2lnbmVkQml0U3VtICs9IGJ5dGUgJiBNQVNLXzhUSF9CSVQ7IC8vIEFkZCBzaWduZWQgYml0IHRvIHNpZ25lZCBiaXQgc3VtXG5cdH1cblxuXHQvLyBTa2lwIGNoZWNrc3VtIGZpZWxkXG5cblx0Zm9yIChsZXQgaSA9IDE1NjsgaSA8IDUxMjsgaSsrKSB7XG5cdFx0Y29uc3QgYnl0ZSA9IGJ1ZmZlcltpXTtcblx0XHRzdW0gKz0gYnl0ZTtcblx0XHRzaWduZWRCaXRTdW0gKz0gYnl0ZSAmIE1BU0tfOFRIX0JJVDsgLy8gQWRkIHNpZ25lZCBiaXQgdG8gc2lnbmVkIGJpdCBzdW1cblx0fVxuXG5cdGNvbnN0IHJlYWRTdW0gPSBwYXJzZUludCh1aW50OEFycmF5VXRmOEJ5dGVTdHJpbmcoYnVmZmVyLCAxNDgsIDE1NCksIDgpOyAvLyBSZWFkIHN1bSBpbiBoZWFkZXJcblxuXHQvLyBTb21lIGltcGxlbWVudGF0aW9ucyBjb21wdXRlIGNoZWNrc3VtIGluY29ycmVjdGx5IHVzaW5nIHNpZ25lZCBieXRlc1xuXHRyZXR1cm4gKFxuXHRcdC8vIENoZWNrc3VtIGluIGhlYWRlciBlcXVhbHMgdGhlIHN1bSB3ZSBjYWxjdWxhdGVkXG5cdFx0cmVhZFN1bSA9PT0gc3VtIHx8XG5cblx0XHQvLyBDaGVja3N1bSBpbiBoZWFkZXIgZXF1YWxzIHN1bSB3ZSBjYWxjdWxhdGVkIHBsdXMgc2lnbmVkLXRvLXVuc2lnbmVkIGRlbHRhXG5cdFx0cmVhZFN1bSA9PT0gKHN1bSAtIChzaWduZWRCaXRTdW0gPDwgMSkpXG5cdCk7XG59O1xuXG5leHBvcnRzLm11bHRpQnl0ZUluZGV4T2YgPSAoYnVmZmVyLCBieXRlc1RvU2VhcmNoLCBzdGFydEF0ID0gMCkgPT4ge1xuXHQvLyBgQnVmZmVyI2luZGV4T2YoKWAgY2FuIHNlYXJjaCBmb3IgbXVsdGlwbGUgYnl0ZXNcblx0aWYgKEJ1ZmZlciAmJiBCdWZmZXIuaXNCdWZmZXIoYnVmZmVyKSkge1xuXHRcdHJldHVybiBidWZmZXIuaW5kZXhPZihCdWZmZXIuZnJvbShieXRlc1RvU2VhcmNoKSwgc3RhcnRBdCk7XG5cdH1cblxuXHRjb25zdCBuZXh0Qnl0ZXNNYXRjaCA9IChidWZmZXIsIGJ5dGVzLCBzdGFydEluZGV4KSA9PiB7XG5cdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCBieXRlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKGJ5dGVzW2ldICE9PSBidWZmZXJbc3RhcnRJbmRleCArIGldKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fTtcblxuXHQvLyBgVWludDhBcnJheSNpbmRleE9mKClgIGNhbiBzZWFyY2ggZm9yIG9ubHkgYSBzaW5nbGUgYnl0ZVxuXHRsZXQgaW5kZXggPSBidWZmZXIuaW5kZXhPZihieXRlc1RvU2VhcmNoWzBdLCBzdGFydEF0KTtcblx0d2hpbGUgKGluZGV4ID49IDApIHtcblx0XHRpZiAobmV4dEJ5dGVzTWF0Y2goYnVmZmVyLCBieXRlc1RvU2VhcmNoLCBpbmRleCkpIHtcblx0XHRcdHJldHVybiBpbmRleDtcblx0XHR9XG5cblx0XHRpbmRleCA9IGJ1ZmZlci5pbmRleE9mKGJ5dGVzVG9TZWFyY2hbMF0sIGluZGV4ICsgMSk7XG5cdH1cblxuXHRyZXR1cm4gLTE7XG59O1xuXG5leHBvcnRzLnVpbnQ4QXJyYXlVdGY4Qnl0ZVN0cmluZyA9IHVpbnQ4QXJyYXlVdGY4Qnl0ZVN0cmluZztcbiIsIi8qISBpZWVlNzU0LiBCU0QtMy1DbGF1c2UgTGljZW5zZS4gRmVyb3NzIEFib3VraGFkaWplaCA8aHR0cHM6Ly9mZXJvc3Mub3JnL29wZW5zb3VyY2U+ICovXG5leHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IChlICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IChtICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKCh2YWx1ZSAqIGMpIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vZWxlY3Ryb24vZWxlY3Ryb24vaXNzdWVzLzIyODhcbmZ1bmN0aW9uIGlzRWxlY3Ryb24oKSB7XG4gICAgLy8gUmVuZGVyZXIgcHJvY2Vzc1xuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93LnByb2Nlc3MgPT09ICdvYmplY3QnICYmIHdpbmRvdy5wcm9jZXNzLnR5cGUgPT09ICdyZW5kZXJlcicpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gTWFpbiBwcm9jZXNzXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgcHJvY2Vzcy52ZXJzaW9ucyA9PT0gJ29iamVjdCcgJiYgISFwcm9jZXNzLnZlcnNpb25zLmVsZWN0cm9uKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIERldGVjdCB0aGUgdXNlciBhZ2VudCB3aGVuIHRoZSBgbm9kZUludGVncmF0aW9uYCBvcHRpb24gaXMgc2V0IHRvIHRydWVcbiAgICBpZiAodHlwZW9mIG5hdmlnYXRvciA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG5hdmlnYXRvci51c2VyQWdlbnQgPT09ICdzdHJpbmcnICYmIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignRWxlY3Ryb24nKSA+PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0VsZWN0cm9uO1xuIiwiXG4vKipcbiAqIEV4cG9zZSBgaXNVcmxgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gaXNVcmw7XG5cbi8qKlxuICogUmVnRXhwcy5cbiAqIEEgVVJMIG11c3QgbWF0Y2ggIzEgYW5kIHRoZW4gYXQgbGVhc3Qgb25lIG9mICMyLyMzLlxuICogVXNlIHR3byBsZXZlbHMgb2YgUkVzIHRvIGF2b2lkIFJFRE9TLlxuICovXG5cbnZhciBwcm90b2NvbEFuZERvbWFpblJFID0gL14oPzpcXHcrOik/XFwvXFwvKFxcUyspJC87XG5cbnZhciBsb2NhbGhvc3REb21haW5SRSA9IC9ebG9jYWxob3N0W1xcOj9cXGRdKig/OlteXFw6P1xcZF1cXFMqKT8kL1xudmFyIG5vbkxvY2FsaG9zdERvbWFpblJFID0gL15bXlxcc1xcLl0rXFwuXFxTezIsfSQvO1xuXG4vKipcbiAqIExvb3NlbHkgdmFsaWRhdGUgYSBVUkwgYHN0cmluZ2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZ1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5mdW5jdGlvbiBpc1VybChzdHJpbmcpe1xuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgbWF0Y2ggPSBzdHJpbmcubWF0Y2gocHJvdG9jb2xBbmREb21haW5SRSk7XG4gIGlmICghbWF0Y2gpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgZXZlcnl0aGluZ0FmdGVyUHJvdG9jb2wgPSBtYXRjaFsxXTtcbiAgaWYgKCFldmVyeXRoaW5nQWZ0ZXJQcm90b2NvbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChsb2NhbGhvc3REb21haW5SRS50ZXN0KGV2ZXJ5dGhpbmdBZnRlclByb3RvY29sKSB8fFxuICAgICAgbm9uTG9jYWxob3N0RG9tYWluUkUudGVzdChldmVyeXRoaW5nQWZ0ZXJQcm90b2NvbCkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxudmFyIHJ1bnRpbWUgPSAoZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcbiAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcbiAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICBmdW5jdGlvbiBkZWZpbmUob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqW2tleV07XG4gIH1cbiAgdHJ5IHtcbiAgICAvLyBJRSA4IGhhcyBhIGJyb2tlbiBPYmplY3QuZGVmaW5lUHJvcGVydHkgdGhhdCBvbmx5IHdvcmtzIG9uIERPTSBvYmplY3RzLlxuICAgIGRlZmluZSh7fSwgXCJcIik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGRlZmluZSA9IGZ1bmN0aW9uKG9iaiwga2V5LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIG9ialtrZXldID0gdmFsdWU7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIGV4cG9ydHMud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIGRlZmluZShJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG5cbiAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG4gIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG4gICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG4gICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgZGVmaW5lKEdwLCBcImNvbnN0cnVjdG9yXCIsIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgZGVmaW5lKEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLCBcImNvbnN0cnVjdG9yXCIsIEdlbmVyYXRvckZ1bmN0aW9uKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBkZWZpbmUoXG4gICAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUsXG4gICAgdG9TdHJpbmdUYWdTeW1ib2wsXG4gICAgXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICk7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgZGVmaW5lKHByb3RvdHlwZSwgbWV0aG9kLCBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIGV4cG9ydHMubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgZGVmaW5lKGdlbkZ1biwgdG9TdHJpbmdUYWdTeW1ib2wsIFwiR2VuZXJhdG9yRnVuY3Rpb25cIik7XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvciwgUHJvbWlzZUltcGwpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGhhbmRsZWQgdGhlcmUuXG4gICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZUltcGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBkZWZpbmUoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUsIGFzeW5jSXRlcmF0b3JTeW1ib2wsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG4gIGV4cG9ydHMuQXN5bmNJdGVyYXRvciA9IEFzeW5jSXRlcmF0b3I7XG5cbiAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZlxuICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2ZcbiAgLy8gdGhlIGZpbmFsIHJlc3VsdCBwcm9kdWNlZCBieSB0aGUgaXRlcmF0b3IuXG4gIGV4cG9ydHMuYXN5bmMgPSBmdW5jdGlvbihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCwgUHJvbWlzZUltcGwpIHtcbiAgICBpZiAoUHJvbWlzZUltcGwgPT09IHZvaWQgMCkgUHJvbWlzZUltcGwgPSBQcm9taXNlO1xuXG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcbiAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpLFxuICAgICAgUHJvbWlzZUltcGxcbiAgICApO1xuXG4gICAgcmV0dXJuIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIC8vIE5vdGU6IFtcInJldHVyblwiXSBtdXN0IGJlIHVzZWQgZm9yIEVTMyBwYXJzaW5nIGNvbXBhdGliaWxpdHkuXG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvcltcInJldHVyblwiXSkge1xuICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG4gICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cbiAgICBpZiAoISBpbmZvKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXG4gICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXG4gICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcbiAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcbiAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG4gICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcbiAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG4gICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcbiAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIGRlZmluZShHcCwgdG9TdHJpbmdUYWdTeW1ib2wsIFwiR2VuZXJhdG9yXCIpO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgZGVmaW5lKEdwLCBpdGVyYXRvclN5bWJvbCwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIGRlZmluZShHcCwgXCJ0b1N0cmluZ1wiLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBleHBvcnRzLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgZXhwb3J0cy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlXG4gIC8vIG9yIG5vdCwgcmV0dXJuIHRoZSBydW50aW1lIG9iamVjdCBzbyB0aGF0IHdlIGNhbiBkZWNsYXJlIHRoZSB2YXJpYWJsZVxuICAvLyByZWdlbmVyYXRvclJ1bnRpbWUgaW4gdGhlIG91dGVyIHNjb3BlLCB3aGljaCBhbGxvd3MgdGhpcyBtb2R1bGUgdG8gYmVcbiAgLy8gaW5qZWN0ZWQgZWFzaWx5IGJ5IGBiaW4vcmVnZW5lcmF0b3IgLS1pbmNsdWRlLXJ1bnRpbWUgc2NyaXB0LmpzYC5cbiAgcmV0dXJuIGV4cG9ydHM7XG5cbn0oXG4gIC8vIElmIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZSwgdXNlIG1vZHVsZS5leHBvcnRzXG4gIC8vIGFzIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgbmFtZXNwYWNlLiBPdGhlcndpc2UgY3JlYXRlIGEgbmV3IGVtcHR5XG4gIC8vIG9iamVjdC4gRWl0aGVyIHdheSwgdGhlIHJlc3VsdGluZyBvYmplY3Qgd2lsbCBiZSB1c2VkIHRvIGluaXRpYWxpemVcbiAgLy8gdGhlIHJlZ2VuZXJhdG9yUnVudGltZSB2YXJpYWJsZSBhdCB0aGUgdG9wIG9mIHRoaXMgZmlsZS5cbiAgdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiA/IG1vZHVsZS5leHBvcnRzIDoge31cbikpO1xuXG50cnkge1xuICByZWdlbmVyYXRvclJ1bnRpbWUgPSBydW50aW1lO1xufSBjYXRjaCAoYWNjaWRlbnRhbFN0cmljdE1vZGUpIHtcbiAgLy8gVGhpcyBtb2R1bGUgc2hvdWxkIG5vdCBiZSBydW5uaW5nIGluIHN0cmljdCBtb2RlLCBzbyB0aGUgYWJvdmVcbiAgLy8gYXNzaWdubWVudCBzaG91bGQgYWx3YXlzIHdvcmsgdW5sZXNzIHNvbWV0aGluZyBpcyBtaXNjb25maWd1cmVkLiBKdXN0XG4gIC8vIGluIGNhc2UgcnVudGltZS5qcyBhY2NpZGVudGFsbHkgcnVucyBpbiBzdHJpY3QgbW9kZSwgaW4gbW9kZXJuIGVuZ2luZXNcbiAgLy8gd2UgY2FuIGV4cGxpY2l0bHkgYWNjZXNzIGdsb2JhbFRoaXMuIEluIG9sZGVyIGVuZ2luZXMgd2UgY2FuIGVzY2FwZVxuICAvLyBzdHJpY3QgbW9kZSB1c2luZyBhIGdsb2JhbCBGdW5jdGlvbiBjYWxsLiBUaGlzIGNvdWxkIGNvbmNlaXZhYmx5IGZhaWxcbiAgLy8gaWYgYSBDb250ZW50IFNlY3VyaXR5IFBvbGljeSBmb3JiaWRzIHVzaW5nIEZ1bmN0aW9uLCBidXQgaW4gdGhhdCBjYXNlXG4gIC8vIHRoZSBwcm9wZXIgc29sdXRpb24gaXMgdG8gZml4IHRoZSBhY2NpZGVudGFsIHN0cmljdCBtb2RlIHByb2JsZW0uIElmXG4gIC8vIHlvdSd2ZSBtaXNjb25maWd1cmVkIHlvdXIgYnVuZGxlciB0byBmb3JjZSBzdHJpY3QgbW9kZSBhbmQgYXBwbGllZCBhXG4gIC8vIENTUCB0byBmb3JiaWQgRnVuY3Rpb24sIGFuZCB5b3UncmUgbm90IHdpbGxpbmcgdG8gZml4IGVpdGhlciBvZiB0aG9zZVxuICAvLyBwcm9ibGVtcywgcGxlYXNlIGRldGFpbCB5b3VyIHVuaXF1ZSBwcmVkaWNhbWVudCBpbiBhIEdpdEh1YiBpc3N1ZS5cbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSBcIm9iamVjdFwiKSB7XG4gICAgZ2xvYmFsVGhpcy5yZWdlbmVyYXRvclJ1bnRpbWUgPSBydW50aW1lO1xuICB9IGVsc2Uge1xuICAgIEZ1bmN0aW9uKFwiclwiLCBcInJlZ2VuZXJhdG9yUnVudGltZSA9IHJcIikocnVudGltZSk7XG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBiaWdJbnQ9KCk9Pihhc3luYyBlPT57dHJ5e3JldHVybihhd2FpdCBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZShlKSkuaW5zdGFuY2UuZXhwb3J0cy5iKEJpZ0ludCgwKSk9PT1CaWdJbnQoMCl9Y2F0Y2goZSl7cmV0dXJuITF9fSkobmV3IFVpbnQ4QXJyYXkoWzAsOTcsMTE1LDEwOSwxLDAsMCwwLDEsNiwxLDk2LDEsMTI2LDEsMTI2LDMsMiwxLDAsNyw1LDEsMSw5OCwwLDAsMTAsNiwxLDQsMCwzMiwwLDExXSkpLGJ1bGtNZW1vcnk9YXN5bmMoKT0+V2ViQXNzZW1ibHkudmFsaWRhdGUobmV3IFVpbnQ4QXJyYXkoWzAsOTcsMTE1LDEwOSwxLDAsMCwwLDEsNCwxLDk2LDAsMCwzLDIsMSwwLDUsMywxLDAsMSwxMCwxNCwxLDEyLDAsNjUsMCw2NSwwLDY1LDAsMjUyLDEwLDAsMCwxMV0pKSxleGNlcHRpb25zPWFzeW5jKCk9PldlYkFzc2VtYmx5LnZhbGlkYXRlKG5ldyBVaW50OEFycmF5KFswLDk3LDExNSwxMDksMSwwLDAsMCwxLDQsMSw5NiwwLDAsMywyLDEsMCwxMCw4LDEsNiwwLDYsNjQsMjUsMTEsMTFdKSksbXVsdGlWYWx1ZT1hc3luYygpPT5XZWJBc3NlbWJseS52YWxpZGF0ZShuZXcgVWludDhBcnJheShbMCw5NywxMTUsMTA5LDEsMCwwLDAsMSw2LDEsOTYsMCwyLDEyNywxMjcsMywyLDEsMCwxMCw4LDEsNiwwLDY1LDAsNjUsMCwxMV0pKSxtdXRhYmxlR2xvYmFscz1hc3luYygpPT5XZWJBc3NlbWJseS52YWxpZGF0ZShuZXcgVWludDhBcnJheShbMCw5NywxMTUsMTA5LDEsMCwwLDAsMiw4LDEsMSw5NywxLDk4LDMsMTI3LDEsNiw2LDEsMTI3LDEsNjUsMCwxMSw3LDUsMSwxLDk3LDMsMV0pKSxyZWZlcmVuY2VUeXBlcz1hc3luYygpPT5XZWJBc3NlbWJseS52YWxpZGF0ZShuZXcgVWludDhBcnJheShbMCw5NywxMTUsMTA5LDEsMCwwLDAsMSw0LDEsOTYsMCwwLDMsMiwxLDAsMTAsNywxLDUsMCwyMDgsMTEyLDI2LDExXSkpLHNhdHVyYXRlZEZsb2F0VG9JbnQ9YXN5bmMoKT0+V2ViQXNzZW1ibHkudmFsaWRhdGUobmV3IFVpbnQ4QXJyYXkoWzAsOTcsMTE1LDEwOSwxLDAsMCwwLDEsNCwxLDk2LDAsMCwzLDIsMSwwLDEwLDEyLDEsMTAsMCw2NywwLDAsMCwwLDI1MiwwLDI2LDExXSkpLHNpZ25FeHRlbnNpb25zPWFzeW5jKCk9PldlYkFzc2VtYmx5LnZhbGlkYXRlKG5ldyBVaW50OEFycmF5KFswLDk3LDExNSwxMDksMSwwLDAsMCwxLDQsMSw5NiwwLDAsMywyLDEsMCwxMCw4LDEsNiwwLDY1LDAsMTkyLDI2LDExXSkpLHNpbWQ9YXN5bmMoKT0+V2ViQXNzZW1ibHkudmFsaWRhdGUobmV3IFVpbnQ4QXJyYXkoWzAsOTcsMTE1LDEwOSwxLDAsMCwwLDEsNSwxLDk2LDAsMSwxMjMsMywyLDEsMCwxMCwxMCwxLDgsMCw2NSwwLDI1MywxNSwyNTMsOTgsMTFdKSksdGFpbENhbGw9YXN5bmMoKT0+V2ViQXNzZW1ibHkudmFsaWRhdGUobmV3IFVpbnQ4QXJyYXkoWzAsOTcsMTE1LDEwOSwxLDAsMCwwLDEsNCwxLDk2LDAsMCwzLDIsMSwwLDEwLDYsMSw0LDAsMTgsMCwxMV0pKSx0aHJlYWRzPSgpPT4oYXN5bmMgZT0+e3RyeXtyZXR1cm5cInVuZGVmaW5lZFwiIT10eXBlb2YgTWVzc2FnZUNoYW5uZWwmJihuZXcgTWVzc2FnZUNoYW5uZWwpLnBvcnQxLnBvc3RNZXNzYWdlKG5ldyBTaGFyZWRBcnJheUJ1ZmZlcigxKSksV2ViQXNzZW1ibHkudmFsaWRhdGUoZSl9Y2F0Y2goZSl7cmV0dXJuITF9fSkobmV3IFVpbnQ4QXJyYXkoWzAsOTcsMTE1LDEwOSwxLDAsMCwwLDEsNCwxLDk2LDAsMCwzLDIsMSwwLDUsNCwxLDMsMSwxLDEwLDExLDEsOSwwLDY1LDAsMjU0LDE2LDIsMCwyNiwxMV0pKTtcbiIsIi8qKiBAbGljZW5zZSB6bGliLmpzIDIwMTIgLSBpbWF5YSBbIGh0dHBzOi8vZ2l0aHViLmNvbS9pbWF5YS96bGliLmpzIF0gVGhlIE1JVCBMaWNlbnNlICovKGZ1bmN0aW9uKCkgeyd1c2Ugc3RyaWN0JztmdW5jdGlvbiBxKGIpe3Rocm93IGI7fXZhciB0PXZvaWQgMCx2PSEwO3ZhciBCPVwidW5kZWZpbmVkXCIhPT10eXBlb2YgVWludDhBcnJheSYmXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBVaW50MTZBcnJheSYmXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBVaW50MzJBcnJheSYmXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBEYXRhVmlldztmdW5jdGlvbiBHKGIsYSl7dGhpcy5pbmRleD1cIm51bWJlclwiPT09dHlwZW9mIGE/YTowO3RoaXMubT0wO3RoaXMuYnVmZmVyPWIgaW5zdGFuY2VvZihCP1VpbnQ4QXJyYXk6QXJyYXkpP2I6bmV3IChCP1VpbnQ4QXJyYXk6QXJyYXkpKDMyNzY4KTsyKnRoaXMuYnVmZmVyLmxlbmd0aDw9dGhpcy5pbmRleCYmcShFcnJvcihcImludmFsaWQgaW5kZXhcIikpO3RoaXMuYnVmZmVyLmxlbmd0aDw9dGhpcy5pbmRleCYmdGhpcy5mKCl9Ry5wcm90b3R5cGUuZj1mdW5jdGlvbigpe3ZhciBiPXRoaXMuYnVmZmVyLGEsYz1iLmxlbmd0aCxkPW5ldyAoQj9VaW50OEFycmF5OkFycmF5KShjPDwxKTtpZihCKWQuc2V0KGIpO2Vsc2UgZm9yKGE9MDthPGM7KythKWRbYV09YlthXTtyZXR1cm4gdGhpcy5idWZmZXI9ZH07XG5HLnByb3RvdHlwZS5kPWZ1bmN0aW9uKGIsYSxjKXt2YXIgZD10aGlzLmJ1ZmZlcixlPXRoaXMuaW5kZXgsZj10aGlzLm0sZz1kW2VdLGs7YyYmMTxhJiYoYj04PGE/KElbYiYyNTVdPDwyNHxJW2I+Pj44JjI1NV08PDE2fElbYj4+PjE2JjI1NV08PDh8SVtiPj4+MjQmMjU1XSk+PjMyLWE6SVtiXT4+OC1hKTtpZig4PmErZilnPWc8PGF8YixmKz1hO2Vsc2UgZm9yKGs9MDtrPGE7KytrKWc9Zzw8MXxiPj5hLWstMSYxLDg9PT0rK2YmJihmPTAsZFtlKytdPUlbZ10sZz0wLGU9PT1kLmxlbmd0aCYmKGQ9dGhpcy5mKCkpKTtkW2VdPWc7dGhpcy5idWZmZXI9ZDt0aGlzLm09Zjt0aGlzLmluZGV4PWV9O0cucHJvdG90eXBlLmZpbmlzaD1mdW5jdGlvbigpe3ZhciBiPXRoaXMuYnVmZmVyLGE9dGhpcy5pbmRleCxjOzA8dGhpcy5tJiYoYlthXTw8PTgtdGhpcy5tLGJbYV09SVtiW2FdXSxhKyspO0I/Yz1iLnN1YmFycmF5KDAsYSk6KGIubGVuZ3RoPWEsYz1iKTtyZXR1cm4gY307XG52YXIgYWE9bmV3IChCP1VpbnQ4QXJyYXk6QXJyYXkpKDI1NiksTDtmb3IoTD0wOzI1Nj5MOysrTCl7Zm9yKHZhciBSPUwsYmE9UixjYT03LFI9Uj4+PjE7UjtSPj4+PTEpYmE8PD0xLGJhfD1SJjEsLS1jYTthYVtMXT0oYmE8PGNhJjI1NSk+Pj4wfXZhciBJPWFhO2Z1bmN0aW9uIGhhKGIsYSxjKXt2YXIgZCxlPVwibnVtYmVyXCI9PT10eXBlb2YgYT9hOmE9MCxmPVwibnVtYmVyXCI9PT10eXBlb2YgYz9jOmIubGVuZ3RoO2Q9LTE7Zm9yKGU9ZiY3O2UtLTsrK2EpZD1kPj4+OF5TWyhkXmJbYV0pJjI1NV07Zm9yKGU9Zj4+MztlLS07YSs9OClkPWQ+Pj44XlNbKGReYlthXSkmMjU1XSxkPWQ+Pj44XlNbKGReYlthKzFdKSYyNTVdLGQ9ZD4+PjheU1soZF5iW2ErMl0pJjI1NV0sZD1kPj4+OF5TWyhkXmJbYSszXSkmMjU1XSxkPWQ+Pj44XlNbKGReYlthKzRdKSYyNTVdLGQ9ZD4+PjheU1soZF5iW2ErNV0pJjI1NV0sZD1kPj4+OF5TWyhkXmJbYSs2XSkmMjU1XSxkPWQ+Pj44XlNbKGReYlthKzddKSYyNTVdO3JldHVybihkXjQyOTQ5NjcyOTUpPj4+MH1cbnZhciBpYT1bMCwxOTk2OTU5ODk0LDM5OTM5MTk3ODgsMjU2NzUyNDc5NCwxMjQ2MzQxMzcsMTg4NjA1NzYxNSwzOTE1NjIxNjg1LDI2NTczOTIwMzUsMjQ5MjY4Mjc0LDIwNDQ1MDgzMjQsMzc3MjExNTIzMCwyNTQ3MTc3ODY0LDE2Mjk0MTk5NSwyMTI1NTYxMDIxLDM4ODc2MDcwNDcsMjQyODQ0NDA0OSw0OTg1MzY1NDgsMTc4OTkyNzY2Niw0MDg5MDE2NjQ4LDIyMjcwNjEyMTQsNDUwNTQ4ODYxLDE4NDMyNTg2MDMsNDEwNzU4MDc1MywyMjExNjc3NjM5LDMyNTg4Mzk5MCwxNjg0Nzc3MTUyLDQyNTExMjIwNDIsMjMyMTkyNjYzNiwzMzU2MzM0ODcsMTY2MTM2NTQ2NSw0MTk1MzAyNzU1LDIzNjYxMTUzMTcsOTk3MDczMDk2LDEyODE5NTM4ODYsMzU3OTg1NTMzMiwyNzI0Njg4MjQyLDEwMDY4ODgxNDUsMTI1ODYwNzY4NywzNTI0MTAxNjI5LDI3Njg5NDI0NDMsOTAxMDk3NzIyLDExMTkwMDA2ODQsMzY4NjUxNzIwNiwyODk4MDY1NzI4LDg1MzA0NDQ1MSwxMTcyMjY2MTAxLDM3MDUwMTU3NTksXG4yODgyNjE2NjY1LDY1MTc2Nzk4MCwxMzczNTAzNTQ2LDMzNjk1NTQzMDQsMzIxODEwNDU5OCw1NjU1MDcyNTMsMTQ1NDYyMTczMSwzNDg1MTExNzA1LDMwOTk0MzYzMDMsNjcxMjY2OTc0LDE1OTQxOTgwMjQsMzMyMjczMDkzMCwyOTcwMzQ3ODEyLDc5NTgzNTUyNywxNDgzMjMwMjI1LDMyNDQzNjcyNzUsMzA2MDE0OTU2NSwxOTk0MTQ2MTkyLDMxMTU4NTM0LDI1NjM5MDc3NzIsNDAyMzcxNzkzMCwxOTA3NDU5NDY1LDExMjYzNzIxNSwyNjgwMTUzMjUzLDM5MDQ0MjcwNTksMjAxMzc3NjI5MCwyNTE3MjIwMzYsMjUxNzIxNTM3NCwzNzc1ODMwMDQwLDIxMzc2NTY3NjMsMTQxMzc2ODEzLDI0MzkyNzc3MTksMzg2NTI3MTI5NywxODAyMTk1NDQ0LDQ3Njg2NDg2NiwyMjM4MDAxMzY4LDQwNjY1MDg4NzgsMTgxMjM3MDkyNSw0NTMwOTI3MzEsMjE4MTYyNTAyNSw0MTExNDUxMjIzLDE3MDYwODg5MDIsMzE0MDQyNzA0LDIzNDQ1MzIyMDIsNDI0MDAxNzUzMiwxNjU4NjU4MjcxLDM2NjYxOTk3NyxcbjIzNjI2NzAzMjMsNDIyNDk5NDQwNSwxMzAzNTM1OTYwLDk4NDk2MTQ4NiwyNzQ3MDA3MDkyLDM1NjkwMzc1MzgsMTI1NjE3MDgxNywxMDM3NjA0MzExLDI3NjUyMTA3MzMsMzU1NDA3OTk5NSwxMTMxMDE0NTA2LDg3OTY3OTk5NiwyOTA5MjQzNDYyLDM2NjM3NzE4NTYsMTE0MTEyNDQ2Nyw4NTU4NDIyNzcsMjg1MjgwMTYzMSwzNzA4NjQ4NjQ5LDEzNDI1MzM5NDgsNjU0NDU5MzA2LDMxODgzOTYwNDgsMzM3MzAxNTE3NCwxNDY2NDc5OTA5LDU0NDE3OTYzNSwzMTEwNTIzOTEzLDM0NjI1MjIwMTUsMTU5MTY3MTA1NCw3MDIxMzg3NzYsMjk2NjQ2MDQ1MCwzMzUyNzk5NDEyLDE1MDQ5MTg4MDcsNzgzNTUxODczLDMwODI2NDA0NDMsMzIzMzQ0Mjk4OSwzOTg4MjkyMzg0LDI1OTYyNTQ2NDYsNjIzMTcwNjgsMTk1NzgxMDg0MiwzOTM5ODQ1OTQ1LDI2NDc4MTYxMTEsODE0NzA5OTcsMTk0MzgwMzUyMywzODE0OTE4OTMwLDI0ODk1OTY4MDQsMjI1Mjc0NDMwLDIwNTM3OTAzNzYsMzgyNjE3NTc1NSxcbjI0NjY5MDYwMTMsMTY3ODE2NzQzLDIwOTc2NTEzNzcsNDAyNzU1MjU4MCwyMjY1NDkwMzg2LDUwMzQ0NDA3MiwxNzYyMDUwODE0LDQxNTA0MTcyNDUsMjE1NDEyOTM1NSw0MjY1MjIyMjUsMTg1MjUwNzg3OSw0Mjc1MzEzNTI2LDIzMTIzMTc5MjAsMjgyNzUzNjI2LDE3NDI1NTU4NTIsNDE4OTcwODE0MywyMzk0ODc3OTQ1LDM5NzkxNzc2MywxNjIyMTgzNjM3LDM2MDQzOTA4ODgsMjcxNDg2NjU1OCw5NTM3Mjk3MzIsMTM0MDA3NjYyNiwzNTE4NzE5OTg1LDI3OTczNjA5OTksMTA2ODgyODM4MSwxMjE5NjM4ODU5LDM2MjQ3NDE4NTAsMjkzNjY3NTE0OCw5MDYxODU0NjIsMTA5MDgxMjUxMiwzNzQ3NjcyMDAzLDI4MjUzNzk2NjksODI5MzI5MTM1LDExODEzMzUxNjEsMzQxMjE3NzgwNCwzMTYwODM0ODQyLDYyODA4NTQwOCwxMzgyNjA1MzY2LDM0MjMzNjkxMDksMzEzODA3ODQ2Nyw1NzA1NjIyMzMsMTQyNjQwMDgxNSwzMzE3MzE2NTQyLDI5OTg3MzM2MDgsNzMzMjM5OTU0LDE1NTUyNjE5NTYsXG4zMjY4OTM1NTkxLDMwNTAzNjA2MjUsNzUyNDU5NDAzLDE1NDEzMjAyMjEsMjYwNzA3MTkyMCwzOTY1OTczMDMwLDE5Njk5MjI5NzIsNDA3MzU0OTgsMjYxNzgzNzIyNSwzOTQzNTc3MTUxLDE5MTMwODc4NzcsODM5MDgzNzEsMjUxMjM0MTYzNCwzODAzNzQwNjkyLDIwNzUyMDg2MjIsMjEzMjYxMTEyLDI0NjMyNzI2MDMsMzg1NTk5MDI4NSwyMDk0ODU0MDcxLDE5ODk1ODg4MSwyMjYyMDI5MDEyLDQwNTcyNjA2MTAsMTc1OTM1OTk5Miw1MzQ0MTQxOTAsMjE3NjcxODU0MSw0MTM5MzI5MTE1LDE4NzM4MzYwMDEsNDE0NjY0NTY3LDIyODIyNDg5MzQsNDI3OTIwMDM2OCwxNzExNjg0NTU0LDI4NTI4MTExNiwyNDA1ODAxNzI3LDQxNjcyMTY3NDUsMTYzNDQ2Nzc5NSwzNzYyMjk3MDEsMjY4NTA2Nzg5NiwzNjA4MDA3NDA2LDEzMDg5MTg2MTIsOTU2NTQzOTM4LDI4MDg1NTUxMDUsMzQ5NTk1ODI2MywxMjMxNjM2MzAxLDEwNDc0MjcwMzUsMjkzMjk1OTgxOCwzNjU0NzAzODM2LDEwODgzNTkyNzAsXG45MzY5MThFMywyODQ3NzE0ODk5LDM3MzY4Mzc4MjksMTIwMjkwMDg2Myw4MTcyMzM4OTcsMzE4MzM0MjEwOCwzNDAxMjM3MTMwLDE0MDQyNzc1NTIsNjE1ODE4MTUwLDMxMzQyMDc0OTMsMzQ1MzQyMTIwMywxNDIzODU3NDQ5LDYwMTQ1MDQzMSwzMDA5ODM3NjE0LDMyOTQ3MTA0NTYsMTU2NzEwMzc0Niw3MTE5Mjg3MjQsMzAyMDY2ODQ3MSwzMjcyMzgwMDY1LDE1MTAzMzQyMzUsNzU1MTY3MTE3XSxTPUI/bmV3IFVpbnQzMkFycmF5KGlhKTppYTtmdW5jdGlvbiBqYSgpe307ZnVuY3Rpb24ga2EoYil7dGhpcy5idWZmZXI9bmV3IChCP1VpbnQxNkFycmF5OkFycmF5KSgyKmIpO3RoaXMubGVuZ3RoPTB9a2EucHJvdG90eXBlLmdldFBhcmVudD1mdW5jdGlvbihiKXtyZXR1cm4gMiooKGItMikvNHwwKX07a2EucHJvdG90eXBlLnB1c2g9ZnVuY3Rpb24oYixhKXt2YXIgYyxkLGU9dGhpcy5idWZmZXIsZjtjPXRoaXMubGVuZ3RoO2VbdGhpcy5sZW5ndGgrK109YTtmb3IoZVt0aGlzLmxlbmd0aCsrXT1iOzA8YzspaWYoZD10aGlzLmdldFBhcmVudChjKSxlW2NdPmVbZF0pZj1lW2NdLGVbY109ZVtkXSxlW2RdPWYsZj1lW2MrMV0sZVtjKzFdPWVbZCsxXSxlW2QrMV09ZixjPWQ7ZWxzZSBicmVhaztyZXR1cm4gdGhpcy5sZW5ndGh9O1xua2EucHJvdG90eXBlLnBvcD1mdW5jdGlvbigpe3ZhciBiLGEsYz10aGlzLmJ1ZmZlcixkLGUsZjthPWNbMF07Yj1jWzFdO3RoaXMubGVuZ3RoLT0yO2NbMF09Y1t0aGlzLmxlbmd0aF07Y1sxXT1jW3RoaXMubGVuZ3RoKzFdO2ZvcihmPTA7Oyl7ZT0yKmYrMjtpZihlPj10aGlzLmxlbmd0aClicmVhaztlKzI8dGhpcy5sZW5ndGgmJmNbZSsyXT5jW2VdJiYoZSs9Mik7aWYoY1tlXT5jW2ZdKWQ9Y1tmXSxjW2ZdPWNbZV0sY1tlXT1kLGQ9Y1tmKzFdLGNbZisxXT1jW2UrMV0sY1tlKzFdPWQ7ZWxzZSBicmVhaztmPWV9cmV0dXJue2luZGV4OmIsdmFsdWU6YSxsZW5ndGg6dGhpcy5sZW5ndGh9fTtmdW5jdGlvbiBUKGIpe3ZhciBhPWIubGVuZ3RoLGM9MCxkPU51bWJlci5QT1NJVElWRV9JTkZJTklUWSxlLGYsZyxrLGgsbSxyLHAsbCxuO2ZvcihwPTA7cDxhOysrcCliW3BdPmMmJihjPWJbcF0pLGJbcF08ZCYmKGQ9YltwXSk7ZT0xPDxjO2Y9bmV3IChCP1VpbnQzMkFycmF5OkFycmF5KShlKTtnPTE7az0wO2ZvcihoPTI7Zzw9Yzspe2ZvcihwPTA7cDxhOysrcClpZihiW3BdPT09Zyl7bT0wO3I9aztmb3IobD0wO2w8ZzsrK2wpbT1tPDwxfHImMSxyPj49MTtuPWc8PDE2fHA7Zm9yKGw9bTtsPGU7bCs9aClmW2xdPW47KytrfSsrZztrPDw9MTtoPDw9MX1yZXR1cm5bZixjLGRdfTtmdW5jdGlvbiBuYShiLGEpe3RoaXMuaz1vYTt0aGlzLkY9MDt0aGlzLmlucHV0PUImJmIgaW5zdGFuY2VvZiBBcnJheT9uZXcgVWludDhBcnJheShiKTpiO3RoaXMuYj0wO2EmJihhLmxhenkmJih0aGlzLkY9YS5sYXp5KSxcIm51bWJlclwiPT09dHlwZW9mIGEuY29tcHJlc3Npb25UeXBlJiYodGhpcy5rPWEuY29tcHJlc3Npb25UeXBlKSxhLm91dHB1dEJ1ZmZlciYmKHRoaXMuYT1CJiZhLm91dHB1dEJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5P25ldyBVaW50OEFycmF5KGEub3V0cHV0QnVmZmVyKTphLm91dHB1dEJ1ZmZlciksXCJudW1iZXJcIj09PXR5cGVvZiBhLm91dHB1dEluZGV4JiYodGhpcy5iPWEub3V0cHV0SW5kZXgpKTt0aGlzLmF8fCh0aGlzLmE9bmV3IChCP1VpbnQ4QXJyYXk6QXJyYXkpKDMyNzY4KSl9dmFyIG9hPTIscGE9e05PTkU6MCxMOjEsdDpvYSxYOjN9LHFhPVtdLFU7XG5mb3IoVT0wOzI4OD5VO1UrKylzd2l0Y2godil7Y2FzZSAxNDM+PVU6cWEucHVzaChbVSs0OCw4XSk7YnJlYWs7Y2FzZSAyNTU+PVU6cWEucHVzaChbVS0xNDQrNDAwLDldKTticmVhaztjYXNlIDI3OT49VTpxYS5wdXNoKFtVLTI1NiswLDddKTticmVhaztjYXNlIDI4Nz49VTpxYS5wdXNoKFtVLTI4MCsxOTIsOF0pO2JyZWFrO2RlZmF1bHQ6cShcImludmFsaWQgbGl0ZXJhbDogXCIrVSl9XG5uYS5wcm90b3R5cGUuaD1mdW5jdGlvbigpe3ZhciBiLGEsYyxkLGU9dGhpcy5pbnB1dDtzd2l0Y2godGhpcy5rKXtjYXNlIDA6Yz0wO2ZvcihkPWUubGVuZ3RoO2M8ZDspe2E9Qj9lLnN1YmFycmF5KGMsYys2NTUzNSk6ZS5zbGljZShjLGMrNjU1MzUpO2MrPWEubGVuZ3RoO3ZhciBmPWEsZz1jPT09ZCxrPXQsaD10LG09dCxyPXQscD10LGw9dGhpcy5hLG49dGhpcy5iO2lmKEIpe2ZvcihsPW5ldyBVaW50OEFycmF5KHRoaXMuYS5idWZmZXIpO2wubGVuZ3RoPD1uK2YubGVuZ3RoKzU7KWw9bmV3IFVpbnQ4QXJyYXkobC5sZW5ndGg8PDEpO2wuc2V0KHRoaXMuYSl9az1nPzE6MDtsW24rK109a3wwO2g9Zi5sZW5ndGg7bT1+aCs2NTUzNiY2NTUzNTtsW24rK109aCYyNTU7bFtuKytdPWg+Pj44JjI1NTtsW24rK109bSYyNTU7bFtuKytdPW0+Pj44JjI1NTtpZihCKWwuc2V0KGYsbiksbis9Zi5sZW5ndGgsbD1sLnN1YmFycmF5KDAsbik7ZWxzZXtyPTA7Zm9yKHA9Zi5sZW5ndGg7cjxwOysrcilsW24rK109XG5mW3JdO2wubGVuZ3RoPW59dGhpcy5iPW47dGhpcy5hPWx9YnJlYWs7Y2FzZSAxOnZhciBzPW5ldyBHKEI/bmV3IFVpbnQ4QXJyYXkodGhpcy5hLmJ1ZmZlcik6dGhpcy5hLHRoaXMuYik7cy5kKDEsMSx2KTtzLmQoMSwyLHYpO3ZhciB1PXJhKHRoaXMsZSksdyxDLHg7dz0wO2ZvcihDPXUubGVuZ3RoO3c8Qzt3KyspaWYoeD11W3ddLEcucHJvdG90eXBlLmQuYXBwbHkocyxxYVt4XSksMjU2PHgpcy5kKHVbKyt3XSx1Wysrd10sdikscy5kKHVbKyt3XSw1KSxzLmQodVsrK3ddLHVbKyt3XSx2KTtlbHNlIGlmKDI1Nj09PXgpYnJlYWs7dGhpcy5hPXMuZmluaXNoKCk7dGhpcy5iPXRoaXMuYS5sZW5ndGg7YnJlYWs7Y2FzZSBvYTp2YXIgRD1uZXcgRyhCP25ldyBVaW50OEFycmF5KHRoaXMuYS5idWZmZXIpOnRoaXMuYSx0aGlzLmIpLE0seixOLFgsWSxxYj1bMTYsMTcsMTgsMCw4LDcsOSw2LDEwLDUsMTEsNCwxMiwzLDEzLDIsMTQsMSwxNV0sZGEsRmEsZWEsR2EsbGEsdGE9QXJyYXkoMTkpLFxuSGEsWixtYSxFLElhO009b2E7RC5kKDEsMSx2KTtELmQoTSwyLHYpO3o9cmEodGhpcyxlKTtkYT1zYSh0aGlzLlUsMTUpO0ZhPXVhKGRhKTtlYT1zYSh0aGlzLlQsNyk7R2E9dWEoZWEpO2ZvcihOPTI4NjsyNTc8TiYmMD09PWRhW04tMV07Ti0tKTtmb3IoWD0zMDsxPFgmJjA9PT1lYVtYLTFdO1gtLSk7dmFyIEphPU4sS2E9WCxLPW5ldyAoQj9VaW50MzJBcnJheTpBcnJheSkoSmErS2EpLHksTyxBLGZhLEo9bmV3IChCP1VpbnQzMkFycmF5OkFycmF5KSgzMTYpLEgsRixQPW5ldyAoQj9VaW50OEFycmF5OkFycmF5KSgxOSk7Zm9yKHk9Tz0wO3k8SmE7eSsrKUtbTysrXT1kYVt5XTtmb3IoeT0wO3k8S2E7eSsrKUtbTysrXT1lYVt5XTtpZighQil7eT0wO2ZvcihmYT1QLmxlbmd0aDt5PGZhOysreSlQW3ldPTB9eT1IPTA7Zm9yKGZhPUsubGVuZ3RoO3k8ZmE7eSs9Tyl7Zm9yKE89MTt5K088ZmEmJktbeStPXT09PUtbeV07KytPKTtBPU87aWYoMD09PUtbeV0paWYoMz5BKWZvcig7MDxBLS07KUpbSCsrXT1cbjAsUFswXSsrO2Vsc2UgZm9yKDswPEE7KUY9MTM4PkE/QToxMzgsRj5BLTMmJkY8QSYmKEY9QS0zKSwxMD49Rj8oSltIKytdPTE3LEpbSCsrXT1GLTMsUFsxN10rKyk6KEpbSCsrXT0xOCxKW0grK109Ri0xMSxQWzE4XSsrKSxBLT1GO2Vsc2UgaWYoSltIKytdPUtbeV0sUFtLW3ldXSsrLEEtLSwzPkEpZm9yKDswPEEtLTspSltIKytdPUtbeV0sUFtLW3ldXSsrO2Vsc2UgZm9yKDswPEE7KUY9Nj5BP0E6NixGPkEtMyYmRjxBJiYoRj1BLTMpLEpbSCsrXT0xNixKW0grK109Ri0zLFBbMTZdKyssQS09Rn1iPUI/Si5zdWJhcnJheSgwLEgpOkouc2xpY2UoMCxIKTtsYT1zYShQLDcpO2ZvcihFPTA7MTk+RTtFKyspdGFbRV09bGFbcWJbRV1dO2ZvcihZPTE5OzQ8WSYmMD09PXRhW1ktMV07WS0tKTtIYT11YShsYSk7RC5kKE4tMjU3LDUsdik7RC5kKFgtMSw1LHYpO0QuZChZLTQsNCx2KTtmb3IoRT0wO0U8WTtFKyspRC5kKHRhW0VdLDMsdik7RT0wO2ZvcihJYT1iLmxlbmd0aDtFPElhO0UrKylpZihaPVxuYltFXSxELmQoSGFbWl0sbGFbWl0sdiksMTY8PVope0UrKztzd2l0Y2goWil7Y2FzZSAxNjptYT0yO2JyZWFrO2Nhc2UgMTc6bWE9MzticmVhaztjYXNlIDE4Om1hPTc7YnJlYWs7ZGVmYXVsdDpxKFwiaW52YWxpZCBjb2RlOiBcIitaKX1ELmQoYltFXSxtYSx2KX12YXIgTGE9W0ZhLGRhXSxNYT1bR2EsZWFdLFEsTmEsZ2Esd2EsT2EsUGEsUWEsUmE7T2E9TGFbMF07UGE9TGFbMV07UWE9TWFbMF07UmE9TWFbMV07UT0wO2ZvcihOYT16Lmxlbmd0aDtRPE5hOysrUSlpZihnYT16W1FdLEQuZChPYVtnYV0sUGFbZ2FdLHYpLDI1NjxnYSlELmQoelsrK1FdLHpbKytRXSx2KSx3YT16WysrUV0sRC5kKFFhW3dhXSxSYVt3YV0sdiksRC5kKHpbKytRXSx6WysrUV0sdik7ZWxzZSBpZigyNTY9PT1nYSlicmVhazt0aGlzLmE9RC5maW5pc2goKTt0aGlzLmI9dGhpcy5hLmxlbmd0aDticmVhaztkZWZhdWx0OnEoXCJpbnZhbGlkIGNvbXByZXNzaW9uIHR5cGVcIil9cmV0dXJuIHRoaXMuYX07XG5mdW5jdGlvbiB2YShiLGEpe3RoaXMubGVuZ3RoPWI7dGhpcy5OPWF9XG52YXIgeGE9ZnVuY3Rpb24oKXtmdW5jdGlvbiBiKGEpe3N3aXRjaCh2KXtjYXNlIDM9PT1hOnJldHVyblsyNTcsYS0zLDBdO2Nhc2UgND09PWE6cmV0dXJuWzI1OCxhLTQsMF07Y2FzZSA1PT09YTpyZXR1cm5bMjU5LGEtNSwwXTtjYXNlIDY9PT1hOnJldHVyblsyNjAsYS02LDBdO2Nhc2UgNz09PWE6cmV0dXJuWzI2MSxhLTcsMF07Y2FzZSA4PT09YTpyZXR1cm5bMjYyLGEtOCwwXTtjYXNlIDk9PT1hOnJldHVyblsyNjMsYS05LDBdO2Nhc2UgMTA9PT1hOnJldHVyblsyNjQsYS0xMCwwXTtjYXNlIDEyPj1hOnJldHVyblsyNjUsYS0xMSwxXTtjYXNlIDE0Pj1hOnJldHVyblsyNjYsYS0xMywxXTtjYXNlIDE2Pj1hOnJldHVyblsyNjcsYS0xNSwxXTtjYXNlIDE4Pj1hOnJldHVyblsyNjgsYS0xNywxXTtjYXNlIDIyPj1hOnJldHVyblsyNjksYS0xOSwyXTtjYXNlIDI2Pj1hOnJldHVyblsyNzAsYS0yMywyXTtjYXNlIDMwPj1hOnJldHVyblsyNzEsYS0yNywyXTtjYXNlIDM0Pj1hOnJldHVyblsyNzIsXG5hLTMxLDJdO2Nhc2UgNDI+PWE6cmV0dXJuWzI3MyxhLTM1LDNdO2Nhc2UgNTA+PWE6cmV0dXJuWzI3NCxhLTQzLDNdO2Nhc2UgNTg+PWE6cmV0dXJuWzI3NSxhLTUxLDNdO2Nhc2UgNjY+PWE6cmV0dXJuWzI3NixhLTU5LDNdO2Nhc2UgODI+PWE6cmV0dXJuWzI3NyxhLTY3LDRdO2Nhc2UgOTg+PWE6cmV0dXJuWzI3OCxhLTgzLDRdO2Nhc2UgMTE0Pj1hOnJldHVyblsyNzksYS05OSw0XTtjYXNlIDEzMD49YTpyZXR1cm5bMjgwLGEtMTE1LDRdO2Nhc2UgMTYyPj1hOnJldHVyblsyODEsYS0xMzEsNV07Y2FzZSAxOTQ+PWE6cmV0dXJuWzI4MixhLTE2Myw1XTtjYXNlIDIyNj49YTpyZXR1cm5bMjgzLGEtMTk1LDVdO2Nhc2UgMjU3Pj1hOnJldHVyblsyODQsYS0yMjcsNV07Y2FzZSAyNTg9PT1hOnJldHVyblsyODUsYS0yNTgsMF07ZGVmYXVsdDpxKFwiaW52YWxpZCBsZW5ndGg6IFwiK2EpfX12YXIgYT1bXSxjLGQ7Zm9yKGM9MzsyNTg+PWM7YysrKWQ9YihjKSxhW2NdPWRbMl08PDI0fGRbMV08PFxuMTZ8ZFswXTtyZXR1cm4gYX0oKSx5YT1CP25ldyBVaW50MzJBcnJheSh4YSk6eGE7XG5mdW5jdGlvbiByYShiLGEpe2Z1bmN0aW9uIGMoYSxjKXt2YXIgYj1hLk4sZD1bXSxmPTAsZTtlPXlhW2EubGVuZ3RoXTtkW2YrK109ZSY2NTUzNTtkW2YrK109ZT4+MTYmMjU1O2RbZisrXT1lPj4yNDt2YXIgZztzd2l0Y2godil7Y2FzZSAxPT09YjpnPVswLGItMSwwXTticmVhaztjYXNlIDI9PT1iOmc9WzEsYi0yLDBdO2JyZWFrO2Nhc2UgMz09PWI6Zz1bMixiLTMsMF07YnJlYWs7Y2FzZSA0PT09YjpnPVszLGItNCwwXTticmVhaztjYXNlIDY+PWI6Zz1bNCxiLTUsMV07YnJlYWs7Y2FzZSA4Pj1iOmc9WzUsYi03LDFdO2JyZWFrO2Nhc2UgMTI+PWI6Zz1bNixiLTksMl07YnJlYWs7Y2FzZSAxNj49YjpnPVs3LGItMTMsMl07YnJlYWs7Y2FzZSAyND49YjpnPVs4LGItMTcsM107YnJlYWs7Y2FzZSAzMj49YjpnPVs5LGItMjUsM107YnJlYWs7Y2FzZSA0OD49YjpnPVsxMCxiLTMzLDRdO2JyZWFrO2Nhc2UgNjQ+PWI6Zz1bMTEsYi00OSw0XTticmVhaztjYXNlIDk2Pj1iOmc9WzEyLGItXG42NSw1XTticmVhaztjYXNlIDEyOD49YjpnPVsxMyxiLTk3LDVdO2JyZWFrO2Nhc2UgMTkyPj1iOmc9WzE0LGItMTI5LDZdO2JyZWFrO2Nhc2UgMjU2Pj1iOmc9WzE1LGItMTkzLDZdO2JyZWFrO2Nhc2UgMzg0Pj1iOmc9WzE2LGItMjU3LDddO2JyZWFrO2Nhc2UgNTEyPj1iOmc9WzE3LGItMzg1LDddO2JyZWFrO2Nhc2UgNzY4Pj1iOmc9WzE4LGItNTEzLDhdO2JyZWFrO2Nhc2UgMTAyND49YjpnPVsxOSxiLTc2OSw4XTticmVhaztjYXNlIDE1MzY+PWI6Zz1bMjAsYi0xMDI1LDldO2JyZWFrO2Nhc2UgMjA0OD49YjpnPVsyMSxiLTE1MzcsOV07YnJlYWs7Y2FzZSAzMDcyPj1iOmc9WzIyLGItMjA0OSwxMF07YnJlYWs7Y2FzZSA0MDk2Pj1iOmc9WzIzLGItMzA3MywxMF07YnJlYWs7Y2FzZSA2MTQ0Pj1iOmc9WzI0LGItNDA5NywxMV07YnJlYWs7Y2FzZSA4MTkyPj1iOmc9WzI1LGItNjE0NSwxMV07YnJlYWs7Y2FzZSAxMjI4OD49YjpnPVsyNixiLTgxOTMsMTJdO2JyZWFrO2Nhc2UgMTYzODQ+PVxuYjpnPVsyNyxiLTEyMjg5LDEyXTticmVhaztjYXNlIDI0NTc2Pj1iOmc9WzI4LGItMTYzODUsMTNdO2JyZWFrO2Nhc2UgMzI3Njg+PWI6Zz1bMjksYi0yNDU3NywxM107YnJlYWs7ZGVmYXVsdDpxKFwiaW52YWxpZCBkaXN0YW5jZVwiKX1lPWc7ZFtmKytdPWVbMF07ZFtmKytdPWVbMV07ZFtmKytdPWVbMl07dmFyIGgsaztoPTA7Zm9yKGs9ZC5sZW5ndGg7aDxrOysraClsW24rK109ZFtoXTt1W2RbMF1dKys7d1tkWzNdXSsrO3M9YS5sZW5ndGgrYy0xO3A9bnVsbH12YXIgZCxlLGYsZyxrLGg9e30sbSxyLHAsbD1CP25ldyBVaW50MTZBcnJheSgyKmEubGVuZ3RoKTpbXSxuPTAscz0wLHU9bmV3IChCP1VpbnQzMkFycmF5OkFycmF5KSgyODYpLHc9bmV3IChCP1VpbnQzMkFycmF5OkFycmF5KSgzMCksQz1iLkYseDtpZighQil7Zm9yKGY9MDsyODU+PWY7KXVbZisrXT0wO2ZvcihmPTA7Mjk+PWY7KXdbZisrXT0wfXVbMjU2XT0xO2Q9MDtmb3IoZT1hLmxlbmd0aDtkPGU7KytkKXtmPWs9MDtcbmZvcihnPTM7ZjxnJiZkK2YhPT1lOysrZilrPWs8PDh8YVtkK2ZdO2hba109PT10JiYoaFtrXT1bXSk7bT1oW2tdO2lmKCEoMDxzLS0pKXtmb3IoOzA8bS5sZW5ndGgmJjMyNzY4PGQtbVswXTspbS5zaGlmdCgpO2lmKGQrMz49ZSl7cCYmYyhwLC0xKTtmPTA7Zm9yKGc9ZS1kO2Y8ZzsrK2YpeD1hW2QrZl0sbFtuKytdPXgsKyt1W3hdO2JyZWFrfTA8bS5sZW5ndGg/KHI9emEoYSxkLG0pLHA/cC5sZW5ndGg8ci5sZW5ndGg/KHg9YVtkLTFdLGxbbisrXT14LCsrdVt4XSxjKHIsMCkpOmMocCwtMSk6ci5sZW5ndGg8Qz9wPXI6YyhyLDApKTpwP2MocCwtMSk6KHg9YVtkXSxsW24rK109eCwrK3VbeF0pfW0ucHVzaChkKX1sW24rK109MjU2O3VbMjU2XSsrO2IuVT11O2IuVD13O3JldHVybiBCP2wuc3ViYXJyYXkoMCxuKTpsfVxuZnVuY3Rpb24gemEoYixhLGMpe3ZhciBkLGUsZj0wLGcsayxoLG0scj1iLmxlbmd0aDtrPTA7bT1jLmxlbmd0aDthOmZvcig7azxtO2srKyl7ZD1jW20tay0xXTtnPTM7aWYoMzxmKXtmb3IoaD1mOzM8aDtoLS0paWYoYltkK2gtMV0hPT1iW2EraC0xXSljb250aW51ZSBhO2c9Zn1mb3IoOzI1OD5nJiZhK2c8ciYmYltkK2ddPT09YlthK2ddOykrK2c7Zz5mJiYoZT1kLGY9Zyk7aWYoMjU4PT09ZylicmVha31yZXR1cm4gbmV3IHZhKGYsYS1lKX1cbmZ1bmN0aW9uIHNhKGIsYSl7dmFyIGM9Yi5sZW5ndGgsZD1uZXcga2EoNTcyKSxlPW5ldyAoQj9VaW50OEFycmF5OkFycmF5KShjKSxmLGcsayxoLG07aWYoIUIpZm9yKGg9MDtoPGM7aCsrKWVbaF09MDtmb3IoaD0wO2g8YzsrK2gpMDxiW2hdJiZkLnB1c2goaCxiW2hdKTtmPUFycmF5KGQubGVuZ3RoLzIpO2c9bmV3IChCP1VpbnQzMkFycmF5OkFycmF5KShkLmxlbmd0aC8yKTtpZigxPT09Zi5sZW5ndGgpcmV0dXJuIGVbZC5wb3AoKS5pbmRleF09MSxlO2g9MDtmb3IobT1kLmxlbmd0aC8yO2g8bTsrK2gpZltoXT1kLnBvcCgpLGdbaF09ZltoXS52YWx1ZTtrPUFhKGcsZy5sZW5ndGgsYSk7aD0wO2ZvcihtPWYubGVuZ3RoO2g8bTsrK2gpZVtmW2hdLmluZGV4XT1rW2hdO3JldHVybiBlfVxuZnVuY3Rpb24gQWEoYixhLGMpe2Z1bmN0aW9uIGQoYil7dmFyIGM9aFtiXVttW2JdXTtjPT09YT8oZChiKzEpLGQoYisxKSk6LS1nW2NdOysrbVtiXX12YXIgZT1uZXcgKEI/VWludDE2QXJyYXk6QXJyYXkpKGMpLGY9bmV3IChCP1VpbnQ4QXJyYXk6QXJyYXkpKGMpLGc9bmV3IChCP1VpbnQ4QXJyYXk6QXJyYXkpKGEpLGs9QXJyYXkoYyksaD1BcnJheShjKSxtPUFycmF5KGMpLHI9KDE8PGMpLWEscD0xPDxjLTEsbCxuLHMsdSx3O2VbYy0xXT1hO2ZvcihuPTA7bjxjOysrbilyPHA/ZltuXT0wOihmW25dPTEsci09cCkscjw8PTEsZVtjLTItbl09KGVbYy0xLW5dLzJ8MCkrYTtlWzBdPWZbMF07a1swXT1BcnJheShlWzBdKTtoWzBdPUFycmF5KGVbMF0pO2ZvcihuPTE7bjxjOysrbillW25dPjIqZVtuLTFdK2Zbbl0mJihlW25dPTIqZVtuLTFdK2Zbbl0pLGtbbl09QXJyYXkoZVtuXSksaFtuXT1BcnJheShlW25dKTtmb3IobD0wO2w8YTsrK2wpZ1tsXT1jO2ZvcihzPTA7czxlW2MtMV07KytzKWtbYy1cbjFdW3NdPWJbc10saFtjLTFdW3NdPXM7Zm9yKGw9MDtsPGM7KytsKW1bbF09MDsxPT09ZltjLTFdJiYoLS1nWzBdLCsrbVtjLTFdKTtmb3Iobj1jLTI7MDw9bjstLW4pe3U9bD0wO3c9bVtuKzFdO2ZvcihzPTA7czxlW25dO3MrKyl1PWtbbisxXVt3XStrW24rMV1bdysxXSx1PmJbbF0/KGtbbl1bc109dSxoW25dW3NdPWEsdys9Mik6KGtbbl1bc109YltsXSxoW25dW3NdPWwsKytsKTttW25dPTA7MT09PWZbbl0mJmQobil9cmV0dXJuIGd9XG5mdW5jdGlvbiB1YShiKXt2YXIgYT1uZXcgKEI/VWludDE2QXJyYXk6QXJyYXkpKGIubGVuZ3RoKSxjPVtdLGQ9W10sZT0wLGYsZyxrLGg7Zj0wO2ZvcihnPWIubGVuZ3RoO2Y8ZztmKyspY1tiW2ZdXT0oY1tiW2ZdXXwwKSsxO2Y9MTtmb3IoZz0xNjtmPD1nO2YrKylkW2ZdPWUsZSs9Y1tmXXwwLGU8PD0xO2Y9MDtmb3IoZz1iLmxlbmd0aDtmPGc7ZisrKXtlPWRbYltmXV07ZFtiW2ZdXSs9MTtrPWFbZl09MDtmb3IoaD1iW2ZdO2s8aDtrKyspYVtmXT1hW2ZdPDwxfGUmMSxlPj4+PTF9cmV0dXJuIGF9O2Z1bmN0aW9uIEJhKGIsYSl7dGhpcy5pbnB1dD1iO3RoaXMuYj10aGlzLmM9MDt0aGlzLmc9e307YSYmKGEuZmxhZ3MmJih0aGlzLmc9YS5mbGFncyksXCJzdHJpbmdcIj09PXR5cGVvZiBhLmZpbGVuYW1lJiYodGhpcy5maWxlbmFtZT1hLmZpbGVuYW1lKSxcInN0cmluZ1wiPT09dHlwZW9mIGEuY29tbWVudCYmKHRoaXMudz1hLmNvbW1lbnQpLGEuZGVmbGF0ZU9wdGlvbnMmJih0aGlzLmw9YS5kZWZsYXRlT3B0aW9ucykpO3RoaXMubHx8KHRoaXMubD17fSl9XG5CYS5wcm90b3R5cGUuaD1mdW5jdGlvbigpe3ZhciBiLGEsYyxkLGUsZixnLGssaD1uZXcgKEI/VWludDhBcnJheTpBcnJheSkoMzI3NjgpLG09MCxyPXRoaXMuaW5wdXQscD10aGlzLmMsbD10aGlzLmZpbGVuYW1lLG49dGhpcy53O2hbbSsrXT0zMTtoW20rK109MTM5O2hbbSsrXT04O2I9MDt0aGlzLmcuZm5hbWUmJihifD1DYSk7dGhpcy5nLmZjb21tZW50JiYoYnw9RGEpO3RoaXMuZy5maGNyYyYmKGJ8PUVhKTtoW20rK109YjthPShEYXRlLm5vdz9EYXRlLm5vdygpOituZXcgRGF0ZSkvMUUzfDA7aFttKytdPWEmMjU1O2hbbSsrXT1hPj4+OCYyNTU7aFttKytdPWE+Pj4xNiYyNTU7aFttKytdPWE+Pj4yNCYyNTU7aFttKytdPTA7aFttKytdPVNhO2lmKHRoaXMuZy5mbmFtZSE9PXQpe2c9MDtmb3Ioaz1sLmxlbmd0aDtnPGs7KytnKWY9bC5jaGFyQ29kZUF0KGcpLDI1NTxmJiYoaFttKytdPWY+Pj44JjI1NSksaFttKytdPWYmMjU1O2hbbSsrXT0wfWlmKHRoaXMuZy5jb21tZW50KXtnPVxuMDtmb3Ioaz1uLmxlbmd0aDtnPGs7KytnKWY9bi5jaGFyQ29kZUF0KGcpLDI1NTxmJiYoaFttKytdPWY+Pj44JjI1NSksaFttKytdPWYmMjU1O2hbbSsrXT0wfXRoaXMuZy5maGNyYyYmKGM9aGEoaCwwLG0pJjY1NTM1LGhbbSsrXT1jJjI1NSxoW20rK109Yz4+PjgmMjU1KTt0aGlzLmwub3V0cHV0QnVmZmVyPWg7dGhpcy5sLm91dHB1dEluZGV4PW07ZT1uZXcgbmEocix0aGlzLmwpO2g9ZS5oKCk7bT1lLmI7QiYmKG0rOD5oLmJ1ZmZlci5ieXRlTGVuZ3RoPyh0aGlzLmE9bmV3IFVpbnQ4QXJyYXkobSs4KSx0aGlzLmEuc2V0KG5ldyBVaW50OEFycmF5KGguYnVmZmVyKSksaD10aGlzLmEpOmg9bmV3IFVpbnQ4QXJyYXkoaC5idWZmZXIpKTtkPWhhKHIsdCx0KTtoW20rK109ZCYyNTU7aFttKytdPWQ+Pj44JjI1NTtoW20rK109ZD4+PjE2JjI1NTtoW20rK109ZD4+PjI0JjI1NTtrPXIubGVuZ3RoO2hbbSsrXT1rJjI1NTtoW20rK109az4+PjgmMjU1O2hbbSsrXT1rPj4+MTYmMjU1O2hbbSsrXT1cbms+Pj4yNCYyNTU7dGhpcy5jPXA7QiYmbTxoLmxlbmd0aCYmKHRoaXMuYT1oPWguc3ViYXJyYXkoMCxtKSk7cmV0dXJuIGh9O3ZhciBTYT0yNTUsRWE9MixDYT04LERhPTE2O2Z1bmN0aW9uIFYoYixhKXt0aGlzLm89W107dGhpcy5wPTMyNzY4O3RoaXMuZT10aGlzLmo9dGhpcy5jPXRoaXMucz0wO3RoaXMuaW5wdXQ9Qj9uZXcgVWludDhBcnJheShiKTpiO3RoaXMudT0hMTt0aGlzLnE9VGE7dGhpcy5LPSExO2lmKGF8fCEoYT17fSkpYS5pbmRleCYmKHRoaXMuYz1hLmluZGV4KSxhLmJ1ZmZlclNpemUmJih0aGlzLnA9YS5idWZmZXJTaXplKSxhLmJ1ZmZlclR5cGUmJih0aGlzLnE9YS5idWZmZXJUeXBlKSxhLnJlc2l6ZSYmKHRoaXMuSz1hLnJlc2l6ZSk7c3dpdGNoKHRoaXMucSl7Y2FzZSBVYTp0aGlzLmI9MzI3Njg7dGhpcy5hPW5ldyAoQj9VaW50OEFycmF5OkFycmF5KSgzMjc2OCt0aGlzLnArMjU4KTticmVhaztjYXNlIFRhOnRoaXMuYj0wO3RoaXMuYT1uZXcgKEI/VWludDhBcnJheTpBcnJheSkodGhpcy5wKTt0aGlzLmY9dGhpcy5TO3RoaXMuej10aGlzLk87dGhpcy5yPXRoaXMuUTticmVhaztkZWZhdWx0OnEoRXJyb3IoXCJpbnZhbGlkIGluZmxhdGUgbW9kZVwiKSl9fVxudmFyIFVhPTAsVGE9MTtcblYucHJvdG90eXBlLmk9ZnVuY3Rpb24oKXtmb3IoOyF0aGlzLnU7KXt2YXIgYj1XKHRoaXMsMyk7YiYxJiYodGhpcy51PXYpO2I+Pj49MTtzd2l0Y2goYil7Y2FzZSAwOnZhciBhPXRoaXMuaW5wdXQsYz10aGlzLmMsZD10aGlzLmEsZT10aGlzLmIsZj1hLmxlbmd0aCxnPXQsaz10LGg9ZC5sZW5ndGgsbT10O3RoaXMuZT10aGlzLmo9MDtjKzE+PWYmJnEoRXJyb3IoXCJpbnZhbGlkIHVuY29tcHJlc3NlZCBibG9jayBoZWFkZXI6IExFTlwiKSk7Zz1hW2MrK118YVtjKytdPDw4O2MrMT49ZiYmcShFcnJvcihcImludmFsaWQgdW5jb21wcmVzc2VkIGJsb2NrIGhlYWRlcjogTkxFTlwiKSk7az1hW2MrK118YVtjKytdPDw4O2c9PT1+ayYmcShFcnJvcihcImludmFsaWQgdW5jb21wcmVzc2VkIGJsb2NrIGhlYWRlcjogbGVuZ3RoIHZlcmlmeVwiKSk7YytnPmEubGVuZ3RoJiZxKEVycm9yKFwiaW5wdXQgYnVmZmVyIGlzIGJyb2tlblwiKSk7c3dpdGNoKHRoaXMucSl7Y2FzZSBVYTpmb3IoO2UrZz5kLmxlbmd0aDspe209XG5oLWU7Zy09bTtpZihCKWQuc2V0KGEuc3ViYXJyYXkoYyxjK20pLGUpLGUrPW0sYys9bTtlbHNlIGZvcig7bS0tOylkW2UrK109YVtjKytdO3RoaXMuYj1lO2Q9dGhpcy5mKCk7ZT10aGlzLmJ9YnJlYWs7Y2FzZSBUYTpmb3IoO2UrZz5kLmxlbmd0aDspZD10aGlzLmYoe0I6Mn0pO2JyZWFrO2RlZmF1bHQ6cShFcnJvcihcImludmFsaWQgaW5mbGF0ZSBtb2RlXCIpKX1pZihCKWQuc2V0KGEuc3ViYXJyYXkoYyxjK2cpLGUpLGUrPWcsYys9ZztlbHNlIGZvcig7Zy0tOylkW2UrK109YVtjKytdO3RoaXMuYz1jO3RoaXMuYj1lO3RoaXMuYT1kO2JyZWFrO2Nhc2UgMTp0aGlzLnIoVmEsV2EpO2JyZWFrO2Nhc2UgMjpmb3IodmFyIHI9Vyh0aGlzLDUpKzI1NyxwPVcodGhpcyw1KSsxLGw9Vyh0aGlzLDQpKzQsbj1uZXcgKEI/VWludDhBcnJheTpBcnJheSkoWGEubGVuZ3RoKSxzPXQsdT10LHc9dCxDPXQseD10LEQ9dCxNPXQsej10LE49dCx6PTA7ejxsOysreiluW1hhW3pdXT1XKHRoaXMsMyk7aWYoIUIpe3o9XG5sO2ZvcihsPW4ubGVuZ3RoO3o8bDsrK3opbltYYVt6XV09MH1zPVQobik7Qz1uZXcgKEI/VWludDhBcnJheTpBcnJheSkocitwKTt6PTA7Zm9yKE49citwO3o8Tjspc3dpdGNoKHg9WWEodGhpcyxzKSx4KXtjYXNlIDE2OmZvcihNPTMrVyh0aGlzLDIpO00tLTspQ1t6KytdPUQ7YnJlYWs7Y2FzZSAxNzpmb3IoTT0zK1codGhpcywzKTtNLS07KUNbeisrXT0wO0Q9MDticmVhaztjYXNlIDE4OmZvcihNPTExK1codGhpcyw3KTtNLS07KUNbeisrXT0wO0Q9MDticmVhaztkZWZhdWx0OkQ9Q1t6KytdPXh9dT1CP1QoQy5zdWJhcnJheSgwLHIpKTpUKEMuc2xpY2UoMCxyKSk7dz1CP1QoQy5zdWJhcnJheShyKSk6VChDLnNsaWNlKHIpKTt0aGlzLnIodSx3KTticmVhaztkZWZhdWx0OnEoRXJyb3IoXCJ1bmtub3duIEJUWVBFOiBcIitiKSl9fXJldHVybiB0aGlzLnooKX07XG52YXIgWmE9WzE2LDE3LDE4LDAsOCw3LDksNiwxMCw1LDExLDQsMTIsMywxMywyLDE0LDEsMTVdLFhhPUI/bmV3IFVpbnQxNkFycmF5KFphKTpaYSwkYT1bMyw0LDUsNiw3LDgsOSwxMCwxMSwxMywxNSwxNywxOSwyMywyNywzMSwzNSw0Myw1MSw1OSw2Nyw4Myw5OSwxMTUsMTMxLDE2MywxOTUsMjI3LDI1OCwyNTgsMjU4XSxhYj1CP25ldyBVaW50MTZBcnJheSgkYSk6JGEsYmI9WzAsMCwwLDAsMCwwLDAsMCwxLDEsMSwxLDIsMiwyLDIsMywzLDMsMyw0LDQsNCw0LDUsNSw1LDUsMCwwLDBdLGNiPUI/bmV3IFVpbnQ4QXJyYXkoYmIpOmJiLGRiPVsxLDIsMyw0LDUsNyw5LDEzLDE3LDI1LDMzLDQ5LDY1LDk3LDEyOSwxOTMsMjU3LDM4NSw1MTMsNzY5LDEwMjUsMTUzNywyMDQ5LDMwNzMsNDA5Nyw2MTQ1LDgxOTMsMTIyODksMTYzODUsMjQ1NzddLGViPUI/bmV3IFVpbnQxNkFycmF5KGRiKTpkYixmYj1bMCwwLDAsMCwxLDEsMiwyLDMsMyw0LDQsNSw1LDYsNiw3LDcsOCw4LDksOSwxMCxcbjEwLDExLDExLDEyLDEyLDEzLDEzXSxnYj1CP25ldyBVaW50OEFycmF5KGZiKTpmYixoYj1uZXcgKEI/VWludDhBcnJheTpBcnJheSkoMjg4KSwkLGliOyQ9MDtmb3IoaWI9aGIubGVuZ3RoOyQ8aWI7KyskKWhiWyRdPTE0Mz49JD84OjI1NT49JD85OjI3OT49JD83Ojg7dmFyIFZhPVQoaGIpLGpiPW5ldyAoQj9VaW50OEFycmF5OkFycmF5KSgzMCksa2IsbGI7a2I9MDtmb3IobGI9amIubGVuZ3RoO2tiPGxiOysra2IpamJba2JdPTU7dmFyIFdhPVQoamIpO2Z1bmN0aW9uIFcoYixhKXtmb3IodmFyIGM9Yi5qLGQ9Yi5lLGU9Yi5pbnB1dCxmPWIuYyxnPWUubGVuZ3RoLGs7ZDxhOylmPj1nJiZxKEVycm9yKFwiaW5wdXQgYnVmZmVyIGlzIGJyb2tlblwiKSksY3w9ZVtmKytdPDxkLGQrPTg7az1jJigxPDxhKS0xO2Iuaj1jPj4+YTtiLmU9ZC1hO2IuYz1mO3JldHVybiBrfVxuZnVuY3Rpb24gWWEoYixhKXtmb3IodmFyIGM9Yi5qLGQ9Yi5lLGU9Yi5pbnB1dCxmPWIuYyxnPWUubGVuZ3RoLGs9YVswXSxoPWFbMV0sbSxyO2Q8aCYmIShmPj1nKTspY3w9ZVtmKytdPDxkLGQrPTg7bT1rW2MmKDE8PGgpLTFdO3I9bT4+PjE2O3I+ZCYmcShFcnJvcihcImludmFsaWQgY29kZSBsZW5ndGg6IFwiK3IpKTtiLmo9Yz4+cjtiLmU9ZC1yO2IuYz1mO3JldHVybiBtJjY1NTM1fVxuVi5wcm90b3R5cGUucj1mdW5jdGlvbihiLGEpe3ZhciBjPXRoaXMuYSxkPXRoaXMuYjt0aGlzLkE9Yjtmb3IodmFyIGU9Yy5sZW5ndGgtMjU4LGYsZyxrLGg7MjU2IT09KGY9WWEodGhpcyxiKSk7KWlmKDI1Nj5mKWQ+PWUmJih0aGlzLmI9ZCxjPXRoaXMuZigpLGQ9dGhpcy5iKSxjW2QrK109ZjtlbHNle2c9Zi0yNTc7aD1hYltnXTswPGNiW2ddJiYoaCs9Vyh0aGlzLGNiW2ddKSk7Zj1ZYSh0aGlzLGEpO2s9ZWJbZl07MDxnYltmXSYmKGsrPVcodGhpcyxnYltmXSkpO2Q+PWUmJih0aGlzLmI9ZCxjPXRoaXMuZigpLGQ9dGhpcy5iKTtmb3IoO2gtLTspY1tkXT1jW2QrKy1rXX1mb3IoOzg8PXRoaXMuZTspdGhpcy5lLT04LHRoaXMuYy0tO3RoaXMuYj1kfTtcblYucHJvdG90eXBlLlE9ZnVuY3Rpb24oYixhKXt2YXIgYz10aGlzLmEsZD10aGlzLmI7dGhpcy5BPWI7Zm9yKHZhciBlPWMubGVuZ3RoLGYsZyxrLGg7MjU2IT09KGY9WWEodGhpcyxiKSk7KWlmKDI1Nj5mKWQ+PWUmJihjPXRoaXMuZigpLGU9Yy5sZW5ndGgpLGNbZCsrXT1mO2Vsc2V7Zz1mLTI1NztoPWFiW2ddOzA8Y2JbZ10mJihoKz1XKHRoaXMsY2JbZ10pKTtmPVlhKHRoaXMsYSk7az1lYltmXTswPGdiW2ZdJiYoays9Vyh0aGlzLGdiW2ZdKSk7ZCtoPmUmJihjPXRoaXMuZigpLGU9Yy5sZW5ndGgpO2Zvcig7aC0tOyljW2RdPWNbZCsrLWtdfWZvcig7ODw9dGhpcy5lOyl0aGlzLmUtPTgsdGhpcy5jLS07dGhpcy5iPWR9O1xuVi5wcm90b3R5cGUuZj1mdW5jdGlvbigpe3ZhciBiPW5ldyAoQj9VaW50OEFycmF5OkFycmF5KSh0aGlzLmItMzI3NjgpLGE9dGhpcy5iLTMyNzY4LGMsZCxlPXRoaXMuYTtpZihCKWIuc2V0KGUuc3ViYXJyYXkoMzI3NjgsYi5sZW5ndGgpKTtlbHNle2M9MDtmb3IoZD1iLmxlbmd0aDtjPGQ7KytjKWJbY109ZVtjKzMyNzY4XX10aGlzLm8ucHVzaChiKTt0aGlzLnMrPWIubGVuZ3RoO2lmKEIpZS5zZXQoZS5zdWJhcnJheShhLGErMzI3NjgpKTtlbHNlIGZvcihjPTA7MzI3Njg+YzsrK2MpZVtjXT1lW2ErY107dGhpcy5iPTMyNzY4O3JldHVybiBlfTtcblYucHJvdG90eXBlLlM9ZnVuY3Rpb24oYil7dmFyIGEsYz10aGlzLmlucHV0Lmxlbmd0aC90aGlzLmMrMXwwLGQsZSxmLGc9dGhpcy5pbnB1dCxrPXRoaXMuYTtiJiYoXCJudW1iZXJcIj09PXR5cGVvZiBiLkImJihjPWIuQiksXCJudW1iZXJcIj09PXR5cGVvZiBiLk0mJihjKz1iLk0pKTsyPmM/KGQ9KGcubGVuZ3RoLXRoaXMuYykvdGhpcy5BWzJdLGY9MjU4KihkLzIpfDAsZT1mPGsubGVuZ3RoP2subGVuZ3RoK2Y6ay5sZW5ndGg8PDEpOmU9ay5sZW5ndGgqYztCPyhhPW5ldyBVaW50OEFycmF5KGUpLGEuc2V0KGspKTphPWs7cmV0dXJuIHRoaXMuYT1hfTtcblYucHJvdG90eXBlLno9ZnVuY3Rpb24oKXt2YXIgYj0wLGE9dGhpcy5hLGM9dGhpcy5vLGQsZT1uZXcgKEI/VWludDhBcnJheTpBcnJheSkodGhpcy5zKyh0aGlzLmItMzI3NjgpKSxmLGcsayxoO2lmKDA9PT1jLmxlbmd0aClyZXR1cm4gQj90aGlzLmEuc3ViYXJyYXkoMzI3NjgsdGhpcy5iKTp0aGlzLmEuc2xpY2UoMzI3NjgsdGhpcy5iKTtmPTA7Zm9yKGc9Yy5sZW5ndGg7ZjxnOysrZil7ZD1jW2ZdO2s9MDtmb3IoaD1kLmxlbmd0aDtrPGg7KytrKWVbYisrXT1kW2tdfWY9MzI3Njg7Zm9yKGc9dGhpcy5iO2Y8ZzsrK2YpZVtiKytdPWFbZl07dGhpcy5vPVtdO3JldHVybiB0aGlzLmJ1ZmZlcj1lfTtcblYucHJvdG90eXBlLk89ZnVuY3Rpb24oKXt2YXIgYixhPXRoaXMuYjtCP3RoaXMuSz8oYj1uZXcgVWludDhBcnJheShhKSxiLnNldCh0aGlzLmEuc3ViYXJyYXkoMCxhKSkpOmI9dGhpcy5hLnN1YmFycmF5KDAsYSk6KHRoaXMuYS5sZW5ndGg+YSYmKHRoaXMuYS5sZW5ndGg9YSksYj10aGlzLmEpO3JldHVybiB0aGlzLmJ1ZmZlcj1ifTtmdW5jdGlvbiBtYihiKXt0aGlzLmlucHV0PWI7dGhpcy5jPTA7dGhpcy5HPVtdO3RoaXMuUj0hMX1cbm1iLnByb3RvdHlwZS5pPWZ1bmN0aW9uKCl7Zm9yKHZhciBiPXRoaXMuaW5wdXQubGVuZ3RoO3RoaXMuYzxiOyl7dmFyIGE9bmV3IGphLGM9dCxkPXQsZT10LGY9dCxnPXQsaz10LGg9dCxtPXQscj10LHA9dGhpcy5pbnB1dCxsPXRoaXMuYzthLkM9cFtsKytdO2EuRD1wW2wrK107KDMxIT09YS5DfHwxMzkhPT1hLkQpJiZxKEVycm9yKFwiaW52YWxpZCBmaWxlIHNpZ25hdHVyZTpcIithLkMrXCIsXCIrYS5EKSk7YS52PXBbbCsrXTtzd2l0Y2goYS52KXtjYXNlIDg6YnJlYWs7ZGVmYXVsdDpxKEVycm9yKFwidW5rbm93biBjb21wcmVzc2lvbiBtZXRob2Q6IFwiK2EudikpfWEubj1wW2wrK107bT1wW2wrK118cFtsKytdPDw4fHBbbCsrXTw8MTZ8cFtsKytdPDwyNDthLiQ9bmV3IERhdGUoMUUzKm0pO2EuYmE9cFtsKytdO2EuYWE9cFtsKytdOzA8KGEubiY0KSYmKGEuVz1wW2wrK118cFtsKytdPDw4LGwrPWEuVyk7aWYoMDwoYS5uJkNhKSl7aD1bXTtmb3Ioaz0wOzA8KGc9cFtsKytdKTspaFtrKytdPVxuU3RyaW5nLmZyb21DaGFyQ29kZShnKTthLm5hbWU9aC5qb2luKFwiXCIpfWlmKDA8KGEubiZEYSkpe2g9W107Zm9yKGs9MDswPChnPXBbbCsrXSk7KWhbaysrXT1TdHJpbmcuZnJvbUNoYXJDb2RlKGcpO2Eudz1oLmpvaW4oXCJcIil9MDwoYS5uJkVhKSYmKGEuUD1oYShwLDAsbCkmNjU1MzUsYS5QIT09KHBbbCsrXXxwW2wrK108PDgpJiZxKEVycm9yKFwiaW52YWxpZCBoZWFkZXIgY3JjMTZcIikpKTtjPXBbcC5sZW5ndGgtNF18cFtwLmxlbmd0aC0zXTw8OHxwW3AubGVuZ3RoLTJdPDwxNnxwW3AubGVuZ3RoLTFdPDwyNDtwLmxlbmd0aC1sLTQtNDw1MTIqYyYmKGY9Yyk7ZD1uZXcgVihwLHtpbmRleDpsLGJ1ZmZlclNpemU6Zn0pO2EuZGF0YT1lPWQuaSgpO2w9ZC5jO2EuWT1yPShwW2wrK118cFtsKytdPDw4fHBbbCsrXTw8MTZ8cFtsKytdPDwyNCk+Pj4wO2hhKGUsdCx0KSE9PXImJnEoRXJyb3IoXCJpbnZhbGlkIENSQy0zMiBjaGVja3N1bTogMHhcIitoYShlLHQsdCkudG9TdHJpbmcoMTYpK1wiIC8gMHhcIitcbnIudG9TdHJpbmcoMTYpKSk7YS5aPWM9KHBbbCsrXXxwW2wrK108PDh8cFtsKytdPDwxNnxwW2wrK108PDI0KT4+PjA7KGUubGVuZ3RoJjQyOTQ5NjcyOTUpIT09YyYmcShFcnJvcihcImludmFsaWQgaW5wdXQgc2l6ZTogXCIrKGUubGVuZ3RoJjQyOTQ5NjcyOTUpK1wiIC8gXCIrYykpO3RoaXMuRy5wdXNoKGEpO3RoaXMuYz1sfXRoaXMuUj12O3ZhciBuPXRoaXMuRyxzLHUsdz0wLEM9MCx4O3M9MDtmb3IodT1uLmxlbmd0aDtzPHU7KytzKUMrPW5bc10uZGF0YS5sZW5ndGg7aWYoQil7eD1uZXcgVWludDhBcnJheShDKTtmb3Iocz0wO3M8dTsrK3MpeC5zZXQobltzXS5kYXRhLHcpLHcrPW5bc10uZGF0YS5sZW5ndGh9ZWxzZXt4PVtdO2ZvcihzPTA7czx1Oysrcyl4W3NdPW5bc10uZGF0YTt4PUFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoW10seCl9cmV0dXJuIHh9O2Z1bmN0aW9uIG5iKGIpe2lmKFwic3RyaW5nXCI9PT10eXBlb2YgYil7dmFyIGE9Yi5zcGxpdChcIlwiKSxjLGQ7Yz0wO2ZvcihkPWEubGVuZ3RoO2M8ZDtjKyspYVtjXT0oYVtjXS5jaGFyQ29kZUF0KDApJjI1NSk+Pj4wO2I9YX1mb3IodmFyIGU9MSxmPTAsZz1iLmxlbmd0aCxrLGg9MDswPGc7KXtrPTEwMjQ8Zz8xMDI0Omc7Zy09aztkbyBlKz1iW2grK10sZis9ZTt3aGlsZSgtLWspO2UlPTY1NTIxO2YlPTY1NTIxfXJldHVybihmPDwxNnxlKT4+PjB9O2Z1bmN0aW9uIG9iKGIsYSl7dmFyIGMsZDt0aGlzLmlucHV0PWI7dGhpcy5jPTA7aWYoYXx8IShhPXt9KSlhLmluZGV4JiYodGhpcy5jPWEuaW5kZXgpLGEudmVyaWZ5JiYodGhpcy5WPWEudmVyaWZ5KTtjPWJbdGhpcy5jKytdO2Q9Ylt0aGlzLmMrK107c3dpdGNoKGMmMTUpe2Nhc2UgcGI6dGhpcy5tZXRob2Q9cGI7YnJlYWs7ZGVmYXVsdDpxKEVycm9yKFwidW5zdXBwb3J0ZWQgY29tcHJlc3Npb24gbWV0aG9kXCIpKX0wIT09KChjPDw4KStkKSUzMSYmcShFcnJvcihcImludmFsaWQgZmNoZWNrIGZsYWc6XCIrKChjPDw4KStkKSUzMSkpO2QmMzImJnEoRXJyb3IoXCJmZGljdCBmbGFnIGlzIG5vdCBzdXBwb3J0ZWRcIikpO3RoaXMuSj1uZXcgVihiLHtpbmRleDp0aGlzLmMsYnVmZmVyU2l6ZTphLmJ1ZmZlclNpemUsYnVmZmVyVHlwZTphLmJ1ZmZlclR5cGUscmVzaXplOmEucmVzaXplfSl9XG5vYi5wcm90b3R5cGUuaT1mdW5jdGlvbigpe3ZhciBiPXRoaXMuaW5wdXQsYSxjO2E9dGhpcy5KLmkoKTt0aGlzLmM9dGhpcy5KLmM7dGhpcy5WJiYoYz0oYlt0aGlzLmMrK108PDI0fGJbdGhpcy5jKytdPDwxNnxiW3RoaXMuYysrXTw8OHxiW3RoaXMuYysrXSk+Pj4wLGMhPT1uYihhKSYmcShFcnJvcihcImludmFsaWQgYWRsZXItMzIgY2hlY2tzdW1cIikpKTtyZXR1cm4gYX07dmFyIHBiPTg7ZnVuY3Rpb24gcmIoYixhKXt0aGlzLmlucHV0PWI7dGhpcy5hPW5ldyAoQj9VaW50OEFycmF5OkFycmF5KSgzMjc2OCk7dGhpcy5rPXNiLnQ7dmFyIGM9e30sZDtpZigoYXx8IShhPXt9KSkmJlwibnVtYmVyXCI9PT10eXBlb2YgYS5jb21wcmVzc2lvblR5cGUpdGhpcy5rPWEuY29tcHJlc3Npb25UeXBlO2ZvcihkIGluIGEpY1tkXT1hW2RdO2Mub3V0cHV0QnVmZmVyPXRoaXMuYTt0aGlzLkk9bmV3IG5hKHRoaXMuaW5wdXQsYyl9dmFyIHNiPXBhO1xucmIucHJvdG90eXBlLmg9ZnVuY3Rpb24oKXt2YXIgYixhLGMsZCxlLGYsZyxrPTA7Zz10aGlzLmE7Yj1wYjtzd2l0Y2goYil7Y2FzZSBwYjphPU1hdGguTE9HMkUqTWF0aC5sb2coMzI3NjgpLTg7YnJlYWs7ZGVmYXVsdDpxKEVycm9yKFwiaW52YWxpZCBjb21wcmVzc2lvbiBtZXRob2RcIikpfWM9YTw8NHxiO2dbaysrXT1jO3N3aXRjaChiKXtjYXNlIHBiOnN3aXRjaCh0aGlzLmspe2Nhc2Ugc2IuTk9ORTplPTA7YnJlYWs7Y2FzZSBzYi5MOmU9MTticmVhaztjYXNlIHNiLnQ6ZT0yO2JyZWFrO2RlZmF1bHQ6cShFcnJvcihcInVuc3VwcG9ydGVkIGNvbXByZXNzaW9uIHR5cGVcIikpfWJyZWFrO2RlZmF1bHQ6cShFcnJvcihcImludmFsaWQgY29tcHJlc3Npb24gbWV0aG9kXCIpKX1kPWU8PDZ8MDtnW2srK109ZHwzMS0oMjU2KmMrZCklMzE7Zj1uYih0aGlzLmlucHV0KTt0aGlzLkkuYj1rO2c9dGhpcy5JLmgoKTtrPWcubGVuZ3RoO0ImJihnPW5ldyBVaW50OEFycmF5KGcuYnVmZmVyKSxnLmxlbmd0aDw9XG5rKzQmJih0aGlzLmE9bmV3IFVpbnQ4QXJyYXkoZy5sZW5ndGgrNCksdGhpcy5hLnNldChnKSxnPXRoaXMuYSksZz1nLnN1YmFycmF5KDAsays0KSk7Z1trKytdPWY+PjI0JjI1NTtnW2srK109Zj4+MTYmMjU1O2dbaysrXT1mPj44JjI1NTtnW2srK109ZiYyNTU7cmV0dXJuIGd9O2V4cG9ydHMuZGVmbGF0ZT10YjtleHBvcnRzLmRlZmxhdGVTeW5jPXViO2V4cG9ydHMuaW5mbGF0ZT12YjtleHBvcnRzLmluZmxhdGVTeW5jPXdiO2V4cG9ydHMuZ3ppcD14YjtleHBvcnRzLmd6aXBTeW5jPXliO2V4cG9ydHMuZ3VuemlwPXpiO2V4cG9ydHMuZ3VuemlwU3luYz1BYjtmdW5jdGlvbiB0YihiLGEsYyl7cHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpe3ZhciBkLGU7dHJ5e2U9dWIoYixjKX1jYXRjaChmKXtkPWZ9YShkLGUpfSl9ZnVuY3Rpb24gdWIoYixhKXt2YXIgYztjPShuZXcgcmIoYikpLmgoKTthfHwoYT17fSk7cmV0dXJuIGEuSD9jOkJiKGMpfWZ1bmN0aW9uIHZiKGIsYSxjKXtwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCl7dmFyIGQsZTt0cnl7ZT13YihiLGMpfWNhdGNoKGYpe2Q9Zn1hKGQsZSl9KX1cbmZ1bmN0aW9uIHdiKGIsYSl7dmFyIGM7Yi5zdWJhcnJheT1iLnNsaWNlO2M9KG5ldyBvYihiKSkuaSgpO2F8fChhPXt9KTtyZXR1cm4gYS5ub0J1ZmZlcj9jOkJiKGMpfWZ1bmN0aW9uIHhiKGIsYSxjKXtwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCl7dmFyIGQsZTt0cnl7ZT15YihiLGMpfWNhdGNoKGYpe2Q9Zn1hKGQsZSl9KX1mdW5jdGlvbiB5YihiLGEpe3ZhciBjO2Iuc3ViYXJyYXk9Yi5zbGljZTtjPShuZXcgQmEoYikpLmgoKTthfHwoYT17fSk7cmV0dXJuIGEuSD9jOkJiKGMpfWZ1bmN0aW9uIHpiKGIsYSxjKXtwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCl7dmFyIGQsZTt0cnl7ZT1BYihiLGMpfWNhdGNoKGYpe2Q9Zn1hKGQsZSl9KX1mdW5jdGlvbiBBYihiLGEpe3ZhciBjO2Iuc3ViYXJyYXk9Yi5zbGljZTtjPShuZXcgbWIoYikpLmkoKTthfHwoYT17fSk7cmV0dXJuIGEuSD9jOkJiKGMpfVxuZnVuY3Rpb24gQmIoYil7dmFyIGE9bmV3IEJ1ZmZlcihiLmxlbmd0aCksYyxkO2M9MDtmb3IoZD1iLmxlbmd0aDtjPGQ7KytjKWFbY109YltjXTtyZXR1cm4gYX07fSkuY2FsbCh0aGlzKTtcbiIsIi8qXHJcbiAqIFBTTSA9IFBhZ2UgU2VnbWVudGF0aW9uIE1vZGVcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIE9TRF9PTkxZOiAnMCcsXHJcbiAgQVVUT19PU0Q6ICcxJyxcclxuICBBVVRPX09OTFk6ICcyJyxcclxuICBBVVRPOiAnMycsXHJcbiAgU0lOR0xFX0NPTFVNTjogJzQnLFxyXG4gIFNJTkdMRV9CTE9DS19WRVJUX1RFWFQ6ICc1JyxcclxuICBTSU5HTEVfQkxPQ0s6ICc2JyxcclxuICBTSU5HTEVfTElORTogJzcnLFxyXG4gIFNJTkdMRV9XT1JEOiAnOCcsXHJcbiAgQ0lSQ0xFX1dPUkQ6ICc5JyxcclxuICBTSU5HTEVfQ0hBUjogJzEwJyxcclxuICBTUEFSU0VfVEVYVDogJzExJyxcclxuICBTUEFSU0VfVEVYVF9PU0Q6ICcxMicsXHJcbn07XHJcbiIsImNvbnN0IGlzRWxlY3Ryb24gPSByZXF1aXJlKCdpcy1lbGVjdHJvbicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAoa2V5KSA9PiB7XHJcbiAgY29uc3QgZW52ID0ge307XHJcblxyXG4gIGlmICh0eXBlb2YgV29ya2VyR2xvYmFsU2NvcGUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICBlbnYudHlwZSA9ICd3ZWJ3b3JrZXInO1xyXG4gIH0gZWxzZSBpZiAoaXNFbGVjdHJvbigpKSB7XHJcbiAgICBlbnYudHlwZSA9ICdlbGVjdHJvbic7XHJcbiAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0Jykge1xyXG4gICAgZW52LnR5cGUgPSAnYnJvd3Nlcic7XHJcbiAgfSBlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIGVudi50eXBlID0gJ25vZGUnO1xyXG4gIH1cclxuXHJcbiAgaWYgKHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICByZXR1cm4gZW52O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGVudltrZXldO1xyXG59O1xyXG4iLCJsZXQgbG9nZ2luZyA9IGZhbHNlO1xyXG5cclxuZXhwb3J0cy5sb2dnaW5nID0gbG9nZ2luZztcclxuXHJcbmV4cG9ydHMuc2V0TG9nZ2luZyA9IChfbG9nZ2luZykgPT4ge1xyXG4gIGxvZ2dpbmcgPSBfbG9nZ2luZztcclxufTtcclxuXHJcbmV4cG9ydHMubG9nID0gKC4uLmFyZ3MpID0+IChsb2dnaW5nID8gY29uc29sZS5sb2cuYXBwbHkodGhpcywgYXJncykgOiBudWxsKTtcclxuIiwiY29uc3QgeyBzZXQsIGdldCwgZGVsIH0gPSByZXF1aXJlKCdpZGIta2V5dmFsJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICByZWFkQ2FjaGU6IGdldCxcclxuICB3cml0ZUNhY2hlOiBzZXQsXHJcbiAgZGVsZXRlQ2FjaGU6IGRlbCxcclxuICBjaGVja0NhY2hlOiAocGF0aCkgPT4gKFxyXG4gICAgZ2V0KHBhdGgpLnRoZW4oKHYpID0+IHR5cGVvZiB2ICE9PSAndW5kZWZpbmVkJylcclxuICApLFxyXG59O1xyXG4iLCJjb25zdCB7IHNpbWQgfSA9IHJlcXVpcmUoJ3dhc20tZmVhdHVyZS1kZXRlY3QnKTtcclxuY29uc3QgeyBkZXBlbmRlbmNpZXMgfSA9IHJlcXVpcmUoJy4uLy4uLy4uL3BhY2thZ2UuanNvbicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhc3luYyAoY29yZVBhdGgsIHJlcykgPT4ge1xyXG4gIGlmICh0eXBlb2YgZ2xvYmFsLlRlc3NlcmFjdENvcmUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICByZXMucHJvZ3Jlc3MoeyBzdGF0dXM6ICdsb2FkaW5nIHRlc3NlcmFjdCBjb3JlJywgcHJvZ3Jlc3M6IDAgfSk7XHJcblxyXG4gICAgLy8gSWYgdGhlIHVzZXIgc3BlY2lmaWVzIGEgY29yZSBwYXRoLCB3ZSB1c2UgdGhhdFxyXG4gICAgLy8gT3RoZXJ3aXNlLCB3ZSBkZXRlY3QgdGhlIGNvcnJlY3QgY29yZSBiYXNlZCBvbiBTSU1EIHN1cHBvcnRcclxuICAgIGxldCBjb3JlUGF0aEltcG9ydCA9IGNvcmVQYXRoO1xyXG4gICAgaWYgKCFjb3JlUGF0aEltcG9ydCkge1xyXG4gICAgICBjb25zdCBzaW1kU3VwcG9ydCA9IGF3YWl0IHNpbWQoKTtcclxuICAgICAgaWYgKHNpbWRTdXBwb3J0KSB7XHJcbiAgICAgICAgY29yZVBhdGhJbXBvcnQgPSBgaHR0cHM6Ly91bnBrZy5jb20vdGVzc2VyYWN0LmpzLWNvcmVAdiR7ZGVwZW5kZW5jaWVzWyd0ZXNzZXJhY3QuanMtY29yZSddLnN1YnN0cmluZygxKX0vdGVzc2VyYWN0LWNvcmUtc2ltZC53YXNtLmpzYDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb3JlUGF0aEltcG9ydCA9IGBodHRwczovL3VucGtnLmNvbS90ZXNzZXJhY3QuanMtY29yZUB2JHtkZXBlbmRlbmNpZXNbJ3Rlc3NlcmFjdC5qcy1jb3JlJ10uc3Vic3RyaW5nKDEpfS90ZXNzZXJhY3QtY29yZS53YXNtLmpzYDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdsb2JhbC5pbXBvcnRTY3JpcHRzKGNvcmVQYXRoSW1wb3J0KTtcclxuXHJcbiAgICBpZiAodHlwZW9mIGdsb2JhbC5UZXNzZXJhY3RDb3JlV0FTTSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIFdlYkFzc2VtYmx5ID09PSAnb2JqZWN0Jykge1xyXG4gICAgICBnbG9iYWwuVGVzc2VyYWN0Q29yZSA9IGdsb2JhbC5UZXNzZXJhY3RDb3JlV0FTTTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IEVycm9yKCdGYWlsZWQgdG8gbG9hZCBUZXNzZXJhY3RDb3JlJyk7XHJcbiAgICB9XHJcbiAgICByZXMucHJvZ3Jlc3MoeyBzdGF0dXM6ICdsb2FkaW5nIHRlc3NlcmFjdCBjb3JlJywgcHJvZ3Jlc3M6IDEgfSk7XHJcbiAgfVxyXG4gIHJldHVybiBnbG9iYWwuVGVzc2VyYWN0Q29yZTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCd6bGlianMnKS5ndW56aXBTeW5jO1xyXG4iLCIvKlxyXG4gKiBkZWZhdWx0IHBhcmFtcyBmb3IgdGVzc2VyYWN0LmpzXHJcbiAqL1xyXG5jb25zdCBQU00gPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvUFNNJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICB0ZXNzZWRpdF9wYWdlc2VnX21vZGU6IFBTTS5TSU5HTEVfQkxPQ0ssXHJcbiAgdGVzc2VkaXRfY2hhcl93aGl0ZWxpc3Q6ICcnLFxyXG4gIHRlc3Nqc19jcmVhdGVfaG9jcjogJzEnLFxyXG4gIHRlc3Nqc19jcmVhdGVfdHN2OiAnMScsXHJcbiAgdGVzc2pzX2NyZWF0ZV9ib3g6ICcwJyxcclxuICB0ZXNzanNfY3JlYXRlX3VubHY6ICcwJyxcclxuICB0ZXNzanNfY3JlYXRlX29zZDogJzAnLFxyXG59O1xyXG4iLCIvKipcclxuICpcclxuICogV29ya2VyIHNjcmlwdCBmb3IgYnJvd3NlciBhbmQgbm9kZVxyXG4gKlxyXG4gKiBAZmlsZW92ZXJ2aWV3IFdvcmtlciBzY3JpcHQgZm9yIGJyb3dzZXIgYW5kIG5vZGVcclxuICogQGF1dGhvciBLZXZpbiBLd29rIDxhbnRpbWF0dGVyMTVAZ21haWwuY29tPlxyXG4gKiBAYXV0aG9yIEd1aWxsZXJtbyBXZWJzdGVyIDxndWlAbWl0LmVkdT5cclxuICogQGF1dGhvciBKZXJvbWUgV3UgPGplcm9tZXd1c0BnbWFpbC5jb20+XHJcbiAqL1xyXG5yZXF1aXJlKCdyZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUnKTtcclxuY29uc3QgZmlsZVR5cGUgPSByZXF1aXJlKCdmaWxlLXR5cGUnKTtcclxuY29uc3QgaXNVUkwgPSByZXF1aXJlKCdpcy11cmwnKTtcclxuY29uc3QgZHVtcCA9IHJlcXVpcmUoJy4vdXRpbHMvZHVtcCcpO1xyXG5jb25zdCBpc1dlYldvcmtlciA9IHJlcXVpcmUoJy4uL3V0aWxzL2dldEVudmlyb25tZW50JykoJ3R5cGUnKSA9PT0gJ3dlYndvcmtlcic7XHJcbmNvbnN0IHNldEltYWdlID0gcmVxdWlyZSgnLi91dGlscy9zZXRJbWFnZScpO1xyXG5jb25zdCBkZWZhdWx0UGFyYW1zID0gcmVxdWlyZSgnLi9jb25zdGFudHMvZGVmYXVsdFBhcmFtcycpO1xyXG5jb25zdCB7IGxvZywgc2V0TG9nZ2luZyB9ID0gcmVxdWlyZSgnLi4vdXRpbHMvbG9nJyk7XHJcblxyXG4vKlxyXG4gKiBUZXNzZXJhY3QgTW9kdWxlIHJldHVybmVkIGJ5IFRlc3NlcmFjdENvcmUuXHJcbiAqL1xyXG5sZXQgVGVzc01vZHVsZTtcclxuLypcclxuICogVGVzc2VhcmN0QmFzZUFQSSBpbnN0YW5jZVxyXG4gKi9cclxubGV0IGFwaSA9IG51bGw7XHJcbmxldCBsYXRlc3RKb2I7XHJcbmxldCBhZGFwdGVyID0ge307XHJcbmxldCBwYXJhbXMgPSBkZWZhdWx0UGFyYW1zO1xyXG5cclxuY29uc3QgbG9hZCA9IGFzeW5jICh7IHdvcmtlcklkLCBqb2JJZCwgcGF5bG9hZDogeyBvcHRpb25zOiB7IGNvcmVQYXRoLCBsb2dnaW5nIH0gfSB9LCByZXMpID0+IHtcclxuICBzZXRMb2dnaW5nKGxvZ2dpbmcpO1xyXG4gIGlmICghVGVzc01vZHVsZSkge1xyXG4gICAgY29uc3QgQ29yZSA9IGF3YWl0IGFkYXB0ZXIuZ2V0Q29yZShjb3JlUGF0aCwgcmVzKTtcclxuXHJcbiAgICByZXMucHJvZ3Jlc3MoeyB3b3JrZXJJZCwgc3RhdHVzOiAnaW5pdGlhbGl6aW5nIHRlc3NlcmFjdCcsIHByb2dyZXNzOiAwIH0pO1xyXG5cclxuICAgIENvcmUoe1xyXG4gICAgICBUZXNzZXJhY3RQcm9ncmVzcyhwZXJjZW50KSB7XHJcbiAgICAgICAgbGF0ZXN0Sm9iLnByb2dyZXNzKHtcclxuICAgICAgICAgIHdvcmtlcklkLFxyXG4gICAgICAgICAgam9iSWQsXHJcbiAgICAgICAgICBzdGF0dXM6ICdyZWNvZ25pemluZyB0ZXh0JyxcclxuICAgICAgICAgIHByb2dyZXNzOiBNYXRoLm1heCgwLCAocGVyY2VudCAtIDMwKSAvIDcwKSxcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgIH0pLnRoZW4oKHRlc3NNb2R1bGUpID0+IHtcclxuICAgICAgVGVzc01vZHVsZSA9IHRlc3NNb2R1bGU7XHJcbiAgICAgIHJlcy5wcm9ncmVzcyh7IHdvcmtlcklkLCBzdGF0dXM6ICdpbml0aWFsaXplZCB0ZXNzZXJhY3QnLCBwcm9ncmVzczogMSB9KTtcclxuICAgICAgcmVzLnJlc29sdmUoeyBsb2FkZWQ6IHRydWUgfSk7XHJcbiAgICB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmVzLnJlc29sdmUoeyBsb2FkZWQ6IHRydWUgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgRlMgPSAoeyB3b3JrZXJJZCwgcGF5bG9hZDogeyBtZXRob2QsIGFyZ3MgfSB9LCByZXMpID0+IHtcclxuICBsb2coYFske3dvcmtlcklkfV06IEZTLiR7bWV0aG9kfSB3aXRoIGFyZ3MgJHthcmdzfWApO1xyXG4gIHJlcy5yZXNvbHZlKFRlc3NNb2R1bGUuRlNbbWV0aG9kXSguLi5hcmdzKSk7XHJcbn07XHJcblxyXG5jb25zdCBsb2FkTGFuZ3VhZ2UgPSBhc3luYyAoe1xyXG4gIHdvcmtlcklkLFxyXG4gIHBheWxvYWQ6IHtcclxuICAgIGxhbmdzLFxyXG4gICAgb3B0aW9uczoge1xyXG4gICAgICBsYW5nUGF0aCxcclxuICAgICAgZGF0YVBhdGgsXHJcbiAgICAgIGNhY2hlUGF0aCxcclxuICAgICAgY2FjaGVNZXRob2QsXHJcbiAgICAgIGd6aXAgPSB0cnVlLFxyXG4gICAgfSxcclxuICB9LFxyXG59LFxyXG5yZXMpID0+IHtcclxuICBjb25zdCBsb2FkQW5kR3VuemlwRmlsZSA9IGFzeW5jIChfbGFuZykgPT4ge1xyXG4gICAgY29uc3QgbGFuZyA9IHR5cGVvZiBfbGFuZyA9PT0gJ3N0cmluZycgPyBfbGFuZyA6IF9sYW5nLmNvZGU7XHJcbiAgICBjb25zdCByZWFkQ2FjaGUgPSBbJ3JlZnJlc2gnLCAnbm9uZSddLmluY2x1ZGVzKGNhY2hlTWV0aG9kKVxyXG4gICAgICA/ICgpID0+IFByb21pc2UucmVzb2x2ZSgpXHJcbiAgICAgIDogYWRhcHRlci5yZWFkQ2FjaGU7XHJcbiAgICBsZXQgZGF0YSA9IG51bGw7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgX2RhdGEgPSBhd2FpdCByZWFkQ2FjaGUoYCR7Y2FjaGVQYXRoIHx8ICcuJ30vJHtsYW5nfS50cmFpbmVkZGF0YWApO1xyXG4gICAgICBpZiAodHlwZW9mIF9kYXRhICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGxvZyhgWyR7d29ya2VySWR9XTogTG9hZCAke2xhbmd9LnRyYWluZWRkYXRhIGZyb20gY2FjaGVgKTtcclxuICAgICAgICByZXMucHJvZ3Jlc3MoeyB3b3JrZXJJZCwgc3RhdHVzOiAnbG9hZGluZyBsYW5ndWFnZSB0cmFpbmVkZGF0YSAoZnJvbSBjYWNoZSknLCBwcm9ncmVzczogMC41IH0pO1xyXG4gICAgICAgIGRhdGEgPSBfZGF0YTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBFcnJvcignTm90IGZvdW5kIGluIGNhY2hlJyk7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbG9nKGBbJHt3b3JrZXJJZH1dOiBMb2FkICR7bGFuZ30udHJhaW5lZGRhdGEgZnJvbSAke2xhbmdQYXRofWApO1xyXG4gICAgICBpZiAodHlwZW9mIF9sYW5nID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGxldCBwYXRoID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKGlzVVJMKGxhbmdQYXRoKSB8fCBsYW5nUGF0aC5zdGFydHNXaXRoKCdtb3otZXh0ZW5zaW9uOi8vJykgfHwgbGFuZ1BhdGguc3RhcnRzV2l0aCgnY2hyb21lLWV4dGVuc2lvbjovLycpIHx8IGxhbmdQYXRoLnN0YXJ0c1dpdGgoJ2ZpbGU6Ly8nKSkgeyAvKiogV2hlbiBsYW5nUGF0aCBpcyBhbiBVUkwgKi9cclxuICAgICAgICAgIHBhdGggPSBsYW5nUGF0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwYXRoICE9PSBudWxsKSB7XHJcbiAgICAgICAgICBjb25zdCBmZXRjaFVybCA9IGAke3BhdGh9LyR7bGFuZ30udHJhaW5lZGRhdGEke2d6aXAgPyAnLmd6JyA6ICcnfWA7XHJcbiAgICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgKGlzV2ViV29ya2VyID8gZmV0Y2ggOiBhZGFwdGVyLmZldGNoKShmZXRjaFVybCk7XHJcbiAgICAgICAgICBpZiAoIXJlc3Aub2spIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoYE5ldHdvcmsgZXJyb3Igd2hpbGUgZmV0Y2hpbmcgJHtmZXRjaFVybH0uIFJlc3BvbnNlIGNvZGU6ICR7cmVzcC5zdGF0dXN9YCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBkYXRhID0gYXdhaXQgcmVzcC5hcnJheUJ1ZmZlcigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBkYXRhID0gYXdhaXQgYWRhcHRlci5yZWFkQ2FjaGUoYCR7bGFuZ1BhdGh9LyR7bGFuZ30udHJhaW5lZGRhdGEke2d6aXAgPyAnLmd6JyA6ICcnfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkYXRhID0gX2xhbmcuZGF0YTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YSA9IG5ldyBVaW50OEFycmF5KGRhdGEpO1xyXG5cclxuICAgIGNvbnN0IHR5cGUgPSBmaWxlVHlwZShkYXRhKTtcclxuICAgIGlmICh0eXBlb2YgdHlwZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZS5taW1lID09PSAnYXBwbGljYXRpb24vZ3ppcCcpIHtcclxuICAgICAgZGF0YSA9IGFkYXB0ZXIuZ3VuemlwKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChUZXNzTW9kdWxlKSB7XHJcbiAgICAgIGlmIChkYXRhUGF0aCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBUZXNzTW9kdWxlLkZTLm1rZGlyKGRhdGFQYXRoKTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgIHJlcy5yZWplY3QoZXJyLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBUZXNzTW9kdWxlLkZTLndyaXRlRmlsZShgJHtkYXRhUGF0aCB8fCAnLid9LyR7bGFuZ30udHJhaW5lZGRhdGFgLCBkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoWyd3cml0ZScsICdyZWZyZXNoJywgdW5kZWZpbmVkXS5pbmNsdWRlcyhjYWNoZU1ldGhvZCkpIHtcclxuICAgICAgYXdhaXQgYWRhcHRlci53cml0ZUNhY2hlKGAke2NhY2hlUGF0aCB8fCAnLid9LyR7bGFuZ30udHJhaW5lZGRhdGFgLCBkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGRhdGEpO1xyXG4gIH07XHJcblxyXG4gIHJlcy5wcm9ncmVzcyh7IHdvcmtlcklkLCBzdGF0dXM6ICdsb2FkaW5nIGxhbmd1YWdlIHRyYWluZWRkYXRhJywgcHJvZ3Jlc3M6IDAgfSk7XHJcbiAgdHJ5IHtcclxuICAgIGF3YWl0IFByb21pc2UuYWxsKCh0eXBlb2YgbGFuZ3MgPT09ICdzdHJpbmcnID8gbGFuZ3Muc3BsaXQoJysnKSA6IGxhbmdzKS5tYXAobG9hZEFuZEd1bnppcEZpbGUpKTtcclxuICAgIHJlcy5wcm9ncmVzcyh7IHdvcmtlcklkLCBzdGF0dXM6ICdsb2FkZWQgbGFuZ3VhZ2UgdHJhaW5lZGRhdGEnLCBwcm9ncmVzczogMSB9KTtcclxuICAgIHJlcy5yZXNvbHZlKGxhbmdzKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIGlmIChpc1dlYldvcmtlciAmJiBlcnIgaW5zdGFuY2VvZiBET01FeGNlcHRpb24pIHtcclxuICAgICAgLypcclxuICAgICAgICogRm9yIHNvbWUgcmVhc29uIGdvb2dsZSBjaHJvbWUgdGhyb3cgRE9NRXhjZXB0aW9uIGluIGxvYWRMYW5nLFxyXG4gICAgICAgKiB3aGlsZSBvdGhlciBicm93c2VyIGlzIE9LLCBmb3Igbm93IHdlIGlnbm9yZSB0aGlzIGV4Y2VwdGlvblxyXG4gICAgICAgKiBhbmQgaG9wZWZ1bGx5IHRvIGZpbmQgdGhlIHJvb3QgY2F1c2Ugb25lIGRheS5cclxuICAgICAgICovXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXMucmVqZWN0KGVyci50b1N0cmluZygpKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBzZXRQYXJhbWV0ZXJzID0gKHsgcGF5bG9hZDogeyBwYXJhbXM6IF9wYXJhbXMgfSB9LCByZXMpID0+IHtcclxuICBPYmplY3Qua2V5cyhfcGFyYW1zKVxyXG4gICAgLmZpbHRlcigoaykgPT4gIWsuc3RhcnRzV2l0aCgndGVzc2pzXycpKVxyXG4gICAgLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICBhcGkuU2V0VmFyaWFibGUoa2V5LCBfcGFyYW1zW2tleV0pO1xyXG4gICAgfSk7XHJcbiAgcGFyYW1zID0geyAuLi5wYXJhbXMsIC4uLl9wYXJhbXMgfTtcclxuXHJcbiAgaWYgKHR5cGVvZiByZXMgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICByZXMucmVzb2x2ZShwYXJhbXMpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGluaXRpYWxpemUgPSAoe1xyXG4gIHdvcmtlcklkLFxyXG4gIHBheWxvYWQ6IHsgbGFuZ3M6IF9sYW5ncywgb2VtIH0sXHJcbn0sIHJlcykgPT4ge1xyXG4gIGNvbnN0IGxhbmdzID0gKHR5cGVvZiBfbGFuZ3MgPT09ICdzdHJpbmcnKVxyXG4gICAgPyBfbGFuZ3NcclxuICAgIDogX2xhbmdzLm1hcCgobCkgPT4gKCh0eXBlb2YgbCA9PT0gJ3N0cmluZycpID8gbCA6IGwuZGF0YSkpLmpvaW4oJysnKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIHJlcy5wcm9ncmVzcyh7XHJcbiAgICAgIHdvcmtlcklkLCBzdGF0dXM6ICdpbml0aWFsaXppbmcgYXBpJywgcHJvZ3Jlc3M6IDAsXHJcbiAgICB9KTtcclxuICAgIGlmIChhcGkgIT09IG51bGwpIHtcclxuICAgICAgYXBpLkVuZCgpO1xyXG4gICAgfVxyXG4gICAgYXBpID0gbmV3IFRlc3NNb2R1bGUuVGVzc0Jhc2VBUEkoKTtcclxuICAgIGFwaS5Jbml0KG51bGwsIGxhbmdzLCBvZW0pO1xyXG4gICAgcGFyYW1zID0gZGVmYXVsdFBhcmFtcztcclxuICAgIHNldFBhcmFtZXRlcnMoeyBwYXlsb2FkOiB7IHBhcmFtcyB9IH0pO1xyXG4gICAgcmVzLnByb2dyZXNzKHtcclxuICAgICAgd29ya2VySWQsIHN0YXR1czogJ2luaXRpYWxpemVkIGFwaScsIHByb2dyZXNzOiAxLFxyXG4gICAgfSk7XHJcbiAgICByZXMucmVzb2x2ZSgpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmVzLnJlamVjdChlcnIudG9TdHJpbmcoKSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgcmVjb2duaXplID0gKHsgcGF5bG9hZDogeyBpbWFnZSwgb3B0aW9uczogeyByZWN0YW5nbGU6IHJlYyB9IH0gfSwgcmVzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHB0ciA9IHNldEltYWdlKFRlc3NNb2R1bGUsIGFwaSwgaW1hZ2UpO1xyXG4gICAgaWYgKHR5cGVvZiByZWMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgIGFwaS5TZXRSZWN0YW5nbGUocmVjLmxlZnQsIHJlYy50b3AsIHJlYy53aWR0aCwgcmVjLmhlaWdodCk7XHJcbiAgICB9XHJcbiAgICBhcGkuUmVjb2duaXplKG51bGwpO1xyXG4gICAgcmVzLnJlc29sdmUoZHVtcChUZXNzTW9kdWxlLCBhcGksIHBhcmFtcykpO1xyXG4gICAgVGVzc01vZHVsZS5fZnJlZShwdHIpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmVzLnJlamVjdChlcnIudG9TdHJpbmcoKSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgZ2V0UERGID0gKHsgcGF5bG9hZDogeyB0aXRsZSwgdGV4dG9ubHkgfSB9LCByZXMpID0+IHtcclxuICBjb25zdCBwZGZSZW5kZXJlciA9IG5ldyBUZXNzTW9kdWxlLlRlc3NQREZSZW5kZXJlcigndGVzc2VyYWN0LW9jcicsICcvJywgdGV4dG9ubHkpO1xyXG4gIHBkZlJlbmRlcmVyLkJlZ2luRG9jdW1lbnQodGl0bGUpO1xyXG4gIHBkZlJlbmRlcmVyLkFkZEltYWdlKGFwaSk7XHJcbiAgcGRmUmVuZGVyZXIuRW5kRG9jdW1lbnQoKTtcclxuICBUZXNzTW9kdWxlLl9mcmVlKHBkZlJlbmRlcmVyKTtcclxuXHJcbiAgcmVzLnJlc29sdmUoVGVzc01vZHVsZS5GUy5yZWFkRmlsZSgnL3Rlc3NlcmFjdC1vY3IucGRmJykpO1xyXG59O1xyXG5cclxuY29uc3QgZGV0ZWN0ID0gKHsgcGF5bG9hZDogeyBpbWFnZSB9IH0sIHJlcykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBwdHIgPSBzZXRJbWFnZShUZXNzTW9kdWxlLCBhcGksIGltYWdlKTtcclxuICAgIGNvbnN0IHJlc3VsdHMgPSBuZXcgVGVzc01vZHVsZS5PU1Jlc3VsdHMoKTtcclxuXHJcbiAgICBpZiAoIWFwaS5EZXRlY3RPUyhyZXN1bHRzKSkge1xyXG4gICAgICBhcGkuRW5kKCk7XHJcbiAgICAgIFRlc3NNb2R1bGUuX2ZyZWUocHRyKTtcclxuICAgICAgcmVzLnJlamVjdCgnRmFpbGVkIHRvIGRldGVjdCBPUycpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgYmVzdCA9IHJlc3VsdHMuYmVzdF9yZXN1bHQ7XHJcbiAgICAgIGNvbnN0IG9pZCA9IGJlc3Qub3JpZW50YXRpb25faWQ7XHJcbiAgICAgIGNvbnN0IHNpZCA9IGJlc3Quc2NyaXB0X2lkO1xyXG5cclxuICAgICAgVGVzc01vZHVsZS5fZnJlZShwdHIpO1xyXG5cclxuICAgICAgcmVzLnJlc29sdmUoe1xyXG4gICAgICAgIHRlc3NlcmFjdF9zY3JpcHRfaWQ6IHNpZCxcclxuICAgICAgICBzY3JpcHQ6IHJlc3VsdHMudW5pY2hhcnNldC5nZXRfc2NyaXB0X2Zyb21fc2NyaXB0X2lkKHNpZCksXHJcbiAgICAgICAgc2NyaXB0X2NvbmZpZGVuY2U6IGJlc3Quc2NvbmZpZGVuY2UsXHJcbiAgICAgICAgb3JpZW50YXRpb25fZGVncmVlczogWzAsIDI3MCwgMTgwLCA5MF1bb2lkXSxcclxuICAgICAgICBvcmllbnRhdGlvbl9jb25maWRlbmNlOiBiZXN0Lm9jb25maWRlbmNlLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJlcy5yZWplY3QoZXJyLnRvU3RyaW5nKCkpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IHRlcm1pbmF0ZSA9IChfLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgaWYgKGFwaSAhPT0gbnVsbCkge1xyXG4gICAgICBhcGkuRW5kKCk7XHJcbiAgICB9XHJcbiAgICByZXMucmVzb2x2ZSh7IHRlcm1pbmF0ZWQ6IHRydWUgfSk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICByZXMucmVqZWN0KGVyci50b1N0cmluZygpKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogZGlzcGF0Y2hIYW5kbGVyc1xyXG4gKlxyXG4gKiBAbmFtZSBkaXNwYXRjaEhhbmRsZXJzXHJcbiAqIEBmdW5jdGlvbiB3b3JrZXIgZGF0YSBoYW5kbGVyXHJcbiAqIEBhY2Nlc3MgcHVibGljXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhLmpvYklkIC0gdW5pcXVlIGpvYiBpZFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0YS5hY3Rpb24gLSBhY3Rpb24gb2YgdGhlIGpvYiwgb25seSByZWNvZ25pemUgYW5kIGRldGVjdCBmb3Igbm93XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhLnBheWxvYWQgLSBkYXRhIGZvciB0aGUgam9iXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHNlbmQgLSB0cmlnZ2VyIGpvYiB0byB3b3JrXHJcbiAqL1xyXG5leHBvcnRzLmRpc3BhdGNoSGFuZGxlcnMgPSAocGFja2V0LCBzZW5kKSA9PiB7XHJcbiAgY29uc3QgcmVzID0gKHN0YXR1cywgZGF0YSkgPT4ge1xyXG4gICAgc2VuZCh7XHJcbiAgICAgIC4uLnBhY2tldCxcclxuICAgICAgc3RhdHVzLFxyXG4gICAgICBkYXRhLFxyXG4gICAgfSk7XHJcbiAgfTtcclxuICByZXMucmVzb2x2ZSA9IHJlcy5iaW5kKHRoaXMsICdyZXNvbHZlJyk7XHJcbiAgcmVzLnJlamVjdCA9IHJlcy5iaW5kKHRoaXMsICdyZWplY3QnKTtcclxuICByZXMucHJvZ3Jlc3MgPSByZXMuYmluZCh0aGlzLCAncHJvZ3Jlc3MnKTtcclxuXHJcbiAgbGF0ZXN0Sm9iID0gcmVzO1xyXG5cclxuICB0cnkge1xyXG4gICAgKHtcclxuICAgICAgbG9hZCxcclxuICAgICAgRlMsXHJcbiAgICAgIGxvYWRMYW5ndWFnZSxcclxuICAgICAgaW5pdGlhbGl6ZSxcclxuICAgICAgc2V0UGFyYW1ldGVycyxcclxuICAgICAgcmVjb2duaXplLFxyXG4gICAgICBnZXRQREYsXHJcbiAgICAgIGRldGVjdCxcclxuICAgICAgdGVybWluYXRlLFxyXG4gICAgfSlbcGFja2V0LmFjdGlvbl0ocGFja2V0LCByZXMpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgLyoqIFByZXBhcmUgZXhjZXB0aW9uIHRvIHRyYXZlbCB0aHJvdWdoIHBvc3RNZXNzYWdlICovXHJcbiAgICByZXMucmVqZWN0KGVyci50b1N0cmluZygpKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogc2V0QWRhcHRlclxyXG4gKlxyXG4gKiBAbmFtZSBzZXRBZGFwdGVyXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAYWNjZXNzIHB1YmxpY1xyXG4gKiBAcGFyYW0ge29iamVjdH0gYWRhcHRlciAtIGltcGxlbWVudGF0aW9uIG9mIHRoZSB3b3JrZXIsIGRpZmZlcmVudCBpbiBicm93c2VyIGFuZCBub2RlIGVudmlyb25tZW50XHJcbiAqL1xyXG5leHBvcnRzLnNldEFkYXB0ZXIgPSAoX2FkYXB0ZXIpID0+IHtcclxuICBhZGFwdGVyID0gX2FkYXB0ZXI7XHJcbn07XHJcbiIsIi8qKlxyXG4gKlxyXG4gKiBEdW1wIGRhdGEgdG8gYSBiaWcgSlNPTiB0cmVlXHJcbiAqXHJcbiAqIEBmaWxlb3ZlcnZpZXcgZHVtcCBkYXRhIHRvIEpTT04gdHJlZVxyXG4gKiBAYXV0aG9yIEtldmluIEt3b2sgPGFudGltYXR0ZXIxNUBnbWFpbC5jb20+XHJcbiAqIEBhdXRob3IgR3VpbGxlcm1vIFdlYnN0ZXIgPGd1aUBtaXQuZWR1PlxyXG4gKiBAYXV0aG9yIEplcm9tZSBXdSA8amVyb21ld3VzQGdtYWlsLmNvbT5cclxuICovXHJcblxyXG4vKipcclxuICogZGVpbmRlbnRcclxuICpcclxuICogVGhlIGdlbmVyYXRlZCBIT0NSIGlzIGV4Y2Vzc2l2ZWx5IGluZGVudGVkLCBzb1xyXG4gKiB3ZSBnZXQgcmlkIG9mIHRoYXQgaW5kZW50YXRpb25cclxuICpcclxuICogQG5hbWUgZGVpbmRlbnRcclxuICogQGZ1bmN0aW9uIGRlaW5kZW50IHN0cmluZ1xyXG4gKiBAYWNjZXNzIHB1YmxpY1xyXG4gKi9cclxuY29uc3QgZGVpbmRlbnQgPSAoaHRtbCkgPT4ge1xyXG4gIGNvbnN0IGxpbmVzID0gaHRtbC5zcGxpdCgnXFxuJyk7XHJcbiAgaWYgKGxpbmVzWzBdLnN1YnN0cmluZygwLCAyKSA9PT0gJyAgJykge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBpZiAobGluZXNbaV0uc3Vic3RyaW5nKDAsIDIpID09PSAnICAnKSB7XHJcbiAgICAgICAgbGluZXNbaV0gPSBsaW5lc1tpXS5zbGljZSgyKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbGluZXMuam9pbignXFxuJyk7XHJcbn07XHJcblxyXG4vKipcclxuICogZHVtcFxyXG4gKlxyXG4gKiBAbmFtZSBkdW1wXHJcbiAqIEBmdW5jdGlvbiBkdW1wIHJlY29nbml0aW9uIHJlc3VsdCB0byBhIEpTT04gb2JqZWN0XHJcbiAqIEBhY2Nlc3MgcHVibGljXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IChUZXNzTW9kdWxlLCBhcGksIHtcclxuICB0ZXNzanNfY3JlYXRlX2hvY3IsXHJcbiAgdGVzc2pzX2NyZWF0ZV90c3YsXHJcbiAgdGVzc2pzX2NyZWF0ZV9ib3gsXHJcbiAgdGVzc2pzX2NyZWF0ZV91bmx2LFxyXG4gIHRlc3Nqc19jcmVhdGVfb3NkLFxyXG59KSA9PiB7XHJcbiAgY29uc3QgcmkgPSBhcGkuR2V0SXRlcmF0b3IoKTtcclxuICBjb25zdCB7XHJcbiAgICBSSUxfQkxPQ0ssXHJcbiAgICBSSUxfUEFSQSxcclxuICAgIFJJTF9URVhUTElORSxcclxuICAgIFJJTF9XT1JELFxyXG4gICAgUklMX1NZTUJPTCxcclxuICB9ID0gVGVzc01vZHVsZTtcclxuICBjb25zdCBibG9ja3MgPSBbXTtcclxuICBsZXQgYmxvY2s7XHJcbiAgbGV0IHBhcmE7XHJcbiAgbGV0IHRleHRsaW5lO1xyXG4gIGxldCB3b3JkO1xyXG4gIGxldCBzeW1ib2w7XHJcblxyXG4gIGNvbnN0IGVudW1Ub1N0cmluZyA9ICh2YWx1ZSwgcHJlZml4KSA9PiAoXHJcbiAgICBPYmplY3Qua2V5cyhUZXNzTW9kdWxlKVxyXG4gICAgICAuZmlsdGVyKChlKSA9PiAoZS5zdGFydHNXaXRoKGAke3ByZWZpeH1fYCkgJiYgVGVzc01vZHVsZVtlXSA9PT0gdmFsdWUpKVxyXG4gICAgICAubWFwKChlKSA9PiBlLnNsaWNlKHByZWZpeC5sZW5ndGggKyAxKSlbMF1cclxuICApO1xyXG5cclxuICByaS5CZWdpbigpO1xyXG4gIGRvIHtcclxuICAgIGlmIChyaS5Jc0F0QmVnaW5uaW5nT2YoUklMX0JMT0NLKSkge1xyXG4gICAgICBjb25zdCBwb2x5ID0gcmkuQmxvY2tQb2x5Z29uKCk7XHJcbiAgICAgIGxldCBwb2x5Z29uID0gbnVsbDtcclxuICAgICAgLy8gQmxvY2tQb2x5Z29uKCkgcmV0dXJucyBudWxsIHdoZW4gYXV0b21hdGljIHBhZ2Ugc2VnbWVudGF0aW9uIGlzIG9mZlxyXG4gICAgICBpZiAoVGVzc01vZHVsZS5nZXRQb2ludGVyKHBvbHkpID4gMCkge1xyXG4gICAgICAgIGNvbnN0IG4gPSBwb2x5LmdldF9uKCk7XHJcbiAgICAgICAgY29uc3QgcHggPSBwb2x5LmdldF94KCk7XHJcbiAgICAgICAgY29uc3QgcHkgPSBwb2x5LmdldF95KCk7XHJcbiAgICAgICAgcG9seWdvbiA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSArPSAxKSB7XHJcbiAgICAgICAgICBwb2x5Z29uLnB1c2goW3B4LmdldFZhbHVlKGkpLCBweS5nZXRWYWx1ZShpKV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRPRE86IGZpbmQgb3V0IHdoeSBfcHRhRGVzdHJveSBkb2Vzbid0IHdvcmtcclxuICAgICAgICAgKi9cclxuICAgICAgICAvLyBUZXNzTW9kdWxlLl9wdGFEZXN0cm95KFRlc3NNb2R1bGUuZ2V0UG9pbnRlcihwb2x5KSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGJsb2NrID0ge1xyXG4gICAgICAgIHBhcmFncmFwaHM6IFtdLFxyXG4gICAgICAgIHRleHQ6IHJpLkdldFVURjhUZXh0KFJJTF9CTE9DSyksXHJcbiAgICAgICAgY29uZmlkZW5jZTogcmkuQ29uZmlkZW5jZShSSUxfQkxPQ0spLFxyXG4gICAgICAgIGJhc2VsaW5lOiByaS5nZXRCYXNlbGluZShSSUxfQkxPQ0spLFxyXG4gICAgICAgIGJib3g6IHJpLmdldEJvdW5kaW5nQm94KFJJTF9CTE9DSyksXHJcbiAgICAgICAgYmxvY2t0eXBlOiBlbnVtVG9TdHJpbmcocmkuQmxvY2tUeXBlKCksICdQVCcpLFxyXG4gICAgICAgIHBvbHlnb24sXHJcbiAgICAgIH07XHJcbiAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrKTtcclxuICAgIH1cclxuICAgIGlmIChyaS5Jc0F0QmVnaW5uaW5nT2YoUklMX1BBUkEpKSB7XHJcbiAgICAgIHBhcmEgPSB7XHJcbiAgICAgICAgbGluZXM6IFtdLFxyXG4gICAgICAgIHRleHQ6IHJpLkdldFVURjhUZXh0KFJJTF9QQVJBKSxcclxuICAgICAgICBjb25maWRlbmNlOiByaS5Db25maWRlbmNlKFJJTF9QQVJBKSxcclxuICAgICAgICBiYXNlbGluZTogcmkuZ2V0QmFzZWxpbmUoUklMX1BBUkEpLFxyXG4gICAgICAgIGJib3g6IHJpLmdldEJvdW5kaW5nQm94KFJJTF9QQVJBKSxcclxuICAgICAgICBpc19sdHI6ICEhcmkuUGFyYWdyYXBoSXNMdHIoKSxcclxuICAgICAgfTtcclxuICAgICAgYmxvY2sucGFyYWdyYXBocy5wdXNoKHBhcmEpO1xyXG4gICAgfVxyXG4gICAgaWYgKHJpLklzQXRCZWdpbm5pbmdPZihSSUxfVEVYVExJTkUpKSB7XHJcbiAgICAgIHRleHRsaW5lID0ge1xyXG4gICAgICAgIHdvcmRzOiBbXSxcclxuICAgICAgICB0ZXh0OiByaS5HZXRVVEY4VGV4dChSSUxfVEVYVExJTkUpLFxyXG4gICAgICAgIGNvbmZpZGVuY2U6IHJpLkNvbmZpZGVuY2UoUklMX1RFWFRMSU5FKSxcclxuICAgICAgICBiYXNlbGluZTogcmkuZ2V0QmFzZWxpbmUoUklMX1RFWFRMSU5FKSxcclxuICAgICAgICBiYm94OiByaS5nZXRCb3VuZGluZ0JveChSSUxfVEVYVExJTkUpLFxyXG4gICAgICB9O1xyXG4gICAgICBwYXJhLmxpbmVzLnB1c2godGV4dGxpbmUpO1xyXG4gICAgfVxyXG4gICAgaWYgKHJpLklzQXRCZWdpbm5pbmdPZihSSUxfV09SRCkpIHtcclxuICAgICAgY29uc3QgZm9udEluZm8gPSByaS5nZXRXb3JkRm9udEF0dHJpYnV0ZXMoKTtcclxuICAgICAgY29uc3Qgd29yZERpciA9IHJpLldvcmREaXJlY3Rpb24oKTtcclxuICAgICAgd29yZCA9IHtcclxuICAgICAgICBzeW1ib2xzOiBbXSxcclxuICAgICAgICBjaG9pY2VzOiBbXSxcclxuXHJcbiAgICAgICAgdGV4dDogcmkuR2V0VVRGOFRleHQoUklMX1dPUkQpLFxyXG4gICAgICAgIGNvbmZpZGVuY2U6IHJpLkNvbmZpZGVuY2UoUklMX1dPUkQpLFxyXG4gICAgICAgIGJhc2VsaW5lOiByaS5nZXRCYXNlbGluZShSSUxfV09SRCksXHJcbiAgICAgICAgYmJveDogcmkuZ2V0Qm91bmRpbmdCb3goUklMX1dPUkQpLFxyXG5cclxuICAgICAgICBpc19udW1lcmljOiAhIXJpLldvcmRJc051bWVyaWMoKSxcclxuICAgICAgICBpbl9kaWN0aW9uYXJ5OiAhIXJpLldvcmRJc0Zyb21EaWN0aW9uYXJ5KCksXHJcbiAgICAgICAgZGlyZWN0aW9uOiBlbnVtVG9TdHJpbmcod29yZERpciwgJ0RJUicpLFxyXG4gICAgICAgIGxhbmd1YWdlOiByaS5Xb3JkUmVjb2duaXRpb25MYW5ndWFnZSgpLFxyXG5cclxuICAgICAgICBpc19ib2xkOiBmb250SW5mby5pc19ib2xkLFxyXG4gICAgICAgIGlzX2l0YWxpYzogZm9udEluZm8uaXNfaXRhbGljLFxyXG4gICAgICAgIGlzX3VuZGVybGluZWQ6IGZvbnRJbmZvLmlzX3VuZGVybGluZWQsXHJcbiAgICAgICAgaXNfbW9ub3NwYWNlOiBmb250SW5mby5pc19tb25vc3BhY2UsXHJcbiAgICAgICAgaXNfc2VyaWY6IGZvbnRJbmZvLmlzX3NlcmlmLFxyXG4gICAgICAgIGlzX3NtYWxsY2FwczogZm9udEluZm8uaXNfc21hbGxjYXBzLFxyXG4gICAgICAgIGZvbnRfc2l6ZTogZm9udEluZm8ucG9pbnRzaXplLFxyXG4gICAgICAgIGZvbnRfaWQ6IGZvbnRJbmZvLmZvbnRfaWQsXHJcbiAgICAgICAgZm9udF9uYW1lOiBmb250SW5mby5mb250X25hbWUsXHJcbiAgICAgIH07XHJcbiAgICAgIGNvbnN0IHdjID0gbmV3IFRlc3NNb2R1bGUuV29yZENob2ljZUl0ZXJhdG9yKHJpKTtcclxuICAgICAgZG8ge1xyXG4gICAgICAgIHdvcmQuY2hvaWNlcy5wdXNoKHtcclxuICAgICAgICAgIHRleHQ6IHdjLkdldFVURjhUZXh0KCksXHJcbiAgICAgICAgICBjb25maWRlbmNlOiB3Yy5Db25maWRlbmNlKCksXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gd2hpbGUgKHdjLk5leHQoKSk7XHJcbiAgICAgIFRlc3NNb2R1bGUuZGVzdHJveSh3Yyk7XHJcbiAgICAgIHRleHRsaW5lLndvcmRzLnB1c2god29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbGV0IGltYWdlID0gbnVsbDtcclxuICAgIC8vIHZhciBwaXggPSByaS5HZXRCaW5hcnlJbWFnZShUZXNzTW9kdWxlLlJJTF9TWU1CT0wpXHJcbiAgICAvLyB2YXIgaW1hZ2UgPSBwaXgyYXJyYXkocGl4KTtcclxuICAgIC8vIC8vIGZvciBzb21lIHJlYXNvbiBpdCBzZWVtcyB0aGF0IHRoaW5ncyBzdG9wIHdvcmtpbmcgaWYgeW91IGRlc3Ryb3kgcGljc1xyXG4gICAgLy8gVGVzc01vZHVsZS5fcGl4RGVzdHJveShUZXNzTW9kdWxlLmdldFBvaW50ZXIocGl4KSk7XHJcbiAgICBpZiAocmkuSXNBdEJlZ2lubmluZ09mKFJJTF9TWU1CT0wpKSB7XHJcbiAgICAgIHN5bWJvbCA9IHtcclxuICAgICAgICBjaG9pY2VzOiBbXSxcclxuICAgICAgICBpbWFnZTogbnVsbCxcclxuICAgICAgICB0ZXh0OiByaS5HZXRVVEY4VGV4dChSSUxfU1lNQk9MKSxcclxuICAgICAgICBjb25maWRlbmNlOiByaS5Db25maWRlbmNlKFJJTF9TWU1CT0wpLFxyXG4gICAgICAgIGJhc2VsaW5lOiByaS5nZXRCYXNlbGluZShSSUxfU1lNQk9MKSxcclxuICAgICAgICBiYm94OiByaS5nZXRCb3VuZGluZ0JveChSSUxfU1lNQk9MKSxcclxuICAgICAgICBpc19zdXBlcnNjcmlwdDogISFyaS5TeW1ib2xJc1N1cGVyc2NyaXB0KCksXHJcbiAgICAgICAgaXNfc3Vic2NyaXB0OiAhIXJpLlN5bWJvbElzU3Vic2NyaXB0KCksXHJcbiAgICAgICAgaXNfZHJvcGNhcDogISFyaS5TeW1ib2xJc0Ryb3BjYXAoKSxcclxuICAgICAgfTtcclxuICAgICAgd29yZC5zeW1ib2xzLnB1c2goc3ltYm9sKTtcclxuICAgICAgY29uc3QgY2kgPSBuZXcgVGVzc01vZHVsZS5DaG9pY2VJdGVyYXRvcihyaSk7XHJcbiAgICAgIGRvIHtcclxuICAgICAgICBzeW1ib2wuY2hvaWNlcy5wdXNoKHtcclxuICAgICAgICAgIHRleHQ6IGNpLkdldFVURjhUZXh0KCksXHJcbiAgICAgICAgICBjb25maWRlbmNlOiBjaS5Db25maWRlbmNlKCksXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gd2hpbGUgKGNpLk5leHQoKSk7XHJcbiAgICAgIC8vIFRlc3NNb2R1bGUuZGVzdHJveShpKTtcclxuICAgIH1cclxuICB9IHdoaWxlIChyaS5OZXh0KFJJTF9TWU1CT0wpKTtcclxuICBUZXNzTW9kdWxlLmRlc3Ryb3kocmkpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdGV4dDogYXBpLkdldFVURjhUZXh0KCksXHJcbiAgICBob2NyOiB0ZXNzanNfY3JlYXRlX2hvY3IgPT09ICcxJyA/IGRlaW5kZW50KGFwaS5HZXRIT0NSVGV4dCgpKSA6IG51bGwsXHJcbiAgICB0c3Y6IHRlc3Nqc19jcmVhdGVfdHN2ID09PSAnMScgPyBhcGkuR2V0VFNWVGV4dCgpIDogbnVsbCxcclxuICAgIGJveDogdGVzc2pzX2NyZWF0ZV9ib3ggPT09ICcxJyA/IGFwaS5HZXRCb3hUZXh0KCkgOiBudWxsLFxyXG4gICAgdW5sdjogdGVzc2pzX2NyZWF0ZV91bmx2ID09PSAnMScgPyBhcGkuR2V0VU5MVlRleHQoKSA6IG51bGwsXHJcbiAgICBvc2Q6IHRlc3Nqc19jcmVhdGVfb3NkID09PSAnMScgPyBhcGkuR2V0T3NkVGV4dCgpIDogbnVsbCxcclxuICAgIGNvbmZpZGVuY2U6IGFwaS5NZWFuVGV4dENvbmYoKSxcclxuICAgIGJsb2NrcyxcclxuICAgIHBzbTogZW51bVRvU3RyaW5nKGFwaS5HZXRQYWdlU2VnTW9kZSgpLCAnUFNNJyksXHJcbiAgICBvZW06IGVudW1Ub1N0cmluZyhhcGkub2VtKCksICdPRU0nKSxcclxuICAgIHZlcnNpb246IGFwaS5WZXJzaW9uKCksXHJcbiAgfTtcclxufTtcclxuIiwiY29uc3QgYm1wID0gcmVxdWlyZSgnYm1wLWpzJyk7XHJcbmNvbnN0IGZpbGVUeXBlID0gcmVxdWlyZSgnZmlsZS10eXBlJyk7XHJcblxyXG4vKipcclxuICogc2V0SW1hZ2VcclxuICpcclxuICogQG5hbWUgc2V0SW1hZ2VcclxuICogQGZ1bmN0aW9uIHNldCBpbWFnZSBpbiB0ZXNzZXJhY3QgZm9yIHJlY29nbml0aW9uXHJcbiAqIEBhY2Nlc3MgcHVibGljXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IChUZXNzTW9kdWxlLCBhcGksIGltYWdlKSA9PiB7XHJcbiAgY29uc3QgYnVmID0gQnVmZmVyLmZyb20oQXJyYXkuZnJvbSh7IC4uLmltYWdlLCBsZW5ndGg6IE9iamVjdC5rZXlzKGltYWdlKS5sZW5ndGggfSkpO1xyXG4gIGNvbnN0IHR5cGUgPSBmaWxlVHlwZShidWYpO1xyXG4gIGxldCBieXRlc1BlclBpeGVsID0gMDtcclxuICBsZXQgZGF0YSA9IG51bGw7XHJcbiAgbGV0IHBpeCA9IG51bGw7XHJcbiAgbGV0IHcgPSAwO1xyXG4gIGxldCBoID0gMDtcclxuXHJcbiAgY29uc3QgZXhpZiA9IGJ1Zi5zbGljZSgwLCA1MDApLnRvU3RyaW5nKCkubWF0Y2goL1xceDAxXFx4MTJcXHgwMFxceDAzXFx4MDBcXHgwMFxceDAwXFx4MDFcXHgwMCguKS8pPy5bMV0/LmNoYXJDb2RlQXQoMCkgfHwgMTtcclxuXHJcbiAgLypcclxuICAgKiBMZXB0b25pY2Egc3VwcG9ydHMgdW5jb21wcmVzc2VkIGJ1dCBub3QgY29tcHJlc3NlZCBibXAgZmlsZXNcclxuICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9EYW5CbG9vbWJlcmcvbGVwdG9uaWNhL2lzc3Vlcy82MDcjaXNzdWVjb21tZW50LTEwNjg4MDI1MTZcclxuICAgKiBXZSB0aGVyZWZvcmUgdXNlIGJtcC1qcyB0byBwcm9jZXNzIGFsbCBibXAgZmlsZXNcclxuICAgKi9cclxuICBpZiAodHlwZSAmJiB0eXBlLm1pbWUgPT09ICdpbWFnZS9ibXAnKSB7XHJcbiAgICBjb25zdCBibXBCdWYgPSBibXAuZGVjb2RlKGJ1Zik7XHJcbiAgICBkYXRhID0gVGVzc01vZHVsZS5fbWFsbG9jKGJtcEJ1Zi5kYXRhLmxlbmd0aCAqIFVpbnQ4QXJyYXkuQllURVNfUEVSX0VMRU1FTlQpO1xyXG4gICAgVGVzc01vZHVsZS5IRUFQVTguc2V0KGJtcEJ1Zi5kYXRhLCBkYXRhKTtcclxuICAgIHcgPSBibXBCdWYud2lkdGg7XHJcbiAgICBoID0gYm1wQnVmLmhlaWdodDtcclxuICAgIGJ5dGVzUGVyUGl4ZWwgPSA0O1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zdCBwdHIgPSBUZXNzTW9kdWxlLl9tYWxsb2MoYnVmLmxlbmd0aCAqIFVpbnQ4QXJyYXkuQllURVNfUEVSX0VMRU1FTlQpO1xyXG4gICAgVGVzc01vZHVsZS5IRUFQVTguc2V0KGJ1ZiwgcHRyKTtcclxuICAgIHBpeCA9IFRlc3NNb2R1bGUuX3BpeFJlYWRNZW0ocHRyLCBidWYubGVuZ3RoKTtcclxuICAgIGlmIChUZXNzTW9kdWxlLmdldFZhbHVlKHBpeCArICg3ICogNCksICdpMzInKSA9PT0gMCkge1xyXG4gICAgICAvKlxyXG4gICAgICAgKiBTZXQgYSB5cmVzIGRlZmF1bHQgdmFsdWUgdG8gcHJldmVudCB3YXJuaW5nIGZyb20gdGVzc2VyYWN0XHJcbiAgICAgICAqIFNlZSBrTWluQ3JlZGlibGVSZXNvbHV0aW9uIGluIHRlc3NlcmFjdC9zcmMvY2NzdHJ1Y3QvcHVibGljdHlwZXMuaFxyXG4gICAgICAgKi9cclxuICAgICAgVGVzc01vZHVsZS5zZXRWYWx1ZShwaXggKyAoNyAqIDQpLCAzMDAsICdpMzInKTtcclxuICAgIH1cclxuICAgIFt3LCBoXSA9IEFycmF5KDIpLmZpbGwoMClcclxuICAgICAgLm1hcCgodiwgaWR4KSA9PiAoXHJcbiAgICAgICAgVGVzc01vZHVsZS5nZXRWYWx1ZShwaXggKyAoaWR4ICogNCksICdpMzInKVxyXG4gICAgICApKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgICogQXMgc29tZSBpbWFnZSBmb3JtYXQgKGV4LiBibXApIGlzIG5vdCBzdXBwb3J0ZWQgbmF0aWVseSBieSB0ZXNzZXJhY3QsXHJcbiAgICogc29tZXRpbWVzIGl0IHdpbGwgbm90IHJldHVybiBwaXggZGlyZWN0bHksIGJ1dCBkYXRhIGFuZCBieXRlc1BlclBpeGVsXHJcbiAgICogZm9yIGFub3RoZXIgU2V0SW1hZ2UgdXNhZ2UuXHJcbiAgICpcclxuICAgKi9cclxuICBpZiAoZGF0YSA9PT0gbnVsbCkge1xyXG4gICAgYXBpLlNldEltYWdlKHBpeCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBleGlmKTtcclxuICB9IGVsc2Uge1xyXG4gICAgYXBpLlNldEltYWdlKGRhdGEsIHcsIGgsIGJ5dGVzUGVyUGl4ZWwsIHcgKiBieXRlc1BlclBpeGVsLCBleGlmKTtcclxuICB9XHJcbiAgcmV0dXJuIGRhdGEgPT09IG51bGwgPyBwaXggOiBkYXRhO1xyXG59O1xyXG4iLCJjbGFzcyBTdG9yZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihkYk5hbWUgPSAna2V5dmFsLXN0b3JlJywgc3RvcmVOYW1lID0gJ2tleXZhbCcpIHtcclxuICAgICAgICB0aGlzLnN0b3JlTmFtZSA9IHN0b3JlTmFtZTtcclxuICAgICAgICB0aGlzLl9kYnAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wZW5yZXEgPSBpbmRleGVkREIub3BlbihkYk5hbWUsIDEpO1xyXG4gICAgICAgICAgICBvcGVucmVxLm9uZXJyb3IgPSAoKSA9PiByZWplY3Qob3BlbnJlcS5lcnJvcik7XHJcbiAgICAgICAgICAgIG9wZW5yZXEub25zdWNjZXNzID0gKCkgPT4gcmVzb2x2ZShvcGVucmVxLnJlc3VsdCk7XHJcbiAgICAgICAgICAgIC8vIEZpcnN0IHRpbWUgc2V0dXA6IGNyZWF0ZSBhbiBlbXB0eSBvYmplY3Qgc3RvcmVcclxuICAgICAgICAgICAgb3BlbnJlcS5vbnVwZ3JhZGVuZWVkZWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvcGVucmVxLnJlc3VsdC5jcmVhdGVPYmplY3RTdG9yZShzdG9yZU5hbWUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgX3dpdGhJREJTdG9yZSh0eXBlLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kYnAudGhlbihkYiA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24odGhpcy5zdG9yZU5hbWUsIHR5cGUpO1xyXG4gICAgICAgICAgICB0cmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gKCkgPT4gcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB0cmFuc2FjdGlvbi5vbmFib3J0ID0gdHJhbnNhY3Rpb24ub25lcnJvciA9ICgpID0+IHJlamVjdCh0cmFuc2FjdGlvbi5lcnJvcik7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHRoaXMuc3RvcmVOYW1lKSk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG59XHJcbmxldCBzdG9yZTtcclxuZnVuY3Rpb24gZ2V0RGVmYXVsdFN0b3JlKCkge1xyXG4gICAgaWYgKCFzdG9yZSlcclxuICAgICAgICBzdG9yZSA9IG5ldyBTdG9yZSgpO1xyXG4gICAgcmV0dXJuIHN0b3JlO1xyXG59XHJcbmZ1bmN0aW9uIGdldChrZXksIHN0b3JlID0gZ2V0RGVmYXVsdFN0b3JlKCkpIHtcclxuICAgIGxldCByZXE7XHJcbiAgICByZXR1cm4gc3RvcmUuX3dpdGhJREJTdG9yZSgncmVhZG9ubHknLCBzdG9yZSA9PiB7XHJcbiAgICAgICAgcmVxID0gc3RvcmUuZ2V0KGtleSk7XHJcbiAgICB9KS50aGVuKCgpID0+IHJlcS5yZXN1bHQpO1xyXG59XHJcbmZ1bmN0aW9uIHNldChrZXksIHZhbHVlLCBzdG9yZSA9IGdldERlZmF1bHRTdG9yZSgpKSB7XHJcbiAgICByZXR1cm4gc3RvcmUuX3dpdGhJREJTdG9yZSgncmVhZHdyaXRlJywgc3RvcmUgPT4ge1xyXG4gICAgICAgIHN0b3JlLnB1dCh2YWx1ZSwga2V5KTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGRlbChrZXksIHN0b3JlID0gZ2V0RGVmYXVsdFN0b3JlKCkpIHtcclxuICAgIHJldHVybiBzdG9yZS5fd2l0aElEQlN0b3JlKCdyZWFkd3JpdGUnLCBzdG9yZSA9PiB7XHJcbiAgICAgICAgc3RvcmUuZGVsZXRlKGtleSk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBjbGVhcihzdG9yZSA9IGdldERlZmF1bHRTdG9yZSgpKSB7XHJcbiAgICByZXR1cm4gc3RvcmUuX3dpdGhJREJTdG9yZSgncmVhZHdyaXRlJywgc3RvcmUgPT4ge1xyXG4gICAgICAgIHN0b3JlLmNsZWFyKCk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBrZXlzKHN0b3JlID0gZ2V0RGVmYXVsdFN0b3JlKCkpIHtcclxuICAgIGNvbnN0IGtleXMgPSBbXTtcclxuICAgIHJldHVybiBzdG9yZS5fd2l0aElEQlN0b3JlKCdyZWFkb25seScsIHN0b3JlID0+IHtcclxuICAgICAgICAvLyBUaGlzIHdvdWxkIGJlIHN0b3JlLmdldEFsbEtleXMoKSwgYnV0IGl0IGlzbid0IHN1cHBvcnRlZCBieSBFZGdlIG9yIFNhZmFyaS5cclxuICAgICAgICAvLyBBbmQgb3BlbktleUN1cnNvciBpc24ndCBzdXBwb3J0ZWQgYnkgU2FmYXJpLlxyXG4gICAgICAgIChzdG9yZS5vcGVuS2V5Q3Vyc29yIHx8IHN0b3JlLm9wZW5DdXJzb3IpLmNhbGwoc3RvcmUpLm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnJlc3VsdClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAga2V5cy5wdXNoKHRoaXMucmVzdWx0LmtleSk7XHJcbiAgICAgICAgICAgIHRoaXMucmVzdWx0LmNvbnRpbnVlKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pLnRoZW4oKCkgPT4ga2V5cyk7XHJcbn1cblxuZXhwb3J0IHsgU3RvcmUsIGdldCwgc2V0LCBkZWwsIGNsZWFyLCBrZXlzIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5tZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlLnBhdGhzID0gW107XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwiLyoqXHJcbiAqXHJcbiAqIEJyb3dzZXIgd29ya2VyIHNjcmlwdHNcclxuICpcclxuICogQGZpbGVvdmVydmlldyBCcm93c2VyIHdvcmtlciBpbXBsZW1lbnRhdGlvblxyXG4gKiBAYXV0aG9yIEtldmluIEt3b2sgPGFudGltYXR0ZXIxNUBnbWFpbC5jb20+XHJcbiAqIEBhdXRob3IgR3VpbGxlcm1vIFdlYnN0ZXIgPGd1aUBtaXQuZWR1PlxyXG4gKiBAYXV0aG9yIEplcm9tZSBXdSA8amVyb21ld3VzQGdtYWlsLmNvbT5cclxuICovXHJcblxyXG5jb25zdCB3b3JrZXIgPSByZXF1aXJlKCcuLicpO1xyXG5jb25zdCBnZXRDb3JlID0gcmVxdWlyZSgnLi9nZXRDb3JlJyk7XHJcbmNvbnN0IGd1bnppcCA9IHJlcXVpcmUoJy4vZ3VuemlwJyk7XHJcbmNvbnN0IGNhY2hlID0gcmVxdWlyZSgnLi9jYWNoZScpO1xyXG5cclxuLypcclxuICogcmVnaXN0ZXIgbWVzc2FnZSBoYW5kbGVyXHJcbiAqL1xyXG5nbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsICh7IGRhdGEgfSkgPT4ge1xyXG4gIHdvcmtlci5kaXNwYXRjaEhhbmRsZXJzKGRhdGEsIChvYmopID0+IHBvc3RNZXNzYWdlKG9iaikpO1xyXG59KTtcclxuXHJcbi8qXHJcbiAqIGdldENvcmUgaXMgYSBzeW5jIGZ1bmN0aW9uIHRvIGxvYWQgYW5kIHJldHVyblxyXG4gKiBUZXNzZXJhY3RDb3JlLlxyXG4gKi9cclxud29ya2VyLnNldEFkYXB0ZXIoe1xyXG4gIGdldENvcmUsXHJcbiAgZ3VuemlwLFxyXG4gIGZldGNoOiAoKSA9PiB7fSxcclxuICAuLi5jYWNoZSxcclxufSk7XHJcbiJdLCJuYW1lcyI6WyJleHBvcnRzIiwiYnl0ZUxlbmd0aCIsInRvQnl0ZUFycmF5IiwiZnJvbUJ5dGVBcnJheSIsImxvb2t1cCIsInJldkxvb2t1cCIsIkFyciIsIlVpbnQ4QXJyYXkiLCJBcnJheSIsImNvZGUiLCJpIiwibGVuIiwibGVuZ3RoIiwiY2hhckNvZGVBdCIsImdldExlbnMiLCJiNjQiLCJFcnJvciIsInZhbGlkTGVuIiwiaW5kZXhPZiIsInBsYWNlSG9sZGVyc0xlbiIsImxlbnMiLCJfYnl0ZUxlbmd0aCIsInRtcCIsImFyciIsImN1ckJ5dGUiLCJ0cmlwbGV0VG9CYXNlNjQiLCJudW0iLCJlbmNvZGVDaHVuayIsInVpbnQ4Iiwic3RhcnQiLCJlbmQiLCJvdXRwdXQiLCJwdXNoIiwiam9pbiIsImV4dHJhQnl0ZXMiLCJwYXJ0cyIsIm1heENodW5rTGVuZ3RoIiwibGVuMiIsImVuY29kZSIsInJlcXVpcmUiLCJkZWNvZGUiLCJtb2R1bGUiLCJCbXBEZWNvZGVyIiwiYnVmZmVyIiwiaXNfd2l0aF9hbHBoYSIsInBvcyIsImJvdHRvbV91cCIsImZsYWciLCJ0b1N0cmluZyIsInBhcnNlSGVhZGVyIiwicGFyc2VSR0JBIiwicHJvdG90eXBlIiwiZmlsZVNpemUiLCJyZWFkVUludDMyTEUiLCJyZXNlcnZlZCIsIm9mZnNldCIsImhlYWRlclNpemUiLCJ3aWR0aCIsImhlaWdodCIsInJlYWRJbnQzMkxFIiwicGxhbmVzIiwicmVhZFVJbnQxNkxFIiwiYml0UFAiLCJjb21wcmVzcyIsInJhd1NpemUiLCJociIsInZyIiwiY29sb3JzIiwiaW1wb3J0YW50Q29sb3JzIiwicGFsZXR0ZSIsImJsdWUiLCJyZWFkVUludDgiLCJncmVlbiIsInJlZCIsInF1YWQiLCJiaXRuIiwiZGF0YSIsIkJ1ZmZlciIsImJpdDEiLCJ4bGVuIiwiTWF0aCIsImNlaWwiLCJtb2RlIiwieSIsImxpbmUiLCJ4IiwiYiIsImxvY2F0aW9uIiwicmdiIiwiYml0NCIsInNldFBpeGVsRGF0YSIsInJnYkluZGV4IiwiZmlsbCIsImxpbmVzIiwibG93X25pYmJsZSIsImEiLCJjIiwiY2FsbCIsImJlZm9yZSIsImFmdGVyIiwiYml0OCIsImJpdDE1IiwiZGlmX3ciLCJfMTExMTEiLCJwYXJzZUludCIsIl8xXzUiLCJCIiwiYWxwaGEiLCJiaXQxNiIsIm1hc2tSZWQiLCJtYXNrR3JlZW4iLCJtYXNrQmx1ZSIsIm1hc2swIiwibnMiLCJiaXQyNCIsImJpdDMyIiwiZ2V0RGF0YSIsImJtcERhdGEiLCJkZWNvZGVyIiwiQm1wRW5jb2RlciIsImltZ0RhdGEiLCJyZ2JTaXplIiwiaGVhZGVySW5mb1NpemUiLCJ0ZW1wQnVmZmVyIiwid3JpdGUiLCJ3cml0ZVVJbnQzMkxFIiwid3JpdGVJbnQzMkxFIiwid3JpdGVVSW50MTZMRSIsInJvd0J5dGVzIiwicCIsImZpbGxPZmZzZXQiLCJxdWFsaXR5IiwiZW5jb2RlciIsImJhc2U2NCIsImllZWU3NTQiLCJjdXN0b21JbnNwZWN0U3ltYm9sIiwiU3ltYm9sIiwiU2xvd0J1ZmZlciIsIklOU1BFQ1RfTUFYX0JZVEVTIiwiS19NQVhfTEVOR1RIIiwia01heExlbmd0aCIsIlRZUEVEX0FSUkFZX1NVUFBPUlQiLCJ0eXBlZEFycmF5U3VwcG9ydCIsImNvbnNvbGUiLCJlcnJvciIsInByb3RvIiwiZm9vIiwiT2JqZWN0Iiwic2V0UHJvdG90eXBlT2YiLCJlIiwiZGVmaW5lUHJvcGVydHkiLCJlbnVtZXJhYmxlIiwiZ2V0IiwiaXNCdWZmZXIiLCJ1bmRlZmluZWQiLCJieXRlT2Zmc2V0IiwiY3JlYXRlQnVmZmVyIiwiUmFuZ2VFcnJvciIsImJ1ZiIsImFyZyIsImVuY29kaW5nT3JPZmZzZXQiLCJUeXBlRXJyb3IiLCJhbGxvY1Vuc2FmZSIsImZyb20iLCJwb29sU2l6ZSIsInZhbHVlIiwiZnJvbVN0cmluZyIsIkFycmF5QnVmZmVyIiwiaXNWaWV3IiwiZnJvbUFycmF5VmlldyIsImlzSW5zdGFuY2UiLCJmcm9tQXJyYXlCdWZmZXIiLCJTaGFyZWRBcnJheUJ1ZmZlciIsInZhbHVlT2YiLCJmcm9tT2JqZWN0IiwidG9QcmltaXRpdmUiLCJhc3NlcnRTaXplIiwic2l6ZSIsImFsbG9jIiwiZW5jb2RpbmciLCJjaGVja2VkIiwiYWxsb2NVbnNhZmVTbG93Iiwic3RyaW5nIiwiaXNFbmNvZGluZyIsImFjdHVhbCIsInNsaWNlIiwiZnJvbUFycmF5TGlrZSIsImFycmF5IiwiYXJyYXlWaWV3IiwiY29weSIsIm9iaiIsIm51bWJlcklzTmFOIiwidHlwZSIsImlzQXJyYXkiLCJfaXNCdWZmZXIiLCJjb21wYXJlIiwibWluIiwiU3RyaW5nIiwidG9Mb3dlckNhc2UiLCJjb25jYXQiLCJsaXN0Iiwic2V0IiwibXVzdE1hdGNoIiwiYXJndW1lbnRzIiwibG93ZXJlZENhc2UiLCJ1dGY4VG9CeXRlcyIsImJhc2U2NFRvQnl0ZXMiLCJzbG93VG9TdHJpbmciLCJoZXhTbGljZSIsInV0ZjhTbGljZSIsImFzY2lpU2xpY2UiLCJsYXRpbjFTbGljZSIsImJhc2U2NFNsaWNlIiwidXRmMTZsZVNsaWNlIiwic3dhcCIsIm4iLCJtIiwic3dhcDE2Iiwic3dhcDMyIiwic3dhcDY0IiwiYXBwbHkiLCJ0b0xvY2FsZVN0cmluZyIsImVxdWFscyIsImluc3BlY3QiLCJzdHIiLCJtYXgiLCJyZXBsYWNlIiwidHJpbSIsInRhcmdldCIsInRoaXNTdGFydCIsInRoaXNFbmQiLCJ0aGlzQ29weSIsInRhcmdldENvcHkiLCJiaWRpcmVjdGlvbmFsSW5kZXhPZiIsInZhbCIsImRpciIsImFycmF5SW5kZXhPZiIsImxhc3RJbmRleE9mIiwiaW5kZXhTaXplIiwiYXJyTGVuZ3RoIiwidmFsTGVuZ3RoIiwicmVhZCIsInJlYWRVSW50MTZCRSIsImZvdW5kSW5kZXgiLCJmb3VuZCIsImoiLCJpbmNsdWRlcyIsImhleFdyaXRlIiwiTnVtYmVyIiwicmVtYWluaW5nIiwic3RyTGVuIiwicGFyc2VkIiwic3Vic3RyIiwidXRmOFdyaXRlIiwiYmxpdEJ1ZmZlciIsImFzY2lpV3JpdGUiLCJhc2NpaVRvQnl0ZXMiLCJiYXNlNjRXcml0ZSIsInVjczJXcml0ZSIsInV0ZjE2bGVUb0J5dGVzIiwiaXNGaW5pdGUiLCJ0b0pTT04iLCJfYXJyIiwicmVzIiwiZmlyc3RCeXRlIiwiY29kZVBvaW50IiwiYnl0ZXNQZXJTZXF1ZW5jZSIsInNlY29uZEJ5dGUiLCJ0aGlyZEJ5dGUiLCJmb3VydGhCeXRlIiwidGVtcENvZGVQb2ludCIsImRlY29kZUNvZGVQb2ludHNBcnJheSIsIk1BWF9BUkdVTUVOVFNfTEVOR1RIIiwiY29kZVBvaW50cyIsImZyb21DaGFyQ29kZSIsInJldCIsIm91dCIsImhleFNsaWNlTG9va3VwVGFibGUiLCJieXRlcyIsIm5ld0J1ZiIsInN1YmFycmF5IiwiY2hlY2tPZmZzZXQiLCJleHQiLCJyZWFkVWludExFIiwicmVhZFVJbnRMRSIsIm5vQXNzZXJ0IiwibXVsIiwicmVhZFVpbnRCRSIsInJlYWRVSW50QkUiLCJyZWFkVWludDgiLCJyZWFkVWludDE2TEUiLCJyZWFkVWludDE2QkUiLCJyZWFkVWludDMyTEUiLCJyZWFkVWludDMyQkUiLCJyZWFkVUludDMyQkUiLCJyZWFkQmlnVUludDY0TEUiLCJkZWZpbmVCaWdJbnRNZXRob2QiLCJ2YWxpZGF0ZU51bWJlciIsImZpcnN0IiwibGFzdCIsImJvdW5kc0Vycm9yIiwibG8iLCJoaSIsIkJpZ0ludCIsInJlYWRCaWdVSW50NjRCRSIsInJlYWRJbnRMRSIsInBvdyIsInJlYWRJbnRCRSIsInJlYWRJbnQ4IiwicmVhZEludDE2TEUiLCJyZWFkSW50MTZCRSIsInJlYWRJbnQzMkJFIiwicmVhZEJpZ0ludDY0TEUiLCJyZWFkQmlnSW50NjRCRSIsInJlYWRGbG9hdExFIiwicmVhZEZsb2F0QkUiLCJyZWFkRG91YmxlTEUiLCJyZWFkRG91YmxlQkUiLCJjaGVja0ludCIsIndyaXRlVWludExFIiwid3JpdGVVSW50TEUiLCJtYXhCeXRlcyIsIndyaXRlVWludEJFIiwid3JpdGVVSW50QkUiLCJ3cml0ZVVpbnQ4Iiwid3JpdGVVSW50OCIsIndyaXRlVWludDE2TEUiLCJ3cml0ZVVpbnQxNkJFIiwid3JpdGVVSW50MTZCRSIsIndyaXRlVWludDMyTEUiLCJ3cml0ZVVpbnQzMkJFIiwid3JpdGVVSW50MzJCRSIsIndydEJpZ1VJbnQ2NExFIiwiY2hlY2tJbnRCSSIsIndydEJpZ1VJbnQ2NEJFIiwid3JpdGVCaWdVSW50NjRMRSIsIndyaXRlQmlnVUludDY0QkUiLCJ3cml0ZUludExFIiwibGltaXQiLCJzdWIiLCJ3cml0ZUludEJFIiwid3JpdGVJbnQ4Iiwid3JpdGVJbnQxNkxFIiwid3JpdGVJbnQxNkJFIiwid3JpdGVJbnQzMkJFIiwid3JpdGVCaWdJbnQ2NExFIiwid3JpdGVCaWdJbnQ2NEJFIiwiY2hlY2tJRUVFNzU0Iiwid3JpdGVGbG9hdCIsImxpdHRsZUVuZGlhbiIsIndyaXRlRmxvYXRMRSIsIndyaXRlRmxvYXRCRSIsIndyaXRlRG91YmxlIiwid3JpdGVEb3VibGVMRSIsIndyaXRlRG91YmxlQkUiLCJ0YXJnZXRTdGFydCIsImNvcHlXaXRoaW4iLCJlcnJvcnMiLCJFIiwic3ltIiwiZ2V0TWVzc2FnZSIsIkJhc2UiLCJ3cml0YWJsZSIsImNvbmZpZ3VyYWJsZSIsIm5hbWUiLCJzdGFjayIsIm1lc3NhZ2UiLCJyYW5nZSIsImlucHV0IiwibXNnIiwicmVjZWl2ZWQiLCJpc0ludGVnZXIiLCJhYnMiLCJhZGROdW1lcmljYWxTZXBhcmF0b3IiLCJjaGVja0JvdW5kcyIsIkVSUl9PVVRfT0ZfUkFOR0UiLCJFUlJfSU5WQUxJRF9BUkdfVFlQRSIsImZsb29yIiwiRVJSX0JVRkZFUl9PVVRfT0ZfQk9VTkRTIiwiSU5WQUxJRF9CQVNFNjRfUkUiLCJiYXNlNjRjbGVhbiIsInNwbGl0IiwidW5pdHMiLCJJbmZpbml0eSIsImxlYWRTdXJyb2dhdGUiLCJieXRlQXJyYXkiLCJzcmMiLCJkc3QiLCJjb25zdHJ1Y3RvciIsImFscGhhYmV0IiwidGFibGUiLCJpMTYiLCJmbiIsIkJ1ZmZlckJpZ0ludE5vdERlZmluZWQiLCJtdWx0aUJ5dGVJbmRleE9mIiwic3RyaW5nVG9CeXRlcyIsInJlYWRVSW50NjRMRSIsInRhckhlYWRlckNoZWNrc3VtTWF0Y2hlcyIsInVpbnQ4QXJyYXlVdGY4Qnl0ZVN0cmluZyIsInN1cHBvcnRlZCIsInhwaVppcEZpbGVuYW1lIiwib3htbENvbnRlbnRUeXBlcyIsIm94bWxSZWxzIiwiZmlsZVR5cGUiLCJjaGVjayIsImhlYWRlciIsIm9wdGlvbnMiLCJtYXNrIiwiY2hlY2tTdHJpbmciLCJtaW1lIiwic3RhcnRJbmRleCIsImZpcnN0SW1hZ2VEYXRhQ2h1bmtJbmRleCIsImZpbmRJbmRleCIsImVsIiwic2xpY2VkIiwiemlwSGVhZGVyIiwiemlwSGVhZGVySW5kZXgiLCJveG1sRm91bmQiLCJicmFuZE1ham9yIiwic3RhcnRzV2l0aCIsImlkUG9zIiwiZG9jVHlwZVBvcyIsImZpbmREb2NUeXBlIiwiZXZlcnkiLCJvYmplY3RTaXplIiwic3RyZWFtIiwicmVhZGFibGVTdHJlYW0iLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImV2YWwiLCJvbiIsIm9uY2UiLCJwYXNzIiwiUGFzc1Rocm91Z2giLCJjaHVuayIsIm1pbmltdW1CeXRlcyIsInVuc2hpZnQiLCJwaXBlbGluZSIsInBpcGUiLCJTZXQiLCJleHRlbnNpb25zIiwibWltZVR5cGVzIiwibWFwIiwiY2hhcmFjdGVyIiwiTUFTS184VEhfQklUIiwic3VtIiwic2lnbmVkQml0U3VtIiwiYnl0ZSIsInJlYWRTdW0iLCJieXRlc1RvU2VhcmNoIiwic3RhcnRBdCIsIm5leHRCeXRlc01hdGNoIiwiaW5kZXgiLCJpc0xFIiwibUxlbiIsIm5CeXRlcyIsImVMZW4iLCJlTWF4IiwiZUJpYXMiLCJuQml0cyIsImQiLCJzIiwiTmFOIiwicnQiLCJpc05hTiIsImxvZyIsIkxOMiIsImlzRWxlY3Ryb24iLCJ3aW5kb3ciLCJwcm9jZXNzIiwidmVyc2lvbnMiLCJlbGVjdHJvbiIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImlzVXJsIiwicHJvdG9jb2xBbmREb21haW5SRSIsImxvY2FsaG9zdERvbWFpblJFIiwibm9uTG9jYWxob3N0RG9tYWluUkUiLCJtYXRjaCIsImV2ZXJ5dGhpbmdBZnRlclByb3RvY29sIiwidGVzdCIsInJ1bnRpbWUiLCJPcCIsImhhc093biIsImhhc093blByb3BlcnR5IiwiJFN5bWJvbCIsIml0ZXJhdG9yU3ltYm9sIiwiaXRlcmF0b3IiLCJhc3luY0l0ZXJhdG9yU3ltYm9sIiwiYXN5bmNJdGVyYXRvciIsInRvU3RyaW5nVGFnU3ltYm9sIiwidG9TdHJpbmdUYWciLCJkZWZpbmUiLCJrZXkiLCJlcnIiLCJ3cmFwIiwiaW5uZXJGbiIsIm91dGVyRm4iLCJzZWxmIiwidHJ5TG9jc0xpc3QiLCJwcm90b0dlbmVyYXRvciIsIkdlbmVyYXRvciIsImdlbmVyYXRvciIsImNyZWF0ZSIsImNvbnRleHQiLCJDb250ZXh0IiwiX2ludm9rZSIsIm1ha2VJbnZva2VNZXRob2QiLCJ0cnlDYXRjaCIsIkdlblN0YXRlU3VzcGVuZGVkU3RhcnQiLCJHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkIiwiR2VuU3RhdGVFeGVjdXRpbmciLCJHZW5TdGF0ZUNvbXBsZXRlZCIsIkNvbnRpbnVlU2VudGluZWwiLCJHZW5lcmF0b3JGdW5jdGlvbiIsIkdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlIiwiSXRlcmF0b3JQcm90b3R5cGUiLCJnZXRQcm90byIsImdldFByb3RvdHlwZU9mIiwiTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUiLCJ2YWx1ZXMiLCJHcCIsImRpc3BsYXlOYW1lIiwiZGVmaW5lSXRlcmF0b3JNZXRob2RzIiwiZm9yRWFjaCIsIm1ldGhvZCIsImlzR2VuZXJhdG9yRnVuY3Rpb24iLCJnZW5GdW4iLCJjdG9yIiwibWFyayIsIl9fcHJvdG9fXyIsImF3cmFwIiwiX19hd2FpdCIsIkFzeW5jSXRlcmF0b3IiLCJQcm9taXNlSW1wbCIsImludm9rZSIsInJlY29yZCIsInJlc3VsdCIsInRoZW4iLCJ1bndyYXBwZWQiLCJwcmV2aW91c1Byb21pc2UiLCJlbnF1ZXVlIiwiY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmciLCJhc3luYyIsIml0ZXIiLCJuZXh0IiwiZG9uZSIsInN0YXRlIiwiZG9uZVJlc3VsdCIsImRlbGVnYXRlIiwiZGVsZWdhdGVSZXN1bHQiLCJtYXliZUludm9rZURlbGVnYXRlIiwic2VudCIsIl9zZW50IiwiZGlzcGF0Y2hFeGNlcHRpb24iLCJhYnJ1cHQiLCJpbmZvIiwicmVzdWx0TmFtZSIsIm5leHRMb2MiLCJwdXNoVHJ5RW50cnkiLCJsb2NzIiwiZW50cnkiLCJ0cnlMb2MiLCJjYXRjaExvYyIsImZpbmFsbHlMb2MiLCJhZnRlckxvYyIsInRyeUVudHJpZXMiLCJyZXNldFRyeUVudHJ5IiwiY29tcGxldGlvbiIsInJlc2V0Iiwia2V5cyIsIm9iamVjdCIsInJldmVyc2UiLCJwb3AiLCJpdGVyYWJsZSIsIml0ZXJhdG9yTWV0aG9kIiwic2tpcFRlbXBSZXNldCIsInByZXYiLCJjaGFyQXQiLCJzdG9wIiwicm9vdEVudHJ5Iiwicm9vdFJlY29yZCIsInJ2YWwiLCJleGNlcHRpb24iLCJoYW5kbGUiLCJsb2MiLCJjYXVnaHQiLCJoYXNDYXRjaCIsImhhc0ZpbmFsbHkiLCJmaW5hbGx5RW50cnkiLCJjb21wbGV0ZSIsImZpbmlzaCIsInRocm93biIsImRlbGVnYXRlWWllbGQiLCJyZWdlbmVyYXRvclJ1bnRpbWUiLCJhY2NpZGVudGFsU3RyaWN0TW9kZSIsImdsb2JhbFRoaXMiLCJGdW5jdGlvbiIsImJpZ0ludCIsIldlYkFzc2VtYmx5IiwiaW5zdGFudGlhdGUiLCJpbnN0YW5jZSIsImJ1bGtNZW1vcnkiLCJ2YWxpZGF0ZSIsImV4Y2VwdGlvbnMiLCJtdWx0aVZhbHVlIiwibXV0YWJsZUdsb2JhbHMiLCJyZWZlcmVuY2VUeXBlcyIsInNhdHVyYXRlZEZsb2F0VG9JbnQiLCJzaWduRXh0ZW5zaW9ucyIsInNpbWQiLCJ0YWlsQ2FsbCIsInRocmVhZHMiLCJNZXNzYWdlQ2hhbm5lbCIsInBvcnQxIiwicG9zdE1lc3NhZ2UiLCJxIiwidCIsInYiLCJVaW50MTZBcnJheSIsIlVpbnQzMkFycmF5IiwiRGF0YVZpZXciLCJHIiwiZiIsImciLCJrIiwiSSIsImFhIiwiTCIsIlIiLCJiYSIsImNhIiwiaGEiLCJTIiwiaWEiLCJqYSIsImthIiwiZ2V0UGFyZW50IiwiVCIsIlBPU0lUSVZFX0lORklOSVRZIiwiaCIsInIiLCJsIiwibmEiLCJvYSIsIkYiLCJsYXp5IiwiY29tcHJlc3Npb25UeXBlIiwib3V0cHV0QnVmZmVyIiwib3V0cHV0SW5kZXgiLCJwYSIsIk5PTkUiLCJYIiwicWEiLCJVIiwidSIsInJhIiwidyIsIkMiLCJEIiwiTSIsInoiLCJOIiwiWSIsInFiIiwiZGEiLCJGYSIsImVhIiwiR2EiLCJsYSIsInRhIiwiSGEiLCJaIiwibWEiLCJJYSIsInNhIiwidWEiLCJKYSIsIkthIiwiSyIsIk8iLCJBIiwiZmEiLCJKIiwiSCIsIlAiLCJMYSIsIk1hIiwiUSIsIk5hIiwiZ2EiLCJ3YSIsIk9hIiwiUGEiLCJRYSIsIlJhIiwidmEiLCJ4YSIsInlhIiwic2hpZnQiLCJ6YSIsIkFhIiwiQmEiLCJmbGFncyIsImZpbGVuYW1lIiwiY29tbWVudCIsImRlZmxhdGVPcHRpb25zIiwiZm5hbWUiLCJDYSIsImZjb21tZW50IiwiRGEiLCJmaGNyYyIsIkVhIiwiRGF0ZSIsIm5vdyIsIlNhIiwiViIsIm8iLCJUYSIsImJ1ZmZlclNpemUiLCJidWZmZXJUeXBlIiwicmVzaXplIiwiVWEiLCJXIiwiVmEiLCJXYSIsIlhhIiwiWWEiLCJaYSIsIiRhIiwiYWIiLCJiYiIsImNiIiwiZGIiLCJlYiIsImZiIiwiZ2IiLCJoYiIsIiQiLCJpYiIsImpiIiwia2IiLCJsYiIsIm1iIiwibmIiLCJvYiIsInZlcmlmeSIsInBiIiwicmIiLCJzYiIsIkxPRzJFIiwiZGVmbGF0ZSIsInRiIiwiZGVmbGF0ZVN5bmMiLCJ1YiIsImluZmxhdGUiLCJ2YiIsImluZmxhdGVTeW5jIiwid2IiLCJnemlwIiwieGIiLCJnemlwU3luYyIsInliIiwiZ3VuemlwIiwiemIiLCJndW56aXBTeW5jIiwiQWIiLCJuZXh0VGljayIsIkJiIiwibm9CdWZmZXIiLCJPU0RfT05MWSIsIkFVVE9fT1NEIiwiQVVUT19PTkxZIiwiQVVUTyIsIlNJTkdMRV9DT0xVTU4iLCJTSU5HTEVfQkxPQ0tfVkVSVF9URVhUIiwiU0lOR0xFX0JMT0NLIiwiU0lOR0xFX0xJTkUiLCJTSU5HTEVfV09SRCIsIkNJUkNMRV9XT1JEIiwiU0lOR0xFX0NIQVIiLCJTUEFSU0VfVEVYVCIsIlNQQVJTRV9URVhUX09TRCIsImVudiIsIldvcmtlckdsb2JhbFNjb3BlIiwibG9nZ2luZyIsInNldExvZ2dpbmciLCJfbG9nZ2luZyIsImFyZ3MiLCJkZWwiLCJyZWFkQ2FjaGUiLCJ3cml0ZUNhY2hlIiwiZGVsZXRlQ2FjaGUiLCJjaGVja0NhY2hlIiwicGF0aCIsImRlcGVuZGVuY2llcyIsImNvcmVQYXRoIiwiZ2xvYmFsIiwiVGVzc2VyYWN0Q29yZSIsInByb2dyZXNzIiwic3RhdHVzIiwiY29yZVBhdGhJbXBvcnQiLCJzaW1kU3VwcG9ydCIsInN1YnN0cmluZyIsImltcG9ydFNjcmlwdHMiLCJUZXNzZXJhY3RDb3JlV0FTTSIsIlBTTSIsInRlc3NlZGl0X3BhZ2VzZWdfbW9kZSIsInRlc3NlZGl0X2NoYXJfd2hpdGVsaXN0IiwidGVzc2pzX2NyZWF0ZV9ob2NyIiwidGVzc2pzX2NyZWF0ZV90c3YiLCJ0ZXNzanNfY3JlYXRlX2JveCIsInRlc3Nqc19jcmVhdGVfdW5sdiIsInRlc3Nqc19jcmVhdGVfb3NkIiwiaXNVUkwiLCJkdW1wIiwiaXNXZWJXb3JrZXIiLCJzZXRJbWFnZSIsImRlZmF1bHRQYXJhbXMiLCJUZXNzTW9kdWxlIiwiYXBpIiwibGF0ZXN0Sm9iIiwiYWRhcHRlciIsInBhcmFtcyIsImxvYWQiLCJ3b3JrZXJJZCIsImpvYklkIiwicGF5bG9hZCIsImdldENvcmUiLCJDb3JlIiwiVGVzc2VyYWN0UHJvZ3Jlc3MiLCJwZXJjZW50IiwidGVzc01vZHVsZSIsImxvYWRlZCIsIkZTIiwibG9hZExhbmd1YWdlIiwibGFuZ3MiLCJsYW5nUGF0aCIsImRhdGFQYXRoIiwiY2FjaGVQYXRoIiwiY2FjaGVNZXRob2QiLCJsb2FkQW5kR3VuemlwRmlsZSIsIl9sYW5nIiwibGFuZyIsIl9kYXRhIiwiZmV0Y2hVcmwiLCJmZXRjaCIsInJlc3AiLCJvayIsImFycmF5QnVmZmVyIiwibWtkaXIiLCJ3cml0ZUZpbGUiLCJhbGwiLCJET01FeGNlcHRpb24iLCJzZXRQYXJhbWV0ZXJzIiwiX3BhcmFtcyIsImZpbHRlciIsIlNldFZhcmlhYmxlIiwiaW5pdGlhbGl6ZSIsIl9sYW5ncyIsIm9lbSIsIkVuZCIsIlRlc3NCYXNlQVBJIiwiSW5pdCIsInJlY29nbml6ZSIsImltYWdlIiwicmVjIiwicmVjdGFuZ2xlIiwicHRyIiwiU2V0UmVjdGFuZ2xlIiwibGVmdCIsInRvcCIsIlJlY29nbml6ZSIsIl9mcmVlIiwiZ2V0UERGIiwidGl0bGUiLCJ0ZXh0b25seSIsInBkZlJlbmRlcmVyIiwiVGVzc1BERlJlbmRlcmVyIiwiQmVnaW5Eb2N1bWVudCIsIkFkZEltYWdlIiwiRW5kRG9jdW1lbnQiLCJyZWFkRmlsZSIsImRldGVjdCIsInJlc3VsdHMiLCJPU1Jlc3VsdHMiLCJEZXRlY3RPUyIsImJlc3QiLCJiZXN0X3Jlc3VsdCIsIm9pZCIsIm9yaWVudGF0aW9uX2lkIiwic2lkIiwic2NyaXB0X2lkIiwidGVzc2VyYWN0X3NjcmlwdF9pZCIsInNjcmlwdCIsInVuaWNoYXJzZXQiLCJnZXRfc2NyaXB0X2Zyb21fc2NyaXB0X2lkIiwic2NyaXB0X2NvbmZpZGVuY2UiLCJzY29uZmlkZW5jZSIsIm9yaWVudGF0aW9uX2RlZ3JlZXMiLCJvcmllbnRhdGlvbl9jb25maWRlbmNlIiwib2NvbmZpZGVuY2UiLCJ0ZXJtaW5hdGUiLCJfIiwidGVybWluYXRlZCIsImRpc3BhdGNoSGFuZGxlcnMiLCJwYWNrZXQiLCJzZW5kIiwiYmluZCIsImFjdGlvbiIsInNldEFkYXB0ZXIiLCJfYWRhcHRlciIsImRlaW5kZW50IiwiaHRtbCIsInJpIiwiR2V0SXRlcmF0b3IiLCJSSUxfQkxPQ0siLCJSSUxfUEFSQSIsIlJJTF9URVhUTElORSIsIlJJTF9XT1JEIiwiUklMX1NZTUJPTCIsImJsb2NrcyIsImJsb2NrIiwicGFyYSIsInRleHRsaW5lIiwid29yZCIsInN5bWJvbCIsImVudW1Ub1N0cmluZyIsInByZWZpeCIsIkJlZ2luIiwiSXNBdEJlZ2lubmluZ09mIiwicG9seSIsIkJsb2NrUG9seWdvbiIsInBvbHlnb24iLCJnZXRQb2ludGVyIiwiZ2V0X24iLCJweCIsImdldF94IiwicHkiLCJnZXRfeSIsImdldFZhbHVlIiwicGFyYWdyYXBocyIsInRleHQiLCJHZXRVVEY4VGV4dCIsImNvbmZpZGVuY2UiLCJDb25maWRlbmNlIiwiYmFzZWxpbmUiLCJnZXRCYXNlbGluZSIsImJib3giLCJnZXRCb3VuZGluZ0JveCIsImJsb2NrdHlwZSIsIkJsb2NrVHlwZSIsImlzX2x0ciIsIlBhcmFncmFwaElzTHRyIiwid29yZHMiLCJmb250SW5mbyIsImdldFdvcmRGb250QXR0cmlidXRlcyIsIndvcmREaXIiLCJXb3JkRGlyZWN0aW9uIiwic3ltYm9scyIsImNob2ljZXMiLCJpc19udW1lcmljIiwiV29yZElzTnVtZXJpYyIsImluX2RpY3Rpb25hcnkiLCJXb3JkSXNGcm9tRGljdGlvbmFyeSIsImRpcmVjdGlvbiIsImxhbmd1YWdlIiwiV29yZFJlY29nbml0aW9uTGFuZ3VhZ2UiLCJpc19ib2xkIiwiaXNfaXRhbGljIiwiaXNfdW5kZXJsaW5lZCIsImlzX21vbm9zcGFjZSIsImlzX3NlcmlmIiwiaXNfc21hbGxjYXBzIiwiZm9udF9zaXplIiwicG9pbnRzaXplIiwiZm9udF9pZCIsImZvbnRfbmFtZSIsIndjIiwiV29yZENob2ljZUl0ZXJhdG9yIiwiTmV4dCIsImRlc3Ryb3kiLCJpc19zdXBlcnNjcmlwdCIsIlN5bWJvbElzU3VwZXJzY3JpcHQiLCJpc19zdWJzY3JpcHQiLCJTeW1ib2xJc1N1YnNjcmlwdCIsImlzX2Ryb3BjYXAiLCJTeW1ib2xJc0Ryb3BjYXAiLCJjaSIsIkNob2ljZUl0ZXJhdG9yIiwiaG9jciIsIkdldEhPQ1JUZXh0IiwidHN2IiwiR2V0VFNWVGV4dCIsImJveCIsIkdldEJveFRleHQiLCJ1bmx2IiwiR2V0VU5MVlRleHQiLCJvc2QiLCJHZXRPc2RUZXh0IiwiTWVhblRleHRDb25mIiwicHNtIiwiR2V0UGFnZVNlZ01vZGUiLCJ2ZXJzaW9uIiwiVmVyc2lvbiIsImJtcCIsImJ5dGVzUGVyUGl4ZWwiLCJwaXgiLCJleGlmIiwiYm1wQnVmIiwiX21hbGxvYyIsIkJZVEVTX1BFUl9FTEVNRU5UIiwiSEVBUFU4IiwiX3BpeFJlYWRNZW0iLCJzZXRWYWx1ZSIsImlkeCIsIlNldEltYWdlIiwiU3RvcmUiLCJkYk5hbWUiLCJzdG9yZU5hbWUiLCJfZGJwIiwib3BlbnJlcSIsImluZGV4ZWREQiIsIm9wZW4iLCJvbmVycm9yIiwib25zdWNjZXNzIiwib251cGdyYWRlbmVlZGVkIiwiY3JlYXRlT2JqZWN0U3RvcmUiLCJjYWxsYmFjayIsInRyYW5zYWN0aW9uIiwib25jb21wbGV0ZSIsIm9uYWJvcnQiLCJvYmplY3RTdG9yZSIsInN0b3JlIiwiZ2V0RGVmYXVsdFN0b3JlIiwicmVxIiwiX3dpdGhJREJTdG9yZSIsInB1dCIsImRlbGV0ZSIsImNsZWFyIiwib3BlbktleUN1cnNvciIsIm9wZW5DdXJzb3IiLCJjb250aW51ZSIsIndvcmtlciIsImNhY2hlIiwiYWRkRXZlbnRMaXN0ZW5lciJdLCJzb3VyY2VSb290IjoiIn0=