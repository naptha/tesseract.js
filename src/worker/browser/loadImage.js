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

const rgba2rgb = (rgbaArray) => {
  // Create a new array to hold only RGB values
  const rgbArray = new Uint8Array((rgbaArray.length / 4) * 3);

  for (let i = 0, j = 0; i < rgbaArray.length; i += 4, j += 3) {
    // Copy over the RGB values, skipping the alpha channel
    rgbArray[j] = rgbaArray[i];
    rgbArray[j + 1] = rgbaArray[i + 1];
    rgbArray[j + 2] = rgbaArray[i + 2];
  }

  return rgbArray;
};

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
  const rgb = rgba2rgb(data); // discard alpha channel
  const DEPTH = 3; // channels per pixel (RGBA = 4, RGB = 3)
  const MAXVAL = 255; // range of each channel (0-255)
  const TUPLTYPE = 'RGB'; // or 'RGB_ALPHA'
  let header = 'P7\n';
  header += `WIDTH ${width}\n`;
  header += `HEIGHT ${height}\n`;
  header += `DEPTH ${DEPTH}\n`;
  header += `MAXVAL ${MAXVAL}\n`;
  header += `TUPLTYPE ${TUPLTYPE}\n`;
  header += 'ENDHDR\n';
  const encoder = new TextEncoder();
  const binaryHeader = encoder.encode(header);
  const binary = new Uint8Array(binaryHeader.length + rgb.length);
  binary.set(binaryHeader);
  binary.set(rgb, binaryHeader.length);
  return binary;
};

/**
 * loadImage
 *
 * @name loadImage
 * @function load image from different source
 * @access private
 */
const loadImage = async (image) => {
  console.time('loadImage');
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
  } else if (ImageData && image instanceof ImageData) {
    data = imageDataToPBM(image);
  } else if (
    (CanvasRenderingContext2D && image instanceof CanvasRenderingContext2D)
    || (OffscreenCanvasRenderingContext2D && image instanceof OffscreenCanvasRenderingContext2D)) {
    const imageData = image.getImageData(0, 0, image.canvas.width, image.canvas.height);
    data = await loadImage(imageData);
  } else if (OffscreenCanvas && image instanceof OffscreenCanvas) {
    data = await loadImage(image.getContext('2d'));
  } else if (HTMLElement && image instanceof HTMLElement) {
    if (image.tagName === 'IMG') {
      data = await loadImage(image.src);
    }
    if (image.tagName === 'VIDEO') {
      data = await loadImage(image.poster);
    }
    if (image.tagName === 'CANVAS') {
      data = await loadImage(image.getContext('2d'));
    }
  } else if (image instanceof File || image instanceof Blob) {
    data = await readFromBlobOrFile(image);
  }

  console.timeEnd('loadImage');
  return new Uint8Array(data);
};

module.exports = loadImage;
