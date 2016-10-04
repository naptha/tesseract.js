> # UNDER CONTRUCTION
> ## Due for Release on ~~Monday, Oct 3, 2016~~ Tuesday, Oct 4, 2016

# [Tesseract.js](http://tesseract.projectnaptha.com/)

Tesseract.js is a javascript library that gets words in [almost any language](./tesseract_lang_list.md)* out of images.

![fancy demo gif](http://placehold.it/700x300 "jhgfjhgf")

The tesseract API is dead simple, and looks like this: 
```javascript
Tesseract.recognize('#my-image')
    .progress(function (p) { console.log('progress', p) })
    .then(function (result) { console.log('result', result) })
```

[Check out the docs](#docs) for a full treatment of the API.

Under the hood, Tesseract.js wraps an [emscripten](https://github.com/kripken/emscripten) port of the [Tesseract OCR Engine](https://github.com/tesseract-ocr/tesseract).


# Installation
Tesseract.js works with a `<script>` tag via local copy or cdn, with webpack and browserify via `npm`, and on node via `npm`. [Check out the docs](#docs) for a full treatment of the API.

## Script Tag

You can either include Tesseract.js on you page with a cdn like this:
```html
<script src='https://cdn.rawgit.com/naptha/tesseract.js/a01d2a2/dist/tesseract.js'></script>
```

Or you can grab copies of `tesseract.js` and `tesseract.worker.js` from the [dist folder](https://github.com/naptha/tesseract.js/tree/master/dist) and include your local copies like this:
```html
<script src='/path/to/tesseract.js'></script>

<script>
Tesseract.workerUrl = 'http://www.absolute-path-to/tesseract.worker.js'
</script>
```

After including your scripts, the `Tesseract` variable should be defined! You can [head to the docs](#docs) for a full treatment of the API.

## npm
### TODO
walp

# Docs 

* [Tesseract.recognize(image: ImageLike[, options]) -> [TesseractJob](#tesseractjob)](#tesseractrecognizeimage-imagelike-options---tesseractjob)
  + [Simple Example](#simple-example)
  + [More Complicated Example](#more-complicated-example)
* [Tesseract.detect(image: ImageLike) -> [TesseractJob](#tesseractjob)](#tesseractdetectimage-imagelike---tesseractjob)
* [ImageLike](#imagelike)
* [TesseractJob](#tesseractjob)
  + [TesseractJob.progress(callback: function) -> TesseractJob](#tesseractjobprogresscallback-function---tesseractjob)
  + [TesseractJob.then(callback: function) -> TesseractJob](#tesseractjobthencallback-function---tesseractjob)
  + [TesseractJob.error(callback: function) -> TesseractJob](#tesseractjoberrorcallback-function---tesseractjob)
* [Tesseract Remote File Options](#tesseract-remote-file-options)
  + [Tesseract.coreUrl](#tesseractcoreurl)
  + [Tesseract.workerUrl](#tesseractworkerurl)
  + [Tesseract.langUrl](#tesseractlangurl)



## Tesseract.recognize(image: [ImageLike](#imagelike)[, options]) -> [TesseractJob](#tesseractjob)
Figures out what words are in `image`, where the words are in `image`, etc.
- `image` is any [ImageLike](#imagelike) object.
- `options` is an optional flat json object. `options` may:
    + include properties that override some subset of the [default tesseract parameters](./tesseract_parameters.md)
    + include a `lang` property with a value from the [list of lang parameters](./tesseract_lang_list.md)

Returns a [TesseractJob](#tesseractjob) whose `then`, `progress`, and `error` methods can be used to act on the result.

### Simple Example:
```javascript
Tesseract.recognize('#my-image')
.then(function(result){
    console.log(result)
})
```

### More Complicated Example:
```javascript
// if we know our image is of spanish words without the letter 'e':
Tesseract.recognize('#my-image', {
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

Returns a [TesseractJob](#tesseractjob) whose `then`, `progress`, and `error` methods can be used to act on the result of the script.


```javascript
Tesseract.detect('#my-image')
.then(function(result){
    console.log(result)
})
```


## ImageLike
The main Tesseract.js functions take an `image` parameter, which should be something that is 'image-like'. 
That means `image` should be 
- an `img` element or querySelector that matches an `img` element
- a `video` element or querySelector that matches a `video` element
- a `canvas` element or querySelector that matches a `canvas` element
- a CanvasRenderingContext2D (returned by `canvas.getContext('2d')`)
- the absolute `url` of an image from the same website that is running your script. Browser security policies don't allow access to the content of images from other websites :(


## TesseractJob
A TesseractJob is an an object returned by a call to recognize or detect.
All methods of a given TesseractJob return that TesseractJob to enable chaining. 

Typical use is: 
```javascript
Tesseract.recognize('#my-image')
    .progress(function(message){console.log(message)})
    .error(function(err){console.error(err)})
    .then(function(result){console.log(result)})
```

Which is equivalent to:
```javascript
var job1 = Tesseract.recognize('#my-image');

job1.progress(function(message){console.log(message)});

job1.error(function(err){console.error(err)});

job1.then(function(result){console.log(result)})
```



### TesseractJob.progress(callback: function) -> TesseractJob
Sets `callback` as the function that will be called every time the job progresses. 
- `callback` is a function with the signature `callback(progress)` where `progress` is a json object.

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
- `callback` is a function with the signature `callback(result)` where `result` is a json object.


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
Sets `callback` as the function that will be called if the job fails. 
- `callback` is a function with the signature `callback(erros)` where `error` is a json object.

## Tesseract Remote File Options
### Tesseract.coreUrl
A string specifying the location of the [tesseract.js-core library](https://github.com/naptha/tesseract.js-core), with default value 'https://cdn.rawgit.com/naptha/tesseract.js-core/master/index.js'. Set this string before calling `Tesseract.recognize` and `Tesseract.detect` if you want Tesseract.js to use a different file.

For example:
```javascript
Tesseract.coreUrl = 'https://absolute-path-to/tesseract.js-core/index.js'
```

### Tesseract.workerUrl
A string specifying the location of the [tesseract.worker.js](./dist/tesseract.worker.js) file, with default value 'https://cdn.rawgit.com/naptha/tesseract.js/8b915dc/dist/tesseract.worker.js'. Set this string before calling `Tesseract.recognize` and `Tesseract.detect` if you want Tesseract.js to use a different file.

For example:
```javascript
Tesseract.workerUrl = 'https://absolute-path-to/tesseract.worker.js'
```


### Tesseract.langUrl
A string specifying the location of the tesseract language files, with default value 'https://cdn.rawgit.com/naptha/tessdata/gh-pages/3.02/'. Language file urls are calculated according to the formula `Tesseract.langUrl + lang + '.traineddata.gz'`. Set this string before calling `Tesseract.recognize` and `Tesseract.detect` if you want Tesseract.js to use different language files.

In the following exampple, Tesseract.js will download the language file from 'https://absolute-path-to/lang/folder/rus.traineddata.gz':
```javascript
Tesseract.langUrl = 'https://absolute-path-to/lang/folder/'

Tesseract.recognize('#my-im', {
    lang: 'rus'
})
```




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
Thanks :)