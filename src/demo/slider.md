# cols[6]
```html
<ld-slider
  v-model="value"
  :disabled="disabled"
  :range="range"
  :min="Number(min)"
  :max="Number(max)"
  :step="Number(step)"
  :ticks="ticks"
  :thumb-label="showTicksPopup"
>
  <template #thumb-label="{ value }">
    ...
  </template>
  <template #tick-label="{ value, label }">
    ...
  </template>
</ld-slider>
```
# end of cols
# cols[6]
* Props
```js
modelValue: string | number | Array<string | number> // модель, в режиме range должно быть массивом
range: boolean // включение режима диапазона
min: number // мин значение, по умолчанию 0
max: number // макс значение, по умолчанию 100
step: number // шаг, по умолчанию 1
thumbLabel: boolean //
ticks: Array<number> | Record<number, string> //
```
# end of cols