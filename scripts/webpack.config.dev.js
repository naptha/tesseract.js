const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
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
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.DefinePlugin({
      'process.env': {
        TESS_ENV: JSON.stringify('development'),
      },
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disable',
      statsFilename: `${filename.split('.')[0]}-stats.json`,
      generateStatsFile: true
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
    entry: path.resolve(__dirname, '..', 'src', 'worker-script', 'browser', 'index.js'),
    filename: 'worker.dev.js',
  }),
];
