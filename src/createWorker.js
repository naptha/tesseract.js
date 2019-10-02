const resolvePaths = require('./utils/resolvePaths');
const circularize = require('./utils/circularize');
const createJob = require('./createJob');
const log = require('./utils/log');
const { defaultOEM } = require('./constants/config');
const {
  defaultOptions,
  spawnWorker,
  terminateWorker,
  onMessage,
  loadImage,
  send,
} = require('./worker/node');

let workerCounter = 1;

module.exports = (_options = {}) => {
  const id = `Worker-${workerCounter}-${Math.random().toString(16).slice(3, 8)}`;
  workerCounter += 1;
  const {
    logger,
    ...options
  } = resolvePaths({
    ...defaultOptions,
    ..._options,
  });
  const resolves = {};
  const rejects = {};
  let worker = spawnWorker(options);

  const setResolve = (action, res) => {
    resolves[action] = res;
  };

  const setReject = (action, rej) => {
    rejects[action] = rej;
  };

  const startJob = (action, payload = {}) => (
    new Promise((resolve, reject) => {
      const { id: jobId } = createJob(action, payload);
      log(`[${id}]: Start ${jobId}, action=${action}`);
      setResolve(action, resolve);
      setReject(action, reject);
      send(worker, {
        workerId: id,
        jobId,
        action,
        payload,
      });
    })
  );

  const load = () => (
    startJob('load', { options })
  );

  const loadLanguage = (langs = 'eng') => (
    startJob('loadLanguage', { langs, options })
  );

  const initialize = (langs = 'eng', oem = defaultOEM) => (
    startJob('initialize', { langs, oem })
  );

  const setParameters = (params = {}) => (
    startJob('setParameters', { params })
  );

  const recognize = async (image, opts = {}) => (
    startJob('recognize', { image: await loadImage(image), options: opts })
  );

  const getPDF = (title = 'Tesseract OCR Result', textonly = false) => (
    startJob('getPDF', { title, textonly })
  );

  const detect = async image => (
    startJob('detect', { image: await loadImage(image) })
  );

  const terminate = async () => {
    if (worker !== null) {
      await startJob('terminate');
      terminateWorker(worker);
      worker = null;
    }
    return Promise.resolve();
  };

  onMessage(worker, ({ status, action, data }) => {
    if (status === 'resolve') {
      let d = data;
      if (action === 'recognize') {
        d = circularize(data);
      } else if (action === 'getPDF') {
        d = Array.from({ ...data, length: Object.keys(data).length });
      }
      resolves[action](d);
    } else if (status === 'reject') {
      rejects[action](data);
      throw Error(data);
    } else if (status === 'progress') {
      logger(data);
    }
  });

  return {
    id,
    worker,
    setResolve,
    setReject,
    load,
    loadLanguage,
    initialize,
    setParameters,
    recognize,
    getPDF,
    detect,
    terminate,
  };
};
