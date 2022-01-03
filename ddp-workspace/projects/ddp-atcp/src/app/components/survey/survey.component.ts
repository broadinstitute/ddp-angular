import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import {
  ActivityInstance,
  ActivityResponse,
  UserActivityServiceAgent,
  UserProfileServiceAgent,
  WindowRef,
  ConfigurationService,
  CompositeDisposable,
} from 'ddp-sdk';
import { WorkflowBuilderService } from 'toolkit';

import { ActivityService } from '../../services/activity.service';
import { MultiGovernedUserService } from '../../services/multi-governed-user.service';
import { CREATED, IN_PROGRESS } from '../workflow-progress/workflow-progress';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss'],
})
export class SurveyComponent implements OnInit, OnDestroy {
  public instanceGuid: string;
  public studyGuid: string;
  public userFirstName: string;
  public activities: ActivityInstance[] = [];
  public isAssentActivity = false;
  public isConsentEditActivity = false;
  public isActivityShown = true;

  private anchor = new CompositeDisposable();
  private isFirstRun = true;
  private fetchActivities$ = new Subject<void>();

  constructor(
    private multiGovernedUserService: MultiGovernedUserService,
    private userActivityAgent: UserActivityServiceAgent,
    private userProfileAgent: UserProfileServiceAgent,
    private activityService: ActivityService,
    private windowRef: WindowRef,
    private cdr: ChangeDetectorRef,
    private workflowBuilder: WorkflowBuilderService,
    @Inject('ddp.config') private config: ConfigurationService
  ) {}

  ngOnInit(): void {
    this.studyGuid = this.config.studyGuid;

    this.fetchUsername();
    this.setupActivitiesListener();

    this.fetchActivities$.next();
  }

  ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  public onChangeActivity(activity: ActivityInstance): void {
    if (this.instanceGuid !== activity.instanceGuid) {
      this.isAssentActivity = activity.activityCode === 'ASSENT';
      this.instanceGuid = activity.instanceGuid;
      this.resetComponent();
    }
  }

  public onSubmit(activityResponse: ActivityResponse): void {
    if (activityResponse && activityResponse.instanceGuid) {
      this.instanceGuid = activityResponse.instanceGuid;
      this.checkIfAssentByInstanceGuid(this.instanceGuid);
      this.resetComponent();

      this.fetchActivities$.next();
    } else {
      this.workflowBuilder.getCommand(activityResponse).execute();
    }
  }

  private fetchUsername(): void {
    this.userProfileAgent.profile.pipe(take(1)).subscribe(data => {
      this.userFirstName = data.profile.firstName;
    });
  }

  private setupActivitiesListener(): void {
    this.anchor.addNew(
      this.fetchActivities$
        .pipe(
          switchMap(() => this.getActivities()),
          tap(activities => {
            this.activities = activities;
          }),
          tap(() => {
            if (this.isFirstRun) {
              this.checkCurrentActivity();
              this.isFirstRun = false;
            }
          })
        )
        .subscribe()
    );
  }

  private checkCurrentActivity(): void {
    const currentActivity = this.activityService.currentActivity;

    if (currentActivity && currentActivity.instanceGuid) {
      this.instanceGuid = currentActivity.instanceGuid;
      this.isConsentEditActivity = currentActivity.isConsentEdit;
      this.checkIfAssentByInstanceGuid(this.instanceGuid);
    } else {
      this.instanceGuid = this.findNextActivity();

      if (!this.instanceGuid) {
        this.multiGovernedUserService.navigateToDashboard();
      }

      this.checkIfAssentByInstanceGuid(this.instanceGuid);
    }
  }

  private getActivities(): Observable<ActivityInstance[]> {
    return this.userActivityAgent.getActivities(of(this.config.studyGuid));
  }

  private findNextActivity(): string | null {
    if (!this.activities.length) {
      return null;
    }

    const inProgressActivity = this.activities.find(
      activity => activity.statusCode === IN_PROGRESS
    );

    if (inProgressActivity) {
      return inProgressActivity.instanceGuid;
    }

    const createdActivity = this.activities.find(
      activity => activity.statusCode === CREATED
    );

    if (createdActivity) {
      return createdActivity.instanceGuid;
    }

    return this.activities[this.activities.length - 1].instanceGuid;
  }

  private checkIfAssentByInstanceGuid(instanceGuid: string): void {
    const activity = this.activities.find(
      a => a.instanceGuid === instanceGuid
    );

    if (activity) {
      this.isAssentActivity = activity.activityCode === 'ASSENT';
    }
  }

  private resetComponent(): void {
    this.isActivityShown = false;

    this.cdr.detectChanges();

    this.isActivityShown = true;

    // need to scroll to top after done! This is more visible in mobile
    this.windowRef.nativeWindow.scrollTo(0, 0);
  }
}
