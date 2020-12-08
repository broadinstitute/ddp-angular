import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { ActivityRegexValidationRule } from './activityRegexValidationRule';

let validator: ActivityRegexValidationRule;
const MESSAGE = `Your answer doesn't match regex rule`;

describe('ActivityRegexValidationRule', () => {
    it('should initialize validator', () => {
        const question = {} as ActivityQuestionBlock<any>;
        validator = new ActivityRegexValidationRule(question, '');
        expect(validator).toBeDefined();
    });

    it('should match answer with regex', () => {
        const REGEX = '[a-zA-Z]+';
        const question = {} as ActivityQuestionBlock<string>;
        question.answer = null;
        validator = new ActivityRegexValidationRule(question, REGEX);
        validator.message = MESSAGE;
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
        question.answer = '123';
        expect(validator.recalculate()).toBeFalsy();
        expect(validator.result).toBe(MESSAGE);
        question.answer = 'foobar';
        expect(validator.recalculate()).toBeTruthy();
        expect(validator.result).toBeNull();
    });
});
