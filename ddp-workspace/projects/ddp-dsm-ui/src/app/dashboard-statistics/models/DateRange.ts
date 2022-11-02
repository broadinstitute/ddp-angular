import {DateRangeModel} from "./DateRange.model";

export class DateRange implements DateRangeModel {
  constructor(public endDate: string, public startDate: string) {
  }
}
