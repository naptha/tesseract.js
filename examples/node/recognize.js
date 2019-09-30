#!/usr/bin/env node
const path = require('path');
const { createScheduler, createWorker, createJob, OEM } = require('../../');

const [,, imagePath] = process.argv;
const image = path.resolve(__dirname, (imagePath || '../../tests/assets/images/cosmic.png'));

console.log(`Recognizing ${image}`);

(async () => {
  const scheduler = createScheduler();
  const worker = createWorker();
  await worker.load();
  await worker.loadLanguage('osd');
  await worker.initialize('osd', {
    tessedit_ocr_engine_mode: OEM.OSD_ONLY,
  });
  scheduler.addWorker(worker);
  const data = await scheduler.addJob(createJob('detect', { image }));
  console.log(data);
  scheduler.terminate();
})();
