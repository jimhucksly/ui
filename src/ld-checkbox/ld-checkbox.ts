import { mixins, Options, Prop, Watch } from 'vue-property-decorator';
import Help from '@/components/help/help.vue';
import Label from '@/components/label/label.vue';
import { Emit } from '@/decorators/emit.decorator';
import GridMixin from '@/mixins/grid.mixin';
import HelpMixin from '@/mixins/help.mixin';
import InputMixin from '@/mixins/input.mixin';

/**
 * Чекбокс
 * @displayName ld-checkbox
 */
@Options({
  components: {
    'ld-help': Help,
    'ld-label': Label,
  },
})
export default class CheckboxComponent extends mixins(InputMixin, GridMixin, HelpMixin) {
  @Prop() modelValue: unknown;
  /** Указывает, какое значение принимает переменная, связанная через v-model когда checked=true
   * Желательно вместе с checkedValue указывать uncheckedValue
   */
  @Prop() checkedValue: unknown;
  /** Указывает, какое значение принимает переменная, связанная через v-model когда checked=false
   * Желательно вместе с uncheckedValue указывать checkedValue
   */
  @Prop() uncheckedValue: unknown;
  /**
   * Исходное значение, используется когда modelValue - массив
   */
  @Prop() initialValue: unknown;
  /**
   * id для автотестов
   */
  @Prop() dataTestid: string;
  /**
   * цвет текста, когда элемент выделен
   */
  @Prop({ type: String, default: 'primary' }) color: string;
  /**
   * Размещать label слева от чекбокса?
   */
  @Prop({ default: false }) labelToLeft: boolean;
  /**
   * Хинт под лейблом
   */
  @Prop() hint: string;
  /**
   * Размер чекбокса
   */
  @Prop({ type: String, default: 'm' }) size: 's' | 'm' | 'l';

  internalValue = false;
  isFocused = false;
  isLabelHover = false;

  @Emit('update:model-value') emitUpdateModelValue(value: unknown) {
    return value;
  }

  @Watch('modelValue', { deep: true }) onValueChanged() {
    if (this.modelValue === this.internalValue) {
      return;
    }
    if (this.$utils.isDefined(this.checkedValue) && this.$utils.isDefined(this.uncheckedValue)) {
      this.internalValue = this.modelValue === this.checkedValue;
    } else if (Array.isArray(this.modelValue)) {
      this.internalValue = this.modelValue.includes(this.initialValue);
    } else {
      this.internalValue = Boolean(this.modelValue);
    }
  }

  created() {
    if (this.$utils.isDefined(this.checkedValue) && this.$utils.isDefined(this.uncheckedValue)) {
      this.internalValue = this.modelValue === this.checkedValue;
    } else if (Array.isArray(this.modelValue)) {
      this.internalValue = this.modelValue.includes(this.initialValue);
    } else {
      this.internalValue = Boolean(this.modelValue);
    }
  }

  onChange(event: InputEvent) {
    const checked = (event.target as HTMLInputElement).checked;
    if (this.$utils.isDefined(this.checkedValue) && this.$utils.isDefined(this.uncheckedValue)) {
      this.fireinputEvent(checked ? this.checkedValue : this.uncheckedValue);
    } else if (Array.isArray(this.modelValue)) {
      if (checked) {
        this.fireinputEvent(this.uniqueArray(this.addValue()));
      } else {
        this.fireinputEvent([...this.modelValue].filter(el => el !== this.initialValue));
      }
    } else {
      this.fireinputEvent(checked);
    }
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

  get isChecked() {
    if (this.$utils.isDefined(this.checkedValue)) {
      return this.modelValue === this.checkedValue || this.internalValue === this.checkedValue;
    }
    if (this.$utils.isDefined(this.initialValue) && Array.isArray(this.modelValue)) {
      return this.modelValue.includes(this.initialValue);
    }
    return this.modelValue === true;
  }

  get mySize(): string {
    if (this.size === 's') {
      return 'ld-checkbox--x-small';
    }
    if (this.size === 'm') {
      return 'ld-checkbox--small';
    }
    if (this.size === 'l') {
      return 'ld-checkbox--large';
    }
  }

  private addValue() {
    if (Array.isArray(this.modelValue)) {
      return [...this.modelValue].concat([this.initialValue]);
    }
    return [];
  }

  private fireinputEvent(data: unknown) {
    this.emitUpdateModelValue(data);
  }

  private uniqueArray(arr: Array<unknown>): Array<unknown> {
    return Array.from(new Set(arr));
  }
}
