import { ModalWindow } from '@/types/dialogs';

export class DialogListeners {
  private readonly listeners: Map<ModalWindow, (e: KeyboardEvent) => void> = new Map();

  private readonly modals: Array<ModalWindow> = [];

  set(modal: ModalWindow, handler: (e: KeyboardEvent) => void) {
    this.modals.push(modal);
    this.listeners.set(modal, handler);
    window.addEventListener('keydown', handler);
  }

  remove(modal: ModalWindow) {
    const index = this.modals.findIndex(item => item.id === modal.id);
    if (index > -1) {
      this.modals.splice(index, 1);
    }
    if (this.listeners.has(this.modals[index])) {
      const handler = this.listeners.get(this.modals[index]);
      window.removeEventListener('keydown', handler);
      this.listeners.delete(this.modals[index]);
    }
  }

  isLast(modal: ModalWindow): boolean {
    if (!this.last) {
      return false;
    }
    return modal.id === this.last.id;
  }

  private get last(): ModalWindow {
    return this.modals[this.modals.length - 1];
  }
}
