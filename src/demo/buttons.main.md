# cols[6]
```html
<ld-button
  :color="color"
  :variant="variant"
  :loading="loading"
  :disabled="disabled"
  :icon="false"
  :text="false"
  :tooltip="true"
  :tooltip-text="tooltipText"
  size="s"
  @click="onClick"
>
  <ld-icon>add</ld-icon>
  <span>Small button</span>
</ld-button>
```
# end of cols
# cols[6]
* Props
```js
- color: string // primary (default), success, error, grey, white
- variant: string // flat (default), outlined, tonal, text
- loading: boolean // оторажение лоадера
- icon: boolean // режим отображения с равными шириной и высотой
- text: boolean // отображаение без фона
 /**
 * включение / отключение тултипа
 * работает только в режиме icon=true
 */
- tooltip: boolean
 /**
 * текст тултипа, если включено
 * работает только в режиме icon=true
 */
- tooltipText: string
- size: string // xs (default, высота 32px), s, m, l
```
* Slots
```html
<template #text></template>
<template #append></template>
```
# end of cols

