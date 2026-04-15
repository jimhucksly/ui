```js
await DialogManager.exec(new InfoDialog(params));

params: {
  /* заголовок модального окна */
  title: string;
  /* компонент для отображения в модальном окне */
  /* (должен быть зарегистрирован глобально) */
  component: string;
  /* параметры, которые будут переданы в компонент в качестве props */
  componentProps: Record<string, unknown>;
  /* окно на всю высоту экрана */
  fullHeight?: boolean;
  /* инидикатор загрузки */
  /* (во время отображения индикатора загрузки компонент еще не создан */
  /* модальное окно будет ждать выполнения функции fetchData) */
  loading?: boolean;
  /* иконка загрытия модального окна */
  closable?: boolean;
  /* скрыть управляющие кнопки внизу окна */
  hideFooter?: boolean;
  /* возможность свернуть окно */
  minimizable?: boolean;
  /* описание окна или процесса выполнения в нем */
  /* (используется для свернутого вида) */
  description?: string;
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
