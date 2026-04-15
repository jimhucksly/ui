import { mixins, Options, Prop } from 'vue-property-decorator';
import { Emit } from '@/decorators/emit.decorator';
import ViewportMixin from '@/mixins/viewport.mixins';

/**
 * Кнопки
 * @displayName ld-button
 *
 * isDesktop - кнопка отображатеся как стандартная кнопка с иконкой и надписью
 * isTablet - на кнопке остается одна иконка, надпись уходит в tooltip
 * isMobile - кнопка с одной иконкой без tooltip
 *
 * slot name=icon - иконка кнопки
 * slot name=text - надпись на кнопке или tooltip
 * slot name=hidden - для вспомогательных скрытых элементов
 */
@Options({
  inheritAttrs: false,
})
export default class ResponsiveButtonComponent extends mixins(ViewportMixin) {
  @Prop({ type: [String, Number], default: '' }) id: string | number;
  @Prop({ type: [String, Object], default: '' }) style: unknown;
  @Prop({ type: [String, Array, Object], default: '' }) class: unknown;
  @Prop({ type: String, default: undefined }) title: string;
  @Prop({ type: String, default: 'flat' }) variant: 'outlined' | 'text' | 'flat' | 'tonal';
  @Prop({ type: Boolean, default: false }) icon: boolean;
  @Prop({ type: Boolean, default: false }) text: boolean;
  @Prop({ type: String, default: undefined }) color: string;
  @Prop({ type: String, default: 'xs' }) size: 'xs' | 's' | 'm' | 'l';
  @Prop({ type: String, default: '' }) testid: string;
  @Prop({ type: Boolean, default: false }) responsive: boolean;
  @Prop({ type: Boolean, default: false }) disabled: boolean;
  @Prop({ type: Boolean, default: false }) loading: boolean;
  @Prop({ type: Boolean, default: undefined }) tooltip: boolean;
  @Prop({ type: String, default: '' }) tooltipText: boolean;

  @Prop({ type: Boolean, default: null }) isDesktopView: boolean;
  @Prop({ type: Boolean, default: null }) isTabletView: boolean;
  @Prop({ type: Boolean, default: null }) isMobileView: boolean;

  @Prop() ariaLabel: string;

  frozenView: string = null;

  @Emit('click') emitClick(value: unknown) {
    return value;
  }

  created() {
    this.frozenView = this.icon ? 'tablet' : 'desktop';
    if (this.desktop) {
      this.frozenView = 'desktop';
    }
    if (this.tablet) {
      this.frozenView = 'tablet';
    }
    if (this.mobile) {
      this.frozenView = 'mobile';
    }
  }

  onClick(value: unknown) {
    this.emitClick(value);
  }

  get mySize(): string {
    switch (this.size) {
      case 'xs':
        return 'x-small';
      case 's':
        return 'small';
      case 'm':
        return 'large';
      case 'l':
        return 'x-large';
    }
  }

  get isMobileGlobal() {
    if (this.$utils.isDefined(this.isDesktopView) && this.isDesktopView) {
      return false;
    }
    if (this.$utils.isDefined(this.isTabletView) && this.isTabletView) {
      return false;
    }
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    return this.globalMobileKey ? (this as any)[this.globalMobileKey] : false;
  }

  get isTabletGlobal() {
    if (this.$utils.isDefined(this.isDesktopView) && this.isDesktopView) {
      return false;
    }
    if (this.$utils.isDefined(this.isMobileView) && this.isMobileView) {
      return false;
    }
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    return this.globalTabletKey ? (this as any)[this.globalTabletKey] : false;
  }

  get isDesktopGlobal() {
    if (this.$utils.isDefined(this.isTabletView) && this.isTabletView) {
      return false;
    }
    if (this.$utils.isDefined(this.isMobileView) && this.isMobileView) {
      return false;
    }
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    return this.globalDesktopKey ? (this as any)[this.globalDesktopKey] : false;
  }

  get desktop(): boolean {
    if (this.icon) {
      return false;
    }
    if (!this.responsive) {
      return this.frozenView === 'desktop';
    }
    return this.isDesktopView || this.isDesktopGlobal;
  }

  get tablet(): boolean {
    if (this.icon && this.hasTooltip) {
      return true;
    }
    if (!this.responsive) {
      return this.frozenView === 'tablet';
    }
    return this.isTabletView || this.isTabletGlobal;
  }

  get mobile(): boolean {
    if (this.noTooltip && !this.desktop) {
      return true;
    }
    if (this.icon && !this.tooltip) {
      return true;
    }
    if (!this.responsive) {
      return this.frozenView === 'mobile';
    }
    return this.isMobileView || this.isMobileGlobal;
  }

  get defaultColor(): string {
    if (this.color) {
      return this.color;
    }
    return this.icon ? 'grey' : 'primary';
  }

  get hasTooltip() {
    if (this.text === true) {
      return false;
    }
    if (this.tooltip && this.$utils.isDefined(this.tooltipText)) {
      return true;
    }
    return this.$utils.isDefined(this.$slots['text']);
  }

  get noTooltip(): boolean {
    return !this.hasTooltip;
  }

  get view(): string {
    if (this.desktop) {
      return 'ld-button--desktop-view';
    }
    if (this.tablet) {
      return 'ld-button--tablet-view';
    }
    if (this.mobile) {
      return 'ld-button--mobile-view';
    }
  }

  get classes(): Array<string | Record<string, string>> {
    const result: Array<string | Record<string, string>> = ['ld-button', this.view];
    if (this.text) {
      result.push('ld-button-text');
    }
    if (this.mobile || this.tablet) {
      result.push('ld-button-square');
    }
    if (typeof this.class === 'string') {
      result.push(this.class);
    }
    if (Array.isArray(this.class)) {
      result.push(...this.class);
    }
    if (!this.$utils.isObjectEmpty(this.class as Record<string, string>)) {
      result.push(this.class as Record<string, string>);
    }
    return result;
  }

  get isFlat() {
    return this.variant === 'flat';
  }
}
