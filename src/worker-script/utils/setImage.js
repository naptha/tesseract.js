const bmp = require('bmp-js');
const fileType = require('file-type');

/**
 * setImage
 *
 * @name setImage
 * @function set image in tesseract for recognition
 * @access public
 */
module.exports = (TessModule, api, image) => {
  const buf = Buffer.from(Array.from({ ...image, length: Object.keys(image).length }));
  const type = fileType(buf);
  let bytesPerPixel = 0;
  let data = null;
  let pix = null;
  let w = 0;
  let h = 0;

  const exif = buf.slice(0, 500).toString().match(/\x01\x12\x00\x03\x00\x00\x00\x01\x00(.)/)?.[1]?.charCodeAt(0) || 1;

  /*
   * Leptonica supports uncompressed but not compressed bmp files
   * @see https://github.com/DanBloomberg/leptonica/issues/607#issuecomment-1068802516
   * We therefore use bmp-js to process all bmp files
   */
  if (type && type.mime === 'image/bmp') {
    const bmpBuf = bmp.decode(buf);
    data = TessModule._malloc(bmpBuf.data.length * Uint8Array.BYTES_PER_ELEMENT);
    TessModule.HEAPU8.set(bmpBuf.data, data);
    w = bmpBuf.width;
    h = bmpBuf.height;
    bytesPerPixel = 4;
  } else {
    const ptr = TessModule._malloc(buf.length * Uint8Array.BYTES_PER_ELEMENT);
    TessModule.HEAPU8.set(buf, ptr);
    pix = TessModule._pixReadMem(ptr, buf.length);
    if (TessModule.getValue(pix + (7 * 4), 'i32') === 0) {
      /*
       * Set a yres default value to prevent warning from tesseract
       * See kMinCredibleResolution in tesseract/src/ccstruct/publictypes.h
       */
      TessModule.setValue(pix + (7 * 4), 300, 'i32');
    }
    [w, h] = Array(2).fill(0)
      .map((v, idx) => (
        TessModule.getValue(pix + (idx * 4), 'i32')
      ));
  }

  /*
   * As some image format (ex. bmp) is not supported natiely by tesseract,
   * sometimes it will not return pix directly, but data and bytesPerPixel
   * for another SetImage usage.
   *
   */
  if (data === null) {
    api.SetImage(pix, undefined, undefined, undefined, undefined, exif);
  } else {
    api.SetImage(data, w, h, bytesPerPixel, w * bytesPerPixel, exif);
  }
  return data === null ? pix : data;
};
