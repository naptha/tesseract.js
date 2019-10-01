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
 * @param {string} image - image source, supported formats:
 *   string: URL string or file path
 *   string: base64 image
 *   buffer: image buffer
 * @returns {array} binary image in array format
 */
const loadImage = async (image) => {
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


/**
 * send
 *
 * @name send
 * @function send packet to worker and create a job
 * @access public
 * @param {object} instance TesseractWorker instance
 * @param {object} iPacket data for worker
 */
module.exports = async (worker, _packet) => {
  const packet = { ..._packet };
  packet.payload.image = await loadImage(packet.payload.image);
  worker.send(packet);
};
