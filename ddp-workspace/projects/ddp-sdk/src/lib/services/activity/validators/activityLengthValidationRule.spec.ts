import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { ActivityLengthValidationRule } from './activityLengthValidationRule';

let validator: ActivityLengthValidationRule;
const MESSAGE = `Your answer doesn't match length rule`;

describe('ActivityLengthValidationRule', () => {
    it('should initialize validator', () => {
        const question = {} as ActivityQuestionBlock<any>;
        validator = new ActivityLengthValidationRule(question);
        expect(validator).toBeDefined();
    });

    it('should return true if length is not limited', () => {
        const question = {} as ActivityQuestionBlock<string>;
        question.answer = null;
        validator = new ActivityLengthValidationRule(question);
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
        question.answer = '';
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
        question.answer = `Super long string Super long string Super long string Super long string Super long string Super long string 
        Super long string Super long string Super long string Super long string Super long string Super long string Super long string 
        Super long string Super long string Super long string Super long string Super long string Super long string Super long string 
        Super long string Super long string Super long string Super long string Super long string Super long string Super long string`;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should set min length limit', () => {
        const MIN_LENGTH = 2;
        const question = {} as ActivityQuestionBlock<string>;
        question.answer = null;
        validator = new ActivityLengthValidationRule(question, MIN_LENGTH);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
        question.answer = '';
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
        question.answer = 'answer';
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should set max length limit', () => {
        const MAX_LENGTH = 10;
        const question = {} as ActivityQuestionBlock<string>;
        question.answer = null;
        validator = new ActivityLengthValidationRule(question, null, MAX_LENGTH);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
        question.answer = '';
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
        question.answer = 'answer';
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
        question.answer = 'answer answer';
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });

    it('should set min and max length limit', () => {
        const MIN_LENGTH = 2;
        const MAX_LENGTH = 10;
        const question = {} as ActivityQuestionBlock<string>;
        question.answer = null;
        validator = new ActivityLengthValidationRule(question, MIN_LENGTH, MAX_LENGTH);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
        question.answer = 'q';
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
        question.answer = 'answer';
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
        question.answer = 'answer answer';
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });
});
