import { delay } from '@dn-web/core';
import { mount, VueWrapper } from '@vue/test-utils';
import { App, ComponentPublicInstance, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ui from '@/index';
import vuetify from '@/vuetify.setup';

interface IComponent {
  selected: number | string | Array<unknown>;
  value: number | string | Array<unknown>;
  $refs: Record<string, IComponent>;
  onSelect: (value: unknown) => void;
}

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;
let component: IComponent;
let testComponent: IComponent;

const items = [
  {
    id: 0,
    value: 'item-0',
  },
  {
    id: 1,
    value: 'item-1',
  },
  {
    id: 3,
    value: 'item-3',
  },
];

const rootComponent = defineComponent({
  props: {
    items: {
      type: Array,
      default: (): Array<unknown> => [],
    },
    returnObject: {
      type: Boolean,
      default: false,
    },
    multiselect: {
      type: Boolean,
      default: false,
    },
    itemValue: {
      type: String,
      default: 'id',
    },
  },
  template: `
    <div>
      <ld-select v-bind="$props" v-model="value" ref="cmp"></ld-select>
    </div>
  `,
  data(): {
    value: Array<unknown>;
  } {
    return {
      value: null,
    };
  },
});

function setupTest(props?: Record<string, unknown>) {
  try {
    let options = {
      provide: {
        form: {
          register: () => {},
          unregister: () => {},
        },
      },
      global: {
        plugins: [
          vuetify,
          {
            install(vue: App) {
              vue.use(ui);
            },
          },
        ],
      },
    };
    if (props) {
      options = { ...options, ...props };
    }
    wrapper = mount(rootComponent, options);
    component = wrapper.vm as unknown as IComponent;
    testComponent = component.$refs.cmp;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

describe('SelectComponent', () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    wrapper = null;
    component = null;
    testComponent = null;
  });

  it('Правильно обновляет модель при выборе элемента', async () => {
    wrapper.setProps({
      items,
    });
    await delay(300);
    testComponent.onSelect(items[0]);
    await delay(300);
    expect(component.value).toEqual(0);
  });

  it('Возвращает объект при параметре returnObject', async () => {
    wrapper.setProps({
      items,
      returnObject: true,
    });
    await delay(300);
    testComponent.onSelect(items[1]);
    await delay(300);
    expect(component.value).toEqual(items[1]);
  });

  it('С параметром multiselect возвращает массив значений', async () => {
    await wrapper.setProps({
      items,
      multiselect: true,
    });
    await delay(300);
    testComponent.onSelect(items[0]);
    testComponent.onSelect(items[1]);
    await delay(300);
    expect(component.value).toEqual([0, 1]);
  });

  it('С параметром multiselect и returnObject возвращает массив объектов', async () => {
    await wrapper.setProps({
      items,
      returnObject: true,
      multiselect: true,
    });
    await delay(300);
    testComponent.onSelect(items[0]);
    testComponent.onSelect(items[1]);
    await delay(300);
    expect(component.value).toEqual([items[0], items[1]]);
  });

  it('Правильно переопределяет поле c id', async () => {
    const item = {
      idd: 0,
      value: 'item-0',
    };
    await wrapper.setProps({
      items: [item],
      itemValue: 'idd',
    });
    await delay(300);
    testComponent.onSelect(item);
    await delay(300);
    expect(component.value).toEqual(0);
  });
});
