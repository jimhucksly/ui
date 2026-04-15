```js
const result = await DialogManager.exec(new PromptDialog(params))

params: {
  title: string; //
  /* default: true, если false - выключает действие по нажатию Enter */
  pressEnterAsOk?: boolean;
  /* default: true, если false - выключает действие по нажатию Escape */
  pressEscAsCancel?: boolean;
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
