const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VuetifyPlugin } = require('webpack-plugin-vuetify');
const versions = require('./versions.json');
const { version } = require('../package.json');
const icons = require('../build/release/icons.json');

const commonConfig = require('./webpack.config.common');

const doAsync = async () => {
  return {
    ...commonConfig,
    mode: 'production',
    entry: {
      'main': path.resolve(__dirname, './release'),
      'index': path.resolve(__dirname, './release/css/index.css'),
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(__dirname, './index.html'),
      }),
      new DefinePlugin({
        '$DEV': true,
        '$VERSION': JSON.stringify(version),
        '$VERSIONS': JSON.stringify(versions),
        '$ICONS': JSON.stringify(icons),
        '__VUE_OPTIONS_API__': true,
        '__VUE_PROD_DEVTOOLS__': false,
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': false,
      }),
      new VuetifyPlugin({
        styles: 'sass',
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css'
      })
    ]
  }
}

module.exports = doAsync;
