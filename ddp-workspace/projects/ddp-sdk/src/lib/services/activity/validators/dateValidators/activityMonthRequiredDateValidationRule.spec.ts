import { ActivityQuestionBlock } from '../../../../models/activity/activityQuestionBlock';
import { ActivityDateQuestionBlock } from '../../../../models/activity/activityDateQuestionBlock';
import { DateField } from '../../../../models/activity/dateField';
import { ActivityMonthRequiredDateValidationRule } from './activityMonthRequiredDateValidationRule';

let validator: ActivityMonthRequiredDateValidationRule;
const MESSAGE = 'Please fill out month field';

describe('ActivityMonthRequiredDateValidationRule', () => {
    it('should initialize validator', () => {
        const question = {} as ActivityQuestionBlock<any>;
        validator = new ActivityMonthRequiredDateValidationRule(question);
        expect(validator).toBeDefined();
    });

    it('should return false if answer is empty', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = null;
        validator = new ActivityMonthRequiredDateValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });

    it('should return false if month is empty', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = {
            month: null,
            day: 1,
            year: 2001
        };
        validator = new ActivityMonthRequiredDateValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });

    it('should return true if only month is filled', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = {
            month: 1,
            day: null,
            year: null
        };
        validator = new ActivityMonthRequiredDateValidationRule(question);
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });
});
