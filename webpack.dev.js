var path = require('path');
const { merge } = require('webpack-merge');
var express = require('express');

var common = require('./webpack.common.js');
var PageFactory = require('./PageFactory');

var root = path.resolve(__dirname);

module.exports = merge(common, {
  devtool: 'source-map',
  devServer: {
    // Bind to the IPv4 loopback explicitly: on Node >= 17 `localhost`
    // resolves to ::1 first, which would leave 127.0.0.1:8080 unreachable.
    host: '127.0.0.1',
    port: 8080,
    setupMiddlewares(middlewares, devServer) {
        var app = devServer.app;
        // Assets the deployment host serves in production. Must be mounted
        // before PageFactory so /blogs/<id>/images/* and /projects/<id>/images/*
        // don't fall into the page handlers.
        app.use('/images', express.static(path.join(root, 'images')));
        app.use('/blogs', express.static(path.join(root, 'blogs')));
        app.use('/projects', express.static(path.join(root, 'projects')));
        app.use('/node_modules', express.static(path.join(root, 'node_modules')));
        // /dist is intentionally not mounted: webpack-dev-server serves the
        // in-memory build there, and a disk mount would shadow it with a
        // stale `npm run deploy` output.
        PageFactory(app);
        return middlewares;
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
