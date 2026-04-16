const defineDescriptor = (src, dest, name) => {
  if (!dest.hasOwnProperty(name)) {
    const descriptor = Object.getOwnPropertyDescriptor(src, name);
    Object.defineProperty(dest, name, descriptor);
  }
};

const merge = objs => {
  const res = {};
  objs.forEach(obj => {
    obj &&
      Object.getOwnPropertyNames(obj).forEach(name =>
        defineDescriptor(obj, res, name)
      );
  });
  return res;
};

const buildFromProps = (obj, props) => {
  const res = {};
  props.forEach(prop => defineDescriptor(obj, res, prop));
  return res;
};

const { defineComponent } = require('vue');

export default {
  props: {
    template: String,
    parentComp: Object,
  },
  data() {
    return {
      componentName: '',
      dynamic: null,
    };
  },
  created() {
    const componentName =  'runtime-template-' + Math.floor(Math.random() * 10000);
    if (this.template) {
      if (this.dynamic && this.$parent) {
        const { $data, $props } = this.$parent;
        let passthrough = { $data: {}, $props: {} };

        //build new objects by removing keys if already exists (e.g. created by mixins)
        Object.keys($data || {}).forEach(key => {
          if (this.$data[key] === undefined) {
            passthrough.$data[key] = $data[key];
          }
        });
        Object.keys($props || {}).forEach(key => passthrough.$props[key] = $props[key]);
        const updatedProps = merge([passthrough.$data, passthrough.$props, this.methodsFromProps]);
        this.$options.components[componentName] = defineComponent(this.dynamic, { props: updatedProps });
        this.componentName = componentName;
        return;
      }
      const parent = this.parentComp || this.$parent;

      if (!this.$options.methods) {
        this.$options.methods = {};
      }
      if (!this.$options.computed) {
        this.$options.computed = {};
      }
      if (!this.$options.components) {
        this.$options.components = {};
      }
      const { $data, $props, $options } = parent;
      const { components, computed, methods } = $options;

      let passthrough = {$data:{}, $props:{}, $options:{}, components:{}, computed:{}, methods:{}};

      //build new objects by removing keys if already exists (e.g. created by mixins)
      Object.keys($data || {}).forEach(key => {
        if (this.$data[key] === undefined) {
          passthrough.$data[key] = $data[key];
        }
      });
      Object.keys($props || {}).forEach(key => {
        if (this.$props[key] === undefined) {
          passthrough.$props[key] = $props[key];
        }
      });
      Object.keys(methods || {}).forEach(key => {
        if (this.$options.methods[key] === undefined) {
          passthrough.methods[key] = methods[key];
        }
      });
      Object.keys(computed || {}).forEach(key => {
        if (this.$options.computed[key] === undefined) {
          passthrough.computed[key] = computed[key];
        }
      });
      Object.keys(components || {}).forEach(key => {
        if (this.$options.components[key] === undefined) {
          passthrough.components[key] = components[key];
        }
      });

      const methodKeys = Object.keys(passthrough.methods || {});
      const dataKeys = Object.keys(passthrough.$data || {});
      const propKeys = Object.keys(passthrough.$props || {});
      const allKeys = dataKeys.concat(propKeys).concat(methodKeys);
      this.methodsFromProps = buildFromProps(parent, methodKeys);
      const props = merge([passthrough.$data, passthrough.$props, this.methodsFromProps]);

      const watch = {};
      const $newData = {};
      let template = this.template || "<div></div>";
      dataKeys.forEach(key => {
        const regex = new RegExp(`[^"{\\s=]?${key}[\"}\\s]*?(?=[\"}\\s])`, 'g'); // works everywhere (Firefox too)
        const match = regex.exec(template);
        if (match == key) {
          const newKey = `${key}_ld`;
          $newData[newKey] = passthrough.$data[key];
          template = template.replace(regex, newKey);
          const watcher = parent._watchers.find(w => w.expression === key);
          if (watcher) {
            const old_cb = watcher.cb;
            watcher.cb = function (newVal, oldVal) {
              const componentInstance = this.__renderFn__.componentInstance;
              componentInstance[newKey] = newVal;
              old_cb.call(parent, newVal, oldVal);
            }.bind(this);
          } else {
            const cb = function (newVal) {
              const componentInstance = this.__renderFn__.componentInstance;
              componentInstance[newKey] = newVal;
            }.bind(this);
            parent.$watch(key, cb);
          }
          watch[newKey] = function (newVal, oldVal) {
            parent[key] = newVal;
          }
        }
      });
      this.$options.components[componentName] = defineComponent(
        {
          template,
          props: allKeys,
          data: () => $newData,
          computed: passthrough.computed,
          components: passthrough.components,
          watch,
        },
        { props }
      );
      this.componentName = componentName;
    }
  }
};
