import { Pipe, PipeTransform } from '@angular/core';
import { StringsHelper } from '../utility/stringsHelper';

@Pipe({
    name: 'searchHighlight'
})
export class SearchHighlightPipe implements PipeTransform {
    /* eslint-disable no-useless-escape */
    transform(text: string, search: string, ignoredSymbols?: string[]): string {
        const normalizedSearch = StringsHelper.normalizeString(search, ignoredSymbols || []);

        // copied from
        // https://stackoverflow.com/questions/49653410/mat-autocomplete-filter-to-hightlight-partial-string-matches#answer-49670236
        const pattern = normalizedSearch
            .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
            .split(' ')
            .filter(t => t.length > 0)
            .join('|');
        const regex = new RegExp(pattern, 'gi');

        return search ? text.replace(regex, match => `<u>${match}</u>`) : text;
    }
}
