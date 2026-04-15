import isEqual from 'lodash-es/isEqual';
import { ComponentInternalInstance, getCurrentInstance } from 'vue';
import { Prop, Vue, Watch } from 'vue-property-decorator';
import { Emit } from '@/decorators/emit.decorator';
import ComboboxService from '@/services/combobox.service';
import { IComboboxItem, IMessages } from '../types/combobox';

type Messages = IMessages;
type TElement = string | number | IComboboxItem;

enum ComponentName {
  Combobox = 'ComboboxComponent',
  Select = 'SelectComponent',
  SelectListBox = 'SelectListBoxComponent',
}

export class InternalError extends Error {
  constructor(err: Error | string = 'internal error') {
    if (err instanceof Error) {
      super(err.message);
      return;
    }
    super(err);
  }
}

class InstanceService {
  componentName: ComponentName = null;

  constructor(public instance: ComponentInternalInstance) {
    this.componentName = instance?.type?.name as ComponentName;
  }
}

export default class ComboboxMixin extends Vue {
  @Prop() modelValue: TElement | Array<TElement>;
  /**
   * Полный список элементов в выпадающем списке
   */
  @Prop({ type: Array, default: undefined }) items: Array<TElement>;
  @Prop({ type: Boolean, default: false }) multiselect: boolean;
  @Prop({ type: String, default: 'id' }) itemValue: string;
  @Prop({ type: String, default: 'value' }) itemTitle: string;
  @Prop({ type: String, default: '' }) itemSubtitle: string;
  @Prop({ type: Boolean, default: false }) returnObject: boolean;
  @Prop({ type: Boolean, default: false }) chips: boolean;
  @Prop({ type: Boolean, default: true }) closableChips: boolean;
  /**
   * влючает отображение подсказки под элементом списка
   */
  @Prop({ type: Boolean, default: false }) optionHint: boolean;

  @Prop({ type: Object, default: (): Record<string, string> => ({}) }) messages: Messages;
  @Prop() fetchData: (searchTerm?: string) => Promise<Array<TElement>>;
  @Prop() fetchItem: (ids: number | string | Array<number | string>) => Promise<Array<TElement>>;
  @Prop() select: () => Promise<Array<TElement>>;
  /**
   * Применяется с multiselect=true.
   * Указывает, сколько выбранных элементов отображать в поле ввода.
   * В случае превышения этого числа в поле ввода
   * добавляется надписть "(+n элементов)"
   */
  @Prop({ default: 9999 }) limit: number;
  /**
   * Загружать элементы списка при инициализации компонента или нет
   */
  @Prop({ type: Boolean, default: false }) lazyLoad: boolean;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  selected: any = null;

  /**
   * Полный список элементов в выпадающем списке
   */
  elements: Array<TElement> = [];

  /**
   * Список элементов в выпадающем списке после применения фильтрации
   */
  optionsList: Array<TElement> = [];

  menu = false;

  menuCallback: {
    state: boolean;
    callback: () => void;
  } = null;

  displaySelected = false;

  fireEventSelect = false;

  myMessages: IMessages = {
    loading: '',
    search: '',
    empty: '',
    noResults: '',
    validation: '',
    nonUnique: '',
    invalid: '',
  };

  searchTerm = '';

  loading = false;

  readonly debounceDelay = 600;

  onResizeHandler: () => void;

  @Emit('update:model-value') emitUpdateModelValue(value: unknown = null) {
    if (this.$utils.isDefined(value)) {
      return value;
    }
    if (this.multiselect) {
      return this.selectedIds;
    }
    return this.selectedIds.length ? this.selectedIds[0] : null;
  }

  @Emit('update:model-items') emitUpdateItems() {
    if (this.multiselect) {
      return this.selectedToArray;
    }
    return this.selectedToArray.length ? this.selectedToArray[0] : null;
  }

  @Emit('input') emitInput() {
    return true;
  }

  @Watch('items', { immediate: true, deep: true }) omItemsChanged() {
    this.elements = this.items;
  }

  @Watch('returnObject') onReturnObjectChanged() {
    this.emitUpdate();
  }

  @Watch('multiselect') onMultiselectChanged() {
    this.emitUpdate();
  }

  @Watch('modelValue', { deep: true, immediate: true }) onModelValueChanged(value: TElement | Array<TElement>) {
    if (!this.$utils.isDefined(value)) {
      if (this.hasSelectedItems) {
        this.onClear();
      }
    }
    const array = this.comboboxService.toArray(value) as Array<number | string>;
    if (this.comboboxService.isEmpty(array)) {
      this.onClear();
      this.setSelected(array);
    } else {
      if (isEqual(array, this.selectedIds)) {
        return;
      }
      this.setSelected(array);
    }
  }

