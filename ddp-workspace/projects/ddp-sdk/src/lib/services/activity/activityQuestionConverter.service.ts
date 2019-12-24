import { Injectable } from '@angular/core';
import { LoggingService } from '../logging.service';
import { ActivitySuggestionBuilder } from './activitySuggestionBuilder.service';
import { ActivityValidatorBuilder } from './activityValidatorBuilder.service';
import { ActivityRule } from '../../models/activity/activityRule';
import { ActivityBooleanQuestionBlock } from '../../models/activity/activityBooleanQuestionBlock';
import { ActivityAgreementQuestionBlock } from '../../models/activity/activityAgreementQuestionBlock';
import { ActivityTextQuestionBlock } from '../../models/activity/activityTextQuestionBlock';
import { ActivityPicklistQuestionBlock } from '../../models/activity/activityPicklistQuestionBlock';
import { ActivityDateQuestionBlock } from '../../models/activity/activityDateQuestionBlock';
import { DateRenderMode } from '../../models/activity/dateRenderMode';
import { ActivityQuestionBlock } from '../../models/activity/activityQuestionBlock';
import { ActivityCompositeQuestionBlock } from '../../models/activity/activityCompositeQuestionBlock';
import { ActivityPicklistNormalizedGroup } from '../../models/activity/activityPicklistNormalizedGroup';
import { ActivityPicklistGroup } from './../../models/activity/activityPicklistGroup';
import { ActivityPicklistOption } from './../../models/activity/activityPicklistOption';
import { ActivityNumericQuestionBlock } from '../../models/activity/activityNumericQuestionBlock';
import { ActivityAbstractValidationRule } from './validators/activityAbstractValidationRule';
import { ActivityRequiredValidationRule } from './validators/activityRequiredValidationRule';
import * as _ from 'underscore';

const DETAIL_MAXLENGTH = 255;
@Injectable()
export class ActivityQuestionConverter {
    private questionBuilders: Array<ActivityRule>;

    constructor(
        private validatorBuilder: ActivityValidatorBuilder,
        private suggestionBuilder: ActivitySuggestionBuilder,
        private logger: LoggingService) {
        this.questionBuilders = [
            {
                type: 'BOOLEAN', func: (questionJson) => {
                    const booleanBlock = new ActivityBooleanQuestionBlock();
                    booleanBlock.trueContent = questionJson.trueContent;
                    booleanBlock.falseContent = questionJson.falseContent;
                    return booleanBlock;
                }
            },
            {
                type: 'TEXT', func: (questionJson) => {
                    // let's capture some of the validation into the textblock object itself
                    // make's it easier to apply validations in the widget
                    const textBlock = new ActivityTextQuestionBlock();
                    textBlock.placeholder = questionJson.placeholderText;
                    questionJson.validations.forEach(validation => {
                        if (validation.minLength !== undefined) {
                            textBlock.minLength = validation.minLength;
                        }
                        if (validation.maxLength !== undefined) {
                            textBlock.maxLength = validation.maxLength;
                        }
                        if (validation.regexPattern !== undefined) {
                            textBlock.regexPattern = validation.regexPattern;
                        }
                    });
                    textBlock.confirmEntry = questionJson.confirmEntry;
                    textBlock.confirmPrompt = questionJson.confirmPrompt;
                    textBlock.mismatchMessage = questionJson.mismatchMessage;
                    textBlock.inputType = questionJson.inputType;
                    textBlock.textSuggestionSource = this.suggestionBuilder.getSuggestionProvider(questionJson);
                    return textBlock;
                }
            },
            {
                type: 'NUMERIC', func: (questionJson) => {
                    const numericBlock = new ActivityNumericQuestionBlock();
                    numericBlock.placeholder = questionJson.placeholderText;
                    numericBlock.numericType = questionJson.numericType;
                    questionJson.validations.forEach(validation => {
                        if (_.isNumber(validation.min)) {
                            numericBlock.min = validation.min;
                        }
                        if (_.isNumber(validation.max)) {
                            numericBlock.max = validation.max;
                        }
                    });
                    return numericBlock;
                }
            },
            {
                type: 'PICKLIST', func: (questionJson) => {
                    const picklistBlock = new ActivityPicklistQuestionBlock();
                    picklistBlock.picklistOptions = this.filterPicklistOptions(questionJson.picklistOptions);
                    picklistBlock.picklistLabel = questionJson.picklistLabel;
                    picklistBlock.selectMode = questionJson.selectMode;
                    picklistBlock.renderMode = questionJson.renderMode;
                    picklistBlock.detailMaxLength = DETAIL_MAXLENGTH;
                    picklistBlock.picklistGroups = this.convertPicklistGroups(questionJson.picklistOptions, questionJson.groups);
                    return picklistBlock;
                }
            },
            {
                type: 'DATE', func: (questionJson) => {
                    const dateBlock = new ActivityDateQuestionBlock();
                    dateBlock.renderMode = questionJson.renderMode;
                    dateBlock.fields = questionJson.fields;
                    dateBlock.placeholder = questionJson.placeholder;
                    dateBlock.displayCalendar = questionJson.displayCalendar;
                    if (dateBlock.renderMode === DateRenderMode.Picklist) {
                        // Use loose null check and normalize missing/nulled properties to undefined.
                        dateBlock.useMonthNames = (questionJson.useMonthNames == null
                            ? undefined : questionJson.useMonthNames);
                        dateBlock.startYear = (questionJson.startYear == null
                            ? undefined : questionJson.startYear);
                        dateBlock.endYear = (questionJson.endYear == null
                            ? undefined : questionJson.endYear);
                        dateBlock.firstSelectedYear = (questionJson.firstSelectedYear == null
                            ? undefined : questionJson.firstSelectedYear);
                    }
                    return dateBlock;
                }
            },
            {
                type: 'COMPOSITE', func: (questionJson) => {
                    const newBlock = new ActivityCompositeQuestionBlock();
                    newBlock.addButtonText = questionJson.addButtonText;
                    newBlock.allowMultiple = questionJson.allowMultiple;
                    newBlock.childOrientation = questionJson.childOrientation;
                    newBlock.allowMultiple && (newBlock.additionalItemText = questionJson.additionalItemText);
                    newBlock.children = (questionJson.children as ActivityQuestionBlock<any>[])
                        .map(childInputBlock => this.buildQuestionBlock(childInputBlock, null))
                        .filter(block => block != null);
                    return newBlock;
                }
            },
            {
                type: 'AGREEMENT', func: (questionJson) => {
                    return new ActivityAgreementQuestionBlock();
                }
            }
        ];
    }

