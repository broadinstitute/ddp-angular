import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { takeUntil, tap } from 'rxjs/operators';

import { ActivityQuestionConverter, ActivityTextQuestionBlock } from 'ddp-sdk';
import { QuestionBlockDef } from '../../model/core/questionBlockDef';
import { TextQuestionDef } from '../../model/core/textQuestionDef';
import { ConfigurationService } from '../../configuration.service';
import { SimpleTemplate } from '../../model/core-extended/simpleTemplate';
import { BaseBlockComponent } from './base-block.component';

@Component({
    selector: 'app-text-question-block',
    templateUrl: './text-question-block.component.html',
    styleUrls: ['./text-question-block.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextQuestionBlockComponent
    extends BaseBlockComponent<QuestionBlockDef<TextQuestionDef>, ActivityTextQuestionBlock, string>
    implements OnInit {

    protected defaultAnswer = '';
    private blockCurrentAnswer = '';

    constructor(
        protected config: ConfigurationService,
        private questionConverter: ActivityQuestionConverter
    ) {
        super();
    }

    ngOnInit(): void {
        this.angularClientBlock$ = this.getAngularClientBlock$().pipe(
            tap((block: ActivityTextQuestionBlock) => this.validate(block))
        );
    }

    valueChanged(value: string): void {
        this.blockCurrentAnswer = value;
        this.angularClientBlock$.pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe((block: ActivityTextQuestionBlock) => this.validate(block, value));
    }

    protected buildFromDef(defBlock: QuestionBlockDef<TextQuestionDef>): ActivityTextQuestionBlock {
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
}
