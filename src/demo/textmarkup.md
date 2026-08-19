# cols[6]
```html
<b-text-markup
  v-model="value"
  v-model:preview="preview"
  label="Ld Text Markup"
  :label-on-top="labelOnTop"
  persistent-hint
  input-hint="Markup input hint"
  :disabled="disabled"
  :readonly="readonly"
  :required="required"
  :size="size"
  :help="{ tooltp: 'tooltip text' }"
/>
```
```js
value // содержимое разметки в стиле markdown
preview // html представление
```
# end of cols
# cols[6]
```js
persistentHint: boolean // оторажение подсказки
inputHint: string // подсказки
disabled: boolean
readonly: boolean
required: boolean
```
# end of cols
