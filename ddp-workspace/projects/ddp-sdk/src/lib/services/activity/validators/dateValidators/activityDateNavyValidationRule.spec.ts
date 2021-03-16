import { ActivityQuestionBlock } from '../../../../models/activity/activityQuestionBlock';
import { ActivityDateQuestionBlock } from '../../../../models/activity/activityDateQuestionBlock';
import { DateField } from '../../../../models/activity/dateField';
import { ActivityDateNavyValidationRule } from './activityDateNavyValidationRule';
import { DateService } from '../../../dateService.service';

let validator: ActivityDateNavyValidationRule;
const dateService = new DateService();
const MESSAGE = 'SDK.Validators.DateNavyValidationRule';

describe('ActivityDateNavyValidationRule', () => {
    it('should initialize validator', () => {
        const question = {} as ActivityQuestionBlock<any>;
        validator = new ActivityDateNavyValidationRule(question, dateService);
        expect(validator).toBeDefined();
    });

    it('should return true if answer is empty', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = null;
        validator = new ActivityDateNavyValidationRule(question, dateService);
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return true if all fields are empty', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = {
            month: null,
            day: null,
            year: null
        };
        validator = new ActivityDateNavyValidationRule(question, dateService);
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return false if all fields are 0', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = {
            month: 0,
            day: 0,
            year: 0
        };
        validator = new ActivityDateNavyValidationRule(question, dateService);
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });

    it('should return true if answer is not completed', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = {
            month: 1,
            day: 1,
            year: null
        };
        validator = new ActivityDateNavyValidationRule(question, dateService);
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should return false if date is invalid', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = {
            month: 111,
            day: 111,
            year:  1
        };
        validator = new ActivityDateNavyValidationRule(question, dateService);
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });
});
