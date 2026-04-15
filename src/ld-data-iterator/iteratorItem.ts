import { Options, Prop, Vue, Watch } from 'vue-property-decorator';
import { Emit } from '@/decorators/emit.decorator';

@Options({
  name: 'IteratorItem',
  template: `
    <div @click="$emit('click', $event)" @dblclick="$emit('dblclick', $event)">
      <slot></slot>
    </div>
  `,
  emits: ['click', 'dblclick'],
})
export default class IteratorItemComponent extends Vue {
  @Prop() refreshCounter: number;

  static MIN_HEIGHT_EMTPY_ITEM = 20;

  height = 0;
  width = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeObserver: any = null;
  elem: Element = null;

  @Emit('update-height') emitUpdateHeight(value: number) {
    return value;
  }

  @Watch('refreshCounter') emitRefreshCounterChanged() {
    this.emitUpdateHeight(this.$el.clientHeight);
  }

  mounted() {
    this.setupResizeObserver();
    this.elem = this.$el;
    this.resizeObserver.observe(this.$el);
  }

  beforeUpdate() {
    if (this.elem !== this.$el) {
      if (this.resizeObserver) {
        this.resizeObserver.unobserve(this.elem);
      }
      this.setupResizeObserver();
      this.resizeObserver.observe(this.$el);
    }
  }

  beforeUnmount() {
    this.resizeObserver.unobserve(this.$el);
  }

  private setupResizeObserver() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const vm = this;
    this.resizeObserver = new window.ResizeObserver(entries => {
      let height = 0;
      if (entries.length && entries[0].contentRect) {
        height = entries[0].contentRect.height;
        vm.width = entries[0].contentRect.width;
      } else {
        height = vm.$el.clientHeight;
        vm.width = vm.$el.clientWidth;
      }
      if (height > IteratorItemComponent.MIN_HEIGHT_EMTPY_ITEM && height !== vm.height) {
        vm.height = height;
        vm.emitUpdateHeight(vm.height);
      }
    });
  }
}
