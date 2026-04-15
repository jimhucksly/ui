import { eventBus } from '@ldmjs/core';
import {
  AlertDialog,
  ConfirmDialog,
  CreateEditDialog,
  Dialog,
  IHostObject,
  IModalInfo,
  IModalWindow,
  InfoDialog,
  PromptDialog,
  SelectDialog,
} from '@/types/dialogs';
import { uidGen } from '@/utils';

export enum ModalButton {
  Ok,
  Cancel,
}

export enum ModalType {
  Alert,
  Prompt,
  Info,
  Confirm,
  Select,
  CreateEdit,
}

const GAP = 17;
const MARGIN_RIGHT = 25;
const MARGIN_BOTTOM = 68;

export class DialogManager {
  private readonly _visibled: Array<IModalWindow> = [];
  private _minimized: Array<IModalWindow> = [];
  private _viewPortWidth: number;

  static _id = '';

  constructor() {
    this._viewPortWidth = window.innerWidth;
    window.addEventListener('resize', this.onResizeHandler.bind(this) as () => void);
  }

  setMinimized(minimized: Array<IModalWindow>) {
    this._minimized = minimized;
  }

  modalIdentity(modal: IModalWindow, host: IHostObject) {
    if (!modal.hostObject || !host) {
      return false;
    }
    return (
      modal.hostObject?.id === host?.id &&
      modal.hostObject?.contentType === host?.contentType &&
      modal.hostObject?.kind === host?.kind
    );
  }

  tryToOpen(host: IHostObject): boolean {
    const found = this._visibled.concat(this._minimized).find(m => this.modalIdentity(m, host));
    return !found;
  }

  dialogCreated(info: IModalWindow): void {
    if (!info) {
      return;
    }
    info.el = document.querySelector(`.${this.uniqKey(info)}`);
    this.shiftLeft(info);
    this.refreshPositions();
  }

