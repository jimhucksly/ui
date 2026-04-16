import { mixins, Options } from 'vue-class-component';
import { Inject, Prop } from 'vue-property-decorator';
import ViewportMixin from '@/mixins/viewport.mixins';

/**
 * @displayName ld-tab
 */
@Options({
  name: 'ld-tab',
})
export default class LdTabComponent extends mixins(ViewportMixin) {
  @Prop({ type: [String, Number], default: null }) index: string | number;
  @Prop({ type: String, default: null }) heading: string;
  @Prop({ type: Boolean, default: false }) disabled: boolean;
  @Prop({ type: Boolean, default: false }) readonly: boolean;
  @Prop({ type: String, default: undefined }) activeClass: string;
  @Prop({ type: Boolean, default: false }) lazy: boolean;

  @Inject({ from: 'tab' }) tab: { visibled: boolean };

  get onlyWindows(): boolean {
    return this.$parent.$options.name === 'VWindow';
  }

  get styles() {
    if (!this.tab.visibled) {
      const w = this.isMobileGlobal ? '44px' : '60px';
      return {
        width: `${w} !important`,
      };
    }
    return {};
  }
}
