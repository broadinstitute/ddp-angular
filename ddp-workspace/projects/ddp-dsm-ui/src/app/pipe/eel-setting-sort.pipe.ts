import { Pipe, PipeTransform } from '@angular/core';
import { EmailSettings } from '../eel-setting/eel-setting.model';

@Pipe({
  name: 'emailSettingSort'
})
export class EelSettingSortPipe implements PipeTransform {
  transform(array: Array<EmailSettings>, args: string): Array<EmailSettings> {
    const reA = /[^a-zA-Z-]/g;
    const reN = /[^0-9- ]/g;

    array.sort((a, b) => {
      if (a.workflowId != null && b.workflowId != null) {
        const aA = a.workflowId.replace(reA, '');
        const bA = b.workflowId.replace(reA, '');
        if (aA === bA) {
          const aN = parseInt(a.workflowId.replace(reN, ''), 10);
          const bN = parseInt(b.workflowId.replace(reN, ''), 10);
          return aN === bN ? 0 : aN > bN ? 1 : -1;
        } else {
          return aA > bA ? 1 : -1;
        }
      }
    });
    return array;
  }
}
