import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { ActivityTextQuestionBlock, ActivityQuestionConverter, ActivityQuestionComponent } from 'ddp-sdk';
import { QuestionBlockDef } from '../../model/core/questionBlockDef';
import { TextQuestionDef } from '../../model/core/textQuestionDef';
import { ConfigurationService } from '../../configuration.service';
import { SimpleTemplate } from '../../model/core-extended/simpleTemplate';

@Component({
    selector: 'app-text-question-block',
    templateUrl: './text-question-block.component.html',
    styleUrls: ['./text-question-block.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextQuestionBlockComponent implements OnInit, OnDestroy {
    @Input() definitionBlock$: Observable<QuestionBlockDef<TextQuestionDef>>;
    angularClientBlock$: Observable<ActivityTextQuestionBlock>;
    validationErrorMessages: string[] = [];
    private blockCurrentAnswer = '';
    private sub = new Subscription();

    constructor(
        private config: ConfigurationService,
        private questionConverter: ActivityQuestionConverter
    ) {}

    ngOnInit(): void {
        this.angularClientBlock$ = this.definitionBlock$.pipe(
            tap(defBlock => console.log('getting defblock: %o', defBlock)),
            filter(block => !!block),
            map(defBlock => this.buildFromDef(defBlock)),
            tap((block: ActivityTextQuestionBlock) => this.validate(block))
        );
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    valueChanged(value: string): void {
        this.blockCurrentAnswer = value;
        const valueChangedSub = this.angularClientBlock$.subscribe((block: ActivityTextQuestionBlock) => this.validate(block, value));
        this.sub.add(valueChangedSub);
    }

    private buildFromDef(defBlock: QuestionBlockDef<TextQuestionDef>): ActivityTextQuestionBlock {
        const questionDef = defBlock.question;
        const modifiedQuestionJson = {
            ...questionDef,
            validations: questionDef.validations.map(
                // rename `ruleType` keys to `rule`
                ({ruleType: rule, ...rest}) => ({rule, ...rest})
            )
        };

        const newClientBlock = this.questionConverter.buildQuestionBlock(modifiedQuestionJson, null) as ActivityTextQuestionBlock;

        newClientBlock.placeholder = new SimpleTemplate(questionDef.placeholderTemplate)
            .getTranslationText(this.config.defaultLanguageCode);
        newClientBlock.question = new SimpleTemplate(questionDef.promptTemplate).getTranslationText(this.config.defaultLanguageCode);

        if (this.blockCurrentAnswer) {
            newClientBlock.setAnswer(this.blockCurrentAnswer, false);
        }
        return newClientBlock;
    }

    private validate(block: ActivityTextQuestionBlock, answer: string = block.answer): void {
        block.setAnswer(answer || '', false);
        for (const validator of block.validators) {
            validator.recalculate();
        }
        this.validationErrorMessages = block.validators.map(validator => {
            const result = validator.result;
            return ActivityQuestionComponent.isActivityValidationResult(result) ? result.message : result;
        });
    }

    // private checkRequiredValidator(block: ActivityTextQuestionBlock): void {
    //     const requiredValidator = block.validators.
    //         filter((validator: ActivityAbstractValidationRule) => validator instanceof ActivityRequiredValidationRule)[0];
    //     if (!requiredValidator) return;
    //
    //     // block.setAnswer(block.answer || '');
    //     requiredValidator.recalculate();
    //     if (requiredValidator.result) {
    //         console.log('RES=', requiredValidator.result);
    //         this.validationErrorMessages[0] = requiredValidator.result as string;
    //     }
    // }


    // newClientBlock.placeholder = questionDef.placeholder;
    //
    //
    //   newClientBlock.label = questionDef.label;
    // newClientBlock.tooltip = questionDef.tooltip;
    //   newClientBlock.displayNumber = questionDef.displayNumber;
    // newClientBlock.readonly = questionDef.readonly;| false;
    //   newClientBlock.additionalInfoHeader = questionDef.additionalInfoHeader;
    //   newClientBlock.additionalInfoFooter = questionDef.additionalInfoFooter;
    //   newClientBlock.minLength = questionDef.minLength;
    //   newClientBlock.maxLength = questionDef.maxLength;
    //   newClientBlock.regexPattern = questionDef.regexPattern;
    //   newClientBlock.textSuggestionSource = questionDef.textSuggestionSource;
    //   newClientBlock.confirmEntry = questionDef.confirmEntry;
    //   newClientBlock.confirmPrompt = questionDef.confirmPrompt;
    //   newClientBlock.mismatchMessage = questionDef.mismatchMessage;

    // newClientBlock.displayNumber = questionDef.displayNumber;
    // public serverValidationMessages$: Observable<Array<string>>;
    // newClientBlock.validators = questionDef.validators;<ActivityAbstractValidationRule> = [];
    // private serverValidationMessagesSubject: BehaviorSubject<Array<string>> = new BehaviorSubject([]);
}
