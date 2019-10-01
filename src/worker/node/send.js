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
const loadImage = (image) => {
  if (isURL(image)) {
    return axios.get(image, {
      responseType: 'arraybuffer',
    })
      .then(resp => resp.data);
  }

  if (/data:image\/([a-zA-Z]*);base64,([^"]*)/.test(image)) {
    return Promise.resolve(Buffer.from(image.split(',')[1], 'base64'));
  }

  if (Buffer.isBuffer(image)) {
    return Promise.resolve(image);
  }

  return readFile(image);
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
module.exports = (worker, packet) => {
  const p = { ...packet };
  if (['recognize', 'detect'].includes(p.action)) {
    loadImage(p.payload.image)
      .then(buf => new Uint8Array(buf))
      .then((img) => {
        p.payload.image = Array.from(img);
        worker.send(p);
      });
  } else {
    worker.send(p);
  }
};
