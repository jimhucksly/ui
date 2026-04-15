```html
<v-tooltip
  v-model="show"
  :disabled="disabled"
  :location="location"
  :max-width=""
  content-class="bg-dark" // для включение светлой темы использовать класс bg-light
>
  <template #activator="{ props }">
    <button v-bind="props">Tooltip</button>
  </template>
  <span>
    Tooltip Text
  </span>
</v-tooltip>
```

**рекомендации дизайнера по оформлению тултипов:**
  - для тултипов использовать параметр
  ```
  :max-width="280"
  ```
  - для popover'ов использоватеь параметр
  ```
  :width="400"
  ```
  - для popover'ов использоватеь параметр
  ```
  :open-on-click="true"
  ```
  - для popover'ов использоватеь класс
  ```
  :content-class="['bg-dark', 'ld-popover']"
  ```

**по другим параметрам см. документацию на сайте [vuetify](https://vuetifyjs.com/en/components/tooltips)**
