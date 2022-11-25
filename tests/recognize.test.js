const { createWorker, PSM } = Tesseract;
let worker;
before(async function cb() {
  this.timeout(0);
  worker = await createWorker(OPTIONS);
  await worker.loadLanguage('eng+chi_tra+osd');
});

describe('recognize()', () => {
  describe('should read bmp, jpg, png and pbm format images', () => {
    FORMATS.forEach(format => (
      it(`support ${format} format`, async () => {
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(`${IMAGE_PATH}/simple.${format}`);
        expect(text).to.be(SIMPLE_TEXT);
      }).timeout(TIMEOUT)
    ));
  });

  describe('should recognize base64 image', () => {
    [
      { format: 'png', image: SIMPLE_PNG_BASE64, ans: SIMPLE_TEXT },
      { format: 'jpg', image: SIMPLE_JPG_BASE64, ans: SIMPLE_TEXT },
    ].forEach(({ format, image, ans }) => (
      it(`recongize ${format} in base64`, async () => {
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(image);
        expect(text).to.be(ans);
      }).timeout(TIMEOUT)
    ));
  });

  describe('should recognize base64 image (simplified interface)', () => {
    [
      { format: 'png', image: SIMPLE_PNG_BASE64, ans: SIMPLE_TEXT },
      { format: 'jpg', image: SIMPLE_JPG_BASE64, ans: SIMPLE_TEXT },
    ].forEach(({ format, image, ans }) => (
      it(`recongize ${format} in base64`, async () => {
        const { data: { text } } = await Tesseract.recognize(image, undefined, OPTIONS);
        expect(text).to.be(ans);
      }).timeout(TIMEOUT)
    ));
  });


  describe('should recognize different langs', () => {
    [
      { name: 'chinese.png', lang: 'chi_tra', ans: CHINESE_TEXT },
    ].forEach(({ name, lang, ans }) => (
      it(`recongize ${lang}`, async () => {
        await worker.initialize(lang);
        const { data: { text } } = await worker.recognize(`${IMAGE_PATH}/${name}`);
        expect(text).to.be(ans);
      }).timeout(TIMEOUT)
    ));
  });

  describe('should support different complexity', () => {
    [
      { name: 'simple.png', desc: 'simple', ans: SIMPLE_TEXT },
      { name: 'cosmic.png', desc: 'normal', ans: COMSIC_TEXT },
      { name: 'testocr.png', desc: 'large', ans: TESTOCR_TEXT },
    ].forEach(({ name, desc, ans }) => (
      it(`recongize ${desc} image`, async () => {
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(`${IMAGE_PATH}/${name}`);
        expect(text).to.be(ans);
      }).timeout(TIMEOUT)
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
      it(`recongize half ${name}`, async () => {
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(
          `${IMAGE_PATH}/${name}`,
          {
            rectangle: {
              top, left, width, height,
            },
          },
        );
        expect(text).to.be(ans);
      }).timeout(TIMEOUT)
    ));
  });

  describe('should work with selected parameters', () => {
    it('support preserve_interword_spaces', async () => {
      await worker.initialize('eng');
      await worker.setParameters({
        preserve_interword_spaces: '1',
      });
      const { data: { text } } = await worker.recognize(`${IMAGE_PATH}/bill.png`);
      expect(text).to.be(BILL_SPACED_TEXT);
    }).timeout(TIMEOUT);

    it('support tessedit_char_whitelist', async () => {
      await worker.initialize('eng');
      await worker.setParameters({
        tessedit_char_whitelist: 'Tess',
      });
      const { data: { text } } = await worker.recognize(`${IMAGE_PATH}/simple.png`);
      expect(text).to.be(SIMPLE_WHITELIST_TEXT);
    }).timeout(TIMEOUT);
  });

  describe('should support all page seg modes', () => {
    Object
      .keys(PSM)
      .map(name => ({ name, mode: PSM[name] }))
      .forEach(({ name, mode }) => (
        it(`support PSM.${name} mode`, async () => {
          await worker.initialize('eng');
          await worker.setParameters({
            tessedit_pageseg_mode: mode,
          });
          const { data } = await worker.recognize(`${IMAGE_PATH}/simple.png`);
          expect(Object.keys(data).length).not.to.be(0);
        }).timeout(TIMEOUT)
      ));
  });

  (IS_BROWSER ? describe.skip : describe)('should recognize image in Buffer format (Node.js only)', () => {
    FORMATS.forEach(format => (
      it(`support ${format} format`, async () => {
        const buf = fs.readFileSync(path.join(__dirname, 'assets', 'images', `simple.${format}`));
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(buf);
        expect(text).to.be(SIMPLE_TEXT);
      }).timeout(TIMEOUT)
    ));
  });

  (IS_BROWSER ? describe : describe.skip)('should read image from img DOM element (browser only)', () => {
    FORMATS.forEach(format => (
      it(`support ${format} format`, async () => {
        const imageDOM = document.createElement('img');
        imageDOM.setAttribute('src', `${IMAGE_PATH}/simple.${format}`);
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(imageDOM);
        expect(text).to.be(SIMPLE_TEXT);
      }).timeout(TIMEOUT)
    ));
  });

  (IS_BROWSER ? describe : describe.skip)('should read image from video DOM element (browser only)', () => {
    FORMATS.forEach(format => (
      it(`support ${format} format`, async () => {
        const videoDOM = document.createElement('video');
        videoDOM.setAttribute('poster', `${IMAGE_PATH}/simple.${format}`);
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(videoDOM);
        expect(text).to.be(SIMPLE_TEXT);
      }).timeout(TIMEOUT)
    ));
  });

  (IS_BROWSER ? describe : describe.skip)('should read video from canvas DOM element (browser only)', () => {
    // img tag is unable to render pbm, so let's skip it.
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
      it(`support ${format} format`, async () => {
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(canvasDOM);
        expect(text).to.be(SIMPLE_TEXT);
      }).timeout(TIMEOUT)
    ));
  });
});
