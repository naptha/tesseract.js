> # UNDER CONTRUCTION
> ## Due for Release on Monday, Oct 3, 2016

# tesseract.js
Tesseract.js is a pure javascript version of the Tesseract OCR Engine that can recognize English, Chinese, Russian, and 60 other languages.

Tesseract.js lets your code get the words out of scanned documents and other images.

<!-- ![alt text]( "Logo Title Text 1") -->

# Installation
Tesseract.js works with a `<script>` tag via local copy or cdn, or with `npm` (if you're using webpack / browserify).

## Script Tag

### CDN
```html
<script src='https://cdn.rawgit.com/naptha/tesseract.js/a01d2a2/dist/tesseract.js'></script>

<script>
Tesseract.recognize('#my-image')
    .progress(function (p) { console.log('progress', p) })
    .then(function (result) { console.log('result', result) })
</script>
```


### Local
First grab copies of `tesseract.js` and `tesseract.worker.js` from the [dist folder](https://github.com/naptha/tesseract.js/tree/master/dist). Then include `tesseract.js` on your page, and set `Tesseract.workerUrl` like this:


```html
<script src='/path/to/tesseract.js'></script>

<script>
Tesseract.workerUrl = 'http://www.absolute-path-to/tesseract.worker.js'

Tesseract.recognize('#my-image')
    .progress(function (p) { console.log('progress', p) })
    .then(function (result) { console.log('result', result) })
</script>
```


## npm
### TODO

<!-- ```shell
> npm install tesseract-js ?
```-->

# Docs

## ImageLike
The main Tesseract.js functions take an `image` parameter, which should be something that is 'image-like'. 
That means `image` should be 
- an `img` element or querySelector that matches an `img` element
- a `video` element or querySelector that matches a `video` element
- a `canvas` element or querySelector that matches a `canvas` element
- a CanvasRenderingContext2D (returned by `canvas.getContext('2d')`)
- the absolute `url` of an image from the same website that is running your script. Browser security policies don't allow access to the content of images from other websites :(


## Tesseract.recognize(image: [ImageLike](#imagelike)[, options]) -> [TesseractJob](#tesseractjob)
Figures out what words are in `image`, where the words are in `image`, etc.
- `image` is any [ImageLike](#imagelike) object.
- `options` is an optional flat json object. `options` may:
    + override some subset of the [default tesseract parameters](./tesseract_parameters.md)
    + specify a lang parameter that is one of 'afr', 'ara', 'aze', 'bel', 'ben', 'bul', 'cat', 'ces', 'chi_sim', 'chi_tra', 'chr', 'frak', 'dan', 'frak', 'deu', 'ell', 'eng', 'enm', 'epo', 'equ', 'est', 'eus', 'fin', 'fra', 'frk', 'frm', 'glg', 'grc', 'heb', 'hin', 'hrv', 'hun', 'ind', 'isl', 'ita', 'ita_old', 'jpn', 'kan', 'kor', 'lav', 'lit', 'mal', 'meme', 'mkd', 'mlt', 'msa', 'nld', 'nor', 'osd', 'pol', 'por', 'ron', 'rus', 'frak', 'slk', 'slv', 'spa', 'spa_old', 'sqi', 'srp', 'swa', 'swe', 'tam', 'tel', 'tgl', 'tha', 'tur', 'ukr', or 'vie'. The default is 'eng'.


Returns a [TesseractJob](#tesseractjob) whose `then`, `progress`, and `error` methods can be used to act on the result.

Example:
```javascript
Tesseract.recognize('#my-image')
.then(function(result){
    console.log(result)
})
```

## Tesseract.detect(image: [ImageLike](#imagelike)) -> [TesseractJob](#tesseractjob)
Figures out what script (e.g. 'Latin', 'Chinese') the words in  image are written in.
- `image` is any [ImageLike](#imagelike) object.

Returns a [TesseractJob](#tesseractjob) whose `then`, `progress`, and `error` methods can be used to act on the result of the script.


```javascript
Tesseract.detect('#my-image')
.then(function(result){
    console.log(result)
})
```


## TesseractJob
A TesseractJob is an an object returned by a call to recognize or detect.
All methods of a TesseractJob return itself to enable chaining. 

Typical use is: 
```javascript
var job1 = Tesseract.recognize('#my-image')

job1.progress(function(message){console.log(message)})
    .error(function(err){console.error(err)})
    .then(function(result){console.log(result)})
```

or more concisely:
```javascript
Tesseract.recognize('#my-image')
    .progress(function(message){console.log(message)})
    .error(function(err){console.error(err)})
    .then(function(result){console.log(result)})
```


### TesseractJob.progress(callback: function) -> TesseractJob
Sets `callback` as the function that will be called every time the job progresses. 

`callback` is a function with the signature `callback(progress)` where progress is json object.

For example: 
```javascript
Tesseract.recognize('#my-image')
    .progress(function(message){console.log('progress is: 'message)})
```

The console will show something like: 
```javascript
progress is: {loaded_lang_model: "eng", from_cache: true}
progress is: {initialized_with_lang: "eng"}
progress is: {set_variable: Object}
progress is: {set_variable: Object}
progress is: {recognized: 0}
progress is: {recognized: 0.3}
progress is: {recognized: 0.6}
progress is: {recognized: 0.9}
progress is: {recognized: 1}
```


### TesseractJob.then(callback: function) -> TesseractJob
Sets `callback` as the function that will be called if and when the job successfully completes. 

For example: 
```javascript
Tesseract.recognize('#my-image')
    .then(function(result){console.log('result is: 'result)})
```

The console will show something like: 
```javascript
progress is: {
    blocks: Array[1]
    confidence: 87
    html: "<div class='ocr_page' id='page_1' ..."
    lines: Array[3]
    oem: "DEFAULT"
    paragraphs: Array[1]
    psm: "SINGLE_BLOCK"
    symbols: Array[33]
    text: "Hello World↵from beyond↵the Cosmic Void↵↵"
    version: "3.04.00"
    words: Array[7]
}
```

### TesseractJob.error(callback: function) -> TesseractJob
Sets `callback` as the function that will be called if and when the job successfully completes. 


# Contributing
## Development
To run a development copy of tesseract.js, first clone this repo.
```shell
> git clone https://github.com/naptha/tesseract.js.git
```

Then, cd in to the folder, `npm install`, and `npm start`
```shell
> cd tesseract.js
> npm install && npm start

  ... a bunch of npm stuff ... 

  tesseract.js@1.0.0 start /Users/guillermo/Desktop/code_static/tesseract.js
  node devServer.js

Listening at http://localhost:7355
```

Then open `http://localhost:7355` in your favorite browser. The devServer automatically rebuilds tesseract.js and tesseract.worker.js when you change files in the src folder.

## Building Static Files
After you've cloned the repo and run `npm install` as described in the [Development Section](#development), you can build static library files in the dist folder with 
```shell
> npm run build
```

## Send us a Pull Request!