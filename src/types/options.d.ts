export interface IExtension {
  name: string;
  alias: string;
  props?: {
    [key: string]: unknown;
  };
}

export interface IAliases {
  'b-button'?: string;
  'b-icon'?: string;
  'b-chip'?: string;
  'b-badge'?: string;
  'b-splitter'?: string;
  'b-loader'?: string;
  'b-progress'?: string;
  'b-toggle-buttons'?: string;
  'b-breadcrumbs'?: string;
  'b-edit-text'?: string;
  'b-datepicker'?: string;
  'b-daterange'?: string;
  'b-calendar'?: string;
  'b-tab'?: string;
  'b-tabs'?: string;
  'b-select-list-box'?: string;
  'b-checkbox'?: string;
  'b-radiobutton'?: string;
  'b-radiogroup'?: string;
  'b-textarea'?: string;
  'b-select'?: string;
  'b-combobox'?: string;
  'b-timepicker'?: string;
  'b-text-markup'?: string;
  'b-switch'?: string;
  'b-dialog'?: string;
  'b-data-iterator'?: string;
  'b-pager'?: string;
  'b-uploader'?: string;
  'b-step'?: string;
  'b-slider'?: string;
  'b-expansion-panels'?: string;
  'b-expansion-panel'?: string;
}

export interface IOptions {
  prefix?: string;
  aliases?: IAliases;
  extensions?: Array<IExtension>;
  language?: string;
  viewport?: {
    isMobile: string;
    isTablet: string;
    isDesktop: string;
  };
  BBadge?: {
    [key: string]: unknown;
  };
  BBreadcrumbs?: {
    [key: string]: unknown;
  };
  BButton?: {
    [key: string]: unknown;
  };
  BCalendar?: {
    [key: string]: unknown;
  };
  BCheckbox?: {
    [key: string]: unknown;
  };
  BChip?: {
    [key: string]: unknown;
  };
  BCombobox?: {
    [key: string]: unknown;
  };
  BDataIterator?: {
    [key: string]: unknown;
  };
  BDatepicker?: {
    [key: string]: unknown;
  };
  BDialog?: {
    [key: string]: unknown;
  };
  BEditText?: {
    [key: string]: unknown;
  };
  BExpansionPanel?: {
    [key: string]: unknown;
  };
  BExpansionPanels?: {
    [key: string]: unknown;
  };
  BIcon?: {
    [key: string]: unknown;
  };
  BLoader?: {
    [key: string]: unknown;
  };
  BPager?: {
    [key: string]: unknown;
  };
  BProgress?: {
    [key: string]: unknown;
  };
  BRadioButton?: {
    [key: string]: unknown;
  };
  BRadioGroup?: {
    [key: string]: unknown;
  };
  BSelect?: {
    [key: string]: unknown;
  };
  BSelectListBox?: {
    [key: string]: unknown;
  };
  BSlider?: {
    [key: string]: unknown;
  };
  BSplitter?: {
    [key: string]: unknown;
  };
  BStep?: {
    [key: string]: unknown;
  };
  BSwitch?: {
    [key: string]: unknown;
  };
  BTab?: {
    [key: string]: unknown;
  };
  BTabs?: {
    [key: string]: unknown;
  };
  BTextMarkup?: {
    [key: string]: unknown;
  };
  BTextarea?: {
    [key: string]: unknown;
  };
  BTimepicker?: {
    [key: string]: unknown;
  };
  BToggleButtons?: {
    [key: string]: unknown;
  };
  BUploader?: {
    [key: string]: unknown;
  };
}
