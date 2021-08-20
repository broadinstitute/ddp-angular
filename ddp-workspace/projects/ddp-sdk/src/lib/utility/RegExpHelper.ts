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
                RegExpHelper.replaceEmptySpaces(RegExpHelper.escapeRegExp(text)),
                'gi'
            );
        }

        const escapedSubstitutableSymbols = substitutableSymbols.map(symbol => `\\${symbol}`);
        const substitutableSymbolsRegExp = new RegExp(escapedSubstitutableSymbols.join('|'), 'g');

        const pattern = RegExpHelper.escapeRegExp(
                RegExpHelper.replaceEmptySpaces(text, ''),
                // have issues with incorrect handling it in text, escaping substitutableSymbols twice due to the regex creating.
                // Let's avoid escaping them here.
                substitutableSymbols
            )
            .replace(
                substitutableSymbolsRegExp,
                // replacing any of substitutableSymbols in origin text with a range of all substitutableSymbols and a replaceValue,
                // surrounded with any amount of spaces
                // e.g. substitutableSymbols = ['-', '/'], text = 'asd -   123'
                // the regex will be /asd\s*[-/ ]\s*123/
                [anyAmountOfSpacesRegExp, '[', ...escapedSubstitutableSymbols, replaceValue, ']', anyAmountOfSpacesRegExp].join('')
            );
        return new RegExp(pattern, 'gi'); // case-insensitive
    }

    static replaceEmptySpaces(text: string, replaceValue = ' '): string {
        return text.replace(/ +/g, replaceValue);
    }

    static escapeRegExp(text: string, exceptionSymbols?: string[]): string {
        return text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, (match: string) => {
            return (exceptionSymbols && exceptionSymbols.includes(match)) ? match : `\\${match}`;
        });
    }
}
