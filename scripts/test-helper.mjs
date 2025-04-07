import expect from 'expect.js';
import fs from 'fs';
// eslint-disable-next-line import/extensions
import Tesseract from '../src/index.js';

global.Tesseract = Tesseract;
global.expect = expect;
global.fs = fs;
