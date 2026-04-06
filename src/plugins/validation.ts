import { isDefined } from '@dn-web/core';
import { App, ComponentPublicInstance } from 'vue';
import { IValidate, IValidationOptions, TValidationRule } from '@/types/validation';

export default {
  install: (vue: App) => {
    const v: IValidate = {
      elements: {},
      touched: 0,
      touch: () => null,
      valid: () => null,
    };

    const keys: Array<string> = [];

    function stringifyValue(value: unknown): string {
      return isDefined(value) ? String(value) : '';
    }

    function requiredRule(value: string): string | boolean {
      return value.length > 0 ? true : 'Это поле обязательно';
    }

    function validation(instance: ComponentPublicInstance & { v: IValidate }, options?: IValidationOptions) {
      const required = instance.$el.querySelectorAll('input[required]');
      if (required?.length) {
        instance.v = v;
        for (const el of required) {
          if (!el.name) {
            continue;
          }
          const key: string = el.name;
          keys.push(key);
          instance.v.elements[key] = {
            value: '',
            message: '',
            isValid: true,
            rules: [],
          };
          instance.$watch(
            `${key}`,
            (_value: string) => {
              instance.v.elements[key].value = _value;
            },
            { immediate: true }
          );
          instance.$watch(
            () => `${instance.v.elements[key].value}${instance.v.touched}`,
            () => {
              const _value = stringifyValue(instance.v.elements[key].value);
              if (instance.v.elements[key].rules.length === 0) {
                const rules: Array<TValidationRule> = [requiredRule];
                if (options && options[key] && Array.isArray(options[key].rules) && options[key].rules.length > 0) {
                  for (const rule of options[key].rules) {
                    if (rule instanceof Function) {
                      rules.push(rule);
                    }
                  }
                }
                instance.v.elements[key].rules = rules;
              }
              for (const rule of instance.v.elements[key].rules) {
                const result = rule(_value);
                instance.v.elements[key].isValid = typeof result !== 'string';
                if (instance.v.elements[key].isValid) {
                  instance.v.elements[key].message = '';
                } else {
                  instance.v.elements[key].message = result as string;
                  break;
                }
              }
            }
          );
        }
        instance.v.touch = async () => {
          instance.v.touched++;
          await instance.$nextTick();
        };
        instance.v.valid = () => {
          let result = true;
          for (const k of keys) {
            if (!instance.v.elements[k].isValid) {
              result = false;
              break;
            }
          }
          return result;
        };
      }
    }

    vue.config.globalProperties.$validate = validation;
  },
};
