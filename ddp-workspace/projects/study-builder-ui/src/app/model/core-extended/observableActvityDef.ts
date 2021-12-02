import { FormSectionDef } from '../core/formSectionDef';
import { BasicActivityDef } from '../core/basicActivityDef';
import { BehaviorSubject, Observable } from 'rxjs';
import { Template } from '../core/template';
import { DateString } from '../core/dateString';
import { PexExpression } from '../core/pexExpression';
import { ListStyleHint } from '../core/listStyleHint';
import { Mapping } from '../core/mapping';
import { Translation } from '../core/translation';
import { ActivityValidation } from '../core/activityValidation';
import { ObservableFormSectionDef } from './observableFormSectionDef';
import { IdentifiableFormBlockDef } from './identifiableFormBlockDef';

export class ObservableActivityDef implements BasicActivityDef {
    // TODO: Can we make the subjects private?
    public sectionsSubjects: Array<BehaviorSubject<ObservableFormSectionDef>>;
    get sectionsObservables(): Array<Observable<ObservableFormSectionDef>> {
        return this.sectionsSubjects.map(subjs => subjs.asObservable());
    }
    set sections(observableSectionDefs: Array<ObservableFormSectionDef>) {
        this.sectionsSubjects = observableSectionDefs.map(def => new BehaviorSubject<ObservableFormSectionDef>(def));
    }
    get sections(): Array<ObservableFormSectionDef> {
        return this.sectionsSubjects.map(sectionSubj => sectionSubj.value);
    }
    activityCode: string;
    activityType: 'FORMS';
    allowOndemandTrigger: boolean;
    allowUnauthenticated: boolean;
    closing: FormSectionDef | null;
    creationExpr: PexExpression | null;
    displayOrder: number;
    editTimeoutSec: number | null;
    excludeFromDisplay: boolean;
    formType: 'GENERAL' | 'PREQUALIFIER';
    introduction: FormSectionDef | null;
    isFollowup: boolean;
    lastUpdated: DateString | null;
    lastUpdatedTextTemplate: Template | null;
    listStyleHint: ListStyleHint;
    mappings: Array<Mapping>;
    maxInstancesPerUser: number | null;
    readonlyHintTemplate: Template | null;
    snapshotSubstitutionsOnSubmit: boolean;
    studyGuid: string;
    translatedDescriptions: Array<Translation>;
    translatedNames: Array<Translation>;
    translatedSecondNames: Array<Translation>;
    translatedSubtitles: Array<Translation>;
    translatedSummaries: Array<Translation>;
    translatedTitles: Array<Translation>;
    validations: Array<ActivityValidation>;
    versionTag: string;
    writeOnce: boolean;

    constructor(public activityDef: BasicActivityDef) {
        this.activityCode = activityDef.activityCode;
        this.mappings = activityDef.mappings;
        this.activityType = activityDef.activityType;
        this.allowOndemandTrigger = activityDef.allowOndemandTrigger;
        this.allowUnauthenticated = activityDef.allowUnauthenticated;
        this.closing = activityDef.closing;
        this.displayOrder = activityDef.displayOrder;
        this.excludeFromDisplay = activityDef.excludeFromDisplay;
        this.formType = activityDef.formType;
        this.introduction = activityDef.introduction;
        this.listStyleHint = activityDef.listStyleHint;
        this.maxInstancesPerUser = activityDef.maxInstancesPerUser;
        this.snapshotSubstitutionsOnSubmit = activityDef.snapshotSubstitutionsOnSubmit;
        this.studyGuid = activityDef.studyGuid;
        this.translatedDescriptions = activityDef.translatedDescriptions;
        this.translatedNames = activityDef.translatedNames;
        this.translatedSecondNames = activityDef.translatedSecondNames;
        this.translatedSubtitles = activityDef.translatedSubtitles;
        this.translatedSummaries = activityDef.translatedSummaries;
        this.translatedTitles = activityDef.translatedTitles;
        this.validations = activityDef.validations;
        this.versionTag = activityDef.versionTag;
        this.writeOnce = activityDef.writeOnce;
    }
    public findBlockSubjectById(blockId: string): BehaviorSubject<IdentifiableFormBlockDef> | undefined {
        return this.sectionsSubjects
            .map(sectSubj => sectSubj.value.findBlockSubjectById(blockId))
            .find(block => !!block);
    }
}

