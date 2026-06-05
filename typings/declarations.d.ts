/* eslint-disable no-var */
declare var $DEV: boolean;
declare var $VERSION: string;
declare var $COMPONENTS: Array<string>;
declare var $ICONS: Array<string>;

declare module 'mol_time_all';
declare module 'vuetify/lib/components/VOverlay/locationStrategies' {
  export interface LocationStrategyData {
    contentEl: Ref<HTMLElement | undefined>;
    target: Ref<HTMLElement | [x: number, y: number] | undefined>;
    isActive: Ref<boolean>;
    isRtl: Ref<boolean>;
  }
  export interface StrategyProps {
    locationStrategy: keyof typeof locationStrategies | LocationStrategyFunction;
    location: Anchor;
    origin: Anchor | 'auto' | 'overlap';
    offset?: number | string | number[];
    stickToTarget?: boolean;
    viewportMargin?: number | string;
    maxHeight?: number | string;
    maxWidth?: number | string;
    minHeight?: number | string;
    minWidth?: number | string;
  }
}
