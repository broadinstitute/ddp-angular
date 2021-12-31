import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, merge, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { QuestionBlockDef } from '../../model/core/questionBlockDef';
import { TextQuestionDef } from '../../model/core/textQuestionDef';
import { SimpleTemplate } from '../../model/core-extended/simpleTemplate';
import { RuleDef } from '../../model/core/ruleDef';
import { ConfigurationService } from '../../configuration.service';

@Component({
    selector: 'app-text-question-editor',
    templateUrl: './text-question-editor.component.html',
    styleUrls: ['./text-question-editor.component.scss']
})
export class TextQuestionEditorComponent implements OnInit, OnDestroy {
    private questionBlockSubject: BehaviorSubject<QuestionBlockDef<TextQuestionDef> | null> = new BehaviorSubject(null);

    @Input()
    set questionBlock(questionBlock: QuestionBlockDef<TextQuestionDef>) {
        this.questionBlockSubject.next(questionBlock);
    }
    @Output()
    questionBlockChanged = new EventEmitter<QuestionBlockDef<TextQuestionDef>>();

    formGroup = this.fb.group({
        inputType: [''],
        stableId: [''],
        prompt: [''],
        placeholder: ['']
    });
    initialValidators: RuleDef[];
    private sub: Subscription;

    constructor(
        private fb: FormBuilder,
        private config: ConfigurationService
    ) {}

    ngOnInit(): void {
        const updateFormPipe = this.questionBlockSubject.pipe(
            filter(block => !!block),
            map(block => block.question),
            tap(question => {
                this.initValidators(question);
                this.updateForm(question as TextQuestionDef);
            })
        );
        const updateQuestionPipe = this.formGroup.valueChanges.pipe(
            map(formData => this.updateQuestion(formData)),
            tap(() => this.questionBlockChanged.emit(this.questionBlockSubject.getValue()))
        );
        this.sub = merge(updateFormPipe, updateQuestionPipe).subscribe();
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    changeValidators(validationRules) {
        const question = this.currentQuestion();
        if (!question) {
            return;
        }
        question.validations = validationRules || [];
        this.questionBlockChanged.emit(this.questionBlockSubject.getValue());
    }

    private initValidators(question: TextQuestionDef): void {
        this.initialValidators = question.validations;
    }

    private updateForm(question: TextQuestionDef): void {
        const simplifiedPromptTemplate = new SimpleTemplate(question.promptTemplate);
        const simplifiedPlaceholderTemplate = new SimpleTemplate(question.placeholderTemplate);
        this.formGroup.patchValue({
            inputType: question.inputType,
            stableId: question.stableId,
            prompt: simplifiedPromptTemplate.getTranslationText(this.config.defaultLanguageCode),
            placeholder: simplifiedPlaceholderTemplate.getTranslationText(this.config.defaultLanguageCode)
        });
    }

    private updateQuestion(formData: any): TextQuestionDef {
        const question = this.currentQuestion();
        if (!question) {
            return;
        }
        const simplifiedPromptTemplate = new SimpleTemplate(question.promptTemplate);
        const simplifiedPlaceholderTemplate = new SimpleTemplate(question.placeholderTemplate);
        simplifiedPromptTemplate.setTranslationText(this.config.defaultLanguageCode, formData.prompt);
        simplifiedPlaceholderTemplate.setTranslationText(this.config.defaultLanguageCode, formData.placeholder);
        question.promptTemplate = simplifiedPromptTemplate.toTemplate();
        question.placeholderTemplate = simplifiedPlaceholderTemplate.toTemplate();
        question.inputType = formData.inputType;
        question.stableId = formData.stableId;
        return question;
    }

    private currentQuestion(): TextQuestionDef | null {
        return this.questionBlockSubject.getValue()?.question as TextQuestionDef;
    }
}
