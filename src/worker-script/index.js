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
const isURL = require('is-url');
const dump = require('./utils/dump');
const env = require('../utils/getEnvironment')('type');
const setImage = require('./utils/setImage');
const defaultParams = require('./constants/defaultParams');
const defaultOutput = require('./constants/defaultOutput');
const { log, setLogging } = require('../utils/log');
const PSM = require('../constants/PSM');

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
let loadLanguageLangsWorker;
let loadLanguageOptionsWorker;
let dataFromCache = false;

const load = async ({ workerId, jobId, payload: { options: { lstmOnly, corePath, logging } } }, res) => { // eslint-disable-line max-len
  setLogging(logging);

  const statusText = 'initializing tesseract';

  if (!TessModule) {
    const Core = await adapter.getCore(lstmOnly, corePath, res);

    res.progress({ workerId, status: statusText, progress: 0 });

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
      res.progress({ workerId, status: statusText, progress: 1 });
      res.resolve({ loaded: true });
    });
  } else {
    res.resolve({ loaded: true });
  }
};

const FS = async ({ workerId, payload: { method, args } }, res) => {
  log(`[${workerId}]: FS.${method}`);
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
      lstmOnly,
    },
  },
},
res) => {
  // Remember options for later, as cache may be deleted if `initialize` fails
  loadLanguageLangsWorker = langs;
  loadLanguageOptionsWorker = {
    langPath,
    dataPath,
    cachePath,
    cacheMethod,
    gzip,
    lstmOnly,
  };

  const statusText = 'loading language traineddata';

  const langsArr = typeof langs === 'string' ? langs.split('+') : langs;
  let progress = 0;

  const loadAndGunzipFile = async (_lang) => {
    const lang = typeof _lang === 'string' ? _lang : _lang.code;
    const readCache = ['refresh', 'none'].includes(cacheMethod)
      ? () => Promise.resolve()
      : adapter.readCache;
    let data = null;
    let newData = false;

    // Check for existing .traineddata file in cache
    // This automatically fails if cacheMethod is set to 'refresh' or 'none'
    try {
      const _data = await readCache(`${cachePath || '.'}/${lang}.traineddata`);
      if (typeof _data !== 'undefined') {
        log(`[${workerId}]: Load ${lang}.traineddata from cache`);
        data = _data;
        dataFromCache = true;
      } else {
        throw Error('Not found in cache');
      }
    // Attempt to fetch new .traineddata file
    } catch (e) {
      newData = true;
      log(`[${workerId}]: Load ${lang}.traineddata from ${langPath}`);
      if (typeof _lang === 'string') {
        let path = null;

        // If `langPath` if not explicitly set by the user, the jsdelivr CDN is used.
        // Data supporting the Legacy model is only included if `lstmOnly` is not true.
        // This saves a significant amount of data for the majority of users that use LSTM only.
        const langPathDownload = langPath || (lstmOnly ? `https://cdn.jsdelivr.net/npm/@tesseract.js-data/${lang}/4.0.0_best_int` : `https://cdn.jsdelivr.net/npm/@tesseract.js-data/${lang}/4.0.0`);

        // For Node.js, langPath may be a URL or local file path
        // The is-url package is used to tell the difference
        // For the browser version, langPath is assumed to be a URL
        if (env !== 'node' || isURL(langPathDownload) || langPathDownload.startsWith('moz-extension://') || langPathDownload.startsWith('chrome-extension://') || langPathDownload.startsWith('file://')) { /** When langPathDownload is an URL */
          path = langPathDownload.replace(/\/$/, '');
        }

        // langPathDownload is a URL, fetch from server
        if (path !== null) {
          const fetchUrl = `${path}/${lang}.traineddata${gzip ? '.gz' : ''}`;
          const resp = await (env === 'webworker' ? fetch : adapter.fetch)(fetchUrl);
          if (!resp.ok) {
            throw Error(`Network error while fetching ${fetchUrl}. Response code: ${resp.status}`);
          }
          data = new Uint8Array(await resp.arrayBuffer());

        // langPathDownload is a local file, read .traineddata from local filesystem
        // (adapter.readCache is a generic file read function in Node.js version)
        } else {
          data = await adapter.readCache(`${langPathDownload}/${lang}.traineddata${gzip ? '.gz' : ''}`);
        }
      } else {
        data = _lang.data; // eslint-disable-line
      }
    }

    progress += 0.5 / langsArr.length;
    if (res) res.progress({ workerId, status: statusText, progress });

    // Check for gzip magic numbers (1F and 8B in hex)
    const isGzip = (data[0] === 31 && data[1] === 139) || (data[1] === 31 && data[0] === 139);

    if (isGzip) {
      data = adapter.gunzip(data);
    }

    if (TessModule) {
      if (dataPath) {
        try {
          TessModule.FS.mkdir(dataPath);
        } catch (err) {
          if (res) res.reject(err.toString());
        }
      }
      TessModule.FS.writeFile(`${dataPath || '.'}/${lang}.traineddata`, data);
    }

    if (newData && ['write', 'refresh', undefined].includes(cacheMethod)) {
      try {
        await adapter.writeCache(`${cachePath || '.'}/${lang}.traineddata`, data);
      } catch (err) {
        log(`[${workerId}]: Failed to write ${lang}.traineddata to cache due to error:`);
        log(err.toString());
      }
    }

    progress += 0.5 / langsArr.length;
    // Make sure last progress message is 1 (not 0.9999)
    if (Math.round(progress * 100) === 100) progress = 1;
    if (res) res.progress({ workerId, status: statusText, progress });
  };

  if (res) res.progress({ workerId, status: statusText, progress: 0 });
  try {
    await Promise.all(langsArr.map(loadAndGunzipFile));
    if (res) res.resolve(langs);
  } catch (err) {
    if (res) res.reject(err.toString());
  }
};

