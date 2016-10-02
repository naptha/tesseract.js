> # UNDER CONTRUCTION
> ## Due for Release on Monday, Oct 3, 2016

# tesseract.js
Tesseract.js is a pure javascript version of the Tesseract OCR Engine that can recognize English, Chinese, Russian, and 60 other languages.

<!-- ![alt text]( "Logo Title Text 1") -->

# Installation
Tesseract.js works with a `<script>` tag via local copy or cdn, or with `npm` (if you're using webpack / browserify).

## Script Tag

### CDN

```html
<script src='https://cdn.rawgit.com/naptha/tesseract.js/5ed4c0bc/dist/tesseract.js'></script>

<script>
var worker = createTesseractWorker('https://cdn.rawgit.com/naptha/tesseract.js/5ed4c0bc/dist/tesseract.worker.js')

worker.recognize('#my-image')
    .progress(function (p) { console.log('progress', p) })
    .then(function (result) { console.log('result', result) })
</script>
```


### Local
First grab copies of `tesseract.js` and `tesseract.worker.js` from the [dist folder](https://github.com/naptha/tesseract.js/tree/master/dist). Then include `tesseract.js` on your page like this:


```html
<script src='/path/to/tesseract.js'></script>

<script>
var worker = createTesseractWorker('/path/to/tesseract.worker.js')

worker.recognize('#my-image')
    .progress(function (p) { console.log('progress', p) })
    .then(function (result) { console.log('result', result) })
</script>
```


## npm
###TODO

<!-- ```shell
> npm install tesseract-js ?
```-->

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
