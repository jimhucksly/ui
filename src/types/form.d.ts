import { Vue } from 'vue-class-component';

export interface IInjectionForm {
  register?: (component: Vue, param: unknown) => void;
  unregister?: (component: Vue, param: unknown) => void;
}
