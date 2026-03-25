import '@/scss';
import { createApp } from 'vue';
import App from './app.vue';
import application from './application';
import plugin from './index';
import router from './router';

const app = createApp(App);

app.use(router);
app.use(plugin);
app.use(application, router);

app.mount('#app');
