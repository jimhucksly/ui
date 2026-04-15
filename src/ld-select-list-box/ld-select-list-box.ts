import debounce, { DebouncedFunc } from 'lodash-es/debounce';
import { mixins } from 'vue-class-component';
import { Inject, Options, Prop } from 'vue-property-decorator';
import Help from '@/components/help/help.vue';
import Icon from '@/components/icon/icon.vue';
import Label from '@/components/label/label.vue';
import { Emit } from '@/decorators/emit.decorator';
import ComboboxMixin, { InternalError } from '@/mixins/combobox.mixin';
import EditMixin from '@/mixins/edit.mixin';
import GridMixin from '@/mixins/grid.mixin';
import HelpMixin from '@/mixins/help.mixin';
import HighlightMixin from '@/mixins/highlight.mixin';
import InputMixin from '@/mixins/input.mixin';
import ValidatableMixin from '@/mixins/validatable.mixin';
import { IInjectionForm } from '@/types/form';
import { requiredRule } from '../mixins/validators';

type InjectionForm = IInjectionForm;

/**
 * @displayName ld-select-list-box
 */
@Options({
  name: 'SelectListBoxComponent',
  components: {
    'ld-label': Label,
    'ld-help': Help,
    'svg-icon': Icon,
  },
})
export default class SelectListBoxComponent extends mixins(
  ValidatableMixin,
  GridMixin,
  InputMixin,
  HelpMixin,
  EditMixin,
  ComboboxMixin,
  HighlightMixin
) {
  @Prop() modelItems: Array<Record<string, unknown>> | string;
  /**
   * Запрет удаления всех элементов. Хотя бы один должен быть выбран всегда
   */
  @Prop({ type: Boolean, default: true }) allowEmpty: boolean;
  /**
   * Иконка кнопки, открывающей диалог выбора элемента из списка
   */
  @Prop({ default: 'more_horiz' }) icon: string;

  @Inject({ from: 'form', default: null }) declare form: InjectionForm;

  noDataMessage = '';
  getItems: DebouncedFunc<(...args: unknown[]) => unknown> = null;

  isFocused = false;

  @Emit('blur') emitBlur(value: unknown) {
    return value;
  }

  @Emit('click') emitClick() {
    return true;
  }

  created() {
    this.getItems = debounce(this.goSearch.bind(this), this.debounceDelay);
  }

  onBlur(e: FocusEvent) {
    this.isFocused = false;
    this.emitBlur(e);
    this.validate();
  }

  onFocus(e: FocusEvent) {
    this.validationMessage = '';
    this.isFocused = true;
  }

  async goSearch(searchTerm: string = '') {
    this.searchTerm = searchTerm;
    if (!searchTerm) {
      if (!this.fireEventSelect) {
        this.onMenu(false);
      }
      return;
    }
    this.loading = true;
    this.noDataMessage = this.myMessages.search;
    this.onMenu(true);
    try {
      await this.fetchElements(searchTerm);
      if (!this.hasOptions) {
        this.noDataMessage = this.myMessages.empty;
      }
    } catch (e) {
      this.throwError(e);
    } finally {
      this.loading = false;
    }
  }

  validate() {
    this.validationMessage = '';
    let funcResult: string | boolean = true;
    if (this.required) {
      funcResult = requiredRule()(this.selectedToArray);
      if (funcResult !== true) {
        this.validationMessage = this.myMessages.validation || (funcResult as string);
        return false;
      }
    }
    this.myRules.forEach(func => {
      funcResult = func(this.selectedToArray);
      if (funcResult !== true) {
        this.validationMessage = funcResult as string;
      }
    });
    return !this.validationMessage;
  }

  private throwError(e: Error | InternalError) {
    if (e instanceof InternalError || e.message === 'internal error') {
      //
    } else {
      /* eslint-disable no-console */
      console.error(e);
    }
  }

  get canRemove(): boolean {
    if (this.readonly || this.disabled) {
      return false;
    }
    if (!this.allowEmpty && this.multiselect && Array.isArray(this.selected)) {
      return this.selected.length > 1;
    }
    return true;
  }
}
