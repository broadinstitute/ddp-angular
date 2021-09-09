import { ActivityDateQuestionBlock } from 'ddp-sdk';

describe('ActivityDateQuestionBlock', () => {
    describe('convertToString', () => {
        it('returns correct string for date w/o day', () => {
            const block = new ActivityDateQuestionBlock();
            expect(block.convertToString({ day: null, month: 2, year: 1991 })).toBe(`day:;month:2;year:1991`);
        });

        it('returns correct string for date w/o day and month', () => {
            const block = new ActivityDateQuestionBlock();
            expect(block.convertToString({ day: null, month: null, year: 1991 })).toBe(`day:;month:;year:1991`);
        });

        it('returns correct string for date w/o year', () => {
            const block = new ActivityDateQuestionBlock();
            expect(block.convertToString({ day: 1, month: 1, year: null })).toBe(`day:1;month:1;year:`);
        });

        it('returns correct string for date w/o year and month', () => {
            const block = new ActivityDateQuestionBlock();
            expect(block.convertToString({ day: 1, month: null, year: null })).toBe(`day:1;month:;year:`);
        });

        it('returns correct string for date', () => {
            const block = new ActivityDateQuestionBlock();
            expect(block.convertToString({ day: 1, month: 2, year: 1991 })).toBe(`day:1;month:2;year:1991`);
        });
    });
});
