import { ActivityPicklistQuestionBlock } from 'ddp-sdk';
import { ActivityStrictMatchValidationRule } from './activityStrictMatchValidationRule';

describe('ActivityStrictMatchValidationRule', () => {
    it('should initialize validator', () => {
        const block = {} as ActivityPicklistQuestionBlock;
        const validator = new ActivityStrictMatchValidationRule(block);
        expect(validator).toBeDefined();
    });

    it('should return true if there is no answer', () => {
        const block = { answer: null } as ActivityPicklistQuestionBlock;
        const validator = new ActivityStrictMatchValidationRule(block);
        expect(validator.recalculate()).toBeTrue();
        expect(validator.result).toBeNull();
    });

    it('should return true if answer is empty list', () => {
        const block = { answer: [] } as ActivityPicklistQuestionBlock;
        const validator = new ActivityStrictMatchValidationRule(block);
        expect(validator.recalculate()).toBeTrue();
        expect(validator.result).toBeNull();
    });

    it('should return true if answer has stableId', () => {
        const block = { answer: [{ stableId: 'OTHER' }] } as ActivityPicklistQuestionBlock;
        const validator = new ActivityStrictMatchValidationRule(block);
        expect(validator.recalculate()).toBeTrue();
        expect(validator.result).toBeNull();
    });

    it('should return false if answer has no stableId', () => {
        const block = { answer: [{ stableId: null }], question: 'some control' } as ActivityPicklistQuestionBlock;
        const validator = new ActivityStrictMatchValidationRule(block);
        expect(validator.recalculate()).toBeFalse();
        expect(validator.result).toEqual({ message: 'SDK.Validators.Autocomplete', params: { control: 'some control' } });
    });
});
