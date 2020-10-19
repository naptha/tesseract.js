const isElectron = require('is-electron');

module.exports = (key) => {
  const env = {};

  if (typeof WorkerGlobalScope !== 'undefined') {
    env.type = 'webworker';
  } else if (typeof window === 'object') {
    env.type = 'browser';
  } else if (isElectron()) {
    env.type = 'electron';
  } else if (typeof process === 'object' && typeof require === 'function') {
    env.type = 'node';
  }

  if (typeof key === 'undefined') {
    return env;
  }

  return env[key];
};
