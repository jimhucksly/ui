import { datetime, isDefined } from '@dn-web/core';
import { mixins, Options, Prop, Vue, Watch } from 'vue-property-decorator';
import Icon from '@/components/icon/icon.vue';
import { Emit } from '@/decorators/emit.decorator';
import InputMixin from '@/mixins/input.mixin';
import { ViewMode } from '@/types/calendar';
import { DateRange } from '@/types/daterange';

function preventDefault(e: MouseEvent) {
  e.preventDefault();
}

let supportsPassive = false;
try {
  window.addEventListener(
    'test',
    null,
    Object.defineProperty({}, 'passive', {
      get() {
        supportsPassive = true;
      },
    })
  );
} catch (e) {
  //
}
const wheelOpt = supportsPassive ? { passive: false } : false;
const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

function disableScroll() {
  window.addEventListener(wheelEvent, preventDefault, wheelOpt);
}

function enableScroll() {
  window.removeEventListener(wheelEvent, preventDefault);
}

type TViewMode = ViewMode;
type TDateRange = DateRange;

interface IRangeService {
  isStart: (value: Date) => boolean;
  isEnd: (value: Date) => boolean;
  inRange: (value: Date) => boolean;
}

/**
 * Календарь
 * @displayName ld-calendar
 */
@Options({
  components: {
    'svg-icon': Icon,
  },
})
export default class CalendarComponent extends mixins(InputMixin) {
  @Prop() modelValue: Date;
  @Prop() minDate: Date;
  @Prop() maxDate: Date;
  @Prop() range: TDateRange;
  @Prop({ type: String, default: 'month' }) viewMode: TViewMode;
  @Prop({ type: Array, default: (): Array<Date> => [] }) disabledDates: Array<Date>;
  @Prop({ type: Array, default: (): Array<Date> => [] }) allowedDates: Array<Date>;
  @Prop({ type: Number, default: null }) month: number;
  @Prop({ type: Number, default: null }) year: number;
  @Prop({ type: Boolean, default: true }) scrolling: boolean;

  internalValue: Date = null;
  internalViewMode: TViewMode = null;

  now: Date = new Date();

  currentMonth: number = null;
  currentYear: number = null;

  displayedCurrentYear: number = null;

  scrollHandler: () => void = null;
  mouseOverHandler: () => void = null;

  @Emit('update:model-value') emitUpdateModelValue(date: string | Date) {
    return date;
  }

  @Emit('update:month') emitUpdateMonth(value: number) {
    return value;
  }

  @Emit('update:year') emitUpdateYear(value: number) {
    return value;
  }

  @Emit('pick-day') emitClick(date: string) {
    return date;
  }

  @Watch('modelValue', { immediate: true }) onModelValueChanged(value: Date) {
    if (!(value instanceof Date)) {
      this.emitUpdateMonth(new Date().getMonth());
      this.emitUpdateYear(new Date().getFullYear());
      return;
    }
    if (datetime.compare(value, this.internalValue) === 0) {
      return;
    }
    this.internalValue = new Date(value);
  }

  @Watch('internalValue', { deep: true }) onValueChanged(value: Date) {
    this.emitUpdateModelValue(value);
    this.emitUpdateMonth(value.getMonth());
    this.emitUpdateYear(value.getFullYear());
  }

  @Watch('viewMode', { immediate: true }) onViewModeChanged(val: TViewMode) {
    this.onUpdateViewMode(val);
  }

  @Watch('month') onMonthChanged(value: number) {
    if ((value + 1) % 12 === 0 && this.currentMonth > value) {
      this.currentYear--;
    }
    if (value % 12 === 0 && this.currentMonth < value) {
      this.currentYear++;
    }
    this.currentMonth = value;
    this.onUpdateMonth(value);
  }

  @Watch('year') onYearChanged(value: number) {
    this.currentYear = value;
    this.onUpdateYear(value);
  }

  @Watch('currentMonth', { immediate: true }) onCurrentMonthChanged() {
    if (isDefined(this.currentMonth)) {
      return;
    }
    if (this.month) {
      this.currentMonth = this.month;
      return;
    }
    this.currentMonth = (this.internalValue ?? this.now).getMonth();
  }

  @Watch('currentYear', { immediate: true }) onCurrentYearChanged() {
    if (isDefined(this.currentYear)) {
      return;
    }
    this.currentYear = (this.internalValue ?? this.now).getFullYear();
  }

  @Watch('scrolling') onScrollingChanged(value: boolean) {
    if (value) {
      this.initScrolling();
    } else {
      this.disableScrolling();
    }
  }

  mounted() {
    this.fixWeekdayTitle();
    this.scrollHandler = this.scroll.bind(this);
    if (this.scrolling) {
      this.initScrolling();
    }
  }

