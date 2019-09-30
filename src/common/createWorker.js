const { isBrowser } = require('./env');
const resolveURL = isBrowser ? require('resolve-url') : s => s; // eslint-disable-line
const circularize = require('./circularize');
const createJob = require('./createJob');
const { defaultParams } = require('./options');
const {
  defaultOptions,
  spawnWorker,
  terminateWorker,
  setOnMessage,
} = require('../node');

let workerCounter = 0;

const resolvePaths = (options) => {
  const opts = { ...options };
  ['corePath', 'workerPath', 'langPath'].forEach((key) => {
    if (typeof options[key] !== 'undefined') {
      opts[key] = resolveURL(opts[key]);
    }
  });
  return opts;
};

module.exports = (options = {}) => {
  workerCounter += 1;
  const id = `Worker-${workerCounter}-${Math.random().toString(16).slice(3, 8)}`;
  const opts = resolvePaths({
    ...defaultOptions,
    ...options,
  });
  const { logger } = opts;
  const resolves = {};
  const rejects = {};
  let worker = spawnWorker(opts);

  const setResolve = (action, res) => {
    resolves[action] = res;
  };

  const setReject = (action, rej) => {
    rejects[action] = rej;
  };

  const load = () => (
    new Promise((resolve, reject) => {
      const job = createJob(
        'load',
        opts,
      );
      setResolve('load', resolve);
      setReject('load', reject);
      job.start({ worker, id });
    })
  );

  const loadLanguage = (langs = 'eng') => (
    new Promise((resolve, reject) => {
      const job = createJob(
        'load-language',
        {
          langs,
          options: opts,
        },
      );
      setResolve('load-language', resolve);
      setReject('load-language', reject);
      job.start({ worker, id });
    })
  );

  const initialize = (langs = 'eng', params = {}) => (
    new Promise((resolve, reject) => {
      const job = createJob(
        'initialize',
        {
          langs,
          params: {
            ...defaultParams,
            ...params,
          },
        },
      );
      setResolve('initialize', resolve);
      setReject('initialize', reject);
      job.start({ worker, id });
    })
  );

  const terminate = () => {
    if (worker !== null) {
      terminateWorker({ worker });
      worker = null;
    }
  };

  setOnMessage(worker, (packet) => {
    const { status, action, data } = packet;
    if (status === 'resolve') {
      if (action === 'load') {
        resolves.load(data);
      } else if (action === 'initialize') {
        resolves.initialize({ id });
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
    terminate,
  };
};
