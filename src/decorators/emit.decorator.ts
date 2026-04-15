import { createDecorator, VueBase } from 'vue-class-component';

function makeDecoratorEmit(event: string) {
  function helper(proto: VueBase, key: string) {
    return createDecorator((componentOptions, propertyKey) => {
      const emitName = event.toLowerCase();
      if (!componentOptions.emits) {
        componentOptions.emits = [];
      }
      componentOptions.emits.push(emitName);
      const original = componentOptions.methods[propertyKey];
      componentOptions.methods[propertyKey] = function emitter(...args: Array<unknown>) {
        const emit = (returnValue: unknown) => {
          /* eslint-disable no-undefined */
          if (returnValue === undefined) {
            if (args.length === 0) {
              this.$emit(emitName);
            } else if (args.length === 1) {
              this.$emit(emitName, args[0]);
            } else {
              this.$emit(emitName, ...args);
            }
          } else {
            args.unshift(returnValue);
            this.$emit(emitName, ...args);
          }
        };
        const returnValue = original.apply(this, args);
        emit(returnValue);
      };
    })(proto, key);
  }
  return helper;
}

const Emit = makeDecoratorEmit;

export { Emit };
