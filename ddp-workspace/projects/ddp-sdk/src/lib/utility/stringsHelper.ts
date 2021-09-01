export class StringsHelper {
    static normalizeString(text: string, ignoredSymbols: string[], separator: string = ' '): string {
        return ignoredSymbols.reduce((acc, symbol) => {
            return acc.split(symbol)
                .map(word => word.trim())
                .join(separator);
        }, text.toLowerCase());
    }

    static isIncluded(text: string, query: string, separator: string = ' '): boolean {
        return query.split(separator)
            .every(word => text.includes(word));
    }
}
