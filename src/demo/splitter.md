# cols[6]

```html
<ld-splitter
  :resize-disabled="resizeDisabled"
  :left-size-min="30"
  :right-size-min="30"
  :left-visibled="leftVisibled"
  :right-visibled="rightVisibled"
  :horizontal="horizontal"
>
  <template #left-pane>
    <div>Left Panel</div>
  </template>
  <template #right-pane>
    <div>Right Panel</div>
  </template>
</ld-splitter>
```

# end of cols
# cols[6]

* Props

```ts
horizontal: boolean // горизонтальный вид
leftVisibled: boolean // видимость левой колонки
rightVisibled: boolean // видимость правой колонки
leftSizePercent: number // ширина левой колонки по умолчанию
/**
 * минимальная шинира левой колонки
 * например:
 * 20 - будет принято как 20%
 * 20px - в пикселях
 */
leftSizeMin: string
rightSizeMin: string // минимальная ширина правой колонки
resizeDisabled: boolean // запрет изменения ширины
```

# end of cols
