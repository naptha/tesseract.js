const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

describe('scheduler termination', () => {
  it('waits for every worker to terminate', async () => {
    let terminated = false;
    const scheduler = Tesseract.createScheduler();
    scheduler.addWorker({
      id: 'worker-1',
      terminate: async () => {
        await delay(20);
        terminated = true;
      },
    });

    const termination = scheduler.terminate();
    await Promise.resolve();
    expect(terminated).to.be(false);
    await termination;
    expect(terminated).to.be(true);
  });

  it('rejects jobs that are still queued when terminated', async () => {
    let resolveRunningJob;
    const scheduler = Tesseract.createScheduler();
    scheduler.addWorker({
      id: 'worker-1',
      recognize: () => new Promise((resolve) => {
        resolveRunningJob = resolve;
      }),
      terminate: async () => {},
    });

    const runningJob = scheduler.addJob('recognize', 'first');
    const queuedJob = scheduler.addJob('recognize', 'second');
    const queuedJobResult = queuedJob.then(() => null, (err) => err);
    await Promise.resolve();
    await scheduler.terminate();

    const queuedJobError = await queuedJobResult;
    expect(queuedJobError.message).to.match(/Scheduler terminated$/);

    resolveRunningJob('done');
    await runningJob;
  });
});
