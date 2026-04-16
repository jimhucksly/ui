import { Prop, Vue } from 'vue-property-decorator';

enum StepType {
  Completed = 'completed',
  Active = 'active',
  Scheduled = 'scheduled',
}

enum StepResult {
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

interface IStep {
  uid?: string;
  type: StepType;
  result: StepResult;
  title: string;
  subtitle?: string;
  disabled?: boolean;
  tooltip?: string;
  tooltipProps?: Record<string, unknown>;
}

/**
 * @displayName ld-switch
 */
export default class StepComponent extends Vue {
  @Prop({ type: Array, default: (): Array<IStep> => [] }) items: Array<IStep>;
  @Prop({ type: String, default: 'h' }) direction: 'v' | 'h';

  get hasItems(): boolean {
    return Array.isArray(this.items) && this.items.length > 0;
  }

  get internalItems(): Array<IStep> {
    if (!this.hasItems) {
      return [];
    }
    return this.items.map(i => {
      i.uid = uniqueID(6) as string;
      return i;
    });
  }

  get myDirection(): string {
    return this.direction === 'v' ? 'vertical' : 'horizontal';
  }

  get completedType(): StepType {
    return StepType.Completed;
  }

  get activeType(): StepType {
    return StepType.Active;
  }

  get scheduledType(): StepType {
    return StepType.Scheduled;
  }

  get successResult(): StepResult {
    return StepResult.Success;
  }

  get warningResult(): StepResult {
    return StepResult.Warning;
  }

  get errorResult(): StepResult {
    return StepResult.Error;
  }
}
