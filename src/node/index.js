const util = require('util');
const fs = require('fs');
const fetch = require('node-fetch');
const isURL = require('is-url');
const { fork } = require('child_process');
const path = require('path');
const { defaultOptions } = require('../common/options');

const readFile = util.promisify(fs.readFile);

const loadImage = (image) => {
  if (isURL(image)) {
    return fetch(image)
      .then(resp => resp.arrayBuffer());
  }
  return readFile(image);
};

exports.defaultOptions = {
  ...defaultOptions,
  workerPath: path.join(__dirname, 'worker.js'),
};

exports.spawnWorker = (instance, { workerPath }) => {
  const cp = fork(workerPath);
  cp.on('message', (packet) => {
    instance.recv(packet);
  });
  return cp;
};

exports.terminateWorker = (instance) => {
  instance.worker.kill();
};

exports.sendPacket = (instance, iPacket) => {
  const packet = { ...iPacket };
  loadImage(packet.payload.image)
    .then(buf => new Uint8Array(buf))
    .then((img) => {
      packet.payload.image = Array.from(img);
      instance.worker.send(packet);
    });
};
