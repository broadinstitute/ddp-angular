import { ActivityAgeRangeValidationRule } from './activityAgeRangeValidationRule';
import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';

let validator: ActivityAgeRangeValidationRule;

describe('ActivityAgeRangeValidationRule Test Common year', () => {
    beforeAll(() => {
        const baseTime = new Date(2019, 7, 5);
        jasmine.clock().uninstall();
        jasmine.clock().install();
        jasmine.clock().mockDate(baseTime);
    });

    afterAll(() => {
        jasmine.clock().uninstall();
    });

    it('should initialize validator', () => {
        const question = {} as ActivityQuestionBlock<any>;
        validator = new ActivityAgeRangeValidationRule(question);
        expect(validator).toBeDefined();
    });

    it('should return true if answer is empty', () => {
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = null;
        validator = new ActivityAgeRangeValidationRule(question);
        expect(validator.recalculate()).toBeTruthy();
    });

    it('should return true if DOB is not full', () => {
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {
            year: 1999,
            month: 10,
            day: null
        };
        validator = new ActivityAgeRangeValidationRule(question);
        expect(validator.recalculate()).toBeTruthy();
    });

    it('should return true if user`s age > minAge', () => {
        const MIN_AGE = 18;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {
            year: 1990,
            month: 10,
            day: 1
        };
        validator = new ActivityAgeRangeValidationRule(question, MIN_AGE);
        expect(validator.recalculate()).toBeTruthy();
    });

    it('should return false if user`s age < minAge', () => {
        const MIN_AGE = 18;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {
            year: 2001,
            month: 8,
            day: 6
        };
        validator = new ActivityAgeRangeValidationRule(question, MIN_AGE);
        expect(validator.recalculate()).toBeFalsy();
    });

    it('should return true if birthday today', () => {
        const MIN_AGE = 18;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {
            year: 2001,
            month: 8,
            day: 5
        };
        validator = new ActivityAgeRangeValidationRule(question, MIN_AGE);
        expect(validator.recalculate()).toBeTruthy();
    });

    it('should return false if user`s age > maxAge', () => {
        const MAX_AGE = 70;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {
            year: 1901,
            month: 10,
            day: 1
        };
        validator = new ActivityAgeRangeValidationRule(question, null, MAX_AGE);
        expect(validator.recalculate()).toBeFalsy();
    });

    it('should return true if user`s age < maxAge', () => {
        const MAX_AGE = 70;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {
            year: 1993,
            month: 9,
            day: 6
        };
        validator = new ActivityAgeRangeValidationRule(question, null, MAX_AGE);
        expect(validator.recalculate()).toBeTruthy();
    });

    it('should return true if birthday today', () => {
        const MAX_AGE = 70;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {
            year: 1949,
            month: 8,
            day: 5
        };
        validator = new ActivityAgeRangeValidationRule(question, null, MAX_AGE);
        expect(validator.recalculate()).toBeTruthy();
    });

    it('should return true if user`s age between minAge and maxAge', () => {
        const MAX_AGE = 70;
        const MIN_AGE = 18;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {
            year: 1970,
            month: 8,
            day: 5
        };
        validator = new ActivityAgeRangeValidationRule(question, MIN_AGE, MAX_AGE);
        expect(validator.recalculate()).toBeTruthy();
    });

    it('should return true if user`s age between minAge and maxAge(last chance to join)', () => {
        const MAX_AGE = 70;
        const MIN_AGE = 18;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {
            year: 1949,
            month: 8,
            day: 5
        };
        validator = new ActivityAgeRangeValidationRule(question, MIN_AGE, MAX_AGE);
        expect(validator.recalculate()).toBeTruthy();
    });

    it('should return true if user`s age between minAge and maxAge(the first possibility to join)', () => {
        const MAX_AGE = 70;
        const MIN_AGE = 18;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {
            year: 2001,
            month: 8,
            day: 5
        };
        validator = new ActivityAgeRangeValidationRule(question, MIN_AGE, MAX_AGE);
        expect(validator.recalculate()).toBeTruthy();
    });

    it('should return false if user is too young', () => {
        const MAX_AGE = 70;
        const MIN_AGE = 18;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {
            year: 2005,
            month: 8,
            day: 5
        };
        validator = new ActivityAgeRangeValidationRule(question, MIN_AGE, MAX_AGE);
        expect(validator.recalculate()).toBeFalsy();
    });

    it('should return false if user is too old', () => {
        const MAX_AGE = 70;
        const MIN_AGE = 18;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {
            year: 1901,
            month: 8,
            day: 5
        };
        validator = new ActivityAgeRangeValidationRule(question, MIN_AGE, MAX_AGE);
        expect(validator.recalculate()).toBeFalsy();
    });
});

describe('ActivityAgeRangeValidationRule Test Leap year', () => {
    it('should return false if user was born in leap year and user is too young', () => {
        const baseTime = new Date(2021, 1, 28);
        jasmine.clock().uninstall();
        jasmine.clock().install();
        jasmine.clock().mockDate(baseTime);

        const MIN_AGE = 5;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {
            year: 2016,
            month: 2,
            day: 29
        };
        validator = new ActivityAgeRangeValidationRule(question, MIN_AGE);
        expect(validator.recalculate()).toBeFalsy();

        jasmine.clock().uninstall();
    });

    it('should return true if user was born in leap year and age is okay', () => {
        const baseTime = new Date(2021, 2, 1);
        jasmine.clock().uninstall();
        jasmine.clock().install();
        jasmine.clock().mockDate(baseTime);

        const MIN_AGE = 5;
        const question = {} as ActivityQuestionBlock<any>;
        question.answer = {
            year: 2016,
            month: 2,
            day: 29
        };
        validator = new ActivityAgeRangeValidationRule(question, MIN_AGE);
        expect(validator.recalculate()).toBeTruthy();

        jasmine.clock().uninstall();
    });
});
