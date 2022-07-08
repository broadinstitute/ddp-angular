import { Injectable } from '@angular/core';
import { DateService } from '../dateService.service';
import { LoggingService } from '../logging.service';
import { ActivityAgeRangeValidationRule } from './validators/activityAgeRangeValidationRule';
import { ActivityNumericRangeValidationRule } from './validators/activityNumericRangeValidationRule';
import { ActivityAbstractValidationRule } from './validators/activityAbstractValidationRule';
import { ActivityRequiredValidationRule } from './validators/activityRequiredValidationRule';
import { ActivityCompleteValidationRule } from './validators/activityCompleteValidationRule';
import { ActivityLengthValidationRule } from './validators/activityLengthValidationRule';
import { ActivityRegexValidationRule } from './validators/activityRegexValidationRule';
import { ActivityMatchValidationRule } from './validators/activityMatchValidationRule';
import { ActivityOptionsAmountValidationRule } from './validators/activityOptionsAmountValidationRule';
import { ActivityDateNavyValidationRule } from './validators/dateValidators/activityDateNavyValidationRule';
import { ActivityYearRequiredDateValidationRule } from './validators/dateValidators/activityYearRequiredDateValidationRule';
import { ActivityMonthRequiredDateValidationRule } from './validators/dateValidators/activityMonthRequiredDateValidationRule';
import { ActivityDayRequiredDateValidationRule } from './validators/dateValidators/activityDayRequiredDateValidationRule';
import { ActivityDateRangeValidationRule } from './validators/dateValidators/activityDateRangeValidationRule';
import { ActivityQuestionBlock } from '../../models/activity/activityQuestionBlock';
import { ActivityTextQuestionBlock } from '../../models/activity/activityTextQuestionBlock';
import { ValidationRuleFactoryMapping } from '../../models/activity/validationRuleFactoryMapping';
import { QuestionType } from '../../models/activity/questionType';
import { InputType } from '../../models/activity/inputType';
import * as _ from 'underscore';
import { ActivityFileValidationRule } from './validators/activityFileValidationRule';
import { ActivityFileQuestionBlock } from '../../models/activity/activityFileQuestionBlock';
import { PicklistRenderMode } from '../../models/activity/picklistRenderMode';
import { ActivityPicklistQuestionBlock } from '../../models/activity/activityPicklistQuestionBlock';
import { ActivityStrictMatchValidationRule } from './validators/activityStrictMatchValidationRule';
import { ActivityUniqueValidationRule } from './validators/activityUniqueValidationRule';
import { ValidationRuleType } from './validationRuleType';
import { DecimalHelper } from '../../utility/decimalHelper';
import { ActivityDecimalRangeValidationRule } from './validators/activityDecimalRangeValidationRule';

@Injectable()
export class ActivityValidatorBuilder {
    private rules: Array<ValidationRuleFactoryMapping>;
    private readonly LOG_SOURCE = 'ActivityValidatorBuilder';

    constructor(
        private dateService: DateService,
        private logger: LoggingService) {
        this.rules = [
            { type: ValidationRuleType.Required, factory: (x, y) => new ActivityRequiredValidationRule(y) },
            { type: ValidationRuleType.Complete, factory: (x, y) => new ActivityCompleteValidationRule(y) },
            { type: ValidationRuleType.Length, factory: (x, y) => this.buildLengthValidator(x, y) },
            { type: ValidationRuleType.Regex, factory: (x, y) => new ActivityRegexValidationRule(y, x.regexPattern) },
            { type: ValidationRuleType.NumOptionsSelected,
              factory: (x, y) => new ActivityOptionsAmountValidationRule(y, x.minSelections, x.maxSelections)
            },
            { type: ValidationRuleType.YearRequired, factory: (x, y) => new ActivityYearRequiredDateValidationRule(y) },
            { type: ValidationRuleType.MonthRequired, factory: (x, y) => new ActivityMonthRequiredDateValidationRule(y) },
            { type: ValidationRuleType.DayRequired, factory: (x, y) => new ActivityDayRequiredDateValidationRule(y) },
            { type: ValidationRuleType.DateRange, factory: (x, y) => this.buildDateRangeValidator(x, y) },
            { type: ValidationRuleType.AgeRange, factory: (x, y) => this.buildAgeRangeValidator(x, y) },
            { type: ValidationRuleType.IntRange, factory: (x, y) => this.buildNumericRangeValidator(x, y) },
            { type: ValidationRuleType.DecimalRange, factory: (x, y) => this.buildDecimalRangeValidator(x, y) },
            { type: ValidationRuleType.Unique, factory: (x, y) => new ActivityUniqueValidationRule(y) },
            { type: ValidationRuleType.UniqueValue },
            { type: ValidationRuleType.Comparison },
        ];
    }

