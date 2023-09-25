const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const express = require('express');
const path = require('path');
const cors = require('cors');
const webpackConfig = require('./webpack.config.prod');

const compiler = webpack(webpackConfig);
const app = express();

app.use(cors());
app.use(middleware(compiler, { publicPath: '/dist', writeToDisk: true }));

// These headers are required to measure memory within the benchmark code.
// If they are problematic within other contexts they can be removed.
app.use(express.static(path.resolve(__dirname, '..'), {
  setHeaders: (res) => {
    res.set('Cross-Origin-Opener-Policy', 'same-origin');
    res.set('Cross-Origin-Embedder-Policy', 'require-corp');
  }
}));

module.exports = app.listen(3000, () => {
  console.log('Server is running on the port no. 3000');
});
