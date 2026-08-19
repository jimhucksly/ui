import { ComponentMountingOptions, mount, VueWrapper } from '@vue/test-utils';
import { ComponentPublicInstance, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ui from '@/index';
import { delay } from '@dn-web/core';
import vuetify from '@/vuetify.setup';

interface IComponent {
  model: number | Array<number>;
  $el: HTMLElement;
}

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;
let component: IComponent;

const rootComponent = defineComponent({
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  template: `
    <div>
      <b-expansion-panels :multiple="multiple" v-model="model">
        <b-expansion-panel title="Panel 1">
          <div>Content of panel 1</div>
        </b-expansion-panel>
        <b-expansion-panel title="Panel 2">
          <div>Content of panel 2</div>
        </b-expansion-panel>
        <b-expansion-panel title="Panel 3">
          <div>Content of panel 3</div>
        </b-expansion-panel>
      </b-expansion-panels>
    </div>
  `,
  data(): {
    model: number | Array<number>;
  } {
    return {
      model: null,
    };
  },
});

function setupTest(props?: Record<string, unknown>) {
  try {
    let options: ComponentMountingOptions<void> = {
      global: {
        plugins: [vuetify, ui],
      },
    };
    if (props) {
      options = { ...options, ...props };
    }
    wrapper = mount(rootComponent, options);
    component = wrapper.vm as unknown as IComponent;
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
  });

  it('При multiple=false раскрывается только одна панель', async () => {
    const panels = wrapper.find('.v-expansion-panels');
    expect(panels.exists()).toBeTruthy();
    const panel = panels.find('.v-expansion-panel:first-child');
    expect(panel.exists()).toBeTruthy();
    const btn = panel.find('.v-expansion-panel-title');
    btn.trigger('click');
    await delay(300);
    expect(component.model).toEqual(0);
    const panel2 = panels.find('.v-expansion-panel:nth-child(2)');
    expect(panel2.exists()).toBeTruthy();
    const btn2 = panel2.find('.v-expansion-panel-title');
    btn2.trigger('click');
    await delay(300);
    expect(component.model).toEqual(1);
  });

  it('При multiple=true раскрывается несколько панелей', async () => {
    wrapper.setProps({
      multiple: true,
    });
    await delay(300);
    const panels = wrapper.find('.v-expansion-panels');
    expect(panels.exists()).toBeTruthy();
    const panel = panels.find('.v-expansion-panel:first-child');
    expect(panel.exists()).toBeTruthy();
    const btn = panel.find('.v-expansion-panel-title');
    btn.trigger('click');
    await delay(300);
    expect(component.model).toEqual([0]);
    const panel2 = panels.find('.v-expansion-panel:nth-child(2)');
    expect(panel2.exists()).toBeTruthy();
    const btn2 = panel2.find('.v-expansion-panel-title');
    btn2.trigger('click');
    await delay(300);
    expect(component.model).toEqual([0, 1]);
  });

  it('При изменении модели раскрываются сооветствующие панели', async () => {
    wrapper.setProps({
      multiple: true,
    });
    component.model = [1, 2];
    await delay(300);
    const panels = wrapper.find('.v-expansion-panels');
    expect(panels.exists()).toBeTruthy();
    const panel = panels.find('.v-expansion-panel:nth-child(2)');
    expect(panel.element.classList.contains('v-expansion-panel--active'));
    const panel2 = panels.find('.v-expansion-panel:nth-child(3)');
    expect(panel2.element.classList.contains('v-expansion-panel--active'));
  });
});
