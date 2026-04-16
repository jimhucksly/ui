import { Vue } from 'vue-class-component';
import { Provide, Watch } from 'vue-property-decorator';
import { IInput, IWatcher } from '../types/validation';

function validate() {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const errors = this.inputs.filter((input: any) => input.validate && !input.validate(true)).length;
  return !errors;
}

function register(input: Vue, section: number | string) {
  if (section) {
    this.section = section;
  }
  if (this.section && (input as unknown as { validate(): boolean }).validate) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    (input as unknown as { __cardSection: string | number }).__cardSection = this.section;
  }
  const unwatch = this.watchInput(input);
  this.inputs.push(input as unknown as IInput);
  this.watchers.push(unwatch);
}

function unregister(input: IInput) {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const found = this.inputs.find((i: any) => i.uid === (input as unknown as { uid: number }).uid);
  if (!found) {
    return;
  }
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const unwatch = this.watchers.find((i: any) => i.uid === found.uid);
  if (unwatch) {
    if (unwatch.valid) {
      unwatch.valid();
    }
    if (unwatch.shouldValidate) {
      unwatch.shouldValidate();
    }
  }
  let index = 0;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  index = this.watchers.findIndex((i: any) => i.uid === found.uid);
  this.watchers.splice(index, 1);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  index = this.inputs.findIndex((i: any) => i.uid === found.uid);
  this.inputs.splice(index, 1);
  delete this.errorBag[found.uid];
}

function validateSection(section: number | string): boolean {
  const errors = this.inputs.filter(
    // eslint-disable-next-line eqeqeq, @typescript-eslint/no-explicit-any
    (input: any) => input.__cardSection == section && input.validate && !input.validate(true)
  ).length;
  return !errors;
}

function watchInput(input: Vue) {
  const watcher = (_input: Vue) =>
    _input.$watch(
      'hasError',
      (val: boolean) => {
        this.errorBag[(_input as unknown as IInput).uid] = val;
      },
      { immediate: true }
    );

  const watchers: IWatcher = {
    uid: (input as unknown as IInput).uid,
    valid: null,
    shouldValidate: null,
  };

  if (this.lazyValidation) {
    // Only start watching inputs if we need to
    watchers.shouldValidate = input.$watch('shouldValidate', (val: boolean) => {
      if (!val) {
        return;
      }
      // Only watch if we're not already doing it
      if (Object.prototype.hasOwnProperty.call(this.errorBag, (input as unknown as { uid: number }).uid)) {
        return;
      }
      watchers.valid = watcher(input);
    });
  } else {
    watchers.valid = watcher(input);
  }
  return watchers;
}

function reset() {
  for (let i = this.inputs.length; i >= 0; i--) {
    this.inputs[i].reset();
  }
  if (this.lazyValidation) {
    setTimeout(() => {
      this.errorBag = {};
    }, 0);
  }
}

function resetValidation() {
  for (let i = this.inputs.length; i >= 0; i--) {
    this.inputs[i].resetValidation();
  }
  if (this.lazyValidation) {
    setTimeout(() => {
      this.errorBag = {};
    }, 0);
  }
}

function onErrorBagChanged() {
  if (this.errorBag) {
    const errors = Object.values(this.errorBag).includes(true);
    this.isValid = !errors;
  } else {
    this.isValid = true;
  }
}

const mixin = {
  data(): {
    inputs: Array<IInput>;
    watchers: Array<IWatcher>;
    errorBag: Record<number, boolean>;
    lazyValidation: boolean;
    isValid: boolean;
    section: number | string;
    customValidateFunc: () => string | boolean;
  } {
    return {
      inputs: [],
      watchers: [],
      errorBag: {},
      lazyValidation: false,
      isValid: true,
      section: null,
      customValidateFunc: null,
    };
  },
  watch: {
    errorBag: {
      deep: true,
      immediate: true,
      handler() {
        return onErrorBagChanged.bind(this)();
      },
    },
  },
  provide() {
    return {
      form: {
        register: register.bind(this),
        unregister: unregister.bind(this),
      },
    };
  },
  methods: {
    validate(): boolean {
      let customValidationResult: string | boolean = true;
      if (this.customValidateFunc) {
        customValidationResult = this.customValidateFunc();
      }
      const isValid = typeof customValidationResult === 'boolean' && customValidationResult;
      if (isValid) {
        return validate.bind(this)();
      }
      return false;
    },
    register(input: Vue, section: number | string) {
      return register.bind(this)(input, section);
    },
    unregister(input: IInput) {
      return unregister.bind(this)(input);
    },
    validateSection(section: number | string): boolean {
      return validateSection.bind(this)(section);
    },
    watchInput(input: Vue) {
      return watchInput.bind(this)(input);
    },
    reset() {
      return reset.bind(this)();
    },
    resetValidation() {
      return resetValidation.bind(this)();
    },
  },
};

export class ValidateMixin extends Vue {
  inputs: Array<IInput> = [];
  watchers: Array<IWatcher> = [];
  errorBag: Record<number, boolean> = {};
  lazyValidation = false;
  isValid = true;
  section: number | string = null;

  customValidateFunc: () => string | boolean;

  @Provide() form = {
    register: this.register.bind(this),
    unregister: this.unregister.bind(this),
  };

  @Watch('errorBag', { deep: true, immediate: true }) onErrorBagChanged() {
    return onErrorBagChanged.bind(this)();
  }

  validate(): boolean {
    let customValidationResult: string | boolean = true;
    if (this.customValidateFunc) {
      customValidationResult = this.customValidateFunc();
    }
    const isValid = typeof customValidationResult === 'boolean' && customValidationResult;
    if (isValid) {
      return validate.bind(this)();
    }
    return false;
  }

  register(input: Vue, section: number | string) {
    return register.bind(this)(input, section);
  }

  unregister(input: IInput) {
    return unregister.bind(this)(input);
  }

  validateSection(section: number | string): boolean {
    return validateSection.bind(this)(section);
  }

  watchInput(input: Vue) {
    return watchInput.bind(this)(input);
  }

  reset() {
    return reset.bind(this)();
  }

  resetValidation() {
    return resetValidation.bind(this)();
  }
}

export const ValidateMixinOptions = mixin;
