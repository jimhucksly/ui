import { eventBus, isDefined, uniqueID } from '@dn-web/core';
import { mixins, Options } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import Icon from '@/components/icon/icon.vue';
import { Emit } from '@/decorators/emit.decorator';
import ViewportMixin from '@/mixins/viewport.mixins';
import UnitService from '@/services/unit.service';
import { IHostObject, IModalInfo, IModalResult, IModalWindow, IOptions, IViewModel } from '@/types/dialogs';
import { getScrollbarWidth } from '@/utils/scrollbarWidth';
import { DialogListeners } from './dialog.listeners';
import { DialogManager, ModalType } from './dialog.manager';
import DialogMinimizedComponent from './dialog.minimized.vue';
import { ConfirmDialog } from './dialogs';

enum ModalCancelReason {
  /* по нажатию иконка Крестик */
  FromCloseButton = 'close',
  /* по нажатию кнопки Ok */
  FromOkButton = 'ok',
  /* по нажатию кнопки Отмена или Назад (для вложенных модалок) */
  FromCancelButton = 'cancel',
  /* по нажатию иконка Стрелочка (для вложенных модалок) */
  FromBackButton = 'back',
  /* по нажатию клавиши Enter */
  FromEnterKeyPress = 'enter',
  /* по нажатию клавиши Escape */
  FromEscapeKeyPress = 'escape',
}

type Options = IOptions;

/**
 * Dialogs
 * @displayName b-dialog
 */
@Options({
  components: {
    minimized: DialogMinimizedComponent,
    'svg-icon': Icon,
  },
})
export default class DialogComponent extends mixins(ViewportMixin) {
  @Prop({ type: String, default: '' }) id: string;
  @Prop({ type: Object, default: () => ({ identicalDialogsAllowed: true }) }) options: Options;

  readonly messageDetailSeparator = 'Message detail: ';

  modals: Array<IModalWindow> = [];

  unloadPromises: Map<number | string, Promise<void>> = new Map();
  unloadPromisesResolve: Map<number | string, () => void> = new Map();

  resizingModalId: IModalWindow['id'] = null;

  scrollbarWidth = 0;

  onResizeHandler: () => void = null;

  @Emit('modal-in-focus') emitFocus(value: boolean) {
    return value;
  }

  @Watch('modals', { deep: true }) onModalsChanged() {
    const hasModals = this.modals.some(m => !m.minimized && !m.noModal);
    this.emitFocus(hasModals);
  }

  created() {
    this.onResizeHandler = this.onResize.bind(this);
    window.addEventListener('resize', this.onResizeHandler);
  }

  mounted() {
    const style = window.getComputedStyle(document.body);
    const gap = UnitService.unitToNumber(style?.getPropertyValue('--modal-window-gap') ?? 24);
    this.dialogManager.setProps({ gap });
    this.$nextTick(() => {
      eventBus.$on('dialog:open' + this.id, this.open);
      eventBus.$on('dialog:props' + this.id, this.onSetProps);
      eventBus.$on('dialog:close:all' + this.id, this.closeAll);
      eventBus.$on('dialog:maximized' + this.id, this.onMaximize);
      this.scrollbarWidth = getScrollbarWidth();
    });
  }

  beforeUnmount() {
    eventBus.$off('dialog:open' + this.id, this.open);
    eventBus.$off('dialog:props' + this.id, this.onSetProps);
    eventBus.$off('dialog:close:all' + this.id, this.closeAll);
    eventBus.$off('dialog:maximized' + this.id, this.onMaximize);
    window.removeEventListener('resize', this.onResizeHandler);
  }

  onResize() {
    for (const modal of this.modals) {
      if (modal.show) {
        this.stylingModal(modal);
      }
    }
  }

