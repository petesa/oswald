'use strict';

const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const nodeExternals = require('webpack-node-externals');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/* const productionPluginDefine = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      MAIL_USER: JSON.stringify(process.env.MAIL_USER),
      MAIL_PASS: JSON.stringify(process.env.MAIL_PASS),
    },
  }),
]; */

const env = dotenv.config().parsed;

// reduce it to a nice object, the same as before
const envKeys = Object.keys(env).reduce((prev, next) => {
  const clone = prev;
  clone[next] = JSON.stringify(env[next]);
  return prev;
}, {});

const productionPluginDefine = [
  new webpack.DefinePlugin({
    'process.env': {
      ...envKeys,
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
];

const commonLoaders = [
  {
    test: /\.json$/,
    loader: 'json-loader',
  },
];

const distDir = path.join(__dirname, './dist');
const clientDir = path.resolve(__dirname, './src/client');
const serverDir = path.resolve(__dirname, './src/server');

module.exports = [
  {
    entry: ['babel-polyfill', `${serverDir}/index.js`],
    output: {
      path: distDir,
      filename: 'server.js',
      libraryTarget: 'commonjs2',
      publicPath: '/',
    },
    target: 'node',
    node: {
      console: false,
      global: false,
      process: false,
      Buffer: false,
      __filename: false,
      __dirname: false,
    },
    externals: nodeExternals(),
    plugins: productionPluginDefine,
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
        },
        {
          test: /\.s?css$/,
          use: 'ignore-loader',
        },
        {
          test: /\.(jpe?g|png|gif|svg|ico)$/i,
          loader: 'file-loader?limit=1024&name=assets/[hash].[ext]',
        },
      ].concat(commonLoaders),
    },
  },
  {
    entry: `${clientDir}/index.js`,
    output: {
      path: distDir,
      filename: 'bundle.js',
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('css-loader'),
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader', // creates style nodes from JS strings
            'css-loader', // translates CSS into CommonJS
            'sass-loader', // compiles Sass to CSS, using Node Sass by default
          ],
        },
        {
          test: /\.(jpe?g|png|gif|svg|ico)$/i,
          loader: 'file-loader?limit=1024&name=/assets/[hash].[ext]',
        },
      ],
    },
    plugins: [
      new ExtractTextPlugin('/assets/styles.css'),
    ],
    resolve: {
      extensions: ['*', '.js', '.jsx', '.scss'],
    },
  },
];
