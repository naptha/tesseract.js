const constants = require('../tests/constants');
global.expect = require('expect.js');
global.fs = require('node:fs');
global.path = require('node:path');
global.Tesseract = require('../src');

Object.keys(constants).forEach((key) => {
  global[key] = constants[key];
});
