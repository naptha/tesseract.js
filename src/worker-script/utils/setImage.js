const { readImage } = require('tesseract.js-utils');

/**
 * setImage
 *
 * @name setImage
 * @function set image in tesseract for recognition
 * @access public
 * @param {array} image - binary array in array format
 * @returns {number} - an emscripten pointer of the image
 */
module.exports = (TessModule, api, image, params) => {
  const {
    tessjs_image_rectangle_left: left,
    tessjs_image_rectangle_top: top,
    tessjs_image_rectangle_width: width,
    tessjs_image_rectangle_height: height,
  } = params;
  const {
    w, h, bytesPerPixel, data, pix,
  } = readImage(TessModule, Array.from(image));

  /*
   * As some image format (ex. bmp) is not supported natiely by tesseract,
   * sometimes it will not return pix directly, but data and bytesPerPixel
   * for another SetImage usage.
   *
   */
  if (data === null) {
    api.SetImage(pix);
  } else {
    api.SetImage(data, w, h, bytesPerPixel, w * bytesPerPixel);
  }
  api.SetRectangle(
    (left < 0) ? 0 : left,
    (top < 0) ? 0 : top,
    (width < 0) ? w : width,
    (height < 0) ? h : height,
  );
  return data === null ? pix : data;
};
