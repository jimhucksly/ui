import { strings } from '@dn-web/core';
import { DefineComponent } from 'vue';
import { IOptions } from '@/types/options';

export default class CommonService {
  static isObject(value: unknown): boolean {
    return value?.constructor === Object;
  }
  static isArray(value: unknown): boolean {
    return Array.isArray(value);
  }
  static keys(options: Record<string, unknown>): Array<string> {
    return options && CommonService.isObject(options) ? Object.keys(options) : [];
  }
  static hasKeys(options: Record<string, unknown>): boolean {
    return CommonService.keys(options).length > 0;
  }
  static componentName(name: string): string {
    return name
      .split('-')
      .map(e => strings.upperFirst(e))
      .join('');
  }
  static defaults(options: IOptions, name: string): Record<string, unknown> {
    const key = Symbol.keyFor(Symbol.for(CommonService.componentName(name)));
    const defaults = options[key as keyof IOptions] as Record<string, unknown>;
    return CommonService.hasKeys(defaults) ? defaults : {};
  }
  static propsFactory(cmp: DefineComponent, defaults: Record<string, unknown>) {
    cmp.props = CommonService.returnProps(cmp, defaults);
  }
  static returnProps(cmp: DefineComponent, defaults: Record<string, unknown>) {
    return {
      ...cmp.props,
      ...CommonService.nestProps(defaults),
    };
  }
  static nestProps(defaults: Record<string, unknown>): Record<string, { default: unknown }> {
    const result: Record<string, { default: unknown }> = {};
    if (CommonService.hasKeys(defaults)) {
      for (const k of CommonService.keys(defaults)) {
        result[k] = {
          default: defaults[k],
        };
      }
    }
    return result;
  }
}
