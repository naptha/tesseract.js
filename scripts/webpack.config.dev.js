const path = require('path');

const genConfig = ({
  entry, filename, library, libraryTarget,
}) => ({
  mode: 'development',
  entry,
  output: {
    filename,
    library,
    libraryTarget,
  },
});

module.exports = [
  genConfig({
    entry: path.resolve(__dirname, '..', 'src', 'index.js'),
    filename: 'tesseract.dev.js',
    library: 'Tesseract',
    libraryTarget: 'umd',
  }),
  genConfig({
    entry: path.resolve(__dirname, '..', 'src', 'browser', 'worker.js'),
    filename: 'worker.dev.js',
  }),
];
