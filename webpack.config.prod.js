var path = require('path');
var webpack = require('webpack');

function config({entry, output, include}) {
  return {
    entry,
    output: Object.assign({}, output, {
      path: path.join(__dirname, 'dist')
    }),
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      })
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