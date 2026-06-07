const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const commonConfig = require('./webpack.config.common');

module.exports = {
  ...commonConfig,
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../build'),
  },
  entry: {
    'index': path.join(__dirname, '../index.js'),
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: './public',
        },
        {
          from: 'build/dist/fonts',
          to: './public/fonts',
        },
        {
          from: 'build/release/fonts',
          to: './public/fonts',
        },
        {
          from: 'build/release/readme/*.md',
          to: './public/readme/[name].md'
        },
        {
          from: 'src/b-icon/icons',
          to: './public/icons',
        },
        {
          from: 'index.html',
          to: './index.html',
        },
        {
          from: 'favicon.ico',
          to: './favicon.ico',
        },
        {
          from: 'config/publish.js',
          to: './publish.js'
        },
        {
          from: 'config/updateVersion.js',
          to: './updateVersion.js'
        },
        {
          from: 'package.json',
          to: './package.json',
        },
        {
          from: '.yarnrc.yml',
          to: './.yarnrc.yml',
        },
        {
          from: 'config/webpack.config.demo.js',
          to: './webpack.config.js',
        },
        {
          from: 'config/webpack.config.common.js',
          to: './webpack.config.common.js',
        },
        {
          from: 'config/server.js',
          to: './server.js',
        },
        {
          from: 'config/rules.js',
          to: './rules.js',
        },
        {
          from: 'config/loaders.js',
          to: './loaders.js',
        },
      ]
    }),
  ],
}
