const { createWorker } = Tesseract;
let worker;
before(async function cb() {
  this.timeout(0);
  worker = await createWorker(OPTIONS);
});

describe('detect()', async () => {
  it('should detect OSD', () => {
    [
      { name: 'cosmic.png', ans: { script: 'Latin' } },
    ].forEach(async ({ name, ans: { script } }) => {
      await worker.loadLanguage('osd');
      await worker.initialize('osd');
      const { data: { script: s } } = await worker.detect(`${IMAGE_PATH}/${name}`);
      expect(s).to.be(script);
    });
  }).timeout(TIMEOUT);
});


describe('detect()', async () => {
  it('should detect OSD (simplified interface)', () => {
    [
      { name: 'cosmic.png', ans: { script: 'Latin' } },
    ].forEach(async ({ name, ans: { script } }) => {
      const { data: { script: s } } = await Tesseract.detect(`${IMAGE_PATH}/${name}`, undefined, OPTIONS);
      expect(s).to.be(script);
    });
  }).timeout(TIMEOUT);
});