    public buildQuestionBlock(questionJson: any, displayNumber: number | null): ActivityQuestionBlock<any> | null {
        let questionBlock: ActivityQuestionBlock<any>;
        const builder = this.questionBuilders.find(x => x.type === questionJson.questionType);
        if (builder) {
            questionBlock = builder.func(questionJson);
        } else {
            this.logger.logError(
                `ActivityConverter.ActivityQuestionConverter`,
                `Received question of type ${questionJson.questionType} that we do not know how to handle`);
            return null;
        }
        if (!_.isUndefined(questionJson.placeholderText)) {
            questionBlock.placeholder = questionJson.placeholderText;
        }
        questionBlock.question = questionJson.prompt;
        questionBlock.stableId = questionJson.stableId;
        questionBlock.displayNumber = displayNumber;
        questionBlock.serverValidationMessages = questionJson.validationFailures ?
            questionJson.validationFailures.map(validationFailure => validationFailure.message) : [];

        for (const newValidator of this.validatorBuilder.buildQuestionValidatorRule(questionJson, questionBlock)) {
            questionBlock.validators.push(newValidator);
        }
        questionBlock.isRequired = this.isQuestionRequired(questionBlock.validators);

        if (questionJson.answers && questionJson.answers.length > 0) {
            if (questionJson.questionType === 'PICKLIST') {
                const picklist = questionBlock as ActivityPicklistQuestionBlock;
                if (picklist) {
                    picklist.answerId = questionJson.answers[0].answerGuid;
                    picklist.answer = questionJson.answers[0].value;
                }
            } else {
                questionBlock.answerId = questionJson.answers[0].answerGuid;
                const valueForQuestion = questionJson.answers[0].value;
                // case where we are getting answer for composite
                if (_.isArray(valueForQuestion)) {
                    const answer = (valueForQuestion as any[][]).map(rowOfValues => {
                        if (_.isArray(rowOfValues)) {
                            return (rowOfValues as any[]).map(eachValue => {
                                // todo this object signature ought to have its own interface
                                return eachValue !== null ? { value: eachValue.value, stableId: questionJson.stableId } : null;
                            });
                        } else {
                            return null;
                        }
                    });
                    questionBlock.setAnswer(answer, false);
                } else {
                    questionBlock.answer = valueForQuestion;
                }
            }
        }
        return questionBlock;
    }

    private isQuestionRequired(questionValidators: Array<ActivityAbstractValidationRule>): boolean {
        return questionValidators.some(validator => validator instanceof ActivityRequiredValidationRule);
    }

    private filterPicklistOptions(options: Array<ActivityPicklistOption>): Array<ActivityPicklistOption> {
        return options.filter(option => !option.groupId);
    }

    private convertPicklistGroups(options: Array<ActivityPicklistOption>,
        groups: Array<ActivityPicklistGroup>): Array<ActivityPicklistNormalizedGroup> {
        return groups.map(group => {
            const convertedGroup = {} as ActivityPicklistNormalizedGroup;
            const groupedOptions: Array<ActivityPicklistOption> = options.filter(option =>
                group.identifier === option.groupId);
            convertedGroup.name = group.name;
            convertedGroup.options = groupedOptions;
            return convertedGroup;
        });
    }
}
