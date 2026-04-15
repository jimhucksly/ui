```js
const result = await DialogManager.exec(new SelectDialog(params), fetchData);

params: {
  /* заголовок модального окна */
  title: string;
  /* компонент для отображения в модальном окне */
  /* (должен быть зарегистрирован глобально) */
  component: string;
  /* параметры, которые будут переданы в компонент в качестве props */
  componentProps: {
    /* устанавливает предвыбранные элементы */
    selectedItems: Array<T | number | string>;
    /* устанавливает заблокированные элементы */
    disabledItems: Array<T | number | string>;
    /* активирует возможность поиска по списку */
    searchable?: boolean;
    /* массив полей, по которым необходим поиск */
    searchFields?: string[];
    /* флаг, что переданный массив элементов является деревом */
    isTree?: boolean;
    /* множественный выбор */
    multiselect?: boolean;
    [key: string]: unknown;
  }
  /* инидикатор загрузки */
  /* (во время отображения индикатора загрузки компонент еще не создан */
  /* модальное окно будет ждать выполнения функции fetchData) */
  loading?: boolean;
  /* окно на всю высоту экрана */
  fullHeight?: boolean;
  /* выбор элемента сразу закрывает окно */
  selectAsOk?: boolean;
  /* надпись кнопки Ok */
  okTitle?: string;
  /* надпись кнопки Cancel */
  cancelTitle?: string;
  /* default: true, если false - выключает действие по нажатию Enter */
  pressEnterAsOk?: boolean;
  /* default: true, если false - выключает действие по нажатию Escape */
  pressEscAsCancel?: boolean;
  /* отображение кнопки справки */
  help?: boolean;
  /* предустановленные размеры окна */
  size?: 's' | 'm' | 'l';
  /* свои размеры окна */
  width?: string | number;
  /* свои размеры окна */
  height?: string | number;
  /* размещение окна в левой или правой части экрана */
  align?: 'left' | 'right';
}
```

```ts
fetchData: () => Promise<Record<string, unknown>>

/**
 * если необходимо передать в модальное окно необходимые данные,
 * получаемые по запросу на сервер, можно активировать
 * инидикатор загрузки внутри модального окна
 * функция fetchData должна вернуть объект, который будет
 * деструктурирован внутри параметра componentProps
 * индикатор загрузки будет скрыт автоматически
*/
```

```js
const result = await DialogManager.exec(
  new SelectDialog({
    ...
    componentProps: {
      items: null,
      ...
    },
    loading: true
  }),
  async () => {
    const { data } = await axios.get<Array<unknown>>(...);
    return {
      items: data
    }
  }
);
```
