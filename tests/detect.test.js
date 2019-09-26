const { TesseractWorker } = Tesseract;
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const IMAGE_PATH = 'http://localhost:3000/tests/assets/images';
const loadLangOptions = {
  langPath: 'http://localhost:3000/tests/assets/traineddata',
  cachePath: './tests/assets/traineddata',
};

const getWorker = options => (
  new TesseractWorker({
    cacheMethod: 'readOnly',
    ...(isBrowser ? { workerPath: 'http://localhost:3000/dist/worker.dev.js' } : {}),
    ...loadLangOptions,
    ...options,
  })
);

describe('detect()', () => {
  it('should detect OSD', (done) => {
    [
      { name: 'cosmic.png', ans: { id: 12, degree: 0 } },
    ].forEach(({ name, ans: { id, degree } }) => {
      const worker = getWorker();
      worker
        .detect(`${IMAGE_PATH}/${name}`)
        .then(({ tesseract_script_id, orientation_degrees }) => {
          expect(tesseract_script_id).to.be(id);
          expect(orientation_degrees).to.be(degree);
          done();
        });
    });
  }).timeout(10000);
});
