import { Vue } from 'vue-property-decorator';
import { ldmuiOptions } from '@/index';
import { IToasted } from '@/types/toasted';

declare module 'vue/types/options' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends Vue> {
    functional?: boolean;
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $dnwebui: {
      ver: string;
    }
  }
}

declare module 'vue/types/options' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends Vue> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $options?: any;
  }
}
