const util = require('util');
const fs = require('fs');
const axios = require('axios');
const isURL = require('is-url');

const readFile = util.promisify(fs.readFile);

/**
 * loadImage
 *
 * @name loadImage
 * @function load image from different source
 * @access public
 */
module.exports = async (image) => {
  let data = image;
  if (typeof image === 'undefined') {
    return image;
  }

  if (typeof image === 'string') {
    if (isURL(image) || image.startsWith('chrome-extension://') || image.startsWith('file://')) {
      const { data: _data } = await axios.get(image, { responseType: 'arraybuffer' });
      data = _data;
    } else if (/data:image\/([a-zA-Z]*);base64,([^"]*)/.test(image)) {
      data = Buffer.from(image.split(',')[1], 'base64');
    } else {
      data = await readFile(image);
    }
  } else if (Buffer.isBuffer(image)) {
    data = image;
  }

  return new Uint8Array(data);
};