const setParameters = async ({ payload: { params: _params } }, res) => {
  // A small number of parameters can only be set at initialization.
  // These can only be set using (1) the `oem` argument of `initialize` (for setting the oem)
  // or (2) the `config` argument of `initialize` (for all other settings).
  // Attempting to set these using this function will have no impact so a warning is printed.
  // This list is generated by searching the Tesseract codebase for parameters
  // defined with `[type]_INIT_MEMBER` rather than `[type]_MEMBER`.
  const initParamNames = ['ambigs_debug_level', 'user_words_suffix', 'user_patterns_suffix', 'user_patterns_suffix',
    'load_system_dawg', 'load_freq_dawg', 'load_unambig_dawg', 'load_punc_dawg', 'load_number_dawg', 'load_bigram_dawg',
    'tessedit_ocr_engine_mode', 'tessedit_init_config_only', 'language_model_ngram_on', 'language_model_use_sigmoidal_certainty'];

  const initParamStr = Object.keys(_params)
    .filter((k) => initParamNames.includes(k))
    .join(', ');

  if (initParamStr.length > 0) console.log(`Attempted to set parameters that can only be set during initialization: ${initParamStr}`);

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

const initialize = async ({
  workerId,
  payload: { langs: _langs, oem, config },
}, res) => {
  const langs = (typeof _langs === 'string')
    ? _langs
    : _langs.map((l) => ((typeof l === 'string') ? l : l.data)).join('+');

  const statusText = 'initializing api';

  try {
    res.progress({
      workerId, status: statusText, progress: 0,
    });
    if (api !== null) {
      api.End();
    }
    let configFile;
    let configStr;
    // config argument may either be config file text, or object with key/value pairs
    // In the latter case we convert to config file text here
    if (config && typeof config === 'object' && Object.keys(config).length > 0) {
      configStr = JSON.stringify(config).replace(/,/g, '\n').replace(/:/g, ' ').replace(/["'{}]/g, '');
    } else if (config && typeof config === 'string') {
      configStr = config;
    }
    if (typeof configStr === 'string') {
      configFile = '/config';
      TessModule.FS.writeFile(configFile, configStr);
    }

    api = new TessModule.TessBaseAPI();
    let status = api.Init(null, langs, oem, configFile);
    if (status === -1) {
      // Cache is deleted if initialization fails to avoid keeping bad data in cache
      // This assumes that initialization failing only occurs due to bad .traineddata,
      // this should be refined if other reasons for init failing are encountered.
      // The "if" condition skips this section if either (1) cache is disabled [so the issue
      // is definitely unrelated to cached data] or (2) cache is set to read-only
      // [so we do not have permission to make any changes].
      if (['write', 'refresh', undefined].includes(loadLanguageOptionsWorker.cacheMethod)) {
        const langsArr = langs.split('+');
        const delCachePromise = langsArr.map((lang) => adapter.deleteCache(`${loadLanguageOptionsWorker.cachePath || '.'}/${lang}.traineddata`));
        await Promise.all(delCachePromise);

        // Check for the case when (1) data was loaded from the cache and
        // (2) the data does not support the requested OEM.
        // In this case, loadLanguage is re-run and initialization is attempted a second time.
        // This is because `loadLanguage` has no mechanism for checking whether the cached data
        // supports the requested model, so this only becomes apparent when initialization fails.

        // Check for this error message:
        // eslint-disable-next-line
        // "Tesseract (legacy) engine requested, but components are not present in ./eng.traineddata!!""
        // The .wasm build of Tesseract saves this message in a separate file
        // (in addition to the normal debug file location).
        const debugStr = TessModule.FS.readFile('/debugDev.txt', { encoding: 'utf8', flags: 'a+' });
        if (dataFromCache && /components are not present/.test(debugStr)) {
          log('Data from cache missing requested OEM model. Attempting to refresh cache with new language data.');
          // In this case, language data is re-loaded
          await loadLanguage({ workerId, payload: { langs: loadLanguageLangsWorker, options: loadLanguageOptionsWorker } }); // eslint-disable-line max-len
          status = api.Init(null, langs, oem, configFile);
          if (status === -1) {
            log('Language data refresh failed.');
            const delCachePromise2 = langsArr.map((lang) => adapter.deleteCache(`${loadLanguageOptionsWorker.cachePath || '.'}/${lang}.traineddata`));
            await Promise.all(delCachePromise2);
          } else {
            log('Language data refresh successful.');
          }
        }
      }
    }

    if (status === -1) {
      res.reject('initialization failed');
    }

    params = defaultParams;
    await setParameters({ payload: { params } });
    res.progress({
      workerId, status: statusText, progress: 1,
    });
    res.resolve();
  } catch (err) {
    res.reject(err.toString());
  }
};

const getPDFInternal = (title, textonly) => {
  const pdfRenderer = new TessModule.TessPDFRenderer('tesseract-ocr', '/', textonly);
  pdfRenderer.BeginDocument(title);
  pdfRenderer.AddImage(api);
  pdfRenderer.EndDocument();
  TessModule._free(pdfRenderer);

  return TessModule.FS.readFile('/tesseract-ocr.pdf');
};

const getPDF = async ({ payload: { title, textonly } }, res) => {
  res.resolve(getPDFInternal(title, textonly));
};

// Combines default output with user-specified options and
// counts (1) total output formats requested and (2) outputs that require OCR
const processOutput = (output) => {
  const workingOutput = JSON.parse(JSON.stringify(defaultOutput));
  // Output formats were set using `setParameters` in previous versions
  // These settings are copied over for compatability
  if (params.tessjs_create_box === '1') workingOutput.box = true;
  if (params.tessjs_create_hocr === '1') workingOutput.hocr = true;
  if (params.tessjs_create_osd === '1') workingOutput.osd = true;
  if (params.tessjs_create_tsv === '1') workingOutput.tsv = true;
  if (params.tessjs_create_unlv === '1') workingOutput.unlv = true;

  const nonRecOutputs = ['imageColor', 'imageGrey', 'imageBinary', 'layoutBlocks', 'debug'];
  let recOutputCount = 0;
  for (const prop of Object.keys(output)) {
    workingOutput[prop] = output[prop];
  }
  for (const prop of Object.keys(workingOutput)) {
    if (workingOutput[prop]) {
      if (!nonRecOutputs.includes(prop)) {
        recOutputCount += 1;
      }
    }
  }
  const skipRecognition = recOutputCount === 0;
  return { workingOutput, skipRecognition };
};

// List of options for Tesseract.js (rather than passed through to Tesseract),
// not including those with prefix "tessjs_"
const tessjsOptions = ['rectangle', 'pdfTitle', 'pdfTextOnly', 'rotateAuto', 'rotateRadians'];

const recognize = async ({
  payload: {
    image, options, output,
  },
}, res) => {
  try {
    const optionsTess = {};
    if (typeof options === 'object' && Object.keys(options).length > 0) {
      // The options provided by users contain a mix of options for Tesseract.js
      // and parameters passed through to Tesseract.
      for (const param of Object.keys(options)) {
        if (!param.startsWith('tessjs_') && !tessjsOptions.includes(param)) {
          optionsTess[param] = options[param];
        }
      }
    }
    if (output.debug) {
      optionsTess.debug_file = '/debugInternal.txt';
      TessModule.FS.writeFile('/debugInternal.txt', '');
    }
    // If any parameters are changed here they are changed back at the end
    if (Object.keys(optionsTess).length > 0) {
      api.SaveParameters();
      for (const prop of Object.keys(optionsTess)) {
        api.SetVariable(prop, optionsTess[prop]);
      }
    }

    const { workingOutput, skipRecognition } = processOutput(output);

    // When the auto-rotate option is True, setImage is called with no angle,
    // then the angle is calculated by Tesseract and then setImage is re-called.
    // Otherwise, setImage is called once using the user-provided rotateRadiansFinal value.
    let rotateRadiansFinal;
    if (options.rotateAuto) {
      // The angle is only detected if auto page segmentation is used
      // Therefore, if this is not the mode specified by the user, it is enabled temporarily here
      const psmInit = api.GetPageSegMode();
      let psmEdit = false;
      if (![PSM.AUTO, PSM.AUTO_ONLY, PSM.OSD].includes(psmInit)) {
        psmEdit = true;
        api.SetVariable('tessedit_pageseg_mode', String(PSM.AUTO));
      }

      setImage(TessModule, api, image);
      api.FindLines();

      // The function GetAngle will be replaced with GetGradient in 4.0.4,
      // but for now we want to maintain compatibility.
      // We can switch to only using GetGradient in v5.
      const rotateRadiansCalc = api.GetGradient ? api.GetGradient() : api.GetAngle();

      // Restore user-provided PSM setting
      if (psmEdit) {
        api.SetVariable('tessedit_pageseg_mode', String(psmInit));
      }

      // Small angles (<0.005 radians/~0.3 degrees) are ignored to save on runtime
      if (Math.abs(rotateRadiansCalc) >= 0.005) {
        rotateRadiansFinal = rotateRadiansCalc;
        setImage(TessModule, api, image, rotateRadiansFinal);
      } else {
        // Image needs to be reset if run with different PSM setting earlier
        if (psmEdit) {
          setImage(TessModule, api, image);
        }
        rotateRadiansFinal = 0;
      }
    } else {
      rotateRadiansFinal = options.rotateRadians || 0;
      setImage(TessModule, api, image, rotateRadiansFinal);
    }

    const rec = options.rectangle;
    if (typeof rec === 'object') {
      api.SetRectangle(rec.left, rec.top, rec.width, rec.height);
    }

    if (!skipRecognition) {
      api.Recognize(null);
    } else {
      if (output.layoutBlocks) {
        api.AnalyseLayout();
      }
      log('Skipping recognition: all output options requiring recognition are disabled.');
    }
    const { pdfTitle } = options;
    const { pdfTextOnly } = options;
    const result = dump(TessModule, api, workingOutput, { pdfTitle, pdfTextOnly, skipRecognition });
    result.rotateRadians = rotateRadiansFinal;

    if (output.debug) TessModule.FS.unlink('/debugInternal.txt');

    if (Object.keys(optionsTess).length > 0) {
      api.RestoreParameters();
    }

    res.resolve(result);
  } catch (err) {
    res.reject(err.toString());
  }
};

const detect = async ({ payload: { image } }, res) => {
  try {
    setImage(TessModule, api, image);
    const results = new TessModule.OSResults();

    if (!api.DetectOS(results)) {
      res.resolve({
        tesseract_script_id: null,
        script: null,
        script_confidence: null,
        orientation_degrees: null,
        orientation_confidence: null,
      });
    } else {
      const best = results.best_result;
      const oid = best.orientation_id;
      const sid = best.script_id;

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

const terminate = async (_, res) => {
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
    // Return only the necessary info to avoid sending unnecessarily large messages
    const packetRes = {
      jobId: packet.jobId,
      workerId: packet.workerId,
      action: packet.action,
    };
    send({
      ...packetRes,
      status,
      data,
    });
  };
  res.resolve = res.bind(this, 'resolve');
  res.reject = res.bind(this, 'reject');
  res.progress = res.bind(this, 'progress');

  latestJob = res;

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
  })[packet.action](packet, res)
    .catch((err) => res.reject(err.toString()));
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
