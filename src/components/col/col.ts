import { Prop, Vue } from 'vue-property-decorator';

export default class ColComponent extends Vue {
  @Prop({ type: String, default: '' }) cols: string;
  @Prop({ type: Boolean, default: false }) end: boolean;
  @Prop({ type: Boolean, default: false }) center: boolean;

  get classes() {
    const result = [];
    if (this.valid) {
      result.push(`col-${this.cols}`);
    }
    if (this.end) {
      result.push('flex-end');
    }
    if (this.center) {
      result.push('flex-center');
    }
    return result.length ? result : null;
  }

  get col() {
    return Number(this.cols);
  }

  get valid() {
    return !isNaN(this.col) && this.col > 0 && this.col < 13;
  }
}
