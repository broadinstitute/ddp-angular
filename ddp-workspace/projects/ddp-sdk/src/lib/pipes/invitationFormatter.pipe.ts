import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'invitation'
})
export class InvitationPipe implements PipeTransform {
    transform(code: string, chunk: number = 4, separator: string = ' - '): string {
        const regexp = new RegExp(`.{1,${chunk}}`, 'g');
        return code.match(regexp).join(separator);
    }
}
