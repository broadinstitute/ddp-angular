import { ActivityQuestionBlock } from '../../../../models/activity/activityQuestionBlock';
import { ActivityDateQuestionBlock } from '../../../../models/activity/activityDateQuestionBlock';
import { DateField } from '../../../../models/activity/dateField';
import { DateService } from '../../../dateService.service';
import { ActivityDateRangeValidationRule } from './activityDateRangeValidationRule';

let validator: ActivityDateRangeValidationRule;
const dateService = new DateService();
const MESSAGE = 'Entered date is out of allowed range';
const START_DATE = dateService.convertDateString('1898-01-01');
const END_DATE = dateService.convertDateString('2020-01-01');

describe('ActivityDateRangeValidationRule', () => {
    it('should initialize validator', () => {
        const question = {} as ActivityQuestionBlock<any>;
        validator = new ActivityDateRangeValidationRule(question);
        expect(validator).toBeDefined();
    });

    it('should return false if answer is empty', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = null;
        validator = new ActivityDateRangeValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });

    it('should return false if all fields are empty', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = {
            month: null,
            day: null,
            year: null
        };
        validator = new ActivityDateRangeValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });

    it('should check date range if all fields are filled', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = {
            month: 1,
            day: 1,
            year: 2011
        };
        validator = new ActivityDateRangeValidationRule(question, START_DATE, END_DATE);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
        question.answer = {
            month: 1,
            day: 1,
            year: 1703
        };
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
        question.answer = {
            month: 1,
            day: 1,
            year: 2077
        };
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });

    it('should check date range if only year and month fields are exist', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Month, DateField.Year];
        question.answer = {
            month: 1,
            day: null,
            year: 2011
        };
        validator = new ActivityDateRangeValidationRule(question, START_DATE, END_DATE);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
        question.answer = {
            month: 1,
            day: null,
            year: 2077
        };
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });

    it('should check date range if only day and month fields are exist, case 1', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month];
        question.answer = {
            month: 1,
            day: 1,
            year: null
        };
        validator = new ActivityDateRangeValidationRule(question, START_DATE, END_DATE);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
        question.answer = {
            month: 2,
            day: 2,
            year: null
        };
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });

    it('should check date range if only day and month fields are exist, case 2', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Year];
        question.answer = {
            month: null,
            day: 1,
            year: 2011
        };
        validator = new ActivityDateRangeValidationRule(question, START_DATE, END_DATE);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
        question.answer = {
            month: null,
            day: 2,
            year: 2077
        };
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });

    it('should check date range if only year field is exist', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Year];
        question.answer = {
            month: null,
            day: null,
            year: 2011
        };
        validator = new ActivityDateRangeValidationRule(question, START_DATE, END_DATE);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
        question.answer = {
            month: null,
            day: null,
            year: 2077
        };
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });

    it('should check date range if only month field is exist', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Month];
        question.answer = {
            month: 1,
            day: null,
            year: null
        };
        validator = new ActivityDateRangeValidationRule(question, START_DATE, END_DATE);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
        question.answer = {
            month: 10,
            day: null,
            year: null
        };
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });

    it('should check date range if only day field is exist', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day];
        question.answer = {
            month: null,
            day: 1,
            year: null
        };
        validator = new ActivityDateRangeValidationRule(question, START_DATE, END_DATE);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
        question.answer = {
            month: null,
            day: 10,
            year: null
        };
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });
});
