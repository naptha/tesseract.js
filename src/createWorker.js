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
    doJob('load-language', { langs, options })
  );

  const initialize = (langs = 'eng', oem = defaultOEM) => (
    doJob('initialize', { langs, oem })
  );

  const setParameters = (params = {}) => (
    doJob('set-parameters', { params })
  );

  const terminate = () => {
    if (worker !== null) {
      terminateWorker(worker);
      worker = null;
    }
  };

  onMessage(worker, (packet) => {
    const { status, action, data } = packet;
    if (status === 'resolve') {
      if (action === 'load') {
        resolves.load(data);
      } else if (action === 'initialize') {
        resolves.initialize({ id });
      } else if (action === 'set-parameters') {
        resolves['set-parameters'](data);
      } else if (action === 'load-language') {
        resolves['load-language'](data);
      } else if (action === 'recognize') {
        resolves.recognize(circularize(data));
      } else if (action === 'detect') {
        resolves.detect(data);
      }
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
    terminate,
  };
};
