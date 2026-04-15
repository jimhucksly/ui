import { ComponentMountingOptions, mount, VueWrapper } from '@vue/test-utils';
import { ComponentPublicInstance, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ldmui, { delay } from '@/index';
import EditTextComponent from '@/ld-edit-text/ld-edit-text.vue';
import vuetify from '@/vuetify.setup';

interface IComponent {
  time: string;
  is24hr: boolean;
  $refs: Record<string, IComponent>;
  checkValue: (value: string) => boolean;
  _time: string;
}

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;
let component: IComponent;
let testComponent: IComponent;

const rootComponent = defineComponent({
  components: {
    'ld-edit-text': EditTextComponent,
  },
  template: `
    <div>
      <ld-timepicker v-bind="$props" v-model="time" :is24hr="is24hr" ref="cmp" />
    </div>
  `,
  data(): {
    time: string;
    is24hr: boolean;
  } {
    return {
      time: null,
      is24hr: true,
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

describe('TimepickerComponent', () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    wrapper = null;
    component = null;
    testComponent = null;
  });

  it('Корректно проверяет переданное значение в 24ч формате', () => {
    expect(testComponent.is24hr).toBeTruthy();
    expect(testComponent.checkValue('0')).toBeFalsy();
    expect(testComponent.checkValue('1111')).toBeFalsy();
    expect(testComponent.checkValue('24:24')).toBeFalsy();
    expect(testComponent.checkValue('23:60')).toBeFalsy();
    expect(testComponent.checkValue('00:00')).toBeTruthy();
    expect(testComponent.checkValue('23:59')).toBeTruthy();
  });

  it('Корректно проверяет переданное значение в 12ч формате', async () => {
    component.is24hr = false;
    await delay(300);
    expect(testComponent.is24hr).toBeFalsy();
    expect(testComponent.checkValue('0')).toBeFalsy();
    expect(testComponent.checkValue('1111')).toBeFalsy();
    expect(testComponent.checkValue('24:24')).toBeFalsy();
    expect(testComponent.checkValue('23:60')).toBeFalsy();
    expect(testComponent.checkValue('00:00')).toBeFalsy();
    expect(testComponent.checkValue('23:59')).toBeFalsy();
    expect(testComponent.checkValue('11:30')).toBeTruthy();
  });

  it('Корректно переводит значения из 12ч формата в 24ч', async () => {
    component.is24hr = false;
    component.time = '12:00 am';
    await delay(300);
    component.is24hr = true;
    await delay(300);
    expect(testComponent._time).toEqual('00:00');

    component.is24hr = false;
    component.time = '12:00 pm';
    await delay(300);
    component.is24hr = true;
    await delay(300);
    expect(testComponent._time).toEqual('12:00');

    component.is24hr = false;
    component.time = '01:30 am';
    await delay(300);
    component.is24hr = true;
    await delay(300);
    expect(testComponent._time).toEqual('01:30');

    component.is24hr = false;
    component.time = '01:30 pm';
    await delay(300);
    component.is24hr = true;
    await delay(300);
    expect(testComponent._time).toEqual('13:30');
  });

  it('Корректно переводит значения из 24ч формата в 12ч', async () => {
    component.time = '23:30';
    await delay(300);
    component.is24hr = false;
    await delay(300);
    expect(testComponent._time).toEqual('11:30 pm');

    component.is24hr = true;
    await delay(300);
    component.time = '11:30';
    component.is24hr = false;
    await delay(300);
    expect(testComponent._time).toEqual('11:30 am');

    component.is24hr = true;
    component.time = '00:00';
    await delay(300);
    component.is24hr = false;
    await delay(300);
    expect(testComponent._time).toEqual('12:00 am');

    component.is24hr = true;
    component.time = '12:00';
    await delay(300);
    component.is24hr = false;
    await delay(300);
    expect(testComponent._time).toEqual('12:00 pm');
  });
});
