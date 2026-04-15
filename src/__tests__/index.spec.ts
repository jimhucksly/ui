import { mount, VueWrapper } from '@vue/test-utils';
import { App, ComponentPublicInstance, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ldmui, { delay } from '@/index';
import { ldmuiOptions } from '@/types/options';
import vuetify from '@/vuetify.setup';

interface IComponent {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  $ldmui: any;
  $el: HTMLElement;
}

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;
let component: IComponent;

const rootComponent = defineComponent({
  template: `
    <div>
      <ld-button>Button</ld-button>
      <icon-button>Icon</icon-button>
    </div>
  `,
  data() {
    return {};
  },
});

function setupTest(props?: Record<string, unknown>, options: ldmuiOptions = {}) {
  try {
    let config = {
      provide: {
        form: {
          /* eslint-disable-next-line */
          register: () => {},
          /* eslint-disable-next-line */
          unregister: () => {},
        },
      },
      global: {
        plugins: [
          vuetify,
          {
            install(vue: App) {
              vue.use(ldmui, options);
            },
          },
        ],
      },
    };
    if (props) {
      config = { ...config, ...props };
    }
    wrapper = mount(rootComponent, config);
    component = wrapper.vm as unknown as IComponent;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

describe('Index', () => {
  beforeEach(() => {
    setupTest(null, {
      LdButton: {
        variant: 'outlined',
      },
      extensions: [
        {
          name: 'icon-button',
          alias: 'ld-button',
          props: {
            icon: true,
          },
        },
      ],
    });
  });

  it('Библиотека компонентов успешно подключается', () => {
    expect(component.$ldmui).toBeDefined();
  });

  it('Работает переопределение дефолтных параметров компонентов', async () => {
    await delay(300);
    const btn = wrapper.find('.v-btn.v-btn--variant-outlined:not(.ld-button-square)');
    expect(btn.exists()).toBeTruthy();
  });

  it('Работает создание расширений из дефолтных компонентов', async () => {
    await delay(300);
    const btn = wrapper.find('.v-btn.v-btn--variant-outlined.ld-button-square');
    expect(btn.exists()).toBeTruthy();
  });
});
