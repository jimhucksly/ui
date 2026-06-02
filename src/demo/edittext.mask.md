```html
<ld-edit-masked-text
  v-model="value"
  mask="000-000-000 00"
  label="Ld Edit Masked Text"
  :disabled="disabled"
  :readonly="readonly"
  input-hint="Mask: 000-000-000 00"
  persistent-hint
  :beautify="beautify"
/>
```

* Props
```ts
mask: unknown // см. https://imask.js.org/
beautify: boolean // сохранять форматирование для модели
```

