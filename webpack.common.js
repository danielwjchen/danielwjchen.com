var path = require('path');

var pagesFolder = path.resolve(__dirname, 'pages');

module.exports = {
  entry: {
    'home': path.resolve(pagesFolder, 'home'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'pages'),
        use: ["source-map-loader",],
        enforce: "pre"
      },
      {
        test: /\.pug$/,
        include: path.resolve(__dirname, 'pages'),
        use: ["apply-loader", "pug-loader",],
        enforce: "pre"
      },
    ],
  },
};