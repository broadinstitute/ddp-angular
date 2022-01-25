import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';

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
    private ngUnsubscribe = new Subject<void>();

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
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    valueChanged(value: string): void {
        this.blockCurrentAnswer = value;
        this.angularClientBlock$.pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe((block: ActivityTextQuestionBlock) => this.validate(block, value));
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
}