  async open(modalInfo: IModalInfo) {
    if (!modalInfo.hostObject) {
      modalInfo.hostObject = {
        contentType: null,
        id: uniqueID(4, '0-9') as number,
        kind: null,
      };
    }
    if (!this.dialogManager.tryToOpen(modalInfo.hostObject)) {
      return;
    }

    const found = this.findModal(modalInfo.hostObject);
    if (found) {
      this.dialogManager.activate(found);
      return;
    }

    if (!this.isAlertDialog(modalInfo) && !this.isConfirmDialog(modalInfo)) {
      this.dialogManager.setParentDialog(modalInfo);
      if (modalInfo.hostObject.parentId && !['left', 'right'].includes(modalInfo.align)) {
        this.dialogManager.hideDialog({ id: modalInfo.hostObject.parentId });
      }
    }
    const modal: IModalWindow = {
      id: modalInfo.hostObject.id,
      component: modalInfo.component,
      componentProps: modalInfo.componentProps,
      hostObject: modalInfo.hostObject,
      pressEnterAsOk: modalInfo.pressEnterAsOk,
      pressEscAsCancel: modalInfo.pressEscAsCancel,
      loading: modalInfo.loading,
      noModal: modalInfo.noModal,
      type: modalInfo.type,
      title: modalInfo.title,
      content: modalInfo.content,
      resolveFunction: modalInfo.resolveFunction,
      okTitle: modalInfo.okTitle,
      cancelTitle: modalInfo.cancelTitle,
      okColor: modalInfo.okColor,
      cancelColor: modalInfo.cancelColor,
      okResult: modalInfo.okResult,
      cancelResult: modalInfo.cancelResult,
      okOnly: modalInfo.type === ModalType.Alert || modalInfo.type === ModalType.Info,
      show: true,
      visible: true,
      okLoading: false,
      okDisabled: modalInfo.type === ModalType.Select,
      selectAsOk: modalInfo.selectAsOk,
      hideFooter: isDefined(modalInfo.hideFooter)
        ? modalInfo.hideFooter
        : isDefined(modalInfo.selectAsOk)
          ? modalInfo.selectAsOk
          : false,
      resolved: false,
      width: modalInfo.width,
      height: modalInfo.height,
      fullHeight: modalInfo.fullHeight,
      align: modalInfo.align,
      size: modalInfo.size,
      css: modalInfo.css,
      scrim: false,
      closable: isDefined(modalInfo.closable) ? modalInfo.closable : true,
      expandable: modalInfo.expandable,
      minimizable: modalInfo.minimizable,
      minimized: false,
      expandedSize: modalInfo.expandedSize,
      collapsedSize: modalInfo.collapsedSize,
      isChanged: modalInfo.isChanged,
      /**
       * не дает диалогу автоматом устанавливать фокус на первом focusable элементе (при срабатывании focusin)
       * т.к. это причина зависания страницы, если одновременно несколько диалогов на экране
       */
      retainFocus: false,
      help: modalInfo.help,
      scrollbar: 0,
      resizeObserver: null,
    };
    if (modal.expandable) {
      modal.expanded = modalInfo.expanded;
      if (modal.expanded && modal.expandedSize) {
        modal.noModal = modal.expandedSize.noModal;
        modal.width = modal.expandedSize.size ? this.getWidthBySize(modal.expandedSize.size) : modal.expandedSize.width;
      }
      if (!modal.expanded && modal.collapsedSize) {
        modal.noModal = modal.collapsedSize.noModal;
        modal.width = modal.collapsedSize.size
          ? this.getWidthBySize(modal.collapsedSize.size)
          : modal.collapsedSize.width;
      }
      if (!isDefined(modal.noModal)) {
        modal.noModal = !modal.expanded;
      }
      if (!modal.noModal) {
        modal.expanded = true;
      }
      if (modal.expanded) {
        modal.noModal = false;
      }
    }
    const promises = Array.from(this.unloadPromises.values());
    await Promise.all(promises);
    modal.scrim = true;
    this.dialogManager.dialogCreate(modal);
    this.modals.push(modal);
    const checkDialogExist = setInterval(() => {
      const el = document.querySelector(`.${this.dialogManager.uniqKey(modal)}`);
      if (el) {
        clearInterval(checkDialogExist);
        const listenerHandler = (e: KeyboardEvent) => {
          if (!this.dialogListeners.isLast(modal)) {
            return;
          }
          if (e.key === 'Enter') {
            if (!modal.pressEnterAsOk) {
              return;
            }
            if (e.shiftKey) {
              return;
            }
            this.handleCancel(modal, ModalCancelReason.FromEnterKeyPress);
          }
          if (e.key === 'Escape') {
            if (!modal.pressEscAsCancel) {
              return;
            }
            this.handleCancel(modal, ModalCancelReason.FromEscapeKeyPress);
          }
        };
        if (modal.pressEnterAsOk || modal.pressEscAsCancel) {
          this.dialogListeners.set(modal, listenerHandler.bind(this));
        }
        modal.el = el as HTMLElement;
        if (this.isConfirmDialog(modal)) {
          const btnOk: HTMLElement = modal.el.querySelector(`#b-dialog-btn-ok-${modal.id}`);
          if (btnOk) {
            btnOk.focus();
          }
        }

        this.dialogManager.dialogCreated(modal);
        eventBus.$emit('dialog:created' + this.id, modal.hostObject);

        modal.resizeObserver = new ResizeObserver(entries => {
          if (!entries?.[0]) {
            return;
          }
          const entry = entries?.[0].target as HTMLElement;
          const i = this.findModalIndex(modal);
          if (i > -1) {
            this.modals[i].scrollbar = entry.scrollHeight > entry.clientHeight ? 1 : 0;
          }
        });

        const text = modal.el.querySelector('.v-card-text[data-role="modal-text"]');
        modal.resizeObserver.observe(text);
      }
    }, 100);
  }

