import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UserActivitiesDataSource } from '../../../../../ddp-sdk/src/lib/components/user/activities/userActivitiesDataSource';
import { BehaviorSubject } from 'rxjs';
import {
  ActivityInstance,
  ActivityResponse,
  CompositeDisposable,
  LoggingService,
  UserActivityServiceAgent,
  UserProfileDecorator,
  UserProfileServiceAgent, WindowRef
} from 'ddp-sdk';
import {ToolkitConfigurationService, WorkflowBuilderService} from 'toolkit';

import { CREATED, IN_PROGRESS } from '../workflow-progress/workflow-progress';
import { filter, first } from 'rxjs/operators';

const ASSENT = 'ASSENT';

@Component({
  selector: `app-dashboard`,
  styleUrls: ['./dashboard.scss'],
  template: `
    <div class="dashboard">
      <div class="page-padding">
        <h1 *ngIf="firstName"> {{ firstName }}'s <span translate>DashBoard.EnrollmentProcess</span></h1>
        <div class="workdir" [ngClass]="{'is-assets' : isAssetsActivity}">
          <app-workflow-progress [steps]="steps"
                                 [instanceGuid]="instanceGuid"
                                 (onChangeActivity)="updateInstanceGuid($event)"></app-workflow-progress>
          <ddp-activity-redesigned *ngIf="showActivity" [studyGuid]="studyGuid"
                                   [buttonWithArrow]="true"
                                   [activityGuid]="instanceGuid"
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
  public showActivity = true;
  public isAssetsActivity = false;
  public CREATED = CREATED;
  public IN_PROGRESS = IN_PROGRESS;
  private anchor;

  constructor(@Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService,
              private userActivity: UserActivityServiceAgent,
              private logger: LoggingService,
              private userAgent: UserProfileServiceAgent,
              private windowRef: WindowRef,
              private cdr: ChangeDetectorRef,
              private workflowBuilder: WorkflowBuilderService) {
  }

  public setActivity(activityResposne: ActivityResponse | null): void {
    if (activityResposne && activityResposne.instanceGuid) {
      this.updateInstanceGuid(activityResposne);
      this.getSteps();
    } else {
      this.workflowBuilder.getCommand(new ActivityResponse(activityResposne.next)).execute();
    }
  }

  public updateInstanceGuid(activity: ActivityInstance | ActivityResponse): void {
     if (this.instanceGuid !== activity.instanceGuid) {
        this.isAssetsActivity = activity.activityCode === ASSENT;
        this.instanceGuid = activity.instanceGuid;
        this.resetActivityComponent();
     }
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

          // data[currentActivityIndex].statusCode = IN_PROGRESS;

          //  TODO: temporary code instead line 92 until "personal information" will be implemented
          currentActivityIndex !== -1
            ? data[currentActivityIndex].statusCode = IN_PROGRESS
            : currentActivityIndex = 6;
        }
        if (currentActivityIndex === -1) {
          currentActivityIndex = data.length - 1;
        }
        this.updateInstanceGuid(this.steps[currentActivityIndex]);
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

  // force the activity component to reset it by removing and adding it again
  private resetActivityComponent(): void {
    this.showActivity = false;
    this.cdr.detectChanges();
    this.showActivity = true;
    // need to scroll to top after done! This is more visible in mobile
    this.windowRef.nativeWindow.scrollTo(0, 0);
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }
}
