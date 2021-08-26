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

    it('should return true if question is composite and children question type is not picklist', () => {
        const question = {
            children: [{ questionType: QuestionType.Text }, { questionType: QuestionType.Text }] as ActivityPicklistQuestionBlock[],
            questionType: QuestionType.Composite,
            answer: [[{ stableId: 'test', value: 'value' }], [{ stableId: 'test', value: 'value' }]],
        } as unknown as ActivityCompositeQuestionBlock;
        validator = new ActivityUniqueValidationRule(question);
        expect(validator.recalculate()).toBeTrue();
    });

    it('should return true if question is composite, children question type is picklist but multiple selection', () => {
        const question = {
            children: [
                { questionType: QuestionType.Picklist, selectMode: PicklistSelectMode.MULTIPLE },
                { questionType: QuestionType.Picklist, selectMode: PicklistSelectMode.MULTIPLE }
            ] as ActivityPicklistQuestionBlock[],
            questionType: QuestionType.Composite,
            answer: [
                [{ stableId: 'test', value: [{ stableId: 'value1' }, { stableId: 'value2' }] }],
                [{ stableId: 'test', value: [{ stableId: 'value1' }, { stableId: 'value2' }] }]],
        } as unknown as ActivityCompositeQuestionBlock;
        validator = new ActivityUniqueValidationRule(question);
        expect(validator.recalculate()).toBeTrue();
    });

    it('should return true if question is composite and answers are unique', () => {
        const question = {
            children: [
                { questionType: QuestionType.Picklist, selectMode: PicklistSelectMode.SINGLE },
                { questionType: QuestionType.Picklist, selectMode: PicklistSelectMode.SINGLE }
            ] as ActivityPicklistQuestionBlock[],
            questionType: QuestionType.Composite,
            answer: [
                [{ stableId: 'test', value: [{ stableId: 'value1' }] }],
                [{ stableId: 'test', value: [{ stableId: 'value2' }] }]],
        } as unknown as ActivityCompositeQuestionBlock;
        validator = new ActivityUniqueValidationRule(question);
        expect(validator.recalculate()).toBeTrue();
    });

    it('should return false if question is composite and answers are not unique', () => {
        const question = {
            children: [
                { questionType: QuestionType.Picklist, selectMode: PicklistSelectMode.SINGLE },
                { questionType: QuestionType.Picklist, selectMode: PicklistSelectMode.SINGLE }
            ] as ActivityPicklistQuestionBlock[],
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

    it('should return true if custom answers are unique', () => {
        const question = {
            children: [
                { customValue: 'OTHER', questionType: QuestionType.Picklist, selectMode: PicklistSelectMode.SINGLE },
                { customValue: 'OTHER', questionType: QuestionType.Picklist, selectMode: PicklistSelectMode.SINGLE }
            ] as ActivityPicklistQuestionBlock[],
            questionType: QuestionType.Composite,
            answer: [
                [{ stableId: 'test', value: [{ stableId: 'OTHER', detail: 'very custom' }] }],
                [{ stableId: 'test', value: [{ stableId: 'OTHER', detail: 'very custom 1' }] }]],
        } as unknown as ActivityCompositeQuestionBlock;
        validator = new ActivityUniqueValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTrue();
    });

    it('should return false if custom answers are not unique', () => {
        const question = {
            children: [
                { customValue: 'OTHER', questionType: QuestionType.Picklist, selectMode: PicklistSelectMode.SINGLE },
                { customValue: 'OTHER', questionType: QuestionType.Picklist, selectMode: PicklistSelectMode.SINGLE }
            ] as ActivityPicklistQuestionBlock[],
            questionType: QuestionType.Composite,
            answer: [
                [{ stableId: 'test', value: [{ stableId: 'OTHER', detail: 'very custom' }] }],
                [{ stableId: 'test', value: [{ stableId: 'OTHER', detail: 'very custom' }] }]],
        } as unknown as ActivityCompositeQuestionBlock;
        validator = new ActivityUniqueValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalse();
        expect(validator.result).toBe(MESSAGE);
    });
});