  modalClass(modal: IModalWindow): Array<string> {
    const result: Array<string> = [`${this.dialogManager.uniqKey(modal)}`, `${ModalType[modal.type]}`];
    if (this.id) {
      result.push(`${ModalType[modal.type]}-${this.id}`);
    }
    if (modal.noModal) {
      result.push('b-dialog--no-modal');
    }
    if (modal.noModal || !modal.visible) {
      result.push('b-dialog-content--hidden');
    }
    if (!modal.content && (this.isAlertDialog(modal) || this.isConfirmDialog(modal))) {
      result.push('b-dialog-content--without-content');
    }
    if (modal.css) {
      result.push(modal.css);
    }
    if (this.isMobileGlobal) {
      result.push('b-dialog-content--mobile');
    }
    return result;
  }

  modalType(modal: IModalWindow): string {
    return `${ModalType[modal.type]}`;
  }

  dialogClass(modal: IModalWindow): Array<string> {
    const result: Array<string> = [this.modalType(modal)];
    if (this.id) {
      result.push(this.modalType(modal) + `-${this.id}`);
    }
    if (modal.align) {
      result.push('v-dialog--align-' + modal.align);
    }
    return result;
  }

  modalWidth(modal: IModalWindow): number | string {
    this.$nextTick(() => {
      this.stylingModal(modal);
      this.alignButtons(modal);
    });
    return this.defaultWidth(modal);
  }

