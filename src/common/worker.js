const { readImage, loadLang } = require('tesseract.js-utils');
const dump = require('./dump');

let Module;
let base;
let latestJob;
let adapter = {};

const setImage = (image) => {
  const {
    w, h, bytesPerPixel, data, pix,
  } = readImage(Module, Array.from(image));

  if (data === null) {
    base.SetImage(pix);
  } else {
    base.SetImage(data, w, h, bytesPerPixel, w * bytesPerPixel);
  }
  base.SetRectangle(0, 0, w, h);
  return data;
};

const handleInit = (req, res) => {
  if (!Module) {
    const Core = adapter.getCore(req, res);

    res.progress({ status: 'initializing tesseract', progress: 0 });

    return Core({
      TesseractProgress(percent) {
        latestJob.progress({ status: 'recognizing text', progress: Math.max(0, (percent - 30) / 70) });
      },
    })
      .then((TessModule) => {
        Module = TessModule;
        base = new Module.TessBaseAPI();
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
}) => (
  loadLang({
    langs: lang,
    tessModule: Module,
    langURI: langPath,
    cachePath,
    cacheMethod,
    dataPath,
  })
);

const handleRecognize = (req, res) => (
  handleInit(req, res)
    .then(() => (
      loadLanguage(req)
        .then(() => {
          const { image, lang, params } = req;
          const progressUpdate = (progress) => {
            res.progress({ status: 'initializing api', progress });
          };
          progressUpdate(0);
          base.Init(null, lang);
          progressUpdate(0.3);
          Object.keys(params).forEach((key) => {
            base.SetVariable(key, params[key]);
          });
          progressUpdate(0.6);
          const ptr = setImage(image);
          progressUpdate(1);
          base.Recognize(null);
          const result = dump(Module, base);
          base.End();
          Module._free(ptr);
          res.resolve(result);
        })
    ))
);


const handleDetect = (req, res) => (
  handleInit(req, res)
    .then(() => (
      loadLanguage(req)
        .then(() => {
          const { image, lang } = req;
          base.Init(null, lang);
          base.SetPageSegMode(Module.PSM_OSD_ONLY);

          const ptr = setImage(image);
          const results = new Module.OSResults();

          if (!base.DetectOS(results)) {
            base.End();
            Module._free(ptr);
            res.reject('Failed to detect OS');
          } else {
            const best = results.get_best_result();
            const oid = best.get_orientation_id();
            const sid = best.get_script_id();

            base.End();
            Module._free(ptr);

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

exports.dispatchHandlers = (packet, send) => {
  const respond = (status, data) => {
    send({
      jobId: packet.jobId,
      status,
      action: packet.action,
      data,
    });
  };
  respond.resolve = respond.bind(this, 'resolve');
  respond.reject = respond.bind(this, 'reject');
  respond.progress = respond.bind(this, 'progress');

  latestJob = respond;

  try {
    if (packet.action === 'recognize') {
      handleRecognize(packet.payload, respond);
    } else if (packet.action === 'detect') {
      handleDetect(packet.payload, respond);
    }
  } catch (err) {
    // Prepare exception to travel through postMessage
    respond.reject(err.toString());
  }
};

exports.setAdapter = (impl) => {
  adapter = impl;
};
