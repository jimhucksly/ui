```html
<ld-breadcrumbs :breadcrumbs="breadcrumbs" label="Home" theme="dark" size="m" @open="onOpen" />
```
* Props
```js
breadcrumbs: Array<IBreadcrumbsItem>

/* объект роута, аналогично объекта vue-router - $route */
interface IRoute {
  path?: string;
  name?: string;
  query?: Record<string | Array<string>>;
  params?: RouteParams;
}

interface IBreadcrumbsItem {
  text?: string;
  remark?: string;
  route: IRoute;
  disabled?: boolean;
  hidden?: boolean;
  data?: unknown;
}

label: string // подпись у кнопки Домой
theme: string // dark (default), light // цвет шрифта
size: string // s, m (default), l
open: // если передан обработчик @open, то при клике на item компонент передает управление вшешнему обработчику
```
