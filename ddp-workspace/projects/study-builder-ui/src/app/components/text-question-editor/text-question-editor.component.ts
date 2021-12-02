import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { QuestionBlockDef } from '../../model/core/questionBlockDef';
import { FormBuilder } from '@angular/forms';
import { TextQuestionDef } from '../../model/core/textQuestionDef';
import { BehaviorSubject, merge, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { ConfigurationService } from '../../configuration.service';
import { SimpleTemplate } from '../../model/core-extended/simpleTemplate';

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
        placeholder: [''],
        required: [false]
    });

    private sub: Subscription;

    constructor(private fb: FormBuilder, private config: ConfigurationService) {
    }

    ngOnInit(): void {
        const updateFormPipe = this.questionBlockSubject.pipe(
            filter(block => !!block),
            map(block => block.question),
            tap(question => this.updateForm(question as TextQuestionDef))
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

    private updateForm(question: TextQuestionDef): void {
        const simplifiedPromptTemplate = new SimpleTemplate(question.promptTemplate);
        const simplifiedPlaceholderTemplate = new SimpleTemplate(question.placeholderTemplate);
        this.formGroup.patchValue({
            inputType: question.inputType,
            guid: question.stableId,
            prompt: simplifiedPromptTemplate.getTranslationText(this.config.defaultLanguageCode),
            placeholder: simplifiedPlaceholderTemplate.getTranslationText(this.config.defaultLanguageCode),
            required: question.validations.some(val => val.ruleType === 'REQUIRED')
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
        question.validations = formData.required ? [{ ruleType: 'REQUIRED', hintTemplate: null }] : [];
        return question;
    }

    private currentQuestion(): TextQuestionDef | null {
        return this.questionBlockSubject.getValue()?.question as TextQuestionDef;
    }
}
