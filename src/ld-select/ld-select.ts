import { Inject, mixins, Options, Vue } from 'vue-property-decorator';
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

interface IInjectionForm {
  register?: (Component: Vue, param: unknown) => void;
  unregister?: (Component: Vue, param: unknown) => void;
}

/**
 * @displayName ld-select
 */
@Options({
  name: 'SelectComponent',
  components: {
    'ld-label': Label,
    'ld-help': Help,
    'svg-icon': Icon,
  },
})
export default class SelectComponent extends mixins(
  InputMixin,
  GridMixin,
  ValidatableMixin,
  HelpMixin,
  EditMixin,
  ComboboxMixin
) {
  @Inject({ from: 'form', default: null }) declare form: IInjectionForm;

  @Emit('blur') emitBlur(value: FocusEvent) {
    return value;
  }

  onBlur(e: FocusEvent) {
    this.emitBlur(e);
    this.validate();
  }

  onFocus(e: FocusEvent) {
    this.validationMessage = '';
  }

  validate(): boolean {
    let funcResult = null;
    this.validationMessage = '';
    this.validRules.forEach(func => {
      funcResult = func(this.modelValue);
      if (typeof funcResult === 'string') {
        this.validationMessage = funcResult;
      }
    });
    return !this.validationMessage;
  }
}
