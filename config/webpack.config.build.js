const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const path = require('path');
const rules = require('./rules');
const { minimizer } = require('./minimizer');

module.exports = {
  mode: 'production',
  entry: {
    'index': path.join(__dirname, '../src'),
  },
  output: {
    globalObject: 'this',
    library: {
      name: 'dnui',
      type: 'umd',
    },
    filename: (pathData) => {
      if (pathData.chunk.name === 'index') {
        return '[name].js';
      }
      return '[name].js';
    },
    path: path.resolve(__dirname, '../dist'),
    clean: true,
  },
  externals: {
    'vue': 'vue',
  },
  resolve: {
    symlinks: true,
    modules: [path.join(__dirname, '../'), 'node_modules'],
    extensions: ['.*', '.ts', '.js', '.html', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm-bundler.js',
      '@': 'src'
    },
  },
  module: {
    rules,
  },
  optimization: {
    minimize: false,
    minimizer: [
      minimizer
    ]
  },
  plugins: [
    new DefinePlugin({
      '$DEV': false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/index.d.ts',
          to: './index.d.ts'
        },
        {
          from: 'src/types',
          to: './types'
        },
      ]
    })
  ]
}
