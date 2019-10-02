const { createScheduler, createWorker } = Tesseract;

let workers = [];

before(async function cb() {
  this.timeout(0);
  const NUM_WORKERS = 10;
  console.log(`Initializing ${NUM_WORKERS} workers`);
  workers = await Promise.all(Array(NUM_WORKERS).fill(0).map(async () => {
    const w = createWorker(OPTIONS);
    await w.load();
    await w.loadLanguage('eng');
    await w.initialize('eng');
    return w;
  }));
  console.log(`Initialized ${NUM_WORKERS} workers`);
});

describe('scheduler', () => {
  describe('should speed up with more workers (running 20 jobs)', () => {
    Array(10).fill(0).forEach((_, num) => (
      it(`support using ${num + 1} workers`, async () => {
        const NUM_JOBS = 30;
        const scheduler = createScheduler();
        workers.slice(0, num + 1).forEach((w) => {
          scheduler.addWorker(w);
        });
        const rets = await Promise.all(Array(NUM_JOBS).fill(0).map((_, idx) => (
          scheduler.addJob('recognize', `${IMAGE_PATH}/${idx % 2 === 0 ? 'simple' : 'cosmic'}.png`)
        )));
        expect(rets.length).to.be(NUM_JOBS);
      }).timeout(60000)
    ));
  });
});
