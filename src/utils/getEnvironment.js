module.exports = (key) => {
  const env = {
    type: (typeof window !== 'undefined') && (typeof window.document !== 'undefined') ? 'browser' : 'node',
  };

  if (typeof key === 'undefined') {
    return env;
  }
  return env[key];
};
