import { Prop, Vue } from 'vue-property-decorator';
import ClassService from '@/services/class.service';
import { Colors } from '@/types/colors';

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const name = require('./metadata.js');

export default class LoaderComponent extends Vue {
  @Prop({ type: String, default: Colors.White }) color: Colors;
  @Prop({ type: String, default: 'circle' }) view: 'dotts' | 'circle';

  static rootclass = name;

  classService = new ClassService(LoaderComponent.rootclass);

  get isDotts(): boolean {
    return this.view === 'dotts';
  }

  get isCircle(): boolean {
    return this.view === 'circle';
  }

  get isWhite(): boolean {
    return this.color === Colors.White;
  }
}
