import {Pipe, PipeTransform} from '@angular/core';


type expectedValueType = string | number | boolean;

@Pipe({
  name: 'noData'
})
export class NoDataPipe implements PipeTransform {
  transform(value: expectedValueType): string {
    const nonBreakingSpace = String.fromCharCode(160);
    return value || value === 0 ? value.toString() : nonBreakingSpace;
  }
}
