import { ComponentMountingOptions, mount, VueWrapper } from '@vue/test-utils';
import { ComponentPublicInstance, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ldmui from '@/index';
import { delay } from '@/utils/delay';
import vuetify from '@/vuetify.setup';

interface IComponent {
  modelValue: string | number;
  text: string | number;
  password: string;
  $refs: Record<string, IComponent>;
  emitEnter: () => void;
}

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;
let component: IComponent;
let testComponent: IComponent;

const rootComponent = defineComponent({
  props: {
    onlyNumbers: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'text',
    },
  },
  template: `
    <div>
      <ld-edit-text v-bind="$props" v-model="text" v-model:value="password" ref="cmp" />
    </div>
  `,
  data(): {
    text: string;
    password: string;
  } {
    return {
      text: null,
      password: null,
    };
  },
});

function setupTest(props?: Record<string, unknown>) {
  try {
    let options: ComponentMountingOptions<void> = {
      provide: {
        form: {
          /* eslint-disable-next-line */
          register: () => {},
          /* eslint-disable-next-line */
          unregister: () => {},
        },
      },
      global: {
        plugins: [vuetify, ldmui],
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

describe('EditTextComponent', () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    wrapper = null;
    component = null;
    testComponent = null;
  });

  it('При нажатии клавиши Enter вызывает событие emitEnter', async () => {
    const input = wrapper.find('input');
    expect(input.exists()).toBeTruthy();
    const spy = jest.spyOn(testComponent, 'emitEnter');
    input.trigger('keydown', { key: 'Enter' });
    await delay(300);
    expect(spy).toHaveBeenCalled();
  });

  it('При установленном свойстве onlyNumbers не позволяет вводить string', async () => {
    wrapper.setProps({ onlyNumbers: true });
    await delay(300);
    const imask = wrapper.find('input');
    imask.element.value = 'a';
    imask.trigger('input');
    await delay(300);
    expect(testComponent.modelValue).toEqual(0);
  });

  it('При установленном свойстве onlyNumbers позволяет вводить числа', async () => {
    wrapper.setProps({ onlyNumbers: true });
    component.text = 4;
    await delay(300);
    expect(testComponent.modelValue).toEqual(4);
    component.text = 456;
    await delay(300);
    expect(testComponent.modelValue).toEqual(456);
  });
});

describe('EditTextComponent: Password', () => {
  beforeEach(() => {
    setupTest({
      props: {
        type: 'password',
      },
    });
  });

  afterEach(() => {
    wrapper = null;
    component = null;
    testComponent = null;
  });

  it('Правильно работет с type=password', async () => {
    const input = wrapper.find('input');
    input.element.value = '333';
    input.trigger('input');
    await delay(300);
    expect(component.text).toEqual('•••');
    expect(component.password).toEqual('333');
    const btn = wrapper.find('[aria-label="toggle"]');
    expect(btn.exists()).toBeTruthy();
    btn.trigger('click');
    await delay(300);
    expect(component.text).toEqual('333');
    expect(component.password).toEqual('333');
  });
});
