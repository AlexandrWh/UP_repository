const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/index',

  output: {
    filename: 'bundle.js',
    path: `${__dirname}/public/`,
  },
  // mode: 'development',
};

