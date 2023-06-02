const bmp = require('bmp-js');

/**
 * setImage
 *
 * @name setImage
 * @function set image in tesseract for recognition
 * @access public
 */
module.exports = (TessModule, api, image, angle = 0) => {
  // Check for bmp magic numbers (42 and 4D in hex)
  const isBmp = (image[0] === 66 && image[1] === 77) || (image[1] === 66 && image[0] === 77);

  const exif = image.slice(0, 500).toString().match(/\x01\x12\x00\x03\x00\x00\x00\x01\x00(.)/)?.[1]?.charCodeAt(0) || 1;

  // /*
  //  * Leptonica supports some but not all bmp files
  //  * @see https://github.com/DanBloomberg/leptonica/issues/607#issuecomment-1068802516
  //  * We therefore use bmp-js to convert all bmp files into a format Leptonica is known to support
  //  */
  if (isBmp) {
    // Not sure what this line actually does, but removing breaks the function
    const buf = Buffer.from(Array.from({ ...image, length: Object.keys(image).length }));
    const bmpBuf = bmp.decode(buf);
    TessModule.FS.writeFile('/input', bmp.encode(bmpBuf).data);
  } else {
    TessModule.FS.writeFile('/input', image);
  }

  const res = api.SetImageFile(exif, angle);
  if (res === 1) throw Error('Error attempting to read image.');
};
