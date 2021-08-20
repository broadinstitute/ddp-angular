import { RegExpHelper } from './RegExpHelper';

describe('RegExpHelper', () => {
    it('should create a regexp for a text without substitutableSymbols', () => {
        const regex = RegExpHelper.createSubstitutableSymbolsRegExp('just   text');
        expect(regex).toEqual(/just text/gi);
        expect('just text').toMatch(regex);
    });

    it('should create a regexp for a text which contains only substitutableSymbols', () => {
        const regex = RegExpHelper.createSubstitutableSymbolsRegExp('-', ['-', '/']);
        expect(regex).toEqual(/\-/gi);
        expect(' - ').toMatch(regex);
    });

    it('should create a regexp for a text with substitutableSymbols', () => {
        const regex = RegExpHelper.createSubstitutableSymbolsRegExp('B  -  cell', ['-', '/']);
        expect(regex).toEqual(/B\s*[\-\/ ]\s*cell/gi);
        expect('B-cell').toMatch(regex);
        expect('B cell').toMatch(regex);
    });
});
