# cols[6]
```html
<ld-text-markup
  v-model="value"
  v-model:preview="preview"
  label="Ld Text Markup"
  persistent-hint
  input-hint="Markup input hint"
  :disabled="disabled"
  :readonly="readonly"
  :required="required"
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
