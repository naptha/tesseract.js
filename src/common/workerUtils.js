/**
 *
 * Worker utilities for browser and node
 *
 * @fileoverview Worker utilities for browser and node
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
const { readImage, loadLang } = require('tesseract.js-utils');
const pdfTTF = require('./pdf-ttf');
const dump = require('./dump');
const { defaultParams } = require('./options');
const { OEM, PSM } = require('./types');

/*
 * Tesseract Module returned by TesseractCore.
 */
let TessModule;
/*
 * TessearctBaseAPI instance
 */
let api;
let latestJob;
let adapter = {};

/**
 * setImage
 *
 * @name setImage
 * @function set image in tesseract for recognition
 * @access public
 * @param {array} image - binary array in array format
 * @returns {number} - an emscripten pointer of the image
 */
const setImage = (image, params) => {
  const {
    tessjs_image_rectangle_left: left,
    tessjs_image_rectangle_top: top,
    tessjs_image_rectangle_width: width,
    tessjs_image_rectangle_height: height,
  } = params;
  const {
    w, h, bytesPerPixel, data, pix,
  } = readImage(TessModule, Array.from(image));

  /*
   * As some image format (ex. bmp) is not supported natiely by tesseract,
   * sometimes it will not return pix directly, but data and bytesPerPixel
   * for another SetImage usage.
   *
   */
  if (data === null) {
    api.SetImage(pix);
  } else {
    api.SetImage(data, w, h, bytesPerPixel, w * bytesPerPixel);
  }
  api.SetRectangle(
    (left < 0) ? 0 : left,
    (top < 0) ? 0 : top,
    (width < 0) ? w : width,
    (height < 0) ? h : height,
  );
  return data === null ? pix : data;
};

const getLangsStr = langs => (
  typeof langs === 'string'
    ? langs
    : langs.map(lang => (typeof lang === 'string' ? lang : lang.data)).join('+')
);

/**
 * handleParams
 *
 * @name handleParams
 * @function hanlde params from users
 * @access private
 * @param {string} langs - lang string for Init()
 * @param {object} customParams - an object of params
 */
const handleParams = (langs, iParams) => {
  const {
    tessedit_ocr_engine_mode,
    ...params
  } = iParams;
  api.Init(null, getLangsStr(langs), tessedit_ocr_engine_mode);
  Object.keys(params).forEach((key) => {
    if (!key.startsWith('tessjs')) {
      api.SetVariable(key, params[key]);
    }
  });
};

/**
 * handleOutput
 *
 * @name handleOutput
 * @function handle file output
 * @access private
 * @param {object} customParams - an object of params
 */
const handleOutput = (customParams) => {
  let files = {};
  const {
    tessjs_create_pdf,
    tessjs_textonly_pdf,
    tessjs_pdf_name,
    tessjs_pdf_title,
    tessjs_pdf_auto_download,
    tessjs_pdf_bin,
  } = {
    ...defaultParams,
    ...customParams,
  };

  if (tessjs_create_pdf === '1') {
    const pdfRenderer = new TessModule.TessPDFRenderer(tessjs_pdf_name, '/', tessjs_textonly_pdf === '1');
    pdfRenderer.BeginDocument(tessjs_pdf_title);
    pdfRenderer.AddImage(api);
    pdfRenderer.EndDocument();
    TessModule._free(pdfRenderer);

    const data = TessModule.FS.readFile(`/${tessjs_pdf_name}.pdf`);

    if (tessjs_pdf_bin) {
      files = { pdf: data, ...files };
    }

    if (tessjs_pdf_auto_download) {
      adapter.writeFile(`${tessjs_pdf_name}.pdf`, data, 'application/pdf');
    }
  }

  return files;
};

/**
 * handleInit
 *
 * @name handleInit
 * @function handle initialization of TessModule
 * @access public
 * @param {object} req - job payload
 * @param {string} req.corePath - path to the tesseract-core.js
 * @param {object} res - job instance
 * @returns {Promise} A Promise for callback
 */
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
        TessModule.FS.writeFile('/pdf.ttf', adapter.b64toU8Array(pdfTTF));
        api = new TessModule.TessBaseAPI();
        res.progress({ status: 'initialized tesseract', progress: 1 });
      });
  }

  return Promise.resolve();
};

/**
 * loadLanguage
 *
 * @name loadLanguage
 * @function load language from remote or local cache
 * @access public
 * @param {object} req - job payload
 * @param {string} req.langs - languages to load, ex: eng, eng+chi_tra
 * @param {object} req.options - other options for loadLang function
 * @param {object} res - job instance
 * @returns {Promise} A Promise for callback
 */
