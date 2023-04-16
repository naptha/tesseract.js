const resolveURL = require('resolve-url');

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

/**
 * imageDataToPBM
 *
 * @name imageDataToPBM
 * @function
 * @access private
 *
 * @see https://github.com/DanBloomberg/leptonica/blob/master/src/pnmio.c
 * @see https://netpbm.sourceforge.net/doc/pam.html
 */
const imageDataToPBM = (imageData) => {
  const { width, height, data } = imageData;
  const DEPTH = 4; // channels per pixel (RGBA = 4)
  const MAXVAL = 255; // range of each channel (0-255)
  const TUPLTYPE = 'RGB_ALPHA';
  let header = 'P7\n'
  header += `WIDTH ${width}\n`
  header += `HEIGHT ${height}\n`
  header += `DEPTH ${DEPTH}\n`
  header += `MAXVAL ${MAXVAL}\n`
  header += `TUPLTYPE ${TUPLTYPE}\n`
  header += `ENDHDR\n`
  const encoder = new TextEncoder();
  const binaryHeader = encoder.encode(header);
  const binary = new Uint8Array(binaryHeader.length + data.length);
  binary.set(binaryHeader);
  binary.set(data, binaryHeader.length);
  return binary
}

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
    // Base64 Image
    if (/data:image\/([a-zA-Z]*);base64,([^"]*)/.test(image)) {
      data = atob(image.split(',')[1])
        .split('')
        .map((c) => c.charCodeAt(0));
    } else {
      const resp = await fetch(resolveURL(image));
      data = await resp.arrayBuffer();
    }
  } else if (OffscreenCanvas && image instanceof OffscreenCanvas) {
    const ctx = image.getContext('2d');
    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    const pbm = imageDataToPBM(imageData);
    data = pbm
  } else if (HTMLElement && image instanceof HTMLElement) {
    if (image.tagName === 'IMG') {
      data = await loadImage(image.src);
    }
    if (image.tagName === 'VIDEO') {
      data = await loadImage(image.poster);
    }
    if (image.tagName === 'CANVAS') {
      const ctx = image.getContext('2d');
      const imageData = ctx.getImageData(0, 0, image.width, image.height);
      const pbm = imageDataToPBM(imageData);
      data = pbm
    }
  } else if (image instanceof File || image instanceof Blob) {
    data = await readFromBlobOrFile(image);
  }

  return new Uint8Array(data);
};

module.exports = loadImage;
