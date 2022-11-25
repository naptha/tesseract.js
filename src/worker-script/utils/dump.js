/**
 *
 * Dump data to a big JSON tree
 *
 * @fileoverview dump data to JSON tree
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
const arrayBufferToBase64 = require('./arrayBufferToBase64');
const imageType = require('../../constants/imageType');

/**
 * deindent
 *
 * The generated HOCR is excessively indented, so
 * we get rid of that indentation
 *
 * @name deindent
 * @function deindent string
 * @access public
 */
const deindent = (html) => {
  const lines = html.split('\n');
  if (lines[0].substring(0, 2) === '  ') {
    for (let i = 0; i < lines.length; i += 1) {
      if (lines[i].substring(0, 2) === '  ') {
        lines[i] = lines[i].slice(2);
      }
    }
  }
  return lines.join('\n');
};

/**
 * dump
 *
 * @name dump
 * @function dump recognition result to a JSON object
 * @access public
 */
module.exports = (TessModule, api, output, options) => {
  const ri = api.GetIterator();
  const {
    RIL_BLOCK,
    RIL_PARA,
    RIL_TEXTLINE,
    RIL_WORD,
    RIL_SYMBOL,
  } = TessModule;
  const blocks = [];
  let block;
  let para;
  let textline;
  let word;
  let symbol;

  const enumToString = (value, prefix) => (
    Object.keys(TessModule)
      .filter((e) => (e.startsWith(`${prefix}_`) && TessModule[e] === value))
      .map((e) => e.slice(prefix.length + 1))[0]
  );

  const getImage = (type) => {
    api.WriteImage(type, '/image.png');
    const pngBuffer = TessModule.FS.readFile('/image.png');
    const pngStr = `data:image/png;base64,${arrayBufferToBase64(pngBuffer.buffer)}`;
    TessModule.FS.unlink('/image.png');
    return pngStr;
  };

  const getPDFInternal = (title, textonly) => {
    const pdfRenderer = new TessModule.TessPDFRenderer('tesseract-ocr', '/', textonly);
    pdfRenderer.BeginDocument(title);
    pdfRenderer.AddImage(api);
    pdfRenderer.EndDocument();
    TessModule._free(pdfRenderer);

    return TessModule.FS.readFile('/tesseract-ocr.pdf');
  };

  if (output.blocks) {
    ri.Begin();
    do {
      if (ri.IsAtBeginningOf(RIL_BLOCK)) {
        const poly = ri.BlockPolygon();
        let polygon = null;
        // BlockPolygon() returns null when automatic page segmentation is off
        if (TessModule.getPointer(poly) > 0) {
          const n = poly.get_n();
          const px = poly.get_x();
          const py = poly.get_y();
          polygon = [];
          for (let i = 0; i < n; i += 1) {
            polygon.push([px.getValue(i), py.getValue(i)]);
          }
          /*
           * TODO: find out why _ptaDestroy doesn't work
           */
          // TessModule._ptaDestroy(TessModule.getPointer(poly));
        }

        block = {
          paragraphs: [],
          text: ri.GetUTF8Text(RIL_BLOCK),
          confidence: ri.Confidence(RIL_BLOCK),
          baseline: ri.getBaseline(RIL_BLOCK),
          bbox: ri.getBoundingBox(RIL_BLOCK),
          blocktype: enumToString(ri.BlockType(), 'PT'),
          polygon,
        };
        blocks.push(block);
      }
      if (ri.IsAtBeginningOf(RIL_PARA)) {
        para = {
          lines: [],
          text: ri.GetUTF8Text(RIL_PARA),
          confidence: ri.Confidence(RIL_PARA),
          baseline: ri.getBaseline(RIL_PARA),
          bbox: ri.getBoundingBox(RIL_PARA),
          is_ltr: !!ri.ParagraphIsLtr(),
        };
        block.paragraphs.push(para);
      }
      if (ri.IsAtBeginningOf(RIL_TEXTLINE)) {
        textline = {
          words: [],
          text: ri.GetUTF8Text(RIL_TEXTLINE),
          confidence: ri.Confidence(RIL_TEXTLINE),
          baseline: ri.getBaseline(RIL_TEXTLINE),
          bbox: ri.getBoundingBox(RIL_TEXTLINE),
        };
        para.lines.push(textline);
      }
      if (ri.IsAtBeginningOf(RIL_WORD)) {
        const fontInfo = ri.getWordFontAttributes();
        const wordDir = ri.WordDirection();
        word = {
          symbols: [],
          choices: [],

          text: ri.GetUTF8Text(RIL_WORD),
          confidence: ri.Confidence(RIL_WORD),
          baseline: ri.getBaseline(RIL_WORD),
          bbox: ri.getBoundingBox(RIL_WORD),

          is_numeric: !!ri.WordIsNumeric(),
          in_dictionary: !!ri.WordIsFromDictionary(),
          direction: enumToString(wordDir, 'DIR'),
          language: ri.WordRecognitionLanguage(),

          is_bold: fontInfo.is_bold,
          is_italic: fontInfo.is_italic,
          is_underlined: fontInfo.is_underlined,
          is_monospace: fontInfo.is_monospace,
          is_serif: fontInfo.is_serif,
          is_smallcaps: fontInfo.is_smallcaps,
          font_size: fontInfo.pointsize,
          font_id: fontInfo.font_id,
          font_name: fontInfo.font_name,
        };
        const wc = new TessModule.WordChoiceIterator(ri);
        do {
          word.choices.push({
            text: wc.GetUTF8Text(),
            confidence: wc.Confidence(),
          });
        } while (wc.Next());
        TessModule.destroy(wc);
        textline.words.push(word);
      }

      // let image = null;
      // var pix = ri.GetBinaryImage(TessModule.RIL_SYMBOL)
      // var image = pix2array(pix);
      // // for some reason it seems that things stop working if you destroy pics
      // TessModule._pixDestroy(TessModule.getPointer(pix));
      if (ri.IsAtBeginningOf(RIL_SYMBOL)) {
        symbol = {
          choices: [],
          image: null,
          text: ri.GetUTF8Text(RIL_SYMBOL),
          confidence: ri.Confidence(RIL_SYMBOL),
          baseline: ri.getBaseline(RIL_SYMBOL),
          bbox: ri.getBoundingBox(RIL_SYMBOL),
          is_superscript: !!ri.SymbolIsSuperscript(),
          is_subscript: !!ri.SymbolIsSubscript(),
          is_dropcap: !!ri.SymbolIsDropcap(),
        };
        word.symbols.push(symbol);
        const ci = new TessModule.ChoiceIterator(ri);
        do {
          symbol.choices.push({
            text: ci.GetUTF8Text(),
            confidence: ci.Confidence(),
          });
        } while (ci.Next());
        // TessModule.destroy(i);
      }
    } while (ri.Next(RIL_SYMBOL));
    TessModule.destroy(ri);
  }

  return {
    text: output.text ? api.GetUTF8Text() : null,
    hocr: output.hocr ? deindent(api.GetHOCRText()) : null,
    tsv: output.tsv ? api.GetTSVText() : null,
    box: output.box ? api.GetBoxText() : null,
    unlv: output.unlv ? api.GetUNLVText() : null,
    osd: output.osd ? api.GetOsdText() : null,
    pdf: output.pdf ? getPDFInternal(options.pdfTitle ?? 'Tesseract OCR Result', options.pdfTextOnly ?? false) : null,
    imageColor: output.imageColor ? getImage(imageType.COLOR) : null,
    imageGrey: output.imageGrey ? getImage(imageType.GREY) : null,
    imageBinary: output.imageBinary ? getImage(imageType.BINARY) : null,
    confidence: api.MeanTextConf(),
    blocks: output.blocks ? blocks : null,
    psm: enumToString(api.GetPageSegMode(), 'PSM'),
    oem: enumToString(api.oem(), 'OEM'),
    version: api.Version(),
    debug: output.debug ? TessModule.FS.readFile('/debugInternal.txt', { encoding: 'utf8', flags: 'a+' }) : null,
  };
};
