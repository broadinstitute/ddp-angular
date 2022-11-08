import {Pipe, PipeTransform} from '@angular/core';
import {DateRangeErrorMessages} from './constants/dateRange-error.messages';

@Pipe({
  name: 'dateError'
})
export class DateErrorPipe implements PipeTransform {
  transform(errorKey: string, dateType?: string): string {
    return DateRangeErrorMessages[dateType][errorKey] || '';
  }
}
