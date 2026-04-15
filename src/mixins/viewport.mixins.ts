import { Vue } from 'vue-property-decorator';

export default class ViewportMixin extends Vue {
  viewport(): { w: number; h: number } {
    const rect = document?.body?.getBoundingClientRect();
    if (rect) {
      return {
        w: rect.width,
        h: rect.height,
      };
    }
    return {
      w: window?.innerWidth,
      h: window?.innerHeight,
    };
  }

  get globalMobileKey() {
    return this.$ldmui?.options?.viewport?.isMobile;
  }

  get globalTabletKey() {
    return this.$ldmui?.options?.viewport?.isTablet;
  }

  get globalDesktopKey() {
    return this.$ldmui?.options?.viewport?.isDesktop;
  }

  get isMobileGlobal() {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    return this.globalMobileKey ? (this as any)[this.globalMobileKey] : false;
  }

  get isTabletGlobal() {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    return this.globalTabletKey ? (this as any)[this.globalTabletKey] : false;
  }

  get isDesktopGlobal() {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    return this.globalDesktopKey ? (this as any)[this.globalDesktopKey] : false;
  }
}
