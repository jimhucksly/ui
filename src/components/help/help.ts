import { Prop, Vue } from 'vue-property-decorator';

export default class HelpComponent extends Vue {
  @Prop() tooltip: string;
  @Prop() link: string;
  @Prop({ type: Number, default: 20 }) size: number;

  onClick() {
    if (this.link) {
      let link = this.link;
      if (!link.startsWith('http')) {
        link = 'http://' + link;
      }
      window.open(link, 'blank');
    }
  }
}
