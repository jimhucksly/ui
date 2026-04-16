import { delay } from '@dn-web/core';
import { mount, VueWrapper } from '@vue/test-utils';
import { App, ComponentPublicInstance, defineComponent } from 'vue';
import { Vue } from 'vue-class-component';
import ui from '@/index';
import { TElement } from '@/types/combobox';
import vuetify from '@/vuetify.setup';

interface IComponent {
  value: string | number | Array<string | number>;
  selected: Record<string, unknown> | Array<Record<string, unknown>>;
  $refs: Record<string, IComponent>;
  $el: HTMLElement;
  items: Array<Record<string, unknown>>;
  showHint: boolean;
  optionsList: Array<unknown>;
  fetchElements: () => void;
  onSelect: (item: TElement) => void;
  onUnselect: (item: TElement) => void;
  validate: () => string | boolean;
}

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;
let component: IComponent;
let testComponent: IComponent;

const rootComponent = defineComponent({
  template: `
    <div>
      <ld-combobox
        v-model="value"
        v-model:model-items="selected"
        v-bind="{
          ...$props,
          items: options,
        }"
        ref="cmp"
        :messages="{
          validation: 'Validation failed'
        }"
        @update:items="
          $event => {
            options = $event;
          }
        "
      />
    </div>
  `,
  props: {
    inputHint: String,
    required: Boolean,
    persistentHint: Boolean,
    multiselect: Boolean,
    items: Array,
    fetchData: Function,
    returnObject: Boolean,
    lazyLoad: Boolean,
  },
  data(): {
    value: unknown;
    selected: Array<unknown>;
    options: Array<unknown>;
  } {
    return {
      value: null,
      selected: [],
      options: [],
    };
  },
  watch: {
    items: {
      immediate: true,
      handler(value: unknown) {
        this.options = value;
      },
    },
  },
});

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

function setupTest(props?: Record<string, unknown>) {
  try {
    let options = {
      sync: false,
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

describe('ComboboxComponent', () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    wrapper = null;
    component = null;
    testComponent = null;
  });

  it('Когда переданы items, multiselect=false и пользователь выбрал 2-й элемент', async () => {
    const items = [
      { id: '7', value: 'item7' },
      { id: '8', value: 'item8' },
      { id: '9', value: 'item9' },
    ];
    await wrapper.setProps({
      items,
    });
    await delay(300);
    testComponent.onSelect(items[1]);
    await delay(300);
    expect(component.value).toEqual('8');
    expect(component.selected).toEqual(items[1]);
  });

  it('Когда переданы items, v-model и multiselect=false, свойство selected должен быть равен v-model', async () => {
    const vModel = 1;
    await wrapper.setProps({
      items: list,
      multiselect: false,
    });
    await delay(300);
    component.value = vModel;
    await delay(300);
    const i = list.findIndex(item => item.id === vModel);
    expect(component.selected).toEqual(list[i]);
    expect(component.value).toEqual(vModel);
  });

  it('Когда переданы items, v-model и multiselect=true, свойство selected должен быть массивом', async () => {
    const vModel = [1, 3];
    await wrapper.setProps({
      items: list,
      multiselect: true,
    });
    await delay(300);
    component.value = vModel;
    await delay(300);
    const selected = list.filter(item => vModel.includes(item.id));
    expect(component.selected).toEqual(selected);
  });

  it('Правильно удаляет элемент', async () => {
    const vModel = [1, 3];
    await wrapper.setProps({
      items: list,
      multiselect: true,
    });
    await delay(300);
    component.value = vModel;
    await delay(300);
    const selected = list.filter(item => vModel.includes(item.id));
    expect(component.selected).toEqual(selected);
    testComponent.onUnselect(selected[0]);
    await delay(800);
    expect(component.selected).toEqual([selected[1]]);
    expect(component.value).toEqual([3]);
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

  it('Должен отображать переданное сообщение о валидации при пустом значении', async () => {
    component.selected = [];
    wrapper.setProps({ required: true });
    await delay(300);
    testComponent.validate();
    await delay(300);
    const validationElement = testComponent.$el.querySelector('.v-messages__message');
    expect(validationElement.textContent).toEqual('Validation failed');
  });

  it('При изменении модели вызывается fetchData', async () => {
    wrapper.setProps({
      fetchData: () => list,
    });
    await delay(300);
    const spy = jest.spyOn(testComponent, 'fetchElements');
    component.value = 1;
    await delay(300);
    expect(spy).toHaveBeenCalled();
  });

  it('Должен корректно очищать поле от старых значений (multiselect = false)', async () => {
    component.value = 3;
    await wrapper.setProps({
      items: list,
      multiselect: false,
    });
    await delay(300);
    component.value = null;
    await delay(300);
    expect(component.value).toBeNull();
    expect(component.selected).toBeNull();
  });

  it('Должен корректно очищать поле от старых значений (multiselect = true)', async () => {
    component.value = [1, 3];
    await wrapper.setProps({
      items: list,
      multiselect: true,
    });
    await delay(300);
    component.value = [];
    await delay(300);
    expect(component.value).toStrictEqual([]);
    expect(component.selected).toStrictEqual([]);
  });

  it('Корректно заменяет выбранное значение при передаче нового (multiselect = false)', async () => {
    component.value = 3;
    await wrapper.setProps({
      items: list,
      multiselect: false,
    });
    await delay(300);
    component.value = 4;
    await delay(300);
    expect(component.selected).toStrictEqual({ id: 4, value: 'item-4' });
  });

  it('Корректно заменяет выбранное значение при передаче нового (multiselect = true)', async () => {
    component.value = [3];
    await wrapper.setProps({
      items: list,
      multiselect: true,
    });
    await delay(300);
    component.value = [4];
    await delay(300);
    expect(component.selected).toStrictEqual([{ id: 4, value: 'item-4' }]);
  });

  it('Возвращает объект, если передан параметр returnObject', async () => {
    await wrapper.setProps({
      items: list,
      returnObject: true,
    });
    await delay(300);
    testComponent.onSelect(list[1]);
    await delay(300);
    expect(component.value).toEqual(list[1]);
    expect(component.selected).toEqual(list[1]);
  });

  it('Возвращает массив объектов, если передан параметр returnObject и multiselect = true', async () => {
    await wrapper.setProps({
      items: list,
      returnObject: true,
      multiselect: true,
    });
    await delay(300);
    testComponent.onSelect(list[1]);
    await delay(300);
    expect(component.value).toEqual([list[1]]);
    expect(component.selected).toEqual([list[1]]);
  });

  it('При параметре lazyLoad загружает элементы только после получения фокуса', async () => {
    await wrapper.setProps({
      lazyLoad: true,
      fetchData: () => list,
    });
    await delay(300);
    expect(testComponent.optionsList).toStrictEqual([]);
    const input = wrapper.find('input');
    input.trigger('focus');
    await delay(300);
    expect(testComponent.optionsList).toStrictEqual(list);
  });

  it('Должен очищать список элементов и выбранные значения при обнулении списка items', async () => {
    await wrapper.setProps({
      items: list,
      multiselect: false,
    });
    await delay(300);
    testComponent.onSelect(list[1]);
    await wrapper.setProps({
      items: null,
    });
    await delay(300);
    expect(component.value).toBeNull();
    expect(component.selected).toEqual(null);
  });
});
