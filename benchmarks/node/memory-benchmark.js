#!/usr/bin/env node

'use strict';

// Note: getting replicable results from this script requires:
// (1) Running with the `--expose-gc` flag,
// (2) adding `global.gc()` within the `index.js` file
// to force garbage collection within each worker after each iteration.

const path = require('path');
const { createWorker, createScheduler } = require('../../src');

const formatBytes = (bytes) => `${(bytes / 1024 / 1024).toFixed(0)} MB`;
const formatTime = (seconds) => `${seconds.toFixed(2)}s`;

const getMemoryRow = (iteration, memUsage, time) => `| ${iteration} | ${formatTime(time)} | ${formatBytes(memUsage.heapUsed)} | ${formatBytes(memUsage.heapTotal)} | ${formatBytes(memUsage.rss - memUsage.heapTotal)} | ${formatBytes(memUsage.rss)} | ${formatBytes(memUsage.external)} |`;

const scheduler = createScheduler();

if (!global.gc) {
  console.log('Garbage collection unavailable.  Pass --expose-gc '
    + 'when launching node to enable forced garbage collection.');
}

const workerGen = async () => {
  const worker = await createWorker('eng', 1, { cachePath: '.' });
  scheduler.addWorker(worker);
};

(async () => {
  const fileArr = [
    path.join(__dirname, '..', 'data', 'meditations.jpg'),
    path.join(__dirname, '..', 'data', 'tyger.jpg'),
    path.join(__dirname, '..', 'data', 'testocr.png'),
  ];

  const workerN = 4;
  const resArr = Array(workerN);
  for (let i = 0; i < workerN; i++) {
    resArr[i] = workerGen();
  }
  await Promise.all(resArr);

  // Print table header
  console.log('| Iteration | Time | Heap Used | Heap Total | RSS Non-Heap | RSS Total | External |');
  console.log('|-----------|------|-----------|------------|--------------|-----------|----------|');

  for (let i = 0; i < 10; i++) {
    let iterationTime = 0;
    for (const file of fileArr) {
      const time1 = Date.now();
      const promises = [];
      for (let j = 0; j < 10; j++) {
        // Results are purposefully not saved as this would increase memory usage over time.
        promises.push(scheduler.addJob('recognize', file, {}, { blocks: true }).then(() => (true)));
      }
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(promises);

      const time2 = Date.now();
      const timeDif = (time2 - time1) / 1e3;
      iterationTime += timeDif;
    }

    if (global.gc) global.gc();

    // Print memory stats and time after each iteration
    console.log(getMemoryRow(i + 1, process.memoryUsage(), iterationTime));
  }

  if (global.gc) global.gc();
  // require('v8').writeHeapSnapshot();

  scheduler.terminate();
})();
