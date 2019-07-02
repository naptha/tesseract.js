<p align="center">
<a href="https://tesseract.projectnaptha.com/"><img alt="Tesseract.js" src="https://tesseract.projectnaptha.com/img/logo_small.png"></a>
</p>

[![Build Status](https://travis-ci.org/naptha/tesseract.js.svg?branch=master)](https://travis-ci.org/naptha/tesseract.js)
[![npm version](https://badge.fury.io/js/tesseract.js.svg)](https://badge.fury.io/js/tesseract.js)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/naptha/tesseract.js/graphs/commit-activity)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Code Style](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![Downloads Total](https://img.shields.io/npm/dt/tesseract.js.svg)](https://www.npmjs.com/package/tesseract.js)
[![Downloads Month](https://img.shields.io/npm/dm/tesseract.js.svg)](https://www.npmjs.com/package/tesseract.js)

<h3 align="center">
  Version 2 is now available and under development in the master branch<br>
  Check the <a href="https://github.com/naptha/tesseract.js/tree/support/1.x">support/1.x</a> branch for version 1
</h3>

<br>

Tesseract.js is a javascript library that gets words in [almost any language](./docs/tesseract_lang_list.md) out of images. ([Demo](http://tesseract.projectnaptha.com/))

[![fancy demo gif](./docs/images/demo.gif)](http://tesseract.projectnaptha.com)

Tesseract.js wraps an [emscripten](https://github.com/kripken/emscripten) [port](https://github.com/naptha/tesseract.js-core) of the [Tesseract](https://github.com/tesseract-ocr/tesseract) [OCR](https://en.wikipedia.org/wiki/Optical_character_recognition) Engine.
It works in the browser using [webpack](https://webpack.js.org/) or plain script tags with a [#CDN](CDN) and on the server with [Node.js](https://nodejs.org/en/).
After you [install it](#installation), using it is as simple as:

```javascript
import { TesseractWorker } from 'tesseract.js';
const worker = new TesseractWorker();

worker.recognize(myImage)
  .progress(progress => {
    console.log('progress', progress);
  }).then(result => {
    console.log('result', result);
  });
```

[Check out the docs](#docs) for a full explanation of the API.


## Major changes in v2
- Upgrade to tesseract v4
- Support multiple languages at the same time, eg: eng+chi_tra for English and Traditional Chinese
- Supported image formats: png, jpg, bmp, pbm


## Installation
Tesseract.js works with a `<script>` tag via local copy or CDN, with webpack via `npm` and on Node.js with `npm/yarn`.


### CDN
```html
<!-- v2 -->
<script src='https://unpkg.com/tesseract.js@v2.0.0-alpha.11/dist/tesseract.min.js'></script>

<!-- v1 -->
<script src='https://unpkg.com/tesseract.js@1.0.19/src/index.js'></script>
```
After including the script the `Tesseract` variable will be globally available.


### Node.js

**Tesseract.js currently requires Node.js v6.8.0 or higher**

```shell
# For v2
npm install tesseract.js@next
yarn add tesseract.js@next

# For v1
npm install tesseract.js
yarn add tesseract.js
```


## Documentation

* [Examples](./docs/examples.md)
* [Image Format](./docs/image-format.md)
* [API](./docs/api.md)
* [Local Installation](./docs/local-installation.md)
* [FAQ](./docs/faq.md)


## Contributing

### Development
To run a development copy of Tesseract.js do the following:
```shell
# First we clone the repository
git clone https://github.com/naptha/tesseract.js.git
cd tesseract.js

# Then we install the dependencies
npm install

# And finally we start the development server
npm start
```

The development server will be available at http://localhost:3000/examples/browser/demo.html in your favorite browser.
It will automatically rebuild `tesseract.dev.js` and `worker.min.js` when you change files in the src folder.

### Building Static Files
To build the compiled static files just execute the following:
```shell
npm run build
```
This will output the files into the `dist` directory.
