const { createScheduler, createWorker } = Tesseract;
const scheduler = createScheduler();
const worker = createWorker(OPTIONS);
scheduler.addWorker(worker);
before(function cb() {
  this.timeout(0);
  return worker.load();
});

describe('detect()', async () => {
  it('should detect OSD', () => {
    [
      { name: 'cosmic.png', ans: { script: 'Latin' } },
    ].forEach(async ({ name, ans: { script } }) => {
      await worker.loadLanguage('osd');
      await worker.initialize('osd');
      const { data: { script: s } } = await scheduler.addJob('detect', `${IMAGE_PATH}/${name}`);
      expect(s).to.be(script);
    });
  }).timeout(TIMEOUT);
});
