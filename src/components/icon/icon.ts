import { Vue } from 'vue-class-component';

export default class IconComponent extends Vue {
  icon: string = null;

  created() {
    const slots = this.$slots.default();
    if (Array.isArray(slots)) {
      const slot = slots[0];
      if (!slot) {
        return;
      }
      if (slot.type === Symbol.for('v-txt')) {
        this.icon = slot.children as string;
      }
    }
  }
}
