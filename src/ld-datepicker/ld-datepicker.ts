import { datetime } from '@dn-web/core';
import IMask, { InputMask } from 'imask';
import { mixins, Options } from 'vue-class-component';
import { Inject, Prop, Vue, Watch } from 'vue-property-decorator';
import Help from '@/components/help/help.vue';
import Icon from '@/components/icon/icon.vue';
import Label from '@/components/label/label.vue';
import { Emit } from '@/decorators/emit.decorator';
import EditMixin from '@/mixins/edit.mixin';
import GridMixin from '@/mixins/grid.mixin';
import HelpMixin from '@/mixins/help.mixin';
import InputMixin from '@/mixins/input.mixin';
import ValidatableMixin from '@/mixins/validatable.mixin';
import { DatepickerProps, IMaskOptions, TimepickerProps } from '@/types/daterange';
import { IInjectionForm } from '@/types/form';

type InjectionForm = IInjectionForm;
type IDatepickerProps = DatepickerProps;
type ITimepickerProps = TimepickerProps;

/**
 * Datepicker
 * @displayName ld-datepicker
 */
@Options({
  components: {
    'ld-label': Label,
    'ld-help': Help,
    'svg-icon': Icon,
  },
})
export default class DatepickerComponent extends mixins(GridMixin, ValidatableMixin, HelpMixin, InputMixin, EditMixin) {
  @Prop() modelValue: string | Date;
  @Prop({ type: String, default: 'ДД.ММ.ГГГГ' }) declare placeholder: string;
  @Prop({
    type: Object,
    default: (): ITimepickerProps => ({
      placeholder: 'ЧЧ:MM',
      is24hr: true,
    }),
  })
  timepickerProps: ITimepickerProps;
  @Prop({
    type: Object,
    default: (): IDatepickerProps => ({
      minDate: null,
      maxDate: null,
      disabledDates: [],
    }),
  })
  datepickerProps: IDatepickerProps;

  /** ввод только даты или даты и времени */
  @Prop({ type: Boolean, default: true }) dateonly: boolean;

  @Inject({ from: 'form', default: null }) declare form: InjectionForm;

  date: Date = null;
  currentYear: number = null;
  currentMonth: number = null;
  dateString: string = null;
  timeString: string = null;
  defaultHour = '09';
  defaultMinuts = '00';
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  dateMask: InputMask<any> = null;
  menu = false;
  event: FocusEvent = null;
  errorsHandler: Array<string> = [];

  isFocused = false;

  isHours = true;
  isMinutes = false;

  currentMinDate: Date = null;
  currentMaxDate: Date = null;

  dateMaskPromise: Promise<void> = null;
  dateMaskPromiseResolve: () => void;

  @Emit('update:model-value') emitUpdateModelValue(value: string | Date) {
    return value;
  }

