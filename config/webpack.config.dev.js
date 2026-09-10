const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VuetifyPlugin } = require('webpack-plugin-vuetify');
const ESLintPlugin = require('eslint-webpack-plugin');
const { version } = require('../package.json');

const commonConfig = require('./webpack.config.common');
const { getIconsList, getComponentsList } = require('./helpers');

process.on('uncaughtException', (err) => {
  console.log(err);
});

const doAsync = async () => {
  const components = await getComponentsList();
  const icons = await getIconsList();

  return {
    ...commonConfig,
    mode: 'development',
    entry: {
      'main': './src/dev.ts',
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        inject: true,
        template: './index.html'
      }),
      new DefinePlugin({
        '$DEV': true,
        '$VERSION': JSON.stringify(version),
        '$ICONS': JSON.stringify(icons),
        '$COMPONENTS': JSON.stringify(components),
        '__VUE_OPTIONS_API__': true,
        '__VUE_PROD_DEVTOOLS__': false,
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': false,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/b-icon/icons',
            to: './icons'
          },
          {
            from: 'favicon.ico',
            to: './favicon.ico'
          },
          {
            from: 'public',
            to: './'
          },
          {
            from: 'src/demo/*.md',
            to: './readme/[name].md'
          }
        ]
      }),
      new VuetifyPlugin({
        styles: 'sass',
      }),
      new ESLintPlugin()
    ],
    devServer: {
      port: 4000,
      host: '0.0.0.0',
      historyApiFallback: true,
      hot: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
          runtimeErrors: false,
        }
      },
      static: path.resolve(__dirname, './public'),
    }
  }
};

module.exports = doAsync;
