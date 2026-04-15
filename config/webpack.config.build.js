const { VueLoaderPlugin } = require('vue-loader');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const path = require('path');
const { minimizer } = require('./minimizer');
const { libs } = require('./libs');
const { getComponentsList, getExternalsList, getEntryList } = require('./helpers');

const commonConfig = require('./webpack.config.common');

const doAsync = async () => {
  const components = await getComponentsList();
  const externals = getExternalsList(components);
  const entry = getEntryList(components);

  return {
    ...commonConfig,
    mode: 'production',
    entry: {
      'index': path.join(__dirname, '../src/index.ts'),
      'validators': path.join(__dirname, '../src/mixins/validators'),
      ...libs.entry,
      ...entry,
    },
    externals: {
      'vue': 'vue',
      'vue-class-component': 'vue-class-component',
      'vue-property-decorator': 'vue-property-decorator',
      'vuetify': 'vuetify',
      'lodash-es': 'lodash-es',
      'md-editor-v3': 'md-editor-v3',
      'markdown-it': 'markdown-it',
      'vue-screen-utils': 'vue-screen-utils',
      '@vuelidate/core': '@vuelidate/core',
      '@vuelidate/validators': '@vuelidate/validators',
      '@ldmjs/core': '@ldmjs/core',
      '@ldmjs/datatable': '@ldmjs/datatable',
      '@ldmjs/treeview': '@ldmjs/treeview',
      '@/mixins/validators': './utils/validators.js', // from index.js
      '../mixins/validators': '../utils/validators.js', // from components/<file>.js
      ...libs.externals,
      ...externals,
    },
    output: {
      library: {
        name: 'ldmui',
        type: 'umd',
      },
      filename: (pathData) => {
        if (pathData.chunk.name === 'index') {
          return '[name].js';
        }
        if (pathData.chunk.name === 'validators') {
          return 'utils/[name].js';
        }
        if (pathData.chunk.name.indexOf('ld') > -1) {
          return 'components/[name].js';
        }
        return 'lib/[name].js';
      },
      path: path.resolve(__dirname, '../build/dist'),
      clean: true,
    },
    optimization: {
      minimize: true,
      minimizer: [
        minimizer
      ],
      splitChunks: {
        cacheGroups: {
          styles: {
            name: "styles",
            type: "css/mini-extract",
            chunks: "all",
            enforce: true,
          },
        },
      },
    },
    plugins: [
      new VueLoaderPlugin(),
      new DefinePlugin({
        '$DEV': false,
        '$COMPONENTS': JSON.stringify(components),
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
          {
            from: 'src/scss',
            to: './scss'
          },
          {
            from: 'src/fonts',
            to: './fonts'
          },
          {
            from: 'src/i18n',
            to: './i18n'
          }
        ]
      }),
      new MiniCssExtractPlugin({
        filename: 'css/index.css'
      })
    ]
  }
};

module.exports = doAsync


