import { ActivityQuestionBlock } from '../../../../models/activity/activityQuestionBlock';
import { ActivityDateQuestionBlock } from '../../../../models/activity/activityDateQuestionBlock';
import { DateField } from '../../../../models/activity/dateField';
import { ActivityDayRequiredDateValidationRule } from './activityDayRequiredDateValidationRule';

let validator: ActivityDayRequiredDateValidationRule;
const MESSAGE = 'Please fill out day field';

describe('ActivityDayRequiredDateValidationRule', () => {
    it('should initialize validator', () => {
        const question = {} as ActivityQuestionBlock<any>;
        validator = new ActivityDayRequiredDateValidationRule(question);
        expect(validator).toBeDefined();
    });

    it('should return false if answer is empty', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = null;
        validator = new ActivityDayRequiredDateValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });

    it('should return false if day is empty', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = {
            month: 1,
            day: null,
            year: 2001
        };
        validator = new ActivityDayRequiredDateValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });

    it('should return true if only day is filled', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = {
            month: null,
            day: 1,
            year: null
        };
        validator = new ActivityDayRequiredDateValidationRule(question);
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });
});
