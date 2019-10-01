const resolvePaths = require('./utils/resolvePaths');
const circularize = require('./utils/circularize');
const createJob = require('./createJob');
const { defaultOEM } = require('./constants/config');
const {
  defaultOptions,
  spawnWorker,
  terminateWorker,
  onMessage,
} = require('./worker/node');

let workerCounter = 0;

module.exports = (_options = {}) => {
  workerCounter += 1;
  const id = `Worker-${workerCounter}-${Math.random().toString(16).slice(3, 8)}`;
  const options = resolvePaths({
    ...defaultOptions,
    ..._options,
  });
  const { logger } = options;
  const resolves = {};
  const rejects = {};
  let worker = spawnWorker(options);

  const setResolve = (action, res) => {
    resolves[action] = res;
  };

  const setReject = (action, rej) => {
    rejects[action] = rej;
  };

  const doJob = (action, payload) => (
    new Promise((resolve, reject) => {
      setResolve(action, resolve);
      setReject(action, reject);
      createJob(action, payload).start({ worker, id });
    })
  );

  const load = () => (
    doJob('load', { options })
  );

  const loadLanguage = (langs = 'eng') => (
    doJob('loadLanguage', { langs, options })
  );

  const initialize = (langs = 'eng', oem = defaultOEM) => (
    doJob('initialize', { langs, oem })
  );

  const setParameters = (params = {}) => (
    doJob('setParameters', { params })
  );

  const recognize = (image, opts = {}) => (
    doJob('recognize', { image, options: opts })
  );

  const getPDF = (title = 'Tesseract OCR Result', textonly = false) => (
    doJob('getPDF', { title, textonly })
  );

  const detect = image => (
    doJob('detect', { image })
  );

  const terminate = async () => {
    if (worker !== null) {
      await doJob('terminate');
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
