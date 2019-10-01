module.exports = () => {
  const workers = {};
  const runningWorkers = {};
  let jobQueue = [];

  const dequeue = () => {
    if (jobQueue.length !== 0) {
      const wIds = Object.keys(workers);
      for (let i = 0; i < wIds.length; i += 1) {
        if (typeof runningWorkers[wIds[i]] === 'undefined') {
          jobQueue[0](workers[wIds[i]]);
          break;
        }
      }
    }
  };

  const queue = (action, payload) => (
    new Promise((resolve, reject) => {
      jobQueue.push(async (w) => {
        jobQueue.shift();
        runningWorkers[w.id] = true;
        try {
          resolve(await w[action].apply(this, payload));
        } catch (err) {
          reject(err);
        } finally {
          delete runningWorkers[w.id];
          dequeue();
        }
      });
      dequeue();
    })
  );

  const addWorker = (w) => {
    workers[w.id] = w;
    return w.id;
  };

  const addJob = (action, ...payload) => (
    queue(action, payload)
  );

  const terminate = async () => {
    Object.keys(workers).forEach(async (id) => {
      await workers[id].terminate();
    });
    jobQueue = [];
  };

  return {
    addWorker,
    addJob,
    terminate,
  };
};
