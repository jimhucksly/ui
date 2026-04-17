import { eventBus, isDefined, uniqueID } from '@dn-web/core';
import { mixins, Options } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import Icon from '@/components/icon/icon.vue';
import { Emit } from '@/decorators/emit.decorator';
import ViewportMixin from '@/mixins/viewport.mixins';
import UnitService from '@/services/unit.service';
import { IHostObject, IModalInfo, IModalWindow, IViewModel, ModalWindow } from '@/types/dialogs';
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

/**
 * Dialogs
 * @displayName ld-dialog
 */
@Options({
  components: {
    minimized: DialogMinimizedComponent,
    'svg-icon': Icon,
  },
})
export default class DialogComponent extends mixins(ViewportMixin) {
  @Prop({ type: String, default: '' }) id: string;

  readonly minimized: Array<ModalWindow> = [];
  readonly dialogManager = new DialogManager();
  readonly dialogListeners = new DialogListeners();

  modals: Array<ModalWindow> = [];

  resizingModalId: number = null;

  onResizeHandler: () => void = null;

  @Emit('modal-in-focus') emitFocus(value: boolean) {
    return value;
  }

  @Watch('modals', { deep: true }) onModalsChanged() {
    const hasModals = this.modals.some(m => !m.minimized && !m.noModal);
    this.emitFocus(hasModals);
  }

  created() {
    this.dialogManager.setMinimized(this.minimized);
    this.onResizeHandler = this.onResize.bind(this);
    window.addEventListener('resize', this.onResizeHandler);
  }

  mounted() {
    this.$nextTick(() => {
      eventBus.$on('dialog:open' + this.id, this.open);

      eventBus.$on('dialog:props' + this.id, this.onSetProps);

      eventBus.$on('dialog:close:all' + this.id, this.closeAll);

      eventBus.$on('dialog:maximized' + this.id, this.onMaximize);
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

  open(modalInfo: IModalInfo) {
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
      if (modalInfo.hostObject.parentId) {
        this.dialogManager.hideDialog(modalInfo.hostObject.parentId);
      }
    }
    const modal: ModalWindow = {
      id: Number(modalInfo.hostObject.id),
      component: modalInfo.component,
      componentProps: modalInfo.componentProps,
      hostObject: modalInfo.hostObject,
      pressEnterAsOk: modalInfo.pressEnterAsOk,
      pressEscAsCancel: modalInfo.pressEscAsCancel,
      loading: modalInfo.loading,
      noModal: modalInfo.noModal,
      type: modalInfo.type,
      title: modalInfo.title,
      darkTitle: modalInfo.darkTitle,
      content: modalInfo.content,
      resolveFunction: modalInfo.resolveFunction,
      okTitle: modalInfo.okTitle,
      cancelTitle: modalInfo.cancelTitle,
      okResult: modalInfo.okResult,
      cancelResult: modalInfo.cancelResult,
      okOnly: modalInfo.type === ModalType.Alert || modalInfo.type === ModalType.Info,
      show: true,
      visible: true,
      okLoading: false,
      okDisabled: modalInfo.type === ModalType.Select,
      selectAsOk: modalInfo.selectAsOk,
      hideFooter: isDefined(modalInfo.hideFooter),
      resolved: false,
      width: modalInfo.width,
      height: modalInfo.height,
      fullHeight: modalInfo.fullHeight,
      align: modalInfo.align,
      size: modalInfo.size,
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
    };
    if (modal.expandable) {
      modal.expanded = modalInfo.expanded;
      if (!modal.expandedSize && !modal.collapsedSize) {
        modal.expandedSize = { width: modal.width, height: modal.height };
        modal.collapsedSize = { width: modal.width, height: modal.height };
      } else if (modal.expandedSize && !modal.collapsedSize) {
        const { height, width } = modal.expandedSize;
        modal.noModal = modal.expandedSize.noModal;
        modal.collapsedSize = { height, width };
      } else if (!modal.expandedSize && modal.collapsedSize) {
        const { height, width } = modal.collapsedSize;
        modal.noModal = modal.collapsedSize.noModal;
        modal.expandedSize = { height, width };
      } else {
        modal.noModal = !modal.expanded;
      }
      if (!modal.noModal) {
        modal.expanded = true;
      }
      if (modal.expanded) {
        modal.noModal = false;
      }
    }
    this.modals.push(modal);
    const checkDialogExist = setInterval(() => {
      const el = document.querySelector(`.${this.uniqKey(modal)}`);
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
          const btnOk: HTMLElement = modal.el.querySelector(`#ld-dialog-btn-ok-${modal.id}`);
          if (btnOk) {
            btnOk.focus();
          }
        }
        this.dialogManager.dialogCreated(modal);
        eventBus.$emit('dialog:created' + this.id, modal.hostObject);
      }
    }, 100);
  }

