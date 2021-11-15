import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { QuestionBlockDef } from '../../model/core/questionBlockDef';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, merge, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { ConfigurationService } from '../../configuration.service';
import { SimpleTemplate } from '../../model/core-extended/simpleTemplate';
import { PicklistQuestionDef } from '../../model/core/picklistQuestionDef';

@Component({
    selector: 'app-picklist-question-editor',
    templateUrl: './picklist-question-editor.component.html',
    styleUrls: ['./picklist-question-editor.component.scss']
})
export class PicklistQuestionEditorComponent implements OnInit, OnDestroy {
    private questionBlockSubject: BehaviorSubject<QuestionBlockDef<PicklistQuestionDef> | null> = new BehaviorSubject(null);

    @Input()
    set questionBlock(questionBlock: QuestionBlockDef<PicklistQuestionDef>) {
        this.questionBlockSubject.next(questionBlock);
    }
    @Output()
    questionBlockChanged = new EventEmitter<QuestionBlockDef<PicklistQuestionDef>>();

    formGroup = this.fb.group({
        selectMode: [''],
        renderMode: [''],
        stableId: [''],
        prompt: [''],
        label: [''],
        required: [false],
        optionsData: [{options: [], groups: []}]
    });

    private sub: Subscription;

    constructor(private fb: FormBuilder, private config: ConfigurationService) {
    }

    ngOnInit(): void {
        const updateFormPipe = this.questionBlockSubject.pipe(
            filter(block => !!block),
            map(block => block.question),
            tap(question => this.updateForm(question as PicklistQuestionDef))
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

    private updateForm(question: PicklistQuestionDef): void {
        const simplifiedPromptTemplate = new SimpleTemplate(question.promptTemplate);
        const simplifiedLabelTemplate = new SimpleTemplate(question.picklistLabelTemplate);
        this.formGroup.patchValue({
            selectMode: question.selectMode,
            renderMode: question.renderMode,
            stableId: question.stableId,
            prompt: simplifiedPromptTemplate.getTranslationText(this.config.defaultLanguageCode),
            label: simplifiedLabelTemplate.getTranslationText(this.config.defaultLanguageCode),
            required: question.validations.some(val => val.ruleType === 'REQUIRED'),
            optionsData: { options: question.picklistOptions, groups: question.groups },
        });
    }

    private updateQuestion(formData: any): PicklistQuestionDef {
        const question = this.currentQuestion();
        if (!question) {
            return;
        }
        const simplifiedPromptTemplate = new SimpleTemplate(question.promptTemplate);
        const simplifiedLabelTemplate = new SimpleTemplate(question.picklistLabelTemplate);
        simplifiedPromptTemplate.setTranslationText(this.config.defaultLanguageCode, formData.prompt);
        simplifiedLabelTemplate.setTranslationText(this.config.defaultLanguageCode, formData.label);
        question.promptTemplate = simplifiedPromptTemplate.toTemplate();
        question.picklistLabelTemplate = simplifiedLabelTemplate.toTemplate();
        question.stableId = formData.stableId;
        question.validations = formData.required ? [{ ruleType: 'REQUIRED', hintTemplate: null }] : [];
        question.selectMode = formData.selectMode;
        question.renderMode = formData.renderMode;
        question.picklistOptions = formData.optionsData.options;
        question.groups = formData.optionsData.groups;
        return question;
    }

    private currentQuestion(): PicklistQuestionDef | null {
        return this.questionBlockSubject.getValue()?.question as PicklistQuestionDef;
    }
}
