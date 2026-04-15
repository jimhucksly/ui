# cols[6]
* Usage
```html
<ld-treeview
  :model="folders"
  :selection="selection"
  :onSelect="onSelect"
  :hovered="true"
  :expanded="expandedNodes"
  v-bind="treeOptions"
>
  <template #default="{ item }">
    <span>{{ item }}</span>
  </template>
</ld-treeview>
```

```js
const treeOptions = {
  category: 'items',
  unique: (item) => item.id,
  strategies: {
    click: ['select'],
    selection: ['single'],
    fold: ['opener-control'],
  },
  openerOpts: { position: 'left' },
}
```

* Utils
```js
/**
 * поиск узла в дереве
 * array: Array<TreeNode>
 * id: number
 */
findTreeNode(array, id);
/**
 * поиск всех родительских папок
 * node: TreeNode
 * array: Array<TreeNode>
 */
getParentNodes(node, array)
/**
 * раскрыть все родительские папки
 * id: number
 * array: Array<TreeNode>
 */
expandParentNodes(id, array)
/**
 * ожидание появления метода __onExpandNode__ у узла
 * node: TreeNode
 */
waitForExpand(node)
/**
 * создание древовидной структуры из плоского массива элементов
 * src: Array<unknown>
 * rootLevel: number, default: 0
 * parentKey: string, default: 'parentId'
 */
toTreeViewModel(src, rootLevel, parentKey)

/**
 * раскрыть или закрыть узел
 */
const node = findTreeNode(tree, id);
node.__onExpandNode__(flag) // flag: boolean; true - узел раскрыт
```

# end of cols
# cols[6]
* Props
```js
model: Array<TreeNode> // дерево элементов
selection: Array<TreeNode> // массив выделенных элементо
/* действие при клике на элемент */
onSelect(selected: Array<unknown>, item: unknown) {
  //
},
hovered // добавляет класс hovered к корневому элементу
expandedNodes // массив id узлов, которые должны быть раскрыты при первом отображении дерева
/* treeOptions */
/* ключ объекта, где брать дочерние элемент */
category: ['items']
/* функция для идентификации элемента */
unique: (item: NodeItem) => item.id
css // переопределение css-классов
  /*  default: */
  css: {
    TreeView: 'ld-tree-view',
    opener: 'ld-tree-view__opener',
    selected: 'ld-tree-view__category--selected',
    category: 'ld-tree-view__category',
    folded: 'ld-tree-view__category--folded',
    item: 'ld-tree-view__item',
    hovered: 'ld-tree-view--hovered',
  }
strategies: {
  /* набор функций, вызываемых при клике на элемент */
  /* select - выбрать элемент */
  /* unfold-on-selection - раскрыть папку */
  /* toggle-fold - раскрыть или свернуть папку */
  click: ['select'],
  /* режим выбора элементов */
  /* single - выбирать один элемент */
  /* multiple - выбирать несколько элементов */
  selection: ['single'],
  /* режим раскрытия папок */
  /* opener-control - только по клику на иконку */
  /* not-selected - не выбирать элемент */
  /* no-child-selection - не выбирать дочерние элементы */
  /* max-depth - раскрыть все дочерние узлы до заданного уровня */
  fold: ['opener-control']
}
/* настройки иконки раскрытия и сворачивания */
openerOpts: {
  position: 'left', // none, right
  callback: (item: NodeItem, folded: boolean) => void
}
/* функция, определяющая какие элементы будут задизейблены */
disabled: (item: NodeItem) => boolean
dragndrop: {
  draggable: boolean;
  droppable: boolean;
  drag: (item: NodeItem) => void
    /* item - перемещаемый элемент */
  drop: (item: NodeItem, event: DropEvent, input: NodeItem) => void
    /* item - папка, в которую переместили элемент */
    /* event - событие, которое будет вызвано */
    /* input - текущие параметры компонента TreeView */
}
```
# end of cols
