import datatable from '@dn-web/datatable';
import { App, DefineComponent } from 'vue';
import CommonService from '@/services/common.service';
import { IAliases, IOptions, } from '@/types/options';

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const name: keyof IAliases = require('./metadata.js');

function reg(vue: App, options: IOptions) {
  CommonService.propsFactory(datatable as unknown as DefineComponent, CommonService.defaults(options, name));
  vue.component(options.aliases[name], datatable);
  const hasExtensions = CommonService.isArray(options.extensions) && options.extensions.length > 0;
  if (hasExtensions) {
    const arr = options.extensions.filter(e => e.alias === name);
    if (arr.length) {
      for (const el of arr) {
        vue.component(el.name, {
          ...(datatable as unknown as DefineComponent),
          props: CommonService.returnProps(datatable as unknown as DefineComponent, el.props),
        });
      }
    }
  }
}

export { reg };
