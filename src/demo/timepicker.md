# cols[6]
```html
<ld-timepicker
  v-model="value"
  label="Ld Timepicker"
  :label-on-top="labelOnTop"
  persistent-hint
  input-hint="Timepicker input hint"
  :readonly="readonly"
  :disabled="disabled"
  :required="required"
  :placeholder="placeholder"
  :is24hr="is24hr"
  :clearable="clearable"
  :help="{ tooltip: 'tooltip text' }"
  :size="size"
  :color="color"
/>
```
# end of cols

```ts
value: Date | string
/* отображение подсказки */
persistentHint: boolean
/* подсказка */
inputHint: string
/* placeholder для поля даты */
placeholder: string
/* кнопка очищения */
clearable: boolean
labelOnTop: boolean;
is24hr: boolean // переключение между 12-ч и 24-часовым форматом, по умолчанию - 24
/**
 * отображение кнопки справки
 * может показывать тултип или открывать ссылку в новом окне браузера
 */
help: { tooltip: string; link: string }
size: string // s (default), m, l - размер
color: string // grey, success, error
```
# end of cols