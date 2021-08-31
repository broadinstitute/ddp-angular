import { ActivityUniqueValidationRule } from './activityUniqueValidationRule';
import { ActivityQuestionBlock, ActivityCompositeQuestionBlock, QuestionType, ActivityPicklistQuestionBlock } from 'ddp-sdk';
import { PicklistSelectMode } from '../../../models/activity/picklistSelectMode';

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
            answer: [[{ stableId: 'test', value: [{ stableId: 'value' }] }]],
        } as ActivityCompositeQuestionBlock;
        validator = new ActivityUniqueValidationRule(question);
        expect(validator.recalculate()).toBeTrue();
    });

    it('should return true if question is composite but there is no questions', () => {
        const question = {
            questionType: QuestionType.Composite,
            answer: [],
        } as ActivityCompositeQuestionBlock;
        validator = new ActivityUniqueValidationRule(question);
        expect(validator.recalculate()).toBeTrue();
    });

    it('should return true if question is composite and answers are unique', () => {
        const isUniqueValuesSpy = jasmine.createSpy('isUniqueValuesSpy').and.returnValue(true);
        const question = {
            children: [
                { questionType: QuestionType.Picklist, selectMode: PicklistSelectMode.SINGLE, isUniqueValues: isUniqueValuesSpy },
                { questionType: QuestionType.Picklist, selectMode: PicklistSelectMode.SINGLE, isUniqueValues: isUniqueValuesSpy }
            ] as unknown as ActivityPicklistQuestionBlock[],
            questionType: QuestionType.Composite,
            answer: [
                [{ stableId: 'test', value: [{ stableId: 'value1' }] }],
                [{ stableId: 'test', value: [{ stableId: 'value2' }] }]],
        } as unknown as ActivityCompositeQuestionBlock;
        validator = new ActivityUniqueValidationRule(question);
        expect(validator.recalculate()).toBeTrue();
        expect(isUniqueValuesSpy).toHaveBeenCalledWith([[{ stableId: 'value1' }], [{ stableId: 'value2' }]]);
    });

    it('should return false if question is composite and answers are not unique', () => {
        const isUniqueValuesSpy = jasmine.createSpy('isUniqueValuesSpy').and.returnValue(false);
        const question = {
            children: [
                { questionType: QuestionType.Picklist, selectMode: PicklistSelectMode.SINGLE, isUniqueValues: isUniqueValuesSpy },
                { questionType: QuestionType.Picklist, selectMode: PicklistSelectMode.SINGLE, isUniqueValues: isUniqueValuesSpy }
            ] as unknown as ActivityPicklistQuestionBlock[],
            questionType: QuestionType.Composite,
            answer: [
                [{ stableId: 'test', value: [{ stableId: 'value1' }] }],
                [{ stableId: 'test', value: [{ stableId: 'value1' }] }]],
        } as unknown as ActivityCompositeQuestionBlock;
        validator = new ActivityUniqueValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalse();
        expect(validator.result).toBe(MESSAGE);
    });
});
