import { ActivityTextQuestionBlock } from '../../../models/activity/activityTextQuestionBlock';
import { ActivityCompositeQuestionBlock } from '../../../models/activity/activityCompositeQuestionBlock';
import { ActivityCompositeValidationRule } from './activityCompositeValidationRule';
import { ActivityRequiredValidationRule } from './activityRequiredValidationRule';

let validator: ActivityCompositeValidationRule;
const MESSAGE = 'Please, complete your answer';

describe('ActivityCompositeValidationRule', () => {
    it('should initialize validator', () => {
        const question = new ActivityCompositeQuestionBlock();
        validator = new ActivityCompositeValidationRule(question);
        expect(validator).toBeDefined();
    });

    it(`should return true if child questions don't have validators`, () => {
        const question = new ActivityCompositeQuestionBlock();
        const textQuestion = new ActivityTextQuestionBlock();
        textQuestion.validators = [];
        question.children.push(textQuestion, textQuestion);
        validator = new ActivityCompositeValidationRule(question);
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });

    it(`should return false if child questions are invalid`, () => {
        const question = new ActivityCompositeQuestionBlock();
        const textQuestion1 = new ActivityTextQuestionBlock();
        const textQuestion2 = new ActivityTextQuestionBlock();
        const validator1 = new ActivityRequiredValidationRule(textQuestion1);
        const validator2 = new ActivityRequiredValidationRule(textQuestion2);
        validator1.message = `${MESSAGE}-1`;
        validator2.message = `${MESSAGE}-2`;
        textQuestion1.validators.push(validator1);
        textQuestion2.validators.push(validator2);
        question.children.push(textQuestion1, textQuestion2);
        validator = new ActivityCompositeValidationRule(question);
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(`${MESSAGE}-1`);
    });

    it(`should return false if 2nd child question is invalid`, () => {
        const question = new ActivityCompositeQuestionBlock();
        question.answer = [
            [{
                stableId: 'Q1',
                value: 'test'
            }]
        ];
        const textQuestion1 = new ActivityTextQuestionBlock();
        const textQuestion2 = new ActivityTextQuestionBlock();
        textQuestion1.stableId = 'Q1';
        textQuestion2.stableId = 'Q2';
        const validator1 = new ActivityRequiredValidationRule(textQuestion1);
        const validator2 = new ActivityRequiredValidationRule(textQuestion2);
        validator1.message = `${MESSAGE}-1`;
        validator2.message = `${MESSAGE}-2`;
        textQuestion1.validators.push(validator1);
        textQuestion2.validators.push(validator2);
        question.children.push(textQuestion1, textQuestion2);
        validator = new ActivityCompositeValidationRule(question);
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(`${MESSAGE}-2`);
    });

    it(`should return true if all child questions are valid`, () => {
        const question = new ActivityCompositeQuestionBlock();
        question.answer = [
            [{
                stableId: 'Q1',
                value: 'test'
            },
            {
                stableId: 'Q2',
                value: 'test'
            }]
        ];
        const textQuestion1 = new ActivityTextQuestionBlock();
        const textQuestion2 = new ActivityTextQuestionBlock();
        textQuestion1.stableId = 'Q1';
        textQuestion2.stableId = 'Q2';
        const validator1 = new ActivityRequiredValidationRule(textQuestion1);
        const validator2 = new ActivityRequiredValidationRule(textQuestion2);
        textQuestion1.validators.push(validator1);
        textQuestion2.validators.push(validator2);
        question.children.push(textQuestion1, textQuestion2);
        validator = new ActivityCompositeValidationRule(question);
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });
});
