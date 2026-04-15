* Usage

**awaiting**
```js
import { awaiting } from '@ldmjs/ui';
async function() {
  let a = 0;
  setTimeout(() => {
    a = 1;
  }, 3000)
  await awaiting(() => a === 1);
  console.log(a) // 1;
}

/* для использования в компонентах vue */
this.$utils.awaiting();
```

**isDefined**
```js
import { isDefined } from '@ldmjs/ui';
isDefined(a); // if a = null (undefined, NaN) => isDefined(a) === false

/* для использования в компонентах vue */
this.$utils.isDefined();
```

**uidGen**
```js
/**
 * создангие уникального ключа по формату: 'a-z', 'A-Z', '0-9', 'a-zA-Z', 'a-z0-9'
 */
import { uidGen } from '@ldmjs/ui';
uidGen();

/* для использования в компонентах vue */
this.$utils.uidGen();
```

**delay**
```js
import { delay } from '@ldmjs/ui';
async function() {
  await delay(1000);
}

/* для использования в компонентах vue */
this.$utils.delay();
```

**deepValueGetter**
```js
/**
 * возвращает значение по вложенному ключу объекта
 */
import { deepValueGetter } from '@ldmjs/ui';
const Record = {
  Key1: {
    Key2: {
      Key3: value
    }
  }
}
const value = deepValueGetter(Record, 'Key1.Key2.Key3');

/* для использования в компонентах vue */
this.$utils.deepValueGetter();
```

**removeDuplicates**
```js
/* удаляет из массива объекты с повторяющимися значениями в полях по ключу */
import { removeDuplicates } from '@ldmjs/ui';
const arr = [
  {
    record: 1,
    company: 'lanit'
  },
  {
    record: 2,
    company: 'lanit'
  }
];
const value = removeDuplicates(arr, 'value'); // arr = [ { record: 1, company: 'lanit'} ]

/* для использования в компонентах vue */
this.$utils.removeDuplicates();
```

**isObjectEmpty**
```js
import { isObjectEmpty } from '@ldmjs/ui';
const obj = {};
isObjectEmpty(obj) // true

/* для использования в компонентах vue */
this.$utils.isObjectEmpty();
```

**pluralizeNoun**
```js
/**
 * @param num кол-во элементов
 * @param one название в единичном варианте (1 элемент, 21 элемент и тд)
 * @param two название в двоичном варианте (2 элемента, 3 элемента и тд)
 * @param five название во множественном варианте (5 элементов, много элементов)
 * @param printNum выводить ли кол-во
 *
 * function pluralizeNoun(
 *  num: string | number,
 *  one: string,
 *  two: string,
 *  five: string,
 *  printNum?: boolean
 * ): string;
 */
import { pluralizeNoun } from '@ldmjs/ui';
pluralizeNoun(count, 'элемент', 'элемента', 'элементов');

/* для использования в компонентах vue */
this.$utils.pluralizeNoun();
```

**Stream data converting**
```js
/* convert File or Blob to ArrayBuffer */
function fileToArrayBuffer(value: File | Blob): Promise<ArrayBuffer>;
/* convert File or Blob to Base64 */
function fileToBase64(value: File | Blob): Promise<string>;
/* convert Base64 string to Uint8Array */
function base64ToUint8Array(base64: string): Uint8Array;
/* convert Uint8Array to Hexadecimal system */
function uint8ArrayToHex(bytes: Uint8Array): string;
/* convert a hex string to an ArrayBuffer */
function hexToArrayBuffer(hex: string): Array<number>;
/* convert Uint8Array to Base64 */
function uint8ArrayToBase64(value: Uint8Array): string
/* convert ArrayBuffer to Uint8Array */
function arrayBufferToUint8Array(value: ArrayBuffer): Uint8Array;
```

**Cookie**
```js
/**
 * get: (key: string) => string;
 */
this.$utils.cookie.get()
/**
 * set: (key: string, value: string, expires?: string) => void;
 */
this.$utils.cookie.set()
/**
 * delete: (key: string) => void;
 */
this.$utils.cookie.delete()
```