  @Watch('selected', { deep: true }) onSelectedChanged(newVal: unknown, oldVal: unknown) {
    if (isEqual(newVal, oldVal)) {
      return;
    }
    if (this.multiselect) {
      this.$fireEventSelect();
    }
    this.selected = this.selectedValidation(newVal, oldVal);
    this.emitUpdate();
  }

  @Watch('elements') onItemsChanged() {
    if (this.hasElements) {
      const valid = this.elementsType.arrayOfSimple || this.elementsType.arrayOfObject;
      if (!valid) {
        throw new InternalError();
      }
      this.onModelValueChanged(this.modelValue);
    } else {
      this.onClear();
    }
  }

  @Watch('menu') onMenuChanged(value: boolean) {
    if (!this.menuCallback) {
      return;
    }
    if (this.menuCallback.state !== value && this.menuCallback.callback instanceof Function) {
      this.menuCallback.callback();
      this.$nextTick(() => {
        this.menuCallback = null;
      });
    }
  }

  created() {
    this.myMessages = {
      ...this.messagesBucket,
      ...this.messages,
    };
  }

  mounted() {
    this.onResizeHandler = this.onResize.bind(this);
    window.addEventListener('resize', this.onResizeHandler);
  }

  beforeUnmount() {
    window.removeEventListener('resize', this.onResizeHandler);
  }

  /* метод переопределяется в родительском компоненте */
  validate() {
    //
  }

  emitUpdate() {
    this.emitUpdateModelValue();
    this.emitUpdateItems();
    this.emitInput();
    this.validate();
  }

  onResize() {
    this.menu = false;
  }

  onMenu(value: boolean, callback?: () => void) {
    if (callback instanceof Function) {
      this.menuCallback = {
        state: value,
        callback,
      };
    }
    setTimeout(() => {
      if (this.menu === value) {
        return;
      }
      if (this.loading) {
        this.menu = true;
        return;
      }
      if (this.isSelectListBox && !this.searchTerm && !this.fireEventSelect && !this.displaySelected) {
        this.menu = false;
        return;
      }
      setTimeout(
        () => {
          if (this.fireEventSelect) {
            return;
          }
          this.menu = value;
        },
        this.multiselect ? 100 : 0
      );
    }, 1);
  }

  onToggle(item: TElement) {
    if (this.itemSelected(item)) {
      this.onUnselect(item);
    } else {
      this.onSelect(item);
    }
  }

  onSelect(item: TElement) {
    if (this.modelType.array || this.multiselect) {
      this.selected = this.comboboxService.toArray(this.selected);
      (this.selected as Array<unknown>).push(item);
    } else {
      this.selected = item;
    }
  }

  onUnselect(item: TElement) {
    if (this.modelType.array) {
      this.selected = this.comboboxService.toArray(this.selected);
      this.selected = this.selected.filter((el: IComboboxItem) => !this.isIdentity(el, item));
    } else if (this.selectedIsDefined && !this.selectedType.array) {
      this.selected = null;
    }
  }

  onClear() {
    if (this.modelType.array || this.multiselect) {
      this.selected = [];
      return;
    }
    this.selected = null;
    if (!this.elements || !this.elements.length) {
      this.optionsList = [];
    }
  }

  onDisplaySelected() {
    this.displaySelected = true;
    this.optionsList = this.selected;
    this.onMenu(true, () => {
      this.optionsList = this.elements;
      this.displaySelected = false;
    });
  }

  async onDialog() {
    if (this.select instanceof Function) {
      const selected = await this.select();
      if (this.comboboxService.isEmpty(selected)) {
        return;
      }
      this.onModelValueChanged(selected.map(el => this.itemId(el)));
    }
  }

  itemSelected(item: TElement): boolean {
    return this.checkedIds.includes(this.itemId(item));
  }

  valueOfItem(item: TElement): TElement {
    if (this.returnObject) {
      if (this.elementsType.arrayOfSimple) {
        return item;
      }
      if (this.elementsType.arrayOfObject) {
        return this.elements.find(el => this.isIdentity(el, item));
      }
    }
    return this.itemId(item);
  }

  itemId(item: TElement): string | number {
    return this.comboboxService.deepValueOfItem(item, this.itemValue);
  }

  titleOfItem(item: TElement): string {
    if (this.comboboxService.isSimple(item)) {
      return String(item);
    }
    return String(this.comboboxService.deepValueOfItem(item, this.itemTitle));
  }

