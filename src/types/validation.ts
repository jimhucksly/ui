export type TValidationRule = (value: string) => boolean | string;

export interface IValidateModel {
  value: string;
  message: string;
  isValid: boolean;
  rules: Array<TValidationRule>;
}

export interface IValidate {
  elements: {
    [key: string]: IValidateModel;
  };
  touched: number;
  touch: () => Promise<void>;
  valid: () => boolean;
}

export interface IValidationOptions {
  [key: string]: {
    rules: Array<TValidationRule>;
  };
}
