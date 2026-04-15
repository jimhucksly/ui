import { App } from 'vue';
import component from '@/ld-avatar/ld-avatar.vue';
import CommonService from '@/services/common.service';
import { ldmuiAliases, ldmuiOptions } from '@/types/options';

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const name: keyof ldmuiAliases = require('./metadata.js');

function reg(vue: App, options: ldmuiOptions) {
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
