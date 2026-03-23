class ClassHelper {
  constructor(public root: string) {
    //
  }

  sub(value: string): string {
    return `${this.root}__${value}`;
  }

  mod(value: string): string {
    return `${this.root}--${value}`;
  }
}

export { ClassHelper };
