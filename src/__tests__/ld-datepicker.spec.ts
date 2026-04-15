import { mount, VueWrapper } from '@vue/test-utils';
import { App, ComponentPublicInstance, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ldmui, { delay } from '@/index';
import vuetify from '@/vuetify.setup';

interface IComponent {
  modelValue: string | Date;
  date: string | Date;
  uid: string;
  $refs: Record<string, IComponent>;
  onSelectDate: (value: string) => void;
  onInputDateClear: () => void;
}

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;
let component: IComponent;
let testComponent: IComponent;

const rootComponent = defineComponent({
  template: `
    <div>
      <ld-datepicker v-model="date" v-bind="$props" ref="cmp" />
    </div>
  `,
  props: {
    dateonly: {
      type: Boolean,
      default: false,
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
    testComponent = component.$refs.cmp;
    await delay(300);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

describe('DatepickerComponent', () => {
  beforeEach(async () => {
    await setupTest();
  });

  afterEach(() => {
    wrapper = null;
    component = null;
    testComponent = null;
  });

  it('Если на вход приходит Date с текущим временем, то возвращаем дату c обнуленным временем', async () => {
    const ddt = new Date();
    await wrapper.setProps({ dateonly: true });
    component.date = ddt;
    await delay(300);
    expect(testComponent.modelValue).toEqual(new Date(ddt.setHours(0, 0, 0, 0)));
  });

  it('Если на вход приходит Date, то возврат - тоже Date', async () => {
    const ddt = new Date();
    await wrapper.setProps({
      dateonly: false,
    });
    component.date = ddt;
    await delay(300);
    expect(testComponent.modelValue).toBeInstanceOf(Date);
  });

  it('Если на вход приходит String, то возврат - тоже String', async () => {
    const ddt = new Date();
    component.date = ddt.toISOString();
    await delay(300);
    expect(typeof testComponent.modelValue).toEqual('string');
  });

  it('Правильно обрабатывает ввод из v-date-picker', async () => {
    const dt = new Date(2021, 0, 22);
    testComponent.onSelectDate(dt.toString());
    await delay(300);
    expect((testComponent.modelValue as Date).toDateString()).toEqual('Fri Jan 22 2021');
  });

  it('Очистка поля ввода даты', async () => {
    const dt = new Date();
    component.date = dt.toISOString();
    await delay(300);
    testComponent.onInputDateClear();
    await delay(300);
    expect(testComponent.modelValue).toBeNull();
  });

  it('Ручной ввод даты', async () => {
    const uid = testComponent.uid;
    const input = wrapper.find(`#input-date-${uid}`);
    (input.element as HTMLInputElement).value = '22012021';
    input.trigger('input');
    await delay(300);
    expect((testComponent.modelValue as Date).toDateString()).toEqual('Fri Jan 22 2021');
  });

  it('Ручной ввод неправильной даты', async () => {
    const uid = testComponent.uid;
    const input = wrapper.find(`#input-date-${uid}`);
    (input.element as HTMLInputElement).value = '1901';
    input.trigger('input');
    await delay(300);
    expect(testComponent.modelValue).toBeNull();
  });
});
