import { mount, VueWrapper } from '@vue/test-utils';
import { App, ComponentPublicInstance, defineComponent } from 'vue';
import { Vue } from 'vue-class-component';
import ldmui, { delay } from '@/index';
import vuetify from '@/vuetify.setup';
import { IPage, IPagerOptions } from '../types/pager';

interface IComponent {
  pages: Array<IPage>;
  options: IPagerOptions;
  $refs: Record<string, IComponent>;
  calcPages: (page?: number) => Promise<Array<IPage>>;
}

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;
let component: IComponent;
let testComponent: IComponent;

const rootComponent = defineComponent({
  template: `
    <div>
      <ld-pager :options="options" ref="cmp" />
    </div>
  `,
  props: {
    config: {
      type: Object,
      default: () => ({
        page: 1,
        pageSize: 10,
        total: 500,
      }),
    },
  },
  computed: {
    options() {
      return {
        ...this.config,
      };
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
              vue.use(ldmui, {
                LdPager: {
                  entityName: (_, count) => `${count} документов`,
                },
              });
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

describe('PagerComponent', () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    wrapper = null;
    component = null;
  });

  it('Корректно пересчитывает страницы', async () => {
    let pages: Array<IPage> = [];
    for (let i = 0; i < testComponent.pages.length; i++) {
      const page = {
        number: testComponent.pages[i].number,
        text: testComponent.pages[i].text,
      };
      expect(page.number).toEqual(i + 1);
      expect(page.text).toEqual(`${i + 1}`);
    }
    await delay(300);
    wrapper.setProps({
      config: {
        ...testComponent.options,
        page: 5,
      },
    });
    await delay(300);
    pages = await testComponent.calcPages(5);
    for (let i = 0; i < testComponent.pages.length; i++) {
      const page = { number: pages[i].number, text: pages[i].text };
      expect(page.number).toEqual(i + 3);
      expect(page.text).toEqual(`${i + 3}`);
    }
    wrapper.setProps({
      options: {
        ...testComponent.options,
        page: 50,
      },
    });
    await delay(300);
    pages = await testComponent.calcPages(50);
    for (let i = 0; i < testComponent.pages.length; i++) {
      const page = { number: pages[i].number, text: pages[i].text };
      expect(page.number).toEqual(i + 46);
      expect(page.text).toEqual(`${i + 46}`);
    }
  });
});
