# cols[6]
```html
<ld-switch
  label="Ld Switch"
  v-model="value"
  :disabled="disabled"
  true-value="+"
  false-value="-"
  hint="switch hint"
  :size="size"
  :help="{ tooltip: 'tooltip text' }"
/>
```
# end of cols
# cols[6]
* Props
```js
modelValue: boolean | string | number
trueValue: boolean | string | number // передаваемое значение при включенном положении
falseValue: boolean | string | number // передаваемое значение при выключенном положении
size: string // s (default), m, l - размеры
hint: string // подпись под лейблом
help: { tooltip: string; link: string; } // иконка справки
```
# end of cols
