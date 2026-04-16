import { ValidateFunction } from './validation';

/** requiredRule(name?: string) - Обязательность заполнения поля */
export const requiredRule: (name?: string) => ValidateFunction;
/** maxLengthRule(max: number) - Значение должно быть меньше ${max} символов */
export const maxLengthRule: (max: number) => ValidateFunction;
/** alphaRule() - Разрешены только буквы */
export const alphaRule: () => ValidateFunction;
/** alphaNumRule() - Разрешены только буквы и цифры */
export const alphaNumRule: () => ValidateFunction;
/** betweenRule(min: number, max: number) - допустимы значения в диапазоне от ${min} до ${max} */
export const betweenRule: (min: number, max: number) => ValidateFunction;
/** decimalRule() - Значение должно быть целым или дробным числом */
export const decimalRule: () => ValidateFunction;
/** emailRule() - только эл. почта */
export const emailRule: () => ValidateFunction;
/** integerRule() - Значение должно быть целым числом */
export const integerRule: () => ValidateFunction;
/** ipAddressRule() - Неправильный формат IP-адреса */
export const ipAddressRule: () => ValidateFunction;
/** macAddressRule() - Неправильный формат mac-адреса */
export const macAddressRule: () => ValidateFunction;
/** maxValueRule(max: number) - Значение должно быть меньше ${max} */
export const maxValueRule: (max: number) => ValidateFunction;
/** minValueRule(min: number) - Значение должно быть больше ${min} */
export const minValueRule: (min: number) => ValidateFunction;
/** numericRule() - Разрешены только цифры */
export const numericRule: () => ValidateFunction;
/** urlRule() - Неправильный формат URI */
export const urlRule: () => ValidateFunction;
/** phoneRule() - Неправильный формат телефона */
export const phoneRule: () => ValidateFunction;

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
