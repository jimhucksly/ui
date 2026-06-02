* Usage
```html
<b-expansion-panels v-model="model" :multiple="multiple">
  <b-expansion-panel title="Expansion panel title" eager readonly :hide-icon="hideIcon">
    <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia, modi.</div>
  </b-expansion-panel>
  <b-expansion-panel>
    <template #title>Title</template>
    <template #text>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia, modi.</template>
  </b-expansion-panel>
</b-expansion-panels>
```
* Props

```js
model: number | Array<number>
multiple: boolean
title: string
eager: boolean
readonly: boolean
hideIcon: boolean // скрытие иконки сворачивания/разворачивания
```

