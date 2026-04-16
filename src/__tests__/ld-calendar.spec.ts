import { delay } from '@dn-web/core';
import { mount, VueWrapper } from '@vue/test-utils';
import { App, ComponentPublicInstance, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ui from '@/index';
import vuetify from '@/vuetify.setup';

interface IComponent {
  modelValue: string | Date;
  date: string | Date;
  $refs: Record<string, IComponent>;
  $el: HTMLElement;
}

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;
let component: IComponent;

const rootComponent = defineComponent({
  template: `
    <div>
      <ld-calendar v-model="date" v-bind="$props" ref="cmp" />
    </div>
  `,
  props: {
    month: {
      type: Number,
      default: undefined,
    },
  },
  data(): {
    date: string | Date;
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
              vue.mixin({
                computed: {
                  isDev() {
                    return $DEV;
                  },
                },
              });
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

describe('CalendarComponent', () => {
  beforeEach(async () => {
    await setupTest();
  });

  afterEach(() => {
    wrapper = null;
    component = null;
  });

  it('Корректно обрабатывает ввод', async () => {
    const d = new Date();
    d.setDate(15);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = wrapper.find(`[data-v-date="${d.getFullYear()}-${month}-15"]`);
    expect(day.exists()).toBeTruthy();
    const button = day.find('button');
    expect(button.exists()).toBeTruthy();
    button.trigger('click');
    await delay(300);
    expect(component.date instanceof Date).toBeTruthy();
    expect((component.date as Date).getFullYear()).toEqual(d.getFullYear());
    expect((component.date as Date).getMonth()).toEqual(d.getMonth());
    expect((component.date as Date).getDate()).toEqual(d.getDate());
  });
});
