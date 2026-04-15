import '@ldmjs/editor/dist/css/index.css';
import Editor from '@ldmjs/editor';
import { App } from 'vue';
import ContentBody from './demo/components/content-body.vue';
import ContentHeader from './demo/components/content-header.vue';
import CreateEditWindowComponent from './demo/components/create.modal.vue';
import GridSettingsWindowComponent from './demo/components/grid.settings.modal.vue';
import InfoWindowComponent from './demo/components/info.modal.vue';
import SelectWindowComponent from './demo/components/select.modal.vue';
import VRuntimeTemplate from './lib/v-runtime-template';
import viewport from './viewport.setup';
import vuetify from './vuetify.setup';

export function startup(vue: App) {
  vue.use(vuetify);
  vue.use(viewport);

  vue.component('editor', Editor);
  vue.component('info-component', InfoWindowComponent);
  vue.component('select-component', SelectWindowComponent);
  vue.component('create-edit-component', CreateEditWindowComponent);
  vue.component('grid-settings', GridSettingsWindowComponent);
  vue.component('markdown-to-html', VRuntimeTemplate);
  vue.component('content-header', ContentHeader);
  vue.component('content-body', ContentBody);

  vue.mixin({
    computed: {
      isDev() {
        return $DEV;
      },
    },
  });

  const favicon: HTMLLinkElement = document.querySelector('link[rel="icon"]');
  if (favicon) {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      favicon.href = 'favicon-2.ico';
    }
  }
}
