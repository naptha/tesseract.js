const check = require('check-types');
const resolveURL = require('resolve-url');
const { version } = require('../../package.json');

const defaultOptions = {
  corePath: `https://cdn.jsdelivr.net/gh/naptha/tesseract.js-core@v2.0.0-beta.5/tesseract-core${typeof WebAssembly === 'object' ? '' : '.asm'}.js`,
  langPath: 'https://tessdata.projectnaptha.com/4.0.0',
};

if (process.env.NODE_ENV === 'development') {
  console.debug('Using Development Configuration');
  defaultOptions.workerPath = resolveURL(`/dist/worker.dev.js?nocache=${Math.random().toString(36).slice(3)}`);
} else {
  defaultOptions.workerPath = `https://cdn.jsdelivr.net/gh/naptha/tesseract.js@${version}/dist/worker.min.js`;
}

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

exports.defaultOptions = defaultOptions;

exports.spawnWorker = (instance, workerOptions) => {
  let worker;
  if (window.Blob && window.URL) {
    const blob = new Blob([`importScripts("${workerOptions.workerPath}");`]);
    worker = new Worker(window.URL.createObjectURL(blob));
  } else {
    worker = new Worker(workerOptions.workerPath);
  }

  worker.onmessage = ({ data }) => {
    instance._recv(data);
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
