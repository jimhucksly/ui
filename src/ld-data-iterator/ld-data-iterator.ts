import { mixins, Options, Prop, Watch } from 'vue-property-decorator';
import { Emit } from '@/decorators/emit.decorator';
import ViewportMixin from '@/mixins/viewport.mixins';
import { IIteratorRemovedItem, IIteratorSortField } from '@/types/iterator';
import { datetime } from '@/utils/datetime';
import IteratorItem from './iteratorItem';
import { translateXY } from './translate';

interface IRowContext {
  row: TListItem;
  /* индекс элемента в массиве rowContexts */
  rowIndex: number;
  /* индекс элемента в исходном (входящем) массиве items */
  index: number;
  offsetY: number;
  rowHeight?: number;
  isSelected?: boolean;
  isChecked?: boolean;
}

type TListItem = Record<string, unknown>;
type TRemovedItem = IIteratorRemovedItem<TListItem>;
type TSortField = IIteratorSortField;

enum ScrollTo {
  None,
  Page,
  ActiveRow,
  DoubleCheck,
}

/**
 * Итератор
 * @displayName ld-data-iterator
 */
@Options({
  name: 'IteratorVirtual',
  components: {
    IteratorItem,
  },
  emits: ['click', 'dblclick'],
})
export default class DataIteratorComponent extends mixins(ViewportMixin) {
  @Prop({ type: Array, default: (): Array<TListItem> => [] }) items: Array<TListItem>;
  @Prop() page: number;
  @Prop({ required: true }) keyProp: string;
  @Prop() sortField: TSortField;
  @Prop({ type: Function, default: (item: TListItem) => item }) entityFromItem: (item: TListItem) => TListItem;
  @Prop({ type: Array, default: (): Array<number> => [] }) selectedIndices: Array<number>;
  @Prop() firstItemSelectCounter: number;
  @Prop() nextItemSelectCounter: number;
  @Prop() minRowHeight: number;
  @Prop() rowHeight: number | 'auto' | null | undefined;
  @Prop() activeItem: TListItem;
  @Prop() fixTopActiveItem: boolean;
  @Prop() padding: number;
  @Prop({ default: 5 }) itemGap: number;
  @Prop({ default: false }) toLastPage: boolean;
  @Prop() scrollToActiveItem: boolean;
  @Prop() removedItem: TRemovedItem;

  static COUNTER = 0;
  static CNT = 0;

  clicks = 0;
  scrollbarV = true;
  innerWidth = 0;
  bodyHeight = 0;
  offsetY = 0;
  currentPage = 0;
  activeRowIndex = -1;
  oldRowCount = 0;
  rowContexts: Array<IRowContext> = [];
  visibleItems: Array<IRowContext> = [];
  afterEmptyItems: Array<IRowContext> = [];
  beforeEmptyItems: Array<IRowContext> = [];
  rowHeightsUpdate: Array<boolean> = [];
  lastRowOffsetY = 0;
  enabledPages: Array<boolean> = null;
  itemsWaitingHeight = new Set<number>();
  refreshCounter = 0;
  fixedTopContext: IRowContext = null;
  firstVisible = 0;
  lastVisible = 0;
  loading = false;
  scrollTo = ScrollTo.None;
  removingIndex = -1;
  changedItemsPromise = Promise.resolve();

  // non-reactive
  timerId: number;
  pageSize: number;
  rowsChanged: boolean;
  onScrollListener: (event: MouseEvent) => void;
  scrollDirty: boolean;
  fromPager: boolean;
  totalPages: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeObserver: any;
  updatePageTimeoutId: number;
  /* первый элемент для страницы, которая еще не рендерилась (поэтому он примерно посчитан, по средней высоте видимых элементов) */
  firstRowForPage: number | null;
  callOnPageChanged: boolean;
  onKeyDownHandler: (event: KeyboardEvent) => void;
  shouldSetActiveRow: boolean;
  checkRowsUpdatedTimer: number;
  waitForAllRowsUpdatedTimer: number;
  renderPromise: Promise<void>;
  renderResolve: () => void;
  waitingForFirstPageRendered: boolean;
  listEl: HTMLElement;
  stopTick: boolean;

