# cols[6]
```html
<b-button
  :color="color"
  :variant="variant"
  :loading="loading"
  :disabled="disabled"
  :icon="icon"
  :text="text"
  :block="block"
  :tooltip="true"
  :tooltip-text="tooltipText"
  size="s"
  @click="onClick"
>
  <b-icon>add</b-icon>
  <span>Small button</span>
</b-button>
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
- block: boolean // устанавливает 100% ширины
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

