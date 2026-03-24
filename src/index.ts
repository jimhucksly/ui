import { App, DefineComponent } from 'vue';
import * as components from '@/components';

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const { version } = require('../package.json');

function reg(vue: App, name: string, cmp: DefineComponent) {
  vue.component(name, cmp);
}

const plugin = {
  install(vue: App, options?: unknown) {
    vue.config.globalProperties.$dnwebui = {
      ver: version,
    };

    for (const c of $COMPONENTS) {
      const key = c.replace(/-/g, '');
      reg(vue, c, (components as unknown as Record<string, DefineComponent>)[key]);
    }
  },
};

export default plugin;
