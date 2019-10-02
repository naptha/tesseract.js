const axios = require('axios');
const resolveURL = require('resolve-url');

/**
 * readFromBlobOrFile
 *
 * @name readFromBlobOrFile
 * @function
 * @access private
 * @param {object} blob A blob or file objec to read
 * @param {function} res callback function after reading completes
 */
const readFromBlobOrFile = blob => (
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = ({ target: { error: { code } } }) => {
      reject(Error(`File could not be read! Code=${code}`));
    };
    fileReader.readAsArrayBuffer(blob);
  })
);

/**
 * loadImage
 *
 * @name loadImage
 * @function load image from different source
 * @access private
 * @param {string, object} image - image source, supported formats:
 *   string: URL string, can be relative path
 *   string: base64 image
 *   img HTMLElement: extract image source from src attribute
 *   video HTMLElement: extract image source from poster attribute
 *   canvas HTMLElement: extract image data by converting to Blob
 *   File instance: data from <input type="file" />
 * @returns {array} binary image in array format
 */
const loadImage = async (image) => {
  let data = image;
  if (typeof image === 'undefined') {
    return 'undefined';
  }

  if (typeof image === 'string') {
    // Base64 Image
    if (/data:image\/([a-zA-Z]*);base64,([^"]*)/.test(image)) {
      data = atob(image.split(',')[1])
        .split('')
        .map(c => c.charCodeAt(0));
    } else {
      const { data: _data } = await axios.get(resolveURL(image), { responseType: 'arraybuffer' });
      data = _data;
    }
  } else if (image instanceof HTMLElement) {
    if (image.tagName === 'IMG') {
      data = await loadImage(image.src);
    }
    if (image.tagName === 'VIDEO') {
      data = await loadImage(image.poster);
    }
    if (image.tagName === 'CANVAS') {
      await new Promise((resolve) => {
        image.toBlob(async (blob) => {
          data = await readFromBlobOrFile(blob);
          resolve();
        });
      });
    }
  } else if (image instanceof File || image instanceof Blob) {
    data = await readFromBlobOrFile(image);
  }

  return new Uint8Array(data);
};

module.exports = loadImage;
