import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivityDef } from '../model/activityDef';
import { BasicActivityDef } from '../model/basicActivityDef';
import { FormSectionDef } from '../model/formSectionDef';
import { ContentBlockDef } from '../model/contentBlockDef';
import { ConfigurationService } from '../configuration.service';
import { TestBostonConsent } from '../testdata/testbostonConsent';
import { TestBostonCovidSurvey } from '../testdata/testbostonCovidSurvey';
import { tap } from 'rxjs/operators';
import { TextQuestionDef } from '../model/textQuestionDef';
import { Template } from '../model/template';
import { QuestionBlockDef } from '../model/questionBlockDef';
import { FormBlockDef } from '../model/formBlockDef';
import { ObservableActivityDef } from '../model/observableActvityDef';
import { ObservableFormSectionDef } from '../model/observableFormSectionDef';

// @TODO: Scope this service to one instance per activity editor
@Injectable({
    providedIn: 'root'
})
export class ActivityDefinitionEditorService  {
    private currentActivityDefSubject = new BehaviorSubject<ObservableActivityDef | null>(null);
    readonly currentActivityDef$: Observable<ActivityDef | null> = this.currentActivityDefSubject.asObservable();
    private allActivityDefinitionsSubject = new BehaviorSubject<Array<ObservableActivityDef>>([new ObservableActivityDef(TestBostonCovidSurvey)]);
    readonly allActivityDefinitions$ = this.allActivityDefinitionsSubject.asObservable();
    // the subject for block that is being currently edited
    private currentBlockDefSubject = new BehaviorSubject<FormBlockDef | null>(null);
    readonly currentBlockDef$: Observable<FormBlockDef | null> = this.currentBlockDefSubject.asObservable();
    // the subject that contains block that has been selected in canvas
    private selectedBlockSubject: BehaviorSubject<FormBlockDef>;

    constructor(private config: ConfigurationService) {
        this.currentActivityDef$.pipe(
            tap(() => this.currentBlockDefSubject.next(null)),
            tap(() => this.selectedBlockSubject = null)
    //        tap(activityOrNull => this.currentSectionDefSubject.next(activityOrNull ? activityOrNull.sections[0] : null))
        ).subscribe();
    }

    // @TODO: Move this to a persistence service when the time comes
    public findAllActivityDefinitions(studyGuid: string): Observable<Array<ObservableActivityDef>> {
        return this.allActivityDefinitions$;
    }

    public setCurrentActivity(activity: ObservableActivityDef): void {
        this.currentActivityDefSubject.next(activity ? activity : null);
    }

    public createNewBlankActivityDefinition(studyGuid: string): ObservableActivityDef {
        const newDef = this.createDefaultActivityDef(studyGuid, this.buildDefaultActivityCode());
        this.allActivityDefinitionsSubject.next(this.allActivityDefinitionsSubject.value.concat(newDef));
        return newDef;
    }

    public addBlankContentBlockToActivity(): void {
      this.addNewBlock(this.createDefaultContentBlock());
    }

    public addBlankTextQuestionBlockToActivity(): void {
        this.addNewBlock(this.createDefaultTextQuestionBlock());
    }

    private addNewBlock(newBlock: FormBlockDef): void {
        this.selectedBlockSubject = this.currentActivityDefSubject.value.sectionsSubjects[0].value.addBlock(newBlock);
        this.currentBlockDefSubject.next(newBlock);
    }

    private createDefaultTextQuestionBlock(): QuestionBlockDef<TextQuestionDef> {
        return {
            blockType: 'QUESTION',
            question: this.createDefaultTextQuestion()
        };
    }

    private createDefaultTextQuestion(): TextQuestionDef {
        return {
            questionType: 'TEXT',
            stableId: '',
            isRestricted: false,
            isDeprecated: false,
            promptTemplate: this.createBlankTemplate(),
            validations: [],
            hideNumber: false,
            inputType: 'TEXT',
            suggestionType: 'NONE',
            placeholderTemplate: null,
            suggestions: []
        };
    }

    private setCurrentBlock(block: FormBlockDef): void {
        this.currentBlockDefSubject.next(block);
    }

    public setSelectedBlockSubject(blockSubject: BehaviorSubject<FormBlockDef>): void {
        this.selectedBlockSubject = blockSubject;
        this.setCurrentBlock(blockSubject.value);
    }


    public updateCurrentBlock(block: QuestionBlockDef<TextQuestionDef>): void {
        Object.assign(this.currentBlockDefSubject.value, block);
        this.currentBlockDefSubject.next(this.currentBlockDefSubject.value);
        this.selectedBlockSubject.next(this.currentBlockDefSubject.value);
    }

    private createDefaultActivityDef(newStudyGuid: string, newActivityCode: string): ObservableActivityDef {
        const defaultSection = this.createDefaultSection();
        const basicDef: BasicActivityDef = {
            activityCode: newActivityCode,
            studyGuid: newStudyGuid,
            activityType: 'FORMS',
            formType: 'GENERAL',
            listStyleHint: 'NONE',
            maxInstancesPerUser: 1,
            allowOndemandTrigger: false,
            allowUnauthenticated: false,
            introduction: null,
            closing: null,
            displayOrder: 0,
            excludeFromDisplay: false,
            sections: [defaultSection],
            snapshotSubstitutionsOnSubmit: false,
            translatedDescriptions: [],
            translatedNames: [{ language: this.config.defaultLanguageCode, text: 'name' }],
            translatedSecondNames: [],
            translatedSubtitles: [],
            translatedSummaries: [],
            translatedTitles: [{ language: this.config.defaultLanguageCode, text: 'title' }],
            validations: [],
            versionTag: 'v1',
            writeOnce: false,
            mappings: []
        };
        return new ObservableActivityDef(basicDef);
    }

    private createDefaultSection(): FormSectionDef {
        return { blocks: [], icons: [], nameTemplate: null };
    }

    private createDefaultContentBlock(): ContentBlockDef {
        return {
            blockType: 'CONTENT',
            titleTemplate: null,
            bodyTemplate: this.createBlankTemplate()
        };
    }

    private createBlankTemplate(): Template {
        return {
            templateType: 'HTML',
            templateText: '$__template__',
            variables: [
                {
                    name: '__template__',
                    translations: [
                        {
                            language: 'en',
                            text: ''
                        }
                    ]
                }
            ]
        };
    }

    private buildDefaultActivityCode(): string {
        return 'ACTIVITY-' + (this.allActivityDefinitionsSubject.value.length + 1);
    }

}
