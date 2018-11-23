const express = require('express');
const path = require('path');
global.expect = require('expect.js');
global.fetch = require('node-fetch');
global.Tesseract = require('../src');

const app = express();
let devServer = null;

global.startServer = (done) => {
  if (devServer === null) {
    app.use('/', express.static(path.resolve(__dirname, '..')));
    devServer = app.listen(3000, done);
  } else {
    done();
  }
};

global.stopServer = (done) => {
  if (devServer !== null) {
    devServer.close(done);
    devServer = null;
  } else {
    done();
  }
};
