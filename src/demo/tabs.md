 # cols[6]
 ```html
<ld-tabs v-model="currentTab" header="Tabs" :vertical="vertical">
  <ld-tab index="0" heading="Tab 1" :readonly="readonly">
    <div>Tab 1</div>
  </ld-tab>
  <ld-tab index="1" heading="Tab 2">
    <div>Tab 2</div>
  </ld-tab>
</ld-tabs>
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
