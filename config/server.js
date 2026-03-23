const path = require('path');

module.exports = {
  hot: true,
  port: 4000,
  host: '0.0.0.0',
  historyApiFallback: true,
  client: {
    overlay: {
      errors: true,
      warnings: false,
      runtimeErrors: false,
    }
  },
}
