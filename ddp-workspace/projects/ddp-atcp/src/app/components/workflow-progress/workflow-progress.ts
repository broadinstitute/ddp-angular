import { Component, Input, OnChanges, Inject } from '@angular/core';
import { SessionMementoService, ConfigurationService, UserActivityServiceAgent, ActivityInstance } from 'ddp-sdk';
import { of } from 'rxjs';
import { take, filter } from 'rxjs/operators';

@Component({
  selector: 'app-workflow-progress',
  templateUrl: './workflow-progress.html',
  styleUrls: ['./workflow-progress.scss']
})
export class WorkflowProgressComponent implements OnChanges {
  @Input() public currentActivityCode: string;

  public steps: Array<{
    name: string;
    state: string;
    activityCodes: string[];
  }> = [];
  public states = {
    COMPLETE: 'Completed',
    CREATED: 'In Progress',
    empty: 'Not Started'
  };
  public shown = false;
  private readonly COMPLETE = 'COMPLETE';
  private readonly CREATED = 'CREATED';

  constructor(
    private session: SessionMementoService,
    private userActivities: UserActivityServiceAgent,
    @Inject('ddp.config') private configuration: ConfigurationService) {
  }

  public ngOnChanges(): void {
    if (this.currentActivityCode) {
      if (this.session.isAuthenticatedSession()) {
        this.setupRegisteredUserSteps();
      }
    }
  }

  private setupRegisteredUserSteps(): void {
    const studyGuid = this.configuration.studyGuid;
    this.userActivities.getActivities(of(studyGuid)).pipe(
      filter(x => x !== null),
      take(1)
    ).subscribe(activities => {
      this.useMainSurveySteps(activities);
    });
  }

  private useMainSurveySteps(activityInstances: Array<ActivityInstance>): void {
    this.steps = [
      // {
      //   name: 'WorkflowProgress.Registration',
      //   state: activityInstances[0].statusCode,
      //   activityCodes: [activityInstances[0].activityCode]
      // },
      {
        name: 'WorkflowProgress.Consent',
        state: activityInstances[0].statusCode,
        activityCodes: [activityInstances[0].activityCode]
      },
      // {
      //   name: 'WorkflowProgress.ContactingPhysician',
      //   state: 'empty',
      //   activityCodes: []
      // },
      // {
      //   name: 'WorkflowProgress.MedicalHistory',
      //   state: 'empty',
      //   activityCodes: []
      // },
      // {
      //   name: 'WorkflowProgress.GenomeStudy',
      //   state: 'empty',
      //   activityCodes: []
      // },
      // {
      //   name: 'WorkflowProgress.ReviewSubmission',
      //   state: 'empty',
      //   activityCodes: []
      // },
    ];
  }
}
