import { mixins, Options } from 'vue-class-component';
import { Inject, Prop, Watch } from 'vue-property-decorator';
import Icon from '@/components/icon/icon.vue';
import Label from '@/components/label/label.vue';
import { Emit } from '@/decorators/emit.decorator';
import InputMixin from '@/mixins/input.mixin';
import ValidatableMixin from '@/mixins/validatable.mixin';
import { IInjectionForm } from '@/types/form';
import { files } from '@/utils';
import { FileStatus, IFile, UploaderController } from './uploader.controller';

type InjectionForm = IInjectionForm;

/**
 * @displayName ld-uploader
 */
@Options({
  components: {
    'ld-label': Label,
    'svg-icon': Icon,
  },
})
export default class UploaderComponent extends mixins(ValidatableMixin, InputMixin) {
  @Prop({ type: Array, default: (): Array<File> => [] }) modelValue: Array<File>;
  @Prop({ type: String, default: '' }) url: string;
  @Prop({ type: String, default: 'POST' }) method: 'POST' | 'PUT';
  @Prop({ type: Object, default: (): Record<string, string> => ({}) }) headers: Record<string, string>;
  @Prop({ default: undefined }) responseParser: (value: unknown) => string;
  @Prop({ default: undefined }) beforeSend: (item: IFile, body: FormData) => Promise<FormData>;
  @Prop({ type: String, default: '' }) name: string;
  @Prop({ type: [String, Number], default: 0 }) width: string | number;
  @Prop({ type: [String, Number], default: 0 }) height: string | number;
  @Prop({ type: Number, default: undefined }) max: number;
  @Prop({ type: String, default: 'm' }) size: 's' | 'm' | 'l';
  @Prop({ type: Boolean, default: false }) fluid: boolean;
  @Prop({ type: String, default: undefined }) accept: string;
  @Prop({ type: Boolean, default: false }) multiple: boolean;
  @Prop({ type: Boolean, default: false }) lazy: boolean;
  @Prop({ type: Boolean, default: false }) asInput: boolean;

  @Inject({ from: 'form', default: null }) declare form: InjectionForm;

  isDrag = false;
  controller: UploaderController = null;
  items: Array<IFile> = [];

  @Emit('update:model-value') onUpdateModelEmit(value: Array<File>) {
    return value;
  }

  @Emit('input') onInputEmit(value: Array<File>) {
    return value;
  }

  @Emit('change') onItemsChangeEmit(value: Array<IFile>) {
    return value;
  }

  @Emit('complete') onCompleteEmit() {
    return true;
  }

  @Watch('url') onUrlChanged(value: string) {
    this.controller.setOptions({ url: value });
  }

  @Watch('max') onMaxChanged(value: number) {
    this.controller.setOptions({ maximum: value });
  }

  @Watch('method') onMethodChanged(value: string) {
    this.controller.setOptions({ method: value });
  }

  @Watch('headers', { deep: true }) onHeadersChanged(value: Record<string, string>) {
    this.controller.setOptions({ headers: value });
  }

  created() {
    this.controller = new UploaderController({
      maximum: this.max,
      method: this.method,
      headers: this.headers,
      url: this.url,
    });
    this.controller.on('input', this.onItemsInput.bind(this));
    this.controller.on('update', this.onItemsUpdated.bind(this));
    this.controller.on('complete', this.onItemsLoaded.bind(this));
    this.controller.on('ready', this.onReadyItem.bind(this));
  }

  beforeUnmount() {
    this.controller.flush();
  }

  onFocus() {
    //
  }

  onBlur(e: FocusEvent) {
    this.validate();
  }

  onClick() {
    const input = this.$refs.fileInput as HTMLInputElement;
    input.click();
    input.focus();
  }

