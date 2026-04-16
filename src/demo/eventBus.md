**Usage**

```js
import { eventBus } from '@dn-web/core';

...
// обработчик события будет вызван каждый раз при вызове eventBus.$emit
eventBus.$on('event-name', handler);
// обработчик события будет вызван один раз и удален
eventBus.$once('event-name', handler);
...

eventBus.$emit('event-name');
eventBus.$emit('event-name', payload);
eventBus.$emit('event-name', payload1, payload2, payload3);
...

// проверка наличия обработчика события
const exist: boolean = eventBus.$has('event-name');

// отписка от события
eventBus.$off('event-name', handler);
// отписка от всех событий
eventBus.$flush();
```