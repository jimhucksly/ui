import { mixins, Prop, Watch } from 'vue-property-decorator';
import { Emit } from '@/decorators/emit.decorator';
import ViewportMixin from '@/mixins/viewport.mixins';
import { IPage, IPagerOptions } from '@/types/pager';

type TOptions = IPagerOptions;

/**
 * @displayName ld-pager
 */
export default class PagerComponent extends mixins(ViewportMixin) {
  @Prop() options: TOptions;
  /* переход на первую страницу разрешен */
  @Prop({ type: Boolean, default: true }) toFirst: boolean;
  /* переход на последнюю страницу разрешен */
  @Prop({ type: Boolean, default: true }) toLast: boolean;
  /* номер последней страницы неизвестен (пока) */
  @Prop({ default: false }) lastPageUnknown: boolean;
  /* массив номеров страниц, на которые возможен переход */
  @Prop() enabledPages: Array<boolean>;
  @Prop({ type: Boolean, default: false }) unlimited: boolean;
  @Prop({ type: Array, default: () => [10, 20, 30, 40, 50, 75, 100] }) sizes: Array<number>;
  @Prop({ type: Boolean, default: true }) showTotal: boolean;
  @Prop({ type: Boolean, default: true }) showSelectCounter: boolean;
  @Prop({ type: Boolean, default: false }) showPage: boolean;
  @Prop({ type: Boolean, default: false }) rounded: boolean;
  @Prop({ type: Boolean, default: false }) fluid: boolean;
  @Prop({ type: String, default: '' }) prevText: string;
  @Prop({ type: String, default: '' }) nextText: string;

  pages: Array<IPage> = [];
  page = 1;
  count = 0;
  size = 0;
  from = 1;
  to = 10;

  @Emit('change') emitChange(value: { page: number; size: number; toLast?: boolean }) {
    return value;
  }

  @Watch('lastPageUnknown') onLastPageUnknownChanged() {
    this.pages = this.calcPages();
  }

  @Watch('options', { immediate: true, deep: true }) onOptionsChanged() {
    let calc = false;
    if (this.unlimited) {
      this.size = this.options.pageSize ? this.options.pageSize : this.sizes[0];
      this.page = this.options.page ? this.options.page : 1;
      return;
    }
    if (this.count !== this.options.total) {
      this.count = this.options.total;
      calc = true;
    }
    if (this.size !== this.options.pageSize) {
      this.size = this.options.pageSize ? this.options.pageSize : this.sizes[0];
      calc = true;
    }
    if (this.page !== this.options.page) {
      if (this.options.page >= this.totalPages + 1) {
        this.page = this.totalPages;
      } else {
        this.page = this.options.page ? this.options.page : 1;
        calc = true;
      }
    }
    if (calc) {
      this.pages = this.calcPages();
    }
  }

  updateToFrom(page: number) {
    const current = this.pages.find(p => p.number === page);
    if (!current) {
      this.from = 0;
      this.to = 0;
      return;
    }
    this.from = (current.number - 1) * this.size;
    this.from = this.from ? this.from + 1 : 1;
    this.to = this.from + this.size - 1;
    this.to = this.to < this.count ? this.to : this.count;
    if (!this.to) {
      this.from = 0;
    }
  }

  prevPage() {
    if (this.canPrevious) {
      this.selectPage(this.page - 1);
    }
  }

  nextPage() {
    if (this.canNext) {
      this.selectPage(this.page + 1);
    }
  }

  onPageSizeChange(size: number) {
    setTimeout(() => this.emitChange({ page: this.page, size }), 100);
  }

  selectPage(page: number) {
    if (this.pageDisabled(page)) {
      return;
    }
    if (this.unlimited) {
      this.emitChange({ page, size: this.size });
      return;
    }
    if (page > 0 && page <= this.totalPages && page !== this.page) {
      this.page = page;
      this.pages = this.calcPages(page);
      this.updateToFrom(page);
      this.emitChange({ page, size: this.size });
    }
  }

  calcPages(page?: number): Array<IPage> {
    const pages = [];
    let startPage = 1;
    const pagesCount = this.totalPages;
    let endPage = pagesCount;
    const maxSize = 5;
    const isMaxSized = maxSize < this.totalPages;

    page = page || this.page;

    if (isMaxSized) {
      startPage = page - Math.floor(maxSize / 2);
      endPage = page + Math.floor(maxSize / 2);

      if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(startPage + maxSize - 1, pagesCount);
      } else if (endPage > pagesCount) {
        startPage = Math.max(pagesCount - maxSize + 1, 1);
        endPage = pagesCount;
      }
    }

    for (let num = startPage; num <= endPage; num++) {
      pages.push({
        number: num,
        text: num.toString(),
      });
    }
    if (this.lastPageUnknown) {
      pages.push({
        number: endPage + 1,
        text: '...',
      });
    }
    return pages;
  }

  pageDisabled(page: number): boolean {
    if (Array.isArray(this.enabledPages) && this.enabledPages.length) {
      return !this.enabledPages[page - 1];
    }
  }

  onChange(value: number) {
    this.emitChange({
      page: this.page,
      size: value,
    });
  }

  get totalPages(): number {
    const count = this.size < 1 || this.size === 0 ? 1 : Math.ceil(this.count / this.size);
    return Math.max(count || 0, 1);
  }

  get canPrevious(): boolean {
    return this.page > 1;
  }

  get canNext(): boolean {
    if (this.unlimited) {
      return true;
    }
    return this.page < this.totalPages;
  }

  get canLast(): boolean {
    if (Array.isArray(this.enabledPages) && this.enabledPages.length >= this.totalPages) {
      return this.enabledPages[this.totalPages] && this.page < this.totalPages;
    }
    return this.page < this.totalPages;
  }

  get showFromTo() {
    return !this.isMobileGlobal;
  }

  get showOnlyTotal() {
    return !this.isMobileGlobal && this.count;
  }

  get first(): number {
    return this.from;
  }

  get last(): number {
    return this.to;
  }
}
