import { uniqueID } from '@dn-web/core';
import { Inject, Options, Prop, Vue } from 'vue-property-decorator';
import Icon from '@/components/icon/icon.vue';
import { Emit } from '@/decorators/emit.decorator';

@Options({
  components: {
    'svg-icon': Icon,
  },
})
export default class ExpansionPanelComponent extends Vue {
  @Prop() title: string;
  @Prop({ type: Boolean, default: false }) eager: boolean;
  @Prop({ type: Boolean, default: false }) readonly: boolean;
  @Prop({ type: Boolean, default: false }) hideIcon: boolean;

  @Emit('click') emitClick(event: PointerEvent, index: number) {
    //
  }

  @Inject({ from: 'panels' }) panels: {
    uid: string;
    register: (uid: string) => void;
    unregister: (uid: string) => void;
    getMyIndex: (uid: string) => number;
  };
  mounted() {
    this.panels.register(this.uid);
  }

  beforeUnmount() {
    this.panels.unregister(this.uid);
  }

  onClick(e: PointerEvent) {
    const index = this.panels.getMyIndex(this.uid);
    this.emitClick(e, index);
  }

  get uid(): string {
    return uniqueID(6) as string;
  }
}
