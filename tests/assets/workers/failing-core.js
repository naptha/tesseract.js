'use strict';

/*
 * Node worker script whose core always fails to load.
 * Used to test that `createWorker` cleans up after initialization errors.
 */
const { parentPort } = require('worker_threads');
const worker = require('../../../src/worker-script');
const gunzip = require('../../../src/worker-script/node/gunzip');
const cache = require('../../../src/worker-script/node/cache');

parentPort.on('message', (packet) => {
  worker.dispatchHandlers(packet, (obj) => parentPort.postMessage(obj));
});

worker.setAdapter({
  getCore: async () => { throw Error('core failed to load'); },
  gunzip,
  fetch: global.fetch,
  ...cache,
});
