/**
 *
 * Tesseract Worker adapter for browser
 *
 * @fileoverview Tesseract Worker adapter for browser
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
const check = require('check-types');
const resolveURL = require('resolve-url');
const { defaultOptions } = require('../common/options');
const { version } = require('../../package.json');

/**
 * loadImage
 *
 * @name loadImage
 * @function load image from different source
 * @access public
 * @param {string, object} image - image source, supported formats:
 *   string: URL string, can be relative path
 *   File instance: data from <input type="file" />
 * @returns {array} binary image in array format
 */
const loadImage = (image) => {
  if (check.string(image)) {
    return fetch(resolveURL(image))
      .then(resp => resp.arrayBuffer());
  }
  if (check.instance(image, File)) {
    return new Promise((res) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        res(fileReader.result);
      };
      fileReader.readAsArrayBuffer(image);
    });
  }
  return Promise.reject();
};

/*
 * Default options for browser worker
 */
exports.defaultOptions = {
  ...defaultOptions,
  workerPath: process.env.TESS_ENV === 'development'
    ? resolveURL(`/dist/worker.dev.js?nocache=${Math.random().toString(36).slice(3)}`)
    : `https://cdn.jsdelivr.net/gh/naptha/tesseract.js@v${version}/dist/worker.min.js`,
  /*
   * If browser doesn't support WebAssembly,
   * load ASM version instead
   */
  corePath: `https://cdn.jsdelivr.net/gh/naptha/tesseract.js-core@v2.0.0-beta.5/tesseract-core${typeof WebAssembly === 'object' ? '' : '.asm'}.js`,
};

/**
 * spawnWorker
 *
 * @name spawnWorker
 * @function create a new Worker in browser
 * @access public
 * @param {object} instance - TesseractWorker instance
 * @param {object} options
 * @param {string} options.workerPath - worker script path
 */
exports.spawnWorker = (instance, { workerPath }) => {
  let worker;
  if (window.Blob && window.URL) {
    const blob = new Blob([`importScripts("${workerPath}");`]);
    worker = new Worker(window.URL.createObjectURL(blob));
  } else {
    worker = new Worker(workerPath);
  }

  worker.onmessage = ({ data }) => {
    instance.recv(data);
  };

  return worker;
};

/**
 * terminateWorker
 *
 * @name terminateWorker
 * @function terminate worker
 * @access public
 * @param {object} instance TesseractWorker instance
 */
exports.terminateWorker = (instance) => {
  instance.worker.terminate();
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
      instance.worker.postMessage(packet);
    });
};
