import { isDefined } from '@dn-web/core';
import { Inject, Prop, Vue, Watch } from 'vue-property-decorator';
import { IInjectionForm } from '../types/form';

type InjectionForm = IInjectionForm;

export default class InputMixin extends Vue {
  /** устанавливает флаг disabled на input */
  @Prop({ default: false, type: Boolean }) disabled: boolean;
  /** помечает поле обязательным, включается визуальная валидация на заполненность */
  @Prop({ default: false, type: Boolean }) required: boolean;
  /** запрещает редактирование, но оставляет содержимое легко читаемым */
  @Prop({ default: false, type: Boolean }) readonly: boolean;
  /** Label для инпута */
  @Prop({ default: '', type: String }) label: string;
  /** подсказка над лэйблом. Появляется при наведении курсора на лэйбл */
  @Prop({ default: '', type: String }) labelHint: string;
  /** подсказка под полем ввода. Появляется когда фокус на поле ввода */
  @Prop() inputHint: string;
  /** влючает перманентное отображение подсказки под полем ввода */
  @Prop({ type: Boolean, default: false }) persistentHint: boolean;
  /** выравнивает label по правому краю, прижимая его к полю ввода */
  @Prop({ type: Boolean, default: false }) alignLabelToRight: boolean;
  /** очерёдность переключения между полями ввода по нажатию tab. Начинается с 1 */
  @Prop() tabindex: number | string;
  /** устанавливает авто фокус на поле ввода **/
  @Prop({ type: Boolean, default: undefined }) autofocus: boolean;
  /** управление областью вывода сообщений об ошибке */
  @Prop({ type: Boolean, default: false }) hideDetails: boolean;
  @Prop({ type: String, default: '' }) placeholder: string;
  @Prop({ type: String, default: '' }) prependInnerIcon: string;
  @Prop({ type: String, default: 'off' }) autocomplete: string;

  @Inject({ from: 'form', default: null }) form: InjectionForm;

  @Watch('required') onRequiredChanged() {
    if (!this.required && (this as unknown as { validate: () => boolean }).validate) {
      (this as unknown as { validate: () => boolean }).validate();
    }
  }

  created() {
    if (this.form) {
      this.form.register(this, null);
    }
  }

  mounted() {
    if (isDefined(this.autofocus) && this.$el instanceof HTMLElement) {
      const input: HTMLInputElement = this.$el.querySelector('input[type="text"]');
      if (input) {
        input.setAttribute('autofocus', `${Boolean(this.autofocus)}`);
        return;
      }
      const textarea: HTMLTextAreaElement = this.$el.querySelector('textarea');
      if (textarea) {
        textarea.setAttribute('autofocus', `${Boolean(this.autofocus)}`);
      }
    }
  }

  unmounted() {
    if (this.form) {
      this.form.unregister(this, null);
    }
  }

  get inputBindings(): Record<string, unknown> {
    return {
      variant: 'outlined',
      placeholder: this.placeholder,
      hint: this.inputHint,
      persistentHint: this.persistentHint,
      hideDetails: this.hideDetails,
      readonly: this.readonly,
      disabled: this.disabled,
      autofocus: this.autofocus,
      tabindex: this.tabindex,
      autocomplete: this.autocomplete,
    };
  }
}
