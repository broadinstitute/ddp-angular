export class DateField {

  constructor(public month: string, public year: string, public day: string) {
    this.month = month;
    this.year = year;
    this.day = day;
  }

  static parse(json): DateField {
    return new DateField(json.month, json.year, json.day);
  }
}
