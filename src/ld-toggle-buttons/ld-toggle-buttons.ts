import { Prop, Vue } from 'vue-property-decorator';
import { Emit } from '@/decorators/emit.decorator';

/**
 * @displayName ld-toggle-buttons
 */
export default class ToggleButtonsComponent extends Vue {
  @Prop() modelValue: number;
  @Prop() items: Array<{
    id: string;
    tooltip: string;
    icon: string;
    text: string;
    badge: string | number;
  }>;
  @Prop({ type: String, default: 's' }) size: 's' | 'm' | 'l';
  @Prop({ type: Boolean, default: false }) rounded: boolean;
  @Prop({ type: Boolean, default: false }) disabled: boolean;

  @Emit('update:model-value') emitUpdate(value: number) {
    return value;
  }

  onClick(index: number) {
    this.emitUpdate(index);
  }

  get mySize(): string {
    switch (this.size) {
      case 's':
        return 'small';
      case 'm':
        return 'large';
      case 'l':
        return 'x-large';
    }
  }
}
