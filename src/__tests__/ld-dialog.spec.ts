import { delay, eventBus } from '@dn-web/core';
import { mount, VueWrapper } from '@vue/test-utils';
import { App, ComponentPublicInstance, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ui from '@/index';
import vuetify from '@/vuetify.setup';
import { DialogManager } from '../ld-dialog/dialog.manager';
import {
  AlertDialog,
  ConfirmDialog,
  CreateEditDialog,
  InfoDialog,
  PromptDialog,
  SelectDialog,
} from '../ld-dialog/dialogs';
import { ValidateMixinOptions } from '../mixins/validate.mixin';

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;

document.body.innerHTML = `
  <div>
    <div id="app"></div>
  </div>
`;

function modalId(div: HTMLElement): string {
  return Array.from(div.classList)
    .find(el => /dlg/.test(el))
    .replace(/\D/g, '');
}

const rootComponent = defineComponent({
  template: `
    <v-app>
      <ld-dialog></ld-dialog>
      <ld-dialog id="1"></ld-dialog>
    </v-app>
  `,
});

const info = defineComponent({
  template: '<div id="test-info-element">Test</div>',
  created() {
    this.$emit('set-result', 1);
  },
});

const select = defineComponent({
  emits: ['set-result', 'cancel'],
  template: `
    <div id="test-select-element">
      <ld-button @click="select(1)" id="select-btn-ok">ok</ld-button>
      <ld-button @click="cancel()" id="select-btn-cancel">cancel</ld-button>
    </div>
  `,
  methods: {
    select(i: number) {
      this.$emit('set-result', i);
    },
    cancel() {
      this.$emit('cancel');
    },
  },
});

const createEdit = defineComponent({
  emits: ['external-component-created'],
  mixins: [ValidateMixinOptions],
  props: {
    model: {
      type: Object,
      default: (): { name: string } => null,
    },
  },
  template: `
    <div id="test-create-edit-element">
      <ld-edit-text v-model="name" required />
    </div>
  `,
  data(): {
    name: string;
  } {
    return {
      name: null,
    };
  },
  created() {
    if (this.model) {
      this.name = this.model.name;
    }
    this.$emit('external-component-created', this);
  },
  methods: {
    save() {
      if (this.validate()) {
        return {
          name: this.name,
        };
      }
      return false;
    },
  },
});

function setupTest(props?: Record<string, unknown>) {
  try {
    let options = {
      global: {
        plugins: [
          vuetify,
          {
            install(vue: App) {
              vue.use(ui);
              vue.component('test-info-cmp', info);
              vue.component('test-select-cmp', select);
              vue.component('test-create-edit-cmp', createEdit);
            },
          },
        ],
      },
    };
    if (props) {
      options = { ...options, ...props };
    }
    wrapper = mount(rootComponent, {
      ...options,
      attachTo: document.getElementById('app'),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

describe('DialogComponent: Alert', () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    eventBus.$flush();
    document.body.innerHTML = `
      <div>
        <div id="app"></div>
      </div>
    `;
  });

  const createDialog = (props: Record<string, unknown> = {}) =>
    new AlertDialog({
      ...props,
      title: 'title',
      content: 'text',
    });

  it('Корректно создает диалог типа Alert', async () => {
    DialogManager.exec(createDialog());
    await delay(300);
    const dialog = document.querySelector('.v-dialog');
    expect(dialog.classList.contains('Alert')).toBeTruthy();
    const content: HTMLElement = dialog.querySelector('.ld-dialog-content');
    const id = modalId(content);
    const btnOk: HTMLInputElement = content.querySelector(`#ld-dialog-btn-ok-${id}`);
    expect(btnOk).toBeTruthy();
    btnOk.click();
    await delay(300);
  });

  it('Закрывает диалог Alert по нажатию клавиши Enter', async () => {
    DialogManager.exec(createDialog());
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await delay(300);
    const dialog = document.querySelector('.ld-dialog-content');
    expect(dialog).toBeNull();
  });

  it('Закрывает диалог Alert по нажатию клавиши Esc', async () => {
    DialogManager.exec(createDialog());
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await delay(300);
    const dialog = document.querySelector('.ld-dialog-content');
    expect(dialog).toBeNull();
  });

  it('Не закрывает диалог Alert по нажатию клавиши Enter, если передан параметр pressEnterAsOk = false', async () => {
    DialogManager.exec(createDialog({ pressEnterAsOk: false }));
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await delay(300);
    const dialog = document.querySelector('.ld-dialog-content');
    expect(dialog).toBeDefined();
  });

  it('Не закрывает диалог Alert по нажатию клавиши Esc, если передан параметр pressEscAsCancel = false', async () => {
    DialogManager.exec(createDialog({ pressEscAsCancel: false }));
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await delay(300);
    const dialog = document.querySelector('.ld-dialog-content');
    expect(dialog).toBeDefined();
  });
});

describe('DialogComponent: Prompt', () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    eventBus.$flush();
    document.body.innerHTML = `
      <div>
        <div id="app"></div>
      </div>
    `;
  });

  const createDialog = (props: Record<string, unknown> = {}) =>
    new PromptDialog({
      ...props,
      title: 'title',
      content: 'text',
    });

  it('Корректно создает диалог типа Prompt', async () => {
    let result = null;
    DialogManager.exec(createDialog())
      .then(data => {
        result = data;
        return true;
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
      });
    await delay(300);
    const dialog = document.querySelector('.v-dialog');
    expect(dialog.classList.contains('Prompt')).toBeTruthy();
    const content: HTMLElement = dialog.querySelector('.ld-dialog-content');
    const id = modalId(content);
    const textarea = content.querySelector('textarea');
    expect(textarea).toBeTruthy();
    const btnOk: HTMLInputElement = content.querySelector(`#ld-dialog-btn-ok-${id}`);
    expect(btnOk).toBeTruthy();
    btnOk.click();
    await delay(300);
    expect(result).toEqual('text');
  });

  it('По нажатию Enter срабатывает логика кнопки Ок', async () => {
    let result = null;
    DialogManager.exec(createDialog())
      .then(data => {
        result = data;
        return true;
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
      });
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await delay(300);
    expect(result).toEqual('text');
  });

  it('Закрывает диалог по нажатию клавиши Esc', async () => {
    DialogManager.exec(createDialog());
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await delay(300);
    const dialog = document.querySelector('.ld-dialog-content');
    expect(dialog).toBeNull();
  });

  it('Если передан параметр pressEnterAsOk = false, логика кнопки Ок не срабатывает по нажатию Enter', async () => {
    let result = null;
    DialogManager.exec(createDialog({ pressEnterAsOk: false }))
      .then(data => {
        result = data;
        return true;
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
      });
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await delay(300);
    const dialog = document.querySelector('.ld-dialog-content');
    expect(dialog).toBeDefined();
    expect(result).toBeNull();
  });

  it('Если передан параметр pressEscAsCancel = false, окно не закрывается по нажатию Escape', async () => {
    DialogManager.exec(createDialog({ pressEscAsCancel: false }));
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await delay(300);
    const dialog = document.querySelector('.ld-dialog-content');
    expect(dialog).toBeDefined();
  });
});

