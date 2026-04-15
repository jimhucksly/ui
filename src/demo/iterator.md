# cols[6]

```html
<ld-data-iterator
  key-prop="id"
  row-height="auto"
  :items="rows"
  :removed-item="removedItem"
  :page="page"
  :to-last-page="toLastPage"
  :sort-field="sortField"
  :selected-indices="selectedIndices"
  :first-item-select-counter="firstItemSelectCounter"
  :next-item-select-counter="nextItemSelectCounter"
  :min-row-height="minRowHeight"
  :active-item="iteratorActiveItem"
  :fix-top-active-item="showActiveItem"
  :padding="iteratorPadding"
  :item-gap="iteratorItemGap"
  :scroll-to-active-item="scrollToActiveItem"
  @loading-update="onIteratorLoadingUpdate"
  @select="onItemSelect"
  @click="onClick"
  @dblclick="onDblClick"
  @page="onIteratorPage"
  @total-pages="onIteratorTotalPage"
>
  <template v-slot="{ item, itemContext }">
    <div>...</div>
  </template>
</ld-data-iterator>
```
# end of cols
# cols[6]

* Props
```js
keyProp // поле, содержащее id элемента
rowHeight // auto | number; можно указать точное значение высоты элементов, если оно известно' }}
items // список элементов
removedItem // удаленный элемент (для анимации удаления)
page // текущая страница
toLastPage // перейти к последней странице
sortField // сортировка по какому-то полю
selectedIndices // список ид элементов, которые должны быть выделены
firstItemSelectCounter // индикатор перехода к первому элементу
nextItemSelectCounter // индикатор перехода к следующему элементу
minRowHeight // минимальная высота элемента
activItem // текущий выделенный элемент
fixTopActiveItem // выделеный элемент всегда сверху
padding // отступ слева и справа внутри списка
itemGap // отступ между элементами
scrollToActiveItem // прокручивать к выделенному элементу или нет
```

* Events
```js
@loadingUpdate // событие начала и окончания построения списка элементов
@select // выделение элемента' }}
  /* пример: */
  onItemSelect(item, index) {
    this.selectedItem = item;
    this.selectedIndex = index;
  }
@click // клик
@dblclick // двойной клик
@page // событие перехода к какой-то странице
  /* пример: */
  onPage(page: number) {
    this.page = page;
  }
@total-pages // событие окончания рассчета количества страниц
 /* пример: */
  onTotalPages(count: number) {
    this.pages = count
  }
```

* Slot
```html
<template v-slot="{ item, itemContext }"></template>
```
```ts
item // текущий элемент списка
itemContext: {
  index: number // индекс текущего элемента
}
```
# end of cols