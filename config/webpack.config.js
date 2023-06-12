'use strict';
const webpack = require('webpack');
const path = require('path');
const PATHS = require('./paths.js');

const web = {
  entry: {
    'zamaweb3.min': PATHS.web,
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
    chunkFilename: '[name].js',
    globalObject: 'this',
    library: {
      name: 'zamaWeb3',
      type: 'umd2',
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minRemainingSize: 0,
      minChunks: 1,
      cacheGroups: {
        default: {
          minChunks: 1,
          priority: 1000,
          reuseExistingChunk: true,
        },
      },
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  module: {
    rules: [
      // Check for TypeScript files
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        use: ['ts-loader'],
        generator: {
          filename: '[name][ext]',
        },
      },
      {
        test: /\.wasm$/,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]',
        },
      },
    ],
  },
  experiments: {
    asyncWebAssembly: true,
    syncWebAssembly: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    extensionAlias: {
      '.js': ['.ts', '.tsx', '.js'],
      '.mjs': ['.mts', '.mjs'],
    },
    alias: {
      'node-tfhe': 'tfhe/tfhe',
    },
    fallback: {
      'node-tfhe': require.resolve('tfhe/tfhe'),
      buffer: require.resolve('buffer/'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      path: require.resolve('path-browserify'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
};

module.exports = web;
