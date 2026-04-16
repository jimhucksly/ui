import { App, reactive } from 'vue';
import { reg as ldavatarReg } from '@/ld-avatar';
import { reg as ldbadgeReg } from '@/ld-badge';
import { reg as ldbreadcrumbsReg } from '@/ld-breadcrumbs';
import { reg as ldbuttonReg } from '@/ld-button';
import { reg as ldcalendarReg } from '@/ld-calendar';
import { reg as ldcheckboxReg } from '@/ld-checkbox';
import { reg as ldchipReg } from '@/ld-chip';
import { reg as ldcomboboxReg } from '@/ld-combobox';
import { reg as lddatepickerReg } from '@/ld-datepicker';
import { reg as lddaterangeReg } from '@/ld-daterange';
import { reg as lddialogReg } from '@/ld-dialog';
import { reg as ldeditlistboxReg } from '@/ld-edit-list-box';
import { reg as ldeditmaskedtextReg } from '@/ld-edit-masked-text';
import { reg as ldedittextReg } from '@/ld-edit-text';
import { reg as ldexpansionpanelReg } from '@/ld-expansion-panel';
import { reg as ldexpansionpanelsReg } from '@/ld-expansion-panels';
import { reg as ldiconReg } from '@/ld-icon';
import { reg as ldloaderReg } from '@/ld-loader';
import { reg as ldpagetoolbarReg } from '@/ld-page-toolbar';
import { reg as ldpagerReg } from '@/ld-pager';
import { reg as ldprogressReg } from '@/ld-progress';
import { reg as ldradiobuttonReg } from '@/ld-radiobutton';
import { reg as ldradiogroupReg } from '@/ld-radiogroup';
import { reg as ldselectReg } from '@/ld-select';
import { reg as ldselectlistboxReg } from '@/ld-select-list-box';
import { reg as ldsliderReg } from '@/ld-slider';
import { reg as ldsplitterReg } from '@/ld-splitter';
import { reg as ldstepReg } from '@/ld-step';
import { reg as ldswitchReg } from '@/ld-switch';
import { reg as ldtabReg } from '@/ld-tab';
import { reg as ldtabsReg } from '@/ld-tabs';
import { reg as ldtextmarkupReg } from '@/ld-text-markup';
import { reg as ldtextareaReg } from '@/ld-textarea';
import { reg as ldtimepickerReg } from '@/ld-timepicker';
import { reg as ldtogglebuttonsReg } from '@/ld-toggle-buttons';
import { reg as lduploaderReg } from '@/ld-uploader';
import Toast, { PluginOptions, POSITION } from '@/lib/vue-toastification';
import { IOptions } from '@/types/options';
import { defaults } from '@/vuetify';

const uiPlugin = {
  install(vue: App, options?: IOptions) {
    if (!options) {
      options = {};
    }

    options.language = options.language ?? 'ru';
    options.prefix = options.prefix ?? 'ld';

    if (!options.aliases) {
      options.aliases = {};
    }

    $COMPONENTS.forEach((alias: keyof IOptions['aliases']) => {
      if (options.aliases?.[alias]) {
        return;
      }
      options.aliases[alias] = alias.replace(/^ld/, options.prefix);
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

    ldavatarReg(vue, options);
    ldbadgeReg(vue, options);
    ldbreadcrumbsReg(vue, options);
    ldbuttonReg(vue, options);
    ldcalendarReg(vue, options);
    ldcheckboxReg(vue, options);
    ldchipReg(vue, options);
    ldcomboboxReg(vue, options);
    lddatepickerReg(vue, options);
    lddaterangeReg(vue, options);
    lddialogReg(vue, options);
    ldeditlistboxReg(vue, options);
    ldeditmaskedtextReg(vue, options);
    ldedittextReg(vue, options);
    ldexpansionpanelReg(vue, options);
    ldexpansionpanelsReg(vue, options);
    ldiconReg(vue, options);
    ldloaderReg(vue, options);
    ldpagetoolbarReg(vue, options);
    ldpagerReg(vue, options);
    ldprogressReg(vue, options);
    ldradiobuttonReg(vue, options);
    ldradiogroupReg(vue, options);
    ldselectReg(vue, options);
    ldselectlistboxReg(vue, options);
    ldsliderReg(vue, options);
    ldsplitterReg(vue, options);
    ldstepReg(vue, options);
    ldswitchReg(vue, options);
    ldtabReg(vue, options);
    ldtabsReg(vue, options);
    ldtextmarkupReg(vue, options);
    ldtextareaReg(vue, options);
    ldtimepickerReg(vue, options);
    ldtogglebuttonsReg(vue, options);
    lduploaderReg(vue, options);
  },
};

export default uiPlugin;

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

    vue.config.globalProperties.$uii18n = {
      library,
      gettext: null,
    };

    vue.config.globalProperties.$uii18n.gettext = gettext.bind(vue.config.globalProperties.$uii18n);
  },
};

export { i18n };

export { ValidateMixin, ValidateMixinOptions } from '@/mixins/validate.mixin';

export { ModalButton, ModalType, DialogManager } from '@/ld-dialog/dialog.manager';

export {
  AlertDialog,
  PromptDialog,
  ConfirmDialog,
  InfoDialog,
  SelectDialog,
  CreateEditDialog,
} from '@/ld-dialog/dialogs';

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
