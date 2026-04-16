на глобальном уровне необходимо подключить компонент
```html
<ld-dialog @modal-in-focus="onModalInFocus" />
```
```js
onModalInFocus: (flag: boolean) => void
```
для вызова нужного типа диалога

```ts
import {
  AlertDialog,
  ConfirmDialog,
  InfoDialog,
  PromptDialog,
  SelectDialog,
  CreateEditDialog,
  DialogManager
} from "@dn-web/ui"

DialogManager.exec()
```

если в системе несколько компонентов ld-dialog, например, в каждом микросервисе свой, то их необходимо локализовать с помощью id

```html
<ld-dialog :id="id" />
```

для вызова диалога в определенном окружении

```ts
DialogManager.id(id).exec()
```
#### Component Methods

* метод save()

если в вызываемом компоненте типа CreateEditDialog реализован метод save, то он будет вызыван автоматически, при нажатии кнопки Сохранить
для установления выходных данных необходимо внутри метода save() вызвать this.$emit('set-result', data)

для работы метода необходимо вызвать emit в внутри хука created
```js
created() {
  this.$emit('external-component-created', this);
}
```
данный метод также будет вызван при нажатии клавиши enter

* метод onClose()

если в вызываемом компоненте типа CreateEditDialog, InfoDialog реализован метод onClose, то он будет вызван автоматически при закрытии модального окна

если этот метод вернет false, то модальное окно не будет закрыто

для работы метода необходимо вызвать emit в внутри хука created
```js
created() {
  this.$emit('external-component-created', this);
}
```
данный метод также будет вызван при нажатии клавиши escape

* метод onHelp()

если в вызываемом компоненте типа CreateEditDialog, InfoDialog, SelectDialog реализован метод onHelp, то он будет вызывн по нажатию кнопки help

для работы метода необходимо вызвать emit в внутри хука created
```js
created() {
  this.$emit('external-component-created', this);
}
```

* метод isChanged()

метод нужен для определения, были ли внесены изменения. если в вызываемом компоненте определен метод isChanged, то он будет вызван при закрытии модального окна. если изменения были (метод должен вернуть true), то будет показано диалоговое окно для подтверждения закрытия окна. если изменений не было (метод должен вернуть false), то окно будет просто закрыто.

#### Component Events

* set-result

для установки результата используется $emit('set-result', data);

* set-result-and-close

для установки результата и немедленного закрытия окна - $emit('set-result-and-close', data);

* cancel

для закрытия окна без установки результата - $emit('cancel');
