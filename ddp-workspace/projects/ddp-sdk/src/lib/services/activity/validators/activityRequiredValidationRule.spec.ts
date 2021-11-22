import { ActivityTextQuestionBlock } from '../../../models/activity/activityTextQuestionBlock';
import { ActivityPicklistQuestionBlock } from '../../../models/activity/activityPicklistQuestionBlock';
import { DateField } from '../../../models/activity/dateField';
import { ActivityDateQuestionBlock } from '../../../models/activity/activityDateQuestionBlock';
import { ActivityAgreementQuestionBlock } from '../../../models/activity/activityAgreementQuestionBlock';
import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { ActivityRequiredValidationRule } from './activityRequiredValidationRule';
import { ActivityCompositeQuestionBlock } from '../../../models/activity/activityCompositeQuestionBlock';
import { ActivityBooleanQuestionBlock } from '../../../models/activity/activityBooleanQuestionBlock';

let validator: ActivityRequiredValidationRule;
const MESSAGE = 'This question is required!';

describe('ActivityRequiredValidationRule', () => {
    it('should initialize validator', () => {
        const question = {} as ActivityQuestionBlock<any>;
        validator = new ActivityRequiredValidationRule(question);
        expect(validator).toBeDefined();
    });

    it('should return false if answer null', () => {
        const question = {
            answer: null,
            hasAnswer: () => false
        } as ActivityQuestionBlock<any>;
        validator = new ActivityRequiredValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });

    it('should test required rule for Agreement question', () => {
        const question = new ActivityAgreementQuestionBlock();
        question.answer = true;
        validator = new ActivityRequiredValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
        question.answer = false;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
        question.answer = null;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
    });

    it('should test required rule for Date question', () => {
        const question = new ActivityDateQuestionBlock();
        question.fields = [DateField.Day, DateField.Month, DateField.Year];
        question.answer = {
            month: null,
            day: null,
            year: null
        };
        validator = new ActivityRequiredValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
        question.answer.day = 1;
        question.answer.year = 1999;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
        question.answer.month = 1;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should test required rule for Picklist question', () => {
        const question = new ActivityPicklistQuestionBlock();
        question.answer = null;
        validator = new ActivityRequiredValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
        question.answer = [];
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
        question.answer = [{
            stableId: 'TEST',
            detail: 'TEST'
        }];
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it('should test required rule for Text question', () => {
        const question = new ActivityTextQuestionBlock();
        question.answer = null;
        validator = new ActivityRequiredValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
        question.answer = '';
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
        question.answer = '  ';
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
        question.answer = 'TEST';
        expect(validator.recalculate()).toBeTruthy();
    });

    // it('should test required rule for Composite question', () => {
    //     const question = new ActivityCompositeQuestionBlock();
    //     question.answer = null;
    //     validator = new ActivityRequiredValidationRule(question);
    //     validator.message = MESSAGE;
    //     expect(validator.recalculate()).toBeFalsy();
    //     expect(validator.result).toBe(MESSAGE);
    //
    //     question.answer = !null as any;
    //     const child1 = new ActivityTextQuestionBlock();
    //     child1.answer = 'text answer';
    //     const child2 =  new ActivityBooleanQuestionBlock();
    //     child2.answer = true;
    //     question.children = [child1, child2];
    //     expect(validator.recalculate()).toBeTruthy();
    //     expect(validator.result).toBeNull();
    // });
});
