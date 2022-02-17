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
import { QuestionType } from '../../models/activity/questionType';
import { ActivityFileQuestionBlock } from '../../models/activity/activityFileQuestionBlock';
import { ActivityMatrixQuestionBlock } from '../../models/activity/activityMatrixQuestionBlock';
import * as _ from 'underscore';
import { PicklistRenderMode } from '../../models/activity/picklistRenderMode';
import { ActivityInstanceSelectQuestionBlock } from '../../models/activity/activityInstanceSelectQuestionBlock';
import { ActivityDecimalQuestionBlock } from '../../models/activity/activityDecimalQuestionBlock';
import { ValidationRuleType } from './validationRuleType';
import { DecimalHelper } from '../../utility/decimalHelper';

const DETAIL_MAXLENGTH = 500;

@Injectable()
export class ActivityQuestionConverter {
    private questionBuilders: Array<ActivityRule>;
    private readonly LOG_SOURCE = 'ActivityQuestionConverter';

    constructor(
        private validatorBuilder: ActivityValidatorBuilder,
        private suggestionBuilder: ActivitySuggestionBuilder,
        private logger: LoggingService
    ) {
        this.initQuestionBuilders();
    }

    public buildQuestionBlock(questionJson: any, displayNumber: number | null): ActivityQuestionBlock<any> | null {
        let questionBlock: ActivityQuestionBlock<any>;
        const builder = this.questionBuilders.find(x => x.type === questionJson.questionType);
        if (builder) {
            questionBlock = builder.func(questionJson);
        } else {
            this.logger.logError(this.LOG_SOURCE,
                `Received question of type ${questionJson.questionType} that we do not know how to handle`);
            return null;
        }
        if (!_.isUndefined(questionJson.placeholderText)) {
            questionBlock.placeholder = questionJson.placeholderText;
        }
        questionBlock.question = questionJson.prompt;
        questionBlock.additionalInfoHeader = questionJson.additionalInfoHeader;
        questionBlock.additionalInfoFooter = questionJson.additionalInfoFooter;
        questionBlock.stableId = questionJson.stableId;
        questionBlock.tooltip = questionJson.tooltip;
        questionBlock.readonly = questionJson.readonly;
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
            } else if (questionJson.questionType === QuestionType.Matrix) {
                const matrixBlock = questionBlock as ActivityMatrixQuestionBlock;
                const [answer] = questionJson.answers;

                matrixBlock.answerId = answer?.answerGuid;
                matrixBlock.answer = answer?.value;
            } else {
                questionBlock.answerId = questionJson.answers[0].answerGuid;
                const valueForQuestion = questionJson.answers[0].value;
                // case where we are getting answer for composite
                if (_.isArray(valueForQuestion)) {
                    const answer = (valueForQuestion as any[][]).map(rowOfValues => {
                        if (_.isArray(rowOfValues)) {
                            // eslint-disable-next-line arrow-body-style
                            return (rowOfValues as any[]).map(eachValue => {
                                // todo this object signature ought to have its own interface
                                return eachValue !== null ? {value: eachValue.value, stableId: questionJson.stableId} : null;
                            });
                        } else {
                            return null;
                        }
                    });
                    questionBlock.setAnswer(answer, false);
                } else {
                    questionBlock.answer = valueForQuestion;
                    if (questionJson.questionType === 'TEXT' && questionJson.confirmEntry) {
                        const textQuestion = questionBlock as ActivityTextQuestionBlock;
                        textQuestion.confirmationAnswer = textQuestion.answer;
                    }
                }
            }
        }
        return questionBlock;
    }

    private isQuestionRequired(questionValidators: Array<ActivityAbstractValidationRule>): boolean {
        return questionValidators.some(validator => validator instanceof ActivityRequiredValidationRule);
    }

    private filterPicklistOptions(options: Array<ActivityPicklistOption>, renderMode): Array<ActivityPicklistOption> {
        return options.filter(option => !option.groupId
            && (renderMode !== PicklistRenderMode.AUTOCOMPLETE
                || (renderMode === PicklistRenderMode.AUTOCOMPLETE && !option.allowDetails)));
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

    private initQuestionBuilders(): void {
        this.questionBuilders = [
            {
                type: QuestionType.Boolean,
                func: (questionJson) => this.getBooleanBlock(questionJson)
            },
            {
                type: QuestionType.Text,
                func: (questionJson) => this.getTextBlock(questionJson)
            },
            {
                type: QuestionType.Numeric,
                func: (questionJson) => this.getNumericBlock(questionJson)
            },
            {
                type: QuestionType.Decimal,
                func: (questionJson) => this.getDecimalBlock(questionJson)
            },
            {
                type: QuestionType.Picklist,
                func: (questionJson) => this.getPicklistBlock(questionJson)
            },
            {
                type: QuestionType.Date,
                func: (questionJson) => this.getDateBlock(questionJson)
            },
            {
                type: QuestionType.Composite,
                func: (questionJson) => this.getCompositeBlock(questionJson)
            },
            {
                type: QuestionType.Agreement,
                func: () => new ActivityAgreementQuestionBlock()
            },
            {
                type: QuestionType.File,
                func: (questionJson) => this.getFileBlock(questionJson)
            },
            {
                type: QuestionType.Matrix,
                func: (questionJson) => this.getMatrixBlock(questionJson),
            },
            {
                type: QuestionType.ActivityInstanceSelect,
                func: (questionJson) => this.getActivityInstanceSelectBlock(questionJson)
            }
        ];
    }

    private getBooleanBlock(questionJson: any): ActivityBooleanQuestionBlock {
        const booleanBlock = new ActivityBooleanQuestionBlock();
        booleanBlock.trueContent = questionJson.trueContent;
        booleanBlock.falseContent = questionJson.falseContent;
        return booleanBlock;
    }

    private getTextBlock(questionJson: any): ActivityTextQuestionBlock {
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
        textBlock.confirmPlaceholder = questionJson.confirmPlaceholderText;
        textBlock.mismatchMessage = questionJson.mismatchMessage;
        textBlock.inputType = questionJson.inputType;
        textBlock.textSuggestionSource = this.suggestionBuilder.getSuggestionProvider(questionJson);
        return textBlock;
    }

    private getNumericBlock(questionJson: any): ActivityNumericQuestionBlock {
        const numericBlock = new ActivityNumericQuestionBlock();
        numericBlock.placeholder = questionJson.placeholderText;
        const intRangeValidation = questionJson.validations.find(validation => validation.rule === ValidationRuleType.IntRange);
        if (intRangeValidation) {
            numericBlock.min = intRangeValidation.min || null;
            numericBlock.max = intRangeValidation.max || null;
        }
        return numericBlock;
    }

    private getDecimalBlock(questionJson: any): ActivityDecimalQuestionBlock {
        const decimalBlock = new ActivityDecimalQuestionBlock();
        decimalBlock.placeholder = questionJson.placeholderText;
        if (questionJson.scale) {
            decimalBlock.scale = questionJson.scale;
        }
        const decimalRangeValidation = questionJson.validations.find(validation => validation.rule === ValidationRuleType.DecimalRange);
        if (decimalRangeValidation) {
            decimalBlock.min = decimalRangeValidation.min && DecimalHelper.mapDecimalAnswerToNumber(decimalRangeValidation.min) || null;
            decimalBlock.max = decimalRangeValidation.max && DecimalHelper.mapDecimalAnswerToNumber(decimalRangeValidation.max) || null;
        }
        return decimalBlock;
    }

    private getPicklistBlock(questionJson: any): ActivityPicklistQuestionBlock {
        const picklistBlock = new ActivityPicklistQuestionBlock();
        picklistBlock.customValue = questionJson.picklistOptions.find(option => option.allowDetails)?.stableId || null;
        picklistBlock.picklistOptions = this.filterPicklistOptions(questionJson.picklistOptions, questionJson.renderMode);
        picklistBlock.picklistLabel = questionJson.picklistLabel;
        picklistBlock.selectMode = questionJson.selectMode;
        picklistBlock.renderMode = questionJson.renderMode;
        picklistBlock.detailMaxLength = DETAIL_MAXLENGTH;
        picklistBlock.picklistGroups = this.convertPicklistGroups(questionJson.picklistOptions, questionJson.groups);
        return picklistBlock;
    }

    private getDateBlock(questionJson: any): ActivityDateQuestionBlock {
        const dateBlock = new ActivityDateQuestionBlock();
        dateBlock.renderMode = questionJson.renderMode;
        dateBlock.fields = questionJson.fields;
        dateBlock.placeholder = questionJson.placeholder;
        dateBlock.displayCalendar = questionJson.displayCalendar;
        if (dateBlock.renderMode === DateRenderMode.Picklist) {
            // Use loose null check and normalize missing/nulled properties to undefined.
            dateBlock.useMonthNames = (questionJson.useMonthNames == null ? undefined : questionJson.useMonthNames);
            dateBlock.startYear = (questionJson.startYear == null ? undefined : questionJson.startYear);
            dateBlock.endYear = (questionJson.endYear == null ? undefined : questionJson.endYear);
            dateBlock.firstSelectedYear = (questionJson.firstSelectedYear == null ? undefined : questionJson.firstSelectedYear);
        }
        return dateBlock;
    }

    private getCompositeBlock(questionJson: any): ActivityCompositeQuestionBlock {
        const newBlock = new ActivityCompositeQuestionBlock();
        newBlock.addButtonText = questionJson.addButtonText;
        newBlock.allowMultiple = questionJson.allowMultiple;
        newBlock.childOrientation = questionJson.childOrientation;
        newBlock.allowMultiple && (newBlock.additionalItemText = questionJson.additionalItemText);
        newBlock.children = (questionJson.children as ActivityQuestionBlock<any>[])
            .map(childInputBlock => this.buildQuestionBlock(childInputBlock, null))
            .filter(block => block !== null);
        return newBlock;
    }

    private getFileBlock(questionJson: any): ActivityFileQuestionBlock {
        const fileBlock = new ActivityFileQuestionBlock();
        fileBlock.maxFileSize = questionJson.maxFileSize;
        fileBlock.mimeTypes = questionJson.mimeTypes;

        return fileBlock;
    }

    private getMatrixBlock(questionJson: any): any {
        const matrixBlock = new ActivityMatrixQuestionBlock();

        matrixBlock.selectMode = questionJson.selectMode;
        matrixBlock.questions = questionJson.questions;
        matrixBlock.options = questionJson.options;
        matrixBlock.groups = questionJson.groups;
        matrixBlock.renderMode = questionJson.renderMode;
        matrixBlock.openBtnText = questionJson.modal;
        matrixBlock.modalTitle = questionJson.modalTitle;
        return matrixBlock;
    }

    private getActivityInstanceSelectBlock(questionJson: any): ActivityInstanceSelectQuestionBlock {
        const activityInstanceSelectBlock = new ActivityInstanceSelectQuestionBlock();

        return activityInstanceSelectBlock;
    }
}
