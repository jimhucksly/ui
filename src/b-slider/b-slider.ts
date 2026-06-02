import { isDefined, objects } from '@dn-web/core';
import isEqual from 'lodash-es/isEqual';
import { mixins, Prop, Watch } from 'vue-property-decorator';
import { Emit } from '@/decorators/emit.decorator';
import InputMixin from '@/mixins/input.mixin';

type TRange = Array<string | number>;

type TValue = string | number | TRange;

type TTicks = Array<number> | Record<number, string>;

export default class SliderComponent extends mixins(InputMixin) {
  @Prop() modelValue: TValue;
  @Prop({ type: Boolean, default: false }) range: boolean;
  @Prop({ type: Number, default: 0 }) min: number;
  @Prop({ type: Number, default: 100 }) max: number;
  @Prop({ type: Number, default: 1 }) step: number;
  @Prop({ type: Boolean, default: false }) thumbLabel: boolean;
  @Prop({ type: [Array, Object], default: (): Array<number> => [0, 25, 50, 75, 100] }) ticks: TTicks;

  internalValue: number | Array<number> = null;

  @Emit('update:model-value') emitUpdateModelValue(value: number | Array<number>) {
    return value;
  }

  @Watch('range', { immediate: true }) onRangeMode(value: boolean) {
    if (value) {
      this.internalValue = this.toArray(this.modelValue);
    } else {
      this.internalValue = this.toValue(this.modelValue);
    }
    if (!isDefined(this.internalValue)) {
      this.onModelValueChanged(null);
    }
  }

  @Watch('modelValue') onModelValueChanged(value: TValue) {
    if (!isDefined(this.modelValue)) {
      this.emitUpdateModelValue(null);
      this.internalValue = null;
      return;
    }
    this.internalValue = null;
    this.$nextTick(() => {
      this.onRangeMode(this.range);
    });
  }

  @Watch('internalValue') onValueChanged(newVal: number | Array<number>, oldVal: number | Array<number>) {
    if (!isDefined(this.internalValue)) {
      return;
    }
    if (isEqual(newVal, this.modelValue)) {
      return;
    }
    this.emitUpdateModelValue(this.internalValue);
  }

  get hasTicks(): boolean {
    if (Array.isArray(this.ticks)) {
      return this.ticks.length > 0;
    }
    return this.ticks && !objects.isEmpty(this.ticks);
  }

  private toNumber(value: TValue): number | Array<number> {
    if (typeof value === 'number') {
      return value;
    }
    let arr = [];
    if (typeof value === 'string') {
      const split = value.split(',');
      arr.push(...split);
    }
    if (Array.isArray(value)) {
      arr.push(value[0], value[1]);
    }
    arr = arr
      .map(el => (el ? Number(el) : null))
      .map(el => (isNaN(el) ? null : el))
      .map((el, index) => (el ? el : index === 0 ? this.min : this.max));
    if (arr.length === 1) {
      return arr[0];
    }
    return arr;
  }

  private toArray(value: TValue): Array<number> {
    if (!isDefined(value)) {
      return [this.min, this.max];
    }
    const val = this.toNumber(value);
    if (Array.isArray(val)) {
      return val;
    }
    return [Math.max(val, this.min), Math.min(this.max, val)];
  }

  private toValue(value: TValue): number {
    if (!isDefined(value)) {
      return this.min;
    }
    const val = this.toNumber(value);
    if (Array.isArray(val)) {
      return Math.max(Math.min(val[0], this.max), this.min);
    }
    return Math.max(Math.min(val, this.max), this.min);
  }
}
