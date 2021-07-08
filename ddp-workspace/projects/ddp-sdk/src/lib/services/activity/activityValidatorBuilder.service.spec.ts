import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SuggestionServiceAgent } from '../serviceAgents/suggestionServiceAgent.service';
import { InstitutionServiceAgent } from '../serviceAgents/institutionServiceAgent.service';
import { ActivityValidatorBuilder } from './activityValidatorBuilder.service';
import { DateService } from '../dateService.service';
import { PicklistRenderMode } from '../../models/activity/picklistRenderMode';
import { LoggingService, ActivityPicklistQuestionBlock, QuestionType } from 'ddp-sdk';
import { ActivityStrictMatchValidationRule } from './validators/activityStrictMatchValidationRule';

let service: ActivityValidatorBuilder;
const loggerServiceSpy: jasmine.SpyObj<LoggingService> = jasmine.createSpyObj('LoggingService', ['logError']);

describe('ActivityValidatorBuilder Test', () => {
    beforeEach(() => {
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
});
