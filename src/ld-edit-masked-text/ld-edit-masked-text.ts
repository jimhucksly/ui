import { mixins } from 'vue-class-component';
import { IMaskComponent } from 'vue-imask';
import { Inject, Options, Prop, Watch } from 'vue-property-decorator';
import Help from '@/components/help/help.vue';
import Icon from '@/components/icon/icon.vue';
import Label from '@/components/label/label.vue';
import { Emit } from '@/decorators/emit.decorator';
import ComboboxMixin from '@/mixins/combobox.mixin';
import EditMixin from '@/mixins/edit.mixin';
import GridMixin from '@/mixins/grid.mixin';
import HelpMixin from '@/mixins/help.mixin';
import InputMixin from '@/mixins/input.mixin';
import ValidatableMixin from '@/mixins/validatable.mixin';
import { IInjectionForm } from '@/types/form';

type InjectionForm = IInjectionForm;

/**
 * @displayName ld-edit-masked-text
 */
@Options({
  components: {
    'ld-label': Label,
    'ld-help': Help,
    'imask-input': IMaskComponent,
    'svg-icon': Icon,
  },
})
export default class EditMaskedTextComponent extends mixins(
  ValidatableMixin,
  GridMixin,
  InputMixin,
  HelpMixin,
  EditMixin,
  ComboboxMixin
) {
  @Prop({ default: '' }) declare modelValue: string | number;
  @Prop() mask: unknown;
  @Prop() scale: number;
  @Prop() thousandsSeparator: string;
  @Prop() signed: boolean;
  @Prop() mapToRadix: Array<string>;
  @Prop({ default: false, type: Boolean }) clearIcon: boolean;
  @Prop({ type: Boolean, default: false }) beautify: boolean;

  @Inject({ from: 'form', default: null }) declare form: InjectionForm;

  internalValue = '';
  isFocused = false;

  @Emit('update:model-value') emitUpdateModelValue(value: string) {
    return value;
  }

  @Emit('enter') emitEnter() {
    return true;
  }

  @Watch('modelValue') onTextChanged() {
    this.internalValue = this.modelValue ? String(this.modelValue) : '';
    this.validate();
  }

  created() {
    this.internalValue = this.modelValue ? String(this.modelValue) : '';
  }

  onFocus(e: FocusEvent) {
    this.validationMessage = '';
    this.isFocused = true;
  }

  onBlur() {
    if (this.validateOnBlur) {
      this.validate();
    }
    this.isFocused = false;
  }

  onClick() {
    this.validationMessage = '';
  }

  onInput(e: string) {
    if (!this.beautify) {
      const emitData = e?.length ? e?.replace(/\s|(-)/g, '') : null;
      this.emitUpdateModelValue(emitData);
      return;
    }
    this.emitUpdateModelValue(e?.length ? e : null);
  }

  onEnter() {
    this.emitEnter();
  }

  validate(): boolean {
    let funcResult = null;
    this.validationMessage = '';

    if (
      typeof this.mask === 'string' &&
      /[ ()-]/.test(this.internalValue) &&
      this.internalValue.length > 0 &&
      this.mask.replace(/[ ()-]/g, '').length > this.internalValue.length
    ) {
      this.validationMessage = 'Недостаточное количество символов';
      return !this.validationMessage;
    }

    this.validRules.forEach(func => {
      funcResult = func(this.modelValue);
      if (funcResult !== true) {
        this.validationMessage = funcResult as string;
      }
    });
    return !this.validationMessage;
  }

  get showError(): boolean {
    return Boolean(this.validationMessage);
  }

  get warningHint(): boolean {
    return Boolean(this.validationMessage);
  }
}