  stylingModal(modal: IModalWindow) {
    if (modal.minimized) {
      return;
    }
    if (!modal.el) {
      modal.el = document.querySelector(`.${this.dialogManager.uniqKey(modal)}`);
    }
    if (!modal.el) {
      return;
    }

    const LIMIT_HEIGHT = 600;
    const viewportH = this.viewport().h;

    let topGap = Math.floor(viewportH * 0.1);
    while (topGap % 4 > 0) {
      topGap++;
    }

    const getWidth = () => {
      if (this.isMobileGlobal) {
        return '100%';
      }
      let w = modal.width || this.defaultWidth(modal);
      if (modal.expandable) {
        if (modal.expanded) {
          w = modal.expandedSize?.size ? this.getWidthBySize(modal.expandedSize?.size) : modal.expandedSize?.width || w;
        } else {
          w = modal.collapsedSize?.size
            ? this.getWidthBySize(modal.collapsedSize?.size)
            : modal.collapsedSize?.width || w;
        }
      }
      return UnitService.convertToUnit(w);
    };

    modal.width = getWidth();
    modal.el.style.width = modal.width;

    const getHeight = () => {
      if (modal.fullHeight) {
        return '100%';
      }
      let h = modal.height || 'auto';
      if (modal.expandable) {
        if (modal.expanded) {
          h = modal.expandedSize?.height || h;
        } else {
          h = modal.collapsedSize?.height || h;
        }
      }
      return UnitService.convertToUnit(h);
    };

    modal.el.style.height = getHeight();

    const getMaxHeight = () => {
      if (modal.align === 'left' || modal.align === 'right') {
        return '100%';
      }
      if (this.isMobileGlobal) {
        return '100%';
      }
      if (modal.fullHeight) {
        return '100%';
      }
      if (viewportH >= LIMIT_HEIGHT) {
        return `calc(100% - ${this.modalWindowGap})`;
      }
      return 'unset';
    };

    modal.el.style.maxHeight = getMaxHeight();

    const getPaddingTop = () => {
      if (modal.align === 'left' || modal.align === 'right') {
        return '0';
      }
      if (modal.noModal) {
        return '0';
      }
      if (modal.fullHeight) {
        return UnitService.convertToUnit(topGap);
      }
      if (this.isMobileGlobal) {
        return this.modalWindowGap;
      }
      if (this.isAlertDialog(modal) || this.isConfirmDialog(modal)) {
        return '0';
      }
      if (modal.expandable) {
        return UnitService.convertToUnit(topGap);
      }
      return viewportH >= LIMIT_HEIGHT ? UnitService.convertToUnit(topGap) : 'unset';
    };

    modal.el.style.paddingTop = getPaddingTop();

    const getPaddingBottom = () => {
      if (modal.align === 'left' || modal.align === 'right') {
        return '0';
      }
      if (modal.noModal) {
        return '0';
      }
      if (modal.fullHeight) {
        return this.modalWindowGap;
      }
      return viewportH >= LIMIT_HEIGHT ? 'unset' : this.modalWindowGap;
    };

    modal.el.style.paddingBottom = getPaddingBottom();

    const getMargin = () => {
      if (modal.align === 'left' || modal.align === 'right') {
        return '0';
      }
      if (modal.fullHeight) {
        return '0';
      }
      if (modal.noModal) {
        return '0';
      }
      return `0 ${this.modalWindowGap} 0 ${this.modalWindowGap}`;
    };

    modal.el.style.margin = getMargin();
  }

  alignButtons(modal: IModalWindow) {
    if (modal.minimized) {
      return;
    }
    if (!modal.el) {
      modal.el = document.querySelector(`.${this.dialogManager.uniqKey(modal)}`);
    }
    const actions: HTMLElement = modal.el.querySelector('.v-card-actions[data-role="modal-actions"]');
    if (actions) {
      const buttons = modal.el.querySelectorAll('.v-card-actions > button');
      const arr = Array.from(buttons);
      const max = Math.max(...arr.map((b: HTMLElement) => b.clientWidth));
      for (const b of arr) {
        (b as HTMLElement).style.minWidth = UnitService.convertToUnit(max);
      }
    }
  }

  modalTitle(modal: IModalWindow): string {
    if (modal.description instanceof Function) {
      return modal.description();
    }
    return modal.description || modal.title;
  }

  // handleHide(modal: IModalWindow) {
  //   if (!modal.resolved) {
  //     this.handleOk(modal);
  //   }
  // }

