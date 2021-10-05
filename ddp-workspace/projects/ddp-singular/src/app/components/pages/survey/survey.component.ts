import { Observable, of } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { ToolkitConfigurationService, WorkflowBuilderService } from 'toolkit';
import { CurrentActivityService } from '../../../services/current-activity.service';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivityInstance, ActivityResponse, UserActivityServiceAgent, CompositeDisposable, SessionMementoService } from 'ddp-sdk';


@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss'],
})
export class SurveyComponent implements OnInit, OnDestroy {
  studyGuid: string;
  isReadonly: boolean;
  instanceGuid: string;
  isActivityShown = true;
  hasPreviousInstance: boolean;
  isFetchingActivities = false;
  activities: ActivityInstance[];
  isWorkflowProgressShown = false;

  private _anchor = new CompositeDisposable();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly session: SessionMementoService,
    private readonly currentActivity: CurrentActivityService,
    private readonly userActivities: UserActivityServiceAgent,
    private readonly workflowBuilder: WorkflowBuilderService,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService,
  ) {}

  ngOnInit(): void {
    this.studyGuid = this.toolkitConfiguration.studyGuid;
    const activity = this.currentActivity.activity$.getValue();

    if (!activity) {
      return;
    }

    this.getActivities().pipe(take(1)).subscribe();
    this.instanceGuid = activity.instance.instanceGuid;
    this.isReadonly = activity.isReadonly;
    this.hasPreviousInstance = !!activity.instance.previousInstanceGuid;
  }

  ngOnDestroy(): void {
    this.currentActivity.activity$.next(null);
    this.session.setParticipant(null);
    this._anchor.removeAll();
  }

  onSubmit(activityResponse: ActivityResponse): void {
    if (activityResponse && activityResponse.instanceGuid) {
      this.resetActivityComponent();

      this.instanceGuid = activityResponse.instanceGuid;
      this.getActivities().pipe(take(1)).subscribe();

      return;
    }

    this.workflowBuilder
      .getCommand(new ActivityResponse(activityResponse.next))
      .execute();
  }

  onChangeActivity(activity: ActivityInstance): void {
    this.instanceGuid = activity.instanceGuid;
    this.hasPreviousInstance = !!activity.previousInstanceGuid;
    this.resetActivityComponent();
  }

  private getActivities(): Observable<ActivityInstance[]> {
    this.isFetchingActivities = true;

    return this.userActivities.getActivities(of(this.studyGuid)).pipe(
      tap(activities => {
        this.isFetchingActivities = false;

        if (!activities) return;

        this.activities = activities;
      }),
    );
  }

  private resetActivityComponent(): void {
    this.isActivityShown = false;
    this.cdr.detectChanges();
    this.isActivityShown = true;
  }
}
