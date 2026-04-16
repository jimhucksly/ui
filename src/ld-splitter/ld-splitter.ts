import debounce from 'lodash-es/debounce';
import { StyleValue } from 'vue';
import { Prop, Vue, Watch } from 'vue-property-decorator';
import { Emit } from '@/decorators/emit.decorator';

/**
 * @displayName ld-splitter
 */
export default class SplitterComponent extends Vue {
  @Prop({ type: Number, default: 10 }) margin: number;
  @Prop({ type: Boolean, default: false }) horizontal: boolean;
  @Prop({ type: Boolean, default: true }) leftVisibled: boolean;
  @Prop({ type: Boolean, default: true }) rightVisibled: boolean;
  @Prop({ type: Number, default: 50 }) leftSizePercent: number;
  @Prop({ type: String, default: '25' }) leftSizeMin: string;
  @Prop({ type: String, default: '0' }) rightSizeMin: string;
  @Prop({ type: Boolean, default: false }) resizeDisabled: boolean;

  active = false;
  percent = 50;
  hasMoved = false;
  emitResizeDebounced: () => void = null;

  @Emit('resize') emitResize(value: unknown) {
    this.$emit('resize', value);
  }

  @Watch('leftSizePercent', { immediate: true }) leftSizePercentChanged() {
    this.percent = this.leftSizePercent;
  }

  created() {
    this.emitResizeDebounced = debounce(this.emitResizeEvent.bind(this), 200);
  }

  onClick() {
    if (this.resizeDisabled) {
      return;
    }
    if (!this.hasMoved) {
      this.percent = 50;
      this.emitResize(this.percent);
    }
  }

  onDown() {
    this.active = true;
    this.hasMoved = false;
  }

  onUp() {
    this.active = false;
  }

  onMove(e: MouseEvent) {
    let offset = 0;
    let target = e.currentTarget;
    let percent = 0;
    if (this.active) {
      if (this.horizontal) {
        while (target) {
          offset += (target as HTMLElement).offsetTop;
          target = (target as HTMLElement).offsetParent;
        }
        percent = Math.floor(((e.pageY - offset) / (e.currentTarget as HTMLElement).offsetHeight) * 10000) / 100;
      } else {
        while (target) {
          offset += (target as HTMLElement).offsetLeft;
          target = (target as HTMLElement).offsetParent;
        }
        percent = Math.floor(((e.pageX - offset) / (e.currentTarget as HTMLElement).offsetWidth) * 10000) / 100;
      }
      // последнее условие не позволяет расширять левую часть, если при этом правая станет меньше, чем rightSizeMin
      if (percent > this.margin && percent < 100 - this.margin && percent <= 100 - Number(this.rightSizeMin)) {
        this.percent = percent;
        this.emitResizeDebounced();
      }
      this.hasMoved = true;
    }
  }

  onMouseMove(e: MouseEvent) {
    if (this.resizeDisabled) {
      return;
    }
    if (e.buttons === 0) {
      this.active = false;
    }
    this.onMove(e);
  }

  onTouchMove(e: TouchEvent) {
    this.onMove(e as unknown as MouseEvent);
  }

  emitResizeEvent() {
    this.emitResize(this.percent);
  }

  get mainClass() {
    return this.$ui.options?.aliases?.['ld-splitter'] ? this.$ui.options?.aliases?.['ld-splitter'] : '';
  }

  get leftPaneStyle(): StyleValue {
    const unit = this.leftSizeMin.indexOf('px') > -1 ? '' : '%';
    return this.horizontal
      ? { height: this.rightVisibled ? this.percent + '%' : '100%', 'min-height': `${this.leftSizeMin}${unit}` }
      : { width: this.rightVisibled ? this.percent + '%' : '100%', 'min-width': `${this.leftSizeMin}${unit}` };
  }

  get rightPaneStyle(): StyleValue {
    const unit = this.rightSizeMin.indexOf('px') > -1 ? '' : '%';
    return this.horizontal
      ? { height: 100 - this.percent + '%', 'min-height': `${this.rightSizeMin}${unit}` }
      : {
          width: this.leftVisibled ? 100 - this.percent + '%' : '100%',
          'min-width': `${this.rightSizeMin}${unit}`,
        };
  }
}
