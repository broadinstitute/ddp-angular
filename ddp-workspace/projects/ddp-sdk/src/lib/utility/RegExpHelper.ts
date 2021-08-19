export class RegExpHelper {

    /* The method returns a RegExp:
    *  if text includes symbols to substitute, they match with any of `substitutableSymbols` or `replaceValue`(a space by default),
    *  (case/space insensitive)
    *  e.g.
    *  regExp = createSubstitutableSymbolsRegExp('asd / zxc', ['-', '/'], ' ');
    *  regExp.test('asd zxc') = true;
    *  regExp.test('asd / zxc') = true;
    *  regExp.test('asd -    zxc') = true;
    */
    static createSubstitutableSymbolsRegExp(text: string, substitutableSymbols: string[] = [], replaceValue = ' '): RegExp {
        const anyAmountOfSpacesRegExp = '\\s*';
        if (substitutableSymbols.includes(text) || !substitutableSymbols.some(s => text.includes(s))) {
            // return same text but space/case insensitive
            return new RegExp(
                RegExpHelper.replaceEmptySpaces(text, anyAmountOfSpacesRegExp),
                'gi'
            );
        }

        const escapedSubstitutableSymbols = substitutableSymbols.map(symbol => RegExpHelper.escapeRegExp(symbol));
        const substitutableSymbolsRegExp = new RegExp(escapedSubstitutableSymbols.join('|'), 'g');
        const pattern = RegExpHelper.replaceEmptySpaces(text, '')
            .replace(
                substitutableSymbolsRegExp,
                [anyAmountOfSpacesRegExp, '[', ...escapedSubstitutableSymbols, replaceValue, ']', anyAmountOfSpacesRegExp].join('')
            );
        return new RegExp(pattern, 'gi'); // case-insensitive
    }

    static replaceEmptySpaces(text: string, replaceValue = ' '): string {
        return text.replace(/ +/g, replaceValue);
    }

    static escapeRegExp(text): string {
        return text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    }
}
