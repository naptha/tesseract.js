const resolveURL = require('resolve-url');
const blueimpLoadImage = require('blueimp-load-image');

/**
 * readFromBlobOrFile
 *
 * @name readFromBlobOrFile
 * @function
 * @access private
 */
const readFromBlobOrFile = (blob) => (
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

const fixOrientationFromUrlOrBlobOrFile = (blob) => (
  new Promise((resolve) => {
    blueimpLoadImage(
      blob,
      (img) => img.toBlob(resolve),
      {
        orientation: true,
        canvas: true,
      },
    );
  })
);

/**
 * loadImage
 *
 * @name loadImage
 * @function load image from different source
 * @access private
 */
const loadImage = async (image) => {
  let data = image;
  if (typeof image === 'undefined') {
    return 'undefined';
  }

  if (typeof image === 'string') {
    if (image.endsWith('.pbm')) {
      const resp = await fetch(resolveURL(image));
      data = await resp.arrayBuffer();
    } else {
      let img = image;
      // If not Base64 Image
      if (!/data:image\/([a-zA-Z]*);base64,([^"]*)/.test(image)) {
        img = resolveURL(image);
      }
      data = await readFromBlobOrFile(
        await fixOrientationFromUrlOrBlobOrFile(img),
      );
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
    let img = image;
    if (!image.name.endsWith('.pbm')) {
      img = await fixOrientationFromUrlOrBlobOrFile(img);
    }
    data = await readFromBlobOrFile(img);
  }

  return new Uint8Array(data);
};

module.exports = loadImage;
