var merge = require('webpack-merge');

var common = require('./webpack.common.js');
var PageFactory = require('./PageFactory');

module.exports = merge(common, {
  devtool: 'source-map',
  devServer: {
    before: function(app) {
        PageFactory(app);
    }
  },
  watchOptions: {
    poll: 100, 
    aggregateTimeout: 100,
  },
  mode: 'development',
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
              sourceMap: true,
            },
          }, 
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
});