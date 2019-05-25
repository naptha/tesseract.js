# [Tesseract.js](http://tesseract.projectnaptha.com/)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Code Style](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/naptha/tesseract.js/graphs/commit-activity)

[![Build Status](https://travis-ci.org/naptha/tesseract.js.svg?branch=master)](https://travis-ci.org/naptha/tesseract.js)
[![npm version](https://badge.fury.io/js/tesseract.js.svg)](https://badge.fury.io/js/tesseract.js)
[![Downloads Total](https://img.shields.io/npm/dt/tesseract.js.svg)](https://www.npmjs.com/package/tesseract.js)
[![Downloads Month](https://img.shields.io/npm/dm/tesseract.js.svg)](https://www.npmjs.com/package/tesseract.js)

**Tesseract.js v2 is now available and under development in master branch, check [support/1.x](https://github.com/naptha/tesseract.js/tree/support/1.x) branch for v1.**

Tesseract.js is a javascript library that gets words in [almost any language](./docs/tesseract_lang_list.md) out of images. ([Demo](http://tesseract.projectnaptha.com/))

[![fancy demo gif](./docs/images/demo.gif)](http://tesseract.projectnaptha.com)

Tesseract.js works with script tags, [webpack](https://webpack.js.org/), and [Node.js](https://nodejs.org/en/). [After you install it](#installation), using it is as simple as

```javascript
import { TesseractWorker } from 'tesseract.js';
const worker = new TesseractWorker();

worker.recognize(myImage)
  .progress((p) => { console.log('progress', p);    })
  .then((result) => { console.log('result', result); });
```

[Check out the docs](#docs) for a full treatment of the API.

## Provenance
Tesseract.js wraps an [emscripten](https://github.com/kripken/emscripten) [port](https://github.com/naptha/tesseract.js-core) of the [Tesseract](https://github.com/tesseract-ocr/tesseract) [OCR](https://en.wikipedia.org/wiki/Optical_character_recognition) Engine.


# Installation
Tesseract.js works with a `<script>` tag via local copy or CDN, with webpack via `npm`, and on Node.js via `npm`. [Check out the docs](#docs) for a full treatment of the API.

## CDN 

You can simply include Tesseract.js with a CDN like this:
```html
<script src='https://unpkg.com/tesseract.js@v2.0.0-alpha.10/dist/tesseract.min.js'></script>
```

After including your scripts, the `Tesseract` variable will be defined globally!

## npm

### 2.x

Major Changes

- Upgrade to tesseract v4
- Support multiple languages, ex: eng+chi_tra
- Support image formats: png, jpg, bmp, pbm

```shell
> yarn add tesseract.js@next
```
or
```
> npm install tesseract.js@next --save
```

### 1.x

```shell
> yarn add tesseract.js
```
or
```
> npm install tesseract.js --save
```

> Note: Tesseract.js currently requires Node.js v6.8.0 or higher.

# Documentation

* [Examples](./docs/examples.md)
* [Image Format](./docs/image-format.md)
* [API](./docs/api.md)
* [Local Installation](./docs/local-installation.md)
* [FAQ](./docs/faq.md)

# Contributing

## Development
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
    http://127.0.0.1:3000
    http://[your ip]:3000

```

Then open `http://localhost:3000/examples/browser/demo.html` in your favorite browser. The devServer automatically rebuilds `tesseract.dev.js` and `worker.min.js` when you change files in the src folder.

## Building Static Files
After you've cloned the repo and run `npm install` as described in the [Development Section](#development), you can build static library files in the dist folder with

```shell
> npm run build
```
