import '@/scss';
import { createApp } from 'vue';
import App from '@/demo/index.vue';
import ui, { i18n } from '@/index';
import { options } from '@/options';
import { startup } from '@/startup';

function start() {
  const appComponent = createApp(App, {
    version: $VERSION,
    icons: $ICONS,
  });
  appComponent.use(ui, options);
  appComponent.use(i18n);
  startup(appComponent);
  appComponent.mount('#app');
}

start();
