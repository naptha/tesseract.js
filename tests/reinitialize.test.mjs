import {
  IMAGE_PATH, OPTIONS, SIMPLE_TEXT, SIMPLE_TEXT_LEGACY, TIMEOUT,
} from './constants.mjs';

describe('reinitialize()', () => {
  let worker;

  before(async function cb() {
    this.timeout(TIMEOUT);
    worker = await Tesseract.createWorker('eng', Tesseract.OEM.LSTM_ONLY, {
      ...OPTIONS,
      legacyCore: true,
      legacyLang: true,
    });
  });

  after(async () => {
    if (worker) await worker.terminate();
  });

  it('switches from LSTM to Legacy when OEM is zero', async () => {
    await worker.reinitialize('eng', Tesseract.OEM.LSTM_ONLY);
    await worker.reinitialize('eng', Tesseract.OEM.TESSERACT_ONLY);
    const { data: { text } } = await worker.recognize(`${IMAGE_PATH}/simple.png`);
    expect(text).to.be(SIMPLE_TEXT_LEGACY);
  }).timeout(TIMEOUT);

  it('retains Legacy when OEM is omitted after selecting zero', async () => {
    await worker.reinitialize('eng', Tesseract.OEM.TESSERACT_ONLY);
    await worker.reinitialize('eng');
    const { data: { text } } = await worker.recognize(`${IMAGE_PATH}/simple.png`);
    expect(text).to.be(SIMPLE_TEXT_LEGACY);
  }).timeout(TIMEOUT);

  it('switches back to LSTM and retains it when OEM is omitted', async () => {
    await worker.reinitialize('eng', Tesseract.OEM.TESSERACT_ONLY);
    await worker.reinitialize('eng', Tesseract.OEM.LSTM_ONLY);
    await worker.reinitialize('eng');
    const { data: { text } } = await worker.recognize(`${IMAGE_PATH}/simple.png`);
    expect(text).to.be(SIMPLE_TEXT);
  }).timeout(TIMEOUT);
});
