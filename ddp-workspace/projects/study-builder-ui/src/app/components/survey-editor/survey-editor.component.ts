import { Component, OnInit } from '@angular/core';
import { merge, Observable, of } from 'rxjs';
import { ActivityDef } from '../../model/core/activityDef';
import { ActivityDefinitionEditorService } from '../../services/activity-definition-editor.service';
import { concatMap, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { ObservableActivityDef } from '../../model/core-extended/observableActvityDef';
import { ActivityDefDao } from '../../activity-def-dao.service';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
    selector: 'app-survey-editor',
    templateUrl: './survey-editor.component.html',
    styleUrls: ['./survey-editor.component.scss']
})
export class SurveyEditorComponent implements OnInit {
    public allActivities$: Observable<ObservableActivityDef[]>;
    public currentActivity$: Observable<ActivityDef | null>;

    // @TODO
    public studyGuid$ = of('Hello');
    readonly form: FormGroup;
    leftPanelWidth = '800px';

    constructor(private editorService: ActivityDefinitionEditorService, private dao: ActivityDefDao) {
        this.form = new FormGroup({
            activityCode: new FormControl('')
        });

        this.allActivities$ = this.studyGuid$.pipe(
            switchMap(studyGuid => dao.findAllActivityDefinitions(studyGuid)),
            tap((allActivities: Array<ObservableActivityDef>) => this.setCurrentActivity(allActivities.length ? allActivities[0] : null))
        );

        this.currentActivity$ = editorService.currentActivityDef$;
    }

    ngOnInit(): void {
        const setCurrentFromFormAction$ = this.form.controls['activityCode'].valueChanges.pipe(
            withLatestFrom(this.allActivities$),
            map(([code, activities]) => activities
                .find(activity => activity?.activityCode === code)),
            tap(activity => this.setCurrentActivity(activity ? activity : null))
        );
        const setFormCodeFromCurrentAction$ = this.currentActivity$.pipe(
            map(activity => activity ? activity.activityCode : ''),
            tap(code => this.form.controls['activityCode'].setValue(code, { emitEvent: false }))
        );

        merge(
            setCurrentFromFormAction$,
            setFormCodeFromCurrentAction$
        ).subscribe();
    }

    public setCurrentActivity(activity: ObservableActivityDef | null): void {
        this.editorService.setCurrentActivity(activity);
    }

    createNewActivity(): void {
        this.studyGuid$.pipe(
            concatMap(studyGuid => this.editorService.createNewBlankActivityDefinition(studyGuid)),
            take(1)
        ).subscribe();

    }

    onResizeEnd(event: ResizeEvent): void {
        this.leftPanelWidth = `${event.rectangle.width}px`;
    }
}
