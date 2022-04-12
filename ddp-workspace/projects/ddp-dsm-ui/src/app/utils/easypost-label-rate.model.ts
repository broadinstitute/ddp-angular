export class EasypostLabelRate {
  constructor(public express: string, public normal: string) {
  }

  static parse(json): EasypostLabelRate {
    return new EasypostLabelRate(json.express, json.normal);
  }
}
