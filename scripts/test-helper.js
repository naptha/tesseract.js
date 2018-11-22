const express = require('express');
const path = require('path');
global.expect = require('expect.js');
global.fetch = require('node-fetch');
global.Tesseract = require('../src');

const app = express();
let devServer = null;

global.startServer = (done) => {
  app.use('/', express.static(path.resolve(__dirname, '..')));
  devServer = app.listen(3000, done);
};

global.stopServer = (done) => {
  devServer.close(done);
};
