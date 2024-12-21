#!/usr/bin/env node
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
        promises.push(scheduler.addJob('recognize', file));
      }
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(promises);

      if (global.gc) global.gc();

      const time2 = Date.now();
      const timeDif = (time2 - time1) / 1e3;
      iterationTime += timeDif;
    }
    // Print memory stats and time after each iteration
    console.log(getMemoryRow(i + 1, process.memoryUsage(), iterationTime));
  }
  scheduler.terminate();
})();
