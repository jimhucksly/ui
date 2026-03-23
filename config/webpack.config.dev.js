const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path');
const rules = require('./rules');
const devServer = require('./server');

process.on('uncaughtException', (err) => {
  console.log(err);
});

module.exports = {
  mode: 'development',
  entry: {
    'main': './src/dev.ts',
  },
  module: {
    rules: rules(),
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
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: './index.html'
    }),
    new webpack.DefinePlugin({
      '$DEV': true,
      '__VUE_OPTIONS_API__': true,
      '__VUE_PROD_DEVTOOLS__': false,
      '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': false,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ESLintPlugin({
      extensions: ['vue', 'js', 'ts'],
      formatter: require('eslint-formatter-friendly')
    })
  ],
  devServer,
}
