import { SIMPLE_TEXT, TIMEOUT, OPTIONS } from './constants.mjs';

describe('FS', () => {
  let worker;
  before(async function cb() {
    this.timeout(0);
    worker = await Tesseract.createWorker('eng', 1, OPTIONS);
  });

  it('should write and read text from FS (using FS only)', async () => {
    const path = 'tmp.txt';
    await worker.FS('writeFile', [path, SIMPLE_TEXT]);
    const { data } = await worker.FS('readFile', [path, { encoding: 'utf8' }]);
    await worker.FS('unlink', [path]);
    expect(data.toString()).to.be(SIMPLE_TEXT);
  }).timeout(TIMEOUT);

  it('should write and read text from FS (using writeFile, readFile)', async () => {
    const path = 'tmp2.txt';
    await worker.writeText(path, SIMPLE_TEXT);
    const { data } = await worker.readText(path);
    await worker.removeFile(path);
    expect(data.toString()).to.be(SIMPLE_TEXT);
  }).timeout(TIMEOUT);
});