  beforeUnmount() {
    window.removeEventListener('wheel', this.scrollHandler);
    document.removeEventListener('mouseover', this.mouseOverHandler);
  }

  onUpdateMonth(current: number) {
    this.$nextTick(() => {
      this.fixWeekdayTitle();
    });
    this.emitUpdateMonth(isDefined(current) ? current : new Date().getMonth());
  }

  onUpdateYear(current: number) {
    this.$nextTick(() => {
      this.fixWeekdayTitle();
    });
    this.emitUpdateYear(isDefined(current) ? current : new Date().getFullYear());
  }

  onUpdateViewMode(val: TViewMode) {
    this.internalViewMode = val;
    this.displayedCurrentYear = this.currentYear;
    this.$nextTick(() => {
      this.fixWeekdayTitle();
    });
  }

  onClick(event: PointerEvent, date: string, cb: (event: PointerEvent) => unknown) {
    cb(event);
    this.emitClick(date);
  }

  displayYear(value: number): boolean {
    return Math.abs(value - this.displayedCurrentYear) <= 10;
  }

  getAllowedDates(date: Date): boolean {
    if (Array.isArray(this.disabledDates) && this.disabledDates.length) {
      const index = this.disabledDates.findIndex(d => datetime.compare(date, d) === 0);
      if (index > -1) {
        return false;
      }
    }
    if (Array.isArray(this.allowedDates) && this.allowedDates.length) {
      const index = this.allowedDates.findIndex(d => datetime.compare(date, d) === 0);
      return index > -1;
    }
    return true;
  }

  scroll(event: WheelEvent) {
    const calendarRef = this.$refs.vInput as Vue;
    if (!calendarRef) {
      return;
    }
    const body = calendarRef.$el.querySelector('.v-picker__body');
    if (!body) {
      return;
    }
    const rect = body.getBoundingClientRect();
    if (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    ) {
      if (event.deltaY < 0) {
        this.emitUpdateMonth(this.month - 1);
      } else if (event.deltaY > 0) {
        this.emitUpdateMonth(this.month + 1);
      }
    }
  }

  mouseOver(e: PointerEvent) {
    const target = e.target as HTMLElement;
    if (target.closest('.v-picker__body')) {
      disableScroll();
    } else {
      enableScroll();
    }
  }

  private initScrolling() {
    window.addEventListener('wheel', this.scrollHandler);
    const calendarRef = this.$refs.vInput as Vue;
    if (!calendarRef) {
      return;
    }
    const body = calendarRef.$el.querySelector('.v-picker__body');
    if (!body) {
      return;
    }
    this.mouseOverHandler = this.mouseOver.bind(this);
    document.addEventListener('mouseover', this.mouseOverHandler);
  }

  private disableScrolling() {
    window.removeEventListener('wheel', this.scrollHandler);
    document.removeEventListener('mouseover', this.mouseOverHandler);
  }

  private fixWeekdayTitle() {
    const instansce = this.$refs['vInput'] as Vue;
    const el = instansce ? (instansce.$el as HTMLElement) : null;
    if (el) {
      const weekdays = el.querySelectorAll('.v-date-picker-month__weekday');
      const arr = Array.from(weekdays);
      if (Array.isArray(arr) && arr.length > 0) {
        for (const i of arr) {
          i.innerHTML = this.$i18n.gettext(i.textContent);
        }
      }
    }
  }

  get firstDayOfWeek(): number {
    return this.locale.includes('en') ? 0 : 1;
  }

  get locale(): string {
    return this.$ui.options.language;
  }

  get isMonth(): boolean {
    return this.internalViewMode === 'month';
  }

  get isMonths(): boolean {
    return this.internalViewMode === 'months';
  }

  get isYear(): boolean {
    return this.internalViewMode === 'year';
  }

  get isRange(): boolean {
    return this.range && Array.isArray(this.range);
  }

  get rangeService(): IRangeService {
    return {
      isStart: (value: string | Date): boolean => {
        if (!this.range || !Array.isArray(this.range) || !this.range[0]) {
          return false;
        }
        return datetime.compare(value, this.range[0]) === 0;
      },
      isEnd: (value: string | Date): boolean => {
        if (!this.range || !Array.isArray(this.range) || !this.range[1]) {
          return false;
        }
        return datetime.compare(value, this.range[1]) === 0;
      },
      inRange: (value: string | Date): boolean => {
        if (!this.range || !Array.isArray(this.range) || !this.range[0] || !this.range[1]) {
          return false;
        }
        return datetime.compare(value, this.range[0]) === 1 && datetime.compare(value, this.range[1]) === -1;
      },
    };
  }
}
