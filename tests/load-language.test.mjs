import path from 'path';
import { OPTIONS, TIMEOUT, SIMPLE_TEXT, IMAGE_PATH } from './constants.mjs';

const dataOptions = {
  ...OPTIONS,
  cachePath: path.resolve('tests/assets/traineddata'),
  cacheMethod: 'readOnly',
  dataPath: '.',
  gzip: false,
};

describe('loadLanguage dataPath', () => {
  it('loads two languages into the same data directory', async () => {
    const worker = await Tesseract.createWorker('eng+chi_tra', 1, dataOptions);
    const { data: { text } } = await worker.recognize(`${IMAGE_PATH}/simple.png`);
    expect(text).to.be(SIMPLE_TEXT);
    await worker.terminate();
  }).timeout(TIMEOUT);

  it('loads again when that directory already exists', async () => {
    const worker = await Tesseract.createWorker('eng', 1, dataOptions);
    await worker.reinitialize('eng+chi_tra');
    const { data: { text } } = await worker.recognize(`${IMAGE_PATH}/simple.png`);
    expect(text).to.be(SIMPLE_TEXT);
    await worker.terminate();
  }).timeout(TIMEOUT);

  it('reports a data directory that cannot be created', async () => {
    let rejected = null;
    const workerPromise = Tesseract.createWorker('eng', 1, {
      ...dataOptions,
      dataPath: 'missing-parent/tessdata',
      errorHandler: (err) => {
        rejected = err;
      },
    });
    const started = Date.now();
    while (rejected === null && Date.now() - started < TIMEOUT) {
      // createWorker stays pending after a failed loadLanguage
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => { setTimeout(resolve, 50); });
    }
    let resolved = false;
    workerPromise.then(() => {
      resolved = true;
    });
    expect(rejected).to.not.be(null);
    expect(resolved).to.be(false);
  }).timeout(TIMEOUT);
});
