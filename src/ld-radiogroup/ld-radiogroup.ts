import { nextTick } from 'vue';
import { mixins, Options, Vue } from 'vue-class-component';
import { Inject, Prop, Provide, Watch } from 'vue-property-decorator';
import Help from '@/components/help/help.vue';
import Label from '@/components/label/label.vue';
import { Emit } from '@/decorators/emit.decorator';
import GridMixin from '@/mixins/grid.mixin';
import HelpMixin from '@/mixins/help.mixin';
import InputMixin from '@/mixins/input.mixin';
import ValidatableMixin from '@/mixins/validatable.mixin';
import { IInjectionForm } from '@/types/form';
import { requiredRule } from '../mixins/validators';

type InjectionForm = IInjectionForm;

interface IRadio extends Vue {
  label: string;
  isFirst: boolean;
  isChecked: boolean;
  isDisabled: boolean;
  value: unknown;
}

/**
 * @displayName ld-radiogroup
 */
@Options({
  components: {
    'ld-label': Label,
    'ld-help': Help,
  },
})
export default class RadioGroupComponent extends mixins(InputMixin, GridMixin, HelpMixin, ValidatableMixin) {
  @Prop() modelValue: unknown;
  @Prop({ type: Boolean, default: false }) row: boolean;
  @Prop({ type: Boolean, default: true }) column: boolean;
  @Prop() values: Array<IRadio>;
  @Prop({ type: String, default: 's' }) size: 's' | 'm' | 'l';
  @Prop({ type: String, default: 'ltr' }) direction: 'ltr' | 'rtl';

  @Inject({ from: 'form', default: null }) form: InjectionForm;

  @Provide({
    to: 'radio',
    reactive: true,
  })
  radio: {
    register: IInjectionForm['register'];
    unregister: IInjectionForm['unregister'];
    size: string;
    disabled: boolean;
    readonly: boolean;
    active: unknown;
    onRadioChange: (value: number | string) => void;
    onRadioBlur: (event: FocusEvent) => void;
    onRadioTab: (event: FocusEvent) => void;
  } = {
    register: this.register.bind(this),
    unregister: this.unregister.bind(this),
    size: null,
    disabled: false,
    readonly: false,
    active: null,
    onRadioChange: this.onRadioChange.bind(this),
    onRadioBlur: this.onRadioBlur.bind(this),
    onRadioTab: this.onRadioTab.bind(this),
  };

  radiogroup: { onRadioChange: () => void } = null;

  radios: Array<IRadio> = [];
  internalValue: unknown = null;
  hasInput = false;
  showInputHint = false;

  @Emit('update:model-value') emitUpdateModelValue(value: unknown) {
    return value;
  }

  @Emit('blur') emitBlur(value: FocusEvent) {
    return value;
  }

  @Watch('modelValue', { immediate: true }) onValueChange() {
    // eslint-disable-next-line no-undefined
    if (this.modelValue === undefined || this.modelValue === null) {
      return;
    }
    this.internalValue = this.modelValue;
  }

  @Watch('radios.length', { immediate: true, deep: true }) onRadiosChange() {
    if (!this.radios || !this.radios.length) {
      return;
    }
    if (this.required && !this.$utils.isDefined(this.modelValue)) {
      this.internalValue = this.radios[0].value;
      this.emitUpdateModelValue(this.internalValue);
    }
  }

  @Watch('disabled', { immediate: true }) onDisabled() {
    this.radio.disabled = this.disabled;
  }

  @Watch('readonly', { immediate: true }) onReadonly() {
    this.radio.readonly = this.readonly;
  }

  @Watch('size', { immediate: true }) onSizeChanged() {
    this.radio.size = this.size;
  }

  @Watch('internalValue', { immediate: true }) onValueChanged() {
    this.radio.active = this.internalValue;
  }

  created() {
    this.radiogroup = {
      onRadioChange: () => {
        this.emitUpdateModelValue(this.internalValue);
      },
    };
  }

  onRadioChange(value: number | string) {
    if (this.disabled) {
      return;
    }
    this.hasInput = true;
    this.internalValue = value;
    this.radiogroup.onRadioChange();
    nextTick(() => this.validate());
  }

  onRadioBlur(event: FocusEvent) {
    if (!event.relatedTarget || !(event.relatedTarget as HTMLElement).classList.contains('card-radiobutton')) {
      this.hasInput = true;
      this.emitBlur(event);
    }
  }

  onRadioTab(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const tabindex = input.tabIndex;
    const parent = document.getElementById(`radiogroup-${this.uid}`);
    if (parent) {
      const inputs = parent.querySelectorAll('input');
      if (inputs.length) {
        Array.prototype.forEach.call(Array.from(inputs), (item: HTMLInputElement) => {
          if (item.tabIndex === tabindex + 1) {
            item.focus();
            event.preventDefault();
            event.stopPropagation();
          }
        });
      }
    }
  }

  register(radio: IRadio) {
    this.radios.push(radio);
  }

  unregister(radio: IRadio) {
    const index = this.radios.findIndex(r => r === radio);
    if (index > -1) {
      this.radios.splice(index, 1);
    }
  }

  validate() {
    this.validationMessage = '';
    const validationResult = requiredRule()(String(this.modelValue));
    if (validationResult !== true) {
      this.validationMessage = validationResult as string;
    }
    return !this.validationMessage;
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

  get showHint() {
    return Boolean(this.validationMessage || (this.inputHint && this.showInputHint));
  }

  get hasError(): boolean {
    return Boolean(this.validationMessage);
  }

  get viewClass(): Array<string> {
    return [
      `ld-radiogroup--${this.row && !this.column ? 'row' : 'column'}`,
      `ld-radiogroup--${this.mySize}`,
      `ld-radiogroup--${this.direction}`,
    ];
  }
}
