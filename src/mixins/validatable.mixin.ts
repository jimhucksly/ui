import { Prop, Vue, Watch } from 'vue-property-decorator';
import { ValidateFunction } from '@/types/validation';
import { uidGen } from '../utils/UIDGenerator';
import { requiredRule } from './validators';

export default class ValidatableMixin extends Vue {
  /** набор названий предопределённых правил валидации. Правила описаны в файле */
  @Prop({ type: Array, default: (): Array<ValidateFunction> => [] }) rules: Array<ValidateFunction>;
  /** набор кастомных правил валидации. (пример на https://vuetifyjs.com/ru/components/text-fields) */
  @Prop({ type: Array, default: (): Array<ValidateFunction> => [] }) customRules: Array<ValidateFunction>;
  /** Валидация при пропадании фокуса с инпута */
  @Prop({ type: Boolean, default: true }) validateOnBlur: boolean;

  @Watch('rules', { immediate: true }) onRulesChanged(newVal: Array<(value: ValidateFunction) => boolean>) {
    if (Array.isArray(newVal) && newVal.length) {
      this.myRules = [...newVal, ...this.customRules];
    } else {
      this.myRules = [...this.customRules];
    }
  }

  myRules: Array<ValidateFunction> = [];

  validationMessage = '';
  uid = uidGen(6, '0-9') as number;

  get requiredMessage(): string {
    return this.$ldmuii18n.gettext('Reqiured Message');
  }

  get validRules(): Array<ValidateFunction> {
    return (this as unknown as { required: boolean }).required
      ? [requiredRule(null, this.requiredMessage)].concat(this.myRules)
      : this.myRules;
  }

  get showError(): boolean {
    return this.validRules.length ? Boolean(this.validationMessage) : false;
  }
}
