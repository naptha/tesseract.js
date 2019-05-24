module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        // exclude: /(node_modules|bower_components)/,
        exclude: /(tesseract.js-core)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: 'last 2 versions',
                },
              ],
            ],
          },
        },
      },
    ],
  },
  node: {
    fs: 'empty',
  },
};
