const check = require('check-types');
const resolveURL = require('resolve-url');
const { defaultOptions } = require('../common/options');
const { version } = require('../../package.json');

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

exports.defaultOptions = {
  ...defaultOptions,
  workerPath: process.env.NODE_ENV === 'development'
    ? resolveURL(`/dist/worker.dev.js?nocache=${Math.random().toString(36).slice(3)}`)
    : `https://cdn.jsdelivr.net/gh/naptha/tesseract.js@v${version}/dist/worker.min.js`,
  corePath: `https://cdn.jsdelivr.net/gh/naptha/tesseract.js-core@v2.0.0-beta.5/tesseract-core${typeof WebAssembly === 'object' ? '' : '.asm'}.js`,
};

exports.spawnWorker = (instance, workerOptions) => {
  let worker;
  if (window.Blob && window.URL) {
    const blob = new Blob([`importScripts("${workerOptions.workerPath}");`]);
    worker = new Worker(window.URL.createObjectURL(blob));
  } else {
    worker = new Worker(workerOptions.workerPath);
  }

  worker.onmessage = ({ data }) => {
    instance.recv(data);
  };

  return worker;
};

exports.terminateWorker = (instance) => {
  instance.worker.terminate();
};

exports.sendPacket = (instance, packet) => {
  loadImage(packet.payload.image)
    .then(buf => new Uint8Array(buf))
    .then((img) => {
      instance.worker.postMessage({
        ...packet,
        payload: {
          ...packet.payload,
          image: Array.from(img),
        },
      });
    });
};
