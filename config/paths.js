'use strict';

const path = require('path');

const PATHS = {
  web: path.resolve(__dirname, '../src/web.js'),
  build: path.resolve(__dirname, '../bundle'),
};

module.exports = PATHS;
