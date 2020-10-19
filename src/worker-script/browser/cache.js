const { set, get, del } = require('idb-keyval');

module.exports = {
  readCache: get,
  writeCache: set,
  deleteCache: del,
  checkCache: (path) => (
    get(path).then((v) => typeof v !== 'undefined')
  ),
};