const loadLanguage = ({ langs, options }, res) => {
  res.progress({ status: 'loading language traineddata', progress: 0 });
  return loadLang({ langs, TessModule, ...options }).then((...args) => {
    res.progress({ status: 'loaded language traineddata', progress: 1 });
    return args;
  });
};

/**
 * handleRecognize
 *
 * @name handleRecognize
 * @function handle recognition job
 * @access public
 * @param {object} req - job payload
 * @param {array} req.image - binary image in array format
 * @param {string} req.langs - languages to load, ex: eng, eng+chi_tra
 * @param {object} req.options - other options for loadLang function
 * @param {object} req.params - parameters for tesseract
 * @param {object} res - job instance
 */
const handleRecognize = ({
  image, langs: iLangs, options, params: customParams,
}, res) => {
  const params = {
    ...defaultParams,
    ...customParams,
  };
  const { tessedit_pageseg_mode } = params;
  let langs = iLangs;

  /*
   * When PSM === OSD_ONLY or AUTO_OSD or RAW_LINE
   * osd.traineddata must be included and
   * OEM must be TESSERACT_ONLY (LSTM doesn't support OSD)
   */
  if ([
    PSM.OSD_ONLY,
    PSM.AUTO_OSD,
    PSM.RAW_LINE,
  ].includes(tessedit_pageseg_mode)) {
    langs = (typeof iLangs === 'string')
      ? `${iLangs}+osd`
      : [...iLangs, 'osd'];
    params.tessedit_ocr_engine_mode = OEM.TESSERACT_ONLY;
  }
  return handleInit(options, res)
    .then(() => (
      loadLanguage({ langs, params, options }, res)
        .catch((e) => {
          if (e instanceof DOMException) {
            /*
             * For some reason google chrome throw DOMException in loadLang,
             * while other browser is OK, for now we ignore this exception
             * and hopefully to find the root cause one day.
             */
          } else {
            throw e;
          }
        })
        .then(() => {
          try {
            const progressUpdate = (progress) => {
              res.progress({ status: 'initializing api', progress });
            };
            progressUpdate(0);
            handleParams(langs, params);
            progressUpdate(0.5);
            const ptr = setImage(image, params);
            progressUpdate(1);
            api.Recognize(null);
            const files = handleOutput(params);
            const result = dump(TessModule, api, params);
            api.End();
            TessModule._free(ptr);
            res.resolve({ files, ...result });
          } catch (err) {
            res.reject({ err });
          }
        })
    ));
};

/**
 * handleDetect
 *
 * @name handleDetect
 * @function handle detect (Orientation and Script Detection / OSD) job
 * @access public
 * @param {object} req - job payload
 * @param {array} req.image - binary image in array format
 * @param {string} req.langs - languages to load, ex: eng, eng+chi_tra
 * @param {object} req.options - other options for loadLang function
 * @param {object} res - job instance
 */
const handleDetect = ({
  image, langs, options, params: customParams,
}, res) => (
  handleInit(options, res)
    .then(() => (
      loadLanguage({ langs, options }, res)
        .then(() => {
          api.Init(null, getLangsStr(langs), OEM.TESSERACT_ONLY);
          api.SetPageSegMode(PSM.OSD_ONLY);
          const params = {
            ...defaultParams,
            ...customParams,
          };

          const ptr = setImage(image, params);
          const results = new TessModule.OSResults();

          if (!api.DetectOS(results)) {
            api.End();
            TessModule._free(ptr);
            res.reject('Failed to detect OS');
          } else {
            const best = results.best_result;
            const oid = best.orientation_id;
            const sid = best.script_id;

            api.End();
            TessModule._free(ptr);

            res.resolve({
              tesseract_script_id: sid,
              script: results.unicharset.get_script_from_script_id(sid),
              script_confidence: best.sconfidence,
              orientation_degrees: [0, 270, 180, 90][oid],
              orientation_confidence: best.oconfidence,
            });
          }
        })
    ))
);

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
exports.dispatchHandlers = ({ jobId, action, payload }, send) => {
  const res = (status, data) => {
    send({
      jobId,
      status,
      action,
      data,
    });
  };
  res.resolve = res.bind(this, 'resolve');
  res.reject = res.bind(this, 'reject');
  res.progress = res.bind(this, 'progress');

  latestJob = res;

  try {
    if (action === 'recognize') {
      handleRecognize(payload, res);
    } else if (action === 'detect') {
      handleDetect(payload, res);
    }
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
 * @param {object} impl - implementation of the worker, different in browser and node environment
 */
exports.setAdapter = (impl) => {
  adapter = impl;
};
