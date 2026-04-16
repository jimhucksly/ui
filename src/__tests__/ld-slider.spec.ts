import { delay } from '@dn-web/core';
import { mount, VueWrapper } from '@vue/test-utils';
import { App, ComponentPublicInstance, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ui from '@/index';
import vuetify from '@/vuetify.setup';

interface IComponent {
  value: string | number | Array<string | number>;
  internalValue: number | Array<number>;
  $refs: Record<string, IComponent>;
}

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;
let component: IComponent;
let testComponent: IComponent;

const rootComponent = defineComponent({
  props: {
    range: {
      type: Boolean,
      default: false,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
  },
  template: `
    <div>
      <ld-slider v-model="value" v-bind="$props" ref="cmp" />
    </div>
  `,
  data() {
    return {
      value: 0,
    };
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

describe('SliderComponent', () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    wrapper = null;
    component = null;
  });

  it('Корректно обрабатывает входящие значения, range = false', async () => {
    component.value = 55;
    await delay(300);
    expect(testComponent.internalValue).toEqual(55);

    component.value = '55';
    await delay(300);
    expect(testComponent.internalValue).toEqual(55);

    component.value = 0;
    await delay(300);
    expect(testComponent.internalValue).toEqual(0);

    component.value = '0';
    await delay(300);
    expect(testComponent.internalValue).toEqual(0);

    component.value = [55, 65];
    await delay(300);
    expect(testComponent.internalValue).toEqual(55);

    component.value = ['55', '65'];
    await delay(300);
    expect(testComponent.internalValue).toEqual(55);

    component.value = ['a', '65'];
    await delay(300);
    expect(testComponent.internalValue).toEqual(0);

    component.value = ['55', 'a'];
    await delay(300);
    expect(testComponent.internalValue).toEqual(55);

    component.value = '55,65';
    await delay(300);
    expect(testComponent.internalValue).toEqual(55);

    component.value = 'a';
    await delay(300);
    expect(testComponent.internalValue).toEqual(0);

    component.value = 'a,55';
    await delay(300);
    expect(testComponent.internalValue).toEqual(0);

    component.value = '55, a';
    await delay(300);
    expect(testComponent.internalValue).toEqual(55);
  });

  it('Корректно обрабатывает входящие значения, range = true', async () => {
    wrapper.setProps({
      range: true,
    });
    await delay(300);

    component.value = 55;
    await delay(300);
    expect(testComponent.internalValue).toEqual([55, 55]);

    component.value = '55';
    await delay(300);
    expect(testComponent.internalValue).toEqual([55, 55]);

    component.value = 0;
    await delay(300);
    expect(testComponent.internalValue).toEqual([0, 100]);

    component.value = '0';
    await delay(300);
    expect(testComponent.internalValue).toEqual([0, 100]);

    component.value = [55, 65];
    await delay(300);
    expect(testComponent.internalValue).toEqual([55, 65]);

    component.value = ['55', '65'];
    await delay(300);
    expect(testComponent.internalValue).toEqual([55, 65]);

    component.value = ['a', '65'];
    await delay(300);
    expect(testComponent.internalValue).toEqual([0, 65]);

    component.value = ['55', 'a'];
    await delay(300);
    expect(testComponent.internalValue).toEqual([55, 100]);

    component.value = '55,65';
    await delay(300);
    expect(testComponent.internalValue).toEqual([55, 65]);

    component.value = 'a';
    await delay(300);
    expect(testComponent.internalValue).toEqual([0, 100]);

    component.value = 'a,55';
    await delay(300);
    expect(testComponent.internalValue).toEqual([0, 55]);

    component.value = '55, a';
    await delay(300);
    expect(testComponent.internalValue).toEqual([55, 100]);
  });
});
