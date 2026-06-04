import '../../build/dist/scss';
import './scss/main.scss';
import { createApp } from 'vue';
import dnwebui, { dnwebuii18n } from '../../build/dist';
import { options } from '../options';
import { startup } from '../startup';
import App from './index.vue';

function start() {
  const app = createApp(App, {
    version: $VERSION,
    versions: $VERSIONS,
    icons: $ICONS,
  });
  app.use(dnwebui, options);
  app.use(dnwebuii18n);
  startup(app);
  app.mount('#app');
}

start();
