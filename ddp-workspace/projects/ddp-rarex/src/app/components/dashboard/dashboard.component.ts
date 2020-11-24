import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import {
  ActivityInstance,
  ActivityServiceAgent,
  ConfigurationService,
  UserActivityServiceAgent,
} from 'ddp-sdk';

import { ActivityCodes } from '../../constants/activity-codes';
import { ActivityStatusCodes } from '../../constants/activity-status-codes';
import { CurrentActivityService } from '../../services/current-activity.service';
import { RoutePaths } from '../../router-resources';

@Component({
  selector: 'rarex-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class RarexDashboardComponent implements OnInit {
  isLoading = false;
  displayedColumns = [
    'activityName',
    'activitySummary',
    'activityCreatedAt',
    'activityStatus',
    'activityActions',
  ];
  activityStatusCodes = ActivityStatusCodes;
  activities: ActivityInstance[];

  constructor(
    private router: Router,
    private activityService: ActivityServiceAgent,
    private currentActivityService: CurrentActivityService,
    private userActivityServiceAgent: UserActivityServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService
  ) {}

  ngOnInit(): void {
    this.getActivities();
  }

  shouldShowQuestionCount(activity: ActivityInstance): boolean {
    const questionCount = activity.numQuestions;
    const answeredQuestionCount = activity.numQuestionsAnswered;

    if (this.isConsentOrAssent(activity)) {
      return false;
    }

    return questionCount !== answeredQuestionCount;
  }

  canCopyActivity(activity: ActivityInstance): boolean {
    return !this.isConsentOrAssent(activity);
  }

  goToActivity(activity: ActivityInstance): void {
    this.currentActivityService.activity$.next({
      instance: activity,
      isReadonly: false,
    });
    this.router.navigateByUrl(RoutePaths.Survey);
  }

  onViewClick(activity: ActivityInstance): void {
    this.currentActivityService.activity$.next({
      instance: activity,
      isReadonly: true,
    });
    this.router.navigateByUrl(RoutePaths.Survey);
  }

  onEditClick(activity: ActivityInstance): void {
    this.activityService
      .createInstance(this.config.studyGuid, activity.activityCode)
      .pipe(take(1))
      .subscribe(activity => {
        // Do something after creating new activity
      });
  }

  private isConsentOrAssent(activity: ActivityInstance): boolean {
    const activityCode = activity.activityCode;

    return (
      activityCode === ActivityCodes.CONSENT ||
      activityCode === ActivityCodes.CONSENT_ASSENT
    );
  }

  private getActivities(): void {
    this.isLoading = true;

    this.userActivityServiceAgent
      .getActivities(of(this.config.studyGuid))
      .pipe(
        take(1),
        tap(() => {
          this.isLoading = false;
        })
      )
      .subscribe(activities => {
        this.activities = activities;
      });
  }
}
