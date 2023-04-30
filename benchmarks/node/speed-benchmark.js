#!/usr/bin/env node
const path = require('path');
const { createWorker } = require('../../');

(async () => {
  const worker = await createWorker();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const fileArr = ["../data/meditations.jpg", "../data/tyger.jpg", "../data/testocr.png"];
  let timeTotal = 0;
  for (let file of fileArr) {
      let time1 = Date.now();
      for (let i=0; i < 10; i++) {
          await worker.recognize(file)
      }
      let time2 = Date.now();
      const timeDif = (time2 - time1) / 1e3;
      timeTotal += timeDif;

      console.log(file + " [x10] runtime: " + timeDif + "s");
    }
console.log("Total runtime: " + timeTotal + "s");

await worker.terminate();
})();
