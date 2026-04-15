```js
const confirm = await DialogManager.exec(new ConfirmDialog(params}));

params: {
  /* заголовок модального окна */
  title: string;
  content: string;
  /* текст на кнопке Ok */
  okTitle?: string;
  /* текст на кнопке Cancel */
  cancelTitle?: string;
  /* возвращаемый результат по кнопке Ok (default: true) */
  okResult?: number | string | boolean;
  /* возвращаемый результат по кнопке Cancel (default: false) */
  cancelResult?: number | string | boolean;
  /* default: true, если false - выключает действие по нажатию Enter */
  pressEnterAsOk?: boolean
  /* default: true, если false - выключает действие по нажатию Escape */
  pressEscAsCancel?: boolean
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
