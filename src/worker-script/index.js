/**
 *
 * Worker script for browser and node
 *
 * @fileoverview Worker script for browser and node
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
require('regenerator-runtime/runtime');
const fileType = require('file-type');
const isURL = require('is-url');
const dump = require('./utils/dump');
const isWebWorker = require('../utils/getEnvironment')('type') === 'webworker';
const setImage = require('./utils/setImage');
const defaultParams = require('./constants/defaultParams');
const { log, setLogging } = require('../utils/log');

/*
 * Tesseract Module returned by TesseractCore.
 */
let TessModule;
/*
 * TessearctBaseAPI instance
 */
let api = null;
let latestJob;
let adapter = {};
let params = defaultParams;

const load = ({ workerId, jobId, payload: { options: { corePath, logging } } }, res) => {
  setLogging(logging);
  if (!TessModule) {
    const Core = adapter.getCore(corePath, res);

    res.progress({ workerId, status: 'initializing tesseract', progress: 0 });

    Core({
      TesseractProgress(percent) {
        latestJob.progress({
          workerId,
          jobId,
          status: 'recognizing text',
          progress: Math.max(0, (percent - 30) / 70),
        });
      },
    }).then((tessModule) => {
      TessModule = tessModule;
      res.progress({ workerId, status: 'initialized tesseract', progress: 1 });
      res.resolve({ loaded: true });
    });
  } else {
    res.resolve({ loaded: true });
  }
};

const FS = ({ workerId, payload: { method, args } }, res) => {
  log(`[${workerId}]: FS.${method} with args ${args}`);
  res.resolve(TessModule.FS[method](...args));
};

const loadLanguage = async ({
  workerId,
  payload: {
    langs,
    options: {
      langPath,
      dataPath,
      cachePath,
      cacheMethod,
      gzip = true,
    },
  },
},
  res) => {
  const loadAndGunzipFile = async (_lang) => {
    const lang = typeof _lang === 'string' ? _lang : _lang.code;
    const readCache = ['refresh', 'none'].includes(cacheMethod)
      ? () => Promise.resolve()
      : adapter.readCache;
    let data = null;

    try {
      const _data = await readCache(`${cachePath || '.'}/${lang}.traineddata`);
      if (typeof _data !== 'undefined') {
        log(`[${workerId}]: Load ${lang}.traineddata from cache`);
        res.progress({ workerId, status: 'loading language traineddata (from cache)', progress: 0.5 });
        data = _data;
      } else {
        throw Error('Not found in cache');
      }
    } catch (e) {
      log(`[${workerId}]: Load ${lang}.traineddata from ${langPath}`);
      if (typeof _lang === 'string') {
        let path = null;

        if (isURL(langPath) || langPath.startsWith('moz-extension://') || langPath.startsWith('chrome-extension://') || langPath.startsWith('file://')) { /** When langPath is an URL */
          path = langPath;
        }

        if (path !== null) {
          const resp = await (isWebWorker ? fetch : adapter.fetch)(`${path}/${lang}.traineddata${gzip ? '.gz' : ''}`);
          data = await resp.arrayBuffer();
        } else {
          data = await adapter.readCache(`${langPath}/${lang}.traineddata${gzip ? '.gz' : ''}`);
        }
      } else {
        data = _lang.data; // eslint-disable-line
      }
    }

    data = new Uint8Array(data);

    const type = fileType(data);
    if (typeof type !== 'undefined' && type.mime === 'application/gzip') {
      data = adapter.gunzip(data);
    }

    if (TessModule) {
      if (dataPath) {
        try {
          TessModule.FS.mkdir(dataPath);
        } catch (err) {
          res.reject(err.toString());
        }
      }
      TessModule.FS.writeFile(`${dataPath || '.'}/${lang}.traineddata`, data);
    }

    if (['write', 'refresh', undefined].includes(cacheMethod)) {
      await adapter.writeCache(`${cachePath || '.'}/${lang}.traineddata`, data);
    }

    return Promise.resolve(data);
  };

  res.progress({ workerId, status: 'loading language traineddata', progress: 0 });
  try {
    await Promise.all((typeof langs === 'string' ? langs.split('+') : langs).map(loadAndGunzipFile));
    res.progress({ workerId, status: 'loaded language traineddata', progress: 1 });
    res.resolve(langs);
  } catch (err) {
    if (isWebWorker && err instanceof DOMException) {
      /*
       * For some reason google chrome throw DOMException in loadLang,
       * while other browser is OK, for now we ignore this exception
       * and hopefully to find the root cause one day.
       */
    } else {
      res.reject(err.toString());
    }
  }
};