  subtitleOfItem(item: TElement): string {
    if (this.comboboxService.isSimple(item)) {
      return String(item);
    }
    return String(this.comboboxService.deepValueOfItem(item, this.itemSubtitle));
  }

  isIdentity(current: unknown, target: unknown): boolean {
    if (this.comboboxService.isSimple(current) && this.comboboxService.isSimple(target)) {
      return String(current).toLowerCase() === String(target).toLowerCase();
    }
    if (this.comboboxService.isSimple(current)) {
      return current === this.comboboxService.deepValueOfItem(target, this.itemValue);
    }
    if (this.comboboxService.isSimple(target)) {
      return target === this.comboboxService.deepValueOfItem(current, this.itemValue);
    }
    return (
      this.comboboxService.deepValueOfItem(current, this.itemValue) ===
      this.comboboxService.deepValueOfItem(target, this.itemValue)
    );
  }

  async fetchElements(searchTerm: string = null) {
    if (this.fetchData instanceof Function) {
      try {
        this.loading = true;
        this.optionsList = [];
        const items = await this.fetchData(searchTerm);
        this.updateElements(items);
        this.optionsList = items;
      } catch (e) {
        /* eslint-disable no-console */
        console.error(e);
      } finally {
        this.loading = false;
      }
    } else {
      throw new InternalError();
    }
  }

  private async setOptions() {
    if (this.hasElements) {
      this.optionsList = this.elements;
      return;
    }
    if (this.fetchData instanceof Function) {
      await this.fetchElements();
      this.optionsList = this.elements;
    }
  }

  private async setItems(array: Array<TElement>) {
    if (this.fetchItem instanceof Function) {
      try {
        const ids = array.map(id => this.itemId(id));
        const _new = ids.filter(id => {
          const found = (this.hasElements ? this.elements : []).find((el: TElement) => this.isIdentity(el, id));
          return !found;
        });
        if (_new.length) {
          this.loading = true;
          this.optionsList = [];
          const items = await this.fetchItem(_new);
          this.updateElements(items);
          this.optionsList = items;
        }
      } catch (e) {
        /* eslint-disable no-console */
        console.error(e);
        throw new InternalError(e);
      } finally {
        this.loading = false;
      }
    }
  }

  private async setSelected(array: Array<TElement>) {
    if (this.isCombobox && !this.hasElements && !this.menu && this.lazyLoad) {
      this.selected = array;
      return;
    }
    if (this.isCombobox || this.isSelect) {
      await this.setOptions();
    }
    if (this.comboboxService.isEmpty(array)) {
      return;
    }
    if (this.isSelectListBox) {
      await this.setItems(array);
    }
    if (this.comboboxService.isEmpty(this.optionsList)) {
      return;
    }
    if (this.multiselect) {
      const found = this.elements.filter(el => array.some(i => this.isIdentity(i, el)));
      if (!this.comboboxService.isEmpty(found)) {
        this.selected = found;
      }
    } else {
      const found = this.elements.find(el => array.some(i => this.isIdentity(i, el)));
      if (found) {
        this.selected = found;
      }
    }
  }

  private selectedValidation(_new: unknown, _old: unknown) {
    if (!this.comboboxService.isArray(_new) || !this.comboboxService.isArray(_old)) {
      return _new;
    }
    if (this.comboboxService.isEmpty(_new) || this.comboboxService.isEmpty(_old)) {
      return _new;
    }
    if ((_new as Array<unknown>).length < (_old as Array<unknown>).length) {
      return _new;
    }
    const _buff: Array<unknown> = [];
    for (const n of _new as Array<unknown>) {
      const index = (_old as Array<unknown>).findIndex(o => this.isIdentity(n, o));
      if (index > -1) {
        _buff.push(n);
        continue;
      }
      const found = this.elements.find(el => this.isIdentity(el, n));
      if (found) {
        _buff.push(n);
        continue;
      }
      if (typeof n === 'string' && this.optionsList.length === 1) {
        const value = this.titleOfItem(this.optionsList[0]);
        if (value.toLowerCase() === n.toLowerCase()) {
          _buff.push(this.optionsList[0]);
        }
      }
    }
    return _buff;
  }

  private updateElements(_new: Array<TElement>): Array<TElement> {
    if (!this.hasElements) {
      this.elements = _new;
      return;
    }
    const _buff: Array<TElement> = [];
    for (const i of _new) {
      const index = this.elements.findIndex(item => this.isIdentity(item, i));
      if (index < 0) {
        _buff.push(i);
      }
    }
    this.elements.push(..._buff);
  }

