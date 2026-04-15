import { Options, Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import SvgIcon from './svg-icon.vue';

/**
 * @displayName ld-icon
 */
@Options({
  components: {
    'svg-icon': SvgIcon,
  },
})
export default class IconComponent extends Vue {
  @Prop({ default: (): { icons: Array<[string, string]> } => ({ icons: [] }) }) map: { icons: Array<[string, string]> };
  @Prop({ default: 'icons' }) path: string;
  @Prop() icon: string;
  @Prop() color: string;
  @Prop({ default: '20' }) width: string;
  @Prop({ default: '20' }) height: string;

  current = '';

  @Watch('icon') onIconChange() {
    this.current = this.icon.trim();
  }

  created() {
    if (this.icon) {
      this.current = this.icon.trim();
      return;
    }
    if (this.$slots.default) {
      const slot = this.$slots.default()?.[0];
      if (slot && slot.children && typeof slot.children === 'string') {
        this.current = slot.children.trim();
      }
    }
  }

  get props() {
    return {
      path: this.path,
      width: this.width,
      height: this.height,
    };
  }

  get array(): Array<string> {
    const found = this.map.icons.find(el => el[0] === this.current);
    if (found) {
      return found;
    }
    return [this.current, this.current];
  }

  get className(): Array<string> {
    if (this.color) {
      return [`${this.color}--text`];
    }
    return [];
  }
}
