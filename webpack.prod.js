const { merge } = require('webpack-merge');

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
          },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                // Warnings-only deprecations in Bootstrap 4's SCSS.
                silenceDeprecations: [
                  "import",
                  "global-builtin",
                  "if-function",
                  "color-functions",
                  "abs-percent",
                ],
              },
            },
          },
        ],
      },
    ],
  },
});
