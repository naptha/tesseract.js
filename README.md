<p align="center">
  <a href="https://tesseract.projectnaptha.com/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./docs/images/tesseract_dark.png">
      <img width="256px" height="256px" alt="Tesseract.js" src="./docs/images/tesseract.png">
    </picture>
  </a>
</p>

![Lint & Test](https://github.com/naptha/tesseract.js/workflows/Node.js%20CI/badge.svg)
![CodeQL](https://github.com/naptha/tesseract.js/workflows/CodeQL/badge.svg)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://github.com/naptha/tesseract.js) 
[![Financial Contributors on Open Collective](https://opencollective.com/tesseractjs/all/badge.svg?label=financial+contributors)](https://opencollective.com/tesseractjs) [![npm version](https://badge.fury.io/js/tesseract.js.svg)](https://badge.fury.io/js/tesseract.js)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/naptha/tesseract.js/graphs/commit-activity)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Code Style](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
![npm](https://img.shields.io/npm/dm/tesseract.js?label=npm%20downloads)
![jsDelivr hits (npm)](https://img.shields.io/jsdelivr/npm/hm/tesseract.js?label=jsdelivr%20hits)

Tesseract.js is a javascript library that gets words in [almost any language](./docs/tesseract_lang_list.md) out of images. ([Demo](http://tesseract.projectnaptha.com/))

Image Recognition

[![fancy demo gif](./docs/images/demo.gif)](http://tesseract.projectnaptha.com)

Video Real-time Recognition

<p align="center">
  <a href="https://github.com/jeromewu/tesseract.js-video"><img alt="Tesseract.js Video" src="./docs/images/video-demo.gif"></a>
</p>


Tesseract.js wraps a [webassembly port](https://github.com/naptha/tesseract.js-core) of the [Tesseract](https://github.com/tesseract-ocr/tesseract) OCR Engine.
It works in the browser using [webpack](https://webpack.js.org/) or plain script tags with a [CDN](#CDN) and on the server with [Node.js](https://nodejs.org/en/).
After you [install it](#installation), using it is as simple as:

```javascript
import Tesseract from 'tesseract.js';

Tesseract.recognize(
  'https://tesseract.projectnaptha.com/img/eng_bw.png',
  'eng',
  { logger: m => console.log(m) }
).then(({ data: { text } }) => {
  console.log(text);
})
```

Or using workers (recommended for production use):

```javascript
import { createWorker } from 'tesseract.js';

const worker = await createWorker({
  logger: m => console.log(m)
});

(async () => {
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  console.log(text);
  await worker.terminate();
})();
```

For a basic overview of the functions, including the pros/cons of different approaches, see the [intro](./docs/intro.md).  [Check out the docs](#documentation) for a full explanation of the API.
 
## Major changes in v4
Version 4 includes many new features and bug fixes--see [this issue](https://github.com/naptha/tesseract.js/issues/662) for a full list.  Several highlights are below. 

- Added rotation preprocessing options (including auto-rotate) for significantly better accuracy
- Processed images (rotated, grayscale, binary) can now be retrieved
- Improved support for parallel processing (schedulers)
- Breaking changes:
  - `createWorker` is now async
  - `getPDF` function replaced by `pdf` recognize option

## Major changes in v3
- Significantly faster performance
   - Runtime reduction of 84% for Browser and 96% for Node.js when recognizing the [example images](./examples/data)
- Upgrade to Tesseract v5.1.0 (using emscripten 3.1.18)
- Added SIMD-enabled build for supported devices
- Added support:
   - Node.js version 18
- Removed support:
   - ASM.js version, any other old versions of Tesseract.js-core (<3.0.0) 
   - Node.js versions 10 and 12

## Major changes in v2
- Upgrade to tesseract v4.1.1 (using emscripten 1.39.10 upstream)
- Support multiple languages at the same time, eg: eng+chi\_tra for English and Traditional Chinese
- Supported image formats: png, jpg, bmp, pbm
- Support WebAssembly (fallback to ASM.js when browser doesn't support)
- Support Typescript

Read a story about v2: <a href="https://jeromewu.github.io/why-i-refactor-tesseract.js-v2/">Why I refactor tesseract.js v2?</a><br>
  Check the <a href="https://github.com/naptha/tesseract.js/tree/support/1.x">support/1.x</a> branch for version 1
## Installation
Tesseract.js works with a `<script>` tag via local copy or CDN, with webpack via `npm` and on Node.js with `npm/yarn`.


### CDN
```html
<!-- v4 -->
<script src='https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js'></script>
```
After including the script the `Tesseract` variable will be globally available.


### Node.js

**Requires Node.js v14 or higher**

```shell
# For latest version
npm install tesseract.js
yarn add tesseract.js

# For old versions
npm install tesseract.js@3.0.3
yarn add tesseract.js@3.0.3
```


## Documentation

* [Intro](./docs/intro.md)
* [Examples](./docs/examples.md)
* [Image Format](./docs/image-format.md)
* [API](./docs/api.md)
* [Local Installation](./docs/local-installation.md)
* [FAQ](./docs/faq.md)

## Use tesseract.js the way you like!

- Electron Version: https://github.com/Balearica/tesseract.js-electron
- Chrome Extension (with Manifest V3): https://github.com/Tshetrim/Image-To-Text-OCR-extension-for-ChatGPT
- Converting PDF to text: https://github.com/racosa/pdf2text-ocr

The following are old examples that use depreciated versions of Tesseract.js.  Updating to Tesseract.js v4 is highly recommended.  Users are encouraged to create updated examples (or make entirely new ones) and submit them as pull requests. 
- Offline Version: https://github.com/jeromewu/tesseract.js-offline
- Custom Traineddata: https://github.com/jeromewu/tesseract.js-custom-traineddata
- Firefox Extension: https://github.com/gnonio/korporize
- With Vue: https://github.com/jeromewu/tesseract.js-vue-app
- With Angular: https://github.com/jeromewu/tesseract.js-angular-app
- With React: https://github.com/jeromewu/tesseract.js-react-app
- Typescript: https://github.com/jeromewu/tesseract.js-typescript
- Video Real-time Recognition: https://github.com/jeromewu/tesseract.js-video

React Native is **not** supported as it does not support Webassembly.

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
It will automatically rebuild `tesseract.dev.js` and `worker.dev.js` when you change files in the **src** folder.

### Online Setup with a single Click

You can use Gitpod(A free online VS Code like IDE) for contributing. With a single click it will launch a ready to code workspace with the build & start scripts already in process and within a few seconds it will spin up the dev server so that you can start contributing straight away without wasting any time. 

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/naptha/tesseract.js/blob/master/examples/browser/demo.html)

### Building Static Files
To build the compiled static files just execute the following:
```shell
npm run build
```
This will output the files into the `dist` directory.

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/naptha/tesseract.js/graphs/contributors"><img src="https://opencollective.com/tesseractjs/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/tesseractjs/contribute)]

#### Individuals

<a href="https://opencollective.com/tesseractjs"><img src="https://opencollective.com/tesseractjs/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/tesseractjs/contribute)]

<a href="https://opencollective.com/tesseractjs/organization/0/website"><img src="https://opencollective.com/tesseractjs/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/tesseractjs/organization/1/website"><img src="https://opencollective.com/tesseractjs/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/tesseractjs/organization/2/website"><img src="https://opencollective.com/tesseractjs/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/tesseractjs/organization/3/website"><img src="https://opencollective.com/tesseractjs/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/tesseractjs/organization/4/website"><img src="https://opencollective.com/tesseractjs/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/tesseractjs/organization/5/website"><img src="https://opencollective.com/tesseractjs/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/tesseractjs/organization/6/website"><img src="https://opencollective.com/tesseractjs/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/tesseractjs/organization/7/website"><img src="https://opencollective.com/tesseractjs/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/tesseractjs/organization/8/website"><img src="https://opencollective.com/tesseractjs/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/tesseractjs/organization/9/website"><img src="https://opencollective.com/tesseractjs/organization/9/avatar.svg"></a>
