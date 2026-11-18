import { IS_BROWSER, IMAGE_PATH, TIMEOUT } from './constants.mjs';

(IS_BROWSER ? describe.skip : describe)('setImage() (Node.js only)', () => {
  let setImage;
  let bmp;
  let spawnSync;
  let assert;

  before(async () => {
    const { createRequire } = await import('node:module');
    const require = createRequire(import.meta.url);
    setImage = require('../src/worker-script/utils/setImage.js');
    bmp = require('bmp-js');
    ({ spawnSync } = await import('node:child_process'));
    ({ default: assert } = await import('node:assert/strict'));
  });

  ['Buffer', 'Uint8Array subarray'].forEach((kind) => {
    it(`should decode a BMP from a ${kind}`, () => {
      const source = fs.readFileSync(`${IMAGE_PATH}/simple.bmp`);
      const expected = bmp.encode(bmp.decode(source)).data;
      let image = source;
      if (kind === 'Uint8Array subarray') {
        const padded = new Uint8Array(source.length + 32);
        padded.set(source, 16);
        image = padded.subarray(16, 16 + source.length);
      }

      let written;
      const TessModule = {
        FS: {
          writeFile: (path, data) => {
            assert.strictEqual(path, '/input');
            written = data;
          },
        },
      };
      const api = {
        SetImageFile: (exif, angle) => {
          assert.strictEqual(exif, 1);
          assert.strictEqual(angle, 0);
          return 0;
        },
      };

      setImage(TessModule, api, image);
      assert.deepStrictEqual(written, expected);
    });
  });

  it('should decode a 1.5 MiB BMP within a 64 MiB JavaScript heap', () => {
    const script = `
      const assert = require('node:assert/strict');
      const bmp = require('bmp-js');
      const setImage = require('./src/worker-script/utils/setImage.js');
      const image = bmp.encode({
        width: 1024,
        height: 512,
        data: Buffer.alloc(1024 * 512 * 4, 255),
      }).data;
      let written;
      setImage({ FS: { writeFile: (path, data) => { written = data; } } },
        { SetImageFile: () => 0 }, new Uint8Array(image));
      assert.deepStrictEqual(written, image);
    `;
    const result = spawnSync(process.execPath, ['--max-old-space-size=64', '-e', script], {
      encoding: 'utf8',
      timeout: 15000,
    });
    assert.ifError(result.error);
    assert.strictEqual(result.status, 0, result.stderr);
  }).timeout(TIMEOUT);
});
