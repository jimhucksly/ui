import { uniqueID } from '@dn-web/core';
import { Prop, Provide, Vue, Watch } from 'vue-property-decorator';
import { Emit } from '@/decorators/emit.decorator';

export default class ExpansionPanelsComponent extends Vue {
  @Prop() modelValue: number | Array<number>;
  @Prop({ type: Boolean, default: false }) multiple: boolean;

  internalValue: number | Array<number> = null;

  reg: Map<string, number> = new Map();

  @Emit('update:model-value') emitUpdateModelValue(value: unknown) {
    return value;
  }

  @Watch('modelValue', { immediate: true, deep: true }) onModelChanged() {
    this.internalValue = Array.isArray(this.modelValue) ? [...this.modelValue] : this.modelValue;
  }

  @Provide({
    to: 'panels',
    reactive: true,
  })
  panels: {
    uid: string;
    register: (uid: string) => void;
    unregister: (uid: string) => void;
    getMyIndex: (uid: string) => number;
  } = {
    uid: null,
    register: null,
    unregister: null,
    getMyIndex: null,
  };

  created() {
    this.panels.uid = this.uid;
    this.panels.register = this.register.bind(this);
    this.panels.unregister = this.unregister.bind(this);
    this.panels.getMyIndex = this.getMyIndex.bind(this);
  }

  onUpdateModelValue(value: unknown) {
    this.emitUpdateModelValue(value);
  }

  getMyIndex(uid: string): number {
    if (this.reg.has(uid)) {
      return this.reg.get(uid);
    }
    return null;
  }

  register(uid: string) {
    const childs = (this.$el as HTMLElement).querySelectorAll(`.v-expansion-panel[data-uid*="${this.uid}"]`);
    if (childs.length) {
      Array.from(childs).forEach((el, index) => {
        const data = (el as HTMLElement).dataset.uid;
        if (data.indexOf(uid) > -1) {
          this.reg.set(uid, index);
        }
      });
    }
  }

  unregister() {
    this.reg.clear();
  }

  get uid(): string {
    return uniqueID(6) as string;
  }
}
