import { delay } from '@dn-web/core';
import { mount, VueWrapper } from '@vue/test-utils';
import { App, ComponentPublicInstance, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ui from '@/index';
import vuetify from '@/vuetify.setup';

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;

const rootComponent = defineComponent({
  template: `
    <div>
      <ld-button responsive></ld-button>
    </div>
  `,
});

function setupTest(
  props?: Record<string, unknown>,
  isMobile: boolean = false,
  isTablet: boolean = false,
  isDesktop: boolean = true
) {
  try {
    let options = {
      global: {
        plugins: [
          vuetify,
          {
            install(vue: App) {
              vue.use(ui, {
                viewport: {
                  isMobile: 'isMobile',
                  isTablet: 'isTablet',
                  isDesktop: 'isDesktop',
                },
              });
              vue.mixin({
                computed: {
                  isMobile() {
                    return isMobile;
                  },
                  isTablet() {
                    return isTablet;
                  },
                  isDesktop() {
                    return isDesktop;
                  },
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
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

describe('ButtonComponent', () => {
  afterEach(() => {
    wrapper = null;
  });

  it('Корректно работает с глобальный переменными viewport: isDesktop', () => {
    setupTest();
    const btn = wrapper.find('.v-btn.ld-button--desktop-view');
    expect(btn.exists()).toBeTruthy();
  });

  it('Корректно работает с глобальный переменными viewport: isTablet', async () => {
    setupTest(null, false, true, false);
    await delay(300);
    const btn = wrapper.find('.v-btn.ld-button--tablet-view');
    expect(btn.exists()).toBeTruthy();
  });

  it('Корректно работает с глобальный переменными viewport: isMobile', () => {
    setupTest(null, true, false, false);
    const btn = wrapper.find('.v-btn.ld-button--mobile-view');
    expect(btn.exists()).toBeTruthy();
  });
});
