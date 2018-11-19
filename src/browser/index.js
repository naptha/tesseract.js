const isURL = require('is-url');

const defaultOptions = {
  // workerPath: 'https://cdn.jsdelivr.net/gh/naptha/tesseract.js@0.2.0/dist/worker.js',
  corePath: `https://cdn.jsdelivr.net/gh/naptha/tesseract.js-core@v2.0.0-beta.5/tesseract-core${typeof WebAssembly === 'object' ? '' : '.asm'}.js`,
  langPath: 'https://cdn.jsdelivr.net/gh/naptha/tessdata@gh-pages/4.0.0/',
};

if (process.env.NODE_ENV === 'development') {
  console.debug('Using Development Configuration');
  // eslint-disable-next-line
  const { protocol, host } = location;
  defaultOptions.workerPath = `${protocol}//${host}/dist/worker.dev.js?nocache=${Math.random().toString(36).slice(3)}`;
} else {
  const { version } = require('../../package.json');
  defaultOptions.workerPath = `https://cdn.jsdelivr.net/gh/naptha/tesseract.js@${version}/dist/worker.js`;
}

const loadImage = (imageURI) => {
  if (isURL(imageURI)) {
    return fetch(imageURI)
      .then(resp => resp.arrayBuffer());
  }
  return new Promise();
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
