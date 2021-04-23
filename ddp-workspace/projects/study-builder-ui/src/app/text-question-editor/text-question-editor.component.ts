import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { QuestionBlockDef } from '../model/questionBlockDef';
import { FormBuilder } from '@angular/forms';
import { TextQuestionDef } from '../model/textQuestionDef';
import { BehaviorSubject, merge, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { ConfigurationService } from '../configuration.service';
import { SimpleTemplate } from '../model/simpleTemplate';

@Component({
    selector: 'app-text-question-editor',
    templateUrl: './text-question-editor.component.html',
    styleUrls: ['./text-question-editor.component.scss']
})
export class TextQuestionEditorComponent implements OnInit, OnDestroy {
    private questionBlockSubject: BehaviorSubject<QuestionBlockDef | null> = new BehaviorSubject(null);

    @Input()
    set questionBlock(questionBlock: QuestionBlockDef) {
        this.questionBlockSubject.next(questionBlock);
    }

    formGroup = this.fb.group({
        inputType: [''],
        stableId: [''],
        prompt: [''],
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
            tap(formData => this.updateQuestion(formData))
        );
        this.sub = merge(updateFormPipe, updateQuestionPipe).subscribe();
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    private updateForm(question: TextQuestionDef): void {
        const simplifiedPromptTemplate = new SimpleTemplate(question.promptTemplate);
        this.formGroup.patchValue({
            inputType: question.inputType,
            guid: question.stableId,
            prompt: simplifiedPromptTemplate.getTranslationText(this.config.defaultLanguageCode),
            required: question.validations.some(val => val.ruleType === 'REQUIRED')
        });
    }

    private updateQuestion(formData: any): void {
        const question = this.currentQuestion();
        if (!question) {
            return;
        }
        const simplifiedPromptTemplate = new SimpleTemplate(question.promptTemplate);
        simplifiedPromptTemplate.setTranslationText(this.config.defaultLanguageCode, formData.prompt);
        question.promptTemplate = simplifiedPromptTemplate.toTemplate();
        question.inputType = formData.inputType;
        question.stableId = formData.stableId;
        question.validations = formData.required ? [{ ruleType: 'REQUIRED', hintTemplate: null }] : [];
    }

    private currentQuestion(): TextQuestionDef | null {
        return this.questionBlockSubject.getValue()?.question as TextQuestionDef;
    }
}
