import { objects, uniqueID } from '@dn-web/core';
import { mixins, Prop, Watch } from 'vue-property-decorator';
import GridMixin from '@/mixins/grid.mixin';
import InputMixin from '@/mixins/input.mixin';
import ClassService from '@/services/class.service';

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const name = require('./metadata.js');

export default class OTPComponent extends mixins(InputMixin, GridMixin) {
  @Prop() modelValue: string;
  @Prop({ type: Number, default: 5 }) count: number;

  static rootclass = name;

  classService = new ClassService(OTPComponent.rootclass);

  values: Record<number, unknown> = {};

  @Watch('code') onValuesChanged(value: string) {
    if (value) {
      this.$emit('update:modelValue', value);
    }
  }

  onInput(e: Event, index: number) {
    const value = (e.target as HTMLInputElement).value.trim();
    if (/[\D]/.test(value)) {
      this.$emit('input');
      this.values[index] = value.replace(/[\D]/g, '');
      return false;
    }
    if (index === 1 && value.length > 1 && /^[\d]{1,}$/.test(value)) {
      this.values[index] = value.slice(0, 1);
      for (let i = 2; i <= value.length; i++) {
        this.setFocus(index + i - 1, value.slice(i - 1, i));
      }
      return false;
    }
    if (value.length === 1 && /\d/.test(value)) {
      this.values[index] = value;
      this.setFocus(index + 1);
    } else {
      this.values[index] = value.slice(0, 1);
      this.setFocus(index + 1, value.slice(1));
    }
    return false;
  }

  onKeydown(e: KeyboardEvent, index: number) {
    if (e.code === 'Delete') {
      e.preventDefault();
      e.stopPropagation();
      this.values[index] = '';
    }
    if (e.code === 'Backspace') {
      e.preventDefault();
      e.stopPropagation();
      this.values[index] = '';
      this.setFocus(index - 1);
    }
    if (e.code === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      this.setFocus(index - 1);
    }
    if (e.code === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      this.setFocus(index + 1);
    }
    return false;
  }

  setFocus(index: number, value?: string) {
    const input = this.$el.querySelector('#field-' + index);
    if (input) {
      input.focus();
      if (value) {
        this.values[index] = value;
      }
    }
  }

  get arr(): Array<number> {
    return Array(this.count)
      .fill(1)
      .map((_, i) => i + 1);
  }

  get code(): string {
    if (objects.isEmpty(this.values)) {
      return '';
    }
    return Object.values(this.values).join('');
  }

  get uid(): string {
    return uniqueID(6) as string;
  }
}
