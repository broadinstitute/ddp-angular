import { Observable, of } from 'rxjs';
import { first, take, tap } from 'rxjs/operators';
import { ToolkitConfigurationService, WorkflowBuilderService } from 'toolkit';
import { CURRENT_ACTIVITY_ID_TOKEN, currentActivityIdProvider } from './providers';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivityInstance, ActivityResponse, UserActivityServiceAgent, SessionMementoService } from 'ddp-sdk';


@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss'],
  providers: [currentActivityIdProvider]
})
export class SurveyComponent implements OnInit, OnDestroy {
  studyGuid: string;
  instanceGuid: string;
  isActivityShown = true;
  isFetchingActivities = false;
  activities: ActivityInstance[];
  isWorkflowProgressShown = false;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly session: SessionMementoService,
    private readonly userActivities: UserActivityServiceAgent,
    private readonly workflowBuilder: WorkflowBuilderService,
    @Inject(CURRENT_ACTIVITY_ID_TOKEN) private readonly activityId$: Observable<string>,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService,
  ) {}

  ngOnInit(): void {
    this.setInstanceGuid();
    this.getActivities().pipe(take(1)).subscribe();
    this.studyGuid = this.toolkitConfiguration.studyGuid;
  }

  ngOnDestroy(): void {
    this.session.setParticipant(null);
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
    this.resetActivityComponent();
  }

  private getActivities(): Observable<ActivityInstance[]> {
    this.isFetchingActivities = true;

    return this.userActivities.getActivities(of(this.studyGuid)).pipe(
      tap(activities => {
        this.isFetchingActivities = false;

        if (!activities) {
          return;
        }

        this.activities = activities;
      })
    );
  }

  private resetActivityComponent(): void {
    this.isActivityShown = false;
    this.cdr.detectChanges();
    this.isActivityShown = true;
  }

  private setInstanceGuid(): void {
    this.activityId$.pipe(
      first(),
      tap((id: string) => this.instanceGuid = id)
    ).subscribe();
  }
}
