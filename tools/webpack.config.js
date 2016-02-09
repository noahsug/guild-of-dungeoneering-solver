/**
 * React Static Boilerplate
 * https://github.com/koistya/react-static-boilerplate
 * Copyright (c) Konstantin Tarkus (@koistya) | MIT license
 */

import path from 'path';
import webpack from 'webpack';
import merge from 'lodash.merge';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');
const WATCH = global.WATCH;

const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
];
const JS_LOADER = {
  test: /\.jsx?$/,
  include: [
    path.resolve(__dirname, '../src'),
  ],
  loader: 'babel',
};


// Base configuration
const config = {
  output: {
    path: path.join(__dirname, '../build'),
    publicPath: '/',
    sourcePrefix: '  ',
  },
  cache: false,
  debug: DEBUG,
  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
      '__DEV__': DEBUG,
    }),
  ],
  resolve: {
    extensions: ['', '.jsx', '.scss', '.js', '.json'],
    modulesDirectories: [
      'node_modules',
      path.resolve(__dirname, './node_modules')
    ]
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      }, {
        test: /\.txt$/,
        loader: 'raw-loader',
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=10000',
      }, {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
      },
    ],
  },
  postcss: function plugins(bundler) {
    return [
      require('autoprefixer')({
        browsers: AUTOPREFIXER_BROWSERS,
      }),
    ];
  },
};

// Configuration for the client-side bundle
const appConfig = merge({}, config, {
  entry: [
    ...(WATCH ? ['webpack-hot-middleware/client?reload=true'] : []),
    './src/app.js',
  ],
  output: {
    filename: 'app.js',
  },
  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
  plugins: [
    ...config.plugins,
    ...(DEBUG ? [] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: VERBOSE,
        },
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
    ]),
    new ExtractTextPlugin('app.css', { allChunks: true }),
    ...(WATCH ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ] : []),
  ],
  module: {
    loaders: [
      //WATCH ? Object.assign({}, JS_LOADER, {
      //  query: {
      //    // Wraps all React components into arbitrary transforms
      //    // https://github.com/gaearon/babel-plugin-react-transform
      //    plugins: ['react-transform', {
      //      transforms: [{
      //        transform: 'react-transform-hmr',
      //        imports: ['react'],
      //        locals: ['module'],
      //      }, {
      //        transform: 'react-transform-catch-errors',
      //        imports: ['react', 'redbox-react'],
      //      }],
      //    }],
      //  },
      //}) : JS_LOADER,
      JS_LOADER,
      ...config.module.loaders,
      {
        test: /(\.scss|\.css)$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css?sourceMap&modules&importLoaders=1&localIdentName=' +
              '[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap')
      }
    ],
  },
});

export default appConfig;
