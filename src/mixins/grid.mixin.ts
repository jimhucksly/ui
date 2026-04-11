import { Prop, Vue } from 'vue-property-decorator';

export default class GridMixin extends Vue {
  @Prop({ type: String, default: null }) label: string;
  @Prop({ type: Boolean, default: false }) labelOnTop: boolean;
  @Prop({ type: Array, default: [] }) grid: Array<number>;

  get currentGrid(): Array<number> {
    if (this.label) {
      if (this.labelOnTop) {
        return [12, 12];
      }
      return Array.isArray(this.grid) && this.grid.length === 2 ? this.grid : this.defaultGrid;
    }
    return [0, 12];
  }

  get defaultGrid(): Array<number> {
    return [3, 9];
  }

  get labelCell(): number {
    return this.currentGrid[0];
  }

  get inputCell(): number {
    return this.currentGrid[1];
  }
}
