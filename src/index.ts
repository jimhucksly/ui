import { generatePalette, PaletteScheme } from '@dn-web/core';
import { App, reactive } from 'vue';
import { reg as bbadgeReg } from '@/b-badge';
import { reg as bbreadcrumbsReg } from '@/b-breadcrumbs';
import { reg as bbuttonReg } from '@/b-button';
import { reg as bcalendarReg } from '@/b-calendar';
import { reg as bcheckboxReg } from '@/b-checkbox';
import { reg as bchipReg } from '@/b-chip';
import { reg as bcomboboxReg } from '@/b-combobox';
import { reg as bdatepickerReg } from '@/b-datepicker';
import { reg as bdaterangeReg } from '@/b-daterange';
import { reg as bdialogReg } from '@/b-dialog';
import { reg as bedittextReg } from '@/b-edit-text';
import { reg as bexpansionpanelReg } from '@/b-expansion-panel';
import { reg as bexpansionpanelsReg } from '@/b-expansion-panels';
import { reg as biconReg } from '@/b-icon';
import { reg as bloaderReg } from '@/b-loader';
import { reg as bpagerReg } from '@/b-pager';
import { reg as bprogressReg } from '@/b-progress';
import { reg as bradiobuttonReg } from '@/b-radiobutton';
import { reg as bradiogroupReg } from '@/b-radiogroup';
import { reg as bselectReg } from '@/b-select';
import { reg as bselectlistboxReg } from '@/b-select-list-box';
import { reg as bsliderReg } from '@/b-slider';
import { reg as bsplitterReg } from '@/b-splitter';
import { reg as bstepReg } from '@/b-step';
import { reg as bswitchReg } from '@/b-switch';
import { reg as btabReg } from '@/b-tab';
import { reg as btabsReg } from '@/b-tabs';
import { reg as btextmarkupReg } from '@/b-text-markup';
import { reg as btextareaReg } from '@/b-textarea';
import { reg as btimepickerReg } from '@/b-timepicker';
import { reg as btogglebuttonsReg } from '@/b-toggle-buttons';
import { reg as buploaderReg } from '@/b-uploader';
import Toast, { PluginOptions, POSITION } from '@/lib/vue-toastification';
import { IOptions } from '@/types/options';
import { defaults } from '@/vuetify';

