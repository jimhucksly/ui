export interface IIteratorRemovedItem<T> {
  id: number | string;
  index: number;
  item: T;
}

export interface IIteratorSortField {
  prop: string;
  direction: 'asc' | 'desc';
  type: 'date' | 'string' | 'number';
}
