import { Vue } from 'vue-class-component';
import { IOptions } from './types/options';
import { IToasted } from './types/toasted';
import { IInput, IWatcher } from './types/validation';
import { Dialog } from './types/dialogs';

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $ui: {
      options: IOptions;
    },
    $i18n: {
      library: Record<string, string>;
      gettext: (value: string) => string;
    },
    $toasted: IToasted;
  }
}
export declare const defaults: Record<string, unknown>;
export declare class ValidateMixin extends Vue {
  inputs: Array<IInput>;
  watchers: Array<IWatcher>;
  errorBag: Record<number, boolean>;
  lazyValidation: boolean;
  isValid: boolean;
  section: number | string;
  validate: () => boolean;
  register: (input: Vue, section: number | string) => void;
  unregister: (input: IInput) => void;
  validateSection: (section: number | string) => boolean;
  customValidateFunc: () => string | boolean;
}
export declare const ValidateMixinOptions: Record<string, any>;

export declare class DialogManager {
  static exec<T>(modal: Dialog, fetchData?: () => Promise<any>): Promise<T>;
  static id: (value: string) => typeof DialogManager
}

declare const ui: {
  install(vue: any, options?: IOptions): void;
}
export default ui;

declare const i18n: {
  install(vue: any, value?: string): void;
}
export {
  i18n
}
export {
  AlertDialog,
  ConfirmDialog,
  PromptDialog,
  InfoDialog,
  SelectDialog,
  CreateEditDialog,
} from './types/dialogs';
export {
  ModalButton,
  ModalType
} from './ld-dialog/dialog.manager';
export {
  IIteratorRemovedItem,
  IIteratorSortField
} from './types/iterator';
export {
  IPagerOptions
} from './types/pager';
export {
  ValidateFunction
} from './types/validation';
export {
  validators
} from './types/validators';
export {
  requiredRule,
  maxLengthRule,
  alphaRule,
  alphaNumRule,
  betweenRule,
  decimalRule,
  emailRule,
  integerRule,
  ipAddressRule,
  macAddressRule,
  maxValueRule,
  minValueRule,
  numericRule,
  urlRule,
  phoneRule,
} from './types/validators';
