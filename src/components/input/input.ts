import { uniqueID } from '@dn-web/core';
import { Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import ClassService from '@/services/class.service';

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const name = require('./metadata.js');

export default class InputComponent extends Vue {
  @Prop() modelValue: string;
  @Prop({ type: String, default: null }) label: string;
  @Prop({ type: String, default: null }) placeholder: string;
  @Prop({ type: String, default: null }) name: string;
  @Prop({ type: Boolean, default: false }) required: string;
  @Prop({ type: String, default: null }) error: string;

  static rootclass = name;

  classService = new ClassService(InputComponent.rootclass);

  internalValue: string = null;

  @Emit('update:model-value') onUpdateModel(value: string) {
    return value;
  }

  @Watch('modelValue', { immediate: true }) onValueChanged() {
    this.internalValue = this.modelValue;
  }

  onInput(e: InputEvent) {
    const value = (e.target as HTMLInputElement).value;
    this.onUpdateModel(value);
  }

  get uid(): string {
    return uniqueID(6) as string;
  }
}
