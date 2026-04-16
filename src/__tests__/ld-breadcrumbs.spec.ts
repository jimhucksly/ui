import { delay } from '@dn-web/core';
import { mount, VueWrapper } from '@vue/test-utils';
import { App, ComponentPublicInstance, DefineComponent, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ui from '@/index';
import vuetify from '@/vuetify.setup';

interface IComponent {
  $el: HTMLElement;
  onOpen: () => void;
  onOpenHaveBeenCalled: boolean;
}

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;
let component: IComponent;

const breadcrumbs = [
  {
    text: 'DN WEB UI DEMO',
    disabled: false,
    route: {
      path: '/',
    },
  },
  {
    text: 'Breadcrumbs',
    route: {
      path: '/',
    },
  },
];

const $router = {
  push: () => {
    //
  },
};

const rootComponent1 = defineComponent({
  template: `
    <div>
      <ld-breadcrumbs :breadcrumbs="breadcrumbs" />
    </div>
  `,
  computed: {
    breadcrumbs() {
      return breadcrumbs;
    },
  },
});

const rootComponent2 = defineComponent({
  template: `
    <div>
      <ld-breadcrumbs :breadcrumbs="breadcrumbs" @open="onOpen" />
    </div>
  `,
  data() {
    return {
      onOpenHaveBeenCalled: false,
    };
  },
  computed: {
    breadcrumbs() {
      return breadcrumbs;
    },
  },
  methods: {
    onOpen() {
      this.onOpenHaveBeenCalled = true;
    },
  },
});

function setupTest(props?: Record<string, unknown>, cmp?: DefineComponent) {
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
          {
            install(vue: App) {
              vue.config.globalProperties.$router = $router;
            },
          },
        ],
      },
    };
    if (props) {
      options = { ...options, ...props };
    }
    wrapper = mount(cmp, options);
    component = wrapper.vm as unknown as IComponent;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

describe('BreadcrumbsComponent', () => {
  afterEach(() => {
    wrapper = null;
    component = null;
  });

  it('Если определен $router, то выполнят метод $router.push', async () => {
    setupTest(null, rootComponent1 as unknown as DefineComponent);
    const spy = jest.spyOn($router, 'push');
    const ul = wrapper.find('ul');
    const li = ul.find('li[text="DN WEB UI DEMO"]');
    const div = li.find('div');
    div.trigger('click');
    await delay(300);
    expect(spy).toHaveBeenCalled();
  });

  it('Если передан обработчик @open, передает управление ему', async () => {
    setupTest(null, rootComponent2 as unknown as DefineComponent);
    const ul = wrapper.find('ul');
    const li = ul.find('li[text="DN WEB UI DEMO"]');
    const div = li.find('div');
    div.trigger('click');
    await delay(300);
    expect(component.onOpenHaveBeenCalled).toBeTruthy();
  });
});
