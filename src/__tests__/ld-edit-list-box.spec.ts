import { ComponentMountingOptions, mount, VueWrapper } from '@vue/test-utils';
import { ComponentPublicInstance, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ldmui, { delay } from '@/index';
import vuetify from '@/vuetify.setup';

interface IComponent {
  $refs: Record<string, IComponent>;
  $el: HTMLElement;
  value: Array<string>;
  editError: string;
  onAddItem: () => void;
  onEnter: () => void;
}

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;
let component: IComponent;
let testComponent: IComponent;

const rootComponent = defineComponent({
  props: {
    format: Object,
    onlyUnique: Boolean,
  },
  template: `
    <div>
      <ld-edit-list-box
        v-model="value"
        v-bind="$props"
        ref="cmp"
        :messages="{ validation: 'value is invalid', nonUnique: 'value is non unique' }"
      />
    </div>
  `,
  data(): {
    value: Array<unknown>;
  } {
    return {
      value: [],
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

describe('EditListBoxComponent', () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    wrapper = null;
    component = null;
    testComponent = null;
  });

  it('Корректно добавляет значение в модель', async () => {
    testComponent.onAddItem();
    await delay(300);
    const text = wrapper.findComponent('.ld-edit-text');
    expect(text.exists()).toBeTruthy();
    const input = text.find('input');
    expect(input.exists()).toBeTruthy();
    input.setValue('hello world');
    input.trigger('keydown', { key: 'Enter' });
    await delay(300);
    expect(component.value).toEqual(['hello world']);
  });

  it('При переданном параметре format не пропускает невалидные значения', async () => {
    wrapper.setProps({ format: /^\d\d\d$/ });
    await delay(300);
    testComponent.onAddItem();
    await delay(300);
    const text = wrapper.findComponent('.ld-edit-text');
    const input = text.find('input');
    input.setValue('aaa');
    input.trigger('keydown', { key: 'Enter' });
    await delay(300);
    expect(component.value).toEqual([]);
    expect(testComponent.editError).toEqual('value is invalid');
  });

  it('При переданном параметре onlyUnique не пропускает повторяющиеся значения', async () => {
    wrapper.setProps({ onlyUnique: true });
    await delay(300);
    testComponent.onAddItem();
    await delay(300);
    let text = wrapper.findComponent('.ld-edit-text');
    let input = text.find('input');
    input.setValue('aaa');
    input.trigger('keydown', { key: 'Enter' });
    await delay(300);
    testComponent.onAddItem();
    await delay(300);
    text = wrapper.findComponent('.ld-edit-text');
    input = text.find('input');
    input.setValue('aaa');
    input.trigger('keydown', { key: 'Enter' });
    expect(component.value).toEqual(['aaa']);
    expect(testComponent.editError).toEqual('value is non unique');
  });
});
