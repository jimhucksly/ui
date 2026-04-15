```html
<ld-datatable
  id="datatable"
  ref="table"
  :rows="rows"
  :columns="columns"
  column-mode="flex"
  :group-rows-by="groupBy"
  :group-expansion-default="true"
  v-model:group-expanded-state="groupState"
  v-model:group-expansion="groupExpansion"
  sortType="single"
  selectionType="single"
  check-mode="checkNoSelect"
  :checkboxable="checkboxable"
  :enumerable="enumerable"
  :selected="selected"
  :checked="checked"
  :selectAllRowsOnPage="true"
  :scrollbar-h="true"
  :scrollbar-v="true"
  :count="pagerOptions.total"
  :offset="pagerOptions.page - 1"
  :rowIdentity="rowIdentity"
  :sorts="sorts"
  :external-paging="true"
  :loading-indicator="loading"
  :messages="{ emptyMessage: 'Нет данных' }"
  :bordered="bordered"
  :colorize="colorize"
  :size="size"
  @reorder="reorder"
  @resize="resize"
  @sort="sort"
  @activate="activate"
  @select="select"
  @check="check"
  @tree-action="tree"
  @page="page"
>
  <template #header:controls>
    ...
  </template>
  <template #cell-header="{ column }">
    ...
  </template>
  <template #cell-header:append="{ column, hover }">
    ...
  </template>
  <template #cell="{ row, column, rowIndex, group, expanded, value }">
    ...
  </template>
  <template #group-header="{ group, expanded, level, groupBy, groupName, groupValue }">
    ...
  </template>
  <template #context-menu="{ column, row, cancel }">
    ...
  </template>
  <template #empty>
    ...
  </template>
<ld-datatable
```
