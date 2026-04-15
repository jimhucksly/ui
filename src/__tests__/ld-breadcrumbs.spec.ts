import { mount, VueWrapper } from '@vue/test-utils';
import { DefinedComponent } from '@vue/test-utils/dist/types';
import { App, ComponentPublicInstance, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ldmui, { delay } from '@/index';
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
    text: 'LDM UI DEMO',
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

function setupTest(props?: Record<string, unknown>, cmp?: DefinedComponent) {
  try {
    let options = {
      global: {
        plugins: [
          vuetify,
          {
            install(vue: App) {
              vue.use(ldmui);
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
    setupTest(null, rootComponent1);
    const spy = jest.spyOn($router, 'push');
    const ul = wrapper.find('ul');
    const li = ul.find('li[text="LDM UI DEMO"]');
    const div = li.find('div');
    div.trigger('click');
    await delay(300);
    expect(spy).toHaveBeenCalled();
  });

  it('Если передан обработчик @open, передает управление ему', async () => {
    setupTest(null, rootComponent2);
    const ul = wrapper.find('ul');
    const li = ul.find('li[text="LDM UI DEMO"]');
    const div = li.find('div');
    div.trigger('click');
    await delay(300);
    expect(component.onOpenHaveBeenCalled).toBeTruthy();
  });
});
