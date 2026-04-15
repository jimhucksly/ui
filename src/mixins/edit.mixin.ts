import { Prop, Vue } from 'vue-property-decorator';

export default class EditMixin extends Vue {
  @Prop({ type: Boolean, default: false }) clearable: boolean;
  @Prop({ type: String, default: 's' }) size: 's' | 'm' | 'l';
  @Prop({ type: String, default: 'grey' }) color: 'grey' | 'success' | 'error';
  @Prop({ type: String, default: '' }) prefix: string;
  @Prop({ type: String, default: '' }) suffix: string;
  @Prop({ type: String, default: '' }) prependInnerIcon: string;

  get mySize(): string {
    if (this.size === 's') {
      return 'x-small';
    }
    if (this.size === 'm') {
      return 'small';
    }
    if (this.size === 'l') {
      return 'large';
    }
  }

  get editboxBindings(): Record<string, unknown> {
    return {
      clearable: false,
      prefix: this.prefix,
      suffix: this.suffix,
      prependInnerIcon: this.prependInnerIcon,
    };
  }

  get isSmall(): boolean {
    return this.size === 's';
  }

  get isMedium(): boolean {
    return this.size === 'm';
  }

  get isLarge(): boolean {
    return this.size === 'l';
  }
}
