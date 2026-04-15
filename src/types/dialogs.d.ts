export interface IDialogProps {
  title: string;
  content?: string;
  pressEnterAsOk?: boolean;
  pressEscAsCancel?: boolean;
  hostObject?: IHostObject;
  size?: string;
  width?: string | number;
  height?: string | number;
  align?: 'left' | 'right';
}

export interface IInterativeDialogProps extends IDialogProps {
  loading?: boolean;
  fullHeight?: boolean;
  okTitle?: string;
  cancelTitle?: string;
  closable?: boolean;
  hideFooter?: boolean;
}

export interface IViewModel<T> {
  id: T;
  name: string;
  title?: string;
}

export interface IHostObject {
  contentType: unknown;
  id: number | string;
  kind: unknown;
  parentId?: number | string;
}

export interface IModalResult<T> {
  button: ModalButton;
  data: T;
}

export interface IModalData<T> {
  component: string;
  componentProps: T;
}

export interface IModalInfo {
  title: string;
  type: ModalType;
  description?: string | (() => string);
  processingDescription?: string | (() => string);
  el?: HTMLElement;
  managerId?: string;
  pressEnterAsOk?: boolean;
  pressEscAsCancel?: boolean;
  hostObject?: IHostObject;
  /**
   * Окно немодальное - это начит окно отображается поверх контента страницы и не ограничивает пользователя
   * во взатмодействии со страницей.
   * Окно модальное - это значит окно отображается поверх контента страницы, возможно с затемненным фоном,
   * ограничивая пользователя в действиях, пока окно не будет закрыто
   */
  noModal?: boolean;
  darkTitle?: boolean;
  content?: string;
  loading?: boolean;
  component?: string;
  componentProps?: Record<string, unknown>;
  selectAsOk?: boolean;
  okTitle?: string;
  cancelTitle?: string;
  okResult?: number | string | boolean | IModalResult<IViewModel<number | string>>;
  cancelResult?: number | string | boolean | IModalResult<IViewModel<number | string>>;
  hideFooter?: boolean;
  size?: DialogSize;
  width?: number | string;
  height?: number | string;
  fullHeight?: boolean;
  align?: 'left' | 'right';
  closable?: boolean;
  expandable?: boolean;
  minimizable?: boolean;
  expanded?: boolean;
  minimized?: boolean;
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
  help?: boolean;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  resolveFunction?: (data?: any) => void;
  /**
   *  ф-ция, вызываемая для определения того, были ли изменения в диалоге
   */
  isChanged?: () => boolean;
}

export interface IModalWindow extends IModalInfo {
  id: number;
  type: ModalType;
  show: boolean;
  visible: boolean;
  component?: string;
  componentInstance?: {
    save?(): void;
    onClose?(): void | Promise<boolean>;
  };
  okLoading: boolean;
  okOnly: boolean;
  okDisabled: boolean;
  resolved: boolean;
  retainFocus: boolean;
  okTitle: string;
}

export type ModalWindow = IModalWindow<IViewModel<number | string>>;

export class Dialog {
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  readonly __constructor: string;
  constructor(
    public title: string,
    public content?: string,
    public pressEnterAsOk?: boolean,
    public pressEscAsCancel?: boolean,
    public hostObject?: IHostObject
  ) {}
}

export class AlertDialog extends Dialog {
  constructor(data: {
    title: string;
    content: string;
    pressEnterAsOk?: boolean;
    pressEscAsCancel?: boolean;
    hostObject?: IHostObject;
  });
}

export class PromptDialog extends Dialog {
  width?: string;
  constructor(data: {
    title: string;
    width?: string;
    pressEnterAsOk?: boolean;
    pressEscAsCancel?: boolean;
    hostObject?: IHostObject;
  });
}

export class ConfirmDialog extends Dialog {
  okTitle?: string;
  cancelTitle?: string;
  okResult?: number | string | boolean;
  cancelResult?: number | string | boolean;
  constructor(data: {
    title: string;
    text: string;
    okTitle?: string;
    cancelTitle?: string;
    okResult?: number | string | boolean;
    cancelResult?: number | string | boolean;
    pressEnterAsOk?: boolean;
    pressEscAsCancel?: boolean;
    hostObject?: IHostObject;
  });
}

export class InfoDialog extends Dialog {
  component: string;
  componentProps: Record<string, unknown>;
  width?: string;
  height?: string;
  fullHeight?: boolean;
  loading?: boolean;
  closable?: boolean;
  hideFooter?: boolean;
  minimizable?: boolean;
  description?: string;
  help?: boolean;
  constructor(data: {
    title: string;
    component: string;
    componentProps: Record<string, unknown>;
    width?: string;
    height?: string;
    fullHeight?: boolean;
    loading?: boolean;
    closable?: boolean;
    hideFooter?: boolean;
    minimizable?: boolean;
    description?: string;
    pressEnterAsOk?: boolean;
    pressEscAsCancel?: boolean;
    hostObject?: IHostObject;
    help?: boolean;
  });
}

export class SelectDialog<T> extends Dialog {
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
  loading?: boolean;
  fullHeight?: boolean;
  width?: string | number;
  height?: string | number;
  selectAsOk?: boolean;
  okTitle?: string;
  cancelTitle?: string;
  help?: boolean;
  constructor(data: {
    title: string;
    component: string;
    componentProps: {
      disabledItems: Array<T | number | string>;
      selectedItems: Array<T | number | string>;
      searchable?: boolean;
      searchFields?: Array<string>;
      isTree?: boolean;
      multiselect?: boolean;
      [key: string]: unknown;
    };
    loading?: boolean;
    fullHeight?: boolean;
    width?: string | number;
    height?: string | number;
    selectAsOk?: boolean;
    okTitle?: string;
    cancelTitle?: string;
    pressEnterAsOk?: boolean;
    pressEscAsCancel?: boolean;
    hostObject?: IHostObject;
    help?: boolean;
  });
}

export class CreateEditDialog<T> extends Dialog {
  component: string;
  componentProps: {
    model: T;
    [key: string]: unknown;
  };
  loading?: boolean;
  fullHeight?: boolean;
  width?: string | number;
  height?: string | number;
  hideFooter?: boolean;
  darkTitle?: boolean;
  closable?: boolean;
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
  okTitle?: string;
  cancelTitle?: string;
  help?: boolean;
  constructor(data: {
    title: string;
    component: string;
    componentProps: {
      model: T;
      [key: string]: unknown;
    };
    loading?: boolean;
    fullHeight?: boolean;
    width?: string | number;
    height?: string | number;
    hideFooter?: boolean;
    darkTitle?: boolean;
    closable?: boolean;
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
    okTitle?: string;
    cancelTitle?: string;
    pressEnterAsOk?: boolean;
    pressEscAsCancel?: boolean;
    hostObject?: IHostObject;
    help?: boolean;
  });
}
