const path = require('path');
const webpack = require('webpack');
const common = require('./webpack.config.common');

const genConfig = ({
  entry, filename, library, libraryTarget,
}) => ({
  ...common,
  mode: 'development',
  entry,
  output: {
    filename,
    library,
    libraryTarget,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        TESS_ENV: JSON.stringify('development'),
      },
    }),
  ],
  devServer: {
      allowedHosts: ['localhost', '.gitpod.io'],
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
