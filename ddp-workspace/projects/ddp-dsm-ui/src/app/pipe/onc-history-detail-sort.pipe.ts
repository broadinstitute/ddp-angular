import { Pipe, PipeTransform } from '@angular/core';
import { OncHistoryDetail } from '../onc-history-detail/onc-history-detail.model';

@Pipe({
  name: 'oncHistoryDetailSort',
})
export class OncHistoryDetailSortPipe implements PipeTransform {
  transform(array: OncHistoryDetail[], trigger: number): OncHistoryDetail[] {
    const reA = /[^a-zA-Z]/g;
    const reN = /[^0-9]/g;

    array.sort((a, b) => {
      if (a.datePX != null && b.datePX != null) {
        const aA = a.datePX.replace(reA, '');
        const bA = b.datePX.replace(reA, '');
        if (aA === bA) {
          const aN = parseInt(a.datePX.replace(reN, ''), 10);
          const bN = parseInt(b.datePX.replace(reN, ''), 10);
          return aN === bN ? 0 : aN > bN ? 1 : -1;
        } else {
          return aA > bA ? 1 : -1;
        }
      }
      if (b.oncHistoryDetailId == null) {
        return -1;
      }
      if (a.datePX == null) {
        return 1;
      }
      if (b.datePX == null) {
        return -1;
      }
    });
    return array;
  }
}
