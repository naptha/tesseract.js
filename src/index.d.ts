declare namespace Tesseract {
  function createScheduler(): Scheduler
  function createWorker(options?: Partial<WorkerOptions>): Promise<Worker>
  function setLogging(logging: boolean): void
  function recognize(image: ImageLike, langs?: string, options?: Partial<WorkerOptions>): Promise<RecognizeResult>
  function detect(image: ImageLike, options?: Partial<WorkerOptions>): any

  interface Scheduler {
    addWorker(worker: Worker): string
    addJob(action: 'recognize', ...args: Parameters<Worker['recognize']>): Promise<RecognizeResult>
    addJob(action: 'detect', ...args: Parameters<Worker['detect']>): Promise<DetectResult>
    terminate(): Promise<any>
    getQueueLen(): number
    getNumWorkers(): number
  }

  interface Worker {
    load(jobId?: string): Promise<ConfigResult>
    writeText(path: string, text: string, jobId?: string): Promise<ConfigResult>
    readText(path: string, jobId?: string): Promise<ConfigResult>
    removeText(path: string, jobId?: string): Promise<ConfigResult>
    FS(method: string, args: any[], jobId?: string): Promise<ConfigResult>
    loadLanguage(langs?: string | Lang[], jobId?: string): Promise<ConfigResult>
    initialize(langs?: string | Lang[], oem?: OEM, config?: string | Partial<InitOptions>, jobId?: string): Promise<ConfigResult>
    setParameters(params: Partial<WorkerParams>, jobId?: string): Promise<ConfigResult>
    getImage(type: imageType): string
    recognize(image: ImageLike, options?: Partial<RecognizeOptions>, output?: Partial<OutputFormats>, jobId?: string): Promise<RecognizeResult>
    detect(image: ImageLike, jobId?: string): Promise<DetectResult>
    terminate(jobId?: string): Promise<ConfigResult>
    getPDF(title?: string, textonly?: boolean, jobId?: string):Promise<GetPDFResult>
  }

  interface Lang {
    code: string;
    data: unknown;
  }

  interface InitOptions {
    load_system_dawg: string
    load_freq_dawg: string
    load_unambig_dawg: string
    load_punc_dawg: string
    load_number_dawg: string
    load_bigram_dawg: string
  }
  
  type LoggerMessage = {
    jobId: string
    progress: number
    status: string
    userJobId: string
    workerId: string
  }
  
  interface WorkerOptions {
    corePath: string
    langPath: string
    cachePath: string
    dataPath: string
    workerPath: string
    cacheMethod: string
    workerBlobURL: boolean
    gzip: boolean
    logger: (arg: LoggerMessage) => void,
    errorHandler: (arg: any) => void
  }
  interface WorkerParams {
    tessedit_ocr_engine_mode: OEM
    tessedit_pageseg_mode: PSM
    tessedit_char_whitelist: string
    preserve_interword_spaces: string
    user_defined_dpi: string
    tessjs_create_hocr: string
    tessjs_create_tsv: string
    tessjs_create_box: string
    tessjs_create_unlv: string
    tessjs_create_osd: string
  }
  interface OutputFormats {
    text: boolean;
    blocks: boolean;
    layoutBlocks: boolean;
    hocr: boolean;
    tsv: boolean;
    box: boolean;
    unlv: boolean;
    osd: boolean;
    pdf: boolean;
    imageColor: boolean;
    imageGrey: boolean;
    imageBinary: boolean;
    debug: boolean;
  }
  interface RecognizeOptions {
    rectangle: Rectangle
    pdfTitle: string
    pdfTextOnly: boolean
    rotateAuto: boolean
    rotateRadians: number
  }
  interface ConfigResult {
    jobId: string
    data: any
  }
  interface RecognizeResult {
    jobId: string
    data: Page
  }
  interface GetPDFResult {
    jobId: string
    data: number[]
  }
  interface DetectResult {
    jobId: string
    data: DetectData
  }
  interface DetectData {
    tesseract_script_id: number | null
    script: string | null
    script_confidence: number | null
    orientation_degrees: number | null
    orientation_confidence: number | null
  }
  interface Rectangle {
    left: number
    top: number
    width: number
    height: number
  }
  enum OEM {
    TESSERACT_ONLY,
    LSTM_ONLY,
    TESSERACT_LSTM_COMBINED,
    DEFAULT,
  }
  enum PSM {
    OSD_ONLY = '0',
    AUTO_OSD = '1',
    AUTO_ONLY = '2',
    AUTO = '3',
    SINGLE_COLUMN = '4',
    SINGLE_BLOCK_VERT_TEXT = '5',
    SINGLE_BLOCK = '6',
    SINGLE_LINE = '7',
    SINGLE_WORD = '8',
    CIRCLE_WORD = '9',
    SINGLE_CHAR = '10',
    SPARSE_TEXT = '11',
    SPARSE_TEXT_OSD = '12',
    RAW_LINE = '13'
  }
  const enum imageType {
    COLOR = 0,
    GREY = 1,
    BINARY = 2
  }
  type ImageLike = string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
    | CanvasRenderingContext2D | File | Blob | ImageData | Buffer | OffscreenCanvas;
  interface Block {
    paragraphs: Paragraph[];
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
    blocks: Block[] | null;
    confidence: number;
    lines: Line[];
    oem: string;
    osd: string;
    paragraphs: Paragraph[];
    psm: string;
    symbols: Symbol[];
    text: string;
    version: string;
    words: Word[];
    hocr: string | null;
    tsv: string | null;
    box: string | null;
    unlv: string | null;
    sd: string | null;
    imageColor: string | null;
    imageGrey: string | null;
    imageBinary: string | null;
    rotateRadians: number | null;
    pdf: number[] | null;
  }
}

export = Tesseract;
export as namespace Tesseract;
