const OEM = require('./OEM');

module.exports = {
  // If `oem = OEM.LSTM_ONLY` (the default) only the code and langdata for LSTM is loaded.
  // This significantly decreases network and memory use for LSTM-only users (the vast majority),
  // and has no impact on Legacy-only users.
  // For the small number of users that use both models, this increases network and memory use
  // (as two sets of code and language data end up being downloaded).
  // For these users, `oemLang` and `oemCore` should be set to `OEM.TESSERACT_LSTM_COMBINED`,
  // which forces download of language data and core code (respectively) that support both models.
  oemLang: OEM.DEFAULT,
  oemCore: OEM.DEFAULT,

  /*
   * default path for downloading *.traineddata
   */
  langPath: 'https://tessdata.projectnaptha.com/4.0.0',
  /*
   * Use BlobURL for worker script by default
   * TODO: remove this option
   *
   */
  workerBlobURL: true,
  logger: () => {},
};
