#!/usr/bin/env node
const path = require('path');
const {
  createScheduler, createWorker, createJob, PSM,
} = require('../../');

const [,, imagePath] = process.argv;
const image = path.resolve(__dirname, (imagePath || '../../tests/assets/images/cosmic.png'));

console.log(`Recognizing ${image}`);

(async () => {
  const scheduler = createScheduler();
  const worker = createWorker();
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({
    tessedit_char_whitelist: 'ABCDEFGH',
  });
  scheduler.addWorker(worker);
  const { text: t1 } = await scheduler.addJob(createJob('recognize', { image }));
  console.log(t1);
  await worker.setParameters({
    tessedit_char_whitelist: 'abcdefg',
  });
  const { text: t2 } = await scheduler.addJob(createJob('recognize', { image }));
  console.log(t2);
  scheduler.terminate();
})();
