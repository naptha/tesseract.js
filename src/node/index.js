const util = require('util');
const fs = require('fs');
const fetch = require('isomorphic-fetch');
const isURL = require('is-url');
const { fork } = require('child_process');
const path = require('path');

const readFile = util.promisify(fs.readFile);

const loadImage = (imageURI) => {
  if (isURL(imageURI)) {
    return fetch(imageURI)
      .then(resp => resp.buffer());
  }
  return readFile(imageURI);
};

exports.defaultOptions = {
  workerPath: path.join(__dirname, 'worker.js'),
  langPath: 'https://cdn.jsdelivr.net/gh/naptha/tessdata@gh-pages/4.0.0/',
};

exports.spawnWorker = (instance, { workerPath }) => {
  const cp = fork(workerPath);
  cp.on('message', (packet) => {
    instance._recv(packet);
  });
  return cp;
};

exports.terminateWorker = (instance) => {
  instance.worker.kill();
};

exports.sendPacket = (instance, packet) => {
  loadImage(packet.payload.image)
    .then(buf => new Uint8Array(buf))
    .then((img) => {
      instance.worker.send({
        ...packet,
        payload: {
          ...packet.payload,
          image: Array.from(img),
        },
      });
    });
};
