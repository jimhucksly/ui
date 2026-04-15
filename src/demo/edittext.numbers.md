# cols[6]
```html
<ld-edit-text
  v-model="editNumbers.value"
  :only-numbers="true"
  label="Ld Edit Numbers"
  :min-value="100"
  max-value="1000"
  :signed="true"
/>
```
# end of cols
# cols[6]
* Props

```ts
onlyNumbers: boolean // режим ввода чисел
nonZero: boolean // ввод нуля не возможен
scale: number // кол-во цифр после запятой (разрешает вводить дробные числа)
minValue: number // макс. возможное значение
maxValue: number // мин. возможное значение
signed: boolean // разрешает вводить отрицательные числа
```
# end of cols
