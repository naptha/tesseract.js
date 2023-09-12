const util = require('node:util');
const fs = require('node:fs');

module.exports = {
  readCache: util.promisify(fs.readFile),
  writeCache: util.promisify(fs.writeFile),
  deleteCache: (path) => (
    util.promisify(fs.unlink)(path)
      .catch(() => {})
  ),
  checkCache: (path) => (
    util.promisify(fs.access)(path, fs.F_OK)
      .then((err) => (err === null))
      .catch(() => false)
  ),
};