const dnwebui = {
  install(vue: App, options?: IOptions) {
    if (!options) {
      options = {};
    }

    options.language = options.language ?? 'ru';
    options.prefix = options.prefix ?? 'b';

    if (!options.aliases) {
      options.aliases = {};
    }

    $COMPONENTS.forEach((alias: keyof IOptions['aliases']) => {
      if (options.aliases?.[alias]) {
        return;
      }
      options.aliases[alias] = alias.replace(/^b/, options.prefix);
    });

    vue.config.globalProperties.$ui = {
      options: reactive(options),
    };

    /* eslint-disable-next-line @typescript-eslint/no-require-imports */
    const library = require('./i18n/ru/ru-Ru.json')['ru'];

    vue.config.globalProperties.$i18n = {
      library,
      gettext: (value: string): string => library[value] ?? value,
    };

    const toastedOptions: PluginOptions = {
      position: POSITION.BOTTOM_RIGHT,
      timeout: 5000,
      draggable: false,
      newestOnTop: true,
      pauseOnFocusLoss: false,
      pauseOnHover: false,
      hideProgressBar: true,
    };

    vue.use(Toast, toastedOptions);

    const palette = document.createElement('style');
    const scheme: PaletteScheme = [
      {
        name: 'primary',
        lighten: {
          steps: { l: [55, 64, 73, 82, 91, 95] },
          prefix: 'l',
        },
        darken: {
          steps: { h: [209, 215, 222, 228, 234], l: [46, 46, 38, 29, 20] },
          prefix: 'd',
        },
        pivot: {
          h: 202,
          s: 66,
          l: 46,
          a: 100,
        },
      },
      {
        name: 'secondary',
        lighten: {
          steps: { l: [40, 56, 69, 80, 92] },
          prefix: 'l',
        },
        darken: {
          steps: { h: [294, 289, 283, 278], s: [41, 41, 42, 42], l: [36, 36, 35, 35] },
          prefix: 'd',
        },
        pivot: {
          h: 300,
          s: 41,
          l: 36,
          a: 100,
        },
      },
      {
        name: 'success',
        lighten: {
          steps: { h: [128, 101, 88, 79, 75], l: [40, 45, 50, 50, 78] },
          prefix: 'l',
        },
        darken: {
          steps: { l: [28, 24, 20, 16, 12] },
          prefix: 'd',
        },
        pivot: {
          h: 140,
          s: 100,
          l: 35,
          a: 100,
        },
      },
      {
        name: 'warning',
        lighten: {
          steps: { l: [80, 85, 90, 95], s: [99, 98, 97, 95] },
          prefix: 'l',
        },
        darken: {
          steps: { h: [49, 49, 50, 50, 50], l: [71, 62, 53, 44, 33] },
          prefix: 'd',
        },
        pivot: {
          h: 48,
          s: 100,
          l: 75,
          a: 100,
        },
      },
      {
        name: 'error',
        lighten: {
          steps: { h: [353, 1, 8, 15, 21], l: [59, 67, 78, 88, 95] },
          prefix: 'l',
        },
        darken: {
          steps: { l: [50, 42, 34, 29, 20] },
          prefix: 'd',
        },
        pivot: {
          h: 346,
          s: 100,
          l: 57,
          a: 100,
        },
      },
      {
        name: 'grey',
        lighten: {
          steps: { l: [71, 77, 83, 89, 93, 96] },
          prefix: 'l',
        },
        darken: {
          steps: { l: [56, 47, 38, 29, 20, 10] },
          prefix: 'd',
        },
        pivot: { h: 220, s: 5, l: 65, a: 100 },
      },
    ];
    palette.innerHTML = generatePalette(scheme);
    palette.id = 'dnwebui-palette';
    document.body.appendChild(palette);

    bbadgeReg(vue, options);
    bbreadcrumbsReg(vue, options);
    bbuttonReg(vue, options);
    bcalendarReg(vue, options);
    bcheckboxReg(vue, options);
    bchipReg(vue, options);
    bcomboboxReg(vue, options);
    bdatepickerReg(vue, options);
    bdaterangeReg(vue, options);
    bdialogReg(vue, options);
    bedittextReg(vue, options);
    bexpansionpanelReg(vue, options);
    bexpansionpanelsReg(vue, options);
    biconReg(vue, options);
    bloaderReg(vue, options);
    bpagerReg(vue, options);
    bprogressReg(vue, options);
    bradiobuttonReg(vue, options);
    bradiogroupReg(vue, options);
    bselectReg(vue, options);
    bselectlistboxReg(vue, options);
    bsliderReg(vue, options);
    bsplitterReg(vue, options);
    bstepReg(vue, options);
    bswitchReg(vue, options);
    btabReg(vue, options);
    btabsReg(vue, options);
    btextmarkupReg(vue, options);
    btextareaReg(vue, options);
    btimepickerReg(vue, options);
    btogglebuttonsReg(vue, options);
    buploaderReg(vue, options);
  },
};

export default dnwebui;

const localesMap = new Map();
/* eslint-disable-next-line @typescript-eslint/no-require-imports */
localesMap.set('en', () => require('./i18n/en/en-En.json'));
/* eslint-disable-next-line @typescript-eslint/no-require-imports */
localesMap.set('ru', () => require('./i18n/ru/ru-Ru.json'));

const i18n = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  install(vue: any, value?: string) {
    let language = vue.config?.globalProperties?.$ui?.options?.language || 'en';
    let library: Record<string, string> = {};
    try {
      if (!value) {
        throw new Error('locale not defined');
      }
      const json = JSON.parse(value);
      library = json[language];
      if (!library) {
        throw new Error('locale not defined');
      }
    } catch (e) {
      language = localesMap.has(language) ? language : 'en';
      const func = localesMap.get(language);
      library = func()[language];
    }

    function gettext(v: string): string {
      return this.library[v] || v;
    }

    vue.config.globalProperties.$i18n = {
      library,
      gettext: null,
    };

    vue.config.globalProperties.$i18n.gettext = gettext.bind(vue.config.globalProperties.$i18n);
  },
};

export { i18n };

export { ValidateMixin, ValidateMixinOptions } from '@/mixins/validate.mixin';

export { ModalButton, ModalType, DialogManager } from '@/b-dialog/dialog.manager';

export {
  AlertDialog,
  PromptDialog,
  ConfirmDialog,
  InfoDialog,
  SelectDialog,
  CreateEditDialog,
} from '@/b-dialog/dialogs';

export { defaults };

export {
  requiredRule,
  maxLengthRule,
  alphaRule,
  alphaNumRule,
  betweenRule,
  decimalRule,
  emailRule,
  integerRule,
  ipAddressRule,
  macAddressRule,
  maxValueRule,
  minValueRule,
  numericRule,
  urlRule,
  phoneRule,
  validators,
} from '@/mixins/validators';
