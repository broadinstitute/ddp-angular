import { ActivityPicklistQuestionBlock } from 'ddp-sdk';

describe('ActivityPicklistQuestionBlock', () => {
    describe('convertToString', () => {
        it('returns stableId for single selected picklist', () => {
            const block = new ActivityPicklistQuestionBlock();
            expect(block.convertToString([{ stableId: 'value1', detail: null }])).toBe('value1');
        });

        it('returns detail for single selected picklist', () => {
            const block = new ActivityPicklistQuestionBlock();
            expect(block.convertToString([{ stableId: 'OTHER', detail: 'custom' }])).toBe('OTHER:custom');
        });

        it('returns correct sorted string for multiple selected picklist', () => {
            const block = new ActivityPicklistQuestionBlock();
            expect(block.convertToString([
                { stableId: 'value2', detail: null },
                { stableId: 'OTHER', detail: 'custom1' },
                { stableId: 'value1', detail: null }]))
                .toBe('OTHER:custom1;value1;value2');
        });
    });
});
