import { Prop, Vue } from 'vue-property-decorator';

export default class RowComponent extends Vue {
  @Prop({ type: Boolean, default: false }) end: boolean;
  @Prop({ type: Boolean, default: false }) center: boolean;
  @Prop({ type: Boolean, default: false }) reverse: boolean;
  @Prop({ type: Boolean, default: false }) col: boolean;
}
