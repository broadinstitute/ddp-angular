import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SuggestionServiceAgent } from '../serviceAgents/suggestionServiceAgent.service';
import { InstitutionServiceAgent } from '../serviceAgents/institutionServiceAgent.service';
import { ActivityValidatorBuilder } from './activityValidatorBuilder.service';
import { DateService } from '../dateService.service';
import { PicklistRenderMode } from '../../models/activity/picklistRenderMode';
import { LoggingService, ActivityPicklistQuestionBlock, QuestionType, ActivityCompositeQuestionBlock } from 'ddp-sdk';
import { ActivityStrictMatchValidationRule } from './validators/activityStrictMatchValidationRule';
import { ActivityUniqueValidationRule } from './validators/activityUniqueValidationRule';

describe('ActivityValidatorBuilder Test', () => {
    let service: ActivityValidatorBuilder;
    let loggerServiceSpy: jasmine.SpyObj<LoggingService>;

    beforeEach(() => {
        loggerServiceSpy = jasmine.createSpyObj('LoggingService', ['logError']);
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                ActivityValidatorBuilder,
                LoggingService,
                SuggestionServiceAgent,
                InstitutionServiceAgent
            ]
        });

        service = new ActivityValidatorBuilder({} as DateService, loggerServiceSpy);
    });

    it('should initialize service', () => {
        expect(service).toBeDefined();
    });

    it('should add ActivityStrictMatchValidationRule', () => {
        const block = {
            questionType: QuestionType.Picklist,
            renderMode: PicklistRenderMode.AUTOCOMPLETE,
        } as ActivityPicklistQuestionBlock;
        const rules = service.buildQuestionValidatorRule({validations: []}, block);
        const strictMatchRule = new ActivityStrictMatchValidationRule(block);
        expect(rules).toContain(strictMatchRule);
    });

    it('should add ActivityUniqueValidationRule', () => {
        const message = 'values are not unique';
        const block = {
            questionType: QuestionType.Composite,
        } as ActivityCompositeQuestionBlock;
        const rules = service.buildQuestionValidatorRule({validations: [{rule: 'UNIQUE', message}]}, block);
        const uniqueRule = new ActivityUniqueValidationRule(block);
        uniqueRule.message = message;
        expect(rules).toContain(uniqueRule);
    });
});
