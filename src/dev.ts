import '@/scss';
import { createApp } from 'vue';
import App from '@/demo/index.vue';
import ldmui, { ldmuii18n } from '@/index';
import { options } from '@/options';
import { startup } from '@/startup';

function start() {
  const appComponent = createApp(App, {
    version: $VERSION,
    versions: $VERSIONS,
    icons: $ICONS,
  });
  appComponent.use(ldmui, options);
  appComponent.use(ldmuii18n);
  startup(appComponent);
  appComponent.mount('#app');
}

start();
