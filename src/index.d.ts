import { Vue } from 'vue-class-component';
import { ldmuiOptions } from './types/options';
import { IToasted } from './types/toasted';
import { IInput, IWatcher } from './types/validation';
import { Dialog } from './types/dialogs';

/**
 * awaiting any event
 * use:
 * async function() {
 *  let a = 0;
 *  setTimeout(() => {
 *    a = 1;
 *  }, 3000)
 *  await awaiting(() => a === 1);
 *  console.log(a) // 1;
 * }
 */
export declare function awaiting(callback: () => unknown): Promise<any>;
/**
 * a = null (undefined, NaN) => isDefined(a) // false
 */
export declare function isDefined(value: unknown): boolean;
/**
 * generate an unique id by a format: 'a-z', 'A-Z', '0-9', 'a-zA-Z', 'a-z0-9', all)
 */
export declare function uidGen(len?: number, format?: string): string | number;
/**
 * async function() {
 *   await delay(1000);
 * }
 */
export declare function delay(timeout: number): Promise<void>;
/**
 * returns a deep object given a string
 * use:
 * Record.Key1.Key2.Key3 = Value;
 * const value = deepValueGetter(Record, 'Key1.Key2.Key3');
 */
export declare function deepValueGetter(obj: Record<string, unknown>, path: string): unknown;
/**
 * const obj = {};
 * isObjectEmpty(obj) // true
 */
export declare function isObjectEmpty(obj: Record<string, unknown>): boolean;

/**
 * @param num кол-во элементов
 * @param one название в единичном варианте (1 элемент, 21 элемент и тд)
 * @param two название в двоичном варианте (2 элемента, 3 элемента и тд)
 * @param five название во множественном варианте (5 элементов, много элементов)
 * @param printNum выводить ли кол-во
 */
export declare function pluralizeNoun(
  num: string | number,
  one: string,
  two: string,
  five: string,
  printNum?: boolean
): string;

/* convert File or Blob to ArrayBuffer */
export declare function fileToArrayBuffer(value: File | Blob): Promise<ArrayBuffer>;
/* convert File or Blob to Base64 */
export declare function fileToBase64(value: File | Blob): Promise<string>;
/* convert Base64 string to Uint8Array */
export declare function base64ToUint8Array(base64: string): Uint8Array;
/* convert Base64 string to Blob */
export declare function base64ToBlob(base64: string): Blob;
/* convert Uint8Array to Hexadecimal system */
export declare function uint8ArrayToHex(bytes: Uint8Array): string;
/* convert a hex string to an ArrayBuffer */
export declare function hexToArrayBuffer(hex: string): Array<number>;
/* convert Uint8Array to Base64 */
export declare function uint8ArrayToBase64(value: Uint8Array): string
/* convert ArrayBuffer to Uint8Array */
export declare function arrayBufferToUint8Array(value: ArrayBuffer): Uint8Array;

export declare const cookie: {
  get: (key: string) => string;
  set: (key: string, value: string, expires?: string) => void;
  delete: (key: string) => void;
}

export declare const base64: {
  encode: (input: string) => string;
  decode: (input: string) => string;
  isValid: (input: string) => boolean;
}

export declare const strings: {
  camelCase: (str: string) => string;
  capitalize: (str: string) => string;
}

export declare const datetime: {
  isDate: (value: string | Date) => boolean;
  isISO: (value: string) => boolean;
  toDate: (value: unknown, locale: string) => Date;
  localToISO: (value: string, locale: string) => string;
  dateToLocal: (value: unknown, locale: string) => string;
  compare: (a: Date, b: Date, strict?: boolean) => number;
  strictCompare: (a: Date, b: Date) => number;
  toServerString: (dt: Date) => string;
  formatDate: (date: Date, format: string) => string;
}

export declare const files: {
  getExtension: (filename: string) => string;
  getFileName: (filename: string) => string;
  formatSize: (bytes: number | string) => string;
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $utils: {
      awaiting: (callback: () => unknown) => Promise<any>;
      base64: typeof base64;
      cookie: typeof cookie;
      isDefined: (value: unknown) => boolean;
      delay: (timeout: number) => Promise<void>;
      deepValueGetter: (obj: Record<string, unknown>, path: string) => unknown;
      removeDuplicates: (arr: Array<Record<string, unknown>>, key: string) => Array<Record<string, unknown>>;
      isObjectEmpty: (obj: Record<string, unknown>) => boolean;
      pluralizeNoun: (num: string | number,one: string,two: string, five: string, printNum?: boolean) => string;
      strings: typeof strings;
      datetime: typeof datetime;
      uidGen: (len?: number, format?: string) => string | number;
      fileToArrayBuffer: (value: File | Blob) => Promise<ArrayBuffer>;
      fileToBase64: (value: File | Blob) => Promise<string>;
      base64ToUint8Array: (base64: string) => Uint8Array;
      uint8ArrayToHex: (bytes: Uint8Array) => string;
      hexToArrayBuffer: (hex: string) => Array<number>;
      uint8ArrayToBase64: (value: Uint8Array) => string;
      arrayBufferToUint8Array: (value: ArrayBuffer) => Uint8Array;
    };
    $ldmui: {
      options: ldmuiOptions;
    },
    $ldmuii18n: {
      library: Record<string, string>;
      gettext: (value: string) => string;
    },
    $toasted: IToasted;
  }
}
export declare const defaults: Record<string, unknown>;
export declare const urlRegexp: RegExp;
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

declare const ldmui: {
  install(vue: any, options?: ldmuiOptions): void;
}
export default ldmui;
declare const ldmuii18n: {
  install(vue: any, value?: string): void;
}
export {
  ldmuii18n
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
