module.exports = (worker, handler) => {
  worker.on('message', handler);
};
