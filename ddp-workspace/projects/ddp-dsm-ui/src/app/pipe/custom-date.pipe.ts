import { Pipe, PipeTransform } from '@angular/core';

import { Utils } from '../utils/utils';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateFormatPipe',
})
export class DateFormatPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value != null) {
      if (value === 'N/A') {
        console.log(value);
        return value;
      }
      if (value.length === 10) {
        const tmp = Utils.getDate(value);
        if (tmp instanceof Date) {
          return Utils.getDateFormatted(tmp, args);
        }
      } else if (value.length === 7) {
        return Utils.getPartialFormatDate(value, args);
      } else if (typeof value === 'number') {
        const date = new Date(value);
        return new DatePipe('en-US').transform(date, Utils.DATE_STRING_IN_CVS);
      }
    }
    return value;
  }
}
