```js
/**
 * список колонок
  interface ITableColumn {
    checkboxable?: boolean;
    frozenLeft?: boolean;
    frozenRight?: boolean;
    flexGrow?: number;
    minWidth?: number;
    maxWidth?: number;
    width?: number;
    resizeable?: boolean;
    sortable?: boolean;
    draggable?: boolean;
    name?: string;
    prop?: TableColumnProp;
    cellClass?: string;
    headerClass?: string;
    headerCheckboxable?: boolean;
    isTreeColumn?: boolean; // для иерархического списка - группирующее поле
    visible?: boolean;
    hidden?: boolean;
    enumerable?: boolean;
    formatter?: (value: any) => any;
  }
*/
columns: ITableColumn
rows: Array<Record<string, unknown>> // список элементов
loadingIndicator: boolean // индикатор загрузки
columnMode: 'flex' | 'standard' // режим отображения колонок
groupRowsBy: Array<{ prop: string; title: string }> // группировка колонок
groupExpansionDefault: boolean // раскрывать группы по умолчанию или нет
v-model:group-expanded-state="value", value:  [key: string]: boolean } // состояние раскрытия групп
v-model:group-expansion="value", value: 0 | 1 // переключатель состояния всех групп
sortType: 'single' | 'multi' // режим сортировки

selectionType: 'single' | 'multi' | 'multiClick' | 'checkbox' //  режим выделения элементов
checkMode:  'checkNoSelect' | 'checkIsSelect' // режим выделения чекбоксом
checkboxable: boolean // отображене чекбоксов
enumerable: boolean // отображение колонки с номером строки
selected: Array<Record<string, unknown>> // список выделенных элементов
checked: Array<Record<string, unknown>> // список отмеченных чекбоксом
scrollbarH: booean // горизонтальный скролл
scrollbarV: boolean // вертикальный скролл
rowIdentity: (row: Record<string, unknown>) => string | number // коллбэк для идентификации элементов
sorts: Array<{ prop: string; dir: 'asc' | 'desc' }> // сортировка
/* переопределение текстовых сообщений */
messages: {
  emptyMessage: '',
  totalMessage: '',
  selectedMessage: '',
}
size: 's' | 'm' | 'l' // высота строки,  s (32px, default), m (52px), l (72px)
bordered: boolean // границы ячеек
externalPaging: boolean // включение пагинации
count: number // общее количество элементов
offset: number // управление пагинацией
reorderable: boolean // возможность сортировке столбцов
rowClass: string // css класс для строки
virtualization: boolean // включение виртуализации при скроллинге
/**
 * для иерархического списока - поле у дочернего элемента, содержащиее ид родителя
 * например, company.parentId
 */
treeFromRelation: string
/**
 * для иерархического списка - поле родительского элемента, содержащее его ид
 * например, company.id
 */
treeToRelation: string
beforeSelectRowCheck: (row: Record<string, unknown>) => boolean // возможность запретить выделение элементоа
colorize (row: Record<string, unknown>) => 'warning' | 'error' // подстветка строк,
dragData: {
  draggable: boolea // включает режим drag-&-drop
  canDrag: (row: Record<string, unknown>) => boolean // проверка строки на возможность перемещения
  canDrop: (row: Record<string, unknown>) => boolean // проверка строки на доступность drop эффекта
  dragstart: (e: DragEvent, row: Record<string, unknown>) => void
  drop: (e: DragEvent, row: Record<string, unknown>) => void
}
```
