```js
const result = await DialogManager.exec<IModel>(new CreateEditDialog<IModel>(params, fetchData));

params: {
  /* заголовок модального окна */
  title: string;
  /* компонент для отображения в модальном окне */
  /* (должен быть зарегистрирован глобально) */
  component: string;
  /* параметры, которые будут переданы в компонент в качестве props */
  componentProps: {
    model: IModel;
    /* фукнция для установки коллбэка, вызываемого при закрытии */
    /* модального окна. коллбэк должен вернуть true - если в модальном окне */
    /* были какие-то изменения */
    /* если изменения были, то перед закрытием модального окна */
    /* пользователю будет предложено подтвердить закрытие */
    setIsChangedCallback: (callback: () => boolean) => void;
    [key: string]: unknown;
  };
  hostObject?: IHostObject;
  /* индикатор загрузки */
  loading?: boolean;
  /* окно на всю высоту экрана */
  fullHeight?: boolean;
  /* скрыть управляющие кнопки модального окна */
  hideFooter?: boolean;
  /* темный фон заголовка модального окна */
  darkTitle?: boolean;
  /* отображение иконки закрытия модального окна */
  closable?: boolean;
  /* иконка развернуть */
  expandable?: boolean;
  /* иконка минимизации окна */
  minimizable?: boolean;
  /* размеры окна в свернутом состоянии */
  collapsedSize?: {
    width: string | number;
    height: string | number;
  },
  /* размеры окна в развернутом состоянии */
  expandedSize?: {
    width: string | number;
    height: string | number;
  },
  /* флаг - окно развернуто */
  expanded?: boolean;
  /* описание окна или процесса выполнения в нем */
  /* (используется для свернутого вида) */
  description?: string;
  /* текст на кнопке Ok */
  okTitle?: string;
  /* текст на кнопке Cancel */
  cancelTitle?: string;
  /* default: true, если false - выключает действие по нажатию Enter */
  pressEnterAsOk?: boolean
  /* default: true, если false - выключает действие по нажатию Escape */
  pressEscAsCancel?: boolean
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
 ** если необходимо передать в модальное окно необходимые данные,
 * получаемые по запросу на сервер, можно активировать
 * инидикатор загрузки внутри модального окна
 * функция fetchData должна вернуть объект, который будет
 * деструктурирован внутри параметра componentProps
 * индикатор загрузки будет скрыт автоматически
 */

const result = await DialogManager.exec(
  new CreateEditDialog({
    ...
    componentProps: {
      model: null,
      ...
    },
    loading: true
  }),
  async () => {
    const { data } = await axios.get<unknown>(...);
    return {
      model: data
    }
  }
);
```
