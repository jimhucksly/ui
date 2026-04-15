import fs from 'fs/promises';
import path from 'path';
import {
  awaiting,
  base64,
  datetime,
  deepValueGetter,
  delay,
  files,
  fileToArrayBuffer,
  isDefined,
  isObjectEmpty,
  pluralizeNoun,
  strings,
  uidGen,
} from '@/index';
import { arrayBufferToUint8Array, fileToBase64, uint8ArrayToBase64 } from '@/utils/converting';

describe('Utils:awaiting', () => {
  it('ok', async () => {
    let a = 0;
    async function func() {
      await delay(3000);
      a = 1;
    }
    func();
    await awaiting(() => a === 1);
    expect(a).toEqual(1);
  });
});

describe('Utils:base64', () => {
  it('ok', () => {
    const value = 'ABCD';
    const encode = base64.encode(value);
    expect(base64.isValid(encode)).toBeTruthy();
    expect(base64.decode(encode)).toEqual(value);
  });
});

describe('Utils:converting', () => {
  it('ok', async () => {
    const value = 'ABCD';
    const filePath = path.resolve(__dirname, 'file.txt');
    await fs.writeFile(filePath, value, 'utf-8');
    const contents = fs.readFile(filePath, { encoding: 'utf-8' });
    const blob = new Blob([await contents], { type: 'text/plain' });
    const file = new File([blob], 'file.txt', { type: 'text/plain' });
    const ab = await fileToArrayBuffer(file);
    const u = arrayBufferToUint8Array(ab);
    const b64 = uint8ArrayToBase64(u);
    expect(b64).toEqual(await fileToBase64(file));
    expect(base64.decode(b64)).toEqual(value);
    await fs.rm(filePath);
  });
});

describe('Utils:deepValueGetter', () => {
  it('ok', () => {
    const value = {
      key1: {
        key2: {
          key3: 1,
        },
      },
    };
    expect(deepValueGetter(value, 'key1.key2.key3')).toEqual(1);
    expect(deepValueGetter(value, 'key1.key4')).toEqual('');
  });
});

describe('Utils:isDefined', () => {
  it('ok', () => {
    expect(isDefined(Number('a'))).toBeFalsy();
    const value: Record<string, unknown> = {
      key1: {
        key2: {
          key3: '',
          key5: false,
        },
      },
      key4: null,
    };
    expect(isDefined(value['key5'])).toBeFalsy();
    expect(isDefined(value['key4'])).toBeFalsy();
    expect(isDefined(deepValueGetter(value, 'key1.key2.key3'))).toBeTruthy();
    expect(isDefined(deepValueGetter(value, 'key1.key2.key5'))).toBeTruthy();
  });
});

describe('Utils:isObjectEmpty', () => {
  it('ok', () => {
    const value: Record<string, unknown> = {
      key1: {},
    };
    expect(isObjectEmpty(value)).toBeFalsy();
    expect(isObjectEmpty({})).toBeTruthy();
  });
});

describe('Utils:pluralizeNoun', () => {
  it('ok', () => {
    expect(pluralizeNoun(1, 'документ', 'документа', 'документов', true)).toEqual('1 документ');
    expect(pluralizeNoun(21, 'документ', 'документа', 'документов', true)).toEqual('21 документ');
    expect(pluralizeNoun(101, 'документ', 'документа', 'документов', true)).toEqual('101 документ');
    expect(pluralizeNoun(2, 'документ', 'документа', 'документов', true)).toEqual('2 документа');
    expect(pluralizeNoun(52, 'документ', 'документа', 'документов', true)).toEqual('52 документа');
    expect(pluralizeNoun(102, 'документ', 'документа', 'документов', true)).toEqual('102 документа');
    expect(pluralizeNoun(5, 'документ', 'документа', 'документов', true)).toEqual('5 документов');
    expect(pluralizeNoun(11, 'документ', 'документа', 'документов', true)).toEqual('11 документов');
    expect(pluralizeNoun(111, 'документ', 'документа', 'документов', true)).toEqual('111 документов');
    expect(pluralizeNoun(148, 'документ', 'документа', 'документов', true)).toEqual('148 документов');
  });
});

describe('Utils:strings', () => {
  it('ok', () => {
    const value = 'string convert to camel case';
    expect(strings.camelCase(value)).toEqual('stringConvertToCamelCase');
    expect(strings.capitalize(strings.camelCase(value))).toEqual('StringConvertToCamelCase');
  });
});

describe('Utils:datetime', () => {
  it('ok', () => {
    expect(datetime.isDate('2025-10-15')).toBeTruthy();
    expect(datetime.isDate('abc')).toBeFalsy();
    expect(datetime.isISO('2025-10-15T00:00:00')).toBeTruthy();
    expect(datetime.isISO('2025-10-15T00:00:00.000Z')).toBeTruthy();
    expect(datetime.localToISO('15.10.2025', 'ru')).toEqual('2025-10-15T00:00:00.000Z');
    expect(datetime.localToISO('10/15/2025', 'en')).toEqual('2025-10-15T00:00:00.000Z');
    expect(datetime.dateToLocal('2025-10-15T00:00:00', 'ru')).toEqual('15.10.2025');
    expect(datetime.dateToLocal('2025-10-15T00:00:00', 'en')).toEqual('10/15/2025');
    let a = '15.10.2025';
    let b = '15.10.2025';
    expect(datetime.compare(datetime.localToISO(a), b)).toEqual(0);
    a = '15.10.2025, 13:25';
    b = '15.10.2025, 13:26';
    expect(datetime.strictCompare(datetime.localToISO(a), datetime.localToISO(b))).toEqual(-1);
    expect(datetime.strictCompare(datetime.localToISO(b), datetime.localToISO(a))).toEqual(1);
    expect(datetime.compare(datetime.localToISO(a), datetime.localToISO(b))).toEqual(0);
    const d = new Date(2025, 9, 15, 14, 45, 53);
    expect(datetime.toServerString(d)).toEqual('2025-10-15T14:45:53+03:00');
  });
});

describe('Utils:uid-generator', () => {
  it('ok', () => {
    expect(uidGen(6).toString().length).toEqual(6);
    expect(typeof uidGen(6, '0-9')).toEqual('number');
  });
});

describe('Utils:files', () => {
  it('ok', () => {
    const value = 'filename.mixin.docx';
    expect(files.getExtension(value)).toEqual('docx');
    expect(files.getFileName(value)).toEqual('filename.mixin');
    expect(files.formatSize(811497)).toEqual('792.48KB');
  });
});
