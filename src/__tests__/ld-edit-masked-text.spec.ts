import { delay } from '@dn-web/core';
import { mount, VueWrapper } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ui from '@/index';
import vuetify from '@/vuetify.setup';

interface IComponent extends Vue {
  modelValue: string;
  internalValue: string;
  text: string | number;
  value: string;
  $refs: Record<string, IComponent>;
}

let wrapper: VueWrapper<Vue>;
let component: IComponent;
let testComponent: IComponent;

const rootComponent = defineComponent({
  template: `
    <div>
      <ld-edit-masked-text v-model="text" :mask="mask" ref="cmp" />
    </div>
  `,
  data() {
    return {
      text: '',
      mask: /^\d+$/,
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
        plugins: [vuetify, ui],
      },
    };
    if (props) {
      options = { ...options, ...props };
    }
    wrapper = mount(rootComponent, options);
    component = wrapper.vm as unknown as IComponent;
    testComponent = component.$refs.cmp;
    await delay(1000);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

describe('EditMaskedTextComponent', () => {
  beforeEach(async () => {
    await setupTest();
  });

  afterEach(() => {
    wrapper = null;
    component = null;
    testComponent = null;
  });

  it('Правильно обрабатывает ввод только цифр', async () => {
    const imask = wrapper.find('input');
    imask.element.value = '1';
    imask.trigger('input');
    await delay(1000);
    expect(testComponent.internalValue).toEqual('1');
  });

  it('Не позволяет вводить символы при вводе только цифр', async () => {
    const imask = wrapper.find('input');
    imask.element.value = 'a';
    imask.trigger('input');
    await delay(1000);
    expect(testComponent.internalValue).toEqual('');
  });
});
