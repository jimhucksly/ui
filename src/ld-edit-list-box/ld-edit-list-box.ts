import { datetime, isDefined, uniqueID } from '@dn-web/core';
import isEqual from 'lodash-es/isEqual';
import { mixins, Options, Vue } from 'vue-class-component';
import { Inject, Prop, Watch } from 'vue-property-decorator';
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
import { IComboboxItem, TElement } from '@/types/combobox';
import { IInjectionForm } from '@/types/form';

type InjectionForm = IInjectionForm;
type Element = string | number | IComboboxItem;

/**
 * @displayName ld-edit-list-box
 */
@Options({
  components: {
    'ld-label': Label,
    'ld-help': Help,
    'svg-icon': Icon,
  },
})
export default class EditListBoxComponent extends mixins(
  ValidatableMixin,
  GridMixin,
  InputMixin,
  HelpMixin,
  EditMixin,
  ComboboxMixin
) {
  @Prop() format: string | RegExp;
  @Prop({ type: String, default: 'text' }) type: 'text' | 'number' | 'date' | 'datetime' | 'mask';
  @Prop({ type: Boolean, default: false }) onlyUnique: boolean;
  @Prop({ type: Object, default: () => ({}) }) calendarProps: {
    minDate: Date;
    maxDate: Date;
    disabledDates: Array<{ start: Date; end: Date }>;
  };
  @Prop({ type: Object, default: () => ({}) }) maskProps: {
    mask: unknown;
    scale: number;
    thousandsSeparator: string;
    signed: boolean;
    mapToRadix: Array<string>;
    inputHint: string;
  };

  @Inject({ from: 'form', default: null }) declare form: InjectionForm;

  selected: Array<TElement> = [];

  value: string = null;
  date: Date = new Date();
  time: string = null;

  editableIndex: number = null;
  editError: string = null;

  input: HTMLInputElement = null;

  regexp: RegExp = null;
  isRegExpInvalid = false;

  @Emit('update:model-value') emitUpdateValue() {
    return this.selected;
  }

  @Emit('blur') emitBlur(e: unknown) {
    return e;
  }

  @Watch('modelValue', { immediate: true, deep: true }) onModelChanged(value: Element | Array<Element>) {
    if (!isDefined(value)) {
      this.clear();
      return;
    }
    const val = this.comboboxService.toArray(value);
    if (isEqual(val, this.selected)) {
      return;
    }
    if (!val.length) {
      this.clear();
    }
    if (val.length) {
      this.editOrAdd(val);
    }
  }

  @Watch('selected', { deep: true }) onValueChanged(newVal: unknown, oldVal: unknown) {
    if (isEqual(this.modelValue, this.selected)) {
      return;
    }
    this.emitUpdateValue();
  }

  @Watch('type') onTypeChanged() {
    this.value = null;
  }

  @Watch('format', { immediate: true }) onFormat() {
    if (!this.isTextType) {
      return;
    }
    if (isDefined(this.format)) {
      try {
        this.regexp = new RegExp(this.format);
      } catch (e) {
        this.validationMessage = this.myMessages.invalid;
        this.isRegExpInvalid = true;
      }
    }
  }

  created() {
    this.myMessages = {
      nonUnique: 'Идентичный элемент уже добавлен',
      validation: 'Введенное значение не удовлетворяет заданным условиям',
      invalid: 'Переданное регулярное выражение невалидно',
      ...this.messages,
    };
  }

  mounted() {
    const ref = this.$refs.autocomplete as Vue;
    const el = ref.$el as HTMLElement;
    const input = el.querySelector('input');
    if (input) {
      this.input = input;
      input.onkeydown = event => {
        event.preventDefault();
        event.stopPropagation();
        if (event.code === 'NumpadAdd' || event.code === 'Space') {
          this.onAddItem();
        }
      };
    }
  }

  onMenu(value: boolean) {
    if (value) {
      this.editInputFocus();
    } else {
      this.value = null;
      this.editError = null;
    }
  }

  onAddItem() {
    this.input?.click();
    this.editInputFocus();
  }

  onItemClick(item: string, index: number) {
    this.editableIndex = index;
    this.value = item;
    if (this.isDateType) {
      this.date = new Date(datetime.localToISO(item, this.locale));
      this.time = this.getTime(this.date);
    }
    this.onAddItem();
  }

  onRemoveItem(index: number) {
    this.selected.splice(index, 1);
  }

  onEnter() {
    if (!this.value && this.isDateType) {
      this.onTimeInput();
    }
    const result = this.editOrAdd(this.value);
    if (result === true) {
      this.editableIndex = null;
      this.value = null;
      this.date = this.date || new Date();
      this.time = null;
      this.menu = false;
      this.$nextTick(() => {
        this.input?.focus();
      });
    }
  }

  onBlur(e: FocusEvent) {
    this.emitBlur(e);
    this.validate();
  }

  onDateSelect(date: string) {
    const d = this.setTime(date);
    if (this.type === 'date') {
      this.value = datetime.dateToLocal(d, this.locale);
      this.onEnter();
    }
    if (this.type === 'datetime') {
      this.value = datetime.formatDate(d, 'DD.MM.YYYY, hh:mm');
      this.onEnter();
    }
  }

  onTimeInput() {
    this.date = this.setTime(this.date);
    this.value = datetime.formatDate(this.date, 'DD.MM.YYYY, hh:mm');
  }

  getKey() {
    return uniqueID(6, '0-9');
  }

  validate(): boolean {
    let funcResult = null;
    this.validationMessage = '';
    for (const func of this.validRules) {
      if (this.validationMessage) {
        break;
      }
      const value = this.modelValue;
      funcResult = func(value);
      if (typeof funcResult === 'string') {
        this.validationMessage = funcResult;
      }
    }
    return !this.validationMessage;
  }

  private editInputFocus() {
    this.$nextTick(() => {
      const ref = this.$refs.edit as Vue;
      const el = ref?.$el as HTMLElement;
      const input = el?.querySelector('input');
      input?.focus();
    });
  }

  private editOrAdd(value: TElement | Array<TElement>): boolean | string {
    if (!value) {
      return;
    }
    if (isDefined(this.editableIndex)) {
      const insert = Array.isArray(value) ? value[0] : value;
      this.selected.splice(this.editableIndex, 1, insert as string | number);
    } else if (Array.isArray(value)) {
      value = Array.from(new Set(value));
      if (this.onlyUnique) {
        value = this.unify(value);
      }
      if (value.length) {
        this.selected.push(...value);
      }
    } else {
      const validation = this.validateValue(value as string | number);
      if (validation === true) {
        this.selected.push(value);
      } else {
        this.editError = validation as string;
        return false;
      }
    }
    return true;
  }

  private clear() {
    this.selected = [];
  }

  private unify(value: Array<TElement>): Array<TElement> {
    return value.filter(item => !this.selected.includes(item));
  }

  private validateValue(value: string | number): boolean | string {
    if (this.onlyUnique && this.selected.includes(value)) {
      return this.myMessages.nonUnique;
    }
    if (this.regexp && !this.regexp.test(String(value))) {
      return this.myMessages.validation;
    }
    return true;
  }

  private setTime(date: string | Date): Date {
    const d = new Date(date);
    if (this.time) {
      const [h, m] = this.time.split(':');
      d.setHours(Number(h));
      d.setMinutes(Number(m));
    } else {
      d.setHours(0);
      d.setMinutes(0);
    }
    return d;
  }

  private getTime(date: string | Date): string {
    const d = new Date(date);
    const [h, m] = [d.getHours(), d.getMinutes()];
    return `${this.leaderZero(String(h))}:${this.leaderZero(String(m))}`;
  }

  private leaderZero(v: string | number) {
    if (typeof v === 'number') {
      v = String(v);
    }
    return v.length === 1 ? '0' + v : v;
  }

  get canEdit(): boolean {
    return !(this.readonly || this.disabled);
  }

  get hasSelected(): boolean {
    return this.selected.length > 0;
  }

  get isTextType(): boolean {
    return ['text', 'number'].includes(this.type);
  }

  get isDateType(): boolean {
    return ['date', 'datetime'].includes(this.type);
  }

  get isMaskType(): boolean {
    return this.type === 'mask';
  }

  get locale(): string {
    return this.$ui.options.language;
  }
}
