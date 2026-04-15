export default class UnitService {
  static pixelRound(val: number) {
    return Math.round(val * devicePixelRatio) / devicePixelRatio;
  }

  static convertToUnit(val: string | number): string {
    if (typeof val === 'string') {
      return val;
    }
    return `${val}px`;
  }

  static leaderZero(val: string | number): string {
    return ('0' + val).slice(-2);
  }

  static stringToTime(val: string): [number, number] {
    if (!/\d\d:\d\d/.test(val)) {
      return [0, 0];
    }
    const [h, m] = val.split(':');
    return [Number(h), Number(m)];
  }

  static timeToISO(value: string) {
    let v: string = null;
    if (/am/.test(value)) {
      v = value.replace(/am/g, '').trim();
      const [h, m] = this.stringToTime(v);
      const _h = h === 12 ? '00' : this.leaderZero(h);
      const _m = this.leaderZero(m);
      return `${_h}:${_m}`;
    }
    if (/pm/.test(value)) {
      v = value.replace(/pm/g, '').trim();
      const [h, m] = this.stringToTime(v);
      const _h = h < 12 ? h + 12 : this.leaderZero(h);
      const _m = this.leaderZero(m);
      return `${_h}:${_m}`;
    }
    return value;
  }
}
