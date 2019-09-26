# Image Format

Support Format: **bmp, jpg, png, pbm**

The main Tesseract.js functions (ex. recognize, detect) take an `image` parameter, which should be something that is like an image. What's considered "image-like" differs depending on whether it is being run from the browser or through NodeJS.

On a browser, an image can be:
- an `img`, `video`, or `canvas` element
- a `File` object (from a file `<input>`)
- a `Blob` object
- a path or URL to an accessible image
- a base64 encoded image fits `data:image\/([a-zA-Z]*);base64,([^"]*)` regexp

In Node.js, an image can be
- a path to a local image
- a Buffer storing binary image 
- a base64 encoded image fits `data:image\/([a-zA-Z]*);base64,([^"]*)` regexp