describe('DialogComponent: Confirm', () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    eventBus.$flush();
    document.body.innerHTML = `
      <div>
        <div id="app"></div>
      </div>
    `;
  });

  const createDialog = (props: Record<string, unknown> = {}) =>
    new ConfirmDialog({
      ...props,
      title: 'title',
      content: 'text',
    });

  const okBtn = (dialog: HTMLElement): HTMLElement => {
    const content: HTMLElement = dialog.querySelector('.ld-dialog-content');
    const id = modalId(content);
    return content.querySelector(`#ld-dialog-btn-ok-${id}`);
  };

  const cancelBtn = (dialog: HTMLElement): HTMLElement => {
    const content: HTMLElement = dialog.querySelector('.ld-dialog-content');
    const id = modalId(content);
    return content.querySelector(`#ld-dialog-btn-cancel-${id}`);
  };

  it('Корректно создает диалог типа Confirm', async () => {
    let result = false;
    DialogManager.exec(createDialog())
      .then((data: boolean) => {
        result = Boolean(data);
        return true;
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
      });
    await delay(300);
    const dialog: HTMLElement = document.querySelector('.v-dialog');
    expect(dialog.classList.contains('Confirm')).toBeTruthy();
    const btnOk = okBtn(dialog);
    expect(btnOk).toBeTruthy();
    btnOk.click();
    await delay(300);
    expect(result).toEqual(true);
  });

  it('По нажатию Enter срабатывает логика кнопки Ок', async () => {
    let result = null;
    DialogManager.exec(createDialog())
      .then((data: boolean) => {
        result = Boolean(data);
        return true;
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
      });
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await delay(300);
    expect(result).toEqual(true);
  });

  it('По нажатию Escape срабатывает логика кнопки Cancel', async () => {
    let result = null;
    DialogManager.exec(createDialog())
      .then((data: boolean) => {
        result = Boolean(data);
        return true;
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
      });
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await delay(300);
    expect(result).toEqual(false);
  });

  it('Если передан параметр pressEnterAsOk = false, логика кнопки Ок не срабатывает по нажатию Enter', async () => {
    let result = null;
    DialogManager.exec(createDialog({ pressEnterAsOk: false }))
      .then((data: boolean) => {
        result = Boolean(data);
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
      });
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await delay(300);
    const dialog = document.querySelector('.ld-dialog-content');
    expect(dialog).toBeDefined();
    expect(result).toBeNull();
  });

  it('Если передан параметр pressEscAsCancel = false, окно не закрывается по нажатию Escape', async () => {
    let result = null;
    DialogManager.exec(createDialog({ pressEscAsCancel: false }))
      .then((data: boolean) => {
        result = data;
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
      });
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await delay(300);
    expect(result).toBeNull();
  });

  it('Если передан параметр okResult, при нажатии кнопки Ок передает заданное значение', async () => {
    let result = false;
    DialogManager.exec(createDialog({ okResult: 1 }))
      .then((data: boolean) => {
        result = data;
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
      });
    await delay(300);
    const dialog: HTMLElement = document.querySelector('.v-dialog');
    const btnOk = okBtn(dialog);
    btnOk.click();
    await delay(300);
    expect(result).toEqual(1);
  });

  it('Если передан параметр cancelResult, при нажатии кнопки Cancel передает заданное значение', async () => {
    let result = false;
    DialogManager.exec(createDialog({ cancelResult: 0 }))
      .then((data: boolean) => {
        result = data;
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
      });
    await delay(300);
    const dialog: HTMLElement = document.querySelector('.v-dialog');
    const btnCancel = cancelBtn(dialog);
    btnCancel.click();
    await delay(300);
    expect(result).toEqual(0);
  });
});

