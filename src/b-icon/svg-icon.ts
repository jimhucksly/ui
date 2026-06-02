import { Prop, Vue } from 'vue-property-decorator';

export default class SvgIconComponent extends Vue {
  @Prop() icon: string;
  @Prop() path: string;

  get href(): string {
    return `${this.path}/${this.icon}.svg`;
  }
}
