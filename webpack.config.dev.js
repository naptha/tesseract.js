var path = require('path');
var webpack = require('webpack');

function config(opt) {
  return {
    devtool: 'cheap-module-eval-source-map',
    entry: opt.entry,
    output: Object.assign({}, opt.output, {
      path: path.join(__dirname, 'build'),
      publicPath: '/tesseract/',
    }),
    plugins: [
      new webpack.NoErrorsPlugin()
    ],
    module: {
      loaders: [{
        test: /\.js$/,
        loaders: ['babel'],
        include: opt.include
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
  include: [path.join(__dirname, 'src/browser'), path.join(__dirname, 'src/shared')]  
}, {
  entry: './src/worker/index.js',
  output: {
    filename: 'tesseract.worker.js',
  },
  include: [path.join(__dirname, 'src/worker'), path.join(__dirname, 'src/shared')]
}].map(config);