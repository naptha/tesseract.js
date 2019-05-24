const path = require('path');
const common = require('./webpack.config.common');

const genConfig = ({
  entry, filename, library, libraryTarget, ...config
}) => ({
  ...common,
  ...config,
  mode: 'production',
  // devtool: 'source-map',
  entry,
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename,
    library,
    libraryTarget,
  },
});

module.exports = [
  genConfig({
    entry: path.resolve(__dirname, '..', 'src', 'index.js'),
    filename: 'tesseract.min.js',
    library: 'Tesseract',
    libraryTarget: 'umd',
  }),
  genConfig({
    entry: path.resolve(__dirname, '..', 'src', 'index.js'),
    filename: 'tesseract.asm.min.js',
    library: 'Tesseract',
    libraryTarget: 'umd',
    resolve: {
      alias: {
        'tesseract.js-core/tesseract-core.wasm.js': 'tesseract.js-core/tesseract-core.asm.js',
      },
    },
  }),
];
