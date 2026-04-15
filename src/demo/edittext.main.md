# cols[6]
```html
<ld-edit-text
  v-model="value"
  label="Ld Edit Text"
  input-hint="edit text input hint"
  persistent-hint
  placeholder="Placeholder"
  prefix="Prefix:"
  suffix="Suffix"
  prepend-inner-icon="search"
  :disabled="disabled"
  :readonly="readonly"
  :required="required"
  :debounced="500"
  :clearable="clearable"
  :size="size"
  :color="color"
  :help="{ tooltip: 'tooltip text' }"
/>
```
# end of cols
# cols[6]
* Props

```js
placeholder: string; //
type: 'text' | 'password' // режим ввода текста или пароля
clearable: boolean // иконка очищения поля ввода
persistentHint: boolean // оторажение подсказки
inputHint: string // подсказки
maxlength: number // максимальная длина текста
onlyNumbers: boolean // режим ввода чисел
debounced: number // задержка обновления модели в милисекундах (удобно для полей поиска)
disabled: boolean
readonly: boolean
required: boolean
/**
 * отображение кнопки справки
 * может показывать тултип или открывать ссылку в новом окне браузера
 */
help: { tooltip: string; link: string }
size: string // s (default), m, l - размер
color: string // grey, success, error
```
# end of cols
