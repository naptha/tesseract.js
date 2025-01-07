const resolvePaths = require('./utils/resolvePaths');
const createJob = require('./createJob');
const { log } = require('./utils/log');
const getId = require('./utils/getId');
const OEM = require('./constants/OEM');
const {
  defaultOptions,
  spawnWorker,
  terminateWorker,
  onMessage,
  loadImage,
  send,
} = require('./worker/node');

let workerCounter = 0;

module.exports = async (langs = 'eng', oem = OEM.LSTM_ONLY, _options = {}, config = {}) => {
  const id = getId('Worker', workerCounter);
  const {
    logger,
    errorHandler,
    ...options
  } = resolvePaths({
    ...defaultOptions,
    ..._options,
  });
  const promises = {};

  // Current langs, oem, and config file.
  // Used if the user ever re-initializes the worker using `worker.reinitialize`.
  const currentLangs = typeof langs === 'string' ? langs.split('+') : langs;
  let currentOem = oem;
  let currentConfig = config;
  const lstmOnlyCore = [OEM.DEFAULT, OEM.LSTM_ONLY].includes(oem) && !options.legacyCore;

  let workerResReject;
  let workerResResolve;
  const workerRes = new Promise((resolve, reject) => {
    workerResResolve = resolve;
    workerResReject = reject;
  });
  const workerError = (event) => { workerResReject(event.message); };

  let worker = spawnWorker(options);
  worker.onerror = workerError;

  workerCounter += 1;

  const startJob = ({ id: jobId, action, payload }) => (
    new Promise((resolve, reject) => {
      log(`[${id}]: Start ${jobId}, action=${action}`);
      // Using both `action` and `jobId` in case user provides non-unique `jobId`.
      const promiseId = `${action}-${jobId}`;
      promises[promiseId] = { resolve, reject };
      send(worker, {
        workerId: id,
        jobId,
        action,
        payload,
      });
    })
  );

  const load = () => (
    console.warn('`load` is depreciated and should be removed from code (workers now come pre-loaded)')
  );

  const loadInternal = (jobId) => (
    startJob(createJob({
      id: jobId, action: 'load', payload: { options: { lstmOnly: lstmOnlyCore, corePath: options.corePath, logging: options.logging } },
    }))
  );

  const writeText = (path, text, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'FS',
      payload: { method: 'writeFile', args: [path, text] },
    }))
  );

  const readText = (path, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'FS',
      payload: { method: 'readFile', args: [path, { encoding: 'utf8' }] },
    }))
  );

  const removeFile = (path, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'FS',
      payload: { method: 'unlink', args: [path] },
    }))
  );

  const FS = (method, args, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'FS',
      payload: { method, args },
    }))
  );

  const loadLanguageInternal = (_langs, jobId) => startJob(createJob({
    id: jobId,
    action: 'loadLanguage',
    payload: {
      langs: _langs,
      options: {
        langPath: options.langPath,
        dataPath: options.dataPath,
        cachePath: options.cachePath,
        cacheMethod: options.cacheMethod,
        gzip: options.gzip,
        lstmOnly: [OEM.DEFAULT, OEM.LSTM_ONLY].includes(currentOem)
          && !options.legacyLang,
      },
    },
  }));

  const initializeInternal = (_langs, _oem, _config, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'initialize',
      payload: { langs: _langs, oem: _oem, config: _config },
    }))
  );

  const reinitialize = (langs = 'eng', oem, config, jobId) => { // eslint-disable-line

    if (lstmOnlyCore && [OEM.TESSERACT_ONLY, OEM.TESSERACT_LSTM_COMBINED].includes(oem)) throw Error('Legacy model requested but code missing.');

    const _oem = oem || currentOem;
    currentOem = _oem;

    const _config = config || currentConfig;
    currentConfig = _config;

    // Only load langs that are not already loaded.
    // This logic fails if the user downloaded the LSTM-only English data for a language
    // and then uses `worker.reinitialize` to switch to the Legacy engine.
    // However, the correct data will still be downloaded after initialization fails
    // and this can be avoided entirely if the user loads the correct data ahead of time.
    const langsArr = typeof langs === 'string' ? langs.split('+') : langs;
    const _langs = langsArr.filter((x) => !currentLangs.includes(x));
    currentLangs.push(..._langs);

    if (_langs.length > 0) {
      return loadLanguageInternal(_langs, jobId)
        .then(() => initializeInternal(langs, _oem, _config, jobId));
    }

    return initializeInternal(langs, _oem, _config, jobId);
  };

  const setParameters = (params = {}, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'setParameters',
      payload: { params },
    }))
  );

  const recognize = async (image, opts = {}, output = {
    text: true,
  }, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'recognize',
      payload: { image: await loadImage(image), options: opts, output },
    }))
  );

  const detect = async (image, jobId) => {
    if (lstmOnlyCore) throw Error('`worker.detect` requires Legacy model, which was not loaded.');

    return startJob(createJob({
      id: jobId,
      action: 'detect',
      payload: { image: await loadImage(image) },
    }));
  };

  const terminate = async () => {
    if (worker !== null) {
      /*
      await startJob(createJob({
        id: jobId,
        action: 'terminate',
      }));
      */
      terminateWorker(worker);
      worker = null;
    }
    return Promise.resolve();
  };

  onMessage(worker, ({
    workerId, jobId, status, action, data,
  }) => {
    const promiseId = `${action}-${jobId}`;
    if (status === 'resolve') {
      log(`[${workerId}]: Complete ${jobId}`);
      promises[promiseId].resolve({ jobId, data });
      delete promises[promiseId];
    } else if (status === 'reject') {
      promises[promiseId].reject(data);
      delete promises[promiseId];
      if (action === 'load') workerResReject(data);
      if (errorHandler) {
        errorHandler(data);
      } else {
        throw Error(data);
      }
    } else if (status === 'progress') {
      logger({ ...data, userJobId: jobId });
    }
  });

  const resolveObj = {
    id,
    worker,
    load,
    writeText,
    readText,
    removeFile,
    FS,
    reinitialize,
    setParameters,
    recognize,
    detect,
    terminate,
  };

  loadInternal()
    .then(() => loadLanguageInternal(langs))
    .then(() => initializeInternal(langs, oem, config))
    .then(() => workerResResolve(resolveObj))
    .catch(() => {});

  return workerRes;
};
