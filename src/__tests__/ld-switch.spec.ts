import { delay } from '@dn-web/core';
import { mount, VueWrapper } from '@vue/test-utils';
import { App, ComponentPublicInstance, DefineComponent, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ui from '@/index';
import vuetify from '@/vuetify.setup';

interface IComponent {
  value: boolean | string;
  modelValue: boolean;
  internalValue: boolean | string;
  $refs: Record<string, IComponent>;
}

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;
let component: IComponent;
let testComponent: IComponent;

const rootComponent1 = defineComponent({
  template: `
    <div>
      <ld-switch v-model="value" ref="cmp" />
    </div>
  `,
  data() {
    return {
      value: false,
    };
  },
});

const rootComponent2 = defineComponent({
  template: `
    <div>
      <ld-switch v-model="value" ref="cmp" true-value="+" false-value="-" />
    </div>
  `,
  data() {
    return {
      value: '-',
    };
  },
});

function setupTest(props: Record<string, unknown>, cmp: DefineComponent) {
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
    wrapper = mount(cmp, options);
    component = wrapper.vm as unknown as IComponent;
    testComponent = component.$refs.cmp;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

describe('SwitchComponent 1', () => {
  beforeEach(() => {
    setupTest(null, rootComponent1 as unknown as DefineComponent);
  });

  afterEach(() => {
    wrapper = null;
    component = null;
    testComponent = null;
  });

  it('Корректно создается с дефолтным значением false', async () => {
    await delay(300);
    expect(testComponent.modelValue).toEqual(false);
    expect(testComponent.internalValue).toEqual(false);
    expect(component.value).toEqual(false);
  });

  it('Корректно создается с дефолтным значением true', async () => {
    component.value = true;
    await delay(300);
    expect(testComponent.modelValue).toEqual(true);
    expect(testComponent.internalValue).toEqual(true);
    expect(component.value).toEqual(true);
  });
});

describe('SwitchComponent 2', () => {
  beforeEach(() => {
    setupTest(null, rootComponent2 as unknown as DefineComponent);
  });

  afterEach(() => {
    wrapper = null;
    component = null;
    testComponent = null;
  });

  it('При инициализации корректно устанавливает исходное значение', async () => {
    await delay(300);
    expect(component.value).toEqual('-');
  });

  it('Корректно изменяет значение в соответствии с параметрами trueValue и falseValue', async () => {
    component.value = '+';
    await delay(300);
    expect(testComponent.modelValue).toEqual('+');
    expect(testComponent.internalValue).toEqual('+');
    expect(component.value).toEqual('+');
  });
});
