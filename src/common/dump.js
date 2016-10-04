module.exports = function DumpLiterallyEverything(Module, base){
    var ri = base.GetIterator();
    var blocks = [];
    var block, para, textline, word, symbol;

    function enumToString(value, prefix){
       return (Object.keys(Module)
           .filter(function(e){ return e.substr(0, prefix.length + 1) == prefix + '_' })
           .filter(function(e){ return Module[e] === value })
           .map(function(e){ return e.slice(prefix.length + 1) })[0])
    }

    ri.Begin()
    do {
        if(ri.IsAtBeginningOf(Module.RIL_BLOCK)){
            var poly = ri.BlockPolygon();
            var polygon = null;
            // BlockPolygon() returns null when automatic page segmentation is off
            if(Module.getPointer(poly) > 0){
                var n = poly.get_n(),
                    px = poly.get_x(),
                    py = poly.get_y(),
                    polygon = [];
                for(var i = 0; i < n; i++){
                    polygon.push([px.getValue(i), py.getValue(i)]);
                }
                Module._ptaDestroy(Module.getPointer(poly));    
            }
            
            block = {
                paragraphs: [],

                text: ri.GetUTF8Text(Module.RIL_BLOCK),
                confidence: ri.Confidence(Module.RIL_BLOCK),
                baseline: ri.getBaseline(Module.RIL_BLOCK),
                bbox: ri.getBoundingBox(Module.RIL_BLOCK),

                blocktype: enumToString(ri.BlockType(), 'PT'),
                polygon: polygon
            }
            blocks.push(block)
        }
        if(ri.IsAtBeginningOf(Module.RIL_PARA)){
            para = {
                lines: [],

                text: ri.GetUTF8Text(Module.RIL_PARA),
                confidence: ri.Confidence(Module.RIL_PARA),
                baseline: ri.getBaseline(Module.RIL_PARA),
                bbox: ri.getBoundingBox(Module.RIL_PARA),

                is_ltr: !!ri.ParagraphIsLtr()
            }
            block.paragraphs.push(para)
        }
        if(ri.IsAtBeginningOf(Module.RIL_TEXTLINE)){
            textline = {
                words: [],

                text: ri.GetUTF8Text(Module.RIL_TEXTLINE),
                confidence: ri.Confidence(Module.RIL_TEXTLINE),
                baseline: ri.getBaseline(Module.RIL_TEXTLINE),
                bbox: ri.getBoundingBox(Module.RIL_TEXTLINE)
            }
            para.lines.push(textline)
        }
        if(ri.IsAtBeginningOf(Module.RIL_WORD)){
            var fontInfo = ri.getWordFontAttributes(),
                wordDir = ri.WordDirection();
            word = {
                symbols: [],
                choices: [],

                text: ri.GetUTF8Text(Module.RIL_WORD),
                confidence: ri.Confidence(Module.RIL_WORD),
                baseline: ri.getBaseline(Module.RIL_WORD),
                bbox: ri.getBoundingBox(Module.RIL_WORD),

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
            }
            var wc = new Module.WordChoiceIterator(ri);
            do {
                word.choices.push({
                    text: wc.GetUTF8Text(),
                    confidence: wc.Confidence()
                })
            } while (wc.Next());
            Module.destroy(wc)
            textline.words.push(word)
        }
        
        var image = null;
        // var pix = ri.GetBinaryImage(Module.RIL_SYMBOL)
        // var image = pix2array(pix);
        // // for some reason it seems that things stop working if you destroy pics
        // Module._pixDestroy(Module.getPointer(pix));
        if(ri.IsAtBeginningOf(Module.RIL_SYMBOL)){
            symbol = {
                choices: [],
                image: image,

                text: ri.GetUTF8Text(Module.RIL_SYMBOL),
                confidence: ri.Confidence(Module.RIL_SYMBOL),
                baseline: ri.getBaseline(Module.RIL_SYMBOL),
                bbox: ri.getBoundingBox(Module.RIL_SYMBOL),

                is_superscript: !!ri.SymbolIsSuperscript(),
                is_subscript: !!ri.SymbolIsSubscript(),
                is_dropcap: !!ri.SymbolIsDropcap(),
            }
            word.symbols.push(symbol)
            var ci = new Module.ChoiceIterator(ri);
            do {
                symbol.choices.push({
                    text: ci.GetUTF8Text(),
                    confidence: ci.Confidence()
                })
            } while (ci.Next());
            Module.destroy(ci)
        }
    } while (ri.Next(Module.RIL_SYMBOL));
    Module.destroy(ri)

    return {
        text: base.GetUTF8Text(),
        html: deindent(base.GetHOCRText()),

        confidence: base.MeanTextConf(),

        blocks: blocks,

        psm: enumToString(base.GetPageSegMode(), 'PSM'),
        oem: enumToString(base.oem(), 'OEM'),
        version: base.Version(),
    }
}

// the generated HOCR is excessively indented, so
// we get rid of that indentation

function deindent(html){
    var lines = html.split('\n')
    if(lines[0].substring(0, 2) === "  "){
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].substring(0,2) === "  ") {
                lines[i] = lines[i].slice(2)
            }
        };
    }
    return lines.join('\n')
}
