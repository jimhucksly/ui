const path = require('path');

module.exports = {
  libs: {
    entry: {
      'imask': path.join(__dirname, '../node_modules/vue-imask'),
      'toastification': path.join(__dirname, '../src/lib/vue-toastification'),
      'runtime-template': path.join(__dirname, '../src/lib/v-runtime-template'),
    },
    externals: {
      '@/lib/vue-toastification': './lib/toastification.js', // from index.js
      'vue-imask': '../lib/imask.js', // from components/ld-edit-masked-text.js
      '@/lib/v-runtime-template': '../lib/runtime-template.js', // from components/ld-text-markup.js
    }
  }
}
