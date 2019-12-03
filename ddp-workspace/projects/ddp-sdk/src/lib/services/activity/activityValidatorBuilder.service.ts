import { Injectable } from '@angular/core';
import { DateService } from '../dateService.service';
import { LoggingService } from './../logging.service';
import { ActivityAgeRangeValidationRule } from './validators/activityAgeRangeValidationRule';
import { ActivityNumericRangeValidationRule } from './validators/activityNumericRangeValidationRule';
import { ActivityAbstractValidationRule } from './validators/activityAbstractValidationRule';
import { ActivityRequiredValidationRule } from './validators/activityRequiredValidationRule';
import { ActivityCompleteValidationRule } from './validators/activityCompleteValidationRule';
import { ActivityLengthValidationRule } from './validators/activityLengthValidationRule';
import { ActivityRegexValidationRule } from './validators/activityRegexValidationRule';
import { ActivityOptionsAmountValidationRule } from './validators/activityOptionsAmountValidationRule';
import { ActivityDateNavyValidationRule } from './validators/dateValidators/activityDateNavyValidationRule';
import { ActivityYearRequiredDateValidationRule } from './validators/dateValidators/activityYearRequiredDateValidationRule';
import { ActivityMonthRequiredDateValidationRule } from './validators/dateValidators/activityMonthRequiredDateValidationRule';
import { ActivityDayRequiredDateValidationRule } from './validators/dateValidators/activityDayRequiredDateValidationRule';
import { ActivityDateRangeValidationRule } from './validators/dateValidators/activityDateRangeValidationRule';
import { ActivityQuestionBlock } from '../../models/activity/activityQuestionBlock';
import { ValidationRuleFactoryMapping } from '../../models/activity/validationRuleFactoryMapping';
import { QuestionType } from '../../models/activity/questionType';
import * as _ from 'underscore';

@Injectable()
export class ActivityValidatorBuilder {
    private rules: Array<ValidationRuleFactoryMapping>;

    constructor(
        private dateService: DateService,
        private logger: LoggingService) {
        this.rules = [
            { type: 'REQUIRED', factory: (x, y) => new ActivityRequiredValidationRule(y) },
            { type: 'COMPLETE', factory: (x, y) => new ActivityCompleteValidationRule(y) },
            { type: 'LENGTH', factory: (x, y) => this.buildLengthValidator(x, y) },
            { type: 'REGEX', factory: (x, y) => new ActivityRegexValidationRule(y, x.regexPattern) },
            { type: 'NUM_OPTIONS_SELECTED', factory: (x, y) => new ActivityOptionsAmountValidationRule(y, x.minSelections, x.maxSelections) },
            { type: 'YEAR_REQUIRED', factory: (x, y) => new ActivityYearRequiredDateValidationRule(y) },
            { type: 'MONTH_REQUIRED', factory: (x, y) => new ActivityMonthRequiredDateValidationRule(y) },
            { type: 'DAY_REQUIRED', factory: (x, y) => new ActivityDayRequiredDateValidationRule(y) },
            { type: 'DATE_RANGE', factory: (x, y) => this.buildDateRangeValidator(x, y) },
            { type: 'AGE_RANGE', factory: (x, y) => this.buildAgeRangeValidator(x, y) },
            { type: 'INT_RANGE', factory: (x, y) => this.buildNumericRangeValidator(x, y) }
        ];
    }

    public buildQuestionValidatorRule(questionJson: any, questionBlock: ActivityQuestionBlock<any>):
        Array<ActivityAbstractValidationRule> {
        const rules: Array<ActivityAbstractValidationRule> = [];
        for (const validationJson of questionJson.validations) {
            const buildRule = this.rules.find(x => x.type === validationJson.rule);
            if (buildRule != null) {
                const rule = buildRule.factory(validationJson, questionBlock);
                rule.message = validationJson.message;
                _.isBoolean(validationJson.allowSave) && (rule.allowSave = validationJson.allowSave);
                rules.push(rule);
            } else {
                this.logger.logError(
                    `ActivityConverter.ActivityValidatorBuilder`,
                    `Received unknown type of validation rule named: ${validationJson.rule}`);
            }
        }
        if (questionBlock.questionType === QuestionType.Date) {
            rules.push(new ActivityDateNavyValidationRule(questionBlock, this.dateService));
        }
        return rules;
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
}
