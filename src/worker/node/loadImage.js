'use strict';

const util = require('util');
const fs = require('fs');
// Use built-in fetch if available, otherwise fallback to node-fetch
const fetch = global.fetch || require('node-fetch');
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
    if (isURL(image) || image.startsWith('moz-extension://') || image.startsWith('chrome-extension://') || image.startsWith('file://')) {
      const resp = await fetch(image);
      data = await resp.arrayBuffer();
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
