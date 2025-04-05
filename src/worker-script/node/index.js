'use strict';

/**
 *
 * Tesseract Worker Script for Node
 *
 * @fileoverview Node worker implementation
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
// Use built-in fetch if available, otherwise fallback to node-fetch
const fetch = global.fetch || require('node-fetch');
const { parentPort } = require('worker_threads');
const worker = require('..');
const getCore = require('./getCore');
const gunzip = require('./gunzip');
const cache = require('./cache');

/*
 * register message handler
 */
parentPort.on('message', (packet) => {
  worker.dispatchHandlers(packet, (obj) => parentPort.postMessage(obj));
});

worker.setAdapter({
  getCore,
  gunzip,
  fetch,
  ...cache,
});
