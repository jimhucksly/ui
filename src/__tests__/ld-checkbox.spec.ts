import { delay } from '@dn-web/core';
import { mount, VueWrapper } from '@vue/test-utils';
import { App, ComponentPublicInstance, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ui from '@/index';
import vuetify from '@/vuetify.setup';

interface IComponent {
  modelValue: unknown;
  internalValue: boolean;
  value: boolean | Array<number>;
  $refs: Record<string, IComponent>;
}

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;
let component: IComponent;
let testComponent: IComponent;

const rootComponent = defineComponent({
  template: `
    <div>
      <ld-checkbox v-model="value" v-bind="$props" ref="cmp"></ld-checkbox>
    </div>
  `,
  props: ['checkedValue', 'uncheckedValue', 'initialValue'],
  data(): {
    value: boolean;
  } {
    return {
      value: null,
    };
  },
});

function setupTest(props?: Record<string, unknown>) {
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

describe('CheckboxComponent', () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    wrapper = null;
    component = null;
    testComponent = null;
  });

  it('Корректно создается с дефолтным значением false', async () => {
    component.value = false;
    await delay(1000);
    expect(testComponent.modelValue).toEqual(false);
  });

  it('Корректно создается с дефолтным значением true', async () => {
    component.value = true;
    await delay(1000);
    expect(testComponent.modelValue).toEqual(true);
  });

  it('Корректно обрабатывает изменение значения чекбокса', async () => {
    component.value = true;
    await delay(1000);
    component.value = false;
    await delay(1000);
    expect(testComponent.modelValue).toEqual(false);
  });

  it('Корректно передает значение checkedValue/uncheckedValue', async () => {
    const checkedValue = 'checked';
    const uncheckedValue = 'unchecked';
    await wrapper.setProps({
      checkedValue,
      uncheckedValue,
    });
    expect(testComponent.modelValue).toBeNull();
    expect(testComponent.internalValue).toEqual(false);
    const input = wrapper.find('input[type="checkbox"]');
    input.trigger('click');
    await delay(600);
    input.trigger('input');
    await delay(600);
    expect(testComponent.modelValue).toEqual(checkedValue);
    expect(testComponent.internalValue).toEqual(true);
    expect(component.value).toEqual(checkedValue);
    input.trigger('click');
    await delay(600);
    input.trigger('input');
    await delay(600);
    expect(testComponent.modelValue).toEqual(uncheckedValue);
  });

  it('Корректно работает, если modelValue - массив', async () => {
    component.value = [];
    await wrapper.setProps({
      initialValue: 1,
    });
    expect(testComponent.internalValue).toEqual(false);
    const input = wrapper.find('input[type="checkbox"]');
    input.trigger('click');
    await delay(600);
    input.trigger('input');
    await delay(600);
    expect(testComponent.modelValue).toEqual([1]);
    input.trigger('click');
    await delay(600);
    input.trigger('input');
    await delay(600);
    expect(testComponent.modelValue).toEqual([]);
    component.value = [1];
    await delay(600);
    expect(testComponent.internalValue).toEqual(true);
  });
});
