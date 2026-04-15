 # cols[6]
 ```html
<ld-textarea
  label="Ld Textarea"
  required
  :size="size"
  :color="color"
  :label-on-top="labelOnTop"
  :resizable="resizable"
  :disabled="disabled"
  :readonly="readonly"
  :clearable="clearable"
  :maxlength="maxlength"
  persistent-hint
  input-hint="Textarea input hint"
  :help="{ tooltp: 'tooltip text' }"
/>
```
 # end of cols
 # cols[6]
 * Props
```js
placeholder: string;
inputHint: string // подсказки
persistentHint: boolean; // оторажение подсказки
hideDetails: boolean;
autofocus: boolean;
tabindex: number;
disabled: boolean;
readonly: boolean;
required: boolean;
labelOnTop: boolean; // label над полем ввода
maxlength: number; // максимальаня длина текста
/**
 * отображение кнопки справки
 * может показывать тултип или открывать ссылку в новом окне браузера
 */
help: { tooltip: string; link: string }
size: string // s (default), m, l - размер
color: string // grey, success, error
```
 # end of cols
