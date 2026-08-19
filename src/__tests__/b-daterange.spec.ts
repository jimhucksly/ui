import { delay } from '@dn-web/core';
import { mount, VueWrapper } from '@vue/test-utils';
import { App, ComponentPublicInstance, defineComponent } from 'vue';
import { Vue } from 'vue-property-decorator';
import ui from '@/index';
import vuetify from '@/vuetify.setup';

interface IComponent {
  modelValue: Array<string | Date>;
  date: Array<string | Date>;
  uid: string;
  menu: boolean;
  currentMonth: number;
  currentYear: number;
  $refs: Record<string, IComponent>;
  $el: HTMLElement;
}

let wrapper: VueWrapper<Vue, ComponentPublicInstance>;
let component: IComponent;
let testComponent: IComponent;

document.body.innerHTML = `
  <div>
    <div id="app"></div>
  </div>
`;

const rootComponent = defineComponent({
  template: `
    <div>
      <b-daterange v-model="date" v-bind="$props" ref="cmp" />
    </div>
  `,
  data(): {
    date: Array<string | Date>;
  } {
    return {
      date: null,
    };
  },
});

async function setupTest(props?: Record<string, unknown>) {
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
              vue.use(ui);
            },
          },
        ],
      },
    };
    if (props) {
      options = { ...options, ...props };
    }
    wrapper = mount(rootComponent, {
      ...options,
      attachTo: document.getElementById('app'),
    });
    component = wrapper.vm as unknown as IComponent;
    testComponent = component.$refs.cmp;
    await delay(300);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

describe('DaterangeComponent', () => {
  beforeEach(async () => {
    await setupTest();
  });

  afterEach(() => {
    wrapper = null;
    component = null;
  });

  it('Если на вход приходит массив строк, должен правильно преобразовывать их в даты', async () => {
    component.date = ['03.05.2026', '15.05.2026'];
    await delay(300);
    const [a, b] = component.date as Array<Date>;
    expect(a instanceof Date).toBeTruthy();
    expect(b instanceof Date).toBeTruthy();
    expect(a.toISOString()).toEqual('2026-05-03T00:00:00.000Z');
    expect(b.toISOString()).toEqual('2026-05-15T00:00:00.000Z');
  });

  describe('Из первого календаря:', () => {
    beforeEach(async () => {
      await setupTest();
    });

    afterEach(() => {
      wrapper = null;
      component = null;
    });

    it('Корректно переключает на предыдующий месяц ', async () => {
      component.date = ['25.12.2025', '15.01.2026'];
      await delay(300);
      testComponent.menu = true;
      await delay(300);
      const firstCalendar = testComponent.$refs.startDatepickerRef;
      const secondCalendar = testComponent.$refs.endDatepickerRef;
      expect(firstCalendar).toBeTruthy();
      expect(secondCalendar).toBeTruthy();
      const firstCalendarPrevBtn: HTMLButtonElement = firstCalendar.$el.querySelector(
        'button[data-testid="prevMonth"]'
      );
      expect(firstCalendarPrevBtn).toBeTruthy();
      firstCalendarPrevBtn.click();
      await delay(300);
      expect(firstCalendar.currentMonth).toEqual(10);
      expect(firstCalendar.currentYear).toEqual(2025);
      expect(secondCalendar.currentMonth).toEqual(11);
      expect(secondCalendar.currentYear).toEqual(2025);
    });

    it('Корректно переключает на следующий месяц ', async () => {
      component.date = ['25.12.2025', '15.01.2026'];
      await delay(300);
      testComponent.menu = true;
      await delay(300);
      const firstCalendar = testComponent.$refs.startDatepickerRef;
      const secondCalendar = testComponent.$refs.endDatepickerRef;
      const firstCalendarNextBtn: HTMLButtonElement = firstCalendar.$el.querySelector(
        'button[data-testid="nextMonth"]'
      );
      expect(firstCalendarNextBtn).toBeTruthy();
      firstCalendarNextBtn.click();
      await delay(300);
      expect(firstCalendar.currentMonth).toEqual(0);
      expect(firstCalendar.currentYear).toEqual(2026);
      expect(secondCalendar.currentMonth).toEqual(1);
      expect(secondCalendar.currentYear).toEqual(2026);
    });
  });

  describe('Из второго календаря:', () => {
    beforeEach(async () => {
      await setupTest();
    });

    afterEach(() => {
      wrapper = null;
      component = null;
    });

    it('Корректно переключает на предыдующий месяц ', async () => {
      component.date = ['25.12.2025', '15.01.2026'];
      await delay(300);
      testComponent.menu = true;
      await delay(300);
      const firstCalendar = testComponent.$refs.startDatepickerRef;
      const secondCalendar = testComponent.$refs.endDatepickerRef;
      expect(firstCalendar).toBeTruthy();
      expect(secondCalendar).toBeTruthy();
      const secondCalendarPrevBtn: HTMLButtonElement = firstCalendar.$el.querySelector(
        'button[data-testid="prevMonth"]'
      );
      expect(secondCalendarPrevBtn).toBeTruthy();
      secondCalendarPrevBtn.click();
      await delay(300);
      expect(firstCalendar.currentMonth).toEqual(10);
      expect(firstCalendar.currentYear).toEqual(2025);
      expect(secondCalendar.currentMonth).toEqual(11);
      expect(secondCalendar.currentYear).toEqual(2025);
    });

    it('Корректно переключает на следующий месяц ', async () => {
      component.date = ['25.12.2025', '15.01.2026'];
      await delay(300);
      testComponent.menu = true;
      await delay(300);
      const firstCalendar = testComponent.$refs.startDatepickerRef;
      const secondCalendar = testComponent.$refs.endDatepickerRef;
      const secondCalendarNextBtn: HTMLButtonElement = firstCalendar.$el.querySelector(
        'button[data-testid="nextMonth"]'
      );
      expect(secondCalendarNextBtn).toBeTruthy();
      secondCalendarNextBtn.click();
      await delay(300);
      expect(firstCalendar.currentMonth).toEqual(0);
      expect(firstCalendar.currentYear).toEqual(2026);
      expect(secondCalendar.currentMonth).toEqual(1);
      expect(secondCalendar.currentYear).toEqual(2026);
    });
  });
});
