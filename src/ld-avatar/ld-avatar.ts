import { mixins, Prop } from 'vue-property-decorator';
import { Emit } from '@/decorators/emit.decorator';
import InputMixin from '@/mixins/input.mixin';

/**
 * Avatar
 * @displayName ld-avatar
 */
export default class AvatarComponent extends mixins(InputMixin) {
  @Prop({ type: String, default: 'sm' }) size: 'xs' | 's' | 'sm' | 'm' | 'l' | 'xl' | 'xxl';
  @Prop({ type: String, default: 'light' }) theme: 'light' | 'dark';
  @Prop({ type: Boolean, default: true }) full: boolean;
  @Prop({ type: Boolean, default: true }) online: boolean;

  isFocused = false;

  @Emit('click') onClickEmit() {
    return true;
  }

  onFocus(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target?.matches && target?.matches(':focus-visible')) {
      this.isFocused = true;
    } else {
      event.preventDefault();
    }
  }

  onBlur(event: MouseEvent) {
    this.isFocused = false;
  }

  onClick() {
    this.onClickEmit();
  }

  get mySize(): string {
    switch (this.size) {
      case 'xs':
        return 'x-small';
      case 's':
        return 'small';
      case 'sm':
        return 'default';
      case 'm':
        return 'medium';
      case 'l':
        return 'large';
      case 'xl':
        return 'x-large';
      case 'xxl':
        return 'extra-large';
    }
  }

  get showContent(): boolean {
    return this.full && this.size !== 'xxl';
  }

  get showHint(): boolean {
    return this.size !== 'xs' && this.size !== 's';
  }

  get showIcon(): boolean {
    return this.size !== 'xs' && this.size !== 'xxl';
  }
}
