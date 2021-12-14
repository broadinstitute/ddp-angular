import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';

import {
  ActivityInstance,
  ActivityInstanceGuid,
  ConfigurationService,
  UserActivityServiceAgent,
  LanguageService,
  CompositeDisposable,
  ActivityServiceAgent,
  UserStatusServiceAgent,
} from 'ddp-sdk';

import { ActivityCodes } from '../../sdk/constants/activityCodes';
import { ActivityService } from '../../services/activity.service';
import { RegistrationStatusService } from '../../services/registrationStatus.service';
import * as RouterResources from '../../router-resources';
import { WorkflowModel } from '../../models/workflow.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  activities: ActivityInstance[];
  status: WorkflowModel;
  isLoading = true;
  isUiBlocked = false;
  private anchor = new CompositeDisposable();

  constructor(
    private router: Router,
    private activityServiceAgent: ActivityServiceAgent,
    private languageService: LanguageService,
    private userActivityAgent: UserActivityServiceAgent,
    private activityService: ActivityService,
    private userStatusService: UserStatusServiceAgent,
    private registrationStatusService: RegistrationStatusService,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    this.activityService.setCurrentActivity(null);

    this.getParticipantInformation();

    this.anchor.addNew(
      this.languageService
        .getProfileLanguageUpdateNotifier()
        .pipe(skipWhile(value => value === null))
        .subscribe(() => {
          this.getParticipantInformation();
        }),
    );
  }

  ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  get isContactUsStatus(): boolean {
    return this.registrationStatusService.isContactUsStatus(this.status);
  }

  get enrollmentMessageKey(): string {
    return this.registrationStatusService.getEnrollmentMessageKey(this.status);
  }

  goToActivity(instanceGuid: string): void {
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

  private getParticipantInformation(): void {
    this.isLoading = true;

    forkJoin({
      status: this.userStatusService.getStatus(),
      activities: this.userActivityAgent
        .getActivities(of(this.config.studyGuid))
        .pipe(take(1)),
    }).subscribe(response => {
      this.status = this.registrationStatusService.findStatus(response.status);

      this.activities = response.activities.reduce((acc, activity) => {
        if (activity.activityCode === ActivityCodes.BLOOD_TYPE) {
          if (this.registrationStatusService.isEnrolled(this.status)) {
            acc.push(activity);
          }
        } else {
          acc.push(activity);
        }

        return acc;
      }, []);

      this.isLoading = false;
    });
  }

  private handleEditConsent(): void {
    this.isUiBlocked = true;

    this.activityServiceAgent
      .createInstance(this.config.studyGuid, ActivityCodes.CONSENT_EDIT)
      .pipe(take(1))
      .subscribe(activity => {
        this.handleActivityCreation(activity, true);
      });
  }

  private handleEditActivity(activityInstance: ActivityInstance): void {
    this.isUiBlocked = true;

    this.activityServiceAgent
      .createInstance(this.config.studyGuid, activityInstance.activityCode)
      .pipe(take(1))
      .subscribe(this.handleActivityCreation);
  }

  private handleActivityCreation = (
    activity: ActivityInstanceGuid,
    isConsentEditActivity = false,
  ): void => {
    this.isUiBlocked = false;
    this.activityService.setCurrentActivity(
      activity.instanceGuid,
      isConsentEditActivity,
    );
    this.router.navigateByUrl(RouterResources.Survey);
  }
}
