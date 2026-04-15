# cols[6]
```html
<ld-edit-list-box
  v-model="value"
  :type="type"
  label="ld edit list box"
  :readonly="readonly"
  :disabled="disabled"
  :required="required"
  :format="regexp"
  input-hint="Input Hint"
  :persistent-hint="true"
  prefix="Prefix"
  suffix="Suffix"
  :calendar-props="calendarProps"
  :mask-props="maskProps"
  :size="size"
  :color="color"
  :help="{ tooltip: 'tooltip text' }"
/>
```
# end of cols
# cols[6]
```ts
value: string | number | Array<string | number>
type: 'text' | 'number' | 'date' | 'datetime'
/**
 * регулярное выражение, по которому будут проверяться все введенные значения
 */
format: string | RegExp
autofocus: boolean
readonly: boolean
disabled: boolean
required: boolean
/**
 * Настройки для календаря в режиме date/datetime
 */
calendarProps: {
  minDate: Date;
  maxDate: Date;
  disabledDates: Array<{ start: Date; end: Date }>;
  initialPage: IInitialPage;
}
/**
 * Настройки маски в режиме mask
 */
maskProps: {
  mask: unknown;
  scale: number;
  thousandsSeparator: string;
  signed: boolean;
  mapToRadix: Array<string>;
  inputHint: string;
  beautify: boolean;
}
/**
 * отображение кнопки справки
 * может показывать тултип или открывать ссылку в новом окне браузера
 */
help: { tooltip: string; link: string }
size: string // s (default), m, l - размер
color: string // grey, success, error
```
# end of cols
