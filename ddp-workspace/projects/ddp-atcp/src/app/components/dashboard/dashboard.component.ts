import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

import {
  ActivityInstance,
  ConfigurationService,
  UserActivityServiceAgent,
} from 'ddp-sdk';

import { ActivityService } from '../../services/activity.service';
import * as RouterResources from '../../router-resources';

@Component({
  selector: 'atcp-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  activities: ActivityInstance[];
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private userActivityAgent: UserActivityServiceAgent,
    private activityService: ActivityService,
    @Inject('ddp.config') private config: ConfigurationService
  ) {}

  ngOnInit(): void {
    this.activityService.currentActivityInstanceGuid = null;

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
