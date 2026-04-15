import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

/**
 * Badge
 * @displayName ld-badge
 */
export default class BadgeComponent extends Vue {
  @Prop({ type: String, default: 'primary' }) color: string;
  @Prop({ type: String, default: 's' }) size: string;
  @Prop({ type: Boolean, default: true }) rounded: boolean;
  @Prop({ type: Boolean, default: false }) circle: boolean;
  @Prop({ type: Boolean, default: true }) dot: boolean;
  @Prop({ type: Boolean, default: false }) fill: boolean;
  @Prop({ type: String, default: 'tonal' }) variant: 'flat' | 'outlined' | 'tonal';

  get mySize(): string {
    switch (this.size) {
      case 's':
        return 'x-small';
      case 'm':
        return 'small';
      case 'l':
        return 'large';
    }
  }
}
