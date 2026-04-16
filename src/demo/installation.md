# cols[12]
**Install Package**

 - npm
```cmd
 PS D:\yourProject> npm install @dn-web/core@latest @dn-web/ui
```

 - yarn
```cmd
 PS D:\yourProject> yarn add @dn-web/core@latest @dn-web/ui
```

 - install dependencies
```cmd
PS D:\yourProject> yarn add vue vue-class-component@8.0.0-rc.1 vue-property-decorator@10.0.0-rc.3
vuetify vue-screen-utils@1.0.0-beta.13 lodash-es md-editor-v3 @vuelidate/core
@vuelidate/validators markdown-it
```

**Typescript Config**

```json
{
  "compilerOptions":
  {
    "include": ["node_modules/@dn-web/ui/index.d.ts"]
  }
}
```

**NPM page**

* [https://www.npmjs.com/package/@dn-web/ui](https://www.npmjs.com/package/@dn-web/ui)
 # end of cols
 # cols[5]
 **Usage**

```js
import '@dn-web/ui/dist/scss';
import ui, { defaults } from '@dn-web/ui';
import { createApp, defineComponent } from 'vue';
const root = defineComponent({
  template: '<v-app></v-app>',
});
const app = createApp(root);
/**
 * Types of options, see @dn-web/ui/dist/types/options
 */
const options = {};
app.use(ui, options);
const vuetify = createVuetify({
  defaults: {
    ...defaults,
  },
  theme: false,
});
app.use(vuetify);
app.mount('#app');
```
 # end of cols
 # cols[7]
 **Options**
```js
/**
 * можно перепопределить префикс для всех компонентов (по умолчанию, ld-)
 */
prefix?: string;
/**
 * можно переопределить название компонента, под которым он будет зарегистрирован глобально
 */
aliases?: Record<string, string>;
/**
 * можно зарегистрировать новые компоненты на основе дефолтных с передачей каких-то своих конкретных дефолтных параметров
 */
extensions?: Array<IExtension>;
/**
 * переопределить язык (по умолчанию ru)
*/
language?: string;
/**
 * определение глобальных переменных размерности рабочей области, если таковые имеются в общей системе
 */
viewport?: {
  isMobile: string;
  isTablet: string;
  isDesktop: string;
}
/**
 * можно переопределить дефолтные параметры для каждого компонента
 * (name - имя компонента, например LdAvatar, LdButton, LdEditText и т.д.)
 */
[name]?: {
  [key: string]: unknown;
}

```
 # end of cols


