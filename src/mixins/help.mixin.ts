import { isDefined } from '@dn-web/core';
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

export default class HelpMixin extends Vue {
  /**
   * Иконка Справка
   */
  @Prop({
    type: Object,
    default: () => ({
      tooltip: '',
      link: '',
    }),
  })
  help: {
    tooltip: string;
    link: string;
  };

  get isShowHelp() {
    return isDefined(this.help) && (this.help.tooltip || this.help.link);
  }
}
