import ComboboxService from '@/services/combobox.service';

const comboboxService = new ComboboxService();

describe('ComboboxService', () => {
  it('ComboboxService: isSimple', () => {
    expect(comboboxService.isSimple(0)).toBeTruthy();
    expect(comboboxService.isSimple('a')).toBeTruthy();
    expect(comboboxService.isSimple(true)).toBeTruthy();
    expect(comboboxService.isSimple(null)).toBeTruthy();
    expect(comboboxService.isSimple(undefined)).toBeTruthy();
    expect(comboboxService.isSimple(NaN)).toBeTruthy();
    expect(comboboxService.isSimple({ id: 1 })).toBeFalsy();
    expect(comboboxService.isSimple([1])).toBeFalsy();
  });

  it('ComboboxService: isArray', () => {
    expect(comboboxService.isArray(0)).toBeFalsy();
    expect(comboboxService.isArray('a')).toBeFalsy();
    expect(comboboxService.isArray(true)).toBeFalsy();
    expect(comboboxService.isArray(null)).toBeFalsy();
    expect(comboboxService.isArray(undefined)).toBeFalsy();
    expect(comboboxService.isArray(NaN)).toBeFalsy();
    expect(comboboxService.isArray({ id: 1 })).toBeFalsy();
    expect(comboboxService.isArray([1])).toBeTruthy();
  });

  it('ComboboxService: isObject', () => {
    expect(comboboxService.isObject(0)).toBeFalsy();
    expect(comboboxService.isObject('a')).toBeFalsy();
    expect(comboboxService.isObject(true)).toBeFalsy();
    expect(comboboxService.isObject(null)).toBeFalsy();
    expect(comboboxService.isObject(undefined)).toBeFalsy();
    expect(comboboxService.isObject(NaN)).toBeFalsy();
    expect(comboboxService.isObject({ id: 1 })).toBeTruthy();
    expect(comboboxService.isObject([1])).toBeTruthy();
  });

  it('ComboboxService: isEmpty', () => {
    expect(comboboxService.isEmpty({})).toBeTruthy();
    expect(comboboxService.isEmpty([])).toBeTruthy();
    expect(comboboxService.isEmpty({ id: 1 })).toBeFalsy();
    expect(comboboxService.isEmpty([1])).toBeFalsy();
  });

  it('ComboboxService: isStrictEqual', () => {
    const p = [
      {
        id: 0,
        value: 'item-0',
      },
      {
        id: 1,
        value: 'item-1',
      },
    ];

    const q = [
      {
        id: 1,
        value: 'item-1',
      },
      {
        id: 0,
        value: 'item-0',
      },
    ];

    expect(comboboxService.isStrictEqual(p, q)).toBeFalsy();
  });
});
