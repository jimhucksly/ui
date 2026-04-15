import { mixins, Options } from 'vue-class-component';
import { Inject, Prop, Watch } from 'vue-property-decorator';
import Help from '@/components/help/help.vue';
import Icon from '@/components/icon/icon.vue';
import Label from '@/components/label/label.vue';
import { Emit } from '@/decorators/emit.decorator';
import EditMixin from '@/mixins/edit.mixin';
import GridMixin from '@/mixins/grid.mixin';
import HelpMixin from '@/mixins/help.mixin';
import InputMixin from '@/mixins/input.mixin';
import ValidatableMixin from '@/mixins/validatable.mixin';
import { IInjectionForm } from '@/types/form';

type InjectionForm = IInjectionForm;

/**
 * @displayName ld-textarea
 */
@Options({
  components: {
    'ld-label': Label,
    'ld-help': Help,
    'svg-icon': Icon,
  },
})
export default class TextareaComponent extends mixins(ValidatableMixin, GridMixin, HelpMixin, InputMixin, EditMixin) {
  @Prop() modelValue: string;
  /** Максимальное количество символов, которое можно ввести */
  @Prop() maxlength: number | string;
  /** Разрешение на изменение высоты текстового поля */
  @Prop({ type: Boolean, default: false }) resizable: boolean;

  @Inject({ from: 'form', default: null }) declare form: InjectionForm;

  internalModel = '';

  isFocused = false;

  @Emit('update:model-value') emitUpdateValue(value: string) {
    return value;
  }

  @Emit('blur') emitBlur(event: unknown) {
    return event;
  }

  @Emit('enter') emitEnter(e: KeyboardEvent) {
    return e;
  }

  @Emit('keydown') emitKeydown(e: KeyboardEvent) {
    return e;
  }

  @Watch('modelValue') onTextChanged() {
    this.internalModel = this.modelValue;
    this.validate();
  }

  @Watch('internalModel') onInternalModelChanged() {
    this.emitUpdateValue(this.internalModel);
  }

  created() {
    this.internalModel = this.modelValue;
  }

  mounted() {
    const input = (this.$el as HTMLElement).querySelector('textarea');
    if (input) {
      input.classList.add('scroll-s');
    }
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur(event: unknown) {
    this.isFocused = false;
    this.validate();
    this.emitBlur(event);
  }

  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.emitEnter(e);
    } else {
      this.emitKeydown(e);
    }
  }

  validate(): boolean {
    let funcResult = null;
    this.validationMessage = '';
    for (const func of this.validRules) {
      if (this.validationMessage) {
        break;
      }
      funcResult = func(this.modelValue);
      if (typeof funcResult === 'string') {
        this.validationMessage = funcResult;
      }
    }
    return !this.validationMessage;
  }

  get rows(): number {
    if (this.size === 's') {
      return 3;
    }
    if (this.size === 'm') {
      return 4;
    }
    if (this.size === 'l') {
      return 5;
    }
  }
}
