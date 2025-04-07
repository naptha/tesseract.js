import { IMAGE_PATH, TIMEOUT, OPTIONS } from './constants.mjs';

describe('detect()', () => {
  let worker;
  before(async function cb() {
    this.timeout(0);
    worker = await Tesseract.createWorker('osd', 0, OPTIONS);
  });

  it('should detect OSD', async () => {
    const { data: { script: s } } = await worker.detect(`${IMAGE_PATH}/cosmic.png`);
    expect(s).to.be('Latin');
  }).timeout(TIMEOUT);

  it('should detect OSD (simplified interface)', async () => {
    const { data: { script: s } } = await Tesseract.detect(`${IMAGE_PATH}/cosmic.png`, undefined, OPTIONS);
    expect(s).to.be('Latin');
  }).timeout(TIMEOUT);
});
