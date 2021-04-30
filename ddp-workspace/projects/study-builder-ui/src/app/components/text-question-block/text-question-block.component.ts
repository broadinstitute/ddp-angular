import { AfterContentChecked, AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { QuestionBlockDef } from '../../model/questionBlockDef';
import { ActivityTextQuestionBlock } from 'ddp-sdk';
import { TextQuestionDef } from '../../model/textQuestionDef';
import { BehaviorSubject } from 'rxjs';
import { ConfigurationService } from '../../configuration.service';
import { filter, tap } from 'rxjs/operators';
import { SimpleTemplate } from '../../model/simpleTemplate';

@Component({
    selector: 'app-text-question-block',
    templateUrl: './text-question-block.component.html',
    styleUrls: ['./text-question-block.component.scss']
})
export class TextQuestionBlockComponent implements OnInit {
    private definitionBlockSubject = new BehaviorSubject<QuestionBlockDef<TextQuestionDef | null>>(null);

    @Input()
    set definitionBlock(block: BehaviorSubject<QuestionBlockDef<TextQuestionDef>>) {
        this.definitionBlockSubject = block;
    }

    angularClientBlockSubject = new BehaviorSubject<ActivityTextQuestionBlock | null>(null);
    // @Input()definitionBlock: QuestionBlockDef<TextQuestionDef>;
    angularClientBlock: ActivityTextQuestionBlock;

    constructor(private config: ConfigurationService) {
    }


    ngOnInit(): void {
        this.definitionBlockSubject.pipe(
            tap(defBlock => console.log('getting defblock: %o', defBlock)),
            filter(block => !!block),
            tap(defBlock => this.angularClientBlock = this.buildFromDef(defBlock))
        ).subscribe();
    }

    private buildFromDef(defBlock: QuestionBlockDef<TextQuestionDef>): ActivityTextQuestionBlock {
        const newClientBlock = new ActivityTextQuestionBlock();
        const questionDef = defBlock.question;
        newClientBlock.inputType = questionDef.inputType;
        newClientBlock.isRequired = questionDef.validations.some(val => val.ruleType === 'REQUIRED');
        newClientBlock.stableId = questionDef.stableId;
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
