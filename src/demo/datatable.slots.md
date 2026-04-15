```html
<!-- вывод кнопок в верхнем правом углу грида -->
<template #header:controls>
  ...
</template>
```
```html
<!-- название колонки -->
<template #cell-header="{ column }">
  ...
</template>
```
```js
column: ITableColumn // текущая колонка
```
```html
<!-- дополнительные кноаки внутри ячейки заголовка -->
<template #cell-header:append="{ column, hover }">
  ...
</template>
```
```js
column: ITableColumn // текущая колонка
hover: boolean // наведение курсора мыши на ячейку
```
```html
<!-- отображение содержимого ячейки -->
<template #cell="{ row, column, rowIndex, group, expanded, value }">
  ...
</template>
```
```js
row: Record<string, unknown> // текущий элемент списка
column: ITableColumn // текущая колонка
rowIndex: number // индекс текущего элемента
group: IGroupedRows // принадлежность к группе
expanded: boolean // свернут или развернут
value: unknown // текущее значение в ячейке
```
```html
<!-- отображение заголовка группы -->
<template #group-header="{ group, expanded, level, groupBy, groupName, groupValue }">
  ...
</template>
```
```js
group: IGroupedRows // группа
expanded: boolean // свернут или развернут
level: number // уровень группировки
groupBy: IGroup // параметры группировки
groupName: string // название группы
groupValue: string // значение из поля row[groupBy.prop]
```
```html
<!-- контекстное меню ячейки -->
<template #context-menu="{ column, row, cancel }">
  ...
</template>
```
```js
row: Record<string, unknown> // текущий элемент списка
column: ITableColumn // текущая колонка
cancel: () => void // метод для скрытия конекстного меню
```
```html
<!-- отображение сообщения об отсутствии данных -->
<template #empty>
  ...
</template>
```