**Base64**
```js
/**
 * encode: (input: string) => string;
 */
this.$utils.base64.encode()
/**
 * decode: (input: string) => string;
 */
this.$utils.base64.decode()
/**
 * isValid: (input: string) => boolean;
 */
this.$utils.base64.isValid()
```

**String utils**
```js
/**
 * camelCase: (str: string) => string;
 */
this.$utils.strings.camelCase()
  /**
 * capitalize: (str: string) => string;
 */
this.$utils.strings.capitalize()
```

**File utils**
```js
/**
 * getExtension: (filename: string) => string;
 * @param {String} filename
 * @return {String} расширение файла без начальной точки
 */
this.$utils.files.getExtension(filename)
/**
 * getFileName: (filename: string) => string;
 * @param {String} filename
 * @return {String} имя файла
 */
this.$utils.files.getFileName(filename)
/**
 * getFileName: (value: string | number) => string;
 * @param {String} size размер файла в байтах
 * @return {String} строковое описание размера файла в байтах, килобайтах, и т. д.
 * z.B. this.$utils.files.formatSize(811497) => '792.48 KB'
 */
this.$utils.files.formatSize(size: string | number)
```

**Datetime utils**
```js
  /**
  * проверяет переданное значение на дату
  */
  this.$utils.datetime.isDate(value: string | Date): boolean;
  /**
   * Проверяет переданную строку на соответствие формату ISO
   */
  this.$utils.datetime.isISO(value: string): boolean;
  /**
   * Конвертация входящиего значения в объект даты. Возможные типы входящего значения:
   * a instanceof Date:           вернуть без преобразований
   * typeof a === 'array':        интерпретируем как [year,month,day], month - 0-11
   * typeof a === 'number:        интерпретируем как милисекунды от 1 Jan 1970 (timestamp)
   * typeof a === 'string':       любой валидный формат даты в строковом представлении
   * typeof a === 'object':       интерпретируем как объект
   *                                {
   *                                    year: number;
   *                                    month: number;
   *                                    date: number;
   *                                    hours?: number;
   *                                    minutes?: number;
   *                                    seconds?: number;
   *                                    ms?: number
   *                                }
   * @param {Date, String, Array, Object} d
   * @return {Date}
   */
  this.$utils.datetime.toDate(d: DatetimeValueRaw)
  /**
   * @param {String} value
   * @return {String} date as ISO string
   */
  this.$utils.datetime.localToISO(value: string, locale: string = 'ru'): string
  /**
   * @param {String, Date} value
   * @param {String} locale
   * @return {String} date as local string
   */
  this.$utils.datetime.dateToLocal(value: string | Date, locale: string = 'ru'): string
  /**
   * Сравнение двух дат (strict = true - с учетом времени)
   * -1 : if a < b
   *  0 : if a = b
   *  1 : if a > b
   *  NaN - если a или b не являются объектом даты
   * @param {Date, String, Array, Object} a
   * @param {Date, String, Array, Object} b
   * @param {Boolean} strict
   * @return {Number}
   */
  this.$utils.datetime.compare(a: DatetimeValueRaw, b: DatetimeValueRaw, strict: boolean = false): number
  /**
   * Сравнение двух дат с учетом времени
   */
  this.$utils.datetime.strictCompare(a: DatetimeValueRaw, b: DatetimeValueRaw): number
  /**
   * Преобразует дату к формату yyyy-MM-ddThh:mm:ss+hh:mm (например, 2020-11-24T12:47:45+03:00)
   * @param {Date} dt
   * @return {String}
   */
  this.$utils.datetime.toServerString(dt: Date): string
  /**
   * Преобразует дату к формату по заданному шаблону
   * например, 'DD.MM.YYYY, hh:mm:ss'
   * @param {Date} dt
   * @param {String} format
   * @return {String}
   */
  this.$utils.datetime.formatDate(dt: Date, format: string): string
```
