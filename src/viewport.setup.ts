import { App } from 'vue';

const viewport = {
  install(vue: App) {
    vue.mixin({
      computed: {
        isMobile() {
          return this.$vuetify.display.sm || this.$vuetify.display.xs;
        },
        isTablet() {
          return this.$vuetify.display.md;
        },
        isDesktop() {
          return !this.isMobile && !this.isTablet;
        },
      },
    });
  },
};

export default viewport;
