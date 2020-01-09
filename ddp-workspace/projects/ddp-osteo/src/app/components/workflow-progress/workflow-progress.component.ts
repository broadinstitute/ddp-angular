import { Component, Input, OnChanges, Inject } from '@angular/core';
import { WorkflowStep } from '../../models/workflowStep.model';
import { SessionMementoService, ConfigurationService, UserActivityServiceAgent, ActivityInstance } from 'ddp-sdk';
import { of } from 'rxjs';
import { take, filter } from 'rxjs/operators';

@Component({
  selector: 'app-workflow-progress',
  templateUrl: './workflow-progress.component.html',
  styleUrls: ['./workflow-progress.component.scss']
})
export class WorkflowProgressComponent implements OnChanges {
  // Receives current activity code to determine current step
  @Input() public currentActivityCode: string;
  // Receives visible sections count on the workflow start page,
  // to determine what workflow a user chose
  @Input() public workflowStartSectionsVisibility: number | null;
  public steps: Array<WorkflowStep> = [];
  public shown = false;
  private readonly LOVEDONE = 'LOVEDONE';
  private readonly COMPLETE = 'COMPLETE';

  constructor(
    private session: SessionMementoService,
    private userActivities: UserActivityServiceAgent,
    @Inject('ddp.config') private configuration: ConfigurationService) { }

  public ngOnChanges(): void {
    if (this.currentActivityCode) {
      if (this.session.isAuthenticatedSession()) {
        this.setupRegisteredUserSteps();
      } else {
        this.setupNewUserSteps();
      }
    }
  }

  public isCurrentStep(activities: Array<string>): boolean {
    return activities.includes(this.currentActivityCode);
  }

  private setupRegisteredUserSteps(): void {
    const studyGuid = this.configuration.studyGuid;
    this.userActivities.getActivities(of(studyGuid)).pipe(
      filter(x => x !== null),
      take(1)
    ).subscribe(activities => {
      if (activities.some(activity => activity.activityCode === this.LOVEDONE)) {
        this.useLovedOneSurveySteps(true);
      } else {
        this.useMainSurveySteps(true);
      }
      this.setStepsStatuses(activities);
      this.recalculateVisibility();
    });
  }

  private setupNewUserSteps(): void {
    if (this.workflowStartSectionsVisibility === null) {
      this.useWorkflowStartSteps();
    } else if (this.workflowStartSectionsVisibility === 1) {
      this.useLovedOneSurveySteps();
    } else if (this.workflowStartSectionsVisibility === 2) {
      this.useMainSurveySteps();
    }
    this.recalculateVisibility();
  }

  private setStepsStatuses(activityInstances: Array<ActivityInstance>): void {
    const completedActivityCodes = activityInstances
      .filter(activity => activity.statusCode === this.COMPLETE)
      .map(activity => activity.activityCode);
    this.steps.forEach(step => {
      if (step.activityCodes.some(activityCode => completedActivityCodes.includes(activityCode))) {
        step.isCompleted = true;
      }
    });
  }

  private recalculateVisibility(): void {
    this.shown = this.steps.some(step => step.activityCodes.includes(this.currentActivityCode));
  }

  private useWorkflowStartSteps(): void {
    this.steps = [
      { number: 1, name: 'WorkflowProgress.AboutYou', isCompleted: false, activityCodes: ['PREQUAL'] }
    ];
  }

  private useLovedOneSurveySteps(aboutYouStatus = false): void {
    this.steps = [
      { number: 1, name: 'WorkflowProgress.AboutYou', isCompleted: aboutYouStatus, activityCodes: ['PREQUAL'] },
      { number: 2, name: 'WorkflowProgress.Questionnaire', isCompleted: false, activityCodes: ['LOVEDONE'] }
    ];
  }

  private useMainSurveySteps(aboutYouStatus = false): void {
    this.steps = [
      { number: 1, name: 'WorkflowProgress.AboutYou', isCompleted: aboutYouStatus, activityCodes: ['PREQUAL'] },
      { number: 2, name: 'WorkflowProgress.Consent', isCompleted: false, activityCodes: ['CONSENT', 'CONSENT_ASSENT', 'PARENTAL_CONSENT'] },
      { number: 3, name: 'WorkflowProgress.MedicalRelease', isCompleted: false, activityCodes: ['RELEASE_SELF', 'RELEASE_MINOR'] },
      { number: 4, name: 'WorkflowProgress.Questionnaire', isCompleted: false, activityCodes: ['ABOUTYOU', 'ABOUTCHILD'] }
    ];
  }
}
