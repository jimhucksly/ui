import { Prop, Vue } from 'vue-property-decorator';
import { Emit } from '@/decorators/emit.decorator';

export default class ExpansionPanelsComponent extends Vue {
  @Prop() modelValue: number | Array<number>;
  @Prop({ type: Boolean, default: false }) multiple: boolean;

  internalValue: number | Array<number> = null;

  @Emit('update:model-value') emitUpdateModelValue(value: unknown) {
    return value;
  }

  created() {
    this.internalValue = Array.isArray(this.modelValue) ? [...this.modelValue] : this.modelValue;
  }

  onUpdateModelValue(value: unknown) {
    this.emitUpdateModelValue(value);
  }
}
