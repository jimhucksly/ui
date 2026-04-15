import { Vue } from 'vue-property-decorator';
import { ldmuiOptions } from '@/index';
import { DatetimeValueRaw } from '@/types/calendar';
import { IToasted } from '@/types/toasted';

declare module 'vue/types/options' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends Vue> {
    functional?: boolean;
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $utils: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      awaiting: (callback: () => unknown) => Promise<any>;
      base64: {
        encode: (input: string) => string;
        decode: (input: string) => string;
        isValid: (input: string) => boolean;
      };
      cookie: {
        get: (key: string) => string;
        set: (key: string, value: string, expires?: string) => void;
        delete: (key: string) => void;
      };
      delay: (timeout: number) => Promise<void>;
      deepValueGetter: (obj: Record<string, unknown>, path: string) => unknown;
      removeDuplicates: (arr: Array<Record<string, unknown>>, key: string) => Array<Record<string, unknown>>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isDefined: (value: any) => boolean;
      isObjectEmpty: (obj: Record<string, unknown>) => boolean;
      pluralizeNoun: (num: string | number, one: string, two: string, five: string, printNum?: boolean) => string;
      strings: {
        camelCase: (str: string) => string;
        capitalize: (str: string) => string;
      };
      datetime: {
        isDate: (value: string | Date) => boolean;
        isISO: (value: string) => boolean;
        toDate: (value: unknown, locale: string) => Date;
        localToISO: (value: string, locale: string) => string;
        dateToLocal: (value: unknown, locale: string) => string;
        compare: (a: DatetimeValueRaw, b: DatetimeValueRaw, strict?: boolean) => number;
        strictCompare: (a: Date, b: Date) => number;
        toServerString: (dt: Date) => string;
        formatDate: (date: Date, format: string) => string;
      };
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
    };
    $ldmuii18n: {
      library: Record<string, string>;
      gettext: (value: string) => string;
    };
    $toasted: IToasted;
    isDev: boolean;
  }
}

declare module 'vue/types/options' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends Vue> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $options?: any;
  }
}
