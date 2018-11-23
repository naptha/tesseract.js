const { readImage, loadLang } = require('tesseract.js-utils');
const dump = require('./dump');

let TessModule;
let api;
let latestJob;
let adapter = {};

const setImage = (image) => {
  const {
    w, h, bytesPerPixel, data, pix,
  } = readImage(TessModule, Array.from(image));

  if (data === null) {
    api.SetImage(pix);
  } else {
    api.SetImage(data, w, h, bytesPerPixel, w * bytesPerPixel);
  }
  api.SetRectangle(0, 0, w, h);
  return data;
};

const handleInit = ({ corePath }, res) => {
  if (!TessModule) {
    const Core = adapter.getCore(corePath, res);

    res.progress({ status: 'initializing tesseract', progress: 0 });

    return Core({
      TesseractProgress(percent) {
        latestJob.progress({ status: 'recognizing text', progress: Math.max(0, (percent - 30) / 70) });
      },
    })
      .then((tessModule) => {
        TessModule = tessModule;
        api = new TessModule.TessBaseAPI();
        res.progress({ status: 'initialized tesseract', progress: 1 });
      });
  }

  return Promise.resolve();
};

const loadLanguage = ({
  lang,
  options: {
    langPath, cachePath, cacheMethod, dataPath,
  },
}, res) => {
  res.progress({ status: 'loading language traineddata', progress: 0 });
  return loadLang({
    langs: lang,
    tessModule: TessModule,
    langURI: langPath,
    cachePath,
    cacheMethod,
    dataPath,
  }).then((...args) => {
    res.progress({ status: 'loaded language traineddata', progress: 1 });
    return args;
  });
};

const handleRecognize = ({
  image, lang, options, params,
}, res) => (
  handleInit(options, res)
    .then(() => (
      loadLanguage({ lang, options }, res)
        .then(() => {
          const progressUpdate = (progress) => {
            res.progress({ status: 'initializing api', progress });
          };
          progressUpdate(0);
          api.Init(null, lang);
          progressUpdate(0.3);
          Object.keys(params).forEach((key) => {
            api.SetVariable(key, params[key]);
          });
          progressUpdate(0.6);
          const ptr = setImage(image);
          progressUpdate(1);
          api.Recognize(null);
          const result = dump(TessModule, api);
          api.End();
          TessModule._free(ptr);
          res.resolve(result);
        })
    ))
);


const handleDetect = ({
  image, lang, options,
}, res) => (
  handleInit(options, res)
    .then(() => (
      loadLanguage({ lang, options }, res)
        .then(() => {
          api.Init(null, lang);
          api.SetPageSegMode(TessModule.PSM_OSD_ONLY);

          const ptr = setImage(image);
          const results = new TessModule.OSResults();

          if (!api.DetectOS(results)) {
            api.End();
            TessModule._free(ptr);
            res.reject('Failed to detect OS');
          } else {
            const best = results.get_best_result();
            const oid = best.get_orientation_id();
            const sid = best.get_script_id();

            api.End();
            TessModule._free(ptr);

            res.resolve({
              tesseract_script_id: sid,
              script: results.get_unicharset().get_script_from_script_id(sid),
              script_confidence: best.get_sconfidence(),
              orientation_degrees: [0, 270, 180, 90][oid],
              orientation_confidence: best.get_oconfidence(),
            });
          }
        })
    ))
);

exports.dispatchHandlers = ({ jobId, action, payload }, send) => {
  const respond = (status, data) => {
    send({
      jobId,
      status,
      action,
      data,
    });
  };
  respond.resolve = respond.bind(this, 'resolve');
  respond.reject = respond.bind(this, 'reject');
  respond.progress = respond.bind(this, 'progress');

  latestJob = respond;

  try {
    if (action === 'recognize') {
      handleRecognize(payload, respond);
    } else if (action === 'detect') {
      handleDetect(payload, respond);
    }
  } catch (err) {
    /** Prepare exception to travel through postMessage */
    respond.reject(err.toString());
  }
};

exports.setAdapter = (impl) => {
  adapter = impl;
};