  private $fireEventSelect() {
    this.fireEventSelect = true;
    setTimeout(() => {
      this.fireEventSelect = false;
    }, this.debounceDelay + 100);
  }

  get modelType(): {
    array: boolean;
    string: boolean;
    number: boolean;
    object: boolean;
  } {
    return {
      array: this.comboboxService.isArray(this.modelValue),
      string: this.comboboxService.isString(this.modelValue),
      number: this.comboboxService.isNumber(this.modelValue),
      object: this.comboboxService.isObject(this.modelValue),
    };
  }

  get selectedType(): {
    array: boolean;
    string: boolean;
    number: boolean;
    object: boolean;
  } {
    return {
      array: this.comboboxService.isArray(this.selected),
      string: this.comboboxService.isString(this.selected),
      number: this.comboboxService.isNumber(this.selected),
      object: this.comboboxService.isObject(this.selected),
    };
  }

  get elementsType(): {
    arrayOfSimple: boolean;
    arrayOfObject: boolean;
  } {
    return {
      arrayOfSimple: this.elements.every(el => this.comboboxService.isSimple(el)),
      arrayOfObject: this.elements.every(el => this.comboboxService.isObject(el)),
    };
  }

  get selectedToArray(): Array<TElement> {
    return this.comboboxService.toArray(this.selected);
  }

  get selectedIds(): Array<TElement> {
    if (!this.selectedToArray.length) {
      return [];
    }
    return this.selectedToArray.map(item => this.valueOfItem(item));
  }

  get checkedIds(): Array<string | number> {
    return this.selectedToArray.map(el => this.comboboxService.deepValueOfItem(el, this.itemValue));
  }

  get selectedIsDefined(): boolean {
    return this.$utils.isDefined(this.selected);
  }

  get hasElements(): boolean {
    return this.comboboxService.isArray(this.elements) && this.elements.length > 0;
  }

  get hasOptions(): boolean {
    return this.comboboxService.isArray(this.optionsList) && this.optionsList.length > 0;
  }

  get hasSelectedItems(): boolean {
    if (this.selectedType.string || this.selectedType.number || this.selectedType.object) {
      return this.selectedIsDefined;
    }
    if (this.selectedType.array) {
      return (this.selected as Array<TElement>).length > 0;
    }
  }

  get messagesBucket(): IMessages {
    return {
      loading: this.$ldmuii18n.gettext('Loading'),
      search: this.$ldmuii18n.gettext('Search'),
      empty: this.$ldmuii18n.gettext('No Elements'),
      noResults: this.$ldmuii18n.gettext('No Search Result'),
      validation: this.$ldmuii18n.gettext('Reqiured Message'),
      nonUnique: this.$ldmuii18n.gettext('Non Unique'),
      invalid: '',
    };
  }

  get menuProps(): Record<string, unknown> {
    const props: Record<string, unknown> = {
      scrollStrategy: 'close',
      transition: 'toggle-slide-y-transition',
      locationStrategy: this.comboboxService.locationStrategy.bind(this),
    };
    if (this.multiselect) {
      props['modelValue'] = this.menu;
    }
    const menuProps = {
      menu: this.menu,
      menuProps: props,
    };
    return menuProps;
  }

  get listProps(): Record<string, unknown> {
    const props: Record<string, unknown> = {
      class: ['scroll-s', 'ld-dropdown-list', `ld-dropdown-list--${(this as unknown as { mySize: string }).mySize}`],
    };
    const listProps = {
      listProps: props,
    };
    return listProps;
  }

  get selectBindings(): Record<string, unknown> {
    return {
      chips: this.multiselect ? true : this.chips,
      closableChips: true,
      itemValue: this.itemValue,
      itemTitle: this.itemTitle,
      multiple: this.multiselect,
      hideNoData: false,
      noDataText: this.myMessages.empty,
      openOnClear: false,
      singleLine: true,
    };
  }

  get comboboxService(): ComboboxService {
    return new ComboboxService();
  }

  get instanceService(): InstanceService {
    return new InstanceService(getCurrentInstance());
  }

  get isSelect(): boolean {
    return this.instanceService.componentName === ComponentName.Select;
  }

  get isCombobox(): boolean {
    return this.instanceService.componentName === ComponentName.Combobox;
  }

  get isSelectListBox(): boolean {
    return this.instanceService.componentName === ComponentName.SelectListBox;
  }

  get canRemove(): boolean {
    if ((this as unknown as { readonly: boolean }).readonly || (this as unknown as { disabled: boolean }).disabled) {
      return false;
    }
    return this.closableChips;
  }
}
