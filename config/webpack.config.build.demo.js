const { VueLoaderPlugin } = require('vue-loader');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const path = require('path');
const fs = require('fs');
const { minimizer } = require('./minimizer');
const { version } = require('../package.json');

const commonConfig = require('./webpack.config.common');
const { getIconsList } = require('./helpers');

commonConfig.resolve.modules = [path.join(__dirname, '../../'), 'node_modules'];

const doAsync = async () => {
  await writeVersion();
  const icons = await getIconsList();

  return {
    ...commonConfig,
    mode: 'production',
    entry: {
      'index': path.join(__dirname, '../src/demo/demo.ts'),
    },
    output: {
      library: {
        name: 'dnwebuidemo',
        type: 'umd',
      },
      filename: '[name].js',
      path: path.resolve(__dirname, '../build/release'),
      clean: true,
    },
    externals: {
      '../../build/dist': '../dist',
      '../../build/dist/scss': '../dist/scss',
      'vue': 'vue',
      'vuetify': 'vuetify',
      'vuetify/components': 'vuetify/components',
      'vuetify/iconsets/md': 'vuetify/iconsets/md',
      'vue-class-component': 'vue-class-component',
      'vue-property-decorator': 'vue-property-decorator',
      'lodash-es/cloneDeep': 'lodash-es/cloneDeep',
      'markdown-it': 'markdown-it',
      '@dn-web/core': '@dn-web/core',
      '@/mixins/validate.mixin': '../dist',
      '@/ld-dialog/dialogs': '../dist',
      '@/ld-dialog/dialog.manager': '../dist',
    },
    optimization: {
      minimize: true,
      minimizer: [
        minimizer
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new DefinePlugin({
        '$DEV': false,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/demo/index.d.ts',
            to: './index.d.ts'
          },
          {
            from: 'src/demo/fonts',
            to: './fonts'
          },
          {
            from: 'src/demo/img',
            to: './img'
          },
          {
            from: 'src/demo/*.md',
            to: './readme/[name].md'
          },
          {
            from: 'src/demo/version.json',
            to: './version.json'
          },
          {
            from: "*",
            to: './icons.json',
            transform() {
              return JSON.stringify(icons);
            }
          }
        ]
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css'
      })
    ]
  }
}

module.exports = doAsync;
