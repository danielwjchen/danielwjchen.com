var path = require('path');

var pagesFolder = path.resolve(__dirname, 'pages');

module.exports = {
  entry: {
    'home': path.resolve(pagesFolder, 'home'),
    'blog': path.resolve(pagesFolder, 'blog'),
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
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader", 
          }, 
          {
            loader: "css-loader", 
            options: {
              sourceMap: false,
            },
          }, 
          {
            loader: "sass-loader",
            options: {
              sourceMap: false,
            },
          },
        ],
      },
    ],
  },
};