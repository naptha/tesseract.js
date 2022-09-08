const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const common = require('./webpack.config.common');

const genConfig = ({
  entry, filename, library, libraryTarget,
}) => ({
  ...common,
  target: 'web',
  mode: 'development',
  devtool: 'inline-source-map',
  entry,
  output: {
    filename,
    library,
      libraryTarget,
    path: path.resolve(__dirname, '../../InteractivePlayer')
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
    filename: 'tesseract.min.js',
    library: 'Tesseract',
    libraryTarget: 'umd',
  }),
  genConfig({
    entry: path.resolve(__dirname, '..', 'src', 'worker-script', 'browser', 'index.js'),
    filename: 'worker.min.js',
  }),
];
