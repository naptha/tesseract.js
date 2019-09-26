const { TesseractWorker, PSM } = Tesseract;

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const SIMPLE_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAC0CAIAAABqhmJGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAASuSURBVHhe7dftVdswAIbRzsVAzMM0XabDUCOUxLYsWW4Jp+/pvf9w9GH76CHw4x2IJWAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAI9p8G/PbyY8rL2686g8t+vnqHTyfgIYfvz/26veTXn/UKX8+f0EU9bHrtu/6KfAN/AwEXAj7lFf2TBFw4nae8on+SgIvJ01n/KLzpDK+L3bT/Ap4O+HC+V12mTH+M3gzcLbIY/EO6HfxYp13k09nb6r3UqcdnjoCL3ll72J26h+35Oxy2XvZ0wOLaXq9v2+F1UC+7RZtMZ/DnfX1lwDOPzwUCLo7O2trtDK8H3M/iqoc6bj1subT68XTA/F7bGJooyzKbhTvLPHY8eJLHlbNX1DqYUVfdXbqwJjsCLsans37aNNJM6w68OR0wv9f9ymKw3k67yn2ZZpHlg3a3zis60s6oV+ZvlzMCLoanc3Dsdt9TdWT/lM8OmNjr5KY72jmzq1zfrbvXtVtmRMDF8HTWcgaaqIrD1U4G/MFewxrW262s5jS/Fzpmdts6mnHy+Fwl4GJ0OjsNrG1P/y7CNo3+gEt7jW56MVprNed7A/5w+n6YJ+BieDpnj/jO6pweTz0acGWvmZveL9XOmd3x6wKuTt8PEwRczLRw4eje1XX7c/cDruw1uuneOu2c4aOvzI57mJhRh1xZlQ0BF+Oz9vcF96fuB1zYa7R2b5mD6/XSwdfg8snj4q21+W/L02dfzIxhQMDFyTm6Hd7m+JYP7rPKT5sRuzhOBywm91rUkYc3fV9ltchtr8VmzuGOdfDB9N1tFYefNfdXLmyGjNZkhoCLUQufVqd/7z7rUcLW/XieDvg0s9difNOdRV5ePibt5vTuazusWbF9rs2E5v4mH58LBFyMW7g5OID7s9cMuTygmt9rcNPb5MrAz0lHc3Z9Ht7XZsxqxO36ZtLR/c0+PpMEzLOc/4LhrwmYZ6lfywJ+JgHzJPr9DgLmi23/zdXvcwmYL7YKWL1PJ2AIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmCI9f7+G6yFxVg/GyYwAAAAAElFTkSuQmCC';
const SIMPLE_JPG = 'data:image/jpeg;base64,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';
const IMAGE_PATH = 'http://localhost:3000/tests/assets/images';
const SIMPLE_TEXT = 'Tesseract.js\n';
const SIMPLE_TEXT_HALF = 'Tesse\n';
const COMSIC_TEXT = 'HellO World\nfrom beyond\nthe Cosmic Void\n';
const TESTOCR_TEXT = 'This is a lot of 12 point text to test the\nocr code and see if it works on all types\nof file format.\n\nThe quick brown dog jumped over the\nlazy fox. The quick brown dog jumped\nover the lazy fox. The quick brown dog\njumped over the lazy fox. The quick\nbrown dog jumped over the lazy fox.\n';
const CHINESE_TEXT = '繁 體 中 文 測 試\n';
const FORMATS = ['png', 'jpg', 'bmp', 'pbm'];

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

