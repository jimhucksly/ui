import { Prop, Vue } from 'vue-property-decorator';
import { Colors } from '@/types/colors';

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const name = require('./metadata.js');

export default class ButtonComponent extends Vue {
  @Prop({ type: String, default: Colors.Primary }) color: Colors;

  static rootclass = name;

  get root() {
    return ButtonComponent.rootclass;
  }

  get classes(): Array<string> {
    const result = ['b-button'];
    result.push(`${this.root}--${this.color}`);
    return result;
  }

  get classHelper() {
    return this.$dnwebui.ver;
  }
}