describe('DialogComponent: Info', () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    eventBus.$flush();
    document.body.innerHTML = `
      <div>
        <div id="app"></div>
      </div>
    `;
  });

  const createDialog = (props: Record<string, unknown> = {}) =>
    new InfoDialog({
      ...props,
      title: 'title',
      component: 'test-info-cmp',
      componentProps: {},
    });

  it('Корректно создает диалог типа Info', async () => {
    let result = null;
    DialogManager.exec(createDialog())
      .then(data => {
        result = data;
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
      });
    await delay(300);
    const dialog = document.querySelector('.v-dialog');
    const content: HTMLElement = dialog.querySelector('.ld-dialog-content');
    const id = modalId(content);
    expect(dialog.classList.contains('Info')).toBeTruthy();
    const testElement = dialog.querySelector('#test-info-element');
    expect(testElement).toBeDefined();
    const btn = wrapper.findComponent(`#ld-dialog-btn-ok-${id}`);
    expect(btn).toBeTruthy();
    btn.trigger('click');
    await delay(300);
    expect(result).toEqual(1);
  });

  it('По нажатию Enter срабатывает логика кнопки Ок', async () => {
    let result = null;
    DialogManager.exec(createDialog())
      .then(data => {
        result = data;
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
      });
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await delay(300);
    expect(result).toEqual(1);
  });

  it('По нажатию Escape закрывает окно', async () => {
    DialogManager.exec(createDialog());
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await delay(300);
    const dialog = document.querySelector('.ld-dialog-content');
    expect(dialog).toBeNull();
  });

  it('Если передан параметр pressEnterAsOk = false, логика кнопки Ок не срабатывает по нажатию Enter', async () => {
    DialogManager.exec(createDialog({ pressEnterAsOk: false }));
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await delay(300);
    const dialog = document.querySelector('.ld-dialog-content');
    expect(dialog).toBeDefined();
  });

  it('Если передан параметр pressEscAsCancel = false, окно не закрывается по нажатию Escape', async () => {
    DialogManager.exec(createDialog({ pressEscAsCancel: false }));
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await delay(300);
    const dialog = document.querySelector('.ld-dialog-content');
    expect(dialog).toBeDefined();
  });
});

