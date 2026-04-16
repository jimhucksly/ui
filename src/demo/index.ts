/* eslint-disable @typescript-eslint/typedef */
import { mixins, Options, Prop, Provide } from 'vue-property-decorator';
import { ValidateMixin } from '@/mixins/validate.mixin';
import { IBreadcrumbsItem } from '@/types/breadcrumbs';
import Test from './__test.vue';
import Avatar from './avatar.vue';
import Badge from './badge.vue';
import Breadcrumbs from './breadcrumbs.vue';
import Buttons from './buttons.vue';
import Calendar from './calendar.vue';
import Checkbox from './checkbox.vue';
import Chip from './chip.vue';
import Colors from './colors.vue';
import ComboBox from './combobox.vue';
import DatePicker from './datepicker.vue';
import DateRange from './daterange.vue';
import Dialogs from './dialogs.vue';
import EditListBox from './editlistbox.vue';
import Editor from './editor.vue';
import Edittext from './edittext.vue';
import EventBus from './eventBus.vue';
import Expansions from './expansion.vue';
import Fonts from './fonts.vue';
import Home from './home.vue';
import Locale from './i18n.vue';
import Icons from './icons.vue';
import Installation from './installation.vue';
import Iterator from './iterator.vue';
import Loader from './loader.vue';
import Pager from './pager.vue';
import PageToolbar from './pagetoolbar.vue';
import Progress from './progress.vue';
import Radiobutton from './radiobutton.vue';
import Scroll from './scroll.vue';
import SelectBox from './select.vue';
import SelectListBox from './selectlistbox.vue';
import Slider from './slider.vue';
import Splitter from './splitter.vue';
import Stepper from './step.vue';
import Switch from './switch.vue';
import Tabs from './tabs.vue';
import Textarea from './textarea.vue';
import TextMarkup from './textmarkup.vue';
import TextViewer from './textviewer.vue';
import TimePicker from './timepicker.vue';
import Toast from './toast.vue';
import Toggle from './toggle.vue';
import Tooltip from './tooltip.vue';
import Upgrade from './upgrade.vue';
import Uploader from './uploader.vue';
import Utils from './utils.vue';
import Validation from './validation.vue';

interface ITab {
  name: string;
  id?: number;
  tag?: string;
  disabled?: boolean;
  component?: string;
}

@Options({
  components: {
    Home,
    Installation,
    Icons,
    Colors,
    Fonts,
    Scroll,
    Avatar,
    Breadcrumbs,
    Buttons,
    Chip,
    Badge,
    Checkbox,
    Switch,
    Radiobutton,
    'edit-text': Edittext,
    'select-demo': SelectBox,
    combobox: ComboBox,
    selectlistbox: SelectListBox,
    editlistbox: EditListBox,
    'text-area': Textarea,
    'text-markup': TextMarkup,
    datepicker: DatePicker,
    daterange: DateRange,
    timepicker: TimePicker,
    Calendar,
    Slider,
    Uploader,
    textviewer: TextViewer,
    Splitter,
    Tabs,
    Toggle,
    PageToolbar,
    'loader-demo': Loader,
    Progress,
    Editor,
    Toast,
    Stepper,
    EventBus,
    dialogs: Dialogs,
    Iterator,
    Pager,
    Utils,
    'form-validation': Validation,
    locale: Locale,
    Test,
    Tooltip,
    Upgrade,
    Expansions,
  },
})
export default class Index extends mixins(ValidateMixin) {
  @Prop() version: string;
  @Prop() versions: Array<{ version: string; url: string }>;
  @Prop() icons: Array<string>;

