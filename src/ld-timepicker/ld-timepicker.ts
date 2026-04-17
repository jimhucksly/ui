import { isDefined } from '@dn-web/core';
import { mixins, Options } from 'vue-class-component';
import { Inject, Prop, Watch } from 'vue-property-decorator';
import Help from '@/components/help/help.vue';
import Icon from '@/components/icon/icon.vue';
import Label from '@/components/label/label.vue';
import { Emit } from '@/decorators/emit.decorator';
import EditMixin from '@/mixins/edit.mixin';
import GridMixin from '@/mixins/grid.mixin';
import HelpMixin from '@/mixins/help.mixin';
import InputMixin from '@/mixins/input.mixin';
import ValidatableMixin from '@/mixins/validatable.mixin';
import UnitService from '@/services/unit.service';
import { IInjectionForm } from '@/types/form';

type InjectionForm = IInjectionForm;

/**
 * @displayName ld-timepicker
 */
@Options({
  components: {
    'ld-label': Label,
    'ld-help': Help,
    'svg-icon': Icon,
  },
})
export default class TimepickerComponent extends mixins(ValidatableMixin, GridMixin, HelpMixin, InputMixin, EditMixin) {
  @Prop() modelValue: string;
  @Prop({ type: String, default: null }) declare placeholder: string;
  @Prop({ type: Boolean, default: true }) is24hr: boolean;

  @Inject({ from: 'form', default: null }) declare form: InjectionForm;

  menu = false;
  hours: number = null;
  minutes: number = null;

  ampm = 'am';

  isFocused = false;

  @Emit('update:model-value') emitInput(value: string) {
    return value ? this.emitedValue(value) : null;
  }

  @Emit('blur') emitBlur() {
    return true;
  }

  @Watch('modelValue', { immediate: true }) onModelValueChanged(value: string) {
    if (!value) {
      this.clear();
      return;
    }
    const v = UnitService.timeToISO(value);
    if (!this.checkValue(v)) {
      return;
    }
    if (!this.is24hr) {
      if (/am/.test(value)) {
        this.setAmPm('am');
      }
      if (/pm/.test(value)) {
        this.setAmPm('pm');
      }
    }
    this.setTime(v);
  }

  @Watch('_time') onTimeChanged() {
    this.emitInput(this._time);
    this.validate();
  }

  @Watch('is24hr') onFormatChanged() {
    this.setTime();
    this.emitInput(this._time);
  }

  onInputHours(value: string) {
    if (value.length < 2) {
      return;
    }
    if (this.checkHours(Number(value))) {
      this.setHours(Number(value));
    }
  }

  onInputMinutes(value: string) {
    if (value.length < 2) {
      return;
    }
    if (this.checkMinutes(Number(value))) {
      this.setMinutes(Number(value));
    }
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
    this.validate();
    this.emitBlur();
  }

  onKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    if (target.id.indexOf('timeinput-h') > -1) {
      if (e.key === 'ArrowRight' && this._hours?.length === 2) {
        e.preventDefault();
        (this.$refs?.['timeinput-m'] as { focus: () => void })?.focus();
        this.minutes = null;
      }
    }
    if (target.id.indexOf('timeinput-m') > -1) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        (this.$refs?.['timeinput-h'] as { focus: () => void })?.focus();
        this.hours = null;
      }
    }
  }

  checkHours(h: number) {
    if (isNaN(h) || h < 0 || h > 23) {
      return false;
    }
    if (!this.is24hr && (h < 1 || h > 12)) {
      return false;
    }
    return true;
  }

  checkMinutes(m: number) {
    return !(isNaN(m) || m < 0 || m > 59);
  }

  checkValue(value: string): boolean {
    if (!/\d\d:\d\d/.test(value)) {
      return false;
    }
    const [h, m] = UnitService.stringToTime(value);
    if (!this.checkHours(h)) {
      return false;
    }
    if (!this.checkMinutes(m)) {
      return false;
    }
    return true;
  }

  setHours(i: number) {
    this.hours = i;
    this.minutes = this.minutes ? this.minutes : 0;
  }

  setMinutes(i: number) {
    if (!isDefined(this.hours)) {
      this.hours = 0;
    }
    this.minutes = i;
  }

  setTime(value?: string) {
    const v = value || this.modelValue;
    if (!v) {
      return;
    }
    const [h, m] = UnitService.stringToTime(UnitService.timeToISO(v));
    if (!this.is24hr) {
      if (h > 12) {
        this.setAmPm('pm');
        this.hours = h - 12;
      }
      if (h < 12) {
        this.setAmPm('am');
        this.hours = h === 0 ? 12 : h;
      }
      if (h === 12) {
        this.setAmPm('pm');
        this.hours = 12;
      }
    } else {
      this.hours = h;
    }
    this.minutes = Number(m);
  }

  clear() {
    this.hours = null;
    this.minutes = null;
    this.menu = false;
    this.emitInput(null);
  }

  setAmPm(ampm: 'am' | 'pm') {
    this.ampm = ampm;
  }

  leaderZero(val: string | number) {
    return UnitService.leaderZero(val);
  }

  buttonText(i: number): string {
    return this.leaderZero(i);
  }

  validate(): boolean {
    let funcResult = null;
    this.validationMessage = '';
    this.validRules.forEach(func => {
      funcResult = func(this._time);
      if (funcResult !== true) {
        this.validationMessage = funcResult as string;
      }
    });
    return !this.validationMessage;
  }

  private emitedValue(value: string): string {
    return UnitService.timeToISO(value);
  }

  get isAM(): boolean {
    return this.ampm === 'am';
  }

  get isPM(): boolean {
    return this.ampm === 'pm';
  }

  get _hours() {
    if (!isDefined(this.hours)) {
      return '';
    }
    return this.leaderZero(this.hours);
  }

  get _minutes() {
    if (!isDefined(this.minutes)) {
      return '';
    }
    return this.leaderZero(this.minutes);
  }

  get _time() {
    if (!this._hours && !this._minutes) {
      return '';
    }
    if (!this.is24hr) {
      return `${this._hours}:${this._minutes} ${this.ampm}`;
    }
    if (this.is24hr) {
      return `${this._hours}:${this._minutes}`;
    }
  }

  get defaultPlaceholder(): string {
    if (this.placeholder) {
      return this.placeholder;
    }
    return this.$i18n.gettext('Timepicker Placeholder');
  }
}