  @Emit('loading-update') emitUpdateLoading(value: boolean) {
    return value;
  }

  @Emit('total-pages') emitUpdateTotalPages(value: number) {
    return value;
  }

  @Emit('page') emitUpdatePage(value: number) {
    return value;
  }

  @Emit('select') emitUpdateSelect(row: TListItem, index: number) {
    //
  }
  @Emit('click') emitClick(row: TListItem, index: number) {
    //
  }

  @Emit('dblclick') emitDblclick(row: TListItem, index: number) {
    //
  }

  @Watch('loading') loadingChanged() {
    this.emitUpdateLoading(this.loading);
  }

  @Watch('items', { deep: true }) async onItemsChanged(newVal: Array<TListItem>, oldVal: Array<TListItem>) {
    if (newVal === oldVal) {
      // дождемся обработки предыдущего изменения (т.к. удаление работает с задержкой на анимацию)
      await this.changedItemsPromise;
      let changeReason: 'added' | 'removed' | 'updated' = 'updated';
      if (newVal.length < this.oldRowCount) {
        changeReason = 'removed';
      } else if (newVal.length > this.oldRowCount) {
        changeReason = 'added';
      }
      if (changeReason === 'removed' && this.removedItem) {
        this.changedItemsPromise = this.removeItem();
        await this.changedItemsPromise;
        this.removingIndex = -1;
      }
      this.rowContexts.forEach((rc, i) => {
        if (newVal[rc.index]) {
          rc.row = newVal[rc.index];
        }
      });
      if (changeReason === 'added') {
        const diff = newVal.length - this.oldRowCount;
        for (let i = 0; i < diff; i++) {
          const rc = this.rowContexts[this.oldRowCount - 1 + i];
          this.rowContexts.push({
            index: this.oldRowCount + i,
            rowIndex: this.oldRowCount + i,
            offsetY: rc ? rc.offsetY + this.approximateRowHeight : 0,
            row: newVal[this.oldRowCount + i],
            rowHeight: this.approximateRowHeight,
          });
        }
        this.sort();
        this.updateRows(true);
      }
      this.oldRowCount = this.rowContexts.length;
      return;
    }
    this.visibleItems = [];
    this.rowContexts = [];
    if (newVal !== oldVal) {
      await this.$nextTick();
    }
    this.rowsChanged = true;
    this.init();
    this.sort();
    this.oldRowCount = this.rowContexts.length;
    this.offsetY = -1;
    this.currentPage = -1;
    this.totalPages = this.rowCount && this.page >= 0 ? this.page + 1 : 1;
    this.emitUpdateTotalPages(this.totalPages);
    this.listEl.scrollTop = 0;
    if (newVal !== oldVal) {
      this.listEl.style['visibility'] = 'hidden';
    }
    this.waitingForFirstPageRendered = true;
    DataIteratorComponent.CNT = 0;
    DataIteratorComponent.COUNTER = 0;
    if (!this.rowContexts.length) {
      this.renderPromise = Promise.resolve();
    } else {
      this.renderPromise = new Promise(resolve => {
        this.renderResolve = resolve;
      });
    }
    try {
      await this.renderPromise;
      if (!this.selectedIndices.length) {
        this.setSelected(0);
      }
    } finally {
      if (this.listEl) {
        this.listEl.style['visibility'] = 'unset';
      }
      this.waitingForFirstPageRendered = false;
      if (this.rowContexts.length) {
        this.onPageChanged();
      }
    }
  }

  @Watch('scrollHeight') onScrollHeightChanged() {
    this.calcTotalPages();
  }

  @Watch('fixTopActiveItem') async onFixTopActiveItemChanged() {
    if (!this.activeItem && !this.fixTopActiveItem) {
      return;
    }
    if (this.fixTopActiveItem) {
      this.fixedTopContext = this.excludeItem(this.activeItem);
    } else {
      this.includeItem(this.fixedTopContext);
      this.fixedTopContext = null;
    }
    await this.$nextTick();
    if (this.listEl) {
      const dims = this.listEl.getBoundingClientRect();
      this.innerWidth = Math.floor(dims.width);
      this.bodyHeight = dims.height;
    }
    this.updateRows(true);
    this.updatePage();
    await this.$nextTick();
    this.calcTotalPages();
  }

