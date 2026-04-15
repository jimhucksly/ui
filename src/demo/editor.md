* Usage

```cmd
C:\project> yarn add @ldmjs/editor@2.0.0
```

```js
import { createApp, defineComponent } from 'vue';
import Editor from '@ldmjs/editor';
import '@ldmjs/editor/dist/css/index.css';

const app = defineComponent({
  template: `
    <editor v-model:html="html" v-model:content="delta" /
  `,
  components: {
    Editor
  },
  data() {
    return {
      html: '',
      delta: ''
    }
  }
});

const appComponent = createApp(app)
appComponent.mount('#app');
```
