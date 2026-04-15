import debounce, { DebouncedFunc } from 'lodash-es/debounce';
import { mixins } from 'vue-class-component';
import { IMaskComponent } from 'vue-imask';
import { Inject, Options, Prop, Watch } from 'vue-property-decorator';
import Help from '@/components/help/help.vue';
import Icon from '@/components/icon/icon.vue';
import Label from '@/components/label/label.vue';
import { Emit } from '@/decorators/emit.decorator';
import EditMixin from '@/mixins/edit.mixin';
import GridMixin from '@/mixins/grid.mixin';
import HelpMixin from '@/mixins/help.mixin';
import InputMixin from '@/mixins/input.mixin';
import ValidatableMixin from '@/mixins/validatable.mixin';
import { IInjectionForm } from '@/types/form';

type InjectionForm = IInjectionForm;

/**
 * @displayName ld-edit-text
 */
@Options({
  components: {
    'imask-input': IMaskComponent,
    'ld-label': Label,
    'ld-help': Help,
    'svg-icon': Icon,
  },
})
export default class EditTextComponent extends mixins(ValidatableMixin, GridMixin, InputMixin, EditMixin, HelpMixin) {
  @Prop({ type: String, default: undefined }) id: string;
  @Prop() modelValue: string | number;
  /** устанавливает тип ввода для input (text | password) */
  @Prop({ default: 'text' }) type: string;
  /** Максимальное количество символов, которое можно ввести */
  @Prop() maxlength: number | string;
  /** Позволяет вводить в поле только цифры*/
  @Prop({ type: Boolean, default: false }) onlyNumbers: boolean;
  /** При включенном параметре onlyNumbers - запрет ввода 0 */
  @Prop({ type: Boolean, default: false }) nonZero: boolean;
  /** Ограничивает количество символов после запятой, 0 - для целых чисел (только для onlyNumbers=true) */
  @Prop() scale: number;
  /** Ограничивает минимальное значение (только для onlyNumbers=true) */
  @Prop() minValue: number;
  /** Ограничивает максимальное значение (только для onlyNumbers=true)*/
  @Prop() maxValue: number;
  /** Добавляет возможность ввода отрицательных чисел (только для onlyNumbers=true)*/
  @Prop({ type: Boolean, default: false }) signed: boolean;
  /** Включение задержки между вводом значения и передачей его в родительский компонент.
   * Нужно, например, для строки поиска
   */
  @Prop() debounced: number;

  @Inject({ from: 'form', default: null }) declare form: InjectionForm;

  /**
   * используется для числового ввода (onlyNumbers = true),
   * string из-за требований imask-input (он ждёт строку)
   */
  value = '-1';
  debouncedFunc: DebouncedFunc<(...args: unknown[]) => unknown> = null;

  savedModelValue = '';
  passwordVisible = false;

  isFocused = false;

  @Emit('enter') emitEnter(e: KeyboardEvent) {
    return e;
  }

  @Emit('keydown') emitKeydown(e: KeyboardEvent) {
    return e;
  }

  @Emit('change') emitChange(e: unknown) {
    return e;
  }

  @Emit('update:model-value') emitUpdateModelValue(value: unknown) {
    return value;
  }

  @Emit('update:value') emitUpdateValue(value: unknown) {
    return value;
  }

  @Emit('input') emitInput(value: unknown) {
    return value;
  }

  @Emit('click') emitClick(e: unknown) {
    return e;
  }

  @Emit('clear') emitClear() {
    return true;
  }

  @Emit('copy') emitCopy(e: unknown) {
    return e;
  }

  @Emit('blur') emitBlur(e: unknown) {
    return e;
  }

  @Emit('focus') emitFocus(e: unknown) {
    return e;
  }

  @Watch('modelValue') onTextChanged() {
    if (!this.onlyNumbers && this.$refs.vInput) {
      this.validate();
    } else {
      if (this.value && String(this.value) === String(this.modelValue)) {
        return;
      }
      this.value = Number.isNaN(Number(this.modelValue)) ? '' : (this.modelValue || '').toString();
      this.validate();
    }
  }

  @Watch('value') onValueChanged(newVal: string) {
    if (newVal === '') {
      return;
    }
    const emitData = this.$utils.isDefined(newVal) ? Number(newVal) : null;
    if (this.nonZero && emitData === 0) {
      this.value = null;
    }
    this.emitUpdateModelValue(emitData);
  }

  @Watch('onlyNumbers', { immediate: true }) onlyNumbersChange(newVal: boolean) {
    if (newVal) {
      if (!this.modelValue) {
        this.value = '0';
      } else {
        this.value = Number.isNaN(Number(this.modelValue)) ? '' : this.modelValue.toString();
      }
      this.form?.register(this, null);
    } else {
      this.form?.unregister(this, null);
    }
  }

  @Watch('debounced') onDebouncedChanged() {
    if (this.debounced && !this.debouncedFunc) {
      this.debouncedFunc = debounce((value: unknown) => this.emitUpdateModelValue(value), this.debounced);
    }
  }

  created() {
    if (this.debounced) {
      this.debouncedFunc = debounce((value: unknown) => this.emitUpdateModelValue(value), this.debounced);
    }
    if (this.modelValue) {
      this.onUpdateModelValue(String(this.modelValue));
    }
  }

  onFocus(e: FocusEvent) {
    this.emitFocus(e);
    this.validationMessage = '';
    this.isFocused = true;
  }

  onBlur(e: FocusEvent) {
    this.emitBlur(e);
    if (this.onlyNumbers && this.value === '') {
      this.value = '0';
    }
    this.validate();
    this.isFocused = false;
  }

  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.emitEnter(e);
    } else {
      this.emitKeydown(e);
    }
  }

  onUpdateModelValue(value: string) {
    if (this.type === 'password' && !this.passwordVisible) {
      const val = value.replace(/•/g, '');
      if (val.length === 0) {
        this.savedModelValue = this.savedModelValue.slice(0, value.length);
      } else if (value.length === 1) {
        this.savedModelValue = val;
      } else if (value.length > 1) {
        this.savedModelValue += val;
      }
      value = value
        .split('')
        .map(i => '•')
        .join('');
    } else {
      this.savedModelValue = value;
    }
    if (this.debounced) {
      this.debouncedFunc(value);
    } else {
      this.emitUpdateModelValue(value);
      this.emitUpdateValue(this.savedModelValue);
      this.emitInput(this.savedModelValue);
    }
  }

  passwordVisibilityToggle() {
    this.passwordVisible = !this.passwordVisible;
    if (this.passwordVisible) {
      this.onUpdateModelValue(this.savedModelValue);
    } else {
      this.savedModelValue = '';
      this.onUpdateModelValue(this.modelValue as string);
    }
  }

  validate(): boolean {
    let funcResult = null;
    this.validationMessage = '';
    for (const func of this.validRules) {
      if (this.validationMessage) {
        break;
      }
      const value = this.type === 'password' ? this.savedModelValue : this.modelValue;
      funcResult = func(value);
      if (typeof funcResult === 'string') {
        this.validationMessage = funcResult;
      }
    }
    return !this.validationMessage;
  }

  focus() {
    const input: HTMLInputElement = this.$el?.querySelector('input');
    if (input) {
      input.focus();
    }
  }
}