  @Watch('modelValue', { immediate: true }) onValueChanged(newVal: string | Date, oldVal: string | Date) {
    if (
      // eslint-disable-next-line eqeqeq
      newVal == oldVal ||
      // при изменении объекта newVal всегда == oldVal
      (newVal instanceof Date && oldVal instanceof Date && newVal.getTime() === oldVal.getTime()) ||
      (newVal instanceof Date && this.date && newVal.getTime() === this.date.getTime())
    ) {
      return;
    }
    if (!newVal) {
      this.dateString = '';
      this.date = null;
    } else {
      this.date = new Date(newVal);
      this.dateString = datetime.localToISO(this.date.toLocaleDateString(this.locale), this.locale);
    }
    if (this.date) {
      const inputEl = this.$refs.inputDate;
      if (inputEl) {
        (inputEl as HTMLInputElement).value = this.formattedDate;
        this.dateMask.updateValue();
      }
      let hours = String(this.date.getHours());
      let minuts = String(this.date.getMinutes());
      hours = ('0' + hours).slice(-2);
      minuts = ('0' + minuts).slice(-2);
      this.timeString = `${hours}:${minuts}`;
    } else {
      this.timeString = '';
      this.onInputDateClear();
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
    if (!this.date) {
      this.currentMinDate = new Date(newVal);
    }
    if (
      this.date &&
      datetime.compare(
        new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()),
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
    if (!this.date) {
      this.currentMaxDate = new Date(newVal);
    }
    if (
      this.date &&
      datetime.compare(
        new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()),
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

  created() {
    this.dateMaskPromise = new Promise(resolve => {
      this.dateMaskPromiseResolve = resolve;
    });
  }

  mounted() {
    const input = this.$refs.inputDate as Vue;
    if (input) {
      const inputEl = input.$el.querySelector('input');
      if (inputEl) {
        (inputEl as HTMLInputElement).value = this.formattedDate;
        const options: IMaskOptions = {
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
          options.min = this.currentMinDate;
        }
        if (this.currentMaxDate) {
          options.max = this.currentMaxDate;
        }
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
      if (value) {
        // проверяем, только если что-то было введено
        const dt: Date = this.parseDate(value);
        if (!dt || (dt instanceof Date && isNaN(dt.getDate()))) {
          this.onInputDateClear();
          this.dateMask.el.value = '';
          this.dateMask.updateValue();
        }
      } else {
        this.onInputDateClear();
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
    let dt: Date = this.parseDate(value);
    if (this.dateonly) {
      dt.setHours(0, 0, 0, 0);
    } else {
      dt = this.addTimeToDate(dt);
    }
    this.emitInput(dt);
    setTimeout(() => {
      this.validate();
      this.menu = false;
    }, 100);
  }

  onInputDateFocus(e: FocusEvent) {
    this.isFocused = true;
    this.event = e;
  }

  onInputDateBlur() {
    this.isFocused = false;
  }

  onInputDateEnter(e: KeyboardEvent) {
    const value = (e.target as HTMLInputElement).value;
    let d = this.parseDate(value);
    if (d) {
      if (this.timeString) {
        d = this.addTimeToDate(d);
      }
      const dt = datetime.localToISO(d.toLocaleDateString(this.locale), this.locale);
      this.onSelectDate(dt);
    }
  }

  onInputDateClear() {
    if (this.dateMask) {
      this.dateMask.el.value = '';
    }
    /**
     * dateString сбросим к текущей дате, чтобы календарь переключился на нее
     * date ставим null, чтобы обнулить модель
     */
    this.dateString = datetime.localToISO(new Date().toLocaleDateString(this.locale), this.locale);
    this.date = null;
    this.emitUpdateModelValue(null);
    this.validate();
  }

  async onSelectDate(date: string) {
    await this.$nextTick();
    if (!date) {
      return;
    }
    this.dateMask.el.value = new Date(date).toLocaleDateString(this.locale);
    this.menu = false;
    this.onDateMaskChange(this.event);
    this.event = null;
  }

  onSelectTime(value: string) {
    if (!this.date) {
      return;
    }
    const dt = new Date(this.date);
    if (!value) {
      dt.setHours(0);
      dt.setMinutes(0);
      dt.setSeconds(0);
      this.emitInput(dt);
      return;
    }
    const h = value ? value.split(':')[0] : this.defaultHour;
    const m = value ? value.split(':')[1] : this.defaultMinuts;
    dt.setHours(Number(h));
    dt.setMinutes(Number(m));
    dt.setSeconds(0);
    this.emitInput(dt);
  }

  onPickerClick(cb: () => void) {
    if ((!this.disabled && !this.readonly) || !this.clearable) {
      cb();
    }
  }

  validate(): boolean {
    let funcResult = null;
    this.validationMessage = '';
    this.validRules.forEach(func => {
      funcResult = func(this.date);
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
    return datetime.dateToLocal(date, this.locale);
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

  private emitInput(value: string | Date) {
    if (!this.modelValue) {
      this.emitUpdateModelValue(value);
    } else {
      if (this.modelValue instanceof Date) {
        this.emitUpdateModelValue(value instanceof Date ? value : new Date(value));
      }
      if (typeof this.modelValue === 'string') {
        if (typeof value === 'string') {
          this.emitUpdateModelValue(value);
        } else {
          this.emitUpdateModelValue(datetime.toServerString(value));
        }
      }
    }
  }

  /**
   * Добавляет к текущей дате время (часы, минуты)
   * @param date текущая дата
   */
  private addTimeToDate(date: Date): Date {
    if (!date) {
      return;
    }
    const [hours = this.defaultHour, minutes = this.defaultMinuts] = this.timeString ? this.timeString.split(':') : [];
    const h = Number(hours);
    const m = Number(minutes);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, 0, 0);
    return date;
  }

  get isDateEmpty(): boolean {
    return !this.date;
  }

  get formattedDate(): string {
    if (!this.date) {
      return '';
    }
    return datetime.dateToLocal(this.date, this.locale);
  }

  get locale(): string {
    return this.$ui.options.language;
  }

  get localeRu(): boolean {
    return this.locale.includes('ru');
  }

  get localeEn(): boolean {
    return this.locale.includes('en');
  }

  get warningHint(): boolean {
    return Boolean(this.validationMessage) || this.errorsHandler.length > 0;
  }

  get inputClasses(): Record<string, boolean> {
    return this.dateonly ? this.inputSizeClasses : null;
  }
}
