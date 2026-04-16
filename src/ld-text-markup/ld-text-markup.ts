import { MdEditor, NormalToolbar } from 'md-editor-v3';
import { mixins } from 'vue-class-component';
import { Inject, Options, Prop, Watch } from 'vue-property-decorator';
import Help from '@/components/help/help.vue';
import Label from '@/components/label/label.vue';
import { Emit } from '@/decorators/emit.decorator';
import VRuntimeTemplate from '@/lib/v-runtime-template';
import GridMixin from '@/mixins/grid.mixin';
import HelpMixin from '@/mixins/help.mixin';
import InputMixin from '@/mixins/input.mixin';
import ValidatableMixin from '@/mixins/validatable.mixin';
import { IInjectionForm } from '@/types/form';

interface IMarkdownIntance {
  render: (value: string) => string;
  renderInline: (value: string) => string;
}

interface IEditorInstance {
  execCommand: (command: string) => void;
}

type InjectionForm = IInjectionForm;

/**
 * @displayName ld-text-markup
 */
@Options({
  components: {
    'ld-label': Label,
    'ld-help': Help,
    'v-runtime-template': VRuntimeTemplate,
    'md-editor': MdEditor,
    'md-editor-button': NormalToolbar,
  },
})
export default class TextMarkupComponent extends mixins(ValidatableMixin, GridMixin, InputMixin, HelpMixin) {
  @Prop() modelValue: string;
  /* инициализация компонента с включенной секцией Превью */
  @Prop({ default: false }) enablePreview: boolean;

  @Inject({ from: 'form', default: null }) declare form: InjectionForm;

  /**
   * html
   */
  template = '';
  /**
   * markdown
   */
  value = '';
  preview = 0;
  md: IMarkdownIntance = null;

  previewWatchDisabled = false;

  isFocused = false;

  @Emit('update:model-value') emitInput() {
    return this.value;
  }

  @Emit('update:preview') emitPreview() {
    return this.preview;
  }

  @Watch('value') onValueChanged() {
    if (!this.value && this.required) {
      this.validate();
    }
    if (this.value) {
      this.validationMessage = '';
    }
  }

  @Watch('readonly')
  @Watch('disabled')
  onDisabledChanged() {
    if ((this.readonly || this.disabled) && !this.preview) {
      this.togglePreview();
    }
  }

  @Watch('enablePreview', { immediate: true }) async onPreviewChanged() {
    if (this.previewWatchDisabled) {
      return;
    }
    this.previewWatchDisabled = true;
    await this.toggle();
    await this.$nextTick();
    this.previewWatchDisabled = false;
  }

  async mounted() {
    const markdownIt = (await import('markdown-it')).default;
    const md = new markdownIt();
    this.md = md;
    this.buildEditor();
    if (this.form) {
      this.form?.register(this, null);
    }
  }

  onEditorChange(value: string) {
    this.value = value;
    this.emitInput();
  }

  onEditorFocus() {
    this.isFocused = true;
  }

  onEditorBlur() {
    this.isFocused = false;
  }

  async togglePreview() {
    this.preview = this.preview ? 0 : 1;
    if (this.preview) {
      this.previewRender(this.value);
      await this.$nextTick();
    }
    this.emitPreview();
  }

  async toggle() {
    if (this.readonly || this.disabled) {
      return;
    }
    await this.togglePreview();
  }

  validate() {
    let funcResult = null;
    this.validationMessage = '';
    this.validRules.forEach(func => {
      funcResult = func(this.value);
      if (funcResult !== true) {
        this.validationMessage = funcResult as string;
      }
    });
    return !this.validationMessage;
  }

  buildEditor() {
    this.value = this.modelValue;
    if (this.preview || this.readonly) {
      this.togglePreview();
    }
    const editorWrapper = document.getElementById(`editorbox-${this.uid}`);
    if (editorWrapper) {
      editorWrapper.style.visibility = 'visible';
    }
  }

  private previewRender(plainText: string) {
    if (!this.md) {
      return;
    }
    plainText = plainText.replace(/\n/g, '<br> \n');
    try {
      let html = this.md.render(plainText);
      html = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      this.template = '<div class="ld-text-markup-preview">' + html + '</div>';
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e);
    }
  }

  get items() {
    return [
      {
        id: 0,
        text: this.$uii18n.gettext('Text'),
      },
      {
        id: 1,
        text: this.$uii18n.gettext('Preview'),
      },
    ];
  }

  get showError(): boolean {
    return Boolean(this.validationMessage);
  }

  get toolbars(): Array<string | number> {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  }

  get handlers() {
    return {
      bold: () => (this.$refs.editor as IEditorInstance).execCommand('bold'),
      underline: () => (this.$refs.editor as IEditorInstance).execCommand('underline'),
      italic: () => (this.$refs.editor as IEditorInstance).execCommand('italic'),
      h1: () => (this.$refs.editor as IEditorInstance).execCommand('h1'),
      h2: () => (this.$refs.editor as IEditorInstance).execCommand('h2'),
      h3: () => (this.$refs.editor as IEditorInstance).execCommand('h3'),
      ul: () => (this.$refs.editor as IEditorInstance).execCommand('unorderedList'),
      ol: () => (this.$refs.editor as IEditorInstance).execCommand('orderedList'),
      link: () => (this.$refs.editor as IEditorInstance).execCommand('link'),
    };
  }
}
