import { ActivityDateQuestionBlock } from 'ddp-sdk';

describe('ActivityDateQuestionBlock', () => {
    describe('isUniqueValues', () => {
        it('returns true if days are unique', () => {
            const block = new ActivityDateQuestionBlock();
            expect(block.isUniqueValues([
                { day: 1, month: 2, year: 1991 },
                { day: 5, month: 2, year: 1991 },
                { day: 10, month: 2, year: 1991 }])).toBeTrue();
        });

        it('returns true if months are unique', () => {
            const block = new ActivityDateQuestionBlock();
            expect(block.isUniqueValues([
                { day: 1, month: 2, year: 1991 },
                { day: 1, month: 4, year: 1991 },
                { day: 1, month: 5, year: 1991 }])).toBeTrue();
        });

        it('returns true if years are unique', () => {
            const block = new ActivityDateQuestionBlock();
            expect(block.isUniqueValues([
                { day: 1, month: 1, year: 1991 },
                { day: 1, month: 1, year: 1992 },
                { day: 1, month: 1, year: 1993 }])).toBeTrue();
        });

        it('returns false if days are not unique', () => {
            const block = new ActivityDateQuestionBlock();
            expect(block.isUniqueValues([
                { day: 1, month: 2, year: 1991 },
                { day: 5, month: 2, year: 1991 },
                { day: 1, month: 2, year: 1991 }])).toBeFalse();
        });
    });
});
