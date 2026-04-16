import { isDefined } from '@dn-web/core';
import { mixins, Options, Prop, Watch } from 'vue-property-decorator';
import Help from '@/components/help/help.vue';
import Label from '@/components/label/label.vue';
import { Emit } from '@/decorators/emit.decorator';
import HelpMixin from '@/mixins/help.mixin';
import InputMixin from '@/mixins/input.mixin';

/**
 * @displayName ld-switch
 */
@Options({
  components: {
    'ld-help': Help,
    'ld-label': Label,
  },
})
export default class SwitchComponent extends mixins(InputMixin, HelpMixin) {
  @Prop() modelValue: boolean | string | number;
  @Prop() trueValue: string | number;
  @Prop() falseValue: string | number;
  @Prop({ type: String, default: 's' }) size: 's' | 'm' | 'l';
  /**
   * Хинт под лейблом
   */
  @Prop() hint: string;

  internalValue: boolean | string | number = false;
  isFocused = false;
  isLabelHover = false;

  @Emit('update:model-value') emitValue(val: boolean | string | number) {
    return val;
  }

  @Watch('modelValue', { immediate: true }) onModelChanged(val: boolean | string | number) {
    this.internalValue = this.getValue(this.modelValue);
  }

  @Watch('internalValue', { immediate: true }) onValueChanged(val: boolean | string | number) {
    this.emitValue(val);
  }

  onFocus(event: FocusEvent) {
    const target = event.target as HTMLElement;
    if (target?.matches && target?.matches(':focus-visible')) {
      this.isFocused = true;
    } else {
      event.preventDefault();
    }
  }

  onBlur() {
    this.isFocused = false;
  }

  onLabelClick() {
    (this.$refs.checkbox as HTMLInputElement).click();
    (this.$refs.checkbox as HTMLInputElement).focus();
  }

  onChange(event: InputEvent) {
    if (this.disabled || this.readonly) {
      return;
    }
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.emitValue(this.positiveValue);
    } else {
      this.emitValue(this.negativeValue);
    }
  }

  private getValue(value: boolean | string | number) {
    if (!isDefined(value)) {
      return false;
    }
    if (isDefined(this.trueValue) && isDefined(this.falseValue)) {
      if (value === this.trueValue) {
        return this.trueValue;
      }
      return this.falseValue;
    }
    return value;
  }

  get positiveValue(): boolean | string | number {
    if (isDefined(this.trueValue) && isDefined(this.falseValue)) {
      return this.trueValue;
    }
    return true;
  }

  get negativeValue(): boolean | string | number {
    if (isDefined(this.trueValue) && isDefined(this.falseValue)) {
      return this.falseValue;
    }
    return false;
  }

  get checked(): boolean {
    if (isDefined(this.trueValue) && isDefined(this.falseValue)) {
      return this.internalValue === this.trueValue;
    }
    return Boolean(this.internalValue);
  }

  get mySize(): string {
    if (this.size === 's') {
      return 'ld-switch--x-small';
    }
    if (this.size === 'm') {
      return 'ld-switch--small';
    }
    if (this.size === 'l') {
      return 'ld-switch--large';
    }
  }

  get sizes() {
    return {
      s: 16,
      m: 20,
      l: 28,
    };
  }
}
