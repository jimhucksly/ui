export type DatetimeValueRaw =
  | Date
  | Array<number>
  | string
  | number
  | { year: number; month: number; date: number; hours?: number; minutes?: number; seconds?: number; ms?: number };

export type ViewMode = 'month' | 'months' | 'year';
export interface IDayObject {
  date: Date;
  formatted: stirng;
  isAdjacent: boolean;
  isDisabled: boolean;
  isEnd: boolean;
  isHidden: boolean;
  isSame: boolean;
  isSelected: boolean;
  isStart: boolean;
  isToday: boolean;
  isWeekEnd: boolean;
  isWeekStart: boolean;
  isoDate: string;
  localized: string;
  month: number;
  year: number;
}
