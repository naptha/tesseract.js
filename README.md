> # UNDER CONTRUCTION
> ## Due for Release on Monday, Oct 3, 2016

# tesseract.js
Tesseract.js is a pure javascript version of the Tesseract OCR Engine that can recognize English, Chinese, Russian, and 60 other languages.

<!-- ![alt text]( "Logo Title Text 1") -->

# Installation
Tesseract.js works with a `<script>` tag via local copy or cdn, or with `npm` (if you're using webpack / browserify).

## `<script/>`

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
```shell
npm install tesseract
```