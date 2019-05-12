# API

## TesseractWorker.recognize(image, lang, [, options]) -> [TesseractJob](#tesseractjob)
Figures out what words are in `image`, where the words are in `image`, etc.
> Note: `image` should be sufficiently high resolution.
> Often, the same image will get much better results if you upscale it before calling `recognize`.

- `image` see [Image Format](./image-format.md) for more details.
- `lang` property with a value from the [list of lang parameters](./tesseract_lang_list.md), you can use multiple languages separated by '+', ex. `eng+chi_tra`
- `options` a flat json object that may include properties that override some subset of the [default tesseract parameters](./tesseract_parameters.md)

Returns a [TesseractJob](#tesseractjob) whose `then`, `progress`, `catch` and `finally` methods can be used to act on the result.

### Simple Example:
```javascript
const worker = new Tesseract.TesseractWorker();
worker
  .recognize(myImage)
  .then(function(result){
    console.log(result);
  });
```

### More Complicated Example:
```javascript
const worker = new Tesseract.TesseractWorker();
// if we know our image is of spanish words without the letter 'e':
worker
  .recognize(myImage, 'spa', {
    tessedit_char_blacklist: 'e',
  })
  .then(function(result){
    console.log(result);
  });
```

## TesseractWorker.detect(image) -> [TesseractJob](#tesseractjob)

Figures out what script (e.g. 'Latin', 'Chinese') the words in  image are written in.

- `image` see [Image Format](./image-format.md) for more details.

Returns a [TesseractJob](#tesseractjob) whose `then`, `progress`, `catch` and `finally` methods can be used to act on the result of the script.

```javascript
const worker = new Tesseract.TesseractWorker();
worker
  .detect(myImage)
  .then(function(result){
    console.log(result);
  });
```

## TesseractJob

A TesseractJob is an object returned by a call to `recognize` or `detect`. It's inspired by the ES6 Promise interface and provides `then` and `catch` methods. It also provides `finally` method, which will be fired regardless of the job fate. One important difference is that these methods return the job itself (to enable chaining) rather than new.

Typical use is:
```javascript
const worker = new Tesseract.TesseractWorker();
worker.recognize(myImage)
  .progress(message => console.log(message))
  .catch(err => console.error(err))
  .then(result => console.log(result))
  .finally(resultOrError => console.log(resultOrError));
```

Which is equivalent to:
```javascript
const worker = new Tesseract.TesseractWorker();
const job1 = worker.recognize(myImage);

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
const worker = new Tesseract.TesseractWorker();
worker.recognize(myImage)
  .progress(function(message){console.log('progress is: ', message)});
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
const worker = new Tesseract.TesseractWorker();
worker.recognize(myImage)
  .then(function(result){console.log('result is: ', result)});
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
