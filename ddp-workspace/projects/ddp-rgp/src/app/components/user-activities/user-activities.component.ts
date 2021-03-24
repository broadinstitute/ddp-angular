import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import {
  ActivityInstance,
  CompositeDisposable,
  ConfigurationService,
  UserActivityServiceAgent,
} from 'ddp-sdk';

import { ActivityStatusCode } from '../../constants/activity-status-code';
import { Routes } from '../../routes';

enum StatusIcon {
  CREATED = 'info',
  IN_PROGRESS = 'pending',
  COMPLETE = 'check_circle',
}

@Component({
  selector: 'app-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.scss'],
})
export class UserActivitiesComponent implements OnInit, OnDestroy {
  loading = false;
  activities: ActivityInstance[] = [];
  displayedColumns = ['name', 'summary', 'status', 'actions'];
  StatusIcon = StatusIcon;
  ActivityStatusCode = ActivityStatusCode;
  private subs = new CompositeDisposable();

  constructor(
    private router: Router,
    private userActivitiesService: UserActivityServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  ngOnDestroy(): void {
    this.subs.removeAll();
  }

  redirectToActivity(activity: ActivityInstance): void {
    const path = Routes.ActivityId.replace(':id', activity.instanceGuid);

    this.router.navigateByUrl(path);
  }

  private loadActivities(): void {
    this.loading = true;

    const sub = this.userActivitiesService
      .getActivities(of(this.config.studyGuid))
      .subscribe(activities => {
        this.activities = activities;
        this.loading = false;
      });

    this.subs.addNew(sub);
  }
}
