import { Vue } from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import ClassService from '@/services/class.service';

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const name = require('./metadata.js');

export default class SliderComponent extends Vue {
  @Prop() modelValue: number;
  @Prop({ type: Array, default: (): Array<number> => [3, 5, 10] }) points: Array<number>;

  static rootclass = name;

  classService = new ClassService(SliderComponent.rootclass);

  rect: DOMRect = null;
  drag = false;
  currentX: number = null;
  startX: number = null;
  max: number = null;
  step: number = null;

  onResizeHandler: () => void;

  @Emit('update:model-value') onUpdateModelValue(value: number) {
    return value;
  }

  created() {
    if (!this.modelValue) {
      this.onUpdateModelValue(this.points[0]);
    }
  }

  mounted() {
    this.currentX = 0;
    this.calcStep();
    if (this.modelValue) {
      const index = this.points.indexOf(this.modelValue);
      this.currentX = index * this.step;
    }
    this.onResizeHandler = this.onResize.bind(this);
    window.addEventListener('resize', this.onResizeHandler);
  }

  beforeUnmount() {
    window.removeEventListener('resize', this.onResizeHandler);
  }

  calcStep() {
    this.rect = this.$el.getBoundingClientRect();
    this.max = this.rect.width - 20;
    this.step = Math.floor(this.max / (this.points.length - 1));
  }

  onMouseDown(event: MouseEvent) {
    if (event.button > 0) {
      /**
       * Нажата не левая кнопка мыши
       */
      return;
    }
    this.startX = event.clientX - this.currentX;
    document.onmousemove = this.onMouseMove.bind(this);
    document.onmouseup = this.onMouseUp.bind(this);
    this.drag = true;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.drag) {
      return;
    }
    const moveX = event.clientX - this.startX;
    if (moveX <= 0) {
      this.currentX = 0;
      this.onMouseUp();
      return;
    }
    if (moveX >= this.max) {
      this.currentX = this.max;
      this.onMouseUp();
      return;
    }
    this.currentX = moveX;
    const index = this.getIndex();
    this.emitValue(index);
  }

  onMouseUp() {
    if (!this.drag) {
      return;
    }
    this.drag = false;
    document.onmousemove = null;
    document.onmouseup = null;
    const index = this.getIndex();
    this.emitValue(index);
    this.currentX = index * this.step;
  }

  onResize() {
    this.calcStep();
    const index = this.getIndex();
    this.currentX = index * this.step;
  }

  private getIndex(): number {
    let result = Math.floor(this.currentX / this.step);
    if (this.currentX - this.step * result > this.step / 2) {
      result++;
    }
    return result;
  }

  private emitValue(index: number) {
    this.onUpdateModelValue(this.points[index]);
  }
}