  async handleOk(modal: IModalWindow): Promise<boolean> {
    modal = this.findModal(modal.hostObject);
    if (!modal) {
      return;
    }
    if (modal.okDisabled) {
      return;
    }
    let canUnload = true;
    switch (modal.type) {
      case ModalType.Confirm:
        modal.okResult = modal.okResult ? modal.okResult : true;
        break;
      case ModalType.Prompt:
        modal.okResult = modal.content;
        break;
      case ModalType.CreateEdit:
        if (!modal.settedResult && modal.componentInstance && modal.componentInstance.save) {
          modal.okLoading = true;
          let resultSave = modal.componentInstance.save.call(modal.componentInstance);
          if (resultSave instanceof Promise) {
            try {
              resultSave = await resultSave;
              if (resultSave) {
                modal.okResult = resultSave;
                modal.settedResult = true;
              } else {
                canUnload = false;
              }
            } catch (e) {
              /* eslint-disable no-console */
              console.error(e);
              canUnload = false;
            } finally {
              modal.okLoading = false;
            }
          }
          modal.okLoading = false;
          if (!resultSave) {
            canUnload = false;
          }
          modal.okResult = resultSave;
        }
        break;
    }
    let okResult = modal.okResult;
    if (modal.type !== ModalType.Select && modal.type !== ModalType.CreateEdit) {
      okResult = isDefined(modal.okResult) ? modal.okResult : okResult;
    }
    modal.okResult = okResult;
    return canUnload;
  }

  async handleCancel(
    modal: IModalWindow,
    /* кнопка, которая вызывала данное событие - крестик, кнопка Назад, кнопка Отмена */
    cancelReason: ModalCancelReason = ModalCancelReason.FromCloseButton
  ) {
    modal = this.findModal(modal.hostObject);
    if (!modal) {
      return;
    }

    const fromOkButtonReason = cancelReason === ModalCancelReason.FromOkButton;
    const fromCloseButtonReason = cancelReason === ModalCancelReason.FromCloseButton;
    const fromCancelButtonReason = cancelReason === ModalCancelReason.FromCancelButton;
    const fromBackButtonReason = cancelReason === ModalCancelReason.FromBackButton;
    const fromEnterKeyPressReason = cancelReason === ModalCancelReason.FromEnterKeyPress;
    const fromEscapeKeyPressReason = cancelReason === ModalCancelReason.FromEscapeKeyPress;

    const isSuccessReason = fromOkButtonReason || fromEnterKeyPressReason;

    try {
      let canUnload = true;
      switch (true) {
        case fromOkButtonReason || fromEnterKeyPressReason:
          canUnload = await this.handleOk(modal);
          break;
        case fromCloseButtonReason:
          canUnload = await this.askCanUnload(modal, cancelReason);
          break;
        default:
          if (
            modal.componentInstance &&
            modal.componentInstance.isChanged &&
            modal.componentInstance.isChanged instanceof Function
          ) {
            const isChanged = modal.componentInstance.isChanged.call(modal.componentInstance);
            if (isChanged) {
              canUnload = await this.askCanUnload(modal, cancelReason);
            }
          }
      }
      if (!canUnload) {
        return;
      }

      if (this.hasParent(modal)) {
        if (fromCloseButtonReason || fromCancelButtonReason) {
          const parents = this.dialogManager.getParents(modal);
          for (const m of parents) {
            this.closeModal(m);
          }
        }
        if (fromOkButtonReason || fromEscapeKeyPressReason || fromBackButtonReason) {
          this.dialogManager.showDialog({ id: modal.hostObject.parentId });
        }
      }

      this.remove(modal);

      if (isDefined(modal.okResult) && isSuccessReason) {
        return modal.resolveFunction(modal.okResult);
      }

      if (isDefined(modal.cancelResult) && fromCancelButtonReason) {
        return modal.resolveFunction(modal.cancelResult);
      }

      modal.resolveFunction(this.isSelectDialog(modal) || this.isCreateEditDialog(modal) ? null : false);
    } finally {
      if (!modal.show) {
        modal.okResult = null;
        modal.cancelResult = null;
        this.dialogListeners.remove(modal);
        eventBus.$emit('modal-cancel' + this.id);
      }
    }
  }

