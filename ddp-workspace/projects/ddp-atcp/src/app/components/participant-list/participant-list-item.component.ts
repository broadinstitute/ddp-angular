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
import { RegistrationStatus } from '../../models/registration-status';

@Component({
  selector: 'app-participant-list-item',
  template: `
    <div class="participant-expandable">
      <div class="participant-expandable__header">
        <div style="display: flex; align-items: center; margin-right: auto;">
          <span class="participant-expandable__name">
            {{ participant.profile.firstName }}
            {{ participant.profile.lastName }}
          </span>

          <div *ngIf="participant.status">
            <span class="status">
              {{ 'EnrollmentStatus.Prefix' | translate }}
            </span>

            <ng-container *ngIf="isContactUsStatus; else simpleStatus">
              <app-tooltip-button
                style="margin-left: 4px; font-style: italic;"
                [message]="'EnrollmentStatus.ContactUsTooltip' | translate"
              >
                {{ enrollmentMessageKey | translate }}
              </app-tooltip-button>
            </ng-container>

            <ng-template #simpleStatus>
              <span class="status">{{ enrollmentMessageKey | translate }}</span>
            </ng-template>
          </div>
        </div>

        <span
          *ngIf="surveysToCompleteCount"
          class="participant-expandable__counter"
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
  private contactUsStatuses = [
    RegistrationStatus.NotEligible,
    RegistrationStatus.Duplicate,
  ];

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

  get enrollmentMessageKey(): string {
    const baseKey = 'EnrollmentStatus.Messages';

    switch (this.participant.status.status) {
      case RegistrationStatus.Registered:
        return `${baseKey}.Registered`;
      case RegistrationStatus.Consented:
        return `${baseKey}.Consented`;
      case RegistrationStatus.ConsentedNeedsAssent:
        return `${baseKey}.ConsentedNeedsAssent`;
      case RegistrationStatus.SubmittedPhysicianInfo:
        return `${baseKey}.SubmittedPhysicianInfo`;
      case RegistrationStatus.SubmittedMedicalHistory:
        return `${baseKey}.SubmittedMedicalHistory`;
      case RegistrationStatus.SubmittedGenomeStudyShippingInfo:
        return `${baseKey}.SubmittedGenomeStudyShippingInfo`;
      case RegistrationStatus.SubmittedEnrollment:
        return `${baseKey}.SubmittedEnrollment`;
      case RegistrationStatus.Enrolled:
        return `${baseKey}.Enrolled`;
      case RegistrationStatus.NotEligible:
      case RegistrationStatus.Duplicate:
        return `${baseKey}.ContactUs`;
    }
  }

  get isContactUsStatus(): boolean {
    return this.contactUsStatuses.includes(
      this.participant.status.status as RegistrationStatus,
    );
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
  };
}
