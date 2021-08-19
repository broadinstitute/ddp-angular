import { Pipe, PipeTransform } from '@angular/core';
import { RegExpHelper } from '../utility/RegExpHelper';

@Pipe({
    name: 'searchHighlight'
})
export class SearchHighlightPipe implements PipeTransform {
    transform(text: string, search: string | RegExp): string {
        let regex: RegExp;
        if (!search) return text;

        if (typeof search === 'string') {
            // copied from
            // https://stackoverflow.com/questions/49653410/mat-autocomplete-filter-to-hightlight-partial-string-matches#answer-49670236
            const pattern = RegExpHelper.escapeRegExp(search)
                .split(' ')
                .filter(t => t.length > 0)
                .join('|');
            regex = new RegExp(pattern, 'gi');
        } else {
            regex = search;
        }

        return text.replace(regex, match => `<u>${match}</u>`);
    }
}
