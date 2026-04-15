# cols[5]
```html
<ld-pager
  :options="pagerOptions"
  :to-first="toFirst"
  :to-last="toLast"
  :show-total="countSlot"
  :show-select-counter="selectionSlot"
  :show-page="showPage"
  :rounded="rounded"
  :fluid="fluid"
  prev-text="Previous"
  next-text="Next"
  :last-page-unknown="lastPageUnknown"
  :unlimited="unlimited"
  :sizes="[10, 20, 30, 40, 50]"
  @change="onPager"
>
  <template #total="{ total }">
    <span>Всего {{ total }} человек</span>
  </template>
  <template #selection>
    <span>Выбрано элементов: {{ selected.length }}</span>
  </template>
</ld-pager>
```
# end of cols
# cols[7]
* Props

```ts
options = {
  page: number; // текущая страница
  pageSize: number; // кол-во элементов на странице
  total: number; // общее кол-во элементов
}
toFirst: boolean; // отображение кнопки перехода к первой странице
toLast: boolean; // отображение кнопки перехода к последней странице
lastPageUnknown: boolean // если кол-во страниц неизвестно, будет добавлено троеточие ...
unlimited: boolean // режим перехода по страницами без ограничения предельного кол-ва
sizes: Array<number> // массив для выбора кол-ва элементов на странице
showTotal: boolean // показать строку с общим кол-вом элементов
showSelectCounter boolean // показать строку с кол-вом выделенных элементов
showPage: boolean // показать номер страницы
rounded: boolean // круглые кноки выбора страницы
fluid: boolean // ширина 100%
prevText: string // надписть на кнопке перехода к предыдущей странице
nextText: string // надпись на кнопке перехода к следующей странице
```

* Event
```ts
@change: ({ page, size }) => void; // событие перехода к странице
```
# end of cols
