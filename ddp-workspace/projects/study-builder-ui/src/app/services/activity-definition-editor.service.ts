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

// @TODO: Scope this service to one instance per activity editor
@Injectable({
  providedIn: 'root'
})
export class ActivityDefinitionEditorService {
  private activityDefSubject = new BehaviorSubject<ActivityDef | null>(null);
  readonly activityDef$: Observable<ActivityDef | null> = this.activityDefSubject.asObservable();
  private allActivityDefinitionsSubject = new BehaviorSubject<Array<ActivityDef>>([TestBostonConsent, TestBostonCovidSurvey]);
  readonly allActivityDefinitions$ = this.allActivityDefinitionsSubject.asObservable();
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
      bodyTemplate: {
        templateType: 'HTML',
        templateText: '$__template__',
        variables: [
          {
            name: '__template__',
            translations: [
              {
                language: 'en',
                text: '...content here'
              }
            ]
          }
        ]
      }
    };
  }

  private buildDefaultActivityCode(): string {
      return 'ACTIVITY-' + (this.allActivityDefinitionsSubject.value.length + 1);
  }


  createNewBlankActivityDefinition(studyGuid: string): BasicActivityDef {
    const newDef = this.createDefaultActivityDef(studyGuid, this.buildDefaultActivityCode());
    this.allActivityDefinitionsSubject.next(this.allActivityDefinitionsSubject.value.concat(newDef));
    return newDef;
  }
}
