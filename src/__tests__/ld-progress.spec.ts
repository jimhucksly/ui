import { delay } from '@dn-web/core';
import { mount, VueWrapper } from '@vue/test-utils';
import { App, ComponentPublicInstance, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ui from '@/index';
import vuetify from '@/vuetify.setup';

interface IComponent {
  value: string | number;
  internalValue: number;
  $refs: Record<string, IComponent>;
}

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;
let component: IComponent;
let testComponent: IComponent;

const rootComponent = defineComponent({
  props: {
    value: {
      type: [Number, String],
      default: 0,
    },
  },
  template: `
    <div>
      <ld-progress :value="value" ref="cmp" />
    </div>
  `,
});

function setupTest(props?: Record<string, unknown>, order: number = 0) {
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

describe('ProgressComponent', () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    wrapper = null;
    component = null;
    testComponent = null;
  });

  it('Корректно обрабатывает переданное значение, если typeof value === string', async () => {
    wrapper.setProps({
      value: '0.5',
    });
    await delay(300);
    expect(testComponent.internalValue).toEqual(50);
    wrapper.setProps({
      value: '55',
    });
    await delay(300);
    expect(testComponent.internalValue).toEqual(55);
    wrapper.setProps({
      value: 'aaa',
    });
    await delay(300);
    expect(testComponent.internalValue).toEqual(0);
  });

  it('Корректно обрабатывает переданное значение, если typeof value === number', async () => {
    wrapper.setProps({
      value: 0.5,
    });
    await delay(300);
    expect(testComponent.internalValue).toEqual(50);
    wrapper.setProps({
      value: 55,
    });
    await delay(300);
    expect(testComponent.internalValue).toEqual(55);
    wrapper.setProps({
      value: null,
    });
    await delay(300);
    expect(testComponent.internalValue).toEqual(0);
  });

  it('Если передано отрицательное значение, ставит 0', async () => {
    wrapper.setProps({
      value: -1,
    });
    await delay(300);
    expect(testComponent.internalValue).toEqual(0);
  });

  it('Если передано значение больше 100, ставит 100', async () => {
    wrapper.setProps({
      value: 155,
    });
    await delay(300);
    expect(testComponent.internalValue).toEqual(100);
  });
});
