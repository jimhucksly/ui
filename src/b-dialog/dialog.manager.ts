import { eventBus, uniqueID } from '@dn-web/core';
import UnitService from '@/services/unit.service';
import {
  AlertDialog,
  ConfirmDialog,
  CreateEditDialog,
  Dialog,
  IHostObject,
  IModalInfo,
  IModalWindow,
  InfoDialog,
  InteractiveDialog,
  PromptDialog,
  SelectDialog,
} from '@/types/dialogs';
import DialogLayers from './dialog.layers';

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

export class DialogManager extends DialogLayers {
  private _viewPortWidth: number;

  static _id = '';

  private GAP = 24;

  constructor() {
    super();
    this._viewPortWidth = window.innerWidth;
    window.addEventListener('resize', this.onResizeHandler.bind(this) as () => void);
  }

  setProps(data: { gap: number }) {
    if (data.gap) {
      this.GAP = data.gap;
    }
  }

  uniqKey(modal: IModalWindow): string {
    return `dlg-${modal.id}`;
  }

  tryToOpen(host: IHostObject): boolean {
    const found = this._all().find(m => this.modalIdentity(m, host));
    return !found;
  }

  dialogCreate(info: IModalWindow) {
    this.add(info);
  }

  dialogCreated(info: IModalWindow): void {
    if (!info) {
      return;
    }
    info.el = document.querySelector(`.${this.uniqKey(info)}`);
    this.refreshPositions();
  }

  dialogModalChanged(info: IModalWindow) {
    if (!info) {
      return;
    }
    info.el = document.querySelector(`.${this.uniqKey(info)}`);
    if (info.noModal) {
      /**
       * диалог стал немодальным (окно не перекрывает другой контент, с ним можно взаимодействовать)
       */
      let timeoutId: number;
      let refreshed = false;
      this.down(info);
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
      this.setDialogModal(info);
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
      this.minimizeDialog(info.hostObject);
      this.refreshPositions();
    } else {
      // диалог развернут
      this.showDialog(info.hostObject);
      this.remove(info);
      this.add(info);
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
      const { value } = this.find(info.hostObject);
      if (value) {
        this.remove(value);
        this.refreshPositions();
      }
    } finally {
      if (!this._visibled().length) {
        DialogManager._id = '';
      }
    }
  }

  activate(info: IModalWindow): void {
    const { layer, value } = this.find(info.hostObject);
    if (!value) {
      this.add(info);
      this.refreshPositions();
      return;
    }
    if (layer === -1) {
      value.minimized = false;
      this.dialogMinimizeChanged(value);
      this.refreshPositions();
    }
  }

  onResizeHandler() {
    this._viewPortWidth = window.innerWidth;
    this.refreshPositions();
  }

  setParentDialog(info: IModalInfo) {
    for (const m of this._visibled().toReversed()) {
      if (!m.visible) {
        continue;
      }
      if (!m.show) {
        continue;
      }
      if (m.type === info.type) {
        if (m.hostObject && info.hostObject && m.hostObject.contentType === info.hostObject.contentType) {
          continue;
        }
      }
      info.hostObject.parentId = m.id;
    }
  }

  hideDialog(hostObject: IHostObject) {
    const { value } = this.find(hostObject);
    if (value) {
      value.visible = false;
    }
  }

  showDialog(hostObject: IHostObject) {
    const { value } = this.find(hostObject);
    if (value) {
      value.visible = true;
    }
  }

  minimizeDialog(hostObject: IHostObject) {
    const { value } = this.find(hostObject);
    if (value) {
      value.minimized = true;
      value.el.style.bottom = 'unset';
      value.el.style.right = 'unset';
      value.el.classList.add('b-dialog-content--hidden');
      this.hideDialog(value.hostObject);
      this.remove(value);
      this.add(value);
    }
  }

  hasParent(modal: IModalWindow): boolean {
    return Boolean(modal.hostObject.parentId);
  }

  getParents(modal: IModalWindow): Array<IModalWindow> {
    const result: Array<IModalWindow> = [];
    let id = modal.hostObject.parentId;
    while (id) {
      const i = this._visibled().find(m => m.id === id);
      if (i) {
        result.push(i);
        id = i.hostObject?.parentId;
      } else {
        id = null;
      }
    }
    return result;
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
    for (const layer of this.getLayers()) {
      if (layer === -1) {
        continue;
      }
      let unusedArea = this._viewPortWidth;
      for (const dlg of this.get(layer).toReversed()) {
        // пропускаем окна, раскрытые в стандарное представление с затемненным фоном
        if (!dlg.noModal) {
          continue;
        }
        if (dlg.minimized) {
          continue;
        }
        const el: HTMLElement = document.querySelector(`.${this.uniqKey(dlg)}`);
        if (!el) {
          return;
        }
        dlg.el = el;
        const offset = UnitService.unitToNumber(dlg.width) + this.GAP;
        // проверяем, хватит ли незанятой области для отображения еще одного окна
        if (unusedArea < offset) {
          this.minimizeDialog(dlg);
        } else {
          // на каждой итерации вычисляем ширину незанятой области
          dlg.el.style.margin = '0';
          dlg.el.style.position = 'absolute';
          dlg.el.style.bottom = UnitService.convertToUnit(2 * this.GAP);
          dlg.el.style.right = UnitService.convertToUnit(this._viewPortWidth - unusedArea + this.GAP);
          dlg.el.classList.remove('b-dialog-content--hidden');
          dlg.el.classList.add('b-dialog-content--no-modal');
          unusedArea = unusedArea - offset;
        }
      }
    }
  }

  private setDialogModal(info: IModalWindow): void {
    if (!info) {
      return;
    }
    info.el.style.position = 'relative';
    info.el.style.top = 'unset';
    info.el.style.left = 'unset';
    info.el.style.bottom = 'unset';
    info.el.style.right = 'unset';
    info.el.classList.remove('b-dialog-content--no-modal');
    this.up(info);
  }

  // private toggleDialogShow(info: IModalWindow) {
  //   if (info.el.parentElement.style.display !== 'none') {
  //     (info as unknown as { _lastDisplayProp: string })._lastDisplayProp = info.el.parentElement.style.display;
  //     info.el.parentElement.style.display = 'none';
  //   } else {
  //     info.el.parentElement.style.display = (info as unknown as { _lastDisplayProp: string })._lastDisplayProp;
  //   }
  // }

  public static id(value: string) {
    DialogManager._id = value;
    return DialogManager;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  public static exec<T>(modal: Dialog | InteractiveDialog, fetchData?: () => Promise<any>): Promise<T> {
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
        id: uniqueID(6, '0-9'),
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
        id: uniqueID(6, '0-9'),
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
        id: uniqueID(6, '0-9'),
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
