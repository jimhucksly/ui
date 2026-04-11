import { Prop, Vue } from 'vue-property-decorator';

export default class InputMixin extends Vue {
  @Prop({ type: String, default: null }) name: string;
  @Prop({ type: String, default: null }) placeholder: string;
  @Prop({ type: Boolean, default: false }) required: boolean;
  @Prop({ type: String, default: null }) error: string;
}
