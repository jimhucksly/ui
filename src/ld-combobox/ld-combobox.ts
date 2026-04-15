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
import { TElement } from '@/types/combobox';
import { IInjectionForm } from '@/types/form';
import { requiredRule } from '../mixins/validators';

type InjectionForm = IInjectionForm;

/**
 * Комбобокс
 * @displayName ld-combobox
 */
@Options({
  name: 'ComboboxComponent',
  components: {
    'ld-label': Label,
    'ld-help': Help,
    'svg-icon': Icon,
  },
})
export default class ComboboxComponent extends mixins(
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
   * Отключает серверный поиск
   */
  @Prop({ type: Boolean, default: false }) internalSearch: boolean;
  /**
   * Запрет удаления всех элементов. Хотя бы один должен быть выбран всегда
   */
  @Prop({ type: Boolean, default: true }) allowEmpty: boolean;

  @Inject({ from: 'form', default: null }) declare form: InjectionForm;

  noDataMessage = '';
  getItems: DebouncedFunc<(...args: unknown[]) => unknown> = null;

  @Emit('blur') emitBlur(value: unknown) {
    return value;
  }

  @Emit('click') emitClick() {
    return true;
  }

  created() {
    this.getItems = debounce(this.goSearch.bind(this), 600);
  }

  onBlur(e: FocusEvent) {
    this.emitBlur(e);
    this.validate();
  }

  onFocus(e: FocusEvent) {
    this.validationMessage = '';
  }

  onFocused(value: boolean) {
    this.onMenu(value);
    if (value) {
      this.goSearch();
    }
  }

  async goSearch(searchTerm: string = '') {
    this.searchTerm = searchTerm;
    try {
      if (this.internalSearch) {
        this.optionsList = this.filterOptions(searchTerm);
      } else {
        if (this.hasElements) {
          this.noDataMessage = this.myMessages.search;
        } else if (this.fetchData instanceof Function) {
          this.noDataMessage = this.myMessages.loading;
        } else if (searchTerm) {
          this.noDataMessage = this.myMessages.noResults;
        } else {
          this.noDataMessage = this.myMessages.empty;
        }
        if (searchTerm || !this.hasElements) {
          await this.fetchElements(searchTerm);
        }
      }
      if (!this.menu) {
        this.onMenu(true);
      }
      if (!this.hasOptions) {
        this.noDataMessage = this.myMessages.empty;
      }
    } catch (e) {
      this.throwError(e);
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

  private filterOptions(searchTerm: string): Array<TElement> {
    if (!searchTerm) {
      return this.items;
    }
    const filterFunc = (item: TElement): boolean => {
      if (this.comboboxService.isSimple(item)) {
        return String(item).toLowerCase() === searchTerm.toLowerCase();
      }
      if (this.comboboxService.isObject(item)) {
        const value = this.comboboxService.deepValueOfItem(item, this.itemTitle);
        return String(value).toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      }
    };
    return this.items.filter(filterFunc);
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
