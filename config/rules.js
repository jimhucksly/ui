const { cssLoaders, sassLoaders, vueLoaders, cacheLoader, threadLoader, tsLoader } = require('./loaders.js');

const rules = () => {
  const result = [
    {
      test: /\.vue$/,
      use: vueLoaders()
    },
    {
      test: /\.ts$/,
      exclude: /(node_modules|\.spec\.ts|\.d\.ts)$/,
      use: [
        cacheLoader(),
        threadLoader(),
        tsLoader()
      ]
    },
    {
      test: /\.(css)$/,
      use: cssLoaders('css')
    },
    {
      test: /\.(scss)$/,
      use: cssLoaders('scss')
    },
    {
      test: /\.sass$/,
      use: sassLoaders()
    },
    {
      test: /\.(woff|woff2|eot|ttf)?$/i,
      type: 'asset/resource',
      dependency: {
        not: ['url']
      },
    },
    {
      test: /\.(png|svg|jpeg|jpg|gif)$/,
      type: 'asset/resource',
    },
  ];
  return result;
}

module.exports = rules
