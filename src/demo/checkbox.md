# cols[6]
```html
<ld-checkbox
  v-model="checkeds"
  :checked-value="+"
  :unchecked-value="-"
  color="primary"
  label="Ld Checkbox"
  :initial-value="1"
  :disabled="disabled"
  :label-to-left="labelToLeft"
  :help="{ tooltip: 'tooltip text' }"
  :size="'s'"
  hint="Hint text"
  color="primary"
/>
```
# end of cols
# cols[6]
* Props

```js
checkedValue: unknown // переопределение принимаемого значения для модели в состоянии checked
uncheckedValue: unknown // переопределение принимаемого значения для модели в состоянии not checked
help: { tooltip: string; link: string; } // иконка справки
size: 's' | 'm' | 'l' // размер
hint: string // подсказка под лейблом
color: string // цвет
```
# end of cols
