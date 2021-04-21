import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { ActivityDef } from '../model/activityDef';
import { ActivityDefinitionEditorService } from '../services/activity-definition-editor.service';
import { map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-survey-editor',
  templateUrl: './survey-editor.component.html',
  styleUrls: ['./survey-editor.component.scss']
})
export class SurveyEditorComponent implements OnInit {
  public allActivities$: Observable<ActivityDef[]>;
  private currentActivitySubject = new BehaviorSubject<ActivityDef | null>(null);
  public currentActivity$ = this.currentActivitySubject.asObservable();

  //@TODO
  public studyGuid$ = of('Hello');
  readonly form: FormGroup;

  constructor(private editorService: ActivityDefinitionEditorService) {
    this.form = new FormGroup({
      activityCode: new FormControl('')
    });
    this.allActivities$ = this.studyGuid$.pipe(
      switchMap(studyGuid => editorService.findAllActivityDefinitions(studyGuid)),
      tap(allActivities => this.setCurrentActivity(allActivities.length ? allActivities[0] : null))
    );

    this.currentActivity$.subscribe(activity => console.log('The current activity: %o', activity));
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    const setCurrentFromFormAction$ =this.form.controls['activityCode'].valueChanges.pipe(
      withLatestFrom(this.allActivities$),
      map(([code, activities]) => activities.find(activity => activity.activityCode === code)),
      tap(activity => this.setCurrentActivity(activity ? activity : null))
    );
    const setFormCodeFromCurrentAction$ = this.currentActivity$.pipe(
      map(activity => activity ? activity.activityCode : ''),
      tap(code => this.form.controls['activityCode'].setValue(code, {emitEvent: false}))
    );

    merge(
      setCurrentFromFormAction$,
      setFormCodeFromCurrentAction$
      ).subscribe();
  }

  setCurrentActivity(activity: ActivityDef | null): void {
    this.currentActivitySubject.next(activity);
  }

  createNewActivity() {
    console.log("create new activity called");
    this.studyGuid$.pipe(
      map(studyGuid => this.editorService.createNewBlankActivityDefinition(studyGuid)),
      tap(newDef => this.setCurrentActivity(newDef)),
      take(1)
    ).subscribe();

  }
}
