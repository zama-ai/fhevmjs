'use strict';
const webpack = require('webpack');
const path = require('path');
const PATHS = require('./paths.cjs');

const web = {
  entry: {
    'fhevm.min': PATHS.web,
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
    chunkFilename: '[name].js',
    globalObject: 'this',
    library: {
      name: 'fhevm',
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
    ],
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
      'tfhe_bg.wasm': require.resolve('tfhe/tfhe_bg.wasm'),
      'node-tfhe': require.resolve('tfhe/tfhe'),
      'kms_lib_bg.wasm': require.resolve('../src/kms/web/kms_lib_bg.wasm'),
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
