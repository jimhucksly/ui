import { App } from 'vue';
import { Router } from 'vue-router';

class Application {
  constructor(public $router: Router) {
    //
  }

  go(name: string) {
    this.$router.push({ name });
  }
}

const application = {
  install(vue: App, _router: Router) {
    vue.config.globalProperties.$app = new Application(_router);
  },
};

export default application;
