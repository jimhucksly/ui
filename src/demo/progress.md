# cols[6]
```html
<b-progress
  :label="''"
  :value="Number(counter)"
  :counter="showCounter"
  view="linear"
  :size="size"
  :error="error"
  :reversed="reversed"
  @complete="onComplete"
>
  {{ label }}
</b-progress>
```
# end of cols
# cols[6]
* Props
```js
label: string
counter: boolean
value: number // значение в процентах или доли от единицы (напримре, 15 или 0.15)
view: string // linear (default), circular - вид
size: string // xs, s, sm (default), m, l, xl - размер в режиме circular
error: boolean // перекрасить в красный цвет если ошибка
reversed: boolean // отображение элементов в обратном порядке (в режиме linear)
```
# end of cols
