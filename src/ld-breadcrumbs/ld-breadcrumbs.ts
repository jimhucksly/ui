import { Prop, Vue, Watch } from 'vue-property-decorator';
import { IBreadcrumbsItem, IRoute } from '@/types/breadcrumbs';

type BreadcrumbsItem = IBreadcrumbsItem;

/**
 * Хлебные крошки
 * @displayName ld-breadcrumbs
 */
export default class BreadcrumbsComponent extends Vue {
  @Prop({ type: String, default: '' }) label: string;
  @Prop() breadcrumbs: Array<BreadcrumbsItem>;
  @Prop({ default: null }) home: { name?: string; path?: string };
  @Prop({ type: String, default: 'dark' }) theme: 'light' | 'dark';
  @Prop({ type: String, default: 'm' }) size: 's' | 'm' | 'l';

  @Watch('breadcrumbs', { immediate: true }) onBreadcrumbsChanged() {
    if (this.breadcrumbs && this.breadcrumbs.length) {
      this.items = [
        ...this.breadcrumbs.map((item, index) => {
          item.disabled = item.disabled === true ? item.disabled : index === this.breadcrumbs.length - 1;
          item.uid = this.$utils.uidGen(6, '0-9') as number;
          return item;
        }),
      ];
      if (this.items[0].text !== 'home') {
        this.items.unshift({
          text: 'home',
          route: {},
        });
      }
    }
  }

  items: Array<BreadcrumbsItem> = [];
  collapsed: Record<number, Array<BreadcrumbsItem>> = {};

  goHome() {
    const home: BreadcrumbsItem = this.items[0].text === 'home' ? this.items[0] : null;
    this.go(home || { route: this.home || { path: '/' } });
  }

  go(item: BreadcrumbsItem) {
    if (item.disabled) {
      return;
    }
    if (this.$attrs.onOpen instanceof Function) {
      this.$attrs.onOpen(item);
      return;
    }
    if (!(this as unknown as { $router: { push: (route: IRoute) => void } }).$router) {
      throw new Error('Router is undefined');
    }
    if (item.route) {
      (this as unknown as { $router: { push: (route: IRoute) => void } }).$router.push(item.route);
    }
  }

  getCollapsed(item: BreadcrumbsItem): Array<BreadcrumbsItem> {
    const result: Array<BreadcrumbsItem> = [item];
    let loop = true;
    let index = this.items.findIndex(i => i.uid === item.uid);
    while (loop) {
      index++;
      if (this.items[index].hidden) {
        result.push(this.items[index]);
      } else {
        loop = false;
      }
    }
    return result;
  }

  get visibleItems(): Array<BreadcrumbsItem> {
    const result: Array<BreadcrumbsItem> = [];
    const skip: Array<number> = [];
    this.items.forEach(item => {
      if (skip.includes(item.uid)) {
        return;
      }
      if (!item.hidden) {
        result.push(item);
      }
      if (item.hidden) {
        const collapsed = this.getCollapsed(item);
        this.collapsed[item.uid] = collapsed;
        result.push(collapsed[0]);
        skip.push(...collapsed.map(i => i.uid));
      }
    });
    return result;
  }

  get iconSize(): number {
    switch (this.size) {
      case 's':
        return 16;
      case 'm':
        return 20;
      case 'l':
        return 24;
    }
  }

  get mySize(): string {
    switch (this.size) {
      case 's':
        return 'x-small';
      case 'm':
        return 'small';
      case 'l':
        return 'large';
    }
  }
}
