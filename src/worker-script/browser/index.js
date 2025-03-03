'use strict';

/**
 *
 * Browser worker scripts
 *
 * @fileoverview Browser worker implementation
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */

const worker = require('..');
const getCore = require('./getCore');
const gunzip = require('./gunzip');
const cache = require('./cache');

/*
 * register message handler
 */
global.addEventListener('message', ({ data }) => {
  worker.dispatchHandlers(data, (obj) => postMessage(obj));
});

/*
 * getCore is a sync function to load and return
 * TesseractCore.
 */
worker.setAdapter({
  getCore,
  gunzip,
  fetch: () => {},
  ...cache,
});
