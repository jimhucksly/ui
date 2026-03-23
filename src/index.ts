import { App } from 'vue';

/* eslint-disable no-console */
// console.log({ version });

const plugin = {
  install(vue: App, options?: unknown) {
    vue.config.globalProperties.$dnwebui = {
      ver: '1.0.1',
    };
  },
};

export default plugin;
