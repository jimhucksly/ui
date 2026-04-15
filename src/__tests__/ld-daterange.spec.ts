import { mount, VueWrapper } from '@vue/test-utils';
import { App, ComponentPublicInstance, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ldmui, { delay } from '@/index';
import vuetify from '@/vuetify.setup';

interface IComponent {
  modelValue: Array<string | Date>;
  date: Array<string | Date>;
  $refs: Record<string, IComponent>;
}

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;
let component: IComponent;

const rootComponent = defineComponent({
  template: `
    <div>
      <ld-daterange v-model="date" v-bind="$props" ref="cmp" />
    </div>
  `,
  data(): {
    date: Array<string | Date>;
  } {
    return {
      date: null,
    };
  },
});

async function setupTest(props?: Record<string, unknown>) {
  try {
    let options = {
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
              vue.use(ldmui);
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
    await delay(300);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

describe('DaterangeComponent', () => {
  beforeEach(async () => {
    await setupTest();
  });

  afterEach(() => {
    wrapper = null;
    component = null;
  });

  it('Если на вход приходит массив строк, должен правильно преобразовывать их в даты', async () => {
    component.date = ['03.05.2026', '15.05.2026'];
    await delay(300);
    const [a, b] = component.date as Array<Date>;
    expect(a instanceof Date).toBeTruthy();
    expect(b instanceof Date).toBeTruthy();
    expect(a.toISOString()).toEqual('2026-05-03T00:00:00.000Z');
    expect(b.toISOString()).toEqual('2026-05-15T00:00:00.000Z');
  });
});
