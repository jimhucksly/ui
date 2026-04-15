export type DateRange = [string | Date, string | Date];

export interface TimepickerProps {
  placeholder: string;
  is24hr: boolean;
}

export interface DatepickerProps {
  minDate: Date;
  maxDate: Date;
  disabledDates: Array<Date>;
}

export interface IMaskOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mask: any;
  pattern: string;
  lazy: boolean;
  format: (date: Date) => string;
  parse: (str: string) => Date | Array<Date>;
  blocks: {
    d: {
      mask: typeof IMask.MaskedRange;
      from: number;
      to: number;
      maxLength: number;
    };
    m: {
      mask: typeof IMask.MaskedRange;
      from: number;
      to: number;
      maxLength: number;
    };
    Y: {
      mask: typeof IMask.MaskedRange;
      from: number;
      to: number;
    };
  };
  min: unknown;
  max: unknown;
}
