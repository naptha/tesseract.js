# [Tesseract.js](http://tesseract.projectnaptha.com/)

[![NPM version][tesseractjs-npm-image]][tesseractjs-npm-url]

[tesseractjs-npm-image]: https://img.shields.io/npm/v/tesseract.js.svg
[tesseractjs-npm-url]: https://npmjs.org/package/tesseract.js

Tesseract.js is a javascript library that gets words in [almost any language](./docs/tesseract_lang_list.md) out of images. ([Demo](http://tesseract.projectnaptha.com/))

[![fancy demo gif](https://github.com/naptha/tesseract.js/blob/master/demo.gif)](http://tesseract.projectnaptha.com)

Tesseract.js works with script tags, [webpack](https://webpack.js.org/)/[Browserify](http://browserify.org/), and [Node.js](https://nodejs.org/en/). [After you install it](#installation), using it is as simple as

  ```javascript
Tesseract.recognize(myImage)
         .progress(function  (p) { console.log('progress', p)    })
         .then(function (result) { console.log('result', result) })
```

[Check out the docs](#docs) for a full treatment of the API.

## Provenance
Tesseract.js wraps an [emscripten](https://github.com/kripken/emscripten) [port](https://github.com/naptha/tesseract.js-core) of the [Tesseract](https://github.com/tesseract-ocr/tesseract) [OCR](https://en.wikipedia.org/wiki/Optical_character_recognition) Engine.


# Installation
Tesseract.js works with a `<script>` tag via local copy or CDN, with webpack and Browserify via `npm`, and on Node.js via `npm`. [Check out the docs](#docs) for a full treatment of the API.

## &lt;script />

You can simply include Tesseract.js with a CDN like this:
```html
<script src='https://cdn.jsdelivr.net/gh/naptha/tesseract.js@v1.0.14/dist/tesseract.min.js'></script>
```

After including your scripts, the `Tesseract` variable will be defined globally!

## Dependency
First:
```shell
> yarn add tesseract.js
```
or
```
> npm install tesseract.js --save
```
> Note: Tesseract.js currently requires Node.js v6.8.0 or higher.


## Usage
```javascript
var Tesseract = require('tesseract.js')
```

or
```javascript
import Tesseract from 'tesseract.js'
```


# Docs

* [Tesseract.recognize](#tesseractrecognizeimage-imagelike-options---tesseractjob)
  + [Simple Example](#simple-example)
  + [More Complicated Example](#more-complicated-example)
* [Tesseract.detect](#tesseractdetectimage-imagelike---tesseractjob)
* [ImageLike](#imagelike)
* [TesseractJob](#tesseractjob)
  + [TesseractJob.progress](#tesseractjobprogresscallback-function---tesseractjob)
  + [TesseractJob.then](#tesseractjobthencallback-function---tesseractjob)
  + [TesseractJob.catch](#tesseractjobcatchcallback-function---tesseractjob)
  + [TesseractJob.finally](#tesseractjobfinallycallback-function---tesseractjob)
* [Local Installation](#local-installation)
  + [corePath](#corepath)
  + [workerPath](#workerpath)
  + [langPath](#langpath)
* [Contributing](#contributing)
  + [Development](#development)
  + [Building Static Files](#building-static-files)
  + [Send us a Pull Request!](#send-us-a-pull-request)


## Tesseract.recognize(image: [ImageLike](#imagelike)[, options]) -> [TesseractJob](#tesseractjob)
Figures out what words are in `image`, where the words are in `image`, etc.
> Note: `image` should be sufficiently high resolution.
> Often, the same image will get much better results if you upscale it before calling `recognize`.

- `image` is any [ImageLike](#imagelike) object.
- `options` is either absent (in which case it is interpreted as `'eng'`), a string specifing a language short code from the [language list](./docs/tesseract_lang_list.md), or a flat json object that may:
    + include properties that override some subset of the [default tesseract parameters](./docs/tesseract_parameters.md)
    + include a `lang` property with a value from the [list of lang parameters](./docs/tesseract_lang_list.md)

Returns a [TesseractJob](#tesseractjob) whose `then`, `progress`, `catch` and `finally` methods can be used to act on the result.

### Simple Example:
```javascript
Tesseract.recognize(myImage)
.then(function(result){
    console.log(result)
})
```

### More Complicated Example:
```javascript
// if we know our image is of spanish words without the letter 'e':
Tesseract.recognize(myImage, {
    lang: 'spa',
    tessedit_char_blacklist: 'e'
})
.then(function(result){
    console.log(result)
})
```




## Tesseract.detect(image: [ImageLike](#imagelike)) -> [TesseractJob](#tesseractjob)

Figures out what script (e.g. 'Latin', 'Chinese') the words in  image are written in.

- `image` is any [ImageLike](#imagelike) object.

Returns a [TesseractJob](#tesseractjob) whose `then`, `progress`, `catch` and `finally` methods can be used to act on the result of the script.


```javascript
Tesseract.detect(myImage)
.then(function(result){
    console.log(result)
})
```


## ImageLike

The main Tesseract.js functions take an `image` parameter, which should be something that is like an image. What's considered "image-like" differs depending on whether it is being run from the browser or through NodeJS.


On a browser, an image can be:
- an `img`, `video`, or `canvas` element
- a CanvasRenderingContext2D (returned by `canvas.getContext('2d')`)
- a `File` object (from a file `<input>` or drag-drop event)
- a `Blob` object
- a `ImageData` instance (an object containing `width`, `height` and `data` properties)
- a path or URL to an accessible image (the image must either be hosted locally or accessible by CORS)




In Node.js, an image can be
- a path to a local image
- a `Buffer` instance containing a `PNG` or `JPEG` image
- a `ImageData` instance (an object containing `width`, `height` and `data` properties)


## TesseractJob

A TesseractJob is an object returned by a call to `recognize` or `detect`. It's inspired by the ES6 Promise interface and provides `then` and `catch` methods. It also provides `finally` method, which will be fired regardless of the job fate. One important difference is that these methods return the job itself (to enable chaining) rather than new.

Typical use is:
```javascript
Tesseract.recognize(myImage)
    .progress(message => console.log(message))
    .catch(err => console.error(err))
    .then(result => console.log(result))
    .finally(resultOrError => console.log(resultOrError))
```

Which is equivalent to:
```javascript
var job1 = Tesseract.recognize(myImage);

job1.progress(message => console.log(message));

job1.catch(err => console.error(err));

job1.then(result => console.log(result));

job1.finally(resultOrError => console.log(resultOrError));
```



### TesseractJob.progress(callback: function) -> TesseractJob
Sets `callback` as the function that will be called every time the job progresses.
- `callback` is a function with the signature `callback(progress)` where `progress` is a json object.

For example:
```javascript
Tesseract.recognize(myImage)
    .progress(function(message){console.log('progress is: ', message)})
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
- `callback` is a function with the signature `callback(result)` where `result` is a json object.


For example:
```javascript
Tesseract.recognize(myImage)
    .then(function(result){console.log('result is: ', result)})
```

The console will show something like:
```javascript
result is: {
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

### TesseractJob.catch(callback: function) -> TesseractJob
Sets `callback` as the function that will be called if the job fails.
- `callback` is a function with the signature `callback(error)` where `error` is a json object.

### TesseractJob.finally(callback: function) -> TesseractJob
Sets `callback` as the function that will be called regardless if the job fails or success.
- `callback` is a function with the signature `callback(resultOrError)` where `resultOrError` is a json object.

## Local Installation

In the browser, `tesseract.js` simply provides the API layer. Internally, it opens a WebWorker to handle requests. That worker itself loads code from the Emscripten-built `tesseract.js-core` which itself is hosted on a CDN. Then it dynamically loads language files hosted on another CDN.

Because of this we recommend loading `tesseract.js` from a CDN. But if you really need to have all your files local, you can use the `Tesseract.create` function which allows you to specify custom paths for workers, languages, and core.

```javascript
window.Tesseract = Tesseract.create({
    workerPath: '/path/to/worker.js',
    langPath: 'https://tessdata.projectnaptha.com/3.02/',
    corePath: 'https://cdn.jsdelivr.net/gh/naptha/tesseract.js-core@0.1.0/index.js',
})
```

### corePath
A string specifying the location of the [tesseract.js-core library](https://github.com/naptha/tesseract.js-core), with default value 'https://cdn.jsdelivr.net/gh/naptha/tesseract.js-core@0.1.0/index.js'. Set this string before calling `Tesseract.recognize` and `Tesseract.detect` if you want Tesseract.js to use a different file.

### workerPath
A string specifying the location of the [worker.js](./dist/worker.js) file. Set this string before calling `Tesseract.recognize` and `Tesseract.detect` if you want Tesseract.js to use a different file.

### langPath
A string specifying the location of the tesseract language files, with default value 'https://cdn.jsdelivr.net/gh/naptha/tessdata@gh-pages/3.02/'. Language file URLs are calculated according to the formula `langPath + langCode + '.traineddata.gz'`. Set this string before calling `Tesseract.recognize` and `Tesseract.detect` if you want Tesseract.js to use different language files.


## Contributing
### Development
To run a development copy of tesseract.js, first clone this repo.
```shell
> git clone https://github.com/naptha/tesseract.js.git
```

Then, `cd tesseract.js && npm install && npm start`
```shell
> cd tesseract.js
> npm install && npm start

  ... a bunch of npm stuff ...

  Starting up http-server, serving ./
  Available on:
    http://127.0.0.1:7355
    http://[your ip]:7355

```

Then open `http://localhost:7355/examples/file-input/demo.html` in your favorite browser. The devServer automatically rebuilds `tesseract.js` and `tesseract.worker.js` when you change files in the src folder.

### Building Static Files
After you've cloned the repo and run `npm install` as described in the [Development Section](#development), you can build static library files in the dist folder with
```shell
> npm run build
```

### Send us a Pull Request!
Thanks :)
