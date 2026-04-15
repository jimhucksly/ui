# cols[6]
```html
<ld-radiogroup
  v-model="value"
  :row="!column"
  :column="column"
  label="Ld Radiobutton"
  direction="ltr"
  :label-on-top="labelOnTop"
  :required="required"
  :disabled="disabled"
  :size="size"
  :help="{ tooltip: 'tooltip text' }"
>
  <ld-radiobutton
    label="Radio Button 1"
    :label-to-left="labelToLeft"
    value="1"
    :color="color"
    hint="radiobutton hint" />
</ld-radiogroup>
```
# end of cols
# cols[6]
* Props

```js
row: bolean // отображение в одну строку (default: false)
column: boolean // отображение колонкой (default: true)
label: string //
labelOnTop: boolean // отображение лейбла над кнопками
required: boolean //
disabled: boolean //
direction: 'ltr' | 'rtl' // при режиме row: flex-direction: row / flex-direction: row-reverse
size: 's' | 'm' | 'l' // размер
inputHint: string // подсказка под всеми кнопками
help: { tooltip: string; link: string; } // иконка Справки
```

* Button Props
```js
label: string //
labelToLeft: boolean // отображение лейбла слева от радиокнопки
value: string | number | boolean //
color: string // primary (default), error
hint: string // подсказка под лейблом
```
# end of cols
