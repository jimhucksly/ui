export interface IExtension {
  name: string;
  alias: string;
  props?: {
    [key: string]: unknown;
  };
}

export interface IAliases {
  'ld-button'?: string;
  'ld-icon'?: string;
  'ld-chip'?: string;
  'ld-badge'?: string;
  'ld-avatar'?: string;
  'ld-splitter'?: string;
  'ld-loader'?: string;
  'ld-progress'?: string;
  'ld-toggle-buttons'?: string;
  'ld-breadcrumbs'?: string;
  'ld-edit-text'?: string;
  'ld-datepicker'?: string;
  'ld-daterange'?: string;
  'ld-calendar'?: string;
  'ld-tab'?: string;
  'ld-tabs'?: string;
  'ld-page-toolbar'?: string;
  'ld-select-list-box'?: string;
  'ld-checkbox'?: string;
  'ld-radiobutton'?: string;
  'ld-radiogroup'?: string;
  'ld-textarea'?: string;
  'ld-select'?: string;
  'ld-combobox'?: string;
  'ld-timepicker'?: string;
  'ld-edit-masked-text'?: string;
  'ld-text-markup'?: string;
  'ld-switch'?: string;
  'ld-dialog'?: string;
  'ld-data-iterator'?: string;
  'ld-pager'?: string;
  'ld-edit-list-box'?: string;
  'ld-uploader'?: string;
  'ld-step'?: string;
  'ld-slider'?: string;
  'ld-datatable'?: string;
  'ld-expansion-panels'?: string;
  'ld-expansion-panel'?: string;
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
  LdAvatar?: {
    [key: string]: unknown;
  };
  LdBadge?: {
    [key: string]: unknown;
  };
  LdBreadcrumbs?: {
    [key: string]: unknown;
  };
  LdButton?: {
    [key: string]: unknown;
  };
  LdCalendar?: {
    [key: string]: unknown;
  };
  LdCheckbox?: {
    [key: string]: unknown;
  };
  LdChip?: {
    [key: string]: unknown;
  };
  LdCombobox?: {
    [key: string]: unknown;
  };
  LdDataIterator?: {
    [key: string]: unknown;
  };
  LdDatatable?: {
    [key: string]: unknown;
  };
  LdDatepicker?: {
    [key: string]: unknown;
  };
  LdDialog?: {
    [key: string]: unknown;
  };
  LdEditListBox?: {
    [key: string]: unknown;
  };
  LdEditMaskedText?: {
    [key: string]: unknown;
  };
  LdEditText?: {
    [key: string]: unknown;
  };
  LdExpansionPanel?: {
    [key: string]: unknown;
  };
  LdExpansionPanels?: {
    [key: string]: unknown;
  };
  LdIcon?: {
    [key: string]: unknown;
  };
  LdLoader?: {
    [key: string]: unknown;
  };
  LdPageToolbar?: {
    [key: string]: unknown;
  };
  LdPager?: {
    [key: string]: unknown;
  };
  LdProgress?: {
    [key: string]: unknown;
  };
  LdRadioButton?: {
    [key: string]: unknown;
  };
  LdRadioGroup?: {
    [key: string]: unknown;
  };
  LdSelect?: {
    [key: string]: unknown;
  };
  LdSelectListBox?: {
    [key: string]: unknown;
  };
  LdSlider?: {
    [key: string]: unknown;
  };
  LdSplitter?: {
    [key: string]: unknown;
  };
  LdStep?: {
    [key: string]: unknown;
  };
  LdSwitch?: {
    [key: string]: unknown;
  };
  LdTab?: {
    [key: string]: unknown;
  };
  LdTabs?: {
    [key: string]: unknown;
  };
  LdTextMarkup?: {
    [key: string]: unknown;
  };
  LdTextarea?: {
    [key: string]: unknown;
  };
  LdTimepicker?: {
    [key: string]: unknown;
  };
  LdToggleButtons?: {
    [key: string]: unknown;
  };
  LdUploader?: {
    [key: string]: unknown;
  };
}
