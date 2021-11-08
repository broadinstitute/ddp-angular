import { Pipe, PipeTransform } from '@angular/core';
import { NameValue } from '../utils/name-value.model';

@Pipe({
  name: 'dashboardDateSort'
})
export class DashboardDateSortPipe implements PipeTransform {
  transform(array: NameValue[], args: string): NameValue[] {
    const reA = /[^a-zA-Z]/g;
    const reN = /[^0-9]/g;

    array.sort((a, b) => {
      const aA = a.name.replace(reA, '');
      const bA = b.name.replace(reA, '');
      if (aA === bA) {
        const aN = parseInt(a.name.replace(reN, ''), 10);
        const bN = parseInt(b.name.replace(reN, ''), 10);
        return aN === bN ? 0 : aN > bN ? -1 : 1;
      } else {
        return aA > bA ? -1 : 1;
      }
    });
    return array;
  }
}