  tag: string = null;
  tabs: Array<ITab> = [
    { name: 'Home' },
    { name: 'Introduction', disabled: true },
    { name: 'Installation' },
    { name: 'Upgrade Guide', component: 'Upgrade' },
    { name: 'Colors/Shadows', component: 'Colors' },
    { name: 'Fonts' },
    { name: 'Scroll' },
    { name: 'Tooltip' },
    { name: 'Buttons & Icons', disabled: true },
    { name: 'Icons' },
    { name: 'Buttons' },
    { name: 'Toggle Buttons', component: 'Toggle' },
    { name: 'Inputs', disabled: true },
    { name: 'Checkbox' },
    { name: 'Switch' },
    { name: 'Radiobutton' },
    { name: 'Edit Text' },
    { name: 'Select', component: 'select-demo' },
    { name: 'Combobox' },
    { name: 'Select List Box', component: 'selectlistbox' },
    { name: 'Edit List Box', component: 'editlistbox' },
    { name: 'Textarea', component: 'text-area' },
    { name: 'Text Markup', component: 'text-markup' },
    { name: 'Editor' },
    { name: 'DatePicker', component: 'datepicker' },
    { name: 'TimePicker', component: 'timepicker' },
    { name: 'DateRange', component: 'daterange' },
    { name: 'Calendar' },
    { name: 'Slider' },
    { name: 'Uploader' },
    { name: 'Presentation', disabled: true },
    { name: 'Avatar' },
    { name: 'Chip' },
    { name: 'Badge' },
    { name: 'Stepper' },
    { name: 'TextViewer' },
    { name: 'Navigation', disabled: true },
    { name: 'Breadcrumbs' },
    { name: 'Pager' },
    { name: 'Organization', disabled: true },
    { name: 'Tabs' },
    { name: 'Expansions' },
    { name: 'Splitter' },
    { name: 'Page Toolbar' },
    { name: 'Iterator' },
    { name: 'Interactive', disabled: true },
    { name: 'Dialog', component: 'dialogs' },
    { name: 'Toast' },
    { name: 'Awaiting', disabled: true },
    { name: 'Loader', component: 'loader-demo' },
    { name: 'Progress' },
    { name: 'Subscription', disabled: true },
    { name: 'Event Bus' },
    { name: 'Utilities', disabled: true },
    { name: 'Utils' },
    { name: 'Validation', disabled: true },
    { name: 'Form validation' },
    { name: 'Localization', disabled: true },
    { name: 'i18n', component: 'locale' },
  ];

  prevTab: ITab = null;

  @Provide() tabProps = {
    vertical: false,
    mobile: false,
    noPadding: true,
  };

  @Provide({ reactive: true }) iconsList: Array<string> = null;

  mounted() {
    // eslint-disable-next-line no-undef
    if (this.isDev) {
      this.tabs.push({
        name: '__test__',
        component: 'Test',
      });
    }
    this.tabs.forEach((t, i) => {
      t.id = i;
      t.tag = this.getTag(t.name);
      if (!t.component) {
        t.component = this.getComponent(t.name);
      }
    });
    this.tag = this.getTab();
    window.addEventListener('dragover', e => {
      e.preventDefault();
    });
    window.addEventListener('drop', e => {
      e.preventDefault();
    });
    this.iconsList = this.icons;
  }

  save() {
    return this.validate();
  }

  start() {
    const tab = this.tabs.find(t => !t.disabled && t.name !== 'Home');
    this.goToTab(tab);
  }

  parseURL() {
    return window.location.search
      .replace(/^\?(.*)$/, '$1')
      .split(';')
      .map(i => {
        const [key, value] = i.split('=');
        return { [key]: value };
      });
  }

  getTab() {
    const query = this.parseURL();
    const tab = query.find((el: Record<string, string>) => 'tab' in el)?.tab;
    if (tab) {
      return tab;
    }
    this.setTab();
  }

  setTab() {
    this.goToTab(this.tabs.find(t => !t.disabled));
  }

  onTab(id: number) {
    const found = this.tabs.find(t => t.id === id);
    if (found) {
      this.goToTab(found);
    }
  }

  goToTab(tab: ITab) {
    this.prevTab = {
      ...this.currentTab,
    };
    if (!this.tag) {
      window.location.href = '/?tab=' + tab.tag;
      return;
    }
    this.tag = tab.tag;
    setTimeout(() => {
      history.pushState({}, null, '/?tab=' + this.tag);
    }, 100);
  }

  getTag(name: string) {
    return name.replace(/[^\w]/g, '_').toLowerCase();
  }

  getComponent(name: string) {
    return name.replace(/[^\w]/g, '-').toLowerCase();
  }

  goToVersion(value: unknown) {
    if (value !== this.version) {
      const found = this.versions.find(v => v.version === value);
      if (found) {
        window.location.href = found.url;
      }
    }
  }

  get currentTab(): ITab {
    if (this.tag) {
      return this.tabs.find((t: ITab) => t.tag === this.tag);
    }
    return null;
  }

  get breadcrumbs(): Array<IBreadcrumbsItem> {
    const items = [
      {
        text: 'LDM UI',
        route: {
          path: '/',
        },
        disabled: true,
      },
    ];
    if (this.currentTab) {
      items.push({
        text: this.currentTab.name,
        route: {
          path: '/',
        },
        disabled: true,
      });
    }
    return items;
  }
}
