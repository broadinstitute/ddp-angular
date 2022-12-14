import {Pipe, PipeTransform} from '@angular/core';
import {DateRangeErrorMessages} from './constants/dateRange-error.messages';

@Pipe({
  name: 'DateRangeError'
})
export class DateRangeErrorPipe implements PipeTransform {
  transform(errorKey: string, dateType: string): string {
    return DateRangeErrorMessages[dateType][errorKey] || '';
  }
}
