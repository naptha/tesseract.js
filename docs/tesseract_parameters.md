Tesseract.js Parameters
=======================

In the 3rd argument of `TesseractWorker.recognize()`, you can pass a params object to customize the result of OCR, below are supported parameters in tesseract.js so far.

Example:

```javascript
import Tesseract from 'tesseract.js';

const { TesseractWorker, OEM, PSM } = Tesseract;
const worker = new TesseractWorker();

worker
  .recognize(image, 'eng', {
    tessedit_ocr_engine_mode: OEM.LSTM_ONLY,
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
  })
  .then(result => console.log(result.text));
```

| name | type | default value | description |
| ---- | ---- | ------------- | ----------- |
| tessedit\_ocr\_engine\_mode | enum | OEM.LSTM\_ONLY | Check [HERE](https://github.com/tesseract-ocr/tesseract/blob/4.0.0/src/ccstruct/publictypes.h#L268) for definition of each mode | 
| tessedit\_pageseg\_mode | enum | PSM.SINGLE\_BLOCK | Check [HERE](https://github.com/tesseract-ocr/tesseract/blob/4.0.0/src/ccstruct/publictypes.h#L163) for definition of each mode |
| tessedit\_char\_whitelist | string | '' | setting white list characters makes the result only contains these characters, useful the content in image is limited |
| tessedit\_create\_pdf | string | '0' | only 2 values, '0' or '1', when the value is '1', tesseract.js generates a pdf output |
| tessedit\_create\_hocr | string | '1' | only 2 values, '0' or '1', when the value is '1', tesseract.js includes hocr in the result |
| tessedit\_create\_tsv | string | '1' | only 2 values, '0' or '1', when the value is '1', tesseract.js includes tsv in the result |
| tessedit\_create\_box | string | '0' | only 2 values, '0' or '1', when the value is '1', tesseract.js includes box in the result |
| tessedit\_create\_unlv | string | '0' | only 2 values, '0' or '1', when the value is '1', tesseract.js includes unlv in the result |
| tessedit\_create\_osd | string | '0' | only 2 values, '0' or '1', when the value is '1', tesseract.js includes osd in the result |
| pdf\_name | string | 'tesseract.js-ocr-result' | the name of the generated pdf file |
| pdf\_title | string | 'Tesseract.js OCR Result' | the title of the generated pdf file |
| pdf\_auto\_download | boolean | true | If the value is true, tesseract.js will automatic download/writeFile pdf file |
| pdf\_bin | boolean | false | whether to include pdf binary array in the result object (result.files.pdf) |

