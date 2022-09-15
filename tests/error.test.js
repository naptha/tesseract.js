// const { createWorker } = Tesseract;
// const worker = createWorker(OPTIONS);
// before(function cb() {
//   this.timeout(0);
//   return worker.load();
// });


(IS_BROWSER ? describe : describe.skip)('Invalid paths should result in promise rejection', () => {
    it('Invalid workerPath', async () => {
    const OPTIONS1 = JSON.parse(JSON.stringify(OPTIONS));
    OPTIONS1.corePath = "badpath.js";
    let errorThrown;
    try {
      const worker = Tesseract.createWorker(OPTIONS1);
      await worker.load()
      errorThrown = false;
    } catch (error) {
      errorThrown = true;
    }

    expect(errorThrown).to.equal(true);

    // expect(func).to.throwError();

    // const ret = await (worker.load().then(() => true).catch(() => false));
    // expect(ret).to.equal(false);
    }).timeout(TIMEOUT);
});
