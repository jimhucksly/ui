```html
<ld-step :items="items" :direction="direction" />
```
* Props
```js
direction: 'v' | 'h' //
items: Array<{
  type?: string // 'completed', 'active', 'scheduled'
  result?: string // 'success', 'warning', 'error'
  title: string
  subtitle?: string
  disabled?: boolean
  tooltip?: string
  tooltipProps?: {} // props of v-tooltip component
}>
```