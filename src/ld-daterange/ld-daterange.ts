import IMask, { InputMask } from 'imask';
import { Inject, mixins, Options, Prop, Vue, Watch } from 'vue-property-decorator';
import Help from '@/components/help/help.vue';
import Icon from '@/components/icon/icon.vue';
import Label from '@/components/label/label.vue';
import { Emit } from '@/decorators/emit.decorator';
import EditMixin from '@/mixins/edit.mixin';
import GridMixin from '@/mixins/grid.mixin';
import HelpMixin from '@/mixins/help.mixin';
import InputMixin from '@/mixins/input.mixin';
import ValidatableMixin from '@/mixins/validatable.mixin';
import { DatepickerProps, DateRange, IMaskOptions } from '@/types/daterange';
import { IInjectionForm } from '@/types/form';

type InjectionForm = IInjectionForm;
type TDateRange = DateRange;
type IDatepickerProps = DatepickerProps;

/**
 * Daterange
 * @displayName ld-daterange
 */
@Options({
  components: {
    'ld-label': Label,
    'ld-help': Help,
    'svg-icon': Icon,
  },
})
export default class DaterangeComponent extends mixins(GridMixin, ValidatableMixin, HelpMixin, InputMixin, EditMixin) {
  @Prop() modelValue: TDateRange;
  @Prop({ type: String, default: 'ДД.ММ.ГГГГ' }) declare placeholder: string;
  @Prop({
    type: Object,
    default: (): IDatepickerProps => ({
      minDate: null,
      maxDate: null,
      disabledDates: [],
    }),
  })
  datepickerProps: IDatepickerProps;

  @Inject({ from: 'form', default: null }) declare form: InjectionForm;

  a: Date = null;
  b: Date = null;
  startDate: Date = null;
  endDate: Date = null;

  startMonth: number = new Date().getUTCMonth();
  startYear: number = new Date().getUTCFullYear();
  endMonth: number = new Date().getUTCMonth() + 1;
  endYear: number = new Date().getUTCFullYear();

  dateString: string = null;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  dateMask: InputMask<any> = null;
  menu = false;

  event: FocusEvent = null;
  isFocused = false;

  currentMinDate: Date = null;
  currentMaxDate: Date = null;

  dateMaskPromise: Promise<void> = null;
  dateMaskPromiseResolve: () => void;

  datepickerScrollHandler: () => void = null;

  @Emit('update:model-value') emitUpdateModelValue(value: Array<Date>) {
    return value;
  }

  @Watch('modelValue', { immediate: true }) onValueChanged(newVal: TDateRange, oldVal: TDateRange) {
    if (!newVal || !Array.isArray(newVal)) {
      this.startDate = null;
      this.endDate = null;
      return;
    }
    const [start, end] = newVal;
    if (!start || !end) {
      this.startDate = null;
      this.endDate = null;
      return;
    }
    if (Array.isArray(oldVal)) {
      const [start1, end1] = oldVal;
      // eslint-disable-next-line eqeqeq
      if (start == start1 && end == end1) {
        return;
      }
      if (
        start instanceof Date &&
        start1 instanceof Date &&
        start.getTime() === start1.getTime() &&
        end instanceof Date &&
        end1 instanceof Date &&
        end.getTime() === end1.getTime()
      ) {
        return;
      }
    }
    if (start) {
      this.startDate = this.$utils.datetime.toDate(start, this.locale);
    }
    if (end) {
      this.endDate = this.$utils.datetime.toDate(end, this.locale);
    }
    if (this.startDate && this.endDate) {
      const inputEl = this.$refs.inputDate;
      if (inputEl) {
        (inputEl as HTMLInputElement).value = this.formattedDate;
        this.dateMask.updateValue();
      }
      this.emitInput([this.startDate, this.endDate]);
      setTimeout(() => {
        this.onUpdateMonth(0, this.startDate.getMonth());
      }, 100);
    }
    setTimeout(() => {
      this.dateMask.updateValue();
    }, 100);
  }

