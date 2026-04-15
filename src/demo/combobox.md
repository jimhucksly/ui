# cols[6]
```html
<ld-combobox
  v-model="value"
  v-model:model-items="selected"
  label="Ld Combobox"
  :items="items"
  :multiselect="multiselect"
  :chips="chips"
  :readonly="readonly"
  :disabled="disabled"
  :required="required"
  :clearable="clearable"
  :highlight="highlight"
  :return-object="returnObject"
  :hide-details="hideDetails"
  :fetch-data="fetchData"
  :internal-search="internalSearch"
  :lazy-load="lazyLoad"
  :option-hint="optionHint"
  :size="size"
  :color="color"
  :limit="limit"
  :help="{
    tooltip: 'input tooltip'
  }"
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
</ld-combobox>
```
# end of cols
# cols[6]

* Props

```ts
modelValue: number | string | Array<number | string>; // ID выбранных элементов
modelItems: Array<Record<string, unknown>> | string; //  Массив выбранных элементов
itemValue: string // Поле объекта для идентификации объекта
itemTitle: string // Поле объекта для отображения в выбранного элемента
itemSubtitle: string // Поле объекта для отображения подсказки для элемента
multiselect: boolean //
required: boolean //
disabled: boolean //
readonly: boolean //
messages: {
  loading: string; // сообщение о загруке элементов
  search: string; // сообщение о поиске
  empty: string; // сообщеие о пустом списке элементов
  noResults: string // сообщение о том, что поиск не дал результатов
  validation: string; // сообщение валидации
}
lazyLoad: boolean // Элементы списка будут загружаться только при раскрытии списка
inputHint: string // Подсказка под полем ввода
persistentHint: boolean // Отображение подсказки под полем ввода
/**
 * Отображение строки пояснения для элементов списка
 * Должен быть передан слот option-hint
*/
optionHint: boolean
limit: number // Предельное кол-во отображаемых выбранных элементв
internalSearch: boolean // включает внутреннюю фильрация элементов взамен серверной
allowEmpty //
highlight: boolean // подстветка соответстующих символов в заголовке элемента при поиске
returnObject: boolean // вмесето id будет возвщать сами объекты
chips: boolean // отображение выбранных элементов в виде чипа
closableChips: boolean // отображение кнопки удаления чиаа
clearable: boolean // отображает иконку очистки поля ввода
label: string //
autofocus: boolean //
hideDetails: boolean //
placeholder: string //
prependInnerIcon: string // иконка перед полем ввода
prefix: string // надпись перед полем ввода
suffix: string // надпись после поля ввода
/**
 * отображение кнопки справки
 * может показывать тултип или открывать ссылку в новом окне браузера
 */
help: { tooltip: string; link: string }
size: string // s (default), m, l - размер
color: string // grey, success, error
/**
 * Метод загрузки элементов списка или поиска при наличии строки запроса
 */
async fetchData: (searchString?: string): Promise<Array<unknown>> => {
  return await fetch(...);
}
```
# end of cols
