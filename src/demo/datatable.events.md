* Events
```js
@reorder: (column, newValue, prevValue) => void // событие изменения порядка колонок
@resize: (column, newValue) => void // событие изменения ширины колонок
@sort: (data: {
  sorts,
  column,
  prevValue,
  newValue,
}) => void // событие сортировки
@activate: (data: {
  type,
  event,
  row,
  rowIndex,
  rowElement,
  cellElement,
  cellIndex,
  column
}) => void // клик или двойной клик
@select: (data: {
  selected,
  index,
}) => void // выделение элемента
@check: (data: {
  checked
}) => void // событие выделения элемента чекбоксом
@tree-action: (data: {
  row,
  rowIndex
}) => void // сворачивание или разворачивание узла дерева
@page: (data: {
  count,
  pageSize,
  limit,
  offset,
}) => void // событие перехода к какой-то странице
@scroll: (data: {
  offsetY,
  offsetX,
}) => void //
@update:groupExpansion
@update:group-expanded-state

```