const setParameters = ({ payload: { params: _params } }, res) => {
  Object.keys(_params)
    .filter((k) => !k.startsWith('tessjs_'))
    .forEach((key) => {
      api.SetVariable(key, _params[key]);
    });
  params = { ...params, ..._params };

  if (typeof res !== 'undefined') {
    res.resolve(params);
  }
};

const initialize = ({
  workerId,
  payload: { langs: _langs, oem },
}, res) => {
  const langs = (typeof _langs === 'string')
    ? _langs
    : _langs.map((l) => ((typeof l === 'string') ? l : l.data)).join('+');

  try {
    res.progress({
      workerId, status: 'initializing api', progress: 0,
    });
    if (api !== null) {
      api.End();
    }
    api = new TessModule.TessBaseAPI();
    api.Init(null, langs, oem);
    params = defaultParams;
    setParameters({ payload: { params } });
    res.progress({
      workerId, status: 'initialized api', progress: 1,
    });
    res.resolve();
  } catch (err) {
    res.reject(err.toString());
  }
};

const recognize = ({ payload: { image, options: { rectangle: rec } } }, res) => {
  try {
    const ptr = setImage(TessModule, api, image);
    if (typeof rec === 'object') {
      api.SetRectangle(rec.left, rec.top, rec.width, rec.height);
    }
    api.Recognize(null);
    res.resolve(dump(TessModule, api, params));
    TessModule._free(ptr);
  } catch (err) {
    res.reject(err.toString());
  }
};

const getPDF = ({ payload: { title, textonly } }, res) => {
  const pdfRenderer = new TessModule.TessPDFRenderer('tesseract-ocr', '/', textonly);
  pdfRenderer.BeginDocument(title);
  pdfRenderer.AddImage(api);
  pdfRenderer.EndDocument();
  TessModule._free(pdfRenderer);

  res.resolve(TessModule.FS.readFile('/tesseract-ocr.pdf'));
};

const detect = ({ payload: { image } }, res) => {
  try {
    const ptr = setImage(TessModule, api, image);
    const results = new TessModule.OSResults();

    if (!api.DetectOS(results)) {
      api.End();
      TessModule._free(ptr);
      res.reject('Failed to detect OS');
    } else {
      const best = results.best_result;
      const oid = best.orientation_id;
      const sid = best.script_id;

      TessModule._free(ptr);

      res.resolve({
        tesseract_script_id: sid,
        script: results.unicharset.get_script_from_script_id(sid),
        script_confidence: best.sconfidence,
        orientation_degrees: [0, 270, 180, 90][oid],
        orientation_confidence: best.oconfidence,
      });
    }
  } catch (err) {
    res.reject(err.toString());
  }
};

const terminate = (_, res) => {
  try {
    if (api !== null) {
      api.End();
    }
    res.resolve({ terminated: true });
  } catch (err) {
    res.reject(err.toString());
  }
};

/**
 * dispatchHandlers
 *
 * @name dispatchHandlers
 * @function worker data handler
 * @access public
 * @param {object} data
 * @param {string} data.jobId - unique job id
 * @param {string} data.action - action of the job, only recognize and detect for now
 * @param {object} data.payload - data for the job
 * @param {function} send - trigger job to work
 */
exports.dispatchHandlers = (packet, send) => {
  const res = (status, data) => {
    send({
      ...packet,
      status,
      data,
    });
  };
  res.resolve = res.bind(this, 'resolve');
  res.reject = res.bind(this, 'reject');
  res.progress = res.bind(this, 'progress');

  latestJob = res;

  try {
    ({
      load,
      FS,
      loadLanguage,
      initialize,
      setParameters,
      recognize,
      getPDF,
      detect,
      terminate,
    })[packet.action](packet, res);
  } catch (err) {
    /** Prepare exception to travel through postMessage */
    res.reject(err.toString());
  }
};

/**
 * setAdapter
 *
 * @name setAdapter
 * @function
 * @access public
 * @param {object} adapter - implementation of the worker, different in browser and node environment
 */
exports.setAdapter = (_adapter) => {
  adapter = _adapter;
};
