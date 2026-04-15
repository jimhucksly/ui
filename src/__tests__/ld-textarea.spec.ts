import { mount, VueWrapper } from '@vue/test-utils';
import { App, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ldmui, { delay } from '@/index';
import vuetify from '@/vuetify.setup';

interface IComponent {
  modelValue: string | number;
  text: string | number;
  $refs: Record<string, IComponent>;
  emitEnter: () => void;
}

let wrapper: VueWrapper<Vue>;
let component: IComponent;
let testComponent: IComponent;

const rootComponent = defineComponent({
  template: `
    <div>
      <ld-textarea v-bind="$props" v-model="text" ref="cmp" />
    </div>
  `,
  data() {
    return {
      text: null,
    };
  },
});

function setupTest(props?: Record<string, unknown>) {
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
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

describe('TextareaComponent', () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    wrapper = null;
    component = null;
  });

  it('Успешно передает введенный текст в родительский компонент', async () => {
    const textarea = wrapper.find('textarea');
    await textarea.setValue('some value');
    expect(component.text).toEqual('some value');
  });

  it('При изменении модели в родительском компоненте, отображает новый текст', async () => {
    component.text = 'test string';
    await delay(300);
    const textarea = wrapper.find('textarea');
    expect(textarea.element.value).toEqual('test string');
  });

  it('При нажатии клавиши Enter вызывает событие emitEnter', async () => {
    const input = wrapper.find('textarea');
    expect(input.exists()).toBeTruthy();
    const spy = jest.spyOn(testComponent, 'emitEnter');
    input.trigger('keydown', { key: 'Enter' });
    await delay(300);
    expect(spy).toHaveBeenCalled();
  });
});
