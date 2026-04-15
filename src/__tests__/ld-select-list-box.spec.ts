import { mount, VueWrapper } from '@vue/test-utils';
import { App, ComponentPublicInstance, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ldmui, { delay } from '@/index';
import { TElement } from '@/types/combobox';
import vuetify from '@/vuetify.setup';

interface IComponent {
  value: number | Array<number>;
  selected: Array<Record<string, unknown>>;
  $refs: Record<string, IComponent>;
  $el: HTMLElement;
  $emit: (event: string) => void;
  validate: () => string | boolean;
  fetchItem: () => void;
  fetchData: () => void;
  onSelect: (item: TElement) => void;
  onUnselect: (item: TElement) => void;
}

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;
let component: IComponent;
let testComponent: IComponent;

const list = [
  {
    id: 0,
    value: 'item-0',
  },
  {
    id: 1,
    value: 'item-1',
  },
  {
    id: 2,
    value: 'item-2',
  },
  {
    id: 3,
    value: 'item-3',
  },
  {
    id: 4,
    value: 'item-4',
  },
];

const rootComponent = defineComponent({
  props: {
    inputHint: String,
    required: Boolean,
    persistentHint: Boolean,
    multiselect: Boolean,
    returnObject: Boolean,
  },
  template: `
    <div>
      <ld-select-list-box
        v-model="value"
        v-model:model-items="selected"
        v-bind="$props"
        :fetch-item="fetchItem"
        ref="cmp"
        :messages="{
          validation: 'Validation failed'
        }"
      />
    </div>
  `,
  data() {
    return {
      value: null,
      selected: [],
    };
  },
  methods: {
    fetchItem(ids: Array<number>) {
      return this.fetchData(ids);
    },
    fetchData(ids: Array<number>) {
      return list.filter(el => ids.includes(el.id));
    },
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

describe('SelectListBoxComponent', () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    wrapper = null;
    component = null;
    testComponent = null;
  });

  it('Постояннно отображает подсказку под полем ввода при включенном persistentHint', async () => {
    wrapper.setProps({
      persistentHint: true,
      inputHint: 'Hint',
    });
    await delay(300);
    const messageElement = testComponent.$el.querySelector('.v-messages__message');
    expect(messageElement.textContent).toEqual('Hint');
  });

  it('Вызывает fetchItem при передачи значения в модель', async () => {
    const spy = jest.spyOn(component, 'fetchData');
    component.value = 1;
    await delay(300);
    expect(spy).toHaveBeenCalled();
  });

  it('Должен возвращать значение, если multiselect = false', async () => {
    component.value = 3;
    wrapper.setProps({
      multiselect: false,
    });
    await delay(300);
    const selected = list.find(el => el.id === 3);
    expect(component.value).toEqual(3);
    expect(component.selected).toEqual(selected);
  });

  it('Должен возвращать массив, если multiselect = true', async () => {
    component.value = 3;
    wrapper.setProps({
      multiselect: true,
    });
    await delay(300);
    const selected = list.find(el => el.id === 3);
    expect(component.value).toEqual([3]);
    expect(component.selected).toEqual([selected]);
  });

  it('Корректно удаляет значение', async () => {
    component.value = [3, 4];
    wrapper.setProps({
      multiselect: true,
    });
    await delay(300);
    const item = list.find(el => el.id === 3);
    const selected = list.find(el => el.id === 4);
    testComponent.onUnselect(item);
    await delay(300);
    expect(component.value).toEqual([4]);
    expect(component.selected).toEqual([selected]);
  });

  it('Должен отображать переданное сообщение о валидации при пустом значении', async () => {
    component.value = [];
    wrapper.setProps({ required: true });
    await delay(300);
    testComponent.validate();
    await delay(300);
    const validationElement = testComponent.$el.querySelector('.v-messages__message');
    expect(validationElement.textContent).toEqual('Validation failed');
  });

  it('Должен корректно очищать поле от старых значений, (multiselect = false)', async () => {
    component.value = 3;
    wrapper.setProps({
      multiselect: false,
    });
    await delay(300);
    expect(component.value).toEqual(3);
    component.value = null;
    await delay(300);
    expect(component.value).toBeNull();
    expect(component.selected).toBeNull();
  });

  it('Должен корректно очищать поле от старых значений, (multiselect = true)', async () => {
    wrapper.setProps({
      multiselect: true,
    });
    component.value = [3, 4];
    await delay(300);
    expect(component.value).toEqual([3, 4]);
    component.value = null;
    await delay(300);
    expect(component.value).toStrictEqual([]);
    expect(component.selected).toStrictEqual([]);
  });

  it('Корректно заменяет выбранное значение при передаче нового (multiselect = false)', async () => {
    component.value = 3;
    wrapper.setProps({
      multiselect: false,
    });
    await delay(300);
    expect(component.value).toEqual(3);
    component.value = 4;
    await delay(300);
    const selected = list.find(el => el.id === 4);
    expect(component.value).toEqual(4);
    expect(component.selected).toStrictEqual(selected);
  });

  it('Корректно заменяет выбранное значение при передаче нового (multiselect = true)', async () => {
    component.value = [3];
    wrapper.setProps({
      multiselect: true,
    });
    await delay(300);
    expect(component.value).toEqual([3]);
    component.value = [4];
    await delay(300);
    const selected = list.find(el => el.id === 4);
    expect(component.value).toEqual([4]);
    expect(component.selected).toStrictEqual([selected]);
  });

  it('Возвращает объект, если передан параметр returnObject', async () => {
    component.value = 3;
    await wrapper.setProps({
      returnObject: true,
    });
    await delay(300);
    const selected = list.find(el => el.id === 3);
    expect(component.value).toEqual(selected);
    expect(component.selected).toEqual(selected);
  });
});
