module.exports = () => {
  const workers = {};
  const runningJobs = {};
  let jobQueue = [];

  const dequeue = () => {
    if (jobQueue.length !== 0) {
      const wIds = Object.keys(workers);
      for (let i = 0; i < wIds.length; i += 1) {
        if (typeof runningJobs[wIds[i]] === 'undefined') {
          jobQueue[0](workers[wIds[i]]);
          break;
        }
      }
    }
  };

  const queue = job => (
    new Promise((resolve, reject) => {
      jobQueue.push((w) => {
        const { action } = job;
        jobQueue.shift();
        w.setResolve(action, (data) => {
          delete runningJobs[w.id];
          dequeue();
          resolve(data);
        });
        w.setReject(action, reject);
        runningJobs[w.id] = job;
        job.start(w);
      });
      dequeue();
    })
  );

  const addWorker = (w) => {
    workers[w.id] = w;
    return w.id;
  };

  const addJob = job => (
    queue(job)
  );

  const terminate = () => {
    Object.keys(workers).forEach((id) => {
      workers[id].terminate();
    });
    jobQueue = [];
  };

  return {
    addWorker,
    addJob,
    terminate,
  };
};
