import { mixins, Prop, Watch } from 'vue-property-decorator';
import ViewportMixin from './viewport.mixins';

export default class GridMixin extends mixins(ViewportMixin) {
  /** from mixin: размер поля ввода в единицах сетки (min: 1; max: 12) */
  @Prop({ default: 9 }) inputSize: number | string;
  /** from mixin: размер Лэйбла в единицах сетки (min: 1; max: 12) */
  @Prop({ default: 3 }) labelSize: number | string;
  /** Label для инпута */
  @Prop() label: string;
  /** принудительно размещает Label над полем ввода */
  @Prop({ default: false, type: Boolean }) labelOnTop: boolean;
  /** поле, по которому компонент понимает, что надо переключиться в мобильный вид */
  @Prop() mobile: boolean;

  labelSizeClasses: Record<string, boolean> = null;
  inputSizeClasses: Record<string, boolean> = null;

  myInputSize = 0;
  myLabelSize = 0;

  @Watch('isMobileGlobal')
  @Watch('mobile')
  @Watch('labelOnTop')
  onMobileViewChanged() {
    this.gridMixinSetClasses();
  }

  created() {
    this.gridMixinSetClasses();
  }

  gridMixinSetClasses() {
    this.myInputSize = Number(this.inputSize);
    this.myLabelSize = Number(this.labelSize);
    if (this.myLabelSize !== 3 || this.myInputSize !== 9) {
      if (this.myLabelSize) {
        this.myInputSize = 12 - this.myLabelSize;
      }
      if (this.myInputSize) {
        this.myLabelSize = 12 - this.myInputSize;
      }
    }
    if (this.mobile || this.labelOnTop || this.isMobileGlobal || !this.label) {
      this.myInputSize = 12;
      this.myLabelSize = 12;
    }
    this.labelSizeClasses = {
      'v-col-1': this.myLabelSize === 1,
      'v-col-2': this.myLabelSize === 2,
      'v-col-3': this.myLabelSize === 3,
      'v-col-4': this.myLabelSize === 4,
      'v-col-5': this.myLabelSize === 5,
      'v-col-6': this.myLabelSize === 6,
      'v-col-7': this.myLabelSize === 7,
      'v-col-8': this.myLabelSize === 8,
      'v-col-9': this.myLabelSize === 9,
      'v-col-10': this.myLabelSize === 10,
      'v-col-11': this.myLabelSize === 11,
      'v-col-12': this.myLabelSize === 12,
    };

    this.inputSizeClasses = {
      'v-col-1': this.myInputSize === 1,
      'v-col-2': this.myInputSize === 2,
      'v-col-3': this.myInputSize === 3,
      'v-col-4': this.myInputSize === 4,
      'v-col-5': this.myInputSize === 5,
      'v-col-6': this.myInputSize === 6,
      'v-col-7': this.myInputSize === 7,
      'v-col-8': this.myInputSize === 8,
      'v-col-9': this.myInputSize === 9,
      'v-col-10': this.myInputSize === 10,
      'v-col-11': this.myInputSize === 11,
      'v-col-12': this.myInputSize === 12,
    };
  }
}