describe('recognize()', () => {
  describe('should recognize different langs', () => {
    [
      { name: 'chinese.png', lang: 'chi_tra', ans: CHINESE_TEXT },
    ].forEach(({ name, lang, ans }) => (
      it(`recongize ${lang}`, (done) => {
        const worker = getWorker();
        worker
          .recognize(`${IMAGE_PATH}/${name}`, lang)
          .then(({ text }) => {
            expect(text).to.be(ans);
            worker.terminate();
            done();
          });
      }).timeout(30000)
    ));
  });

  describe('should read bmp, jpg, png and pbm format images', () => {
    FORMATS.forEach(format => (
      it(`support ${format} format`, (done) => {
        const worker = getWorker();
        worker
          .recognize(`${IMAGE_PATH}/simple.${format}`)
          .then(({ text }) => {
            expect(text).to.be(SIMPLE_TEXT);
            worker.terminate();
            done();
          });
      }).timeout(10000)
    ));
  });

  describe('should recognize part of the image', () => {
    [
      {
        name: 'simple.png', left: 0, top: 0, width: 140, height: 180, ans: SIMPLE_TEXT_HALF,
      },
    ].forEach(({
      name, left, top, width, height, ans,
    }) => (
      it(`recongize half ${name}`, (done) => {
        const worker = getWorker();
        worker
          .recognize(`${IMAGE_PATH}/${name}`, 'eng', {
            tessjs_image_rectangle_left: left,
            tessjs_image_rectangle_top: top,
            tessjs_image_rectangle_width: width,
            tessjs_image_rectangle_height: height,
          })
          .then(({ text }) => {
            expect(text).to.be(ans);
            worker.terminate();
            done();
          });
      }).timeout(30000)
    ));
  });

  describe('should be able to recognize multiple images with 1 worker', () => {
    [3, 10, 20].forEach(num => (
      it(`recognize ${num} images with 1 worker`, (done) => {
        const worker = getWorker();
        Promise.all(
          Array(num).fill(0).map(() => worker.recognize(`${IMAGE_PATH}/simple.png`)),
        ).then((results) => {
          results.forEach(({ text }) => {
            expect(text).to.be(SIMPLE_TEXT);
          });
          worker.terminate();
          done();
        });
      }).timeout(60000)
    ));
  });

  describe('should recognize multiple images in order', () => {
    [1, 2].forEach((num) => {
      it(`recognize ${num * 2} images with 1 worker in order`, (done) => {
        const worker = getWorker();
        const cases = Array(num).fill(0)
          .reduce(acc => (
            acc.concat([
              { name: 'simple.png', ans: SIMPLE_TEXT },
              { name: 'cosmic.png', ans: COMSIC_TEXT },
            ])
          ),
          []);
        Promise.all(
          cases.map(({ name }) => worker.recognize(`${IMAGE_PATH}/${name}`)),
        ).then((results) => {
          results.forEach(({ text }, idx) => {
            expect(text).to.be(cases[idx].ans);
          });
          worker.terminate();
          done();
        });
      }).timeout(30000);
    });
  });

  describe('supports different complexity', () => {
    [
      { name: 'simple.png', desc: 'simple', ans: SIMPLE_TEXT },
      { name: 'cosmic.png', desc: 'normal', ans: COMSIC_TEXT },
      { name: 'testocr.png', desc: 'complex', ans: TESTOCR_TEXT },
    ].forEach(({ name, desc, ans }) => (
      it(`recongize ${desc} image`, (done) => {
        const worker = getWorker();
        worker
          .recognize(`${IMAGE_PATH}/${name}`)
          .then(({ text }) => {
            expect(text).to.be(ans);
            worker.terminate();
            done();
          });
      }).timeout(60000)
    ));
  });

  describe('should support all page seg modes', () => {
    Object
      .keys(PSM)
      .map(name => ({ name, mode: PSM[name] }))
      .forEach(({ name, mode }) => (
        it(`support PSM.${name} mode`, (done) => {
          const worker = getWorker();
          worker
            .recognize(`${IMAGE_PATH}/testocr.png`, 'eng', { tessedit_pageseg_mode: mode })
            .then((ret) => {
              expect(Object.keys(ret).length).not.to.be(0);
              worker.terminate();
              done();
            });
        }).timeout(30000)
      ));
  });

  describe('should recognize base64 image', () => {
    [
      { format: 'png', image: SIMPLE_PNG, ans: SIMPLE_TEXT },
      { format: 'jpg', image: SIMPLE_JPG, ans: SIMPLE_TEXT },
    ].forEach(({ format, image, ans }) => (
      it(`recongize ${format} in base64`, (done) => {
        const worker = getWorker();
        worker
          .recognize(image)
          .then(({ text }) => {
            expect(text).to.be(ans);
            worker.terminate();
            done();
          });
      }).timeout(30000)
    ));
  });

  (isBrowser ? describe.skip : describe)('should recognize image in Buffer (Node.js only)', () => {
    FORMATS.forEach(format => (
      it(`support ${format} format`, (done) => {
        const worker = getWorker();
        worker
          .recognize(fs.readFileSync(path.join(__dirname, 'assets', 'images', `simple.${format}`)))
          .then(({ text }) => {
            expect(text).to.be(SIMPLE_TEXT);
            worker.terminate();
            done();
          });
      }).timeout(10000)
    ));
  });

  (isBrowser ? describe : describe.skip)('should read image from img DOM element (browser only)', () => {
    FORMATS.forEach(format => (
      it(`support ${format} format`, (done) => {
        const imageDOM = document.createElement('img');
        imageDOM.setAttribute('src', `${IMAGE_PATH}/simple.${format}`);
        const worker = getWorker();
        worker
          .recognize(imageDOM)
          .then(({ text }) => {
            expect(text).to.be(SIMPLE_TEXT);
            worker.terminate();
            imageDOM.remove();
            done();
          });
      }).timeout(10000)
    ));
  });

  (isBrowser ? describe : describe.skip)('should read image from video DOM element (browser only)', () => {
    FORMATS.forEach(format => (
      it(`support ${format} format`, (done) => {
        const videoDOM = document.createElement('video');
        videoDOM.setAttribute('poster', `${IMAGE_PATH}/simple.${format}`);
        const worker = getWorker();
        worker
          .recognize(videoDOM)
          .then(({ text }) => {
            expect(text).to.be(SIMPLE_TEXT);
            worker.terminate();
            videoDOM.remove();
            done();
          });
      }).timeout(10000)
    ));
  });

  (isBrowser ? describe : describe.skip)('should read video from canvas DOM element (browser only)', () => {
    /*
     * img tag is unable to render pbm, so let's skip it.
     */
    const formats = FORMATS.filter(f => f !== 'pbm');
    let canvasDOM = null;
    let imageDOM = null;
    let idx = 0;
    beforeEach((done) => {
      canvasDOM = document.createElement('canvas');
      imageDOM = document.createElement('img');
      imageDOM.setAttribute('crossOrigin', 'Anonymous');
      imageDOM.onload = () => {
        canvasDOM.getContext('2d').drawImage(imageDOM, 0, 0);
        done();
      };
      imageDOM.setAttribute('src', `${IMAGE_PATH}/simple.${formats[idx]}`);
      idx += 1;
    });

    afterEach(() => {
      canvasDOM.remove();
      imageDOM.remove();
    });

    formats.forEach(format => (
      it(`support ${format} format`, (done) => {
        const worker = getWorker();
        worker
          .recognize(canvasDOM)
          .then(({ text }) => {
            expect(text).to.be(SIMPLE_TEXT);
            worker.terminate();
            done();
          });
      }).timeout(10000)
    ));
  });
});
