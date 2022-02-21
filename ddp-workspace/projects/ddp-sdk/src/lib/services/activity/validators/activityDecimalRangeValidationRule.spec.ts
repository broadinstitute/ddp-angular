import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { ActivityDecimalRangeValidationRule } from './activityDecimalRangeValidationRule';

let validator: ActivityDecimalRangeValidationRule;
const MESSAGE = 'Your answer is out of range!';

describe('ActivityDecimalRangeValidationRule', () => {
    it('should initialize validator', () => {
        const question = {} as ActivityQuestionBlock<any>;
        validator = new ActivityDecimalRangeValidationRule(question);
        expect(validator).toBeDefined();
    });

    it('should return true if the validator`s range is not set', () => {
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {value: 157, scale: 2};
        validator = new ActivityDecimalRangeValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return true if the answer is empty', () => {
        const MIN = 1;
        const MAX = 3;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = null;
        validator = new ActivityDecimalRangeValidationRule(question, MIN, MAX);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return true if the answer is between min and max(positive range)', () => {
        const MIN = 1;
        const MAX = 3;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {value: 2345, scale: 3};
        validator = new ActivityDecimalRangeValidationRule(question, MIN, MAX);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return true if the answer is between min and max(negative range)', () => {
        const MIN = -5;
        const MAX = -1;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {value: -200, scale: 2};
        validator = new ActivityDecimalRangeValidationRule(question, MIN, MAX);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return true if the answer is maximum acceptable number, inclusive', () => {
        const MIN = 1;
        const MAX = 3;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {value: 300, scale: 2};
        validator = new ActivityDecimalRangeValidationRule(question, MIN, MAX);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return true if the answer is minimum acceptable number, inclusive', () => {
        const MIN = 1;
        const MAX = 3;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {value: 100, scale: 2};
        validator = new ActivityDecimalRangeValidationRule(question, MIN, MAX);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return true if the answer is minimum acceptable number, inclusive(MAX wasn`t set)', () => {
        const MIN = 1;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {value: 100, scale: 2};
        validator = new ActivityDecimalRangeValidationRule(question, MIN);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return true if the answer is maximum acceptable number, inclusive(MIN wasn`t set)', () => {
        const MAX = 3;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {value: 300, scale: 2};
        validator = new ActivityDecimalRangeValidationRule(question, null, MAX);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return false if the answer is less then min', () => {
        const MIN = 1;
        const MAX = 3;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {value: -100, scale: 2};
        validator = new ActivityDecimalRangeValidationRule(question, MIN, MAX);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });

    it('should return false if the answer is bigger then max', () => {
        const MIN = 1;
        const MAX = 3;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {value: 400, scale: 2};
        validator = new ActivityDecimalRangeValidationRule(question, MIN, MAX);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });
});
