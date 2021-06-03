import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'invitation'
})
export class InvitationPipe implements PipeTransform {
    transform(code: string, chunk: number = 4, separator: string = ' - '): string {
        // new format of invitation code
        if (code.length === 12) {
            const regexp = new RegExp(`.{1,${chunk}}`, 'g');
            return code.match(regexp).join(separator);
        }

        // don't do anything with old formats since they already contain dashes
        return code;
    }
}
