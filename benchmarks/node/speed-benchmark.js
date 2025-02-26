#!/usr/bin/env node

'use strict';

const path = require('path');
const { createWorker } = require('../..');

(async () => {
  const worker = await createWorker();
  const fileArr = [
    path.join(__dirname, '..', 'data', 'meditations.jpg'),
    path.join(__dirname, '..', 'data', 'tyger.jpg'),
    path.join(__dirname, '..', 'data', 'testocr.png'),
  ];
  let timeTotal = 0;
  for (const file of fileArr) {
    const time1 = Date.now();
    for (let i = 0; i < 10; i++) {
      // eslint-disable-next-line no-await-in-loop
      await worker.recognize(file);
    }
    const time2 = Date.now();
    const timeDif = (time2 - time1) / 1e3;
    timeTotal += timeDif;

    console.log(`${file} [x10] runtime: ${timeDif}s`);
  }
  console.log(`Total runtime: ${timeTotal}s`);

  await worker.terminate();
})();
