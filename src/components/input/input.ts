import { uniqueID } from '@dn-web/core';
import { Emit, mixins, Prop, Watch } from 'vue-property-decorator';
import GridMixin from '@/mixins/grid.mixin';
import InputMixin from '@/mixins/input.mixin';
import ClassService from '@/services/class.service';

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const name = require('./metadata.js');

export default class InputComponent extends mixins(InputMixin, GridMixin) {
  @Prop() modelValue: string;

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
