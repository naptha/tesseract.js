const { createWorker } = Tesseract;
const FS_WAIT = 500;
let worker;
before(async function cb() {
  this.timeout(0);
  worker = await createWorker(OPTIONS);
});

describe('FS', async () => {
  it('should write and read text from FS (using FS only)', () => {
    [
      SIMPLE_TEXT,
    ].forEach(async (text) => {
      const path = 'tmp.txt';
      await worker.FS('writeFile', [path, SIMPLE_TEXT]);
      setTimeout(async () => {
        const { data } = await worker.FS('readFile', [path]);
        await worker.FS('unlink', [path]);
        expect(data.toString()).to.be(text);
      }, FS_WAIT);
    });
  }).timeout(TIMEOUT);

  it('should write and read text from FS (using writeFile, readFile)', () => {
    [
      SIMPLE_TEXT,
    ].forEach(async (text) => {
      const path = 'tmp2.txt';
      await worker.writeText(path, SIMPLE_TEXT);
      setTimeout(async () => {
        const { data } = await worker.readText(path);
        await worker.removeFile(path);
        expect(data.toString()).to.be(text);
      }, FS_WAIT);
    });
  }).timeout(TIMEOUT);
});
