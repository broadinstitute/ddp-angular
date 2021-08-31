import { ActivityPicklistQuestionBlock } from 'ddp-sdk';

describe('ActivityPicklistQuestionBlock', () => {
    describe('isUniqueValues', () => {
        it('returns true if values are unique for single selected picklist', () => {
            const block = new ActivityPicklistQuestionBlock();
            expect(block.isUniqueValues([
                [{ stableId: 'value1', detail: null }],
                [{ stableId: 'value2', detail: null }],
                [{ stableId: 'value3', detail: null }]])).toBeTrue();
        });

        it('returns false if values are not unique for single selected picklist', () => {
            const block = new ActivityPicklistQuestionBlock();
            expect(block.isUniqueValues([
                [{ stableId: 'value1', detail: null }],
                [{ stableId: 'value2', detail: null }],
                [{ stableId: 'value1', detail: null }]])).toBeFalse();
        });

        it('returns true if values are unique for single selected picklist if one answer is custom', () => {
            const block = new ActivityPicklistQuestionBlock();
            expect(block.isUniqueValues([
                [{ stableId: 'value1', detail: null }],
                [{ stableId: 'value2', detail: null }],
                [{ stableId: 'OTHER', detail: 'custom' }]])).toBeTrue();
        });

        it('returns false if values are not unique for single selected picklist if one answer is custom', () => {
            const block = new ActivityPicklistQuestionBlock();
            expect(block.isUniqueValues([
                [{ stableId: 'value1', detail: null }],
                [{ stableId: 'value2', detail: null }],
                [{ stableId: 'OTHER', detail: 'value1' }]])).toBeFalse();
        });

        it('returns true if values are unique for single selected picklist if all answers are custom', () => {
            const block = new ActivityPicklistQuestionBlock();
            expect(block.isUniqueValues([
                [{ stableId: 'OTHER', detail: 'custom1' }],
                [{ stableId: 'OTHER', detail: 'custom2' }],
                [{ stableId: 'OTHER', detail: 'custom3' }],
            ])).toBeTrue();
        });

        it('returns true if amount of selected values is different for multiple selected picklist', () => {
            const block = new ActivityPicklistQuestionBlock();
            expect(block.isUniqueValues([
                [{ stableId: 'value1', detail: null }, { stableId: 'value2', detail: null }, { stableId: 'value3', detail: null }],
                [{ stableId: 'value1', detail: null }, { stableId: 'value2', detail: null }]
            ])).toBeTrue();
        });

        it('returns true if selected values are unique for multiple selected picklist', () => {
            const block = new ActivityPicklistQuestionBlock();
            expect(block.isUniqueValues([
                [{ stableId: 'value1', detail: null }, { stableId: 'value2', detail: null }, { stableId: 'value3', detail: null }],
                [{ stableId: 'value1', detail: null }, { stableId: 'OTHER', detail: 'custom1' }, { stableId: 'value2', detail: null }]
            ])).toBeTrue();
        });

        it('returns false if selected values are not unique for multiple selected picklist', () => {
            const block = new ActivityPicklistQuestionBlock();
            expect(block.isUniqueValues([
                [{ stableId: 'value1', detail: null }, { stableId: 'value2', detail: null }, { stableId: 'value3', detail: null }],
                [{ stableId: 'value1', detail: null }, { stableId: 'value3', detail: null }, { stableId: 'value2', detail: null }]
            ])).toBeFalse();
        });
    });
});
