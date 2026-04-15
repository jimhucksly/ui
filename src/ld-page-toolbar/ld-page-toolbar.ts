import { Options, Prop, Vue } from 'vue-property-decorator';
import Icon from '@/components/icon/icon.vue';
import { Emit } from '@/decorators/emit.decorator';

/**
 * @displayName ld-page-toolbar
 */
@Options({
  components: {
    'svg-icon': Icon,
  },
})
export default class PageToolbarComponent extends Vue {
  @Prop({ type: Boolean, default: false }) preview: boolean;
  @Prop({ type: Boolean, default: false }) noBackAction: boolean;

  @Emit('back-click') onBackClickEmit() {
    return true;
  }

  back() {
    this.onBackClickEmit();
  }
}
