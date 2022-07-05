import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'charactersRemaining',
})
export class CharactersRemainingPipe implements PipeTransform {
    transform(value: string, maxLength: number): unknown {
        const length = value?.length ? value.length : 0;
        return `${maxLength - length} characters remaining`;
    }
}
