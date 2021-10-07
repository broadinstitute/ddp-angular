import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivityQuestionConverter } from './activityQuestionConverter.service';
import { ActivityValidatorBuilder } from './activityValidatorBuilder.service';
import { ActivitySuggestionBuilder } from './activitySuggestionBuilder.service';
import { ActivityPicklistQuestionBlock, QuestionType, LoggingService, ActivityPicklistOption } from 'ddp-sdk';
import { PicklistRenderMode } from '../../models/activity/picklistRenderMode';

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
    groups: [],
    renderMode: PicklistRenderMode.AUTOCOMPLETE
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
        const questionWithAllowDetails = {
            ...question,
            picklistOptions: [
                ... question.picklistOptions,
                {
                    allowDetails: true,
                    nestedOptions: null,
                    optionLabel: '',
                    stableId: 'OTHER',
                },
            ]};
        expect((service.buildQuestionBlock(questionWithAllowDetails, 1) as ActivityPicklistQuestionBlock).customValue).toBe('OTHER');
    });

    it('should filter out allowDetails option for AUTOCOMPLETE', () => {
        const questionWithAllowDetails = {
            ...question,
            picklistOptions: [
                ... question.picklistOptions,
                {
                    allowDetails: true,
                    nestedOptions: null,
                    optionLabel: '',
                    stableId: 'OTHER',
                },
            ],
            renderMode: PicklistRenderMode.AUTOCOMPLETE
        };
        expect((service.buildQuestionBlock(questionWithAllowDetails, 1) as ActivityPicklistQuestionBlock).picklistOptions)
            .toEqual(question.picklistOptions as ActivityPicklistOption[]);
    });

    it('should not filter out allowDetails option for not AUTOCOMPLETE', () => {
        const options = [
            ... question.picklistOptions,
            {
                allowDetails: true,
                nestedOptions: null,
                optionLabel: '',
                stableId: 'OTHER',
            },
        ] as ActivityPicklistOption[];
        const questionWithAllowDetails = {
            ...question,
            picklistOptions: options,
            renderMode: PicklistRenderMode.LIST
        };
        expect((service.buildQuestionBlock(questionWithAllowDetails, 1) as ActivityPicklistQuestionBlock).picklistOptions)
            .toEqual(options);
    });
});
