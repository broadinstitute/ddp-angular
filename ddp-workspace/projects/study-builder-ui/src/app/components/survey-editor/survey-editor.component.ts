import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { ActivityDef } from '../../model/activityDef';
import { ActivityDefinitionEditorService } from '../../services/activity-definition-editor.service';
import { map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionBlockDef } from '../../model/questionBlockDef';
import { QuestionDef } from '../../model/questionDef';
import { TextQuestionDef } from '../../model/textQuestionDef';
import { ObservableActivityDef } from '../../model/observableActvityDef';

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

  constructor(private editorService: ActivityDefinitionEditorService) {
    this.form = new FormGroup({
      activityCode: new FormControl('')
    });
    this.allActivities$ = this.studyGuid$.pipe(
      switchMap(studyGuid => editorService.findAllActivityDefinitions(studyGuid)),
      tap(allActivities => this.setCurrentActivity(allActivities.length ? allActivities[0] : null))
    );
    this.currentActivity$ = editorService.currentActivityDef$;
    this.currentActivity$.subscribe(activity => {
      console.log('The current activity: %o', activity);
      if (activity) {
      console.log("From app-survey-editor: %o", activity.sections[0].blocks
          .filter(b => b.blockType === 'QUESTION')
          .map(qb => (qb as QuestionBlockDef<TextQuestionDef>).question.inputType).toString());
    }
  });
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    const setCurrentFromFormAction$ = this.form.controls['activityCode'].valueChanges.pipe(
      withLatestFrom(this.allActivities$),
      map(([code, activities]) => activities
          .find(activity => activity?.activityCode === code)),
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

  public setCurrentActivity(activity: ObservableActivityDef | null): void {
    this.editorService.setCurrentActivity(activity);
  }

  createNewActivity(): void {
    this.studyGuid$.pipe(
      map(studyGuid => this.editorService.createNewBlankActivityDefinition(studyGuid)),
      tap(newDef => this.setCurrentActivity(newDef)),
      take(1)
    ).subscribe();

  }
}
