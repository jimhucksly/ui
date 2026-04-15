# cols[6]
```html
<ld-avatar
  :size="size"
  :theme="theme"
  :tabindex="i"
  :full="full"
  :online="online"
  @click="onClick"
>
<template #avatar>
  <!-- аватар пользователя или текстовое представление -->
</template>
<template #content>
  <!-- имя пользоватедя -->
</template>
<template #hint>
  <!-- доп. информация под именем -->
</template>
<template #append>
  <!-- иконка для доп. действий -->
</template>
</ld-avatar>
```
# end of cols
# cols[6]
* Props
```js
size: string // xs, s, sm (default), m, l, xl xxl
theme: string // light (default), dark
tabindex: number //
full: boolean // полный или короткий вид
online: boolean //
```
# end of cols