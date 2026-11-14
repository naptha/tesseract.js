import { execFile } from 'child_process';
import path from 'path';
import { IS_BROWSER } from './constants.mjs';

// Runs code in a separate Node process, so an uncaught exception there
// shows up as a non-zero exit code instead of crashing the test runner.
const runChild = (code) => new Promise((resolve) => {
  execFile(process.execPath, ['-e', code], { timeout: 60000 }, (error, stdout) => {
    resolve({ exitCode: error ? error.code : 0, stdout });
  });
});

const SRC = JSON.stringify(path.resolve('src/index.js'));
const CACHE_PATH = JSON.stringify(path.resolve('tests/assets/traineddata'));

(IS_BROWSER ? describe.skip : describe)('job errors without an errorHandler', () => {
  it('rejects a failed recognize job without crashing the process', async () => {
    const { exitCode, stdout } = await runChild(`
      const { createWorker } = require(${SRC});
      (async () => {
        const worker = await createWorker('eng', 1, { cachePath: ${CACHE_PATH} });
        try {
          await worker.recognize(Buffer.from('this is not an image'));
          console.log('resolved');
        } catch (e) {
          console.log('rejected');
        }
        await worker.terminate();
      })();
    `);
    expect(stdout.trim()).to.be('rejected');
    expect(exitCode).to.be(0);
  }).timeout(90000);

  it('still calls errorHandler when one is provided', async () => {
    const { exitCode, stdout } = await runChild(`
      const { createWorker } = require(${SRC});
      (async () => {
        const worker = await createWorker('eng', 1, {
          cachePath: ${CACHE_PATH},
          errorHandler: () => console.log('errorHandler called'),
        });
        await worker.recognize(Buffer.from('this is not an image')).catch(() => console.log('rejected'));
        await worker.terminate();
      })();
    `);
    expect(stdout).to.contain('errorHandler called');
    expect(stdout).to.contain('rejected');
    expect(exitCode).to.be(0);
  }).timeout(90000);
});
