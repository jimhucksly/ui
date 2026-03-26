import { Prop, Vue } from 'vue-property-decorator';
import ClassService from '@/services/class.service';
import { Colors } from '@/types/colors';

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const name = require('./metadata.js');

export default class ButtonComponent extends Vue {
  @Prop({ type: String, default: Colors.Primary }) color: Colors;
  @Prop({ type: Boolean, default: false }) outlined: boolean;

  static rootclass = name;

  classService = new ClassService(ButtonComponent.rootclass);
}
