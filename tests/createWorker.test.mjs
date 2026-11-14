import { execFile } from 'child_process';
import path from 'path';
import { IS_BROWSER } from './constants.mjs';

// Runs `createWorker` in a separate Node process so we can check that a failed
// initialization rejects *and* lets the process exit (i.e. the worker is terminated).
const runChild = (code) => new Promise((resolve) => {
  execFile(process.execPath, ['-e', code], { timeout: 20000 }, (error, stdout, stderr) => {
    resolve({ timedOut: !!(error && error.killed), stdout, stderr });
  });
});

const SRC = JSON.stringify(path.resolve('src/index.js'));

(IS_BROWSER ? describe.skip : describe)('createWorker initialization errors', () => {
  it('rejects and terminates the worker when the core fails to load', async () => {
    const workerPath = JSON.stringify(path.resolve('tests/assets/workers/failing-core.js'));
    const { timedOut, stdout } = await runChild(`
      const { createWorker } = require(${SRC});
      createWorker('eng', 1, { workerPath: ${workerPath}, errorHandler: () => {} })
        .then(() => console.log('resolved'), () => console.log('rejected'));
    `);
    expect(stdout.trim()).to.be('rejected');
    expect(timedOut).to.be(false);
  }).timeout(30000);

  it('rejects and terminates the worker when language data fails to load', async () => {
    const langPath = JSON.stringify(path.resolve('tests/assets/does-not-exist'));
    const { timedOut, stdout } = await runChild(`
      const { createWorker } = require(${SRC});
      createWorker('nolang', 1, {
        langPath: ${langPath}, cacheMethod: 'none', gzip: false, errorHandler: () => {},
      }).then(() => console.log('resolved'), () => console.log('rejected'));
    `);
    expect(stdout.trim()).to.be('rejected');
    expect(timedOut).to.be(false);
  }).timeout(30000);
});
