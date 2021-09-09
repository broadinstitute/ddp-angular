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
        const convertToStringSpy = jasmine.createSpy('convertToStringSpy');
        convertToStringSpy.withArgs([{ stableId: 'value1' }]).and.returnValue('value1');
        convertToStringSpy.withArgs([{ stableId: 'value2' }]).and.returnValue('value2');
        convertToStringSpy.withArgs('description').and.returnValue('description');
        const question = {
            children: [
                { questionType: QuestionType.Picklist, selectMode: PicklistSelectMode.SINGLE, convertToString: convertToStringSpy },
                { questionType: QuestionType.Text, convertToString: convertToStringSpy },
                { questionType: QuestionType.File, convertToString: convertToStringSpy },
            ] as unknown as ActivityPicklistQuestionBlock[],
            questionType: QuestionType.Composite,
            answer: [
                [
                    { stableId: 'testPicklist', value: [{ stableId: 'value1' }] },
                    { stableId: 'testInput', value: 'description' },
                    { stableId: 'testFile', value: 'does not matter' }],
                [
                    { stableId: 'testPicklist', value: null },
                    { stableId: 'testInput', value: null },
                    { stableId: 'testFile', value: null }],
                [
                    { stableId: 'testPicklist', value: [{ stableId: 'value2' }] },
                    { stableId: 'testInput', value: 'description' },
                    { stableId: 'testFile', value: 'does not matter' }]],
        } as unknown as ActivityCompositeQuestionBlock;
        validator = new ActivityUniqueValidationRule(question);
        expect(validator.recalculate()).toBeTrue();
        expect(convertToStringSpy.calls.allArgs()).toEqual([
            [[{ stableId: 'value1' }]],
            ['description'],
            [[{ stableId: 'value2' }]],
            ['description']]);
        expect(convertToStringSpy.calls.count()).toBe(4);
    });

    it('should return true if question is composite and answers are empty', () => {
        const convertToStringSpy = jasmine.createSpy('convertToStringSpy');
        const question = {
            children: [
                { questionType: QuestionType.Picklist, selectMode: PicklistSelectMode.SINGLE, convertToString: convertToStringSpy },
            ] as unknown as ActivityPicklistQuestionBlock[],
            questionType: QuestionType.Composite,
            answer: [[{ stableId: 'testPicklist', value: null }], [{ stableId: 'testPicklist', value: null }]]
        } as unknown as ActivityCompositeQuestionBlock;
        validator = new ActivityUniqueValidationRule(question);
        expect(validator.recalculate()).toBeTrue();
        expect(convertToStringSpy).not.toHaveBeenCalled();
    });

    it('should return false if question is composite and answers are not unique', () => {
        const convertToStringSpy = jasmine.createSpy('convertToStringSpy').and.returnValue(false);
        convertToStringSpy.withArgs([{ stableId: 'value1' }]).and.returnValue('value1');
        convertToStringSpy.withArgs('description').and.returnValue('description');
        const question = {
            children: [
                { questionType: QuestionType.Picklist, selectMode: PicklistSelectMode.SINGLE, convertToString: convertToStringSpy },
                { questionType: QuestionType.Text, convertToString: convertToStringSpy }
            ] as unknown as ActivityPicklistQuestionBlock[],
            questionType: QuestionType.Composite,
            answer: [
                [{ stableId: 'test', value: [{ stableId: 'value1' }] }, { stableId: 'testInput', value: 'description' }],
                [{ stableId: 'test', value: [{ stableId: 'value1' }] }, { stableId: 'testInput', value: 'description' }]],
        } as unknown as ActivityCompositeQuestionBlock;
        validator = new ActivityUniqueValidationRule(question);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeFalse();
        expect(validator.result).toBe(MESSAGE);
    });
});