  async handleCancelAll() {
    const confirm = await DialogManager.id(this.id ? this.id : '').exec(
      new ConfirmDialog({
        title: this.$i18n.gettext('Dialog Close All Confirm Title'),
        content: this.$i18n.gettext('Dialog Close All Confirm Text'),
      })
    );
    if (!confirm) {
      return;
    }
    this.closeAll(true);
  }

  onSetProps(props: Record<string, unknown>, host: IHostObject) {
    const found = this.findModal(host);
    if (found) {
      found.componentProps = {
        ...found.componentProps,
        ...props,
      };
      found.loading = false;
    }
  }

  onSetResult(modal: IModalWindow, result: IModalResult<IViewModel<string | number>>): void {
    setTimeout(() => {
      modal.okLoading = false;
      modal.okResult = result;
      modal.settedResult = true;
      if (result) {
        if (modal.selectAsOk || this.isCreateEditDialog(modal)) {
          modal.okDisabled = false;
          return this.handleCancel(modal, ModalCancelReason.FromOkButton);
        }
        if (Array.isArray(result)) {
          modal.okDisabled = result.length === 0;
        } else {
          modal.okDisabled = false;
        }
      } else {
        modal.okDisabled = true;
      }
    }, 1);
  }

  onSetResultAndClose(modal: IModalWindow, result: IModalResult<IViewModel<string | number>>): void {
    setTimeout(() => {
      modal.okResult = result;
      modal.settedResult = true;
      if (result) {
        modal.okDisabled = false;
        return this.handleCancel(modal, ModalCancelReason.FromOkButton);
      }
    }, 1);
  }

  onExpandCollapse(modal: IModalWindow) {
    this.resizingModalId = modal.id;
    this.$nextTick(() => {
      modal.expanded = !modal.expanded;
      modal.noModal = !modal.expanded;
      this.$nextTick(() => {
        this.dialogManager.dialogModalChanged(modal);
        setTimeout(() => {
          this.resizingModalId = null;
        }, 400);
      });
    });
  }

  onMaximize(modal: IModalWindow) {
    // this.$nextTick(() => {
    //   this.stylingModal(modal);
    //   this.alignButtons(modal);
    // });
  }

  onMinimize(modal: IModalWindow) {
    modal.minimized = !modal.minimized;
    this.dialogManager.dialogMinimizeChanged(modal);
    eventBus.$emit('on-minimize' + this.id, modal.minimized);
  }

  onActivate(modal: IModalWindow) {
    modal.processingDescription = null;
    this.dialogManager.activate(modal);
  }

  onProcessing(modal: IModalWindow, message?: string) {
    if (message) {
      modal.processingDescription = message;
    }
    this.dialogManager.dialogProcessing(modal);
  }

  onHelp(modal: IModalWindow) {
    if (modal.componentInstance && modal.componentInstance.onHelp) {
      modal.componentInstance.onHelp();
    }
  }

  remove(modal: IModalWindow) {
    modal.resolved = true;
    modal.show = false;
    this.unloadPromises.set(
      modal.hostObject.id,
      new Promise(resolve => {
        this.unloadPromisesResolve.set(modal.hostObject.id, resolve);
      })
    );
  }

  dialogEnter(modal: IModalWindow) {
    //
  }

