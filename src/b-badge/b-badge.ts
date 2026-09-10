import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

/**
 * Badge
 * @displayName b-badge
 */
@Options({
  inheritAttrs: false,
})
export default class BadgeComponent extends Vue {
  @Prop({ type: String, default: 'primary' }) color: string;
  @Prop({ type: String, default: 's' }) size: string;
  @Prop({ type: Boolean, default: true }) rounded: boolean;
  @Prop({ type: Boolean, default: false }) circle: boolean;
  @Prop({ type: Boolean, default: true }) dot: boolean;
  @Prop({ type: Boolean, default: false }) fill: boolean;
  @Prop({ type: String, default: 'tonal' }) variant: 'flat' | 'outlined' | 'tonal';
  @Prop({ type: Boolean, default: false }) disabled: boolean;

  @Prop() ariaLabel: string;
  @Prop() ariaDescribedby: string;
  @Prop({ default: undefined }) onFocus: () => void;
  @Prop({ default: undefined }) onBlur: () => void;
  @Prop({ default: undefined }) onMouseenter: () => void;
  @Prop({ default: undefined }) onMouseleave: () => void;

  mounted() {
    if (this.onFocus) {
      (this.$el as HTMLElement).onfocus = this.onFocus.bind(this);
    }
    if (this.onBlur) {
      (this.$el as HTMLElement).onblur = this.onBlur.bind(this);
    }
    if (this.onMouseenter) {
      (this.$el as HTMLElement).onmouseenter = this.onMouseenter.bind(this);
    }
    if (this.onMouseleave) {
      (this.$el as HTMLElement).onmouseleave = this.onMouseleave.bind(this);
    }
  }

  get mySize(): string {
    switch (this.size) {
      case 's':
        return 'x-small';
      case 'm':
        return 'small';
      case 'l':
        return 'large';
      case 'x':
        return 'x-large';
      case 'xl':
        return 'extra-large';
    }
  }
}