describe('DialogComponent: Select', () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    eventBus.$flush();
    document.body.innerHTML = `
      <div>
        <div id="app"></div>
      </div>
    `;
  });

  const createDialog = (props: Record<string, unknown> = {}) =>
    new SelectDialog({
      ...props,
      title: 'title',
      component: 'test-select-cmp',
      componentProps: {
        selectedItems: [],
        disabledItems: [],
      },
    });

  const okBtn = (): VueWrapper => wrapper.findComponent('#select-btn-ok') as VueWrapper;
  const cancelBtn = (): VueWrapper => wrapper.findComponent('#select-btn-cancel') as VueWrapper;

  it('Корректно создает диалог типа Select', async () => {
    let result = null;
    DialogManager.exec(createDialog({ selectAsOk: true }))
      .then(data => {
        result = data;
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
      });
    await delay(300);
    const dialog: HTMLElement = document.querySelector('.v-dialog');
    expect(dialog.classList.contains('Select')).toBeTruthy();
    const btn = okBtn();
    expect(btn.exists()).toBeTruthy();
    btn.trigger('click');
    await delay(300);
    expect(result).toEqual(1);
  });

  it('Select: При отмене возвращает null', async () => {
    let result: unknown = 1;
    DialogManager.exec(createDialog({ selectAsOk: true }))
      .then(data => {
        result = data;
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
      });
    await delay(300);
    const btn = cancelBtn();
    expect(btn).toBeTruthy();
    btn.trigger('click');
    await delay(300);
    expect(result).toBeNull();
  });

  it('По нажатию Enter срабатывает логика кнопки Ок', async () => {
    let result = null;
    DialogManager.exec(createDialog())
      .then(data => {
        result = data;
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
      });
    await delay(300);
    const btn = okBtn();
    btn.trigger('click');
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await delay(300);
    expect(result).toEqual(1);
  });

  it('Если ничего не выбрано, кнопка Ок недоступна', async () => {
    let result = null;
    DialogManager.exec(createDialog({ selectAsOk: true }))
      .then(data => {
        result = data;
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
      });
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await delay(300);
    const dialog = document.querySelector('.ld-dialog-content');
    expect(dialog).toBeDefined();
    expect(result).toBeNull();
  });

  it('По нажатию Escape закрывает окно', async () => {
    DialogManager.exec(createDialog());
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await delay(300);
    const dialog = document.querySelector('.ld-dialog-content');
    expect(dialog).toBeNull();
  });

  it('Если передан параметр pressEnterAsOk = false, логика кнопки Ок не срабатывает по нажатию Enter', async () => {
    DialogManager.exec(createDialog({ pressEnterAsOk: false }));
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await delay(300);
    const dialog = document.querySelector('.ld-dialog-content');
    expect(dialog).toBeDefined();
  });

  it('Если передан параметр pressEscAsCancel = false, окно не закрывается по нажатию Escape', async () => {
    DialogManager.exec(createDialog({ pressEscAsCancel: false }));
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await delay(300);
    const dialog = document.querySelector('.ld-dialog-content');
    expect(dialog).toBeDefined();
  });

  it('Если выбрано значение, и пользователь нажимате кнопку Cancel, не передает выбранное значение', async () => {
    let result = null;
    DialogManager.exec(createDialog())
      .then(data => {
        result = data;
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
      });
    await delay(300);
    const btn = okBtn();
    btn.trigger('click');
    await delay(300);
    const dialog = document.querySelector('.v-dialog');
    const content: HTMLElement = dialog.querySelector('.ld-dialog-content');
    const id = modalId(content);
    const btnCancel: HTMLElement = content.querySelector(`#ld-dialog-btn-cancel-${id}`);
    expect(btnCancel).toBeDefined();
    btnCancel.click();
    await delay(300);
    expect(result).toEqual(null);
  });
});