  dialogLeave(modal: IModalWindow) {
    const text = modal.el.querySelector('.v-card-text[data-role="modal-text"]');
    modal.resizeObserver.unobserve(text);
    const i = this.findModalIndex(modal);
    if (i > -1) {
      const id = modal.hostObject.id;
      this.modals.splice(i, 1);
      this.dialogManager.dialogClosed(modal);
      if (this.unloadPromisesResolve.has(id)) {
        const func = this.unloadPromisesResolve.get(id);
        func();
        this.unloadPromises.delete(id);
      }
    }
  }

  isAlertDialog(modal: IModalWindow | IModalInfo): boolean {
    return modal.type === ModalType.Alert;
  }

  isPromptDialog(modal: IModalWindow | IModalInfo): boolean {
    return modal.type === ModalType.Prompt;
  }

  isConfirmDialog(modal: IModalWindow | IModalInfo): boolean {
    return modal.type === ModalType.Confirm;
  }

  isInfoDialog(modal: IModalWindow | IModalInfo): boolean {
    return modal.type === ModalType.Info;
  }

  isSelectDialog(modal: IModalWindow | IModalInfo): boolean {
    return modal.type === ModalType.Select;
  }

  isCreateEditDialog(modal: IModalWindow | IModalInfo): boolean {
    return modal.type === ModalType.CreateEdit;
  }

  isExpanded(modal: IModalWindow): boolean {
    if (!modal.expandable) {
      return false;
    }
    return modal.expanded;
  }

  isCollapsed(modal: IModalWindow): boolean {
    if (!modal.expandable) {
      return false;
    }
    return !modal.expanded;
  }

  hasParent(modal: IModalWindow): boolean {
    return this.dialogManager.hasParent(modal);
  }

  // setVisibility(id: number) {
  //   if (!this.resizingModalId) {
  //     return 'visible';
  //   }
  //   if (id === this.resizingModalId) {
  //     return 'hidden';
  //   }
  //   return 'visible';
  // }

  showCancelBtn(modal: IModalWindow): boolean {
    if (this.isAlertDialog(modal) || this.isInfoDialog(modal)) {
      return false;
    }
    if (this.isSelectDialog(modal)) {
      return !modal.selectAsOk;
    }
    // if (this.hasParent(modal)) {
    //   return false;
    // }
    return true;
  }

  showOkBtn(modal: IModalWindow): boolean {
    if (this.isSelectDialog(modal)) {
      return !modal.selectAsOk;
    }
    // if (this.hasParent(modal)) {
    //   return false;
    // }
    return true;
  }

  okButtonText(modal: IModalWindow) {
    if (modal.okTitle) {
      return modal.okTitle;
    }
    switch (modal.type) {
      case ModalType.Select:
        return this.$i18n.gettext('Dialog Select');
      case ModalType.Confirm:
        return this.$i18n.gettext('Dialog Confirm');
      case ModalType.CreateEdit:
        return this.$i18n.gettext('Dialog Save');
      default:
        return this.$i18n.gettext('Dialog Close');
    }
  }

  cancelButtonText(modal: IModalWindow) {
    if (modal.cancelTitle) {
      return modal.cancelTitle;
    }
    if (modal.type === ModalType.Confirm) {
      return this.$i18n.gettext('Dialog Reject');
    }
    return this.$i18n.gettext('Dialog Cancel');
  }

  showScrim(modal: IModalWindow): boolean {
    if (!modal) {
      return true;
    }
    if (modal.noModal) {
      return false;
    }
    // if (modal.hostObject.layer === this.topLayer) {
    //   return true;
    // }
    return modal.scrim;
  }

  onComponentInstanceCreated(modal: IModalWindow, instance: { save?(): void }): void {
    modal.componentInstance = instance;
  }

  dialogBindings(modal: IModalWindow) {
    const topLayer = this.dialogManager.getTopLayer();
    return {
      width: this.modalWidth(modal),
      height: 'auto',
      'data-foreground': modal.hostObject.layer === topLayer,
      // 'data-layer': modal.hostObject.layer,
      style: { 'z-index': 2000 + modal.hostObject.layer * 10 },
    };
  }

