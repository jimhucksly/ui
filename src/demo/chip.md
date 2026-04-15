# cols[6]
```html
<ld-chip
  :closable="closable"
  :clickable="clickable"
  :disabled="disabled"
  :color="color"
  :size=""
  :active="active"
  :variant="variant"
  @click="onClick"
  @click:close="onClose"
>
  <template #prepend>
    <ld-icon>account</ld-icon>
  </template>
  <template #default>Chip</template>
</ld-chip>
```
# end of cols
# cols[6]
* Props
```js
closable: boolean // отображение иконки close
clickable: boolean // доступность события клик
disabled: boolean
color: string // primary (default), grey
size: string // s (default), m, l
active: boolean // активный режим
variant: string // flat, outlined (default), tonal
```
# end of cols
