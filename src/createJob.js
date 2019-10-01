const { send } = require('./worker/node');

let jobCounter = 0;

module.exports = (
  action,
  payload,
) => {
  jobCounter += 1;
  const id = `Job-${jobCounter}-${Math.random().toString(16).slice(3, 8)}`;

  const start = (w) => {
    console.log(`[${w.id}]: Start ${id}, action=${action}`);
    send(w.worker, {
      workerId: w.id,
      jobId: id,
      action,
      payload,
    });
  };

  return {
    id,
    action,
    start,
  };
};
