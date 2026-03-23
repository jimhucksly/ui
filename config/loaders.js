const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const cssLoaders = (ext) => {
  const result = [];
  if (isDevelopment) {
    result.push('style-loader');
    result.push({
      loader: 'css-loader',
      options: {
        importLoaders: 1,
      }
    });
    result.push('postcss-loader');
  }
  if (isProduction) {
    result.push(MiniCssExtractPlugin.loader);
    // if (ext !== 'css') {
    //   result.push({
    //   loader: 'string-replace-loader',
    //     options: {
    //       multiple: [
    //         { search: '../fonts/MaterialIcons', replace: '/fonts/MaterialIcons', flags: 'g' },
    //         { search: '../fonts/Montserrat-ExtraBold.ttf', replace: '/fonts/Montserrat-ExtraBold.ttf', flags: 'g' },
    //         { search: '../img/Moscow.png', replace: '/img/Moscow.png', flags: 'g' },
    //       ]
    //     }
    //   });
    // }
    result.push({
      loader: 'css-loader',
      options: {
        modules: false,
        sourceMap: false,
        importLoaders: 2,
        url: false,
      }
    });
    result.push({
      loader: 'postcss-loader',
      options: {
        sourceMap: true
      }
    });
  }

  if (ext === 'scss') {
    if (isDevelopment) {
      result.push({
        loader: 'sass-loader',
        options: {
          implementation: require('sass'),
        }
      });
    }
    if (isProduction) {
      result.push({
        loader: 'sass-loader',
        options: {
          implementation: require('sass'),
          sourceMap: false,
        }
      });
    }
  }
  return result;
}

const sassLoaders = () => {
  return [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
      }
    },
    {
      loader: 'sass-loader',
      options: {
        implementation: require('sass'),
        sassOptions: {
          indentedSyntax: true
        },
      }
    }
  ]
}

const vueLoaders = () => {
  return {
    loader: 'vue-loader',
    options: {
      compilerOptions: {
        whitespace: 'preserve',
      },
      hotReload: true
    }
  }
}

const tsLoader = () => {
  return {
    loader: 'ts-loader',
    options: {
      appendTsSuffixTo: [/\.vue$/],
      happyPackMode: true,
    }
  }
}

const cacheLoader = () => {
  return {
    loader: 'cache-loader',
    options: {
      cacheDirectory: 'node_modules/.cache/ts-loader',
      cacheIdentifier: '213ca566'
    }
  }
}

const threadLoader = () => {
  return {
    loader: 'thread-loader',
    options: {
      workers: require('os').cpus().length - 1,
      workerParallelJobs: 50,
      poolTimeout: 2000,
    }
  }
}

module.exports = {
  cssLoaders,
  sassLoaders,
  vueLoaders,
  tsLoader,
  cacheLoader,
  threadLoader
}
