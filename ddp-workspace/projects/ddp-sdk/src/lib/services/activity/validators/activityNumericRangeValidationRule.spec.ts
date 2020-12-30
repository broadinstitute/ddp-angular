import { ActivityNumericRangeValidationRule } from './activityNumericRangeValidationRule';
import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';

let validator: ActivityNumericRangeValidationRule;
const MESSAGE = 'Your answer is out of range!';

describe('ActivityNumericRangeValidationRule', () => {
    it('should initialize validator', () => {
        const question = {} as ActivityQuestionBlock<any>;
        validator = new ActivityNumericRangeValidationRule(question);
        expect(validator).toBeDefined();
    });

    it('should return true if the validator`s range wasn`t set', () => {
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = 50;
        validator = new ActivityNumericRangeValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return true if the answer is empty', () => {
        const MIN = 0;
        const MAX = 100;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = null;
        validator = new ActivityNumericRangeValidationRule(question, MIN, MAX);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return true if the answer is between min and max(positive range)', () => {
        const MIN = 0;
        const MAX = 100;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = 50;
        validator = new ActivityNumericRangeValidationRule(question, MIN, MAX);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return true if the answer is between min and max(negative range)', () => {
        const MIN = -100;
        const MAX = -1;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = -50;
        validator = new ActivityNumericRangeValidationRule(question, MIN, MAX);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return true if the answer is maximum acceptable number, inclusive', () => {
        const MIN = 0;
        const MAX = 100;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = 100;
        validator = new ActivityNumericRangeValidationRule(question, MIN, MAX);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return true if the answer is minimum acceptable number, inclusive', () => {
        const MIN = 0;
        const MAX = 100;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = 0;
        validator = new ActivityNumericRangeValidationRule(question, MIN, MAX);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return true if the answer is minimum acceptable number, inclusive(MAX wasn`t set)', () => {
        const MIN = 1;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = 1;
        validator = new ActivityNumericRangeValidationRule(question, MIN);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return true if the answer is maximum acceptable number, inclusive(MIN wasn`t set)', () => {
        const MAX = 100;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = 100;
        validator = new ActivityNumericRangeValidationRule(question, null, MAX);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return false if the answer is less then min', () => {
        const MIN = 0;
        const MAX = 100;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = -1;
        validator = new ActivityNumericRangeValidationRule(question, MIN, MAX);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });

    it('should return false if the answer is bigger then max', () => {
        const MIN = 0;
        const MAX = 100;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = 101;
        validator = new ActivityNumericRangeValidationRule(question, MIN, MAX);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });
});
