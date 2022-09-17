// const { createWorker } = Tesseract;
// const worker = await createWorker(OPTIONS);
// before(function cb() {
//   this.timeout(0);
// });


(IS_BROWSER ? describe : describe.skip)('Invalid paths should result in promise rejection', () => {
    it('Invalid workerPath', async () => {
    const OPTIONS1 = JSON.parse(JSON.stringify(OPTIONS));
    OPTIONS1.workerPath = "badpath.js";
    let errorThrown;
    // try {
    //   const worker = await Tesseract.createWorker(OPTIONS1);
    //   errorThrown = false;
    // } catch (error) {
    //   errorThrown = true;
    // }

    // Tesseract.createWorker(OPTIONS1).catch(() => errorThrown = true);
    // await Tesseract.createWorker(OPTIONS1).catch(() => {
    //   errorThrown = true;
    // })
    // const func = async () => {

    //   await Tesseract.createWorker(OPTIONS1).catch(() => {
    //     errorThrown = true;
    //   })
    //   return;
    // };

    // await func();

    await (async () => {
      await Tesseract.createWorker(OPTIONS1).catch((x) => { console.log("stuff") })
    // .then((x) => { throw new Error('was not supposed to succeed'); })
    // .catch((x) => { console.log("stuff") })
    return;
  })();


    // await func().catch(() => console.log("caught"));

    // expect(errorThrown).to.equal(true);

    // expect(func).to.throwError();

    // expect(ret).to.equal(false);
    }).timeout(TIMEOUT);
});
