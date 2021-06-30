import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchHighlight'
})
export class SearchHighlightPipe implements PipeTransform {
    transform(text: string, search: string): string {
        const pattern = search
            .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
            .split(' ')
            .filter(t => t.length > 0)
            .join('|');
        const regex = new RegExp(pattern, 'gi');

        return search ? text.replace(regex, match => `<u>${match}</u>`) : text;
    }
}
