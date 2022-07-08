import { CharactersRemainingPipe } from './characters-remaining.pipe';

describe('CharactersRemainingPipe', () => {
    let pipe: CharactersRemainingPipe;
    const maxLength = 350;

    beforeEach(() => {
        pipe = new CharactersRemainingPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('return "350 characters remaining" if value is falsy', () => {
        const value = null;
        const expectedValue = '350 characters remaining';
        expect(pipe.transform(value, maxLength)).toBe(expectedValue);
    });

    it('value should be "340 characters remaining"  if value has length of 10', () => {
        const value = '0123456789';
        const expectedValue = '340 characters remaining';

        expect(pipe.transform(value, maxLength)).toBe(expectedValue);
    });
});
