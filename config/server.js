const path = require('path');

module.exports = {
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
  proxy: [
    {
      context: ['/api'],
      target: 'http://platforma-dev.k8s.lan.lanit.ru/landocs-backend',
      secure: false,
      changeOrigin: true,
      agent: null,
      onProxyRes: (proxyRes) => {
        var key = 'www-authenticate';
        proxyRes.headers[key] = proxyRes.headers[key] && proxyRes.headers[key].split(',');
      },
    },
  ]
}
