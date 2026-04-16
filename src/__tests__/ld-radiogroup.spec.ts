import { delay } from '@dn-web/core';
import { mount, VueWrapper } from '@vue/test-utils';
import { App, ComponentPublicInstance, defineComponent } from 'vue';
import { VueBase } from 'vue-class-component';
import { Vue } from 'vue-property-decorator';
import ui from '@/index';
import vuetify from '@/vuetify.setup';

interface IRadio extends VueBase {
  isChecked: boolean;
  uid: number;
  value: unknown;
}

interface IComponent {
  modelValue: string | number;
  radios: Array<IRadio>;
  value: unknown;
  $refs: Record<string, IComponent>;
  $el: HTMLElement;
}

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;
let component: IComponent;
let testComponent: IComponent;

const rootComponent = defineComponent({
  props: {
    values: {
      type: Array,
      default: (): Array<unknown> => [],
    },
  },
  template: `
    <div>
      <ld-radiogroup v-model="value" ref="cmp">
        <template v-for="val of values">
          <ld-radiobutton :value="val" />
        </template>
      </ld-radiogroup>
    </div>
  `,
  data(): {
    value: unknown;
  } {
    return {
      value: null,
    };
  },
});

const rootComponent2 = defineComponent({
  props: {
    values: {
      type: Array,
      default: (): Array<unknown> => [],
    },
  },
  template: `
    <div>
      <ld-radiogroup v-model="value" ref="cmp2" :values="values" />
    </div>
  `,
  data(): {
    value: unknown;
  } {
    return {
      value: null,
    };
  },
});

function setupTest(props?: Record<string, unknown>, order: number = 0) {
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
    wrapper = mount(order ? rootComponent2 : rootComponent, options);
    component = wrapper.vm as unknown as IComponent;
    testComponent = component.$refs.cmp;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

describe('RadioGroupComponent', () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    wrapper = null;
    component = null;
    testComponent = null;
  });

  it('Правильно создает массив радиокнопок', async () => {
    wrapper.setProps({
      values: [1, 2, 3],
    });
    await delay(300);
    expect(testComponent.radios.length).toEqual(3);
  });

  it('Возвращает правильное значение типа number', async () => {
    wrapper.setProps({
      values: [1, 2, 3],
    });
    await delay(300);
    const uid = testComponent.radios[0].uid;
    const radiobutton = wrapper.find('#radiobutton-' + uid);
    expect(radiobutton).toBeDefined();
    radiobutton.trigger('input');
    await delay(300);
    expect(component.value).toEqual(1);
  });

  it('Возвращает правильное значение типа string', async () => {
    wrapper.setProps({
      values: ['a', 'b', 'c'],
    });
    await delay(300);
    const uid = testComponent.radios[0].uid;
    const radiobutton = wrapper.find('#radiobutton-' + uid);
    radiobutton.trigger('input');
    await delay(300);
    expect(component.value).toEqual('a');
  });

  it('Возвращает правильное значение типа boolean', async () => {
    wrapper.setProps({
      values: [true, false],
    });
    await delay(300);
    const uid = testComponent.radios[0].uid;
    const radiobutton = wrapper.find('#radiobutton-' + uid);
    radiobutton.trigger('input');
    await delay(300);
    expect(component.value).toBeTruthy();
  });

  it('Правильно устанавливает активный переключатель', async () => {
    wrapper.setProps({
      values: [1, 2, 3],
    });
    await delay(300);
    component.value = 2;
    await delay(300);
    const input0 = testComponent.radios[0];
    const input1 = testComponent.radios[1];
    const input2 = testComponent.radios[2];
    expect(input0.isChecked).toBeFalsy();
    expect(input1.isChecked).toBeTruthy();
    expect(input2.isChecked).toBeFalsy();
  });
});

describe('RadioGroupComponent 2', () => {
  beforeEach(() => {
    setupTest({}, 1);
  });

  afterEach(() => {
    wrapper = null;
    component = null;
    testComponent = null;
  });

  it('Корректно создает массив радиoкнопок из атрибута values', async () => {
    wrapper.setProps({
      values: [
        { label: 'radibutton1', value: 1 },
        { label: 'radiobutton2', value: 2 },
      ],
      initialWithChildren: false,
    });
    await delay(300);
    const items = wrapper.findAll('.ld-radiobutton');
    expect(items.length).toEqual(2);
    const item = wrapper.find('.ld-radiobutton');
    expect(item.element.textContent).toEqual('radibutton1');
  });
});
