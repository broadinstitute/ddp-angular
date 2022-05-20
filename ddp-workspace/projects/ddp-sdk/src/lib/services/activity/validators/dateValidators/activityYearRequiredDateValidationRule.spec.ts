import { ActivityYearRequiredDateValidationRule } from './activityYearRequiredDateValidationRule';
import { ActivityQuestionBlock } from '../../../../models/activity/activityQuestionBlock';
import { ActivityDateQuestionBlock } from '../../../../models/activity/activityDateQuestionBlock';
import { DateField } from '../../../../models/activity/dateField';

let validator: ActivityYearRequiredDateValidationRule;
const MESSAGE = 'Please fill out year field';

describe('ActivityYearRequiredDateValidationRule', () => {
    it('should initialize validator', () => {
        const question = {} as ActivityQuestionBlock<any>;
        validator = new ActivityYearRequiredDateValidationRule(question);
        expect(validator).toBeDefined();
    });

    it('should return false if answer is empty', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = null;
        validator = new ActivityYearRequiredDateValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });

    it('should return false if year is empty', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = {
            month: 1,
            day: 1,
            year: null
        };
        validator = new ActivityYearRequiredDateValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });

    it('should return true if only year is filled', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = {
            month: null,
            day: null,
            year: 2001
        };
        validator = new ActivityYearRequiredDateValidationRule(question);
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });
});
