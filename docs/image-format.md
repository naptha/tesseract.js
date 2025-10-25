# Image Format

The main Tesseract.js functions (ex. recognize, detect) take an `image` parameter.  The image formats and data types supported are listed below. 

Support Image Formats: **bmp, jpg, png, pbm, webp, gif \[non-animated\]**.

For browser and Node, supported data types are:
 - string with base64 encoded image (fits `data:image\/([a-zA-Z]*);base64,([^"]*)` regexp)
 - buffer

For browser only, supported data types are:
 - `File` or `Blob` object
 - `img` or `canvas` element

For Node only, supported data types are:
 - string containing a path to local image

Note: images must be a supported image format **and** a supported data type.  For example, a buffer containing a png image is supported.  A buffer containing raw pixel data is not supported. 
