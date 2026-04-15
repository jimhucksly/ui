import { Comment, Slot, Text, VNode } from 'vue';
import { mixins, Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Label from '@/components/label/label.vue';
import GridMixin from '@/mixins/grid.mixin';
import { urlRegexp } from '../utils';

/**
 * @displayName ld-text-viewer
 */
@Options({
  components: {
    'ld-label': Label,
  },
})
export default class CardTextViewer extends mixins(GridMixin) {
  /** выравнивает label по правому краю, прижимая его к полю ввода */
  /** Делает все ссылки в тексте активными */
  @Prop({ type: Boolean, default: false }) activeLinks: boolean;
  /** Поле с текстом для использования с activeLinks */
  @Prop() text: unknown;
  /** выравнивает label по правому краю, прижимая его к полю ввода */
  @Prop({ type: Boolean, default: false }) alignLabelToRight: boolean;

  hasSlotContent(slot: Slot | undefined, slotProps: Record<string, string> = {}): boolean {
    if (!slot) {
      return false;
    }

    return slot(slotProps).some((vnode: VNode) => {
      if (vnode.type === Comment) {
        return false;
      }

      if (Array.isArray(vnode.children) && !vnode.children.length) {
        return false;
      }

      return vnode.type !== Text || (typeof vnode.children === 'string' && vnode.children.trim() !== '');
    });
  }

  get hasSlot(): boolean {
    return this.hasSlotContent(this.$slots.default);
  }

  get isTextSlotOnly(): boolean {
    if (this.hasSlot) {
      return this.$slots.default().every((vnode: VNode) => typeof vnode.children === 'string');
    }
    return false;
  }

  get src() {
    if (this.text) {
      return String(this.text).replace(/\n/g, '<br>');
    }
    if (this.hasSlot && this.isTextSlotOnly) {
      const slots = this.$slots.default();
      let result = '';
      for (const s of slots) {
        result += (s.children as string).trim();
      }
      return result;
    }
    return '';
  }

  get textWithHyperlinks(): string | void {
    if (!this.src) {
      return;
    }
    if (this.activeLinks) {
      const globalUrlRegExp = new RegExp(urlRegexp, 'ig');
      return this.src.replace(globalUrlRegExp, '<a href="$1" target="_blank">$1</a>');
    }
    return this.src;
  }

  get showPlaceholder() {
    return !this.src && !this.hasSlot;
  }
}