  onChange(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    this.controller.add(Array.from(target.files));
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.disabled) {
      return;
    }
    this.isDrag = true;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.disabled) {
      return;
    }
    this.isDrag = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.disabled) {
      return;
    }
    this.isDrag = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.disabled) {
      return;
    }
    this.isDrag = false;
    const target = event.target as HTMLInputElement;
    let items = target.files;
    if (!items?.length) {
      items = event.dataTransfer.files;
    }
    if (items?.length === 0) {
      return;
    }
    this.controller.add(Array.from(items));
  }

  onItemsInput(items: Array<IFile>) {
    this.validationMessage = '';
    const _files = items.map(i => i.file);
    this.onUpdateModelEmit(_files);
    this.onInputEmit(_files);
    if (!this.lazy && !this.asInput) {
      setTimeout(() => {
        for (const i of items) {
          this.onUploadItem(i);
        }
      }, 1000);
    }
  }

  onItemsUpdated(items: Array<IFile>) {
    this.items = items;
  }

  onItemsLoaded() {
    this.onCompleteEmit();
  }

  onUploadItem(item: IFile) {
    this.controller.send(item.uid);
  }

  async onReadyItem(item: IFile, body: FormData, resolve: (value: FormData) => void, reject: (e: Error) => void) {
    if (this.beforeSend instanceof Function) {
      try {
        const formData = await this.beforeSend(item, body);
        resolve(formData);
      } catch (e) {
        reject(e);
      }
    }
    resolve(body);
  }

  onDeleteItem(item: IFile) {
    this.controller.remove(item.uid);
    const input = this.$refs.fileInput as HTMLInputElement;
    if (input.files.length) {
      const dt = new DataTransfer();
      for (const f of Array.from(input.files)) {
        if (f.name !== item.name) {
          dt.items.add(f);
        }
      }
      input.files = dt.files;
    }
  }

  onAbortItem(item: IFile) {
    this.controller.abort(item.uid);
  }

  getItemStatus(item: IFile) {
    if (item.status === FileStatus.Overflow) {
      return this.$ldmuii18n.gettext('Uploader File Size Overflow');
    }
    if (item.status === FileStatus.Aborted) {
      return this.$ldmuii18n.gettext('Uploader Load Abort');
    }
    if (item.status === FileStatus.Canceled) {
      return this.$ldmuii18n.gettext('Uploader Load Timed Out');
    }
    if (item.status === FileStatus.Error) {
      let message = '';
      if (this.responseParser instanceof Function) {
        message = this.responseParser(item.response || item.error);
      }
      if (message) {
        return message;
      }
      return this.$ldmuii18n.gettext('Uploader Load Error');
    }
  }

  private validate(): boolean {
    let funcResult = null;
    this.validationMessage = '';
    for (const func of this.validRules) {
      if (this.validationMessage) {
        break;
      }
      funcResult = func(null);
      if (typeof funcResult === 'string') {
        this.validationMessage = funcResult;
      }
    }
    return !this.validationMessage;
  }

  get myPlaceholder(): string {
    return this.placeholder || this.$ldmuii18n.gettext('Uploader Placeholder');
  }

  get maxValue(): string {
    return files.formatSize(this.max);
  }

  get mySize(): string {
    switch (this.size) {
      case 's':
        return 'ld-uploader--x-small';
      case 'm':
        return 'ld-uploader--small';
      case 'l':
        return 'ld-uploader--large';
    }
  }

  get myWidth(): string | number {
    if (this.fluid) {
      return '100%';
    }
    if (this.width) {
      return this.width;
    }
    switch (this.size) {
      case 's':
        return 382;
      case 'm':
        return 430;
      case 'l':
        return 940;
    }
  }

  get myWidthValue(): string {
    return typeof this.myWidth === 'string' ? this.myWidth : `${this.myWidth}px`;
  }

  get myHeight(): string | number {
    if (this.height) {
      return this.height;
    }
    switch (this.size) {
      case 's':
        return 'auto';
      case 'm':
        return 'auto';
      case 'l':
        return 332;
    }
  }

  get myHeightValue(): string {
    return typeof this.myHeight === 'string' ? this.myHeight : `${this.myHeight}px`;
  }

  get requiredMessage(): string {
    return this.$ldmuii18n.gettext('Uploader Required Message');
  }

  get hasItems(): boolean {
    return this.items.length > 0;
  }
}
