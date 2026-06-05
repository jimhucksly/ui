import { isDefined, objects } from '@dn-web/core';
import { Ref } from 'vue';
import { Vue } from 'vue-class-component';
import { LocationStrategyData, StrategyProps } from 'vuetify/lib/components/VOverlay/locationStrategies';
import { TElement } from '../types/combobox';
import UnitService from './unit.service';

export default class ComboboxService {
  static readonly MIN_MENU_HEIGHT = 200;
  static readonly MAX_MENU_HEIGHT = 310;
  static readonly VIEWPORT_GAP = 28;
  static readonly VLIST_PADDING_Y = 8;

  locationStrategy(data: LocationStrategyData, _: StrategyProps, contentStyles: Ref<Record<string, string>>) {
    const pixelRound = UnitService.pixelRound.bind(this);
    const convertToUnit = UnitService.convertToUnit.bind(this);
    function updateLocation(originalElementsCount: number = 0) {
      if (!document) {
        return;
      }
      const body = document.body;
      const content = data.contentEl.value;
      const activator = data.target.value as HTMLElement;
      if (!content || !activator) {
        return;
      }
      const input = activator.closest('.v-input');
      const viewport = body.getBoundingClientRect();
      const rect = activator.getBoundingClientRect();
      const available = {
        top: rect.y,
        bottom: viewport.height - rect.y - rect.height,
      };

      const props = {
        left: convertToUnit(pixelRound(rect.x)),
        minWidth: convertToUnit(pixelRound((input || activator).clientWidth)),
        top: '',
        maxHeight: '',
      };

      /* вычисляем доступное пространство между списком элементов и нижней границей окна */
      const min = Math.min(available.bottom, ComboboxService.MAX_MENU_HEIGHT);
      /* берем доступную высоту или минимальную высоту выпадающего меню */
      const max = Math.max(min, ComboboxService.MIN_MENU_HEIGHT);
      if (max > ComboboxService.MIN_MENU_HEIGHT) {
        /* если область под элементов достаточно для выпадающего меню, разкрываем его под элементом */
        props.top = convertToUnit(pixelRound(rect.y + rect.height));
        props.maxHeight = convertToUnit(pixelRound(max - ComboboxService.VIEWPORT_GAP));
      } else {
        /* если области под элементов не достаточно для выдадающего меню, раскрываем его над элементом */
        /* берем минимальное между высотой доступной области над элементом и максимальной высотой выпадающего меню */
        let contentHeight = content.clientHeight;
        if (originalElementsCount) {
          const list = content.querySelector('.ld-dropdown-list');
          if (list) {
            const item = list.querySelector('.v-list-item');
            if (item) {
              contentHeight = originalElementsCount * item.clientHeight + ComboboxService.VLIST_PADDING_Y * 2;
              contentHeight = Math.min(contentHeight, ComboboxService.MAX_MENU_HEIGHT);
            }
          }
        }
        const _min = Math.min(available.top, contentHeight, ComboboxService.MAX_MENU_HEIGHT);
        /* если вычисленная высота равна доступной области до верхней границы окна, то вычтем gap */
        const h = pixelRound(_min) - (_min === available.top ? ComboboxService.VIEWPORT_GAP : 0);
        props.maxHeight = convertToUnit(h);
        props.top = convertToUnit(pixelRound(rect.y - h));
      }

      Object.assign(contentStyles.value, { ...props });
    }

    (this as unknown as Vue).$nextTick(() => {
      requestAnimationFrame(() => {
        updateLocation();
        requestAnimationFrame(() => {
          updateLocation();
        });
      });
    });

    (this as unknown as Vue).$watch(
      'optionsList',
      (value: Array<unknown>) => {
        (this as unknown as Vue).$nextTick(() => {
          requestAnimationFrame(() => {
            updateLocation(value?.length);
            requestAnimationFrame(() => {
              updateLocation(value?.length);
            });
          });
        });
      },
      { deep: true }
    );

    return {
      updateLocation,
    };
  }

  isSimple(value: unknown): boolean {
    if (!isDefined(value)) {
      return true;
    }
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
  }

  isArray(value: unknown): boolean {
    return Array.isArray(value);
  }

  isString(value: unknown): boolean {
    return typeof value === 'string';
  }

  isNumber(value: unknown): boolean {
    return typeof value === 'number' && !isNaN(value);
  }

  isObject(value: unknown): boolean {
    if (!isDefined(value)) {
      return false;
    }
    return typeof value === 'object';
  }

  isEmpty(value: unknown): boolean {
    if (!isDefined(value)) {
      return true;
    }
    if (this.isArray(value)) {
      return (value as Array<unknown>).length === 0;
    }
    if (this.isObject(value)) {
      return objects.isEmpty(value as Record<string, unknown>);
    }
    return true;
  }

  toArray(value: TElement | Array<TElement>): Array<TElement> {
    if (!isDefined(value) || (value as unknown as string) === '') {
      return [];
    }
    if (Array.isArray(value)) {
      return [...value];
    }
    return [value];
  }

  deepValueOfItem(item: unknown, prop: string): string | number {
    if (this.isSimple(item)) {
      return item as string | number;
    }
    if (this.isObject(item)) {
      return objects.deepValueGetter(item as Record<string, unknown>, prop) as number | string;
    }
    return null;
  }
}
