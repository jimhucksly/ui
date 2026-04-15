import { Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { Emit } from '@/decorators/emit.decorator';

/**
 * @displayName ld-progress
 */
export default class ProgressComponent extends Vue {
  @Prop({ type: String, default: ' ' }) label: string;
  @Prop({ type: Boolean, default: true }) counter: boolean;
  @Prop({ type: [Number, String], default: 0 }) value: number | string;
  @Prop({ type: String, default: 'linear' }) view: 'linear' | 'circular' | 'half-circle';
  @Prop({ type: String, default: '' }) size: 'xs' | 's' | 'sm' | 'm' | 'l' | 'xl';
  @Prop({ type: Boolean, default: false }) error: boolean;

  internalValue = 0;

  @Emit('complete') onCompleteEmit() {
    return true;
  }

  @Watch('value', { immediate: true }) onValueChanged() {
    let value = Number(this.value);
    if (isNaN(value)) {
      this.internalValue = 0;
      return;
    }
    if (value < 0) {
      return;
    }
    value = value < 1 ? value * 100 : value;
    if (value > 100) {
      this.internalValue = 100;
      return;
    }
    this.internalValue = Math.floor(value);
  }

  @Watch('complete') onComplete() {
    this.onCompleteEmit();
  }

  /* eslint-disable @typescript-eslint/naming-convention */
  private f_svg_ellipse_arc(value?: number) {
    const cos = Math.cos;
    const sin = Math.sin;
    const π = Math.PI;

    const f_matrix_times = ([[a, b], [c, d]]: [Array<number>, Array<number>], [x, y]: Array<number>) => [
      a * x + b * y,
      c * x + d * y,
    ];
    const f_rotate_matrix = (x: number): [Array<number>, Array<number>] => {
      const cosx = cos(x);
      const sinx = sin(x);
      return [
        [cosx, -sinx],
        [sinx, cosx],
      ];
    };
    const f_vec_add = ([a1, a2]: Array<number>, [b1, b2]: Array<number>) => [a1 + b1, a2 + b2];
    const f_svg_ellipse_arc = ([cx, cy]: Array<number>, [rx, ry]: Array<number>, [t1, Δ]: Array<number>, φ: number) => {
      /*
      returns a SVG path element that represent a ellipse.
      cx,cy → center of ellipse
      rx,ry → major minor radius
      t1 → start angle, in radian.
      Δ → angle to sweep, in radian. positive.
      φ → rotation on the whole, in radian
      URL: SVG Circle Arc http://xahlee.info/js/svg_circle_arc.html
      Version: 2019-06-19
     */
      Δ = Δ % (2 * π);
      const rotMatrix = f_rotate_matrix(φ);
      const [sX, sY] = f_vec_add(f_matrix_times(rotMatrix, [rx * cos(t1), ry * sin(t1)]), [cx, cy]);
      const [eX, eY] = f_vec_add(f_matrix_times(rotMatrix, [rx * cos(t1 + Δ), ry * sin(t1 + Δ)]), [cx, cy]);
      const fA = Δ > π ? 1 : 0;
      const fS = Δ > 0 ? 1 : 0;
      return 'M ' + sX + ' ' + sY + ' A ' + [rx, ry, (φ / (2 * π)) * 360, fA, fS, eX, eY].join(' ');
    };
    return f_svg_ellipse_arc(
      [this.cx, this.cx],
      [this.r, this.r],
      [(0 / 180) * π, ((180 * (value ? value : this.internalValue)) / 100 / 180) * π],
      (180 / 180) * π
    );
  }

  get sizes(): Record<string, number> {
    return {
      xs: 64,
      s: 88,
      sm: 160,
      m: 200,
      l: 240,
      xl: 280,
    };
  }

  get defaultSizeKey() {
    return 'sm';
  }

  get sizeKey(): string {
    return this.size || this.defaultSizeKey;
  }

  get sizeIndex(): number {
    return Object.keys(this.sizes).findIndex(key => key === this.sizeKey);
  }

  get mySize(): string {
    switch (this.sizeKey) {
      case 'xs':
        return 'x-small';
      case 's':
        return 'small';
      case 'sm':
        return 'default';
      case 'm':
        return 'large';
      case 'l':
        return 'x-large';
      case 'xl':
        return 'extra-large';
    }
  }

  get dim(): number {
    return this.sizes[this.sizeKey];
  }

  get strokeWidth(): number {
    if (!this.sizeIndex) {
      return 6;
    }
    if (this.sizeIndex === 1) {
      return 8;
    }
    return 10 + 4 * (this.sizeIndex - 1);
  }

  get r(): number {
    return Math.floor(this.dim / 2) - this.strokeWidth / 2;
  }

  get isLinear(): boolean {
    return this.view === 'linear';
  }

  get isCircular(): boolean {
    return this.view === 'circular';
  }

  get isHalfCircle(): boolean {
    return this.view === 'half-circle';
  }

  get complete(): boolean {
    return this.internalValue === 100;
  }

  get percent(): string {
    return `${this.internalValue}%`;
  }

  get cx(): number {
    return Math.floor(this.dim / 2);
  }

  get path_2wk2r(): string {
    return this.f_svg_ellipse_arc();
  }

  get path_2wk2r_180(): string {
    return this.f_svg_ellipse_arc(100);
  }
}
