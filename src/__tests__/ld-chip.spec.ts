import { delay } from '@dn-web/core';
import { mount, VueWrapper } from '@vue/test-utils';
import { App, ComponentPublicInstance, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ui from '@/index';
import vuetify from '@/vuetify.setup';

interface IComponent {
  $el: HTMLElement;
  onClose: () => void;
}

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;
let component: IComponent;

const rootComponent = defineComponent({
  template: `
    <div>
      <ld-chip v-if="model.includes(1)" @click:close="onClose">Ld Chip</ld-chip>
    </div>
  `,
  data() {
    return {
      model: [1],
    };
  },
  methods: {
    onClose() {
      this.model = [];
    },
  },
});

function setupTest(props?: Record<string, unknown>) {
  try {
    let options = {
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
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

describe('ChipComponent', () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    wrapper = null;
  });

  it('Корректно работает событие @click:close', async () => {
    let chip = component.$el.querySelector('ld-chip');
    expect(chip).toBeDefined();
    const btn: HTMLInputElement = component.$el.querySelector('[aria-label="close"]');
    expect(btn).toBeDefined();
    btn.click();
    await delay(300);
    chip = component.$el.querySelector('ld-chip');
    expect(chip).toBeNull();
  });
});