    public buildQuestionValidatorRule(questionJson: any, questionBlock: ActivityQuestionBlock<any>):
        Array<ActivityAbstractValidationRule> {
        const rules: Array<ActivityAbstractValidationRule> = [];
        for (const validationJson of questionJson.validations) {
            const buildRule = this.rules.find(x => x.type === validationJson.rule);
            if (buildRule != null) {
                if (!buildRule.factory) {
                    console.log(`Question ${questionJson.stableId} has a back-end side validation "${validationJson.rule}"`);
                    continue;
                }
                const rule = buildRule.factory(validationJson, questionBlock);
                rule.message = validationJson.message;
                _.isBoolean(validationJson.allowSave) && (rule.allowSave = validationJson.allowSave);
                rules.push(rule);
            } else {
                this.logger.logError(this.LOG_SOURCE,
                    `Received unknown type of validation rule named: ${validationJson.rule}`);
            }
        }
        const additionalLocalRules = this.buildQuestionLocalValidatorRules(questionBlock);
        return rules.concat(additionalLocalRules);
    }

    private buildQuestionLocalValidatorRules(questionBlock: ActivityQuestionBlock<any>): Array<ActivityAbstractValidationRule> {
        const localRules = [];

        if (questionBlock.questionType === QuestionType.Date) {
            localRules.push(new ActivityDateNavyValidationRule(questionBlock, this.dateService));
        }

        if (questionBlock instanceof ActivityTextQuestionBlock &&
            questionBlock.inputType === InputType.Text &&
            questionBlock.confirmEntry) {
            localRules.push(new ActivityMatchValidationRule(questionBlock));
        }

        if (questionBlock.questionType === QuestionType.File) {
            localRules.push(new ActivityFileValidationRule(questionBlock as ActivityFileQuestionBlock));
        }

        if (questionBlock.questionType === QuestionType.Picklist
            && (questionBlock as ActivityPicklistQuestionBlock).renderMode === PicklistRenderMode.AUTOCOMPLETE) {
            localRules.push(new ActivityStrictMatchValidationRule(questionBlock as ActivityPicklistQuestionBlock));
        }

        return localRules;
    }

    private buildLengthValidator(validationJson: any, questionBlock: ActivityQuestionBlock<any>):
        ActivityAbstractValidationRule {
        const lengthRule = new ActivityLengthValidationRule(questionBlock);
        if (_.isNumber(validationJson.minLength)) {
            lengthRule.minLength = validationJson.minLength;
        }
        if (_.isNumber(validationJson.maxLength)) {
            lengthRule.maxLength = validationJson.maxLength;
        }
        return lengthRule;
    }

    private buildDateRangeValidator(validationJson: any, questionBlock: ActivityQuestionBlock<any>):
        ActivityDateRangeValidationRule {
        const rule = new ActivityDateRangeValidationRule(questionBlock);
        if (_.isString(validationJson.startDate)) {
            rule.startDate = this.dateService.convertDateString(validationJson.startDate);
        }
        if (_.isString(validationJson.endDate)) {
            rule.endDate = this.dateService.convertDateString(validationJson.endDate);
        }
        return rule;
    }

    private buildAgeRangeValidator(validationJson: any, questionBlock: ActivityQuestionBlock<any>):
        ActivityAgeRangeValidationRule {
        const ageRangeRule = new ActivityAgeRangeValidationRule(questionBlock);
        if (_.isNumber(validationJson.minAge)) {
            ageRangeRule.minAge = validationJson.minAge;
        }
        if (_.isNumber(validationJson.maxAge)) {
            ageRangeRule.maxAge = validationJson.maxAge;
        }
        return ageRangeRule;
    }

    private buildNumericRangeValidator(validationJson: any, questionBlock: ActivityQuestionBlock<any>):
        ActivityNumericRangeValidationRule {
        const numericRangeRule = new ActivityNumericRangeValidationRule(questionBlock);
        if (_.isNumber(validationJson.min)) {
            numericRangeRule.min = validationJson.min;
        }
        if (_.isNumber(validationJson.max)) {
            numericRangeRule.max = validationJson.max;
        }
        return numericRangeRule;
    }

    private buildDecimalRangeValidator(validationJson: any, questionBlock: ActivityQuestionBlock<any>):
        ActivityDecimalRangeValidationRule {
        const decimalRangeRule = new ActivityDecimalRangeValidationRule(questionBlock);
        if (DecimalHelper.isDecimalAnswerType(validationJson.min)) {
            decimalRangeRule.min = DecimalHelper.mapDecimalAnswerToNumber(validationJson.min);
        }
        if (DecimalHelper.isDecimalAnswerType(validationJson.max)) {
            decimalRangeRule.max = DecimalHelper.mapDecimalAnswerToNumber(validationJson.max);
        }
        return decimalRangeRule;
    }
}
