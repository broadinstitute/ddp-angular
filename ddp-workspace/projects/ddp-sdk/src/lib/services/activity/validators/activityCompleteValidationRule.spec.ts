import { ActivityAgreementQuestionBlock } from '../../../models/activity/activityAgreementQuestionBlock';
import { ActivityDateQuestionBlock } from '../../../models/activity/activityDateQuestionBlock';
import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { DateField } from '../../../models/activity/dateField';
import { ActivityCompleteValidationRule } from './activityCompleteValidationRule';

let validator: ActivityCompleteValidationRule;
const MESSAGE = 'Please, complete your answer';

describe('ActivityCompleteValidationRule', () => {
    it('should initialize validator', () => {
        const question = {} as ActivityQuestionBlock<any>;
        validator = new ActivityCompleteValidationRule(question);
        expect(validator).toBeDefined();
    });

    it('should return true if answer empty or question type other that Date', () => {
        const question = new ActivityAgreementQuestionBlock();
        question.answer = null;
        validator = new ActivityCompleteValidationRule(question);
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
        question.answer = true;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return true if the Date question is empty', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = {
            month: null,
            day: null,
            year: null
        };
        validator = new ActivityCompleteValidationRule(question);
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return true if the Date question completed', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = {
            month: 1,
            day: 1,
            year: 2001
        };
        validator = new ActivityCompleteValidationRule(question);
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it(`should return false if some of the Date question's fields skipped`, () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = {
            month: 1,
            day: 21,
            year: null
        };
        validator = new ActivityCompleteValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });
});
