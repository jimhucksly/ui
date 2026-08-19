import { IHostObject, IModalWindow } from '@/types/dialogs';

export enum ModalType {
  Alert,
  Prompt,
  Info,
  Confirm,
  Select,
  CreateEdit,
}

export default class DialogLayers {
  private readonly layers: Map<number, Array<IModalWindow>> = new Map();

  constructor() {
    this.layers.set(-1, []);
    this.layers.set(0, []);
  }

  modalIdentity(modal: IModalWindow, host: IHostObject) {
    if (!modal.hostObject || !host) {
      return false;
    }
    return modal.hostObject?.id === host?.id;
  }

  getLayers(): Array<number> {
    return Array.from(this.layers.keys());
  }

  getTopLayer(): number {
    return Math.max(...this.getLayers());
  }

  protected add(info: IModalWindow): void {
    let topLayer = Math.max(...this.getLayers());
    if (info.hostObject.parentId || [ModalType.Alert, ModalType.Confirm].includes(info.type)) {
      topLayer++;
      info.hostObject.index = 0;
      info.hostObject.layer = topLayer;
      this.layers.set(topLayer, [info]);
    } else {
      const layer = info.minimized ? -1 : topLayer;
      const values = this.layers.get(layer);
      info.hostObject.index = values.length;
      info.hostObject.layer = layer;
      this.layers.set(layer, values.concat(info));
    }
  }

  protected get(layer: number): Array<IModalWindow> {
    return this.layers.get(layer);
  }

  protected remove(info: IModalWindow): void {
    const values = this.layers.get(info.hostObject.layer);
    values.splice(info.hostObject.index, 1);
    if (values.length) {
      this.layers.set(
        info.hostObject.layer,
        values.map((v, i) => {
          v.hostObject.index = i;
          return v;
        })
      );
    } else if (info.hostObject.layer > 0) {
      this.layers.delete(info.hostObject.layer);
    } else {
      this.layers.set(info.hostObject.layer, []);
    }
  }

  protected up(info: IModalWindow): void {
    if (this.layers.get(info.hostObject.layer).length === 1) {
      return;
    }
    this.remove(info);
    info.hostObject.layer = info.hostObject.layer + 1;
    info.hostObject.index = 0;
    this.layers.set(info.hostObject.layer, [info]);
  }

  protected down(info: IModalWindow): void {
    if (info.hostObject.layer === 0) {
      return;
    }
    this.remove(info);
    info.hostObject.layer = info.hostObject.layer - 1;
    const values = this.layers.get(info.hostObject.layer);
    info.hostObject.index = values.length;
    this.layers.set(info.hostObject.layer, values.concat(info));
  }

  protected _all(): Array<IModalWindow> {
    const result: Array<IModalWindow> = [];
    for (const layer of this.getLayers()) {
      result.push(...this.layers.get(layer));
    }
    return result;
  }

  protected _visibled(): Array<IModalWindow> {
    const result: Array<IModalWindow> = [];
    for (const layer of this.getLayers().filter(k => k !== -1)) {
      result.push(...this.layers.get(layer));
    }
    return result;
  }

  protected _minimized(): Array<IModalWindow> {
    return this.layers.get(-1);
  }

  protected find(host: IHostObject): { layer: number; index: number; value: IModalWindow } {
    for (const layer of this.getLayers()) {
      const values = this.layers.get(layer);
      for (let i = 0; i < values.length; i++) {
        if (this.modalIdentity(values[i], host)) {
          return {
            layer,
            index: i,
            value: values[i],
          };
        }
      }
    }
    return {
      layer: null,
      index: null,
      value: null,
    };
  }
}
