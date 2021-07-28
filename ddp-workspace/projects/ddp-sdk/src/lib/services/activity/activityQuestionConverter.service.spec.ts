import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivityQuestionConverter } from './activityQuestionConverter.service';
import { ActivityValidatorBuilder } from './activityValidatorBuilder.service';
import { ActivitySuggestionBuilder } from './activitySuggestionBuilder.service';
import { ActivityPicklistQuestionBlock, QuestionType, LoggingService } from 'ddp-sdk';

let service: ActivityQuestionConverter;
const loggerServiceSpy: jasmine.SpyObj<LoggingService> = jasmine.createSpyObj('LoggingService', ['logError']);
const validatorBuilderSpy: jasmine.SpyObj<ActivityValidatorBuilder> = jasmine.createSpyObj('ActivityValidatorBuilder', {
    buildQuestionValidatorRule: []
});
const suggestionBuilderSpy: jasmine.SpyObj<ActivitySuggestionBuilder> = jasmine.createSpyObj('ActivitySuggestionBuilder', ['getSuggestionProvider']);
const question = {
    picklistOptions: [
        {
            stableId: 'SARCOMA',
            optionLabel: 'Sarcoma',
            allowDetails: false,
            nestedOptions: []
        },
        {
            stableId: 'ENDOCRINE_CANCER',
            optionLabel: 'Endocrine cancer',
            allowDetails: false,
            nestedOptions: []
        },
    ],
    questionType: QuestionType.Picklist,
    groups: []
};

describe('ActivityQuestionConverter Test', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                ActivityQuestionConverter,
                LoggingService,
                ActivityValidatorBuilder,
                ActivitySuggestionBuilder
            ]
        });

        service = new ActivityQuestionConverter(validatorBuilderSpy, suggestionBuilderSpy, loggerServiceSpy);
    });

    it('should initialize service', () => {
        expect(service).toBeDefined();
    });

    it('should set customValue as null', () => {
        expect((service.buildQuestionBlock(question, 1) as ActivityPicklistQuestionBlock).customValue).toBeNull();
    });

    it('should set not empty customValue', () => {
        const questionWithAllowDetails = {...question, picklistOptions: [... question.picklistOptions,
                {
                    allowDetails: true,
                    nestedOptions: null,
                    optionLabel: '',
                    stableId: 'OTHER',
                }]};
        expect((service.buildQuestionBlock(questionWithAllowDetails, 1) as ActivityPicklistQuestionBlock).customValue).toBe('OTHER');
    });
});
