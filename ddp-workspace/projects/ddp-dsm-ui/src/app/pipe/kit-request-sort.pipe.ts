import { Pipe, PipeTransform } from '@angular/core';
import { KitRequest } from '../shipping/shipping.model';

@Pipe({
  name: 'kitRequestSort'
})
export class KitRequestSortPipe implements PipeTransform {
  transform(array: KitRequest[], sortField: string, sortDir: string): KitRequest[] {
    const reA = /[^a-zA-Z]/g;
    const reN = /[^0-9]/g;

    array.sort((a, b) => {
      let asc = 1;
      if (sortDir !== 'asc') {
        asc = -1;
      }
      if (sortField === 'default') {
        if (a != null && b != null && a.getID() != null && b.getID() != null) {
          const aA = a.getID().replace(reA, '');
          const bA = b.getID().replace(reA, '');

          if (aA === bA) {
            const aN = parseInt(a.getID().replace(reN, ''), 10);
            const bN = parseInt(b.getID().replace(reN, ''), 10);
            if (a.express && b.express) {
              return aN === bN ? 0 : aN > bN ? 1 * asc : -1 * asc;
            }
            if (a.express) {
              return -1;
            }
            if (b.express) {
              return 1;
            }
            return aN === bN ? 0 : aN > bN ? 1 * asc : -1 * asc;
          } else {
            if (a.express) {
              return -1;
            }
            if (b.express) {
              return 1;
            }
            return aA > bA ? 1 * asc : -1 * asc;
          }
        }
      }
    });
    return array;
  }
}
