import { ActivityUniqueValidationRule } from './activityUniqueValidationRule';
import { ActivityQuestionBlock, ActivityCompositeQuestionBlock, QuestionType } from 'ddp-sdk';

let validator: ActivityUniqueValidationRule;
const MESSAGE = 'Answers should be unique';

describe('ActivityUniqueValidationRule', () => {
    it('should initialize validator', () => {
        const question = {} as ActivityCompositeQuestionBlock;
        validator = new ActivityUniqueValidationRule(question);
        expect(validator).toBeDefined();
    });

    it('should return true if question is not composite', () => {
        const question = {questionType: QuestionType.Agreement} as ActivityQuestionBlock<string>;
        validator = new ActivityUniqueValidationRule(question);
        expect(validator.recalculate()).toBeTrue();
    });

    it('should return true if question is composite but there is only one question', () => {
        const question = {
            questionType: QuestionType.Composite,
            answer: [[{stableId: 'test', value: [{stableId: 'value'}]}]],
        } as ActivityCompositeQuestionBlock;
        validator = new ActivityUniqueValidationRule(question);
        expect(validator.recalculate()).toBeTrue();
    });

    it('should return true if question is composite and answers are not arrays', () => {
        const question = {
            questionType: QuestionType.Composite,
            answer: [[{stableId: 'test', value: 'value'}], [{stableId: 'test', value: 'value'}]],
        } as ActivityCompositeQuestionBlock;
        validator = new ActivityUniqueValidationRule(question);
        expect(validator.recalculate()).toBeTrue();
    });

    it('should return true if question is composite and answers are multiple selected arrays', () => {
        const question = {
            questionType: QuestionType.Composite,
            answer: [
                [{stableId: 'test', value: [{stableId: 'value1'}, {stableId: 'value2'}]}],
                [{stableId: 'test', value: [{stableId: 'value1'}, {stableId: 'value2'}]}]],
        } as ActivityCompositeQuestionBlock;
        validator = new ActivityUniqueValidationRule(question);
        expect(validator.recalculate()).toBeTrue();
    });

    it('should return true if question is composite and answers are unique', () => {
        const question = {
            questionType: QuestionType.Composite,
            answer: [
                [{stableId: 'test', value: [{stableId: 'value1'}]}],
                [{stableId: 'test', value: [{stableId: 'value2'}]}]],
        } as ActivityCompositeQuestionBlock;
        validator = new ActivityUniqueValidationRule(question);
        expect(validator.recalculate()).toBeTrue();
    });

    it('should return false if question is composite and answers are not unique', () => {
        const question = {
            questionType: QuestionType.Composite,
            answer: [
                [{stableId: 'test', value: [{stableId: 'value1'}]}],
                [{stableId: 'test', value: [{stableId: 'value1'}]}]],
        } as ActivityCompositeQuestionBlock;
        validator = new ActivityUniqueValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalse();
        expect(validator.result).toBe(MESSAGE);
    });
});
