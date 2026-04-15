import { Prop, Vue } from 'vue-property-decorator';

/**
 * @displayName ld-loader
 */
export default class LoaderComponent extends Vue {
  @Prop({ type: Boolean, default: undefined }) visible: boolean;
  @Prop({ type: Boolean, default: false }) transparent: boolean;
  @Prop({ type: Number, default: 0.5 }) opacity: number;
  @Prop({ type: String, default: 'm' }) size: 'xs' | 's' | 'm' | 'l' | 'xl';
  @Prop({ type: String, default: 'circle' }) view: 'circle' | 'dotts';
  @Prop({ type: String, default: 'primary' }) color: 'primary' | 'white';

  mounted() {
    const parent = this.$el.parentNode as HTMLElement;
    if (parent) {
      const pos = window.getComputedStyle(parent).getPropertyValue('position');
      if (!['absolute', 'relative'].includes(pos)) {
        parent.style.position = 'relative';
      }
    }
  }

  get mySize(): string {
    switch (this.size) {
      case 'xs':
        return 'x-small';
      case 's':
        return 'small';
      case 'm':
        return 'large';
      case 'l':
        return 'x-large';
      case 'xl':
        return 'extra-large';
    }
  }

  get iconSize(): number {
    switch (this.size) {
      case 'xs':
        return 16;
      case 's':
        return 24;
      case 'm':
        return 32;
      case 'l':
        return 48;
      case 'xl':
        return 64;
    }
  }

  get styles() {
    return {
      '--ld-loader-opacity': this.opacity,
      'z-index': this.zIndex(this.$parent.$el) + 2,
    };
  }

  private zIndex(el?: Element | null): number {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) {
      return 0;
    }
    const index = Number(window.getComputedStyle(el).getPropertyValue('z-index'));

    if (isNaN(index)) {
      return this.zIndex(el.parentNode as Element);
    }
    return index;
  }
}
