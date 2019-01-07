var path = require('path');

module.exports = {
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