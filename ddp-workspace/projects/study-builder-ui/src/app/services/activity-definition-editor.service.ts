import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivityDef } from '../model/core/activityDef';
import { ConfigurationService } from '../configuration.service';
import { map, take, tap } from 'rxjs/operators';
import { FormBlockDef } from '../model/core/formBlockDef';
import { ObservableActivityDef } from '../model/core-extended/observableActvityDef';
import { IdentifiableFormBlockDef } from '../model/core-extended/identifiableFormBlockDef';
import { StudyConfigObjectFactory } from '../model/core-extended/studyConfigObjectFactory';
import { ActivityDefDao } from '../activity-def-dao.service';
import { isIdentifiable } from '../model/core-extended/typeChecker';


// @TODO: Scope this service to one instance per activity editor
@Injectable({
    providedIn: 'root'
})
export class ActivityDefinitionEditorService  {
    private currentActivityDefSubject = new BehaviorSubject<ObservableActivityDef | null>(null);
    readonly currentActivityDef$: Observable<ActivityDef | null> = this.currentActivityDefSubject.asObservable();

    // the subject for block that is being currently edited
    private currentBlockDefSubject = new BehaviorSubject<FormBlockDef | null>(null);
    readonly currentBlockDef$: Observable<FormBlockDef | null> = this.currentBlockDefSubject.asObservable();
    // the subject that contains block that has been selected in canvas
    private selectedBlockSubject: BehaviorSubject<FormBlockDef> | null;
    private factory: StudyConfigObjectFactory;

    constructor(private config: ConfigurationService, private dao: ActivityDefDao) {
        this.factory = new StudyConfigObjectFactory(config);
        this.currentActivityDef$.pipe(
            tap(() => this.currentBlockDefSubject.next(null)),
            tap(() => this.selectedBlockSubject = null)
    //        tap(activityOrNull => this.currentSectionDefSubject.next(activityOrNull ? activityOrNull.sections[0] : null))
        ).subscribe();
    }

    public setCurrentActivity(activity: ObservableActivityDef): void {
        this.currentActivityDefSubject.next(activity ? activity : null);
    }

    public setSelectedBlock(block: FormBlockDef): void {
        this.selectedBlockSubject = isIdentifiable(block) ? this.currentActivityDefSubject.value.findBlockSubjectById(block.id) : null;
        this.setCurrentBlock(this.selectedBlockSubject.value);
    }

    public updateCurrentBlock(block: FormBlockDef): void {
        Object.assign(this.currentBlockDefSubject.value, block);
        this.currentBlockDefSubject.next(this.currentBlockDefSubject.value);
        this.selectedBlockSubject.next(this.currentBlockDefSubject.value);
    }

    public createNewBlankActivityDefinition(studyGuid: string): Observable<ObservableActivityDef> {
        return this.buildDefaultActivityCode().pipe(
            map(activityCode => this.factory.createDefaultActivityDef(studyGuid, activityCode)),
            tap(newDef => this.dao.saveActivityDef(newDef)),
            tap(newDef => this.setCurrentActivity(newDef)));
    }

    // TODO: Can this be refactored so that new items added to palette to do not require editor to do anything/close this module
    public addBlankContentBlockToActivity(): void {
      this.addNewBlock(this.factory.createDefaultContentBlock());
    }

    public addBlankTextQuestionBlockToActivity(): void {
        this.addNewBlock(this.factory.createDefaultTextQuestionBlock());
    }

    private addNewBlock(newBlock: IdentifiableFormBlockDef): void {
        // TODO: refactor access to sectionSubjects when we dealing with multiple sections
        this.selectedBlockSubject = this.currentActivityDefSubject.value.sectionsSubjects[0].value.addBlock(newBlock);
        this.currentBlockDefSubject.next(newBlock);
    }

    private setCurrentBlock(block: FormBlockDef): void {
        this.currentBlockDefSubject.next(block);
    }

    private buildDefaultActivityCode(): Observable<string> {
        return this.dao.findAllActivityDefinitions('xx').pipe(
            take(1), // get around possibility of circular reference (we add new definitions and we get more of these)
            map(defs => 'ACTIVITY-' + (defs.length + 1)));
    }

}
