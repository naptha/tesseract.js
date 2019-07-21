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
const axios = require('axios');
const b64toU8Array = require('./b64toU8Array');
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
 *   string: base64 image
 *   img HTMLElement: extract image source from src attribute
 *   video HTMLElement: extract image source from poster attribute
 *   canvas HTMLElement: extract image data by converting to Blob
 *   File instance: data from <input type="file" />
 * @returns {array} binary image in array format
 */
const loadImage = (image) => {
  if (check.string(image)) {
    // Base64 Image
    if (/data:image\/([a-zA-Z]*);base64,([^"]*)/.test(image)) {
      return Promise.resolve(b64toU8Array(image.split(',')[1]));
    }
    // Image URL
    return axios.get(resolveURL(image), {
      responseType: 'arraybuffer',
    })
      .then(resp => resp.data);
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
  if (check.instance(image, File) || check.instance(image, Blob)) {
    return new Promise((res) => {
      readFromBlobOrFile(image, res);
    });
  }
  return Promise.reject();
};

const downloadFile = (path, blob) => {
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, path);
  } else {
    const link = document.createElement('a');
    // Browsers that support HTML5 download attribute
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', path);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};

/*
 * Default options for browser worker
 */
exports.defaultOptions = {
  ...defaultOptions,
  workerPath: (typeof process !== 'undefined' && process.env.TESS_ENV === 'development')
    ? resolveURL(`/dist/worker.dev.js?nocache=${Math.random().toString(36).slice(3)}`)
    : `https://unpkg.com/tesseract.js@v${version}/dist/worker.min.js`,
  /*
   * If browser doesn't support WebAssembly,
   * load ASM version instead
   */
  corePath: `https://unpkg.com/tesseract.js-core@v2.0.0-beta.10/tesseract-core.${typeof WebAssembly === 'object' ? 'wasm' : 'asm'}.js`,
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
    if (data.jobId.startsWith('Job')) {
      instance.recv(data);
    } else if (data.jobId.startsWith('Download')) {
      const { path, data: d, type } = data;
      const blob = new Blob([d], { type });
      downloadFile(path, blob);
    }
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
