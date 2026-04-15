export interface IToasted {
  success: (title: string, text?: string) => void;
  info: (title: string, text?: string) => void;
  error: (title: string, text?: string) => void;
  warning: (title: string, text?: string) => void;
}
