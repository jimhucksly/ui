# cols[12]
```html
<ld-edit-text label="Edit Text" :rules="myRules" v-model="text" required />
<ld-button @click="validate">Validate</ld-button>
```

```ts
ValidateFunction: (value: string) => string | boolean
myRules: Array<ValidateFunction> = []
```
# end of cols
# cols[6]
* **for options-style component**
```js
/* Form Model (options-style component) */
import { ValidateMixinOptions } from '@ldmjs/ui';
export default {
  mixins: [ValidateMixinOptions],
  data() {
    return {
      text: '',
    }
  },
  computed: {
    myRules() {
      function cyrillic(value) {
        if (/[а-яА-ЯёЁ]/.test(value)) {
          return 'Символы кириллицы не допустимы';
        }
        return true;
      }
      return [cyrillic];
    }
  },
  methods: {
    save() {
      cosnt isValid: boolean = this.validate();
      ...
    }
  }
};
```
# end of cols
# cols[6]
* **for class-style component**
```js
import { ValidateMixin, ValidateFunction } from '@ldmjs/ui';
import { mixins } from 'vue-class-component';
export default class Form extends mixins(ValidateMixin) {
  text: string = '';
  myRules: Array<ValidateFunction> = [];
  \n
  validate() {
    cosnt isValid: boolean = this.validate();
    ...
  }
}
```
* **for component as modal content**
```js
export default class Form mixins(ValidateMixin) {
  created() {
    this.$emit('exteral-component-created', this);
  }
  save() {
    if (this.validate()) {
      this.$emit('set-result', ...);
    }
  }
}
```
# end of cols
