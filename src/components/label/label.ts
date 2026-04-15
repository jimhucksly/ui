import { Prop, Vue } from 'vue-property-decorator';
import { Emit } from '@/decorators/emit.decorator';

/**
 * Простой компонент лейбла для полей карточки
 */
export default class LabelComponent extends Vue {
  /** Label для инпута */
  @Prop({ default: '', type: String }) label: string;
  /** подсказка над лэйблом. Появляется при наведении курсора на лэйбл */
  @Prop({ default: '', type: String }) labelHint: string;
  /** выравнивает label по правому краю, прижимая его к полю ввода */
  @Prop({ type: Boolean, default: false }) alignLabelToRight: boolean;
  /** помечает поле обязательным, включается визуальная валидация на заполненность */
  @Prop({ default: false, type: Boolean }) required: boolean;
  @Prop() hint: string;
  @Prop() hover: boolean;

  onMouseEnterHandler: () => void = null;
  onMouseLeaveHandler: () => void = null;

  @Emit('click') onClick() {
    return true;
  }

  @Emit('update:hover') onHoverEmit(value: boolean) {
    return value;
  }

  mounted() {
    this.onMouseEnterHandler = this.onMouseEnter.bind(this);
    this.$el.addEventListener('mouseenter', this.onMouseEnterHandler);
    this.onMouseLeaveHandler = this.onMouseLeave.bind(this);
    this.$el.addEventListener('mouseleave', this.onMouseLeaveHandler);
  }

  beforeUnmount() {
    this.$el.removeEventListener('mouseenter', this.onMouseEnterHandler);
    this.$el.removeEventListener('mouseleave', this.onMouseLeaveHandler);
  }

  onMouseEnter() {
    this.onHoverEmit(true);
  }

  onMouseLeave() {
    this.onHoverEmit(false);
  }
}
