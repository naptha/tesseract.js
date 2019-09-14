declare namespace Tesseract {
  class TesseractWorker {
    recognize(image: ImageLike, lang: string, options?: Partial<RecognizeOptions>): TesseractJob;
    detect(image: ImageLike): TesseractJob;
  }
  interface RecognizeOptions {
    tessedit_ocr_engine_mode: OEM
    tessedit_pageseg_mode: PSM
    tessedit_char_whiltelist: string
    tessjs_create_pdf: string
    tessjs_create_hocr: string
    tessjs_create_tsv: string
    tessjs_create_box: string
    tessjs_create_unlv: string
    tessjs_create_osd: string
    tessjs_textonly_pdf: string
    tessjs_pdf_name: string
    tessjs_pdf_title: string
    tessjs_pdf_auto_download: boolean
    tessjs_pdf_bin: boolean
    tessjs_image_rectangle_left: number
    tessjs_image_rectangle_top: number
    tessjs_image_rectangle_width: number
    tessjs_image_rectangle_height: number
  }
  const enum OEM {
    TESSERACT_ONLY,
    LSTM_ONLY,
    TESSERACT_LSTM_COMBINED,
    DEFAULT,
  }
  const enum PSM {
    OSD_ONLY = '0',
    AUTO_OSD = '1',
    AUTO_ONLY = '2',
    AUTO = '3',
    SINGLE_COLUMN = '4',
    SINGLE_BLOCK_VERT_TEXT = '5',
    SINGLE_BLOCK = '6',
    SINGLE_LINE = '7',
    SINGLE_WORD = '8',
    SINGLE_CHAR = '9',
    SPARSE_TEXT = '10',
    SPARSE_TEXT_OSD = '11',
    RAW_LINE = '12'
  }
  type ImageLike = string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
    | CanvasRenderingContext2D | File | Blob | ImageData | Buffer;
  interface Progress {
    status: string;
    progress: number;
    loaded?: number;
  }
  interface Block {
    paragraphs: Paragraph;
    text: string;
    confidence: number;
    baseline: Baseline;
    bbox: Bbox;
    blocktype: string;
    polygon: any;
    page: Page;
    lines: Line[];
    words: Word[];
    symbols: Symbol[];
  }
  interface Baseline {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    has_baseline: boolean;
  }
  interface Bbox {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  }
  interface Line {
    words: Word[];
    text: string;
    confidence: number;
    baseline: Baseline;
    bbox: Bbox;
    paragraph: Paragraph;
    block: Block;
    page: Page;
    symbols: Symbol[];
  }
  interface Paragraph {
    lines: Line[];
    text: string;
    confidence: number;
    baseline: Baseline;
    bbox: Bbox;
    is_ltr: boolean;
    block: Block;
    page: Page;
    words: Word[];
    symbols: Symbol[];
  }
  interface Symbol {
    choices: Choice[];
    image: any;
    text: string;
    confidence: number;
    baseline: Baseline;
    bbox: Bbox;
    is_superscript: boolean;
    is_subscript: boolean;
    is_dropcap: boolean;
    word: Word;
    line: Line;
    paragraph: Paragraph;
    block: Block;
    page: Page;
  }
  interface Choice {
    text: string;
    confidence: number;
  }
  interface Word {
    symbols: Symbol[];
    choices: Choice[];
    text: string;
    confidence: number;
    baseline: Baseline;
    bbox: Bbox;
    is_numeric: boolean;
    in_dictionary: boolean;
    direction: string;
    language: string;
    is_bold: boolean;
    is_italic: boolean;
    is_underlined: boolean;
    is_monospace: boolean;
    is_serif: boolean;
    is_smallcaps: boolean;
    font_size: number;
    font_id: number;
    font_name: string;
    line: Line;
    paragraph: Paragraph;
    block: Block;
    page: Page;
  }
  interface Page {
    blocks: Block[];
    confidence: number;
    html: string;
    lines: Line[];
    oem: string;
    paragraphs: Paragraph[];
    psm: string;
    symbols: Symbol[];
    text: string;
    version: string;
    words: Word[];
  }
  interface TesseractJob {
    then: (callback: (result: Page) => void) => TesseractJob;
    progress: (callback: (progress: Progress) => void) => TesseractJob;
    catch: (callback: (error: Error) => void) => TesseractJob;
    finally: (callback: (resultOrError: Error | Page) => void) => TesseractJob;
  }
}

export = Tesseract;
export as namespace Tesseract;
