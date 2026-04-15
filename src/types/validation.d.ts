export type ValidateFunction = (v: unknown) => boolean | string;

export interface IInput {
  uid: number;
  validate: ValidateFunction;
  reset: () => void;
  resetValidation: () => void;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __cardSection: string | number;
}

export interface IWatcher {
  uid: number;
  valid: () => void;
  shouldValidate: () => void;
}
