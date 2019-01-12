var merge = require('webpack-merge');

var common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
  module: {
    rules: [
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
});