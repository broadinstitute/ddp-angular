import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'noData'
})

export class NoDataPipe implements PipeTransform {
  transform(value: any): string {
    const nonBreakingSpace = String.fromCharCode(160);
    return (value === 0 ? value.toString() : value) || nonBreakingSpace;
  }
}
