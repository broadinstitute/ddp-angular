import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import {
  ActivityInstance,
  ActivityResponse,
  UserActivityServiceAgent,
  UserProfileServiceAgent,
  WindowRef,
  ConfigurationService,
} from 'ddp-sdk';
import { WorkflowBuilderService } from 'toolkit';

import { CREATED, IN_PROGRESS } from '../workflow-progress/workflow-progress';
import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss'],
})
export class SurveyComponent implements OnInit {
  public instanceGuid: string;
  public studyGuid: string;
  public userFirstName: string;
  public activities: ActivityInstance[] = [];
  public isAssentActivity: boolean = false;
  public isActivityShown: boolean = true;

  constructor(
    private userActivityAgent: UserActivityServiceAgent,
    private userProfileAgent: UserProfileServiceAgent,
    private activityService: ActivityService,
    private windowRef: WindowRef,
    private cdr: ChangeDetectorRef,
    private workflowBuilder: WorkflowBuilderService,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    this.studyGuid = this.config.studyGuid;

    this.userProfileAgent.profile.pipe(take(1)).subscribe(data => {
      this.userFirstName = data.profile.firstName;
    });

    this.getActivities().subscribe(() => {
      const currentActivityInstanceGuid = this.activityService
        .currentActivityInstanceGuid;

      if (currentActivityInstanceGuid) {
        this.instanceGuid = currentActivityInstanceGuid;
        this.checkIfAssentByInstanceGuid(this.instanceGuid);
      } else {
        this.instanceGuid = this.findNextActivity();
        this.checkIfAssentByInstanceGuid(this.instanceGuid);
      }
    });
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
      this.resetComponent();

      this.getActivities().subscribe();
    } else {
      this.workflowBuilder.getCommand(activityResponse).execute();
    }
  }

  private getActivities(): Observable<ActivityInstance[]> {
    return this.userActivityAgent.getActivities(of(this.config.studyGuid)).pipe(
      take(1),
      tap(activities => {
        this.activities = activities;
      })
    );
  }

  private findNextActivity(): string {
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
    const activity = this.activities.find(activity => activity.instanceGuid === instanceGuid);

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
