import { App } from 'vue';
import component from '@/ld-textarea/ld-textarea.vue';
import CommonService from '@/services/common.service';
import { IAliases, IOptions } from '@/types/options';

/* eslint-disable-next-line @typescript-eslint/no-require-imports */
const name: keyof IAliases = require('./metadata.js');

function reg(vue: App, options: IOptions) {
  CommonService.propsFactory(component, CommonService.defaults(options, name));
  vue.component(options.aliases[name], component);
  const hasExtensions = CommonService.isArray(options.extensions) && options.extensions.length > 0;
  if (hasExtensions) {
    const arr = options.extensions.filter(e => e.alias === name);
    if (arr.length) {
      for (const el of arr) {
        vue.component(el.name, {
          ...component,
          props: CommonService.returnProps(component, el.props),
        });
      }
    }
  }
}

export { reg };
