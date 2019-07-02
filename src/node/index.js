/**
 *
 * Tesseract Worker adapter for node
 *
 * @fileoverview Tesseract Worker adapter for node
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
const util = require('util');
const fs = require('fs');
const axios = require('axios');
const isURL = require('is-url');
const { fork } = require('child_process');
const path = require('path');
const b64toU8Array = require('./b64toU8Array');
const { defaultOptions } = require('../common/options');

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
    return Promise.resolve(b64toU8Array(image.split(',')[1]));
  }

  if (Buffer.isBuffer(image)) {
    return Promise.resolve(image);
  }

  return readFile(image);
};

/*
 * Default options for node worker
 */
exports.defaultOptions = {
  ...defaultOptions,
  workerPath: path.join(__dirname, 'worker.js'),
};

/**
 * spawnWorker
 *
 * @name spawnWorker
 * @function fork a new process in node
 * @access public
 * @param {object} instance - TesseractWorker instance
 * @param {object} options
 * @param {string} options.workerPath - worker script path
 */
exports.spawnWorker = (instance, { workerPath }) => {
  const cp = fork(workerPath);
  cp.on('message', (packet) => {
    instance.recv(packet);
  });
  return cp;
};

/**
 * terminateWorker
 *
 * @name terminateWorker
 * @function kill worker
 * @access public
 * @param {object} instance TesseractWorker instance
 */
exports.terminateWorker = (instance) => {
  instance.worker.kill();
};

/**
 * sendPacket
 *
 * @name sendPacket
 * @function send packet to worker and create a job
 * @access public
 * @param {object} instance TesseractWorker instance
 * @param {object} iPacket data for worker
 */
exports.sendPacket = (instance, iPacket) => {
  const packet = { ...iPacket };
  loadImage(packet.payload.image)
    .then(buf => new Uint8Array(buf))
    .then((img) => {
      packet.payload.image = Array.from(img);
      instance.worker.send(packet);
    });
};
