# cols[6]
```html
<ld-select
  v-model="selected"
  :items="items"
  label="Ld select"
  item-title="first_name"
  item-value="id"
  :multiselect="multiselect"
  :readonly="readonly"
  :disabled="disabled"
  :required="required"
  :return-object="returnObject"
  :chips="chips"
  :limit="4"
  :closable-chips="closableChips"
  :size="size"
  :color="color"
  :help="{ tooltip: 'tooltip text' }"
>
  <template #tag="{ item, canRemove, onRemove }">
    ...
  </template>
  <template #tag-overflow="{ limit, count }">
    ...
  </template>
  <template #option="{ item, isSelected, searchText }">
   ...
  </template>
  <template #option-icon="{ item, isSelected }">
    ...
  </template>
  <template #option-hint="{ item, isSelected, searchText }">
    ...
  </template>
</ld-select>
```
# end of cols
# cols[6]
* Props

```ts
value: string | number | Array<number | string | { id: number, value: string }>
items: Array<{ id: number, value; string }>
multiselect: boolean
returnObject: boolean // в модель будет возвращаться объект
itemValue: string // переопределение поля для идентификации элемента (по умолчанию: id)
itemTitle: string // переопределение поля для наименования элемента (по умолчанию: value)
chips: boolean // отображение чипов
closableChips: boolean // разрешить удалять чипы
limit: // максимальное число отображаемых элементов при multiselect = true
/**
 * отображение кнопки справки
 * может показывать тултип или открывать ссылку в новом окне браузера
 */
help: { tooltip: string; link: string }
size: string // s (default), m, l - размер
color: string // grey, success, error
```
# end of cols
