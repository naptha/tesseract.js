const { TesseractWorker, utils: { loadLang } } = Tesseract;
const IMAGE_PATH = 'http://localhost:3000/tests/assets/images';
const loadLangOptions = {
  langPath: 'http://localhost:3000/tests/assets/traineddata',
  cachePath: './tests/assets/traineddata',
};

const getWorker = options => (
  new TesseractWorker({
    cacheMethod: 'readOnly',
    ...loadLangOptions,
    ...options,
  })
);

before(function cb(done) {
  this.timeout(30000);
  const load = () => (
    loadLang({
      lang: 'osd',
      cacheMethod: 'write',
      ...loadLangOptions,
    }).then(() => {
      done();
    })
  );
  if (typeof startServer !== 'undefined') {
    startServer(load);
  } else {
    load();
  }
});

after((done) => {
  if (typeof stopServer !== 'undefined') {
    stopServer(done);
  } else {
    done();
  }
});

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
