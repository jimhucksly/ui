import { isDefined, uniqueID } from '@dn-web/core';
import { mixins, Options, Prop, Provide, Watch } from 'vue-property-decorator';
import Icon from '@/components/icon/icon.vue';
import { Emit } from '@/decorators/emit.decorator';
import ViewportMixin from '@/mixins/viewport.mixins';

/**
 * @displayName ld-tabs
 */
@Options({
  inheritAttrs: false,
  components: {
    'svg-icon': Icon,
  },
})
export default class LdTabsComponent extends mixins(ViewportMixin) {
  @Prop() id: string;
  @Prop() modelValue: number;
  @Prop() activeTab: number;
  @Prop({ type: Boolean, default: true }) vertical: boolean;
  @Prop({ type: String, default: '' }) header: string;
  @Prop({ type: Boolean, default: false }) noHeader: boolean;
  @Prop({ type: Boolean, default: false }) noPadding: boolean;
  @Prop({ type: String, default: 's' }) size: 's' | 'l';

  @Provide({
    to: 'tab',
    reactive: true,
  })
  tab: {
    visibled: boolean;
  } = {
    visibled: true,
  };

  active = -1;
  isTabsVisibled = true;
  isBodyVisibled = true;

  tooltip = false;

  @Emit('change-step') emitChangeStep(value: number) {
    return value;
  }

  @Emit('update:model-value') emitUpdateModelValue(value: number) {
    return value;
  }

  @Watch('modelValue', { immediate: true }) onValueChanged(newVal: number, oldVal: number) {
    if (newVal === oldVal) {
      return;
    }
    this.active = newVal;
  }

  @Watch('activeTab', { immediate: true }) onIsActiveChanged() {
    if (isDefined(this.activeTab)) {
      this.active = this.activeTab;
    }
  }

  @Watch('active') onActiveChanged() {
    if (this.isMobileGlobal && this.isTabsVisibled) {
      this.isTabsVisibled = false;
    }
    this.emitChangeStep(this.active);
    this.emitUpdateModelValue(this.active);
  }

  @Watch('isMobileGlobal', { immediate: true }) onMobileChanged() {
    if (this.isMobileGlobal) {
      this.isBodyVisibled = true;
      this.isTabsVisibled = false;
    } else {
      this.isTabsVisibled = true;
    }
  }

  @Watch('isTabsVisibled') onTabsVisibledChanged(value: boolean) {
    this.tab.visibled = value;
  }

  mounted() {
    if (this.isMobileGlobal) {
      this.isTabsVisibled = false;
    }
  }

  toggleCollapse() {
    this.isTabsVisibled = !this.isTabsVisibled;
    this.tooltip = false;
  }

  onClick() {
    this.onActiveChanged();
  }

  get direction(): string {
    return this.vertical ? 'vertical' : 'horizontal';
  }

  get mySize(): string {
    return this.size === 's' ? 'small' : 'large';
  }

  get isBtnVisibled() {
    if (!this.isMobileGlobal) {
      return this.vertical;
    }
    if (this.vertical) {
      return this.isBodyVisibled;
    }
    return false;
  }

  get uid(): string {
    return this.id ? this.id : (uniqueID(6) as string);
  }
}
