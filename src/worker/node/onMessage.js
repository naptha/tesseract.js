'use strict';

module.exports = (worker, handler) => {
  worker.on('message', handler);
};
