var path = require('path');
var webpack = require('webpack');

function config({entry, output, include}) {
  return {
    devtool: 'cheap-module-eval-source-map',
    entry,
    output: Object.assign({}, output, {
      path: path.join(__dirname, 'build'),
      publicPath: '/build/',
    }),
    plugins: [
      new webpack.NoErrorsPlugin()
    ],
    module: {
      loaders: [{
        test: /\.js$/,
        loaders: ['babel'],
        include
      }]
    },
    node: {
      fs: "empty"
    }
  }
}

module.exports = [{
  entry: './src/browser/index.js',
  output: {
    filename: 'tesseract.js',
    library: "Tesseract",
    libraryTarget: "umd"
  },
  include: [path.join(__dirname, 'src/browser')]  
}, {
  entry: './src/worker/index.js',
  output: {
    filename: 'tesseract.worker.js',
  },
  include: [path.join(__dirname, 'src/worker')]
}].map(config);