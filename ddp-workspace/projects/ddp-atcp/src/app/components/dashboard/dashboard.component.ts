import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';

import {
  ActivityInstance,
  ConfigurationService,
  UserActivityServiceAgent,
  LanguageService,
  CompositeDisposable,
} from 'ddp-sdk';

import { ActivityService } from '../../services/activity.service';
import * as RouterResources from '../../router-resources';

@Component({
  selector: 'atcp-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  activities: ActivityInstance[];
  isLoading: boolean = true;
  private anchor = new CompositeDisposable();

  constructor(
    private router: Router,
    private languageService: LanguageService,
    private userActivityAgent: UserActivityServiceAgent,
    private activityService: ActivityService,
    @Inject('ddp.config') private config: ConfigurationService
  ) {}

  ngOnInit(): void {
    this.activityService.currentActivityInstanceGuid = null;

    this.getActivities();

    this.anchor.addNew(
      this.languageService
        .getProfileLanguageUpdateNotifier()
        .pipe(skipWhile(value => value === null))
        .subscribe(() => {
          this.isLoading = true;
          this.getActivities();
        })
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

  onStartActivity(instanceGuid: string): void {
    this.activityService.currentActivityInstanceGuid = instanceGuid;
    this.router.navigateByUrl(RouterResources.Survey);
  }

  onContinueActivity(instanceGuid: string): void {
    this.activityService.currentActivityInstanceGuid = instanceGuid;
    this.router.navigateByUrl(RouterResources.Survey);
  }

  onViewActivity(instanceGuid: string): void {
    this.activityService.currentActivityInstanceGuid = instanceGuid;
    this.router.navigateByUrl(RouterResources.Survey);
  }
}
