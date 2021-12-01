import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { QuestionBlockDef } from '../../model/core/questionBlockDef';
import { FormBuilder, FormControl } from '@angular/forms';
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

    get selectMode(): FormControl {
        return this.formGroup.get('selectMode') as FormControl;
    }

    get renderMode(): FormControl {
        return this.formGroup.get('renderMode') as FormControl;
    }

    readonly modesCompatibilityMap = new Map<string, string[]>([
        ['SINGLE', ['LIST', 'CHECKBOX_LIST', 'DROPDOWN', 'AUTOCOMPLETE']],
        ['MULTIPLE', ['LIST', 'CHECKBOX_LIST', 'DROPDOWN']],
    ]);

    readonly renderModes = new Map<string, string>([
        ['LIST', 'List'],
        ['CHECKBOX_LIST', 'Checkbox list'],
        ['DROPDOWN', 'Dropdown'],
        ['AUTOCOMPLETE', 'Autocomplete list'],
    ]);

    readonly selectModes = new Map<string, string>([
        ['SINGLE', 'Single'],
        ['MULTIPLE', 'Multiple']
    ]);

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

    public allowCreateOptionsGroups(): boolean {
        const selectMode = this.formGroup.get('selectMode').value;
        const renderMode = this.formGroup.get('renderMode').value;
        return selectMode === 'MULTIPLE' && renderMode === 'LIST' || renderMode === 'CHECKBOX_LIST' || renderMode === 'AUTOCOMPLETE';
    }

    selectedSelectModeCompatibleWithRenderMode(renderMode: string): boolean {
        return this.modesCompatibilityMap.get(this.selectMode.value)?.includes(renderMode);
    }

    selectedRenderModeCompatibleWithSelectMode(selectMode: string): boolean {
        return this.modesCompatibilityMap.get(selectMode)?.includes(this.renderMode.value);
    }

    originalOrder(): number {
        return 0;
    }
}
