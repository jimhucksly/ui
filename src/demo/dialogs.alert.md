```js
await DialogManager.exec(new AlertDialog(params))

params: {
  title: string; //
  content: string; //
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

в диалоге типа Alert реализована возможность часть текста скрыть под раскрывающейся панелью с кнопкой Подробнее.
Для этого строка текста должна содержать ключевую фразу "Message detail: ". Весь текст до этой фразы отобразиться в окне. Текст после этой фразы будет скрыт под раскрывающейся панелью.
