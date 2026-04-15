```html
<ld-loader
  :visible="visible"
  :size="size"
  transparent="transparent"
  :opacity="opacity"
  :view="view"
  :color="color"
/>
```

* Props

```js
visible: boolean //
size: string // xs, s, m (default), l, xl
transparent: boolean // прозрачный фон
opacity: number // 0...1 управление прозначностью фона при включении transparent=true (default, 0.5)
view: string // circle (default), dotts
color: string // primary (default), white
```