  hasContentDetails(content: string): boolean {
    const exp = new RegExp(this.messageDetailSeparator);
    return exp.test(content);
  }

  private defaultWidth(modal: IModalWindow): string | number {
    if (this.isMobileGlobal) {
      return '100%';
    }
    return this.getWidthBySize(modal.size);
  }

  private getWidthBySize(size: 's' | 'm' | 'l') {
    const w = this.viewport().w;
    switch (size) {
      case 's':
        if (w >= 1920) {
          return 600;
        }
        if (w >= 1440) {
          return 450;
        }
        return 400;
      case 'm':
        if (w >= 1920) {
          return 1240;
        }
        if (w >= 1440) {
          return 920;
        }
        return 800;
      default:
        return `calc(100% - 2 * ${this.modalWindowGap})`;
    }
  }

  private findModal(host: IHostObject): IModalWindow {
    return this.modals.find(m => this.dialogManager.modalIdentity(m, host));
  }

  private findModalIndex(modal: IModalWindow): number {
    return this.modals.indexOf(modal);
  }

  private async askCanUnload(modal: IModalWindow, cancelReason: ModalCancelReason): Promise<boolean> {
    const fromCloseButtonReason = cancelReason === ModalCancelReason.FromCloseButton;
    const fromCancelButtonReason = cancelReason === ModalCancelReason.FromCancelButton;
    const fromBackButtonReason = cancelReason === ModalCancelReason.FromBackButton;
    const fromEscapeKeyPressReason = cancelReason === ModalCancelReason.FromEscapeKeyPress;

    if (
      (fromCloseButtonReason || fromCancelButtonReason) &&
      modal.componentInstance &&
      modal.componentInstance.onClose
    ) {
      return modal.componentInstance.onClose();
    }
    if (fromEscapeKeyPressReason) {
      return true;
    }
    if (this.hasParent(modal)) {
      if (fromBackButtonReason) {
        if (this.isCreateEditDialog(modal)) {
          return DialogManager.id(this.id ? this.id : '').exec(
            new ConfirmDialog({
              title: this.$i18n.gettext('Dialog Close Confirm Title'),
              content: this.$i18n.gettext('Dialog Close Confirm Text'),
            })
          );
        }
        return true;
      }
      if (fromCloseButtonReason || fromCancelButtonReason) {
        return DialogManager.id(this.id ? this.id : '').exec(
          new ConfirmDialog({
            title: this.$i18n.gettext('Dialog Close Parent Confirm Title'),
            content: this.$i18n.gettext('Dialog Close Parent Confirm Text'),
          })
        );
      }
    }

    if (this.isCreateEditDialog(modal)) {
      const result: boolean = await DialogManager.id(this.id ? this.id : '').exec(
        new ConfirmDialog({
          title: this.$i18n.gettext('Dialog Close Confirm Title'),
          content: this.$i18n.gettext('Dialog Close Confirm Text'),
        })
      );
      return result;
    }

    return true;
  }

  private closeModal(modal: IModalWindow) {
    modal.show = false;
    modal.resolveFunction(null);
    this.remove(modal);
    this.dialogListeners.remove(modal);
    eventBus.$emit('modal-cancel' + modal.id);
  }

  private closeAll(all: boolean = false): void {
    this.modals.forEach(modal => {
      if (all || !modal.noModal) {
        this.remove(modal);
      }
    });
  }

  get modalWindowGap(): string {
    if (this.isMobileGlobal) {
      return '0px';
    }
    return 'var(--modal-window-gap)';
  }

  get cancelReason(): Record<string, ModalCancelReason> {
    return ModalCancelReason;
  }

  get dialogManager(): DialogManager {
    return new DialogManager(this.options);
  }

  get dialogListeners(): DialogListeners {
    return new DialogListeners();
  }
}