  modalClass(modal: ModalWindow): Array<string> {
    const result: Array<string> = [`${this.uniqKey(modal)}`, `${ModalType[modal.type]}`];
    if (this.id) {
      result.push(`${ModalType[modal.type]}-${this.id}`);
    }
    if (modal.noModal || !modal.visible) {
      result.push('ld-dialog-content--hidden');
    }
    if (!modal.content && (this.isAlertDialog(modal) || this.isConfirmDialog(modal))) {
      result.push('ld-dialog-content--without-content');
    }
    if (this.isMobileGlobal) {
      result.push('ld-dialog-content--mobile');
    }
    return result;
  }

  modalType(modal: ModalWindow): string {
    return `${ModalType[modal.type]}`;
  }

  dialogClass(modal: ModalWindow): Array<string> {
    const result: Array<string> = [this.modalType(modal)];
    if (this.id) {
      result.push(this.modalType(modal) + `-${this.id}`);
    }
    if (modal.align) {
      result.push('v-dialog--align-' + modal.align);
    }
    return result;
  }

  modalWidth(modal: ModalWindow): number | string {
    this.$nextTick(() => {
      this.stylingModal(modal);
      this.alignButtons(modal);
    });
    return this.defaultWidth(modal);
  }

  stylingModal(modal: ModalWindow) {
    if (modal.minimized) {
      return;
    }
    if (!modal.el) {
      modal.el = document.querySelector(`.${this.uniqKey(modal)}`);
    }
    const LIMIT_HEIGHT = 600;
    const viewportH = this.viewport().h;
    const getWidth = () => {
      if (this.isMobileGlobal) {
        return '100%';
      }
      let w = modal.width || this.defaultWidth(modal);
      if (modal.expandable) {
        w = (modal.expanded ? modal.expandedSize?.width : modal.collapsedSize?.width) || w;
      }
      return UnitService.convertToUnit(w);
    };

    const getHeight = () => {
      if (modal.fullHeight) {
        return '100%';
      }
      let h = modal.height || 'auto';
      if (modal.expandable) {
        h = (modal.expanded ? modal.expandedSize?.height : modal.collapsedSize?.height) || h;
      }
      return UnitService.convertToUnit(h);
    };

    const getMaxHeight = () => {
      if (modal.align === 'left' || modal.align === 'right') {
        return '100%';
      }
      if (this.isMobileGlobal) {
        return '100%';
      }
      return viewportH >= LIMIT_HEIGHT ? `calc(100% - 2 * ${this.modalWindowGap}` : 'unset';
    };

    const getPaddingTop = () => {
      if (modal.align === 'left' || modal.align === 'right') {
        return '0';
      }
      if (modal.fullHeight) {
        return this.modalWindowGap;
      }
      if (this.isMobileGlobal) {
        return 'var(--modal-window-gap)';
      }
      if (this.isAlertDialog(modal) || this.isConfirmDialog(modal)) {
        return 'unset';
      }
      return viewportH >= LIMIT_HEIGHT ? `calc(${Math.floor(viewportH * 0.1)}px + ${this.modalWindowGap})` : 'unset';
    };

    const getPaddingBottom = () => {
      if (modal.align === 'left' || modal.align === 'right') {
        return '0';
      }
      return viewportH >= LIMIT_HEIGHT ? 'unset' : this.modalWindowGap;
    };

    const getMargin = () => {
      if (modal.align === 'left' || modal.align === 'right') {
        return '0';
      }
      return this.modalWindowGap;
    };

    if (modal.el) {
      modal.el.style.margin = getMargin();
      modal.el.style.height = getHeight();
      modal.el.style.width = getWidth();
      modal.el.style.maxHeight = getMaxHeight();
      modal.el.style.paddingTop = getPaddingTop();
      modal.el.style.paddingBottom = getPaddingBottom();
    }
  }

  alignButtons(modal: ModalWindow) {
    if (modal.minimized) {
      return;
    }
    if (!modal.el) {
      modal.el = document.querySelector(`.${this.uniqKey(modal)}`);
    }
    const actions: HTMLElement = modal.el.querySelector('.v-card-actions');
    if (actions) {
      const buttons = modal.el.querySelectorAll('.v-card-actions > button');
      const max = Math.max(...Array.from(buttons).map((b: HTMLElement) => b.clientWidth));
      const attr = document.createAttribute('style');
      attr.value = `--max-child-width: ${UnitService.convertToUnit(max)}`;
      actions.setAttributeNode(attr);
    }
  }

