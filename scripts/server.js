const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const express = require('express');
const path = require('path');
const cors = require('cors');
const webpackConfig = require('./webpack.config.dev');

const compiler = webpack(webpackConfig);
const app = express();

app.use(cors());
app.use('/', express.static(path.resolve(__dirname, '..')));
app.use(middleware(compiler, { publicPath: '/dist', writeToDisk: true }));

module.exports = app.listen(3000, () => {
  console.log('Server is running on the port no. 3000');
});
