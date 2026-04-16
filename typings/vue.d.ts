import { Vue } from 'vue-property-decorator';
import { IOptions } from '@/index';
import { IToasted } from '@/types/toasted';

declare module 'vue/types/options' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends Vue> {
    functional?: boolean;
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $ui: {
      options: IOptions;
    };
    $uii18n: {
      library: Record<string, string>;
      gettext: (value: string) => string;
    };
    $toasted: IToasted;
    isDev: boolean;
  }
}

declare module 'vue/types/options' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends Vue> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $options?: any;
  }
}
