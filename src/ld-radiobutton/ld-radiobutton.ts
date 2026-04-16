import isEqual from 'lodash-es/isEqual';
import { mixins, Options } from 'vue-class-component';
import { Inject, Prop, Vue } from 'vue-property-decorator';
import Help from '@/components/help/help.vue';
import Label from '@/components/label/label.vue';
import { Emit } from '@/decorators/emit.decorator';
import HelpMixin from '@/mixins/help.mixin';
import InputMixin from '@/mixins/input.mixin';

/**
 * Radiobutton
 * @displayName ld-radiobutton
 */
@Options({
  components: {
    'ld-label': Label,
    'ld-help': Help,
  },
})
export default class RadiobuttonComponent extends mixins(InputMixin, HelpMixin) {
  @Prop() value: boolean | string | number;
  @Prop({ type: Boolean, default: false }) labelToLeft: boolean;
  @Prop({ type: Boolean, default: false }) labelOnTop: boolean;
  @Prop({ type: String, default: 'primary' }) color: string;
  /**
   * Хинт под лейблом
   */
  @Prop() hint: string;

  @Inject({ from: 'radio' }) radio: {
    register(vue: Vue): void;
    unregister(vue: Vue): void;
    size: string;
    disabled: boolean;
    readonly: boolean;
    active: unknown;
    onRadioChange(val: boolean | number | string): void;
    onRadioBlur(event: FocusEvent): void;
    onRadioTab(event: KeyboardEvent): void;
  };

  isFocused = false;
  isLabelHover = false;

  onKeydownHandler: (event: KeyboardEvent) => void;

  @Emit('blur') onBlurEmit() {
    return true;
  }

  mounted() {
    this.radio?.register(this);
  }

  beforeUnmount() {
    this.radio?.unregister(this);
  }

  onFocus(event: FocusEvent) {
    const target = event.target as HTMLElement;
    if (target?.matches && target?.matches(':focus-visible')) {
      this.isFocused = true;
    } else {
      event.preventDefault();
    }
    this.onKeydownHandler = this.onKeydown.bind(this);
    const input = this.$refs.radioInput as HTMLInputElement;
    input.addEventListener('keydown', this.onKeydownHandler);
  }

  onBlur(event: FocusEvent) {
    this.isFocused = false;
    this.radio?.onRadioBlur(event);
    const input = this.$refs.radioInput as HTMLInputElement;
    input.removeEventListener('keydown', this.onKeydownHandler);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.code === 'Tab') {
      this.radio?.onRadioTab(event);
    }
  }

  onLabelClick() {
    if (this.radio.disabled || this.radio.readonly) {
      return;
    }
    (this.$refs.radioInput as HTMLInputElement).click();
  }

  onChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (this.isNumber) {
      this.radio.onRadioChange(Number(value));
      return;
    }
    if (this.isBoolean) {
      this.radio.onRadioChange(value === 'true');
      return;
    }
    this.radio.onRadioChange(value);
  }

  get mySize(): string {
    switch (this.radio.size) {
      case 's':
        return 'x-small';
      case 'm':
        return 'small';
      case 'l':
        return 'large';
    }
  }

  get isNumber(): boolean {
    return typeof this.value === 'number';
  }

  get isBoolean(): boolean {
    return typeof this.value === 'boolean';
  }

  get isChecked(): boolean {
    return this.radio.active === this.value || isEqual(this.radio.active, this.value);
  }

  get uid(): number {
    return uniqueID(6, '0-9') as number;
  }
}
