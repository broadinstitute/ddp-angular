import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

import {
  ActivityInstance,
  ConfigurationService,
  UserActivityServiceAgent,
} from 'ddp-sdk';

import { Route } from '../../../constants/route';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  loading = true;
  activities: ActivityInstance[] = [];

  constructor(
    private router: Router,
    private userActivityService: UserActivityServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    this.fetchActivities();
  }

  onStartActivity(activity: ActivityInstance): void {
    this.router.navigate([Route.Activity, activity.instanceGuid]);
  }

  onContinueActivity(activity: ActivityInstance): void {
    this.router.navigate([Route.Activity, activity.instanceGuid]);
  }

  onViewActivity(activity: ActivityInstance): void {
    this.router.navigate([Route.Activity, activity.instanceGuid]);
  }

  private fetchActivities(): void {
    this.loading = true;

    this.userActivityService
      .getActivities(of(this.config.studyGuid))
      .pipe(take(1))
      .subscribe(activities => {
        this.activities = activities;
        this.loading = false;
      });
  }
}
