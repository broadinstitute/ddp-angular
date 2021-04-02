import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { mergeMap, take, tap } from 'rxjs/operators';

import {
  ActivityInstance,
  ActivityServiceAgent,
  AnnouncementMessage,
  AnnouncementsServiceAgent,
  ConfigurationService,
  UserActivityServiceAgent,
} from 'ddp-sdk';

import { CurrentActivityService } from '../../services/current-activity.service';
import { RoutePaths } from '../../router-resources';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  loading = false;
  messages: AnnouncementMessage[] = [];
  activities: ActivityInstance[] = [];

  constructor(
    private router: Router,
    private announcementsService: AnnouncementsServiceAgent,
    private userActivityService: UserActivityServiceAgent,
    private activityService: ActivityServiceAgent,
    private currentActivityService: CurrentActivityService,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onStartActivity(activity: ActivityInstance): void {
    this.setCurrentActivity(activity);
    this.redirectToActivity();
  }

  onContinueActivity(activity: ActivityInstance): void {
    this.setCurrentActivity(activity);
    this.redirectToActivity();
  }

  onEditActivity(activity: ActivityInstance): void {
    this.activityService
      .createInstance(this.config.studyGuid, activity.activityCode)
      .pipe(take(1))
      .subscribe(activity => {
        this.setCurrentActivity(activity as ActivityInstance);
        this.redirectToActivity();
      });
  }

  onViewActivity(activity: ActivityInstance): void {
    this.setCurrentActivity(activity, true);
    this.redirectToActivity();
  }

  private setCurrentActivity(
    activity: ActivityInstance,
    isReadonly = false,
  ): void {
    this.currentActivityService.activity$.next({
      instance: activity,
      isReadonly,
    });
  }

  private redirectToActivity(): void {
    this.router.navigateByUrl(RoutePaths.Survey);
  }

  private loadData(): void {
    this.loading = true;

    this.loadMessages()
      .pipe(
        tap(messages => (this.messages = messages)),
        mergeMap(() => this.loadActivities()),
      )
      .subscribe(activities => {
        this.activities = activities;
        this.loading = false;
      });
  }

  private loadMessages(): Observable<AnnouncementMessage[]> {
    return this.announcementsService
      .getMessages(this.config.studyGuid)
      .pipe(take(1));
  }

  private loadActivities(): Observable<ActivityInstance[]> {
    return this.userActivityService
      .getActivities(of(this.config.studyGuid))
      .pipe(take(1));
  }
}