  modalTitle(modal: ModalWindow): string {
    if (modal.description instanceof Function) {
      return modal.description();
    }
    return modal.description || modal.title;
  }

  handleHide(modal: ModalWindow) {
    if (!modal.resolved) {
      this.handleOk(modal);
    }
  }

  async handleOk(modal: ModalWindow): Promise<boolean> {
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
        if (modal.componentInstance && modal.componentInstance.save) {
          modal.okLoading = true;
          /* eslint-disable-next-line no-useless-call */
          let resultSave = modal.componentInstance.save.call(modal.componentInstance);
          if (resultSave instanceof Promise) {
            try {
              resultSave = await resultSave;
              if (resultSave) {
                modal.okResult = resultSave;
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
    modal: ModalWindow,
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
      if (fromOkButtonReason || fromEnterKeyPressReason) {
        canUnload = await this.handleOk(modal);
      } else if (
        modal.componentInstance &&
        modal.componentInstance.isChanged &&
        modal.componentInstance.isChanged instanceof Function
      ) {
        /* eslint-disable-next-line no-useless-call */
        const isChanged = modal.componentInstance.isChanged.call(modal.componentInstance);
        if (isChanged) {
          canUnload = await this.askCanUnload(modal, cancelReason);
        }
      } else {
        canUnload = await this.askCanUnload(modal, cancelReason);
      }

      if (!canUnload) {
        return;
      }

      if (this.hasParent(modal)) {
        if (fromCloseButtonReason) {
          const parents = this.dialogManager.getParents(modal);
          for (const m of parents) {
            this.closeModal(m);
          }
        }
        if (fromOkButtonReason || fromEscapeKeyPressReason || fromBackButtonReason) {
          this.dialogManager.showDialog(modal.hostObject.parentId);
        }
      }

      // if (canUnload) {
      //   if (modal.isChanged instanceof Function) {
      //     canUnload = !modal.isChanged();
      //   } else {
      //     const event = new Event('beforeunload');
      //     (event as unknown as { modal: boolean }).modal = true;
      //     window.dispatchEvent(event);
      //     canUnload = 'canUnload' in event ? (event as unknown as { canUnload: boolean }).canUnload : true;
      //     dialogText = (event as unknown as { dialogText: string }).dialogText ?? dialogText;
      //   }
      // }

      modal.show = false;
      if (isDefined(modal.okResult) && isSuccessReason) {
        return modal.resolveFunction(modal.okResult);
      }

      if (isDefined(modal.cancelResult) && fromCancelButtonReason) {
        return modal.resolveFunction(modal.cancelResult);
      }

      modal.resolveFunction(this.isSelectDialog(modal) || this.isCreateEditDialog(modal) ? null : false);
    } finally {
      if (!modal.show) {
        this.remove(modal);
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

  async onSetResult(modal: ModalWindow, result: IViewModel<string | number>): Promise<void> {
    modal.okLoading = false;
    modal.okResult = result;
    if (result) {
      if (modal.selectAsOk || this.isCreateEditDialog(modal)) {
        modal.okDisabled = false;
        const canUnload = await this.handleOk(modal);
        if (canUnload) {
          this.handleCancel(modal, ModalCancelReason.FromOkButton);
        }
      }
      if (Array.isArray(result)) {
        modal.okDisabled = result.length === 0;
      } else {
        modal.okDisabled = false;
      }
    } else {
      modal.okDisabled = true;
    }
  }

  async onSetResultAndClose(modal: ModalWindow, result: IViewModel<string | number>): Promise<void> {
    if (result) {
      modal.okResult = result;
      const canUnload = await this.handleOk(modal);
      if (canUnload) {
        this.handleCancel(modal, ModalCancelReason.FromOkButton);
        return;
      }
    }
    modal.okDisabled = true;
  }

  onExpandCollapse(modal: ModalWindow) {
    this.resizingModalId = modal.id;
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(() => {
        modal.expanded = !modal.expanded;
        const prevNoModal = modal.noModal;
        modal.noModal = !modal.expanded;
        window.requestAnimationFrame(() => {
          if (modal.noModal !== prevNoModal) {
            this.dialogManager.dialogModalChanged(modal);
          }
          setTimeout(() => {
            this.resizingModalId = null;
          }, 400);
        });
      });
    }
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

  onActivate(modal: ModalWindow) {
    modal.processingDescription = null;
    this.dialogManager.activate(modal);
  }

  onProcessing(modal: ModalWindow, message?: string) {
    if (message) {
      modal.processingDescription = message;
    }
    this.dialogManager.dialogProcessing(modal);
  }

  onHelp(modal: ModalWindow) {
    if (modal.componentInstance && modal.componentInstance.onHelp) {
      modal.componentInstance.onHelp();
    }
  }

  remove(modal: ModalWindow) {
    modal.resolved = true;
    this.$nextTick(() => {
      const i = this.modals.indexOf(modal);
      if (i > -1) {
        this.modals.splice(i, 1);
        this.dialogManager.dialogClosed(modal);
      }
    });
  }

  isAlertDialog(modal: ModalWindow): boolean {
    return modal.type === ModalType.Alert;
  }

  isPromptDialog(modal: ModalWindow): boolean {
    return modal.type === ModalType.Prompt;
  }

  isConfirmDialog(modal: ModalWindow): boolean {
    return modal.type === ModalType.Confirm;
  }

  isInfoDialog(modal: ModalWindow): boolean {
    return modal.type === ModalType.Info;
  }

  isSelectDialog(modal: ModalWindow): boolean {
    return modal.type === ModalType.Select;
  }

  isCreateEditDialog(modal: ModalWindow): boolean {
    return modal.type === ModalType.CreateEdit;
  }

  isExpanded(modal: ModalWindow): boolean {
    if (!modal.expandable) {
      return false;
    }
    return modal.expanded;
  }

  isCollapsed(modal: ModalWindow): boolean {
    if (!modal.expandable) {
      return false;
    }
    return !modal.expanded;
  }

  hasParent(modal: ModalWindow): boolean {
    return this.dialogManager.hasParent(modal);
  }

  setVisibility(id: number) {
    if (!this.resizingModalId) {
      return 'visible';
    }
    if (id === this.resizingModalId) {
      return 'hidden';
    }
    return 'visible';
  }

  showCancelBtn(modal: ModalWindow): boolean {
    if (this.isAlertDialog(modal) || this.isInfoDialog(modal)) {
      return false;
    }
    if (this.isSelectDialog(modal)) {
      return !modal.selectAsOk;
    }
    if (this.hasParent(modal)) {
      return false;
    }
    return true;
  }

  showOkBtn(modal: ModalWindow): boolean {
    if (this.isSelectDialog(modal)) {
      return !modal.selectAsOk;
    }
    return !this.hasParent(modal);
  }

  okButtonText(modal: ModalWindow) {
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

  cancelButtonText(modal: ModalWindow) {
    if (modal.cancelTitle) {
      return modal.cancelTitle;
    }
    if (modal.type === ModalType.Confirm) {
      return this.$i18n.gettext('Dialog Reject');
    }
    return this.$i18n.gettext('Dialog Cancel');
  }

  showScrim(modal: ModalWindow): boolean {
    return !(modal.noModal || this.hasParent(modal));
  }

  onComponentInstanceCreated(modal: ModalWindow, instance: { save?(): void }): void {
    modal.componentInstance = instance;
  }

  dialogBindings(modal: ModalWindow) {
    return {
      width: this.modalWidth(modal),
      height: 'auto',
    };
  }

  isTitleDark(modal: ModalWindow) {
    return modal.darkTitle;
  }

  private defaultWidth(modal: ModalWindow): string | number {
    if (this.isMobileGlobal) {
      return '100%';
    }
    const w = this.viewport().w;
    switch (modal.size) {
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

  private uniqKey(modal: ModalWindow): string {
    return `dlg-${modal.id}`;
  }

  private findModal(host: IHostObject): ModalWindow {
    return this.modals.find(m => this.dialogManager.modalIdentity(m, host));
  }

  private async askCanUnload(modal: ModalWindow, cancelReason: ModalCancelReason): Promise<boolean> {
    const fromCloseButtonReason = cancelReason === ModalCancelReason.FromCloseButton;
    const fromCancelButtonReason = cancelReason === ModalCancelReason.FromCancelButton;
    const fromBackButtonReason = cancelReason === ModalCancelReason.FromBackButton;
    const fromEscapeKeyPressReason = cancelReason === ModalCancelReason.FromEscapeKeyPress;

    if (fromCloseButtonReason && fromCancelButtonReason && modal.componentInstance && modal.componentInstance.onClose) {
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
      if (fromCloseButtonReason) {
        return DialogManager.id(this.id ? this.id : '').exec(
          new ConfirmDialog({
            title: this.$i18n.gettext('Dialog Close Parent Confrim Title'),
            content: this.$i18n.gettext('Dialog Close Parent Confrim Text'),
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

  private closeModal(modal: ModalWindow) {
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
}
