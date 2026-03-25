export default class ClassService {
  constructor(public classname: string) {
    //
  }

  get rootclass() {
    return this.classname;
  }

  submodule(value: string) {
    return `${this.classname}__${value}`;
  }

  modificator(value: string) {
    return `${this.classname}--${value}`;
  }
}
