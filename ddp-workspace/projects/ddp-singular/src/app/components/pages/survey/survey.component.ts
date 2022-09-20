import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { first, take, tap } from 'rxjs/operators';

import { ToolkitConfigurationService, WorkflowBuilderService } from 'toolkit';
import {
  CURRENT_ACTIVITY_ID_TOKEN,
  CURRENT_PARTICIPANT_ID_TOKEN,
  currentActivityIdProvider,
  currentParticipantIdProvider,
} from './providers';
import { ActivityInstance, ActivityResponse, UserActivityServiceAgent, SessionMementoService } from 'ddp-sdk';
import { getRenderActivities, isConsentActivity, RenderActivityKey } from '../../../utils';
import { ActivityCode } from '../../../constants/activity-code';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss'],
  providers: [currentActivityIdProvider, currentParticipantIdProvider],
})
export class SurveyComponent implements OnInit, OnDestroy {
  studyGuid: string;
  instanceGuid: string;
  isFetchingActivities = false;
  activities: ActivityInstance[];

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly session: SessionMementoService,
    private readonly sessionService: SessionMementoService,
    private readonly workflowBuilder: WorkflowBuilderService,
    private readonly userActivities: UserActivityServiceAgent,
    @Inject(CURRENT_ACTIVITY_ID_TOKEN) private readonly activityId$: Observable<string>,
    @Inject(CURRENT_PARTICIPANT_ID_TOKEN) private readonly participantId$: Observable<string>,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService,
  ) {}

  ngOnInit(): void {
    this.setInstanceGuid();
    this.setParticipantGuid();
    this.getActivities().pipe(take(1)).subscribe();
    this.studyGuid = this.toolkitConfiguration.studyGuid;
  }

  ngOnDestroy(): void {
    this.session.setParticipant(null);
  }

  preventSubmitByShiftEnter(event: KeyboardEvent): void {
    event.preventDefault();
  }

  onSubmit(activityResponse: ActivityResponse): void {
    if (!activityResponse) {
      return;
    }

    setTimeout(() => {
      if (activityResponse.instanceGuid) {
        this.instanceGuid = activityResponse.instanceGuid;
        this.getActivities().pipe(take(1)).subscribe();
      }
      this.workflowBuilder.getCommand(activityResponse).execute();
    });
  }

  get shouldHideProgressBar(): boolean {
    const { activityCode } = this.getCurrentActivity() ?? {};
    return isConsentActivity(activityCode) || (activityCode === ActivityCode.ChildContact);
  }

  get isLastOfMultipleActivities(): boolean {
    if (this.activities.length <= 1) {
      return false;
    }

    const currentActivity = this.getCurrentActivity();

    const renderedActivities = getRenderActivities(this.instanceGuid, this.activities);
    const lastRenderedActivity = renderedActivities[renderedActivities.length - 1];

    return RenderActivityKey[lastRenderedActivity.i18nKey] === currentActivity.activityCode;
  }

  private getActivities(): Observable<ActivityInstance[]> {
    this.isFetchingActivities = true;

    return this.userActivities.getActivities(of(this.toolkitConfiguration.studyGuid)).pipe(
      tap(activities => {
        this.isFetchingActivities = false;

        if (!activities) {
          return;
        }

        this.activities = activities;
      }),
    );
  }

  private setInstanceGuid(): void {
    this.activityId$
      .pipe(
        first(),
        tap((id: string) => (this.instanceGuid = id)),
      )
      .subscribe();
  }

  private setParticipantGuid(): void {
    this.participantId$
      .pipe(
        first(),
        tap((participantGuid: string) => this.sessionService.setParticipant(participantGuid)),
      )
      .subscribe();
  }

  private getCurrentActivity(): ActivityInstance | undefined {
    const [current] = this.activities?.filter(({ instanceGuid }) => this.instanceGuid === instanceGuid) ?? [];

    return current;
  }
}
