/* eslint-disable no-nested-ternary */
import {
  alpha,
  alphaNum,
  between,
  decimal,
  email,
  integer,
  ipAddress,
  macAddress,
  maxLength,
  maxValue,
  minValue,
  numeric,
  required,
  url,
} from '@vuelidate/validators';
import { ValidateFunction } from '@/types/validation';

/** requiredRule(name?: string) - Обязательность заполнения поля */
export const requiredRule =
  (name?: string, message?: string): ValidateFunction =>
  value => {
    // eslint-disable-next-line eqeqeq
    if (value == null || (typeof value === 'string' && value === '')) {
      return name ? `Поле ${name} обязательно` : message ? message : 'Это поле обязательно';
    }
    const valid = required.$validator(value, null, null);
    if (typeof valid === 'boolean' && valid) {
      return true;
    }
    return name ? `Поле ${name} обязательно` : message ? message : 'Это поле обязательно';
  };
/** maxLengthRule(max: number) - Значение должно быть меньше ${max} символов */
export const maxLengthRule =
  (max: number): ValidateFunction =>
  value => {
    const valid = maxLength(max).$validator(value, null, null);
    if (typeof valid === 'boolean' && valid) {
      return true;
    }
    return `Значение должно быть меньше ${max} символов`;
  };
/** alphaRule() - Разрешены только буквы */
export const alphaRule = (): ValidateFunction => value => {
  const valid = alpha.$validator(value, null, null);
  if (typeof valid === 'boolean' && valid) {
    return true;
  }
  return 'Разрешены только латинские буквы';
};
/** alphaNumRule() - Разрешены только буквы и цифры */
export const alphaNumRule = (): ValidateFunction => value => {
  const valid = alphaNum.$validator(value, null, null);
  if (typeof valid === 'boolean' && valid) {
    return true;
  }
  return 'Разрешены только латинские буквы и цифры';
};
/** betweenRule(min: number, max: number) - допустимы значения в диапазоне от ${min} до ${max} */
export const betweenRule =
  (min: number, max: number): ValidateFunction =>
  value => {
    const valid = between(min, max).$validator(value, null, null);
    if (typeof valid === 'boolean' && valid) {
      return true;
    }
    return `Значение должно быть в диапазоне от ${min} до ${max}`;
  };
/** decimalRule() - Значение должно быть целым или дробным числом */
export const decimalRule = (): ValidateFunction => value => {
  const valid = decimal.$validator(value, null, null);
  if (typeof valid === 'boolean' && valid) {
    return true;
  }
  return 'Значение должно быть целым или дробным числом';
};
/** emailRule() - только эл. почта */
export const emailRule = (): ValidateFunction => value => {
  const valid = email.$validator(value, null, null);
  if (typeof valid === 'boolean' && valid) {
    return true;
  }
  return 'Неверный формат адреса эл.почты';
};
/** integerRule() - Значение должно быть целым числом */
export const integerRule = (): ValidateFunction => value => {
  const valid = integer.$validator(value, null, null);
  if (typeof valid === 'boolean' && valid) {
    return true;
  }
  return 'Значение должно быть целым числом';
};
/** ipAddressRule() - Неправильный формат IP-адреса */
export const ipAddressRule = (): ValidateFunction => value => {
  const valid = ipAddress.$validator(value, null, null);
  if (typeof valid === 'boolean' && valid) {
    return true;
  }
  return 'Неправильный формат IP-адреса';
};
/** macAddressRule() - Неправильный формат mac-адреса */
export const macAddressRule = (): ValidateFunction => value => {
  const valid = macAddress(':').$validator(value, null, null);
  if (typeof valid === 'boolean' && valid) {
    return true;
  }
  return 'Неправильный формат mac-адреса';
};
/** maxValueRule(max: number) - Значение должно быть меньше ${max} */
export const maxValueRule =
  (max: number): ValidateFunction =>
  value => {
    const valid = maxValue(max).$validator(value, null, null);
    if (typeof valid === 'boolean' && valid) {
      return true;
    }
    return `Значение должно быть меньше ${max}`;
  };
/** minValueRule(min: number) - Значение должно быть больше ${min} */
export const minValueRule =
  (min: number): ValidateFunction =>
  value => {
    const valid = minValue(min).$validator(value, null, null);
    if (typeof valid === 'boolean' && valid) {
      return true;
    }
    return `Значение должно быть больше ${min}`;
  };

/** numericRule() - Разрешены только цифры */
export const numericRule = (): ValidateFunction => value => {
  const valid = numeric.$validator(value, null, null);
  if (typeof valid === 'boolean' && valid) {
    return true;
  }
  return 'Разрешены только цифры';
};
/** urlRule() - Неправильный формат URI */
export const urlRule = (): ValidateFunction => value => {
  const valid = url.$validator(value, null, null);
  if (typeof valid === 'boolean' && valid) {
    return true;
  }
  return 'Неправильный формат URI';
};
/** phoneRule() - Неправильный формат телефона */
export const phoneRule = (): ValidateFunction => value => {
  const pattern = /^[\d()+-]+$/;
  return pattern.test(value as string) || 'Неправильный формат телефона';
};

export const validators = {
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
};

export default {};
