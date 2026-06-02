 # cols[6]
 ```html
<b-tabs v-model="currentTab" header="Tabs" :vertical="vertical" :no-animation="noAnimation">
  <b-tab index="0" heading="Tab 1" :readonly="readonly">
    <div>Tab 1</div>
  </b-tab>
  <b-tab index="1" heading="Tab 2">
    <div>Tab 2</div>
  </b-tab>
</b-tabs>
```
 # end of cols
 # cols[6]
 * Props

```ts
modelValue: number // индекс активной вкладки
vertical: boolean // вертикальный вид
header: string // заголовок при вертикальном отображении
noPadding: boolean // убирает padding внутри панелей
noHeader: boolean // убирает заголовок (при vertical = true)
noAnimation: boolean // убирает анимацию при переключении слайдов
```

* Tab Slots

```html
<template #header>
  <!-- заголовок таба -->
</template>
<template #default>
  <!-- контент -->
</template>
```
 # end of cols