  @Watch('datepickerProps.minDate', { immediate: true }) onMinDateChanged(newVal: Date) {
    if (!newVal) {
      this.currentMinDate = null;
      return;
    }
    if (!this.startDate) {
      this.currentMinDate = new Date(newVal);
    }
    if (
      this.startDate &&
      this.$utils.datetime.compare(
        new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate()),
        new Date(newVal.getFullYear(), newVal.getMonth(), newVal.getDate())
      ) > -1
    ) {
      this.currentMinDate = new Date(newVal);
    }
  }

  @Watch('currentMinDate') async onCurrentMinDateChanged(newVal: Date) {
    if (!this.dateMask) {
      await this.dateMaskPromise;
    }
    this.dateMask.updateOptions({ min: newVal });
  }

  @Watch('datepickerProps.maxDate', { immediate: true }) onMaxDateChanged(newVal: Date) {
    if (!newVal) {
      this.currentMaxDate = null;
      return;
    }
    if (!this.endDate) {
      this.currentMaxDate = new Date(newVal);
    }
    if (
      this.endDate &&
      this.$utils.datetime.compare(
        new Date(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate()),
        new Date(newVal.getFullYear(), newVal.getMonth(), newVal.getDate())
      ) < 1
    ) {
      this.currentMaxDate = new Date(newVal);
    }
  }

  @Watch('currentMaxDate') async onCurrentMaxDateChanged(newVal: Date) {
    if (!this.dateMask) {
      await this.dateMaskPromise;
    }
    this.dateMask.updateOptions({ max: newVal });
  }

  @Watch('menu') onMenuChanged(value: string) {
    if (!value) {
      setTimeout(() => {
        this.onSave();
      }, 100);
    }
  }

  created() {
    this.dateMaskPromise = new Promise(resolve => {
      this.dateMaskPromiseResolve = resolve;
    });
    this.a = new Date();
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    this.b = new Date(d);
  }

  mounted() {
    const input = this.$refs.inputDate as Vue;
    if (input) {
      const inputEl = input.$el.querySelector('input');
      if (inputEl) {
        (inputEl as HTMLInputElement).value = this.formattedDate;
        const dateOptions: IMaskOptions = {
          pattern: this.localeRu ? 'd.m.Y' : 'm/d/Y',
          mask: Date,
          lazy: true,
          blocks: {
            d: {
              mask: IMask.MaskedRange,
              from: 1,
              to: 31,
              maxLength: 2,
            },
            m: {
              mask: IMask.MaskedRange,
              from: 1,
              to: 12,
              maxLength: 2,
            },
            Y: {
              mask: IMask.MaskedRange,
              from: 1900,
              to: 9999,
            },
          },
          format: date => this.formatDate(date),
          parse: str => this.parseDate(str),
          min: null,
          max: null,
        };
        if (this.currentMinDate) {
          dateOptions.min = this.currentMinDate;
        }
        if (this.currentMaxDate) {
          dateOptions.max = this.currentMaxDate;
        }
        const options = {
          mask: [
            {
              mask: 'date1 - date2',
              lazy: true,
              blocks: {
                date1: dateOptions,
                date2: dateOptions,
              },
            },
          ],
        };
        this.dateMask = IMask(inputEl as HTMLElement, options);
        this.dateMask._unbindEvents();
        this.dateMask._bindEvents();
        this.dateMask.on('complete', () => this.onMaskedValueChanged(this.dateMask.value));
        this.dateMaskPromiseResolve();
        this.dateMask.updateValue();
      } else {
        throw new Error('Не найден элемент input для ввода даты');
      }
    }
  }

  beforeUnmount() {
    if (this.dateMask) {
      this.dateMask.off('complete', null);
    }
  }

  unmounted() {
    window.removeEventListener('wheel', this.datepickerScrollHandler);
  }

  onInputDateFocus(e: FocusEvent) {
    this.isFocused = true;
    this.event = e;
  }

  onInputDateBlur() {
    this.isFocused = false;
  }

  onInputDateClear() {
    if (this.dateMask) {
      this.dateMask.el.value = '';
    }
    /**
     * dateString сбросим к текущей дате, чтобы календарь переключился на нее
     * date ставим null, чтобы обнулить модель
     */
    this.dateString = this.$utils.datetime.localToISO(new Date().toLocaleDateString(this.locale), this.locale);
    this.startDate = null;
    this.endDate = null;
    this.emitUpdateModelValue(null);
    this.validate();
  }

  onSelectDate(date: string) {
    if (!date) {
      return;
    }
    if (this.startDate) {
      // кликнули еще раз на уже выделенную дату
      if (this.$utils.datetime.compare(this.startDate, date) === 0) {
        this.startDate = null;
        return;
      }
      if (this.$utils.datetime.compare(this.endDate, date) === 0) {
        this.endDate = null;
        return;
      }
      // кликнули на дату перед startDate
      if (this.$utils.datetime.compare(this.startDate, date) === 1) {
        this.startDate = new Date(date);
      }
      // кликнули на дату после startDate
      if (this.$utils.datetime.compare(this.startDate, date) === -1) {
        this.endDate = new Date(date);
      }
      return;
    }
    if (!this.startDate) {
      // клинули на уже выделенную дату endDate
      if (this.$utils.datetime.compare(this.endDate, date) === 0) {
        this.endDate = null;
        return;
      }
      this.startDate = new Date(date);
      // startDate идет после endDate - сбросим endDate
      if (this.$utils.datetime.compare(this.startDate, this.endDate) === 1) {
        this.endDate = null;
      }
    }
  }

  /**
   * обработчик события blur на input для ввода даты
   * @param e объект события
   */
  onDateMaskChange(e: FocusEvent) {
    if (this.menu) {
      return;
    }
    try {
      // проверим валидность ввода даты
      let value;
      if (e) {
        value = (e.target as HTMLInputElement).value;
      } else if (this.$refs.inputDate) {
        const input = this.$refs.inputDate as Vue;
        if (input) {
          const inputEl = input.$el.querySelector('input');
          value = inputEl.value;
        }
      }
      if (!value) {
        this.onInputDateClear();
        this.dateMask.el.value = '';
        this.dateMask.updateValue();
        return;
      }
      this.onMaskedValueChanged(value);
    } finally {
      if (this.validateOnBlur) {
        this.$nextTick(() => this.validate());
      }
    }
  }

  onMaskedValueChanged(value: string) {
    if (!value) {
      return;
    }
    const [a, b] = this.parseRange(value);
    this.emitInput([a, b]);
    setTimeout(() => {
      this.validate();
    }, 100);
  }

  onUpdateMonth(index: number, event: number) {
    if (index) {
      this.startMonth = event - 1;
      this.endMonth = event;
    } else {
      this.startMonth = event;
      this.endMonth = event + 1;
    }
  }

  onSave() {
    this.menu = false;
    setTimeout(() => {
      if (this.startDate && this.endDate) {
        this.dateMask.el.value = this.formattedDate;
        this.dateMask.updateValue();
        this.onDateMaskChange(this.event);
        this.event = null;
      }
    }, 100);
  }

  validate(): boolean {
    let funcResult = null;
    this.validationMessage = '';
    this.validRules.forEach(func => {
      funcResult = func(this.startDate);
      if (funcResult !== true) {
        this.validationMessage = funcResult as string;
      }
      funcResult = func(this.endDate);
      if (funcResult !== true) {
        this.validationMessage = funcResult as string;
      }
    });
    return !this.validationMessage;
  }

  private formatDate(date: Date): string {
    if (!date) {
      return '';
    }
    return this.$utils.datetime.dateToLocal(date, this.locale);
  }

  private parseDate(value: string): Date {
    if (!value) {
      return null;
    }
    const ru = this.locale.includes('ru');
    const separator = ru ? '.' : '/';
    const ddMMyyyy = value.split(separator);
    let dt: Date;
    try {
      if (ru) {
        dt = new Date(Number(ddMMyyyy[2]), Number(ddMMyyyy[1]) - 1, Number(ddMMyyyy[0]));
      } else {
        dt = new Date(Number(ddMMyyyy[2]), Number(ddMMyyyy[0]) - 1, Number(ddMMyyyy[1]));
      }
      return dt;
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e);
      return null;
    }
  }

  private parseRange(value: string): Array<Date> {
    if (!value) {
      return null;
    }
    const result: Array<Date> = [];
    const [a, b] = value.split(' - ');
    for (const el of [a, b]) {
      const dt = this.parseDate(el);
      result.push(dt);
    }
    return result;
  }

  private emitInput(value: Array<Date>) {
    this.emitUpdateModelValue(value);
  }

  get formattedDate(): string {
    if (!this.startDate || !this.endDate) {
      return '';
    }
    return [
      this.$utils.datetime.dateToLocal(this.startDate, this.locale),
      this.$utils.datetime.dateToLocal(this.endDate, this.locale),
    ].join(' - ');
  }

  get locale(): string {
    return this.$ldmui.options.language;
  }

  get localeRu(): boolean {
    return this.locale.includes('ru');
  }

  get localeEn(): boolean {
    return this.locale.includes('en');
  }
}
