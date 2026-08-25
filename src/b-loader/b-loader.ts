import { Prop, Vue } from 'vue-property-decorator';

/**
 * @displayName b-loader
 */
export default class LoaderComponent extends Vue {
  @Prop({ type: Boolean, default: undefined }) visible: boolean;
  @Prop({ type: Boolean, default: false }) transparent: boolean;
  @Prop({ type: Number, default: 0.5 }) opacity: number;
  @Prop({ type: String, default: 'm' }) size: 'xs' | 's' | 'm' | 'l' | 'xl';
  @Prop({ type: String, default: 'circle' }) view: 'circle' | 'dots';
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

  circleTo4Paths(cx: number, cy: number, r: number) {
    const K = 0.5522847498;
    const d = r * K;

    return {
      top: `M ${cx} ${cy - r} C ${cx + d} ${cy - r}, ${cx + r} ${cy - d}, ${cx + r} ${cy}`,
      right: `M ${cx + r} ${cy} C ${cx + r} ${cy + d}, ${cx + d} ${cy + r}, ${cx} ${cy + r}`,
      bottom: `M ${cx} ${cy + r} C ${cx - d} ${cy + r}, ${cx - r} ${cy + d}, ${cx - r} ${cy}`,
      left: `M ${cx - r} ${cy} C ${cx - r} ${cy - d}, ${cx - d} ${cy - r}, ${cx} ${cy - r}`,
    };
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

  get iconStroke(): number {
    switch (this.size) {
      case 'xs':
        return 4;
      case 's':
        return 5;
      case 'm':
        return 6;
      case 'l':
        return 8;
      case 'xl':
        return 10;
    }
  }

  get r(): number {
    switch (this.size) {
      case 'xs':
        return 2;
      case 's':
        return 3;
      case 'm':
        return 4;
      case 'l':
        return 5;
      case 'xl':
        return 6;
    }
  }

  get styles() {
    return {
      '--b-loader-opacity': this.opacity,
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
