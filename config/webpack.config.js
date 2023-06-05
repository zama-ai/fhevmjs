'use strict';

const webpack = require('webpack');
const path = require('path');

const PATHS = require('./paths.js');

// To re-use webpack configuration across templates,
// CLI maintains a common webpack configuration file - `webpack.common.js`.
// Whenever user creates an extension, CLI adds `webpack.common.js` file
// in template's `config` folder
const common = {
  output: {
    // the build folder to output bundles and assets in.
    path: PATHS.build,
    // the filename template for entry chunks
    filename: 'index.js',
    globalObject: 'this',
    library: {
      type: 'commonjs2',
    },
  },
  module: {
    rules: [
      // Check for TypeScript files
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        use: ['ts-loader'],
      },
      {
        test: /\.bin$/,
        type: 'asset/source',
      },
      {
        test: /\.wasm$/,
        type: 'asset/source',
      },
    ],
  },
  experiments: {
    asyncWebAssembly: true,
    syncWebAssembly: true,
  },
  resolve: {
    // Help webpack resolve these extensions in order
    extensions: ['.tsx', '.ts', '.js'],
    extensionAlias: {
      '.js': ['.ts', '.tsx', '.js'],
      '.mjs': ['.mts', '.mjs'],
    },
    alias: {
      '@modules': path.resolve(process.cwd(), 'src/modules/'),
    },
    fallback: {
      buffer: require.resolve('buffer/'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      path: require.resolve('path-browserify'),
    },
  },
  plugins: [
    // new NodePolyfillPlugin(),
    // Print file sizes
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};

module.exports = common;