describe('DialogComponent: CreateEdit', () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    eventBus.$flush();
    document.body.innerHTML = `
      <div>
        <div id="app"></div>
      </div>
    `;
  });

  const createDialog = (props: Record<string, unknown> = {}) =>
    new CreateEditDialog({
      ...props,
      title: 'title',
      component: 'test-create-edit-cmp',
      componentProps: {
        model: null,
      },
    });

  it('Корректно создает диалог типа CreateEdit', async () => {
    DialogManager.exec(createDialog());
    await delay(300);
    const dialog = document.querySelector('.v-dialog');
    expect(dialog.classList.contains('CreateEdit')).toBeTruthy();
  });

  it('Вызывается fetchData, если она передана', async () => {
    let result = null;
    DialogManager.exec(createDialog({ loading: true }), async () => {
      await delay(300);
      return {
        model: {
          name: 'dnwebui',
        },
      };
    })
      .then(data => {
        result = data;
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
      });
    await delay(600);
    const dialog = document.querySelector('.v-dialog');
    const content: HTMLElement = dialog.querySelector('.ld-dialog-content');
    const id = modalId(content);
    const btnOk: HTMLInputElement = content.querySelector(`#ld-dialog-btn-ok-${id}`);
    btnOk.click();
    await delay(300);
    expect(result).toEqual({ name: 'dnwebui' });
  });

  it('Валидация формы работает корректно', async () => {
    let host = null;
    eventBus.$on('dialog:created', (event: unknown) => {
      host = event;
    });
    DialogManager.exec(createDialog());
    await delay(300);
    expect(host).toBeDefined();
    const dialog = document.querySelector('.v-dialog');
    const content: HTMLElement = dialog.querySelector('.ld-dialog-content');
    const id = modalId(content);
    const btnOk: HTMLInputElement = content.querySelector(`#ld-dialog-btn-ok-${id}`);
    btnOk.click();
    await delay(300);
    const details = content.querySelector('.v-input__details');
    expect(details).toBeDefined();
    expect(details.textContent).toEqual('Это поле обязательно');
  });

  it('По нажатию Enter вызывает валидацию формы', async () => {
    DialogManager.exec(createDialog());
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await delay(300);
    const dialog = document.querySelector('.ld-dialog-content');
    const details = dialog.querySelector('.v-input__details');
    expect(details).toBeDefined();
    expect(details.textContent).toEqual('Это поле обязательно');
  });

  it('Если валидация формы проходит, по нажатию Enter закрывает окно с передачей выходных данных', async () => {
    let result = null;
    DialogManager.exec(createDialog({ loading: true }), async () => {
      await delay(300);
      return {
        model: {
          name: 'dnwebui',
        },
      };
    })
      .then(data => {
        result = data;
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
      });
    await delay(600);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await delay(300);
    const dialog = document.querySelector('.ld-dialog-content');
    expect(result).toEqual({ name: 'dnwebui' });
    expect(dialog).toBeNull();
  });

  // it('По нажатию Escape закрывает окно', async () => {
  //   DialogManager.exec(createDialog());
  //   await delay(300);
  //   window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  //   await delay(300);
  //   const dialog = document.querySelector('.ld-dialog-content');
  //   expect(dialog).toBeNull();
  // });

  it('Если передан параметр pressEnterAsOk = false, логика кнопки Ок не срабатывает по нажатию Enter', async () => {
    DialogManager.exec(createDialog({ pressEnterAsOk: false }));
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await delay(300);
    const dialog = document.querySelector('.ld-dialog-content');
    expect(dialog).toBeDefined();
  });

  it('Если передан параметр pressEscAsCancel = false, окно не закрывается по нажатию Escape', async () => {
    DialogManager.exec(createDialog({ pressEscAsCancel: false }));
    await delay(300);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await delay(300);
    const dialog = document.querySelector('.ld-dialog-content');
    expect(dialog).toBeDefined();
  });
});

describe('DialogComponent: Localized by id', () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    eventBus.$flush();
    document.body.innerHTML = `
      <div>
        <div id="app"></div>
      </div>
    `;
  });

  it('Если передан id, то вызывает локальный DialogManager', async () => {
    DialogManager.id('1').exec(
      new AlertDialog({
        title: 'title',
        content: 'text',
      })
    );
    await delay(300);
    const dialog = document.querySelector('.v-dialog');
    expect(dialog.classList.contains('Alert-1')).toBeTruthy();
    const content: HTMLElement = dialog.querySelector('.ld-dialog-content');
    const id = modalId(content);
    const btnOk: HTMLInputElement = dialog.querySelector(`#ld-dialog-btn-ok-${id}`);
    expect(btnOk).toBeTruthy();
    btnOk.click();
    await delay(300);
  });
});
