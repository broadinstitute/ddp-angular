import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';

import {
  ActivityInstance,
  ActivityInstanceGuid,
  ConfigurationService,
  UserActivityServiceAgent,
  LanguageService,
  CompositeDisposable,
  ActivityServiceAgent,
} from 'ddp-sdk';

import { ActivityCodes } from '../../sdk/constants/activityCodes';
import { ActivityService } from '../../services/activity.service';
import * as RouterResources from '../../router-resources';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  activities: ActivityInstance[];
  isLoading = true;
  private anchor = new CompositeDisposable();

  constructor(
    private router: Router,
    private activityServiceAgent: ActivityServiceAgent,
    private languageService: LanguageService,
    private userActivityAgent: UserActivityServiceAgent,
    private activityService: ActivityService,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    this.activityService.setCurrentActivity(null);

    this.getActivities();

    this.anchor.addNew(
      this.languageService
        .getProfileLanguageUpdateNotifier()
        .pipe(skipWhile(value => value === null))
        .subscribe(() => {
          this.isLoading = true;
          this.getActivities();
        }),
    );
  }

  ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  getActivities(): void {
    this.userActivityAgent
      .getActivities(of(this.config.studyGuid))
      .pipe(take(1))
      .subscribe(activities => {
        this.activities = activities;
        this.isLoading = false;
      });
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

  private handleEditConsent(): void {
    this.activityServiceAgent
      .createInstance(this.config.studyGuid, ActivityCodes.CONSENT_EDIT)
      .pipe(take(1))
      .subscribe(activity => {
        this.handleActivityCreation(activity, true);
      });
  }

  private handleEditActivity(activityInstance: ActivityInstance): void {
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
