import { ActivityPicklistQuestionBlock } from '../../../models/activity/activityPicklistQuestionBlock';
import { ActivityOptionsAmountValidationRule } from './activityOptionsAmountValidationRule';

let validator: ActivityOptionsAmountValidationRule;
const MESSAGE = `Your answer doesn't match length rule`;

describe('ActivityOptionsAmountValidationRule', () => {
    it('should initialize validator', () => {
        const question = new ActivityPicklistQuestionBlock();
        validator = new ActivityOptionsAmountValidationRule(question, 1, 2);
        expect(validator).toBeDefined();
    });

    it('should return true if answers amount fits validation rules', () => {
        const MIN_LENGTH = 0;
        const MAX_LENGTH = 4;
        const question = new ActivityPicklistQuestionBlock();
        question.answer = null;
        validator = new ActivityOptionsAmountValidationRule(question, MIN_LENGTH, MAX_LENGTH);
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
        question.answer = [{
            stableId: 'TEST',
            detail: 'TEST'
        }];
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it(`should return false if answers amount doesn't fit validation rules`, () => {
        const MIN_LENGTH = 2;
        const MAX_LENGTH = 3;
        const question = new ActivityPicklistQuestionBlock();
        question.answer = null;
        validator = new ActivityOptionsAmountValidationRule(question, MIN_LENGTH, MAX_LENGTH);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
        question.answer = [{
            stableId: 'TEST',
            detail: 'TEST'
        }];
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
        question.answer = [{
            stableId: 'TEST',
            detail: 'TEST'
        }, {
            stableId: 'TEST',
            detail: 'TEST'
        },
        {
            stableId: 'TEST',
            detail: 'TEST'
        },
        {
            stableId: 'TEST',
            detail: 'TEST'
        }];
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });
});
