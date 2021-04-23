import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivityDef } from '../model/activityDef';
import { BasicActivityDef } from '../model/basicActivityDef';
import { FormSectionDef } from '../model/formSectionDef';
import { ContentBlockDef } from '../model/contentBlockDef';
import { ConfigurationService } from '../configuration.service';
import { TestBostonConsent } from '../testdata/testbostonConsent';
import { TestBostonCovidSurvey } from '../testdata/testbostonCovidSurvey';
import { map } from 'rxjs/operators';
import { TextQuestionDef } from '../model/textQuestionDef';
import { Template } from '../model/template';
import { QuestionBlockDef } from '../model/questionBlockDef';
import { FormBlockDef } from '../model/formBlockDef';

// @TODO: Scope this service to one instance per activity editor
@Injectable({
    providedIn: 'root'
})
export class ActivityDefinitionEditorService  {
    private currentActivityDefSubject = new BehaviorSubject<ActivityDef | null>(null);
    readonly currentActivityDef$: Observable<ActivityDef | null> = this.currentActivityDefSubject.asObservable();
    private allActivityDefinitionsSubject = new BehaviorSubject<Array<ActivityDef>>([TestBostonConsent, TestBostonCovidSurvey]);
    readonly allActivityDefinitions$ = this.allActivityDefinitionsSubject.asObservable();
    private currentBlockDefSubject = new BehaviorSubject<FormBlockDef | null>(null);
    readonly currentBlockDef$: Observable<FormBlockDef | null> = this.currentBlockDefSubject.asObservable();

    constructor(private config: ConfigurationService) {


    }

    // @TODO: Move this to a persistence service when the time comes
    findAllActivityDefinitions(studyGuid: string): Observable<Array<ActivityDef>> {
        return this.allActivityDefinitions$;
    }

    findActivityDefinition(studyGuid: string, activityCode: string): Observable<ActivityDef | null> {
        return this.findAllActivityDefinitions(activityCode).pipe(
            map(defs => {
                const foundDef = defs.find(def => def.activityCode === activityCode);
                return foundDef ? foundDef : null;
            })
        );

    }

    createDefaultActivityDef(newStudyGuid: string, newActivityCode: string): BasicActivityDef {
        const defaultSection = this.createDefaultSection();
        return {
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


    createNewBlankActivityDefinition(studyGuid: string): BasicActivityDef {
        const newDef = this.createDefaultActivityDef(studyGuid, this.buildDefaultActivityCode());
        this.allActivityDefinitionsSubject.next(this.allActivityDefinitionsSubject.value.concat(newDef));
        this.currentActivityDefSubject.next(newDef);
        return newDef;
    }

    setCurrentActivity(activity: ActivityDef): void {
        this.currentActivityDefSubject.next(activity);
    }
    public addBlankContentBlock(): void {
      this.addNewBlock(this.createDefaultContentBlock());
    }
    public addBlankTextQuestionBlock(): void {
        this.addNewBlock(this.createDefaultTextQuestionBlock());
    }

    private addNewBlock(newBlock: FormBlockDef): void {
        const activityToUpdate = this.currentActivityDefSubject.getValue();
        activityToUpdate?.sections[0].blocks.push(newBlock);
        this.currentActivityDefSubject.next(activityToUpdate);
        this.currentBlockDefSubject.next(newBlock);
    }

    private createDefaultTextQuestionBlock(): QuestionBlockDef {
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

    setCurrentBlock(block: FormBlockDef): void {
        this.currentBlockDefSubject.next(block);
    }


}
