import { IDialogProps, IHostObject, IInterativeDialogProps } from '@/types/dialogs';

export class Dialog {
  title: string;
  content: string;
  pressEnterAsOk: boolean;
  pressEscAsCancel: boolean;
  hostObject: IHostObject;
  size: 's' | 'm' | 'l';
  width: string | number;
  height: string | number;
  css: string;
  align: 'left' | 'right';
  constructor(data: IDialogProps) {
    this.title = data.title;
    this.content = data.content;
    this.pressEnterAsOk = data.pressEnterAsOk !== false;
    this.pressEscAsCancel = data.pressEscAsCancel !== false;
    this.hostObject = data.hostObject;
    this.size = data.size || 's';
    this.width = data.width;
    this.height = data.height;
    this.align = data.align;
    this.css = data.css;
  }
}

export class AlertDialog extends Dialog {
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  __constructor: string;

  constructor(data: IDialogProps) {
    super({
      ...data,
    });
    this.__constructor = 'AlertDialog';
  }
}

export class PromptDialog extends Dialog {
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  __constructor: string;

  constructor(data: IDialogProps) {
    super({
      ...data,
    });
    this.__constructor = 'PromptDialog';
  }
}

/* interactive dialogs */

export class InteractiveDialog extends Dialog {
  loading: boolean;
  fullHeight: boolean;
  closable: boolean;
  hideFooter: boolean;
  okTitle: string;
  cancelTitle: string;
  okColor: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'grey';
  cancelColor: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'grey';
  constructor(data: IInterativeDialogProps) {
    super({
      ...data,
    });
    this.loading = data.loading;
    this.fullHeight = data.fullHeight;
    this.closable = data.closable;
    this.hideFooter = data.hideFooter;
    this.okTitle = data.okTitle;
    this.cancelTitle = data.cancelTitle;
    this.okColor = data.okColor || 'primary';
    this.cancelColor = data.cancelColor || 'primary';
  }
}

export class ConfirmDialog extends InteractiveDialog {
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  __constructor: string;

  okResult?: number | string | boolean;
  cancelResult?: number | string | boolean;
  constructor(
    data: IInterativeDialogProps & {
      okResult?: number | string | boolean;
      cancelResult?: number | string | boolean;
    }
  ) {
    super({
      ...data,
    });
    this.__constructor = 'ConfirmDialog';
    this.okResult = data.okResult;
    this.cancelResult = data.cancelResult;
  }
}

export class InfoDialog extends InteractiveDialog {
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  __constructor: string;

  component: string;
  componentProps: Record<string, unknown>;
  minimizable: boolean;
  description: string;
  help: boolean;
  constructor(
    data: IInterativeDialogProps & {
      component: string;
      componentProps: Record<string, unknown>;
      minimizable?: boolean;
      description?: string;
      help?: boolean;
    }
  ) {
    super({
      ...data,
    });
    this.__constructor = 'InfoDialog';
    this.component = data.component;
    this.componentProps = data.componentProps;
    this.minimizable = data.minimizable;
    this.description = data.description;
    this.help = data.help;
  }
}

export class SelectDialog<T> extends InteractiveDialog {
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  __constructor: string;

  component: string;
  componentProps: {
    disabledItems: Array<T | number | string>;
    selectedItems: Array<T | number | string>;
    /**
     * Активирует возможность поиска по списку
     */
    searchable?: boolean;
    /**
     * Массив полей, по которым необходим поиск
     * в случае searchable = true, наличие массива обязательно
     */
    searchFields?: string[];
    isTree?: boolean;
    multiselect?: boolean;
    [key: string]: unknown;
  };
  selectAsOk: boolean;
  help: boolean;
  constructor(
    data: IInterativeDialogProps & {
      component: string;
      componentProps: {
        disabledItems: Array<T | number | string>;
        selectedItems: Array<T | number | string>;
        searchable?: boolean;
        searchFields?: string[];
        isTree?: boolean;
        multiselect?: boolean;
        [key: string]: unknown;
      };
      selectAsOk?: boolean;
      help?: boolean;
    }
  ) {
    super({
      ...data,
    });
    this.__constructor = 'SelectDialog';
    this.component = data.component;
    this.componentProps = data.componentProps;
    this.selectAsOk = data.selectAsOk;
    this.help = data.help;
  }
}

export class CreateEditDialog<T> extends InteractiveDialog {
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  __constructor: string;

  component: string;
  componentProps: {
    model: T;
    [key: string]: unknown;
  };

  expandable?: boolean;
  minimizable?: boolean;
  collapsedSize?: {
    width: string | number;
    height: string | number;
    noModal?: boolean;
  };
  expandedSize?: {
    width: string | number;
    height: string | number;
    noModal?: boolean;
  };
  expanded?: boolean;
  description?: string;
  noModal?: boolean;
  help?: boolean;
  constructor(
    data: IInterativeDialogProps & {
      component: string;
      componentProps: {
        model: T;
        [key: string]: unknown;
      };
      expandable?: boolean;
      minimizable?: boolean;
      collapsedSize?: {
        width: string | number;
        height: string | number;
        noModal?: boolean;
      };
      expandedSize?: {
        width: string | number;
        height: string | number;
        noModal?: boolean;
      };
      expanded?: boolean;
      description?: string;
      noModal?: boolean;
      help?: boolean;
    }
  ) {
    super({
      ...data,
    });
    this.__constructor = 'CreateEditDialog';
    this.component = data.component;
    this.componentProps = data.componentProps;
    this.expandable = data.expandable;
    this.minimizable = data.minimizable;
    this.collapsedSize = data.collapsedSize;
    this.expandedSize = data.expandedSize;
    this.expanded = data.expanded;
    this.description = data.description;
    this.noModal = data.noModal;
    this.help = data.help;
  }
}
