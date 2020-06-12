import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UserActivitiesDataSource } from '../../../../../ddp-sdk/src/lib/components/user/activities/userActivitiesDataSource';
import { BehaviorSubject } from 'rxjs';
import {
  ActivityInstance,
  ActivityResponse,
  CompositeDisposable,
  LoggingService,
  UserActivityServiceAgent,
  UserProfileDecorator,
  UserProfileServiceAgent
} from 'ddp-sdk';
import { ToolkitConfigurationService } from 'toolkit';

import { CREATED, IN_PROGRESS } from '../workflow-progress/workflow-progress';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: `app-dashboard`,
  styleUrls: ['./dashboard.scss'],
  template: `
    <div class="dashboard">
      <div class="page-padding">
        <h1 *ngIf="firstName"> {{ firstName }} <span translate>DashBoard.EnrollmentProcess</span></h1>
        <div class="workdir">
          <app-workflow-progress [steps]="steps"
                                 [instanceGuid]="instanceGuid"
                                 (onChangeActivity)="updateInstanceGuid($event)"></app-workflow-progress>
          <ddp-activity-redesigned [studyGuid]="studyGuid" [activityGuid]="instanceGuid"
                                   (submit)="setActivity($event)"></ddp-activity-redesigned>
        </div>
      </div>
    </div>
  `
})
export class DashBoardComponent implements OnInit, OnDestroy {
  public instanceGuid: string;
  public studyGuid: string;
  public steps: ActivityInstance[] = [];
  public dataSource: UserActivitiesDataSource;
  public firstName: string;
  private studyGuidObservable: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  public CREATED = CREATED;
  public IN_PROGRESS = IN_PROGRESS;
  private anchor;

  constructor(@Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService,
              private userActivity: UserActivityServiceAgent,
              private logger: LoggingService,
              private userAgent: UserProfileServiceAgent) {
  }

  public setActivity(data: ActivityResponse | null): void {
    if (data && data.instanceGuid) {
      this.updateInstanceGuid(data.instanceGuid);
      this.getSteps();
    }
  }

  public updateInstanceGuid(instanceGuid): void {
    this.instanceGuid = instanceGuid;
  }

  private getSteps(): void {
    if (this.anchor) {
      this.anchor.removeAll();
    }
    this.anchor = new CompositeDisposable();
    const useActivities = new UserActivitiesDataSource(
      this.userActivity,
      this.logger,
      this.studyGuidObservable)
      .connect()
      .subscribe((data: ActivityInstance[]) => {
        this.steps = data;
        let currentActivityIndex = data.findIndex((activity: ActivityInstance) => activity.statusCode === this.IN_PROGRESS);
        if (currentActivityIndex === -1) {
          currentActivityIndex = data.findIndex((activity: ActivityInstance) => activity.statusCode === this.CREATED);
          data[currentActivityIndex].statusCode = IN_PROGRESS;
        }
        if (currentActivityIndex === -1) {
          currentActivityIndex = data.length - 1;
        }
        this.updateInstanceGuid(this.steps[currentActivityIndex].instanceGuid);
      });
    this.anchor.addNew(useActivities);
  }

  public ngOnInit(): void {
    this.studyGuid = this.toolkitConfiguration.studyGuid;
    this.studyGuidObservable.next(this.studyGuid);
    this.userAgent.profile
      .pipe(filter((data: UserProfileDecorator) => !!data.profile), first())
      .subscribe((data: UserProfileDecorator) => this.firstName = data.profile.firstName);
    this.getSteps();
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }
}
