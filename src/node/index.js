const check = require('check-types');
const fetch = require('isomorphic-fetch');
const isURL = require('is-url');
const { fork } = require('child_process');
const fs = require('fs');
const path = require('path');
const fileType = require('file-type');
const PNGReader = require('png.js');
const JPGReader = require('jpeg-js');

function loadImage(image, cb) {
  if (check.string(image)) {
    if (isURL(image)) {
      fetch(image)
        .then(resp => resp.buffer())
        .then(buffer => loadImage(buffer, cb))
        .catch(err => console.error(err));
    } else {
      fs.readFile(image, (err, buffer) => {
        if (err) throw err;
        loadImage(buffer, cb);
      });
    }
    return;
  }
  if (image instanceof Buffer) {
    const { mime } = fileType(image);

    if (mime === 'image/png') {
      const reader = new PNGReader(image);
      reader.parse((err, png) => {
        if (err) throw err;

        const width = png.getWidth();
        const height = png.getHeight();
        const data = new Uint8Array(width * height * 4);

        for (let j = 0; j < height; j += 1) {
          for (let i = 0; i < width; i += 1) {
            const offset = 4 * (i + (j * width));
            const pix = png.getPixel(i, j);

            Array(4).fill(0).forEach((v, idx) => {
              data[offset + idx] = pix[idx];
            });
          }
        }
        loadImage({ width, height, data }, cb);
      });
      return;
    }
    if (mime === 'image/jpeg') {
      loadImage(JPGReader.decode(image), cb);
      return;
    }

    // TODO: support for TIFF, NetPBM, BMP, etc.
  }

  // node uses json.stringify for ipc which means we need to turn
  // fancy arrays into raw arrays
  if (image && image.data && image.data.length && !Array.isArray(image.data)) {
    loadImage({ ...image, data: Array.from(image.data) }, cb);
    return;
  }
  cb(image);
}

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
  loadImage(packet.payload.image, (img) => {
    instance.worker.send({
      ...packet,
      payload: {
        ...packet.payload,
        image: img,
      },
    });
  });
};
