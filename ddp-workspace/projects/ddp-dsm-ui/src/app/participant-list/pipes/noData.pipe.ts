import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'noData'
})

export class NoDataPipe implements PipeTransform {
  transform(value: any): string {
    return (value === 0 ? String(value) : value) || String.fromCharCode(160);
  }
}
