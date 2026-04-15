# cols[6]
```html
<ld-uploader
  v-model="files"
  label="Обязательно к заполнению"
  method="POST"
  :url="url"
  :headers="headers"
  :response-parser="responseParser"
  :before-send="onBeforeSend"
  :required="required"
  :disabled="disabled"
  :hide-label="hideLabel"
  :width="width"
  :height="height"
  input-hint="Добавьте файл"
  :hide-details="hideDetails"
  :max="20971520"
  :size="size"
  :fluid="fluid"
  :accept="'.docx, .png, .jpg'"
  :multiple="multiple"
  :lazy="lazy"
  :as-input="asInput"
  @input="onInput"
  @change="onChange"
  @complete="onComplete"
>
  <template #actions="{ file }">
    <!-- для размещеня кнопок -->
  </template>
  <template #actions-list="{ file }">
    <!-- для размещеня выпадающего меню с действиями -->
  </template>
</ld-uploader>
```
# end of cols
# cols[6]
* Props
```js
modelValue: Array<IFile> // при отсутствии url в модель будут записаны выбранные файлы
required: boolean //
disabled: boolean //
label: string // лейбл над дроп-областью
method: string // POST (default), PUT
url: string //
headers: Record<string, string> //
responseParser: (value: unknown) => string // обработчик xhr.responseText и ошибок
beforeSend: (item: IFile, body: FormData) => Promise<FormData> // выполнение действий перед отправкой, или для ее прерывания
width: string | number // ширина компонента
height: string | number // высота дроп-области
inputHint: string // подсказка под дроп-областью
hideDetails: boolean // скрытие подсказки под дроп-областью
max: number // максимально допустимы размер файла в байтах
size: 's' | 'm' | 'l' // размер компонента
fluid: boolean // установка ширины в 100%
accept: string // перечисление разрешенных файлов
multiple: boolean // выбор нескольких файлов
lazy: boolean // выбранные файлы не будут сразу отправлены, будут ожидать нажатия кнопки
asInput: boolean // выключение фукционала загрузки файлов
```
* Events

```js
@input: (files: Array<File>) => void; // - событие добавления файлов в модель. files - массив всех выбранных файлов
@change: (items: Array<IFile>) => void // - событие на любые изменения в статусах файлов
@complete: () => void // - все файлы загружены успешно
```
# end of cols
