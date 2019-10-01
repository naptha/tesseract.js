const createScheduler = require('./createScheduler');
const createWorker = require('./createWorker');

const recognize = async (image, langs, options) => {
  const scheduler = createScheduler();
  const worker = createWorker(options);
  await worker.load();
  await worker.loadLanguage(langs);
  await worker.initialize(langs);
  scheduler.addWorker(worker);
  return scheduler.addJob('recognize', image)
    .finally(() => {
      scheduler.terminate();
    });
};

const detect = async (image, options) => {
  const scheduler = createScheduler();
  const worker = createWorker(options);
  await worker.load();
  await worker.loadLanguage('osd');
  await worker.initialize('osd');
  scheduler.addWorker(worker);
  return scheduler.addJob('detect', image)
    .finally(() => {
      scheduler.terminate();
    });
};

module.exports = {
  recognize,
  detect,
};
