export interface IDialogProps {
  title: string;
  content?: string;
  pressEnterAsOk?: boolean;
  pressEscAsCancel?: boolean;
  hostObject?: IHostObject;
  size?: 's' | 'm' | 'l';
  width?: string | number;
  height?: string | number;
  css?: string;
  align?: 'left' | 'right';
}

export interface IInterativeDialogProps extends IDialogProps {
  loading?: boolean;
  fullHeight?: boolean;
  okTitle?: string;
  cancelTitle?: string;
  okColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'grey';
  cancelColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'grey';
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
  content?: string;
  loading?: boolean;
  component?: string;
  componentProps?: Record<string, unknown>;
  selectAsOk?: boolean;
  okTitle?: string;
  cancelTitle?: string;
  okColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'grey';
  cancelColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'grey';
  okResult?: number | string | boolean | IModalResult<IViewModel<number | string>>;
  cancelResult?: number | string | boolean | IModalResult<IViewModel<number | string>>;
  settedResult?: boolean;
  hideFooter?: boolean;
  size?: DialogSize;
  width?: number | string;
  height?: number | string;
  fullHeight?: boolean;
  align?: 'left' | 'right';
  css?: string;
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

enum ModalType {
  Alert,
  Prompt,
  Info,
  Confirm,
  Select,
  CreateEdit,
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
    public hostObject?: IHostObject,
    public size?: 's' | 'm' | 'l',
    public width?: string | number,
    public height?: string | number,
    public css?: string,
    public align?: 'left' | 'right'
  ) {}
}

export class InteractiveDialog extends Dialog {
  loading: boolean;
  fullHeight: boolean;
  closable: boolean;
  hideFooter: boolean;
  constructor(data: IInterativeDialogProps) {}
}

export class AlertDialog extends Dialog {
  constructor(data: IDialogProps) {}
}

export class PromptDialog extends Dialog {
  constructor(data: IDialogProps);
}

export class ConfirmDialog extends InteractiveDialog {
  okResult?: number | string | boolean;
  cancelResult?: number | string | boolean;
  constructor(
    data: IInterativeDialogProps & {
      okResult?: number | string | boolean;
      cancelResult?: number | string | boolean;
    }
  ) {}
}

export class InfoDialog extends InteractiveDialog {
  component: string;
  componentProps: Record<string, unknown>;
  fullHeight?: boolean;
  hideFooter?: boolean;
  minimizable?: boolean;
  description?: string;
  help?: boolean;
  constructor(
    data: IInterativeDialogProps & {
      component: string;
      componentProps: Record<string, unknown>;
      fullHeight?: boolean;
      minimizable?: boolean;
      description?: string;
      help?: boolean;
    }
  );
}

export class SelectDialog<T> extends InteractiveDialog {
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
  selectAsOk?: boolean;
  help?: boolean;
  constructor(
    data: IInterativeDialogProps & {
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
      selectAsOk?: boolean;
      help?: boolean;
    }
  );
}

export class CreateEditDialog<T> extends InteractiveDialog {
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
  );
}
