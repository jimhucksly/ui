const devServer = require('./server');
const rules = require('./rules');
const path = require('path');

module.exports = {
  stats: {
    preset: 'normal',
    children: true,
  },
  performance: {
    maxEntrypointSize: 1024000,
    maxAssetSize: 10242000
  },
  ignoreWarnings: [
    /export .*was not found/
  ],
  module: {
    rules: rules()
  },
  resolve: {
    symlinks: true,
    modules: [path.join(__dirname, '../'), 'node_modules'],
    extensions: ['.*', '.ts', '.js', '.vue', '.html', '.json', '.scss', '.css'],
    alias: {
      'vue$': 'vue/dist/vue.esm-bundler.js',
      '@': 'src',
    },
  },
  devServer,
}
