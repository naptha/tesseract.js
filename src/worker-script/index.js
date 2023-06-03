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
let cachePathWorker;
let cacheMethodWorker;

const load = async ({ workerId, jobId, payload: { options: { corePath, logging } } }, res) => {
  setLogging(logging);
  if (!TessModule) {
    const Core = await adapter.getCore(corePath, res);

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

const FS = async ({ workerId, payload: { method, args } }, res) => {
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
  // Remember cache options for later, as cache may be deleted if `initialize` fails
  cachePathWorker = cachePath;
  cacheMethodWorker = cacheMethod;

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
        res.progress({ workerId, status: 'loading language traineddata (from cache)', progress: 0.5 });
        data = _data;
      } else {
        throw Error('Not found in cache');
      }
    // Attempt to fetch new .traineddata file
    } catch (e) {
      newData = true;
      log(`[${workerId}]: Load ${lang}.traineddata from ${langPath}`);
      if (typeof _lang === 'string') {
        let path = null;

        // For Node.js, langPath may be a URL or local file path
        // The is-url package is used to tell the difference
        // For the browser version, langPath is assumed to be a URL
        if (env !== 'node' || isURL(langPath) || langPath.startsWith('moz-extension://') || langPath.startsWith('chrome-extension://') || langPath.startsWith('file://')) { /** When langPath is an URL */
          path = langPath.replace(/\/$/, '');
        }

        // langPath is a URL, fetch from server
        if (path !== null) {
          const fetchUrl = `${path}/${lang}.traineddata${gzip ? '.gz' : ''}`;
          const resp = await (env === 'webworker' ? fetch : adapter.fetch)(fetchUrl);
          if (!resp.ok) {
            throw Error(`Network error while fetching ${fetchUrl}. Response code: ${resp.status}`);
          }
          data = await resp.arrayBuffer();

        // langPath is a local file, read .traineddata from local filesystem
        // (adapter.readCache is a generic file read function in Node.js version)
        } else {
          data = await adapter.readCache(`${langPath}/${lang}.traineddata${gzip ? '.gz' : ''}`);
        }
      } else {
        data = _lang.data; // eslint-disable-line
      }
    }

    data = new Uint8Array(data);

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
          res.reject(err.toString());
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

    return Promise.resolve(data);
  };

  res.progress({ workerId, status: 'loading language traineddata', progress: 0 });
  try {
    await Promise.all((typeof langs === 'string' ? langs.split('+') : langs).map(loadAndGunzipFile));
    res.progress({ workerId, status: 'loaded language traineddata', progress: 1 });
    res.resolve(langs);
  } catch (err) {
    res.reject(err.toString());
  }
};

const setParameters = async ({ payload: { params: _params } }, res) => {
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

  try {
    res.progress({
      workerId, status: 'initializing api', progress: 0,
    });
    if (api !== null) {
      api.End();
    }
    let configFile;
    let configStr;
    // config argument may either be config file text, or object with key/value pairs
    // In the latter case we convert to config file text here
    if (typeof config === 'object') {
      configStr = JSON.stringify(config).replace(/,/g, '\n').replace(/:/g, ' ').replace(/["'{}]/g, '');
    } else {
      configStr = config;
    }
    if (typeof configStr === 'string') {
      configFile = '/config';
      TessModule.FS.writeFile(configFile, configStr);
    }

    api = new TessModule.TessBaseAPI();
    const status = api.Init(null, langs, oem);
    if (status === -1) {
      // Cache is deleted if initialization fails to avoid keeping bad data in cache
      // This assumes that initialization failing only occurs due to bad .traineddata,
      // this should be refined if other reasons for init failing are encountered.
      if (['write', 'refresh', undefined].includes(cacheMethodWorker)) {
        const langsArr = langs.split('+');
        const delCachePromise = langsArr.map((lang) => adapter.deleteCache(`${cachePathWorker || '.'}/${lang}.traineddata`));
        await Promise.all(delCachePromise);
      }
      res.reject('initialization failed');
    }
    params = defaultParams;
    await setParameters({ payload: { params } });
    res.progress({
      workerId, status: 'initialized api', progress: 1,
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

  const nonRecOutputs = ['imageColor', 'imageGrey', 'imageBinary', 'layoutBlocks'];
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