  @Watch('minRowHeight') onMinRowHeightChanged() {
    this.onItemsChanged(this.items, null);
  }

  @Watch('page') onPageChanged() {
    if (
      this.page === this.currentPage ||
      this.waitingForFirstPageRendered ||
      // eslint-disable-next-line no-undefined
      this.waitingForFirstPageRendered === undefined
    ) {
      return;
    }
    DataIteratorComponent.COUNTER = 0;
    if ((this.rowCount && !this.visibleItems.length) || !this.listEl) {
      this.callOnPageChanged = true;
      this.startCheckAllRowsIsRendered();
      return;
    }
    // установить offsetY начала страницы
    let offsetY = (this.page - 1) * this.bodyHeight;
    offsetY += 1;
    const pageDiff = Math.abs(this.currentPage - this.page);
    let first = this.getRowIndex(offsetY);
    this.firstRowForPage = first;
    this.scrollTo = ScrollTo.Page;
    const last = Math.min(first + this.visibleItems.length - 1, this.rowHeightsUpdate.length - 1);
    if (
      (pageDiff > 1 || (this.toLastPage && !this.scrollToActiveItem)) &&
      (!this.rowHeightsUpdate[first] || !this.rowHeightsUpdate[last])
    ) {
      this.loading = true;
      // найдем 1-й элемент по средней высоте элемента
      first = this.getRowIndexByAverage(offsetY);
      if (first >= this.items.length - 1) {
        first = this.items.length - 10;
      }
      this.firstRowForPage = first;
    }
    const rowContext = this.rowContexts[first];
    this.fromPager = true;
    if (this.scrollToActiveItem && this.currentPage < 0) {
      // для режима превью и первой загрузки списка перейдем к активному элементу (т.е., возможно, изменим страницу)
      this.scrollTo = ScrollTo.ActiveRow;
      this.firstRowForPage = null;
    }
    this.currentPage = this.page;
    if (rowContext) {
      this.listEl.scrollTop = rowContext.offsetY;
      if (this.shouldSetActiveRow) {
        this.shouldSetActiveRow = false;
        this.setSelected(first);
      }
    }
    this.startCheckAllRowsIsRendered();
  }

  @Watch('sortField') onSortFieldChanged(newVal: TSortField, oldVal: TSortField) {
    if (newVal?.prop !== oldVal?.prop || newVal?.direction !== oldVal?.direction) {
      this.sort();
      this.updateRows(true);
    }
  }

  @Watch('selectedIndices', { immediate: true }) onSelectedIndicesChanged() {
    if (Array.isArray(this.selectedIndices) && this.selectedIndices.length) {
      const index = this.selectedIndices[0];
      const i = this.rowContexts.findIndex(r => r.index === index);
      if (i >= 0) {
        this.activeRowIndex = i;
      }
    } else {
      this.activeRowIndex = -1;
    }
  }

  @Watch('firstItemSelectCounter') async onFirstItemSelectCounterChanged() {
    await this.renderPromise;
    this.setSelected(0);
  }

  @Watch('nextItemSelectCounter') onNextItemSelectCounterChanged() {
    if (this.activeRowIndex + 1 < this.rowContexts.length) {
      this.setSelected(this.activeRowIndex + 1);
    }
  }

  @Watch('innerWidth') async onInnerWidthChanged(newVal: number, oldVal: number) {
    if (!oldVal) {
      return;
    }
    this.updateRowOffsetsCache(0, true);
    this.updateRows(true);
    this.updatePage();
    await this.$nextTick();
    this.calcTotalPages();
  }

  created() {
    this.onItemsChanged(this.items, null);
  }

  mounted() {
    if (window.ResizeObserver) {
      this.resizeObserver = new window.ResizeObserver(entries => {
        if (entries.length && entries[0].contentRect) {
          this.bodyHeight = entries[0].contentRect.height;
          this.innerWidth = entries[0].contentRect.width;
        } else {
          this.bodyHeight = this.$el.clientHeight;
          this.innerWidth = this.$el.clientWidth;
        }
      });
      this.resizeObserver.observe(this.$el);
    }
    this.listEl = this.$el.querySelector('#iterator-list');
    const dims = this.listEl.getBoundingClientRect();
    this.innerWidth = Math.floor(dims.width);
    this.bodyHeight = dims.height;
    this.init();
    this.offsetY = 0;
    this.currentPage = -1;
    this.totalPages = 1;
    this.onKeyDownHandler = this.onKeyDown.bind(this);
    document.addEventListener('keydown', this.onKeyDownHandler);
    this.tick();
  }

