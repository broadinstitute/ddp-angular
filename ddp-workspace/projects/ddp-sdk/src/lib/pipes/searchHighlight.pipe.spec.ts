import { SearchHighlightPipe } from './searchHighlight.pipe';

describe('SearchHighlightPipe test', () => {
    const pipe = new SearchHighlightPipe();

    it('should create pipe', () => {
        expect(pipe).toBeTruthy();
    });

    it('should not change the string if no matches were found', () => {
        expect(pipe.transform('text for search', 'fghsf')).toBe('text for search');
    });

    it('should update the string if matches were found', () => {
        expect(pipe.transform('text for-search', 'for-search')).toBe('text <u>for-search</u>');
    });
});
