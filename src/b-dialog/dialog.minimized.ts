import { eventBus } from '@dn-web/core';
import { Options, Prop, Vue } from 'vue-property-decorator';
import Icon from '@/components/icon/icon.vue';
import { ModalWindow } from '@/types/dialogs';

@Options({
  emits: ['maximize', 'close', 'close-all'],
  components: {
    'svg-icon': Icon,
  },
})
export default class DialogMinimizedComponent extends Vue {
  @Prop({ type: String, default: '' }) id: string;
  @Prop() dialogs: Array<ModalWindow>;

  maximizeHandler: () => void;

  created() {
    this.maximizeHandler = this.onMaximize.bind(this);
    eventBus.$on('modal-maximize' + this.id, this.maximizeHandler);
  }

  beforeUnmount() {
    eventBus.$off('modal-maximize' + this.id, this.maximizeHandler);
  }

  onMaximize(item: ModalWindow) {
    const dlg = this.dialogs.find(d => d.id === item.id);
    if (dlg) {
      this.$emit('maximize', dlg);
    }
  }

  onClose(item: ModalWindow) {
    const dlg = this.dialogs.find(d => d.id === item.id);
    if (dlg) {
      this.$emit('close', dlg);
    }
  }

  onCloseAll() {
    this.$emit('close-all');
  }

  itemIsChanged(item: ModalWindow): boolean {
    if (!item.isChanged || typeof item.isChanged !== 'function') {
      return false;
    }
    return item.isChanged();
  }

  get label(): string {
    return 'Свёрнутые окна';
  }

  get items(): Array<ModalWindow> {
    return this.dialogs ?? [];
  }

  get isManyItems() {
    return this.items.length && this.items.length < 5;
  }
}
