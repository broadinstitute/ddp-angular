import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'noData'
})

export class NoDataPipe implements PipeTransform {
  transform(value: any): string {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = (typeof value === "number" ? String(value) : value) || '&nbsp;';
    return tempElement.innerText;
  }
}
