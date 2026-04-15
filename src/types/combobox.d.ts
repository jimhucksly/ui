export type TElement = string | number | IComboboxItem;

export interface IComboboxItem {
  id: number | string;
  value: string;
}

export interface IMessages {
  [key: string]: string;
}
