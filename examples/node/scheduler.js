const { createWorker, createScheduler } = require('../../');

const scheduler = createScheduler();

// Creates worker and adds to scheduler
const workerGen = async () => {
  const worker = createWorker({cachePath: "."});
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  scheduler.addWorker(worker);
}

const workerN = 4;
(async () => {
  const resArr = Array(workerN);
  for (let i=0; i<workerN; i++) {
    resArr[i] = workerGen();
  }
  await Promise.all(resArr);
  /** Add 4 recognition jobs */
  const results = await Promise.all(Array(10).fill(0).map(() => (
    scheduler.addJob('recognize', 'https://tesseract.projectnaptha.com/img/eng_bw.png').then((x) => console.log(x.data.text))
  )))
  await scheduler.terminate(); // It also terminates all workers.
})();