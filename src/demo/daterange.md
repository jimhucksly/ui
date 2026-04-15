# cols[6]
```html
<ld-daterange
  v-model="value"
  label="Ld Daterange"
  :label-on-top="labelOnTop"
  persistent-hint
  input-hint="Daterange input hint"
  :readonly="readonly"
  :disabled="disabled"
  :required="required"
  :placeholder="placeholder"
  :datepicker-props="{
    minDate: minDate,
    maxDate: maxDate,
    disabledDates: disabledDates,
    allowedDates: allowedDates,
  }"
  :help="{ tooltip: 'tooltip text' }"
  :size="size"
  :color="color"
/>
```
# end of cols
# cols[6]

```ts
value: Date | string
/* отображение подсказки */
persistentHint: boolean
/* подсказка */
inputHint: string
/* placeholder для поля даты */
placeholder: string
labelOnTop: boolean;
datepickerProps: {
  minDate: Date;
  maxDate: Date;
  disabledDates: Array<Date>;
  allowedDates: Array<Date>;
};
/**
 * отображение кнопки справки
 * может показывать тултип или открывать ссылку в новом окне браузера
 */
help: { tooltip: string; link: string }
size: string // s (default), m, l - размер
color: string // grey, success, error
```
# end of cols
