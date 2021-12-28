import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { QuestionBlockDef } from '../../model/core/questionBlockDef';
import { ActivityTextQuestionBlock } from 'ddp-sdk';
import { TextQuestionDef } from '../../model/core/textQuestionDef';
import { ConfigurationService } from '../../configuration.service';
import { SimpleTemplate } from '../../model/core-extended/simpleTemplate';
import { ActivityQuestionConverter } from '../../../../../ddp-sdk/src/lib/services/activity/activityQuestionConverter.service';

@Component({
    selector: 'app-text-question-block',
    templateUrl: './text-question-block.component.html',
    styleUrls: ['./text-question-block.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextQuestionBlockComponent implements OnInit {

    @Input()
    definitionBlock$: Observable<QuestionBlockDef<TextQuestionDef>>;
    angularClientBlock$: Observable<ActivityTextQuestionBlock>;

    constructor(
        private config: ConfigurationService,
        private questionConverter: ActivityQuestionConverter
    ) {}

    ngOnInit(): void {
        this.angularClientBlock$ = this.definitionBlock$.pipe(
            tap(defBlock => console.log('getting defblock: %o', defBlock)),
            filter(block => !!block),
            map(defBlock => this.buildFromDef(defBlock)));
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
        return newClientBlock;
    }


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
