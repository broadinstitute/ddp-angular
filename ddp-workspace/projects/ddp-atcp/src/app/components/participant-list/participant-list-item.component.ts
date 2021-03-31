import { Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import {
  ActivityInstance,
  ActivityServiceAgent,
  ConfigurationService,
  SessionMementoService,
  ActivityInstanceGuid,
} from 'ddp-sdk';

import { ActivityCodes } from '../../sdk/constants/activityCodes';
import { COMPLETE } from '../workflow-progress/workflow-progress';
import { ActivityService } from '../../services/activity.service';
import * as RouterResources from '../../router-resources';
import { Participant } from './participant-list.component';

@Component({
  selector: 'app-participant-list-item',
  template: `
    <div class="participant-expandable">
      <div class="participant-expandable__header">
        <span class="participant-expandable__name">
          {{ participant.profile.firstName }} {{ participant.profile.lastName }}
        </span>

        <span
          *ngIf="surveysToCompleteCount"
          class="participant-expandable__status"
        >
          <ng-container
            *ngIf="surveysToCompleteCount === 1; else pluralSurveyCount"
          >
            {{
              'SDK.UserActivities.SurveysToComplete.Singular'
                | translate: { count: surveysToCompleteCount }
            }}
          </ng-container>

          <ng-template #pluralSurveyCount>
            {{
              'SDK.UserActivities.SurveysToComplete.Plural'
                | translate: { count: surveysToCompleteCount }
            }}
          </ng-template>
        </span>

        <button
          class="participant-expandable__control"
          (click)="expanded = !expanded"
        >
          <span>{{ 'Common.Buttons.Expand.Title' | translate }}</span>
        </button>
      </div>

      <div *ngIf="expanded" class="participant-expandable__activities">
        <app-user-activities
          [activities]="participant.activities"
          [opaque]="true"
          (startActivity)="onStartActivity($event)"
          (continueActivity)="onStartActivity($event)"
          (viewActivity)="onStartActivity($event)"
          (editActivity)="onEditActivity($event)"
        ></app-user-activities>
      </div>
    </div>
  `,
  styleUrls: ['./participant-list-item.component.scss'],
})
export class ParticipantListItem {
  @Input() participant: Participant;

  expanded = false;

  constructor(
    private router: Router,
    private session: SessionMementoService,
    private activityServiceAgent: ActivityServiceAgent,
    private activityService: ActivityService,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  get surveysToCompleteCount(): number {
    return this.participant.activities.filter(
      activity => activity.statusCode !== COMPLETE,
    ).length;
  }

  onStartActivity(instanceGuid: string): void {
    this.session.setParticipant(this.participant.guid);
    this.activityService.setCurrentActivity(instanceGuid);

    this.router.navigateByUrl(RouterResources.Survey);
  }

  onEditActivity(activityInstance: ActivityInstance): void {
    const activityCode = activityInstance.activityCode;

    switch (activityCode) {
      case ActivityCodes.CONSENT:
        return this.handleEditConsent();
      case ActivityCodes.REGISTRATION:
      case ActivityCodes.CONTACTING_PHYSICIAN:
      case ActivityCodes.MEDICAL_HISTORY:
      case ActivityCodes.GENOME_STUDY:
      case ActivityCodes.FEEDING:
      case ActivityCodes.BLOOD_TYPE:
        return this.handleEditActivity(activityInstance);
      default:
        break;
    }
  }

  private handleEditConsent(): void {
    this.session.setParticipant(this.participant.guid);

    this.activityServiceAgent
      .createInstance(this.config.studyGuid, ActivityCodes.CONSENT_EDIT)
      .pipe(take(1))
      .subscribe(activity => {
        this.handleActivityCreation(activity, true);
      });
  }

  private handleEditActivity(activityInstance: ActivityInstance): void {
    this.session.setParticipant(this.participant.guid);

    this.activityServiceAgent
      .createInstance(this.config.studyGuid, activityInstance.activityCode)
      .pipe(take(1))
      .subscribe(this.handleActivityCreation);
  }

  private handleActivityCreation = (
    activity: ActivityInstanceGuid,
    isConsentEditActivity: boolean = false,
  ): void => {
    this.activityService.setCurrentActivity(
      activity.instanceGuid,
      isConsentEditActivity,
    );
    this.router.navigateByUrl(RouterResources.Survey);
  }
}