  beforeUnmount() {
    this.stopTick = true;
    document.removeEventListener('keydown', this.onKeyDownHandler);
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.$el);
    }
  }

  tick(force: boolean = false) {
    if (this.stopTick) {
      return;
    }
    requestAnimationFrame(() => this.tick());
    this.loading = this.waitingForFirstPageRendered || Boolean(this.scrollTo !== ScrollTo.None);
    if (this.scrollbarV) {
      if (!this.listEl) {
        return;
      }
      const scrollTop = this.listEl.scrollTop;
      if (!force && this.offsetY === scrollTop) {
        return;
      }
      this.offsetY = scrollTop;
      clearTimeout(this.updatePageTimeoutId);
      if (this.scrollTo === ScrollTo.Page) {
        // чтобы был виден лоадер нужно вызвать через setTimeout
        setTimeout(() => this.updateRows(), 10);
      } else {
        this.updateRows();
      }
      this.updatePageTimeoutId = setTimeout(() => this.updatePage(), 100) as unknown as number;
    }
  }

  isItemActive(item: IRowContext): boolean {
    return item.row === this.activeItem;
  }

  isItemRemoving(rc: IRowContext): boolean {
    return rc.rowIndex === this.removingIndex;
  }

  onClick(rc: IRowContext) {
    this.clicks++;
    if (this.clicks === 1) {
      this.timerId = setTimeout(() => {
        this.emitClick(rc.row, rc.index);
        this.clicks = 0;
      }, 200) as unknown as number;
    } else {
      clearTimeout(this.timerId);
      this.emitDblclick(rc.row, rc.index);
      this.clicks = 0;
    }
    this.setSelected(rc.rowIndex);
  }

  onUpdateFixedTopHeight(height: number) {
    if (!this.fixedTopContext) {
      return;
    }
    this.fixedTopContext.rowHeight = height;
  }

  onUpdateItemHeight(rowContext: IRowContext, height: number) {
    try {
      height += this.itemGap;
      if (this.rowHeightsUpdate[rowContext.rowIndex] && rowContext.rowHeight === height) {
        return;
      }
      rowContext.rowHeight = height;
      this.itemsWaitingHeight.delete(rowContext.rowIndex);
      if (rowContext.rowIndex === 0) {
        rowContext.offsetY = 0;
      }
      clearTimeout(this.waitForAllRowsUpdatedTimer);
      this.waitForAllRowsUpdatedTimer = setTimeout(() => {
        if (this.itemsWaitingHeight.size && DataIteratorComponent.CNT < 50) {
          DataIteratorComponent.CNT++;
          return;
        }
        if (this.waitingForFirstPageRendered) {
          this.renderResolve();
        } else {
          this.startCheckAllRowsIsRendered();
        }
      }, 50) as unknown as number;
    } finally {
      this.rowHeightsUpdate[rowContext.rowIndex] = true;
      if (!this.itemsWaitingHeight.size) {
        this.updateRowOffsetsCache(this.firstVisible, true);
      }
    }
  }

  startCheckAllRowsIsRendered(timeout?: number) {
    this.stopCheckAllRowsIsRendered();
    this.checkRowsUpdatedTimer = setTimeout(() => this.checkRowsUpdated(), timeout ?? 50) as unknown as number;
  }

  stopCheckAllRowsIsRendered() {
    clearTimeout(this.checkRowsUpdatedTimer);
  }

  checkRowsUpdated() {
    if (this.itemsWaitingHeight.size || !this.listEl) {
      DataIteratorComponent.COUNTER++;
      if (DataIteratorComponent.COUNTER > 50) {
        this.itemsWaitingHeight.clear();
        this.updateRowOffsetsCache(0, true);
      }
      this.startCheckAllRowsIsRendered();
      return;
    }
    this.stopCheckAllRowsIsRendered();
    this.fromPager = false;
    if (this.callOnPageChanged) {
      // нужно дополнительно вызвать onPageChanged
      this.callOnPageChanged = false;
      this.$nextTick(() => this.onPageChanged());
      return;
    }
    if (this.scrollTo === ScrollTo.DoubleCheck) {
      let first = this.firstRowForPage ?? this.activeRowIndex;
      // eslint-disable-next-line no-undefined
      if (first === null || first === undefined || first < 0) {
        this.onSelectedIndicesChanged();
        first = this.activeRowIndex;
        this.setSelected(first);
      }
      if (first >= 0 && this.rowHeightsUpdate[first]) {
        const rc = this.rowContexts[first];
        const el = this.listEl;
        const bottom = el.scrollTop + this.bodyHeight;
        if (rc.offsetY >= el.scrollTop && (rc.offsetY + rc.rowHeight <= bottom || rc.rowHeight >= bottom)) {
          this.scrollTo = ScrollTo.None;
          this.firstRowForPage = null;
          this.updatePage();
          if (this.toLastPage && this.currentPage < this.totalPages && DataIteratorComponent.COUNTER < 10) {
            DataIteratorComponent.COUNTER++;
            this.scrollTo = ScrollTo.Page;
            this.firstRowForPage = this.rowCount - 5;
          }
        } else {
          el.scrollTop = rc.offsetY;
          this.scrollTo = ScrollTo.None;
        }
      } else {
        this.scrollTo = ScrollTo.None;
      }
    }
    if (this.scrollTo === ScrollTo.Page || this.scrollTo === ScrollTo.ActiveRow) {
      // переход на страницу, которая еще не рендерилась
      let first = this.firstRowForPage;
      if (this.scrollTo === ScrollTo.ActiveRow) {
        if (this.activeRowIndex < 0) {
          this.onSelectedIndicesChanged();
          this.setSelected(this.activeRowIndex);
        }
        first = this.activeRowIndex;
      }
      this.scrollTo = ScrollTo.DoubleCheck;
      if (first >= 0) {
        const rc = this.rowContexts[first];
        const el = this.listEl;
        el.scrollTop = rc?.offsetY ?? 0;
      }
    }
    if (this.scrollTo !== ScrollTo.None) {
      this.startCheckAllRowsIsRendered(100);
    }
  }

  updateRowOffsetsCache(rowIndex: number, all?: boolean) {
    let context = this.rowContexts[rowIndex];
    if (!context) {
      return;
    }
    let offsetY = context.offsetY;
    let height = 0;
    const last = all ? this.rowContexts.length : this.lastVisible + 1;
    while (context && rowIndex < last) {
      context.offsetY = offsetY;
      this.rowContexts[rowIndex] = context;
      height = context.rowHeight;
      offsetY += height;
      rowIndex++;
      context = this.rowContexts[rowIndex];
    }
    this.lastRowOffsetY = offsetY;
  }

  itemStyles(rowContext: IRowContext): Record<string, string> {
    const styles = {};
    if (rowContext.rowIndex === 0) {
      translateXY(styles, 0, 0);
      return styles;
    }
    if (rowContext.offsetY) {
      translateXY(styles, 0, rowContext.offsetY);
      return styles;
    }
    const posY = this.rowContexts[rowContext.rowIndex].offsetY;
    translateXY(styles, 0, posY);
    return styles;
  }

  topFixedStyles(): Record<string, string> {
    return {
      height: this.fixedTopContext?.rowHeight + 'px',
    };
  }

  emptyItemStyles(rowContext: IRowContext): Record<string, string> {
    const styles = {
      height: rowContext.rowHeight + 'px',
    };
    if (rowContext.offsetY) {
      translateXY(styles, 0, rowContext.offsetY);
    }
    return styles;
  }

  onKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (target.tagName !== 'BODY') {
      return;
    }
    if (['ArrowUp', 'PageUp', 'ArrowDown', 'PageDown'].includes(event.code)) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (['PageUp', 'PageDown'].includes(event.code)) {
      if (event.code === 'PageUp' && this.currentPage > 0) {
        this.shouldSetActiveRow = true;
        this.emitUpdatePage(this.currentPage - 1);
        return;
      }
      if (event.code === 'PageDown' && this.currentPage < this.totalPages) {
        this.shouldSetActiveRow = true;
        this.emitUpdatePage(this.currentPage + 1);
        return;
      }
    }
    let nextRowIndex = -1;
    const maxRowIndex = this.rowContexts[this.rowContexts.length - 1]?.rowIndex;
    switch (event.code) {
      case 'ArrowUp':
        if (this.activeRowIndex > 0) {
          nextRowIndex = this.activeRowIndex - 1;
        }
        break;
      case 'ArrowDown':
        if (this.activeRowIndex < this.rowContexts.length - 1) {
          nextRowIndex = this.activeRowIndex + 1;
        }
        break;
    }
    if (nextRowIndex < 0 || nextRowIndex > maxRowIndex) {
      return;
    }
    const { offsetY, rowHeight } = this.rowContexts[nextRowIndex];
    if (!rowHeight) {
      return;
    }
    let h = 0;
    let scrollTop = this.listEl.scrollTop;
    if (event.code === 'ArrowDown') {
      h = offsetY + rowHeight - (scrollTop + this.bodyHeight);
    } else if (event.code === 'ArrowUp') {
      h = offsetY - rowHeight - scrollTop;
    }
    if (h > 0 && event.code === 'ArrowDown') {
      scrollTop += h;
    } else if (h < 0 && event.code === 'ArrowUp') {
      scrollTop += h;
    } else if (h === 0 && event.code === 'ArrowUp' && [0, 1, 2].includes(this.activeRowIndex)) {
      scrollTop = h;
    }
    this.listEl.scrollTop = scrollTop;
    this.setSelected(nextRowIndex);
  }

  private calcTotalPages(): number {
    let totalPages = this.bodyHeight ? this.scrollHeight / this.bodyHeight : 1;
    const rounded = Math.floor(totalPages);
    const rest = totalPages - rounded;
    const averageHeight = this.getAverageItemHeight();
    if (rest >= averageHeight / this.scrollHeight) {
      totalPages = Math.ceil(totalPages);
    } else {
      totalPages = rounded;
    }
    if (this.totalPages !== totalPages) {
      this.totalPages = totalPages;
      this.emitUpdateTotalPages(totalPages);
    }
    if (!this.scrollToActiveItem && this.toLastPage && this.currentPage < this.totalPages) {
      // для перехода на последнюю страницу (для НЕ превью) изменим страницу
      this.emitUpdatePage(this.totalPages);
    }
    return totalPages;
  }

  private updatePage(): Promise<void> {
    if (this.fromPager || this.currentPage < 0 || this.firstRowForPage || this.callOnPageChanged) {
      return;
    }
    let offset;
    let realLastVisible = this.lastVisible;
    for (let i = this.lastVisible; i >= 0; i--) {
      const rowContext = this.rowContexts[i];
      if (!rowContext) {
        throw new Error('null rowContext');
      }
      if (this.offsetY + this.bodyHeight >= rowContext.offsetY) {
        realLastVisible = i;
        break;
      }
    }

    if (realLastVisible >= this.rowCount - 1 || this.scrollHeight - this.bodyHeight === this.offsetY) {
      offset = this.totalPages;
      this.emitUpdateTotalPages(this.totalPages);
    } else {
      const index = this.getRowIndex(this.offsetY);
      const height =
        this.rowContexts && this.rowContexts.length > index
          ? this.rowContexts[index]?.rowHeight
          : this.approximateRowHeight;
      offset = !index || height >= this.bodyHeight ? 1 : (this.offsetY + height * 2) / this.bodyHeight;
      if (offset < 1) {
        offset = 1;
      } else {
        offset = Math.ceil(offset);
      }
    }
    if (this.currentPage !== offset) {
      this.currentPage = offset;
      this.emitUpdatePage(offset);
    }
  }

  private init() {
    if (this.items?.length) {
      this.rowContexts = new Array<IRowContext>(this.items.length).fill(null);
      this.rowContexts.forEach((row, i) => {
        const offsetY = i === 0 ? 0 : this.rowContexts[i - 1].offsetY + this.approximateRowHeight;
        this.rowContexts[i] = {
          offsetY,
          row: this.items[i],
          rowIndex: i,
          index: i,
          rowHeight: this.approximateRowHeight,
        };
      });
      this.rowHeightsUpdate = new Array(this.rowCount);
    } else {
      this.rowContexts = [];
      this.rowHeightsUpdate = [];
    }
    this.itemsWaitingHeight.clear();
  }

  private async updateRows(force: boolean = false, afterRowsHeight: boolean = false): Promise<void> {
    const { first, last } = this.getIndexes();
    if (last < first) {
      return;
    }
    if (!force && !this.rowsChanged && this.firstVisible === first && this.lastVisible === last) {
      return;
    }
    this.rowsChanged = false;
    this.firstVisible = first;
    this.lastVisible = last;
    let rowIndex = first;
    let idx = 0;
    const temp: Array<IRowContext> = new Array(last - first);
    while (rowIndex <= last && rowIndex < this.rowCount) {
      const rc = this.rowContexts[rowIndex];
      if (rc) {
        temp[idx] = rc;
        idx++;
        if (!this.fixedRowHeight && !this.rowHeightsUpdate[rowIndex]) {
          this.itemsWaitingHeight.add(rowIndex);
        }
      }
      rowIndex++;
      if (rowIndex % 50 === 0) {
        await this.$nextTick();
      }
    }
    this.pageSize = temp.length - 1;
    this.visibleItems = temp;
  }

  private getIndexes(): { first: number; last: number } {
    let first = -1;
    let last = -1;
    if (!this.rowContexts.length) {
      return { first, last };
    }
    if (this.scrollbarV) {
      first = this.getRowIndex(this.offsetY);
      first = Math.max(first - 1, 0);
      while (first > 0) {
        if (!this.rowHeightsUpdate[first - 1]) {
          first--;
        } else {
          break;
        }
      }
      for (let i = first; i < this.rowContexts.length; i++) {
        const rowContext = this.rowContexts[i];
        if (!rowContext) {
          throw new Error('null');
        }
        if (last === -1 && this.offsetY + this.bodyHeight <= rowContext.offsetY) {
          last = i;
          break;
        }
      }
    }
    last = last > 0 ? last : this.rowContexts.length - 1;
    return { first, last };
  }

  private getRowIndexByAverage(offsetY: number): number {
    if (offsetY === 0 || !this.visibleItems.length) {
      return 0;
    }
    const averageHeight = this.getAverageItemHeight();
    return Math.floor(offsetY / averageHeight);
  }

  private getAverageItemHeight() {
    let h = 0;
    for (const rowContext of this.visibleItems) {
      h += rowContext.rowHeight;
    }
    return this.visibleItems.length ? h / this.visibleItems.length : 0;
  }

  private getRowIndex(offsetY: number): number {
    if (offsetY === 0) {
      return 0;
    }
    let n = Math.floor(offsetY / this.approximateRowHeight);
    n = n >= this.rowCount ? this.rowCount - 1 : n;
    let result = 0;
    const diff = 10;
    for (let i = n; i > 0; i--) {
      result = i;
      if (this.rowHeightsUpdate[i] && this.rowContexts[i].offsetY - diff <= offsetY) {
        return result;
      }
    }
    return 0;
  }

  private setSelected(rowIndex: number) {
    if (rowIndex >= 0) {
      const rc = this.rowContexts[rowIndex];
      if (rc) {
        this.emitUpdateSelect(rc.row, rc.index);
      }
    }
  }

  private sort() {
    if (!this.rowContexts?.length || !this.sortField || !this.entityFromItem) {
      return;
    }
    this.rowContexts.sort((a, b) => {
      try {
        const first = this.entityFromItem(a.row);
        const second = this.entityFromItem(b.row);
        if (first && second) {
          let result = 0;
          switch (this.sortField.type) {
            case 'date':
              if (
                !this.$utils.isDefined(first[this.sortField.prop]) ||
                !this.$utils.isDefined(second[this.sortField.prop])
              ) {
                result = -1;
              } else {
                result = datetime.compare(first[this.sortField.prop] as Date, second[this.sortField.prop] as Date);
              }
              break;
            case 'string':
              if (
                !this.$utils.isDefined(first[this.sortField.prop]) ||
                !this.$utils.isDefined(second[this.sortField.prop])
              ) {
                result = -1;
              } else {
                result = (first[this.sortField.prop] as string).localeCompare(second[this.sortField.prop] as string);
              }
              break;
            case 'number':
              if (
                !this.$utils.isDefined(first[this.sortField.prop]) ||
                !this.$utils.isDefined(second[this.sortField.prop])
              ) {
                result = -1;
              } else {
                result = first[this.sortField.prop] < second[this.sortField.prop] ? -1 : 1;
              }
              break;
          }
          return this.sortField.direction === 'asc' ? result : result * -1;
        }
        return 0;
      } catch (e) {
        /* eslint-disable no-console */
        console.error(e);
      }
    });
    this.rowContexts.forEach((rc, i) => {
      rc.rowIndex = i;
    });
    this.rowContexts[0].offsetY = 0;
    this.updateRowOffsetsCache(0, true);
  }

  id(item: TListItem) {
    const entity = this.entityFromItem(item);
    return entity ? entity[this.keyProp] : null;
  }

  removeItem(): Promise<void> {
    if (!this.removedItem) {
      return Promise.resolve();
    }
    const rc = this.rowContexts.find(r => r.index === this.removedItem.index);
    if (!rc) {
      return;
    }
    this.removingIndex = rc.rowIndex;
    return new Promise<void>(resolve => {
      // setTimeout позволяет анимировать удаление элемента
      setTimeout(() => {
        if (rc) {
          this.rowContexts.splice(rc.rowIndex, 1);
        }
        for (const rc1 of this.rowContexts) {
          if (rc1.rowIndex >= rc.rowIndex) {
            rc1.rowIndex--;
          }
          if (rc1.index > this.removedItem.index) {
            rc1.index--;
          }
        }
        const start = rc.rowIndex - 1 >= 0 ? rc.rowIndex - 1 : 0;
        if (start === 0 && this.rowContexts.length) {
          this.rowContexts[0].offsetY = 0;
        }
        this.updateRowOffsetsCache(start, true);
        this.updateRows(true);
        resolve();
      }, 500);
    });
  }

  private excludeItem(item: TListItem): IRowContext {
    const index = this.rowContexts.findIndex(c => c.row === item);
    if (index) {
      const rowContext = this.rowContexts[index];
      this.rowContexts.splice(index, 1);
      return rowContext;
    }
    return null;
  }

  private includeItem(rowContext: IRowContext): void {
    if (!rowContext) {
      return;
    }
    this.rowContexts.splice(rowContext.rowIndex, 0, rowContext);
  }

  get listStyles(): Record<string, string> {
    return {
      'padding-left': this.padding + 'px',
      'padding-right': this.padding + 'px',
    };
  }

  get rowCount(): number {
    return this.rowContexts?.length ?? 0;
  }

  get approximateRowHeight(): number {
    if (this.fixedRowHeight) {
      return (this.rowHeight as number) + this.itemGap;
    }
    return this.minRowHeight ?? 50;
  }

  get fixedRowHeight(): boolean {
    return typeof this.rowHeight === 'number';
  }

  get scrollHeight(): number {
    if (!this.bodyHeight) {
      // вызов нужен для того, чтобы при изменении bodyHeight пересчитался scrollHeight
      return 0;
    }
    let result = 0;
    if (this.scrollbarV && this.rowCount) {
      if (this.fixedRowHeight && typeof this.rowHeight === 'number') {
        const height = this.rowHeight;
        result = height * this.rowCount;
      } else if (Array.isArray(this.rowContexts) && this.rowContexts.length) {
        const rowContext = this.rowContexts[this.rowCount - 1];
        result = rowContext?.offsetY + rowContext?.rowHeight;
        result = Math.max(result, this.lastRowOffsetY - this.itemGap);
      }
    }
    if (!result) {
      result = this.approximateRowHeight * this.rowCount;
    }
    return result;
  }

  get scrollerStyles(): Record<string, string> {
    return {
      height: (this.scrollHeight || this.approximateRowHeight * this.rowCount) + 'px',
      width: '100%',
    };
  }
}