  dialogModalChanged(info: IModalWindow, callback: () => void = null) {
    if (!info) {
      return;
    }
    if (info.noModal) {
      /**
       * диалог стал немодальным (окно не перекрывает другой контент, с ним можно взаимодействовать)
       */
      let timeoutId: number;
      let refreshed = false;
      const resizeEnd = () => {
        clearTimeout(timeoutId);
        resizeObserver.unobserve(info.el);
        this.refreshPositions();
        refreshed = true;
      };
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const resizeObserver = new (window as any).ResizeObserver((entries: Array<{ contentRect: unknown }>) => {
        window.requestAnimationFrame(() => {
          if (!Array.isArray(entries) || !entries.length) {
            return null;
          }
          if (entries.length && entries[0].contentRect) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(resizeEnd, 50) as unknown as number;
          }
        });
      });
      resizeObserver.observe(info.el);
      setTimeout(() => {
        if (!refreshed) {
          this.refreshPositions();
        }
      }, 300);
    } else {
      /**
       * диалог стал модальным (окно перекрывает другой контент и не даем с ним взаимодействовать)
       */
      this.setDialogModal(info, callback);
    }
  }

  dialogProcessing(info: IModalWindow) {
    if (!info) {
      return;
    }
    info.minimized = true;
    this.dialogMinimizeChanged(info);
  }

  dialogMinimizeChanged(info: IModalWindow) {
    if (!info) {
      return;
    }
    /**
     * диалог свернут - диалог развернут
     */
    if (info.minimized) {
      // диалог свернут
      if (!info.noModal) {
        /**
         * если диалог модальный, сначала сделаем его немодальным
         */
        (info as unknown as { _wasModal: boolean })._wasModal = true;
        info.noModal = true;
      }
      const i = this._visibled.findIndex(m => this.modalIdentity(m, info.hostObject));
      if (i > -1) {
        this._visibled.splice(i, 1);
      }
      this.addToMinimized(info);
      this.refreshPositions();
    } else {
      // диалог развернут
      this.removeFromMinimized(info);
      this.toggleDialogShow(info);
      this.shiftLeft(info);
      if ((info as unknown as { _wasModal: boolean })._wasModal) {
        info.noModal = false;
        delete (info as unknown as { _wasModal: boolean })._wasModal;
      }
      if (!info.noModal) {
        // сделаем окно модальным, если до сворачивания оно было таковым
        this.setDialogModal(info);
      } else {
        this.refreshPositions();
      }
      setTimeout(() => {
        const managerId = info.managerId || '';
        eventBus.$emit('dialog:maximized' + managerId, info);
      }, 100);
    }
  }

  dialogClosed(info: IModalWindow): void {
    try {
      if (this.removeFromMinimized(info)) {
        return;
      }
      const i = this._visibled.findIndex(m => this.modalIdentity(m, info.hostObject));
      if (i > -1) {
        this._visibled.splice(i, 1);
        this.refreshPositions();
      }
    } finally {
      if (!this._visibled.length) {
        DialogManager._id = '';
      }
    }
  }

  activate(info: IModalWindow): void {
    let i = this._minimized.findIndex(d => d === info);
    let dlg: IModalWindow = null;
    if (i > -1) {
      dlg = this._minimized[i];
      this._minimized.splice(i, 1);
    }
    if (dlg) {
      dlg.minimized = false;
      this.dialogMinimizeChanged(dlg);
      this.refreshPositions();
    } else {
      i = this._visibled.findIndex(m => this.modalIdentity(m, info.hostObject));
      if (i > -1) {
        this._visibled.splice(i, 1);
      }
      this.shiftLeft(info);
      this.refreshPositions();
    }
  }

  onResizeHandler() {
    this._viewPortWidth = window.innerWidth;
    this.refreshPositions();
  }

  setParentDialog(info: IModalInfo) {
    for (const m of this._visibled.reverse()) {
      if (!m.visible) {
        continue;
      }
      info.hostObject.parentId = m.id;
    }
  }

  hideDialog(id: string | number) {
    const i = this._visibled.findIndex(m => m.id === id);
    if (i > -1) {
      this._visibled[i].visible = false;
    }
  }

  showDialog(id: string | number) {
    const i = this._visibled.findIndex(m => m.id === id);
    if (i > -1) {
      this._visibled[i].visible = true;
    }
  }

  hasParent(modal: IModalWindow): boolean {
    return Boolean(modal.hostObject.parentId);
  }

  getParents(modal: IModalWindow): Array<IModalWindow> {
    const result: Array<IModalWindow> = [];
    let id = modal.hostObject.parentId;
    while (id) {
      const index = this._visibled.findIndex(m => m.id === id);
      if (index > -1) {
        result.push(this._visibled[index]);
        id = this._visibled[index].hostObject?.parentId;
      } else {
        id = null;
      }
    }
    return result;
  }

  private shiftLeft(info: IModalWindow): void {
    this._visibled.push(info);
  }

  /**
   * --- Позиционирование относительно правого нижнего угла ---
   * Самый новое созданное или последнее развернутое окно
   * будет всегда в правом нижнем углу.
   * Предыдущие ему окна смещаются в сторону левого края,
   * пока для этого хватает рабочей области.
   * Окна, не уместившиеся в рабочую область, будут свернуты.
   */
  private refreshPositions(): void {
    let right = 0;
    let index = -1;
    let unusedArea = this._viewPortWidth;
    for (let i = this._visibled.length - 1; i >= 0; i--) {
      const dlg = this._visibled[i];
      // пропускаем окна, раскрытые в стандарное представление с затемненным фоном
      if (!dlg.noModal) {
        continue;
      }
      const offset = dlg.el.clientWidth + GAP;
      // проверяем, хватит ли незанятой области для отображения еще одного окна
      if (unusedArea < offset) {
        const info = this._visibled.shift();
        info.el.style.bottom = 'unset';
        info.el.style.right = 'unset';
        setTimeout(() => {
          this.addToMinimized(info);
        }, 1);
      } else {
        right = MARGIN_RIGHT + offset * ++index;
        // на каждой итерации вычисляем ширину незанятой области
        unusedArea -= MARGIN_RIGHT + offset;
        dlg.el.style.margin = '0';
        dlg.el.style.position = 'absolute';
        dlg.el.style.bottom = `${MARGIN_BOTTOM}px`;
        dlg.el.style.right = `${right}px`;
        dlg.el.classList.remove('ld-dialog-content--hidden');
      }
    }
  }

  private setDialogModal(info: IModalWindow, callback: () => void = null): void {
    if (!info) {
      return;
    }
    info.el.style.position = 'relative';
    info.el.style.top = 'unset';
    info.el.style.left = 'unset';
    info.el.style.bottom = 'unset';
    info.el.style.right = 'unset';
  }

  private addToMinimized(info: IModalWindow): void {
    this.toggleDialogShow(info);
    info.minimized = true;
    this._minimized.unshift(info);
  }

  private removeFromMinimized(info: IModalWindow): boolean {
    const i = this._minimized.findIndex(m => this.modalIdentity(m, info.hostObject));
    if (i > -1) {
      this._minimized.splice(i, 1);
      return true;
    }
    return false;
  }

  private toggleDialogShow(info: IModalWindow) {
    if (info.el.parentElement.style.display !== 'none') {
      (info as unknown as { _lastDisplayProp: string })._lastDisplayProp = info.el.parentElement.style.display;
      info.el.parentElement.style.display = 'none';
    } else {
      info.el.parentElement.style.display = (info as unknown as { _lastDisplayProp: string })._lastDisplayProp;
    }
  }

  private uniqKey(info: IModalWindow): string {
    return `dlg-${info.id}`;
  }

  public static id(value: string) {
    DialogManager._id = value;
    return DialogManager;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  public static exec<T>(modal: Dialog, fetchData?: () => Promise<any>): Promise<T> {
    switch (modal.__constructor) {
      case 'AlertDialog':
        return DialogManager.alert<T>(modal as AlertDialog);
      case 'PromptDialog':
        return DialogManager.prompt<T>(modal as PromptDialog);
      case 'ConfirmDialog':
        return DialogManager.confirm<T>(modal as ConfirmDialog);
      case 'InfoDialog':
        return DialogManager.info<T>(modal as InfoDialog, fetchData);
      case 'SelectDialog':
        return DialogManager.select<T>(modal as SelectDialog<T>, fetchData);
      case 'CreateEditDialog':
        return DialogManager.createEdit<T>(modal as CreateEditDialog<T>, fetchData);
    }
    return null;
  }

  private static alert<T>(modal: AlertDialog): Promise<T> {
    const modalInfo: IModalInfo = {
      ...modal,
      type: ModalType.Alert,
      managerId: DialogManager._id,
    };
    return DialogManager.execAsync(modalInfo);
  }

  private static prompt<T>(modal: PromptDialog): Promise<T> {
    const modalInfo: IModalInfo = {
      ...modal,
      type: ModalType.Prompt,
      managerId: DialogManager._id,
    };
    return DialogManager.execAsync(modalInfo);
  }

  private static confirm<T>(modal: ConfirmDialog): Promise<T> {
    const modalInfo: IModalInfo = {
      ...modal,
      type: ModalType.Confirm,
      closable: true,
      managerId: DialogManager._id,
    };
    return DialogManager.execAsync(modalInfo);
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  private static info<T>(modal: InfoDialog, fetchData?: () => Promise<any>): Promise<T> {
    const modalInfo: IModalInfo = {
      ...modal,
      type: ModalType.Info,
      managerId: DialogManager._id,
    };
    if (!modalInfo.hostObject) {
      modalInfo.hostObject = {
        id: uidGen(6, '0-9'),
        contentType: 0,
        kind: 1,
      };
    }
    return DialogManager.execAsync(modalInfo, fetchData);
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  private static select<T>(modal: SelectDialog<T>, fetchData?: () => Promise<any>): Promise<T> {
    const modalInfo: IModalInfo = {
      ...modal,
      type: ModalType.Select,
      managerId: DialogManager._id,
    };
    if (!modalInfo.hostObject) {
      modalInfo.hostObject = {
        id: uidGen(6, '0-9'),
        contentType: 0,
        kind: 1,
      };
    }
    return DialogManager.execAsync(modalInfo, fetchData);
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  private static createEdit<T>(modal: CreateEditDialog<T>, fetchData?: () => Promise<any>): Promise<T> {
    const modalInfo: IModalInfo = {
      ...modal,
      type: ModalType.CreateEdit,
      managerId: DialogManager._id,
    };
    if (!modalInfo.hostObject) {
      modalInfo.hostObject = {
        id: uidGen(6, '0-9'),
        contentType: 0,
        kind: 1,
      };
    }
    return DialogManager.execAsync(modalInfo, fetchData);
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  private static execAsync<T>(modalInfo: IModalInfo, fetchData?: () => Promise<any>) {
    return new Promise<T>(resolve => {
      modalInfo.resolveFunction = resolve as (v: unknown) => T;
      let fetchProps: (host: IHostObject) => unknown = null;
      const managerId = modalInfo.managerId || '';
      if (fetchData instanceof Function) {
        fetchProps = async (host: IHostObject) => {
          if (host.id === modalInfo.hostObject.id) {
            if (fetchData instanceof Function) {
              const props = await fetchData();
              eventBus.$off('dialog:created' + managerId, fetchProps);
              eventBus.$emit('dialog:props' + managerId, props, modalInfo.hostObject);
            }
          }
        };
        eventBus.$on('dialog:created' + managerId, fetchProps);
      }
      eventBus.$emit('dialog:open' + managerId, modalInfo);
    });
  }
}
