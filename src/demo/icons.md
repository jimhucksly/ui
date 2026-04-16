иконки в формате svg должны быть доступны как public-ресурс
например:

```js
'http://yourDomain.ru/icons/user.svg'
```

структура файла svg

```html
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="..." fill="currentColor"/></svg>
```

 - fill="currentColor" - обязательно для изменения цвета иконки извне
 - stroke="currentColor" - обязательно для изменения цвета иконки извне

вариант использования через имя файла

```html
<ld-icon>user_icon_24</ld-icon>
```

если изменится имя файла svg, то нужно будет заменить во всех местах, где он используется, что не очень удобно

чтобы имена иконок не зависили от имен файлов, есть возможность задать карту соответствия

```js
const map = {
  icons: [
    ['user', 'user_icon_24'], // [имя иконки, имя файла svg]
    ...
  ]
};
app.use(ui, {
  LdIcon: {
    map,
    path: 'path/to/your/icons', // default: 'icons'
    width: '24', // default
    height: '24' // default
  }
});
```

вариант использования через короткое название иконки

```html
<ld-icon>user</ld-icon>
```

если иконка будет динамически меняться, то можно так

```js
const icon = 'user';
```

```html
<ld-icon :icon="icon" />
```

теперь, если файл иконки поменяется, то изменить имя файла понадобится только в карте соответствия

* Props

```ts
// цвет иконки (из системного наюбора цветов: primary, grey, error, etc)
color: string
// путь до файла svg, если отличается от дефолтного
path: string
width: string
height: string
```
