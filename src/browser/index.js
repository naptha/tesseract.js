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
 * readFromBlobOrFile
 *
 * @name readFromBlobOrFile
 * @function
 * @access private
 * @param {object} blob A blob or file objec to read
 * @param {function} res callback function after reading completes
 */
const readFromBlobOrFile = (blob, res) => {
  const fileReader = new FileReader();
  fileReader.onload = () => {
    res(fileReader.result);
  };
  fileReader.readAsArrayBuffer(blob);
};

/**
 * loadImage
 *
 * @name loadImage
 * @function load image from different source
 * @access private
 * @param {string, object} image - image source, supported formats:
 *   string: URL string, can be relative path
 *   img HTMLElement: extract image source from src attribute
 *   video HTMLElement: extract image source from poster attribute
 *   canvas HTMLElement: extract image data by converting to Blob 
 *   File instance: data from <input type="file" />
 * @returns {array} binary image in array format
 */
const loadImage = (image) => {
  if (check.string(image)) {
    return fetch(resolveURL(image))
      .then(resp => resp.arrayBuffer());
  }
  if (check.instance(image, HTMLElement)) {
    if (image.tagName === 'IMG') {
      return loadImage(image.src);
    }
    if (image.tagName === 'VIDEO') {
      return loadImage(image.poster);
    }
    if (image.tagName === 'CANVAS') {
      return new Promise((res) => {
        image.toBlob((blob) => {
          readFromBlobOrFile(blob, res);
        });
      });
    }
  }
  if (check.instance(image, File)) {
    return new Promise((res) => {
      readFromBlobOrFile(image, res);
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
    : `https://unpkg.com/tesseract.js@v${version}/dist/worker.min.js`,
  /*
   * If browser doesn't support WebAssembly,
   * load ASM version instead
   */
  corePath: `https://unpkg.com/tesseract.js-core@v2.0.0-beta.5/tesseract-core${typeof WebAssembly === 'object' ? '' : '.asm'}.js`,
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
  if (Blob && URL) {
    const blob = new Blob([`importScripts("${workerPath}");`], {
      type: 'application/javascript',
    });
    worker = new Worker(URL.createObjectURL(blob));
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
