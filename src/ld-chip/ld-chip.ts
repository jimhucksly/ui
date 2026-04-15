import { mixins, Options, Prop } from 'vue-property-decorator';
import Icon from '@/components/icon/icon.vue';
import { Emit } from '@/decorators/emit.decorator';
import InputMixin from '@/mixins/input.mixin';

/**
 * Chip
 * @displayName ld-chip
 */

@Options({
  components: {
    'svg-icon': Icon,
  },
})
export default class ChipComponent extends mixins(InputMixin) {
  @Prop({ type: Boolean, default: true }) closable: boolean;
  @Prop({ type: String, default: 'primary' }) color: string;
  @Prop({ type: Boolean, default: false }) clickable: boolean;
  @Prop({ type: Boolean, default: false }) active: boolean;
  @Prop({ type: String, default: 's' }) size: 's' | 'm' | 'l';
  @Prop({ type: String, default: 'outlined' }) variant: 'flat' | 'outlined' | 'tonal';

  isFocused = false;

  @Emit('click') onClickEmit() {
    return true;
  }

  @Emit('click:close') onCloseEmit() {
    return true;
  }

  onFocus(event: FocusEvent) {
    const target = event.target as HTMLElement;
    if (target?.matches && target?.matches(':focus-visible')) {
      this.isFocused = true;
    } else {
      event.preventDefault();
    }
  }

  onBlur(event: FocusEvent) {
    this.isFocused = false;
  }

  onClick(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (this.clickable) {
      this.onClickEmit();
    }
  }

  onClose(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (this.closable) {
      this.onCloseEmit();
    }
  }

  get canClose(): boolean {
    if (this.disabled) {
      return false;
    }
    return this.closable;
  }

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
