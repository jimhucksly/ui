import { Options, Prop, Vue } from 'vue-property-decorator';
import Icon from '@/components/icon/icon.vue';

@Options({
  components: {
    'svg-icon': Icon,
  },
})
export default class ExpansionPanelComponent extends Vue {
  @Prop() title: string;
}
