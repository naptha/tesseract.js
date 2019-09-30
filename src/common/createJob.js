const { sendPacket } = require('../node');

let jobCounter = 0;

module.exports = (
  action,
  payload,
) => {
  jobCounter += 1;
  const id = `Job-${jobCounter}-${Math.random().toString(16).slice(3, 8)}`;

  const start = (worker) => {
    console.log(`[${worker.id}]: Start ${id}, action=${action}`);
    sendPacket(worker, {
      workerId: worker.id,
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
